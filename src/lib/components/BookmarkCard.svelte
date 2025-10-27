<script lang="ts">
  import {
    formatParamValue,
    getParamLabel,
    getQueryParams,
    type SearchParam,
  } from '$lib/utils/searchParams'
  import { BookmarkIcon, XMarkIcon } from './icons.svelte'

  interface Props {
    url: string
    name: string
    onRemove: () => void
  }

  let { url, name, onRemove }: Props = $props()

  const query = $derived(getQueryParams(new URL(url).searchParams))
</script>

<a
  href={url}
  class="group border-base-300 bg-base-200/30 hover:border-primary/50 hover:bg-base-200/50 relative overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md"
>
  <div class="flex items-start gap-4">
    <div class="flex-shrink-0 pt-1">
      <div class="bg-primary/10 text-primary rounded-full p-2">
        {@render BookmarkIcon({ class: 'size-5' })}
      </div>
    </div>

    <div class="min-w-0 flex-1">
      <div class="mb-3">
        <h4 class="text-base-content mb-1 text-base font-semibold">
          {name}
        </h4>
        <div class="text-base-content/50 mb-2 truncate text-xs">
          <ul>
            {#each query.urls as singleUrl (singleUrl)}
              <li class="truncate">{singleUrl}</li>
            {/each}
          </ul>
        </div>

        {#if Object.keys(query).some((key) => key !== 'urls')}
          <div class="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs">
            {#each Object.entries(query).filter(([key]) => key !== 'urls') as [key, value] (key)}
              <span>
                <span class="text-base-content/60">{getParamLabel(key as SearchParam)}</span>
                <span class="text-base-content/80"
                  >{formatParamValue(key as SearchParam, value as string)}</span
                >
              </span>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <button
      class="btn btn-square btn-sm btn-ghost text-base-content/40 hover:text-base-content opacity-0 transition-opacity group-hover:opacity-100"
      title="Remove bookmark"
      onclick={(e) => {
        e.preventDefault()
        onRemove()
      }}
    >
      <span class="sr-only">Remove</span>
      {@render XMarkIcon({ class: 'size-5' })}
    </button>
  </div>
</a>
