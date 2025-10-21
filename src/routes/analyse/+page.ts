import type { PageLoad } from './$types'
import type { Response } from '../json/+server'
import { formatDateIso } from '$lib/utils/date'

export const ssr = false

export const load: PageLoad = async ({ fetch, url }) => {
  const res = await fetch(`/json?${url.searchParams.toString()}`)
  const calendar: Response = await res.json()

  return {
    ...calendar,
    events: calendar.events.map((event) => ({
      ...event,
      start: formatDateIso(event.start),
      end: formatDateIso(event.end),
    })),
  }
}
