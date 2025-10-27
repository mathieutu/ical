<script lang="ts">
  import {
    BookmarkIcon,
    ArrowTopRightOnSquareIcon,
    CopyIcon,
    XMarkIcon,
    ChartBarIcon,
    SquaresIcon,
    CodeBracketIcon,
    TableCellsIcon,
  } from './icons.svelte'

  interface Props {
    url: string
    name: string
    onRemove: () => void
  }

  let { url, name, onRemove }: Props = $props()

  const getIconForTool = (tool: string) => {
    const icons = {
      analyse: ChartBarIcon,
      merge: SquaresIcon,
      json: CodeBracketIcon,
      csv: TableCellsIcon,
    }

    if (!(tool in icons)) return BookmarkIcon

    return icons[tool as keyof typeof icons]
  }

  const parsedUrl = $derived.by(() => {
    try {
      const urlObj = new URL(url)
      const tool = urlObj.pathname.split('/').filter(Boolean)[0] || ''
      const params = Object.fromEntries(
        urlObj.searchParams.entries().filter(([key, value]) => key !== 'url' && value?.trim())
      )

      return {
        tool,
        params,
        urls: urlObj.searchParams.getAll('url') || [],
        icon: getIconForTool(tool),
      }
    } catch {
      return {
        tool: '',
        params: {},
        urls: [],
        icon: BookmarkIcon,
      }
    }
  })

  const getParamLabel = (key: string): string => {
    const labels: Record<string, string> = {
      from: 'From',
      to: 'To',
      summary: 'Filtering with',
      sort: 'Sorting by',
      grouped: 'Grouping by',
      hourlyRate: 'With a rate of',
    }
    return labels[key] || key
  }

  const formatParamValue = (key: string, value: string): string => {
    if (key === 'hourlyRate') {
      return `${value} €/h`
    }

    if (key === 'sort') {
      return (
        {
          'date-asc': 'Date (oldest first)',
          'date-desc': 'Date (newest first)',
          'summary-asc': 'Summary (A-Z)',
          'summary-desc': 'Summary (Z-A)',
        }[value] || value
      )
    }

    if (key === 'grouped') {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }

    return value
  }
</script>

<div
  class="group border-base-300 bg-base-200/30 hover:border-primary/50 hover:bg-base-200/50 relative overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md"
>
  <div class="flex items-start gap-4">
    <div class="flex-shrink-0 pt-1">
      <div class="bg-primary/10 rounded-full p-2">
        {@render parsedUrl.icon({ class: 'size-5 text-primary' })}
      </div>
    </div>

    <div class="min-w-0 flex-1">
      <div class="mb-3">
        <h4 class="text-base-content mb-1 text-base font-semibold">
          {name}
        </h4>
        <div class="text-base-content/50 mb-2 truncate text-xs">
          {#if parsedUrl.urls.length === 1}
            {parsedUrl.urls[0]}
          {:else}
            <ul>
              {#each parsedUrl.urls as singleUrl (singleUrl)}
                <li>{singleUrl}</li>
              {/each}
            </ul>
          {/if}
        </div>

        {#if Object.keys(parsedUrl.params).length}
          <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            {#each Object.entries(parsedUrl.params) as [key, value] (key)}
              <div class="flex items-baseline gap-1.5">
                <span class="text-base-content/60">{getParamLabel(key)}</span>
                <span class="text-base-content/80">{formatParamValue(key, value)}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="flex flex-wrap gap-2">
        <a href={url} target="_blank" class="btn btn-xs btn-ghost gap-1.5">
          {@render ArrowTopRightOnSquareIcon({ class: 'size-3.5' })}
          Open
        </a>
        <button
          class="btn btn-xs btn-ghost gap-1.5"
          onclick={() => {
            navigator.clipboard.writeText(url)
          }}
        >
          {@render CopyIcon({ class: 'size-3.5' })}
          Copy URL
        </button>
      </div>
    </div>

    <button
      class="btn btn-square btn-sm btn-ghost text-base-content/40 hover:text-error opacity-0 transition-opacity group-hover:opacity-100"
      title="Remove bookmark"
      onclick={onRemove}
    >
      <span class="sr-only">Remove</span>
      {@render XMarkIcon({ class: 'size-5' })}
    </button>
  </div>
</div>
