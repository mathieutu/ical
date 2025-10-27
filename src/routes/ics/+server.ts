import { redirect, type RequestEvent } from '@sveltejs/kit'
import type { JsonResponse } from '../json/+server'
import ICAL from 'ical.js'
import { formatDateTimeIso } from '$lib/utils/date'

export const GET = async ({ url, fetch }: RequestEvent) => {
  if (!url.searchParams.get('urls')) {
    return redirect(303, '/?tab=ics')
  }

  // Fetch data from the JSON route
  const res = await fetch(`/json?${url.searchParams.toString()}`)
  const { events, name, description, timezone }: JsonResponse = await res.json()

  // Create a new iCalendar component
  const newCalendar = new ICAL.Component(['vcalendar', [], []])

  // Set calendar properties
  newCalendar.updatePropertyWithValue('prodid', '-//iCal Export//EN')
  newCalendar.updatePropertyWithValue('version', '2.0')

  if (name) {
    newCalendar.updatePropertyWithValue('x-wr-calname', name)
  }
  if (description) {
    newCalendar.updatePropertyWithValue('x-wr-caldesc', description)
  }
  if (timezone) {
    newCalendar.updatePropertyWithValue('x-wr-timezone', timezone)
  }

  // Add filtered events to the new calendar
  events.forEach((event) => {
    const vevent = new ICAL.Component('vevent')

    vevent.addPropertyWithValue('summary', event.summary)
    vevent.addPropertyWithValue('dtstart', formatDateTimeIso(event.start))
    vevent.addPropertyWithValue('dtend', formatDateTimeIso(event.end))
    vevent.addPropertyWithValue('uid', `${event.start}-${event.summary.replace(/\s+/g, '-')}`)

    if (event.description) {
      vevent.addPropertyWithValue('description', event.description)
    }

    if (event.location) {
      vevent.addPropertyWithValue('location', event.location)
    }

    newCalendar.addSubcomponent(vevent)
  })

  // Convert to iCalendar string format
  const icsContent = newCalendar.toString()

  return new Response(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"',
    },
  })
}
