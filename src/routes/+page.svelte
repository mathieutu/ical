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
  class="bg-base-200 flex min-h-screen w-full flex-col items-center justify-center gap-8 p-4"
>
  <div class="text-center">
    <h1 class="text-primary text-5xl font-black">iCal manipulation API</h1>
    <a
      class="hover:text-primary-focus font-extralight underline"
      href="https://github.com/mathieutu">@mathieutu</a
    >
  </div>

  <Card title="Merge several iCal urls">
    <div>
      {#each [...mergeUrlToLink, ''] as url, i (i)}
        <div class="mb-4">
          <label class="floating-label">
            <span>Calendar url {i + 1}</span>
            <input
              placeholder="Calendar url {i + 1}"
              bind:value={mergeUrl[i]}
              type="url"
              class="input input-bordered w-full"
              name="calendar_url"
              autocomplete="url"
            />
          </label>
        </div>
      {/each}
      <Result url={mergeFinalUrl} />
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
          name="calendar_url"
          autocomplete="url"
        />
      </label>
    </div>
    <Result url={ical2JsonFinalUrl} />
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
          name="calendar_url"
          autocomplete="url"
        />
      </label>
    </div>
    <Result url={analyseICalFinalUrl} />
  </Card>
</div>
