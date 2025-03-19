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
</script>

<div
  class="flex min-h-screen w-full flex-col items-center justify-center gap-8 p-4 dark:bg-gray-950"
>
  <div class="text-center">
    <h1 class="text-5xl font-black text-indigo-600 dark:text-gray-200">
      iCal manipulation API
    </h1>
    <a
      class="font-extralight underline hover:text-indigo-500"
      href="https://github.com/mathieutu">@mathieutu</a
    >
  </div>

  <Card title="Merge several iCal urls">
    <div>
      {#each [...mergeUrlToLink, ''] as url, i (i)}
        <div class="mb-4">
          <label
            for="url_{i}"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Calendar url {i + 1}:
          </label>
          <input
            bind:value={mergeUrl[i]}
            type="url"
            id="url_{i}"
            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      {/each}
      <Result url={mergeFinalUrl} />
    </div>
  </Card>
  <Card title="iCal to Json">
    <div class="mb-4">
      <label
        for="url_ical2json"
        class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Calendar url:
      </label>
      <input
        bind:value={ical2JsonUrl}
        type="url"
        id="url_ical2json"
        class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
      />
    </div>
    <Result url={ical2JsonFinalUrl} />
  </Card>
  <Card title="Analyse iCal">
    <div class="mb-4">
      <label
        for="url_analyse_ical"
        class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Calendar url:
      </label>
      <input
        bind:value={analyseICalUrl}
        type="url"
        id="url_analyse_ical"
        class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
      />
    </div>
    <Result url={analyseICalFinalUrl} />
  </Card>
</div>
