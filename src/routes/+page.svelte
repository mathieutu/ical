<script lang="ts">
  import Result from '$lib/components/Result.svelte'
  import Card from '$lib/components/Card.svelte'

  let mergeUrl: string[] = $state([])
  let mergeUrlToLink = $derived([...mergeUrl.filter(Boolean)])
  let mergeFinalUrl = $derived(
    mergeUrlToLink.length
      ? `${window.location}merge?${mergeUrlToLink.map((url) => `url=${encodeURIComponent(url)}`).join('&')}`
      : ''
  )

  let ical2JsonUrl: string = $state('')
  let ical2JsonFinalUrl = $derived(
    ical2JsonUrl.length
      ? `${window.location}json?url=${encodeURIComponent(ical2JsonUrl)}`
      : ''
  )

  let analyseICalUrl: string = $state('')
  let analyseICalFinalUrl = $derived(
    analyseICalUrl.length
      ? `${window.location}analyse?url=${encodeURIComponent(analyseICalUrl)}`
      : ''
  )

  let bookmarkedUrls: Record<string, string> = $state(
    JSON.parse(localStorage.getItem('bookmarkedUrls') || '{}')
  )
  $effect(() => {
    localStorage.setItem('bookmarkedUrls', JSON.stringify(bookmarkedUrls))
  })

  const addBookmark = (url: string) => () => {
    const existingBookmark = !!bookmarkedUrls[url]
    if (existingBookmark) {
      return
    }
    const name = prompt('Enter a name for the bookmark:')
    if (name) {
      bookmarkedUrls[url] = name
    }
  }
</script>

<div
  class="bg-base-200 flex min-h-screen w-full flex-col items-center justify-center gap-8 p-4"
>
  <div class="text-center">
    <h1 class="text-primary text-5xl font-black">iCal manipulation API</h1>
    <a
      class="hover:text-primary-focus font-extralight underline"
      href="https://github.com/mathieutu">@mathieutu</a
    >
  </div>

  {#if Object.keys(bookmarkedUrls).length}
    <Card title="Bookmarks">
      <div class="">
        <ul class="list">
          {#each Object.entries(bookmarkedUrls) as [url, name] (url)}
            <li class="list-row">
              <div class="list-col-grow">
                <div class="text-sm font-semibold text-gray-600 uppercase">
                  {name}
                </div>
                <a
                  href={url}
                  target="_blank"
                  class="text-xs text-gray-400 italic hover:underline">{url}</a
                >
              </div>
              <button
                class="btn btn-square btn-ghost"
                title="Copy to clipboard"
                onclick={() => navigator.clipboard.writeText(url)}
                aria-labelledby="title"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </button>
              <button
                class="btn btn-square btn-ghost"
                title="Remove from bookmarks"
                aria-labelledby="title"
                onclick={() => delete bookmarkedUrls[url]}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
                  />
                </svg>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </Card>
  {/if}
  <Card title="Merge several iCal urls">
    <div>
      {#each [...mergeUrlToLink, ''] as _url, i (i)}
        <div class="mb-4">
          <label class="floating-label">
            <span>Calendar url {i + 1}</span>
            <input
              placeholder="Calendar url {i + 1}"
              bind:value={mergeUrl[i]}
              type="url"
              class="input input-bordered w-full"
            />
          </label>
        </div>
      {/each}
      <Result url={mergeFinalUrl} onBookmark={addBookmark(mergeFinalUrl)} />
    </div>
  </Card>
  <Card title="iCal to Json">
    <div class="mb-4">
      <label class="floating-label">
        <span>Calendar URL</span>
        <input
          bind:value={ical2JsonUrl}
          type="url"
          class="input input-bordered w-full"
          placeholder="Calendar URL"
        />
      </label>
    </div>
    <Result
      url={ical2JsonFinalUrl}
      onBookmark={addBookmark(ical2JsonFinalUrl)}
    />
  </Card>
  <Card title="Analyse iCal">
    <div class="mb-4">
      <label class="floating-label">
        <span>Calendar URL</span>
        <input
          bind:value={analyseICalUrl}
          type="url"
          id="url_analyse_ical"
          class="input input-bordered w-full"
          placeholder="Calendar URL"
        />
      </label>
    </div>
    <Result
      url={analyseICalFinalUrl}
      onBookmark={addBookmark(analyseICalFinalUrl)}
    />
  </Card>
</div>
