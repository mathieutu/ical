import type { PageLoad } from './$types'
import type { Calendar } from '$lib/utils/calendar.server'
import type { SearchParam } from '../json/+server'

export const ssr = false

export const load: PageLoad = async ({ fetch, url }) => {
  const res = await fetch(`/json?${url.searchParams.toString()}`)
  const calendar: Calendar = await res.json()

  return {
    calendar,
    ...(Object.fromEntries(url.searchParams.entries()) as Record<
      SearchParam,
      string | undefined
    >),
  }
}
