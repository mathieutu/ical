import type { PageLoad } from './$types'
import type { JsonResponse } from '../json/+server'
import { formatDateIso } from '$lib/utils/date'
import { redirect } from '@sveltejs/kit'
import { cleanSearchParams } from '$lib/utils/searchParams'

export const ssr = false

export const load: PageLoad = async ({ fetch, url }) => {
  if (!url.searchParams.get('url')) {
    return redirect(303, '/?tab=analyse')
  }

  const searchParams = cleanSearchParams(url.searchParams)

  if (searchParams.toString() !== url.searchParams.toString()) {
    return redirect(303, `/analyse?${searchParams.toString()}`)
  }

  const res = await fetch(`/json?${searchParams.toString()}`)

  if (!res.ok) {
    // TODO handle error properly
    throw new Error(`Failed to load calendar data: ${res.statusText}`)
  }

  const calendar: JsonResponse = await res.json()

  // const newSearchParams = new URLSearchParams(calendar.query).toString()

  // if (newSearchParams !== url.searchParams.toString()) {
  //   return redirect(303, `/analyse?${new URLSearchParams(calendar.query).toString()}`)
  // }
  return {
    ...calendar,
    events: calendar.events.map((event) => ({
      ...event,
      start: formatDateIso(event.start),
      end: formatDateIso(event.end),
    })),
  }
}
