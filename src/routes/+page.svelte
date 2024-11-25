<script lang="ts">
  import Result from '$lib/components/Result.svelte';
  import Card from '$lib/components/Card.svelte';
  
  import "tailwindcss/tailwind.css";

  let mergeUrl: string[] = [];
  $: mergeUrlToLink = [...mergeUrl.filter(Boolean)];
  $: mergeFinalUrl = mergeUrlToLink.length 
    ? `${window.location}merge?${mergeUrlToLink.map((url) => `url=${encodeURIComponent(url)}`).join("&")}` 
    : '';

  let ical2JsonUrl: string = ''
  $: ical2JsonFinalUrl = ical2JsonUrl.length
    ? `${window.location}json?url=${encodeURIComponent(ical2JsonUrl)}`
    : '';
</script>

<div
  class="flex flex-col p-4 gap-8 min-h-screen w-full items-center justify-center dark:bg-gray-950"
>
<div class="text-center">
  <h1 class="text-5xl font-black text-indigo-600 dark:text-gray-200">
    iCal manipulation API
  </h1>
  <a class="underline hover:text-indigo-500 font-extralight" href="https://github.com/mathieutu">@mathieutu</a>
</div>

<Card title="Merge several iCal urls">
    <div>
      {#each [...mergeUrlToLink, ""] as url, i (i)}
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
          class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>
    {/each}
    <Result url="{mergeFinalUrl}"/>
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
        class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
      />
    </div>
    <Result url="{ical2JsonFinalUrl}" />
  </Card>
</div>


<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
