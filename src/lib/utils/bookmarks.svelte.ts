import { onMount } from 'svelte'

export const useBookmarks = () => {
  let bookmarkedUrls = $state<Record<string, string>>({})

  onMount(() => {
    const storedBookmarks = localStorage.getItem('bookmarkedUrls')
    if (storedBookmarks) {
      bookmarkedUrls = JSON.parse(storedBookmarks)
    }
  })

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
