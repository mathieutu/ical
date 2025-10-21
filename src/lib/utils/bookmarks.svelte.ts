export const useBookmarks = () => {
  let bookmarkedUrls = $state<Record<string, string>>(
    JSON.parse(localStorage.getItem('bookmarkedUrls') || '{}')
  )

  $effect(() => {
    localStorage.setItem('bookmarkedUrls', JSON.stringify(bookmarkedUrls))
  })

  const isBookmarked = (url: string) => {
    return !!bookmarkedUrls[url]
  }

  const addBookmark = (url: string) => {
    if (bookmarkedUrls[url]) {
      return
    }

    const name = prompt('Enter a name for the bookmark:')
    if (name) {
      bookmarkedUrls[url] = name
      return
    }
  }

  const removeBookmark = (url: string) => {
    delete bookmarkedUrls[url]
  }

  const toggleBookmark = (url: string) => {
    if (bookmarkedUrls[url]) {
      return removeBookmark(url)
    }

    return addBookmark(url)
  }

  return {
    bookmarkedUrls,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
  }
}
