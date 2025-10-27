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

  const add = (url: string) => {
    if (bookmarkedUrls[url]) {
      return
    }

    const name = prompt('Enter a name for the bookmark:')
    if (name) {
      bookmarkedUrls[url] = name
      return
    }
  }

  const remove = (url: string) => {
    delete bookmarkedUrls[url]
  }

  const toggle = (url: string) => {
    if (bookmarkedUrls[url]) {
      return remove(url)
    }

    return add(url)
  }

  return {
    get urls() {
      return bookmarkedUrls
    },
    isBookmarked,
    add,
    remove,
    toggle,
  }
}
