import type { PageLoad } from './$types'
import type { JsonResponse } from '../json/+server'
import { formatDateIso } from '$lib/utils/date'
import { redirect } from '@sveltejs/kit'

export const ssr = false

export const load: PageLoad = async ({ fetch, url }) => {
  if (!url.searchParams.get('url')) {
    return redirect(303, '/?tab=analyse')
  }

  const res = await fetch(`/json?${url.searchParams.toString()}`)
  const calendar: JsonResponse = await res.json()

  return {
    ...calendar,
    events: calendar.events.map((event) => ({
      ...event,
      start: formatDateIso(event.start),
      end: formatDateIso(event.end),
    })),
  }
}
