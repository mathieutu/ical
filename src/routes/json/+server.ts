import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import ICAL from 'ical.js'
import { fetchCalendar, parseCalendar } from '$lib/utils/calendar.server'
import { startOfDay, endOfDay, toDate as date, compareAsc } from 'date-fns'
import { searchIn } from '$lib/utils/strings'

export type SearchParam = 'url' | 'from' | 'to' | 'summary' | 'sort'

export const GET: RequestHandler = async ({ url }) => {
  const icalUrl = url.searchParams.get('url')
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const summary = url.searchParams.get('summary')
  const sort = url.searchParams.get('sort') || 'date-asc'

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
        summary && event.summary ? searchIn(summary, event.summary) : true

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

  const filteredCalendarJson = { ...calendarJson, events: sortedEvents }

  return new Response(JSON.stringify(filteredCalendarJson), {
    headers: { 'Content-Type': 'application/json' },
  })
}
