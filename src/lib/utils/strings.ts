export const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
export const sanitizeForSearch = (str: string) => removeAccents(str.toLowerCase())

export const searchIn = (needle: string, haystack: string) =>
  sanitizeForSearch(haystack).includes(sanitizeForSearch(needle))

export const searchByWord = (needle: string, haystack: string) => {
  const sanitizedHaystack = sanitizeForSearch(haystack)
  const haystackWords = sanitizedHaystack.split(/[\s-]/)

  return sanitizeForSearch(needle)
    .split(',')
    .some((orTerm) => {
      const words = orTerm.trim().split(' ')
      const includeWords = words.filter((word) => !word.startsWith('-'))
      const excludeWords = words.filter((word) => word.startsWith('-')).map((word) => word.slice(1)).filter(Boolean)

      const matchesIncludes = includeWords.every((word) =>
        haystackWords.some((hay) => hay.startsWith(word))
      )

      const matchesExcludes = excludeWords.every(
        (word) => !haystackWords.some((hay) => hay.startsWith(word))
      )

      return matchesIncludes && matchesExcludes
    })
}
