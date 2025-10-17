import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import ICAL from 'ical.js'
import {
  type Calendar,
  type Event,
  fetchCalendar,
  parseCalendar,
} from '$lib/utils/calendar.server'
import {
  compareAsc,
  endOfDay,
  format,
  isAfter,
  isBefore,
  startOfDay,
  toDate as date,
} from 'date-fns'
import { searchByWord } from '$lib/utils/strings'
import { strictDifferenceInHours } from '$lib/utils/date'

export type SearchParam = 'url' | 'from' | 'to' | 'summary' | 'sort' | 'grouped'

export type AugmentedEvent = Event & { totalHours: number }

export type AugmentedCalendar = Omit<Calendar, 'events'> & {
  events: AugmentedEvent[]
}

export const GET: RequestHandler = async ({ url }) => {
  const icalUrl = url.searchParams.get('url')
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const summary = url.searchParams.get('summary')
  const sort = url.searchParams.get('sort') || 'date-asc'
  const grouped = url.searchParams.get('grouped')

  if (!icalUrl?.length) {
    return error(400, 'No URL provided')
  }

  const calendar: ICAL.Component = await fetchCalendar(icalUrl).catch(
    (e: Error) => error(400, e.message)
  )
  const calendarJson = parseCalendar(calendar)

  const fromDate = from ? startOfDay(from) : null
  const toDate = to ? endOfDay(to) : null

  const sortedEvents = calendarJson.events
    .filter((event) => {
      const matchesFrom =
        fromDate && event.start ? date(event.start) >= fromDate : true
      const matchesTo = toDate && event.end ? date(event.end) <= toDate : true
      const matchesSummary =
        summary && event.summary ? searchByWord(summary, event.summary) : true

      return matchesFrom && matchesTo && matchesSummary
    })
    .sort((a, b) => {
      const [field, order] = sort.split('-')

      const handleOrder = (value: number) =>
        order === 'desc' ? value * -1 : value

      if (field === 'date') {
        return handleOrder(compareAsc(a.start, b.start))
      }

      if (field === 'summary') {
        return handleOrder((a.summary || '').localeCompare(b.summary || ''))
      }

      return 0
    })

  const groupByMonth = (events: Event[]): AugmentedEvent[] => {
    return Object.values(
      events.reduce(
        (acc, ev) => {
          const monthKey = format(date(ev.start), 'yyyy-MM')
          const existingEvent = acc[monthKey] || {
            ...ev,
            summary: format(date(ev.start), 'MMMM yyyy'),
            totalHours: 0,
          }

          return {
            ...acc,
            [monthKey]: {
              ...existingEvent,
              start: isBefore(existingEvent.start, ev.start)
                ? existingEvent.start
                : ev.start,
              end: isAfter(existingEvent.end, ev.end)
                ? existingEvent.end
                : ev.end,
              totalHours:
                existingEvent.totalHours +
                strictDifferenceInHours(ev.end, ev.start),
              location: '',
            },
          }
        },
        {} as Record<string, AugmentedEvent>
      )
    )
  }

  const groupBySummary = (events: Event[]): AugmentedEvent[] => {
    return Object.values(
      events.reduce(
        (acc, ev) => {
          const existingEvent = acc[ev.summary] || {
            ...ev,
            totalHours: 0,
          }

          return {
            ...acc,
            [ev.summary]: {
              ...existingEvent,
              start: isBefore(existingEvent.start, ev.start)
                ? existingEvent.start
                : ev.start,
              end: isAfter(existingEvent.end, ev.end)
                ? existingEvent.end
                : ev.end,
              totalHours:
                existingEvent.totalHours +
                strictDifferenceInHours(ev.end, ev.start),
              location: '',
            },
          }
        },
        {} as Record<string, AugmentedEvent>
      )
    )
  }

  const formatedEvents: AugmentedEvent[] = grouped
    ? grouped === 'month'
      ? groupByMonth(sortedEvents)
      : groupBySummary(sortedEvents)
    : sortedEvents.map((ev) => ({
        ...ev,
        totalHours: strictDifferenceInHours(ev.end, ev.start),
      }))

  return json({ ...calendarJson, events: formatedEvents })
}
