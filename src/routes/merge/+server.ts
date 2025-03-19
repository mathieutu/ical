import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

import ICAL from 'ical.js'
import { fetchCalendar } from '$lib/utils/calendar.server'

export const GET: RequestHandler = async ({ url }) => {
  const icalUrls = url.searchParams.getAll('url')

  if (!icalUrls.length) {
    return error(400, 'No URLs provided')
  }

  const calendars: ICAL.Component[] = await Promise.all(
    icalUrls.map(fetchCalendar)
  ).catch((e: Error) => error(400, e.message))

  const mergedCalendar = new ICAL.Component(['vcalendar', [], []])

  const mergedEvents = [
    ...mergedCalendar.getAllSubcomponents('vevent'),
    ...calendars
      .map((calendar) => calendar.getAllSubcomponents('vevent'))
      .flat(),
  ]

  mergedEvents.forEach((event) => {
    mergedCalendar.addSubcomponent(event)
  })

  const newIcal = mergedCalendar.toString()

  return new Response(newIcal, {
    headers: { 'Content-Type': 'text/calendar' },
  })
}
