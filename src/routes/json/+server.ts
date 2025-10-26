import { error, json, redirect } from '@sveltejs/kit'
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
import { getQueryParams, type QueryParams } from '$lib/utils/searchParams'

export type AugmentedEvent = Event & { totalHours: number; amount?: number }

export type JsonResponse = Omit<Calendar, 'events'> & {
  events: AugmentedEvent[]
  stats: {
    totalEventsCount?: number
    filteredEventsCount?: number
    totalHours: number
    totalAmount?: number
    earliestStart?: string
    latestEnd?: string
  }
  query: QueryParams
}

export const GET: RequestHandler = async ({ url }) => {
  if (!url.searchParams.get('url')) {
    return redirect(303, '/?tab=json')
  }

  const query = getQueryParams(url.searchParams)

  if (!query.url.length) {
    return error(400, 'No URL provided')
  }

  // Fetch and parse all calendars
  const calendars: ICAL.Component[] = await Promise.all(
    query.url.map(fetchCalendar)
  ).catch((e: Error) => error(400, e.message))

  const parsedCalendars = calendars.map(parseCalendar)

  // Merge all events from all calendars
  const allEvents = parsedCalendars.flatMap((cal) => cal.events)

  // Use the first calendar's metadata, or merge names if multiple
  const calendarJson = {
    ...parsedCalendars[0],
    name:
      parsedCalendars.length > 1
        ? parsedCalendars
            .map((cal) => cal.name)
            .filter(Boolean)
            .join(' & ')
        : parsedCalendars[0].name,
    events: allEvents,
  }

  const totalEventsCount = calendarJson.events.length

  const fromDate = query.from ? startOfDay(query.from) : null
  const toDate = query.to ? endOfDay(query.to) : null

  const sortedEvents = calendarJson.events
    .filter((event) => {
      const matchesFrom =
        fromDate && event.start ? date(event.start) >= fromDate : true
      const matchesTo = toDate && event.end ? date(event.end) <= toDate : true
      const matchesSummary =
        query.summary && event.summary ? searchByWord(query.summary, event.summary) : true

      return matchesFrom && matchesTo && matchesSummary
    })
    .sort((a, b) => {
      if  (!query.sort) return 0
    
      const [field, order] = query.sort.split('-')

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
    if (query.grouped === 'month') {
      return groupByMonth(events)
    }

    if (query.grouped === 'summary') {
      return groupBySummary(events)
    }

    return events.map((ev) => ({
      ...ev,
      totalHours: strictDifferenceInHours(ev.end, ev.start),
    }))
  }

  const formatedEvents: AugmentedEvent[] = groupEvents(sortedEvents).map(
    (ev) => {
      if (query.hourlyRate) {
        const rate = parseFloat(query.hourlyRate)
        if (!isNaN(rate)) {
          return {
            ...ev,
            amount: ev.totalHours * rate,
          }
        }
      }
      return ev
    }
  )

  // Calculate earliest start and latest end dates
  const earliestStart =
    formatedEvents.length > 0
      ? format(
          date(
            formatedEvents.reduce((min, event) =>
              date(event.start) < date(min.start) ? event : min
            ).start
          ),
          'yyyy-MM-dd HH:mm'
        )
      : undefined

  const latestEnd =
    formatedEvents.length > 0
      ? format(
          date(
            formatedEvents.reduce((max, event) =>
              date(event.end) > date(max.end) ? event : max
            ).end
          ),
          'yyyy-MM-dd HH:mm'
        )
      : undefined

  return json({
    ...calendarJson,
    events: formatedEvents,
    stats: {
      totalEventsCount,
      filteredEventsCount: sortedEvents.length,
      totalHours: formatedEvents.reduce((sum, ev) => sum + ev.totalHours, 0),
      totalAmount: formatedEvents.reduce(
        (sum, ev) => sum + (ev.amount || 0),
        0
      ),
      earliestStart,
      latestEnd,
    },
    query,
  } satisfies JsonResponse)
}
