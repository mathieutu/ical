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

export type SearchParam = 'url' | 'from' | 'to' | 'summary' | 'sort' | 'grouped' | 'hourlyRate'


export type AugmentedEvent = Event & { totalHours: number, amount?: number }

export type Response = Omit<Calendar, 'events'> & {
  events: AugmentedEvent[]
  stats: {
    totalEventsCount?: number
    filteredEventsCount?: number
    totalHours: number
    totalAmount?: number
    earliestStart?: string
    latestEnd?: string
  }
  query: Record<SearchParam, string | null>
}

export const GET: RequestHandler = async ({ url }) => {
  const icalUrl = url.searchParams.get('url')
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const summary = url.searchParams.get('summary')
  const sort = url.searchParams.get('sort') || 'date-asc'
  const grouped = url.searchParams.get('grouped')
  const hourlyRate = url.searchParams.get('hourlyRate')

  if (!icalUrl?.length) {
    return error(400, 'No URL provided')
  }

  const calendar: ICAL.Component = await fetchCalendar(icalUrl).catch(
    (e: Error) => error(400, e.message)
  )
  const calendarJson = parseCalendar(calendar)
  const totalEventsCount = calendarJson.events.length

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

  const groupEvents = (events: Event[]): AugmentedEvent[] => {
    if (grouped === 'month') {
      return groupByMonth(events)
    }

    if (grouped === 'summary') {
      return groupBySummary(events)
    }

    return events.map((ev) => ({
      ...ev,
      totalHours: strictDifferenceInHours(ev.end, ev.start),
    }))
  }

  const formatedEvents: AugmentedEvent[] = groupEvents(sortedEvents)
    .map((ev) => {
      if (hourlyRate) {
        const rate = parseFloat(hourlyRate)
        if (!isNaN(rate)) {
          return {
            ...ev,
            amount: ev.totalHours * rate,
          }
        }
      }
      return ev
    })

  // Calculate earliest start and latest end dates
  const earliestStart = formatedEvents.length > 0
    ? format(date(formatedEvents.reduce((min, event) => 
        date(event.start) < date(min.start) ? event : min
      ).start), 'yyyy-MM-dd HH:mm')
    : undefined
  
  const latestEnd = formatedEvents.length > 0
    ? format(date(formatedEvents.reduce((max, event) => 
        date(event.end) > date(max.end) ? event : max
      ).end), 'yyyy-MM-dd HH:mm')
    : undefined

  return json({
    ...calendarJson,
    events: formatedEvents,
    stats: {
      totalEventsCount,
      filteredEventsCount: sortedEvents.length,
      totalHours: formatedEvents.reduce((sum, ev) => sum + ev.totalHours, 0),
      totalAmount: formatedEvents.reduce((sum, ev) => sum + (ev.amount || 0), 0),
      earliestStart,
      latestEnd,
    },
    query: {
      url: icalUrl,
      from,
      to,
      summary,
      sort,
      grouped,
      hourlyRate,
    }
  } satisfies Response)
}
