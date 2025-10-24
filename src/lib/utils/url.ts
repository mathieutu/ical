export const buildUrlWithParams = (
  path: string,
  baseUrl: URL,
  params: Record<string, string | string[] | null | undefined>
): string => {
  const url = new URL(path, baseUrl)

  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) {
          url.searchParams.append(key, v)
        }
      })
    } else {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}
