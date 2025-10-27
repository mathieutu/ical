import { uniq } from './arrays'

export type QueryParams = {
  urls: string[]
  from?: string
  to?: string
  summary?: string
  sort?: `${'date' | 'summary'}-${'asc' | 'desc'}`
  grouped?: 'month' | 'summary'
  hourlyRate?: string
}

export type SearchParam = keyof QueryParams

export const getQueryParams = (url: string | URLSearchParams): QueryParams => {
  const searchParams = new URLSearchParams(url)
  return {
    urls: uniq(searchParams.getAll('urls')),
    from: searchParams.get('from') || undefined,
    to: searchParams.get('to') || undefined,
    summary: searchParams.get('summary') || undefined,
    sort: (searchParams.get('sort') as QueryParams['sort']) || undefined,
    grouped: (searchParams.get('grouped') as QueryParams['grouped']) || undefined,
    hourlyRate: searchParams.get('hourlyRate') || undefined,
  }
}

export const buildSearchParams = (params: QueryParams): URLSearchParams => {
  const searchParams = new URLSearchParams()

  uniq(params.urls).forEach((u) => searchParams.append('urls', u))
  if (params.from) searchParams.set('from', params.from)
  if (params.to) searchParams.set('to', params.to)
  if (params.summary) searchParams.set('summary', params.summary)
  if (params.sort) searchParams.set('sort', params.sort)
  if (params.grouped) searchParams.set('grouped', params.grouped)
  if (params.hourlyRate) searchParams.set('hourlyRate', params.hourlyRate)

  return searchParams
}

export const cleanSearchParams = (params: string | URLSearchParams): URLSearchParams =>
  buildSearchParams(getQueryParams(params))

export const buildUrlWithParams = (path: string, baseUrl: URL, params: QueryParams): string => {
  const url = new URL(path, baseUrl)

  url.search = buildSearchParams(params).toString()

  return url.toString()
}
