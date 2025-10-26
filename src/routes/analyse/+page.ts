import type { PageLoad } from './$types'
import type { JsonResponse } from '../json/+server'
import { formatDateIso } from '$lib/utils/date'
import { redirect } from '@sveltejs/kit'
import { cleanSearchParams, getQueryParams } from '$lib/utils/searchParams'
import { endOfMonth, startOfMonth } from 'date-fns'

export const ssr = false

export const load: PageLoad = async ({ fetch, url })  => {
  
  if (!url.searchParams.get('urls')) {
    return redirect(303, '/?tab=analyse')
  }

  const searchParams = cleanSearchParams(url.searchParams)

  if (searchParams.toString() !== url.searchParams.toString()) {
    return redirect(303, `/analyse?${searchParams.toString()}`)
  }

    const res = await fetch(`/json?${searchParams.toString()}`)

    if (!res.ok) {
      return {
        name: 'Error',
        events: [],
        stats: {
          totalEventsCount: 0,
          filteredEventsCount: 0,
          totalHours: 0,
          totalAmount: undefined,
          earliestStart: formatDateIso(startOfMonth(new Date())),
          latestEnd: formatDateIso(endOfMonth(new Date())),
        },
        query: getQueryParams(url.searchParams),
        error: `Failed to load calendar: ${res.status} ${res.statusText}`,
        errorDetails: (await res.json()).message,
      }
    }

    const calendar: JsonResponse = await res.json()

    return {
      ...calendar,
      events: calendar.events.map((event) => ({
        ...event,
        start: formatDateIso(event.start),
        end: formatDateIso(event.end),
      })),
      error: null,
      errorDetails: null,
    }
}
