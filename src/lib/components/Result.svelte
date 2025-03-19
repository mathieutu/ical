<script lang="ts">
  interface Props {
    url: string;
  }

  let { url }: Props = $props();
</script>

{#if url}
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
      rows="6"
      readonly
      value={url}
      class="ellipsis block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 ps-10 text-xs text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
    ></textarea>
    <div class="absolute end-2.5 bottom-2.5 flex gap-2">
      <button
        type="button"
        class="rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        onclick={() => navigator.clipboard.writeText(url)}
      >
        Copy
      </button>
      <a
        href={url}
        class="rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        target="_blank"
      >
        Open
      </a>
    </div>
  </div>
{/if}
