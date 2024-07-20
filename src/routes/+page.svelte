<script>
  import "tailwindcss/tailwind.css";

  let urls = [];

  $: urlsToLink = [...urls.filter(Boolean)];
  $: finalUrl = `${window.location}merge?${urlsToLink.map((url) => `url=${encodeURIComponent(url)}`).join("&")}`;
</script>

<!-- component -->
<div
  class="flex min-h-screen w-full items-center justify-center dark:bg-gray-950"
>
  <div
    class="w-full max-w-2xl rounded-lg bg-white px-8 py-6 shadow-md dark:bg-gray-900"
  >
    <h1 class="mb-4 text-center text-2xl font-bold dark:text-gray-200">
      Merge several calendars url (iCal)
    </h1>
    <div>
      {#each [...urlsToLink, ""] as url, i (i)}
        <div class="mb-4">
          <label
            for="url_{i}"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Calendar url {i + 1}:
          </label>
          <input
            bind:value={urls[i]}
            type="url"
            id="url_{i}"
            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
      {/each}
      <hr class="my-8" />
      <div class="relative mt-4">
        <div class="pointer-events-none absolute inset-y-0 start-0 ps-3 pt-3">
          <svg
            class="size-5 text-gray-500 dark:text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
            />
          </svg>
        </div>
        <textarea
          type="url"
          rows="6"
          readonly
          value={finalUrl}
          class="ellipsis block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 ps-10 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        <div class="absolute bottom-2.5 end-2.5 flex gap-2">
          <button
            type="button"
            class="rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            on:click={() => navigator.clipboard.writeText(finalUrl)}
          >
            Copy
          </button>
          <a
            href={finalUrl}
            class="rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            target="_blank"
            download
          >
            Download
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
