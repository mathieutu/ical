export const removeAccents = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
export const sanitizeForSearch = (str: string) =>
  removeAccents(str.toLowerCase())

export const searchIn = (needle: string, haystack: string) =>
  sanitizeForSearch(haystack).includes(sanitizeForSearch(needle))
export const searchByWord = (needle: string, haystack: string) =>
  sanitizeForSearch(needle)
    .split(' ')
    .every((word) =>
      sanitizeForSearch(haystack)
        .split(/[\s-]/)
        .some((hay) => hay.startsWith(word))
    )
