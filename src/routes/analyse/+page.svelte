<script lang="ts">
  import type { PageProps } from './$types'
  import { page } from '$app/state'
  import { debounce } from '$lib/utils/debounce.js'
  import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
  import { formatDateIso } from '$lib/utils/date.js'
  import { formatCurrency } from '$lib/utils/number.js'
  import { buildUrlWithParams } from '$lib/utils/url.js'
  import 'cally'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import type { SearchParam } from '../json/+server'
  import { useBookmarks } from '$lib/utils/bookmarks.svelte'
  import {
    CalendarIcon,
    BookmarkIcon,
    BookmarkSlashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    TableCellsIcon,
    CodeBracketIcon,
    ChevronDownIcon,
  } from '$lib/components/icons.svelte'

  const { data }: PageProps = $props()
  const { events, stats, query, ...calendar } = $derived(data)

  const { toggleBookmark, isBookmarked } = useBookmarks()

  const bookmarked = $derived(isBookmarked(page.url.toString()))

  const replaceSearchParams = (
    newSearchParams: Partial<Record<SearchParam, string | null>>
  ) =>
    buildUrlWithParams(page.url.pathname, page.url, {
      ...query,
      ...newSearchParams,
    })

  const calendarPresets = {
    'Last Month': replaceSearchParams({
      from: formatDateIso(startOfMonth(subMonths(new Date(), 1))),
      to: formatDateIso(endOfMonth(subMonths(new Date(), 1))),
    }),
    'This Month': replaceSearchParams({
      from: formatDateIso(startOfMonth(new Date())),
      to: formatDateIso(endOfMonth(new Date())),
    }),
  }

  let showCalendar = $state(false)

  let formEl: HTMLFormElement
  let calendarEl: HTMLElement

  onMount(() => {
    calendarEl.addEventListener('change', (e) => {
      const [from, to] = e.target!.value.split('/')
      showCalendar = false
      goto(replaceSearchParams({ from, to }))
    })
  })
</script>

<svelte:head>
  <title>iCal Analytics - {calendar.name}</title>
</svelte:head>

<main class="grid gap-4 p-4">
  <div class="">
    <h1 class="text-5xl font-black text-primary">
      iCal manipulation API
    </h1>
    <a
      class="font-extralight underline link link-hover link-primary"
      href="https://www.mathieutu.dev">@mathieutu</a
    >
  </div>

  <div class="flex items-center justify-between">
    <h2
      class="inline-flex items-center gap-2 text-xl font-bold text-primary"
    >
      {@render CalendarIcon({ class: 'size-5' })}

      {calendar.name}
    </h2>
    <div class="flex flex-wrap items-center justify-end gap-1">
      <a href="/" class="btn">← Back</a>
      <button
        onclick={() =>
          navigator.clipboard.writeText(page.url.toString())}
        class="btn">Copy URL</button
      >
      <details class="dropdown max-xl:dropdown-end">
        <summary class="btn gap-2">
          Export
          {@render ChevronDownIcon({ class: 'size-4' })}
        </summary>
        <ul
          class="dropdown-content menu bg-base-100 rounded-box border-base-300 z-[1] mt-1 w-52 border p-2 shadow-lg"
        >
          <li>
            <button
              onclick={() => {
                const calendarUrl = `${page.url.origin}/ics?${page.url.searchParams.toString()}`
                navigator.clipboard.writeText(calendarUrl)
              }}
              class="gap-2"
            >
              {@render CalendarIcon({ class: 'size-5' })}
              Copy calendar URL
            </button>
          </li>
          <li>
            <a href="/csv?{page.url.searchParams.toString()}" class="gap-2">
              {@render TableCellsIcon({ class: 'size-5' })}
              Download CSV
            </a>
          </li>
          <li>
            <a
              href="/json?{page.url.searchParams.toString()}"
              target="_blank"
              class="gap-2"
            >
              {@render CodeBracketIcon({ class: 'size-5' })}
              See JSON
            </a>
          </li>
        </ul>
      </details>
      <button
        onclick={() => toggleBookmark(page.url.toString())}
        class="btn"
        title={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      >
        {#if bookmarked}
          {@render BookmarkSlashIcon({ class: 'size-5' })}
          Remove bookmark
        {:else}
          {@render BookmarkIcon({ class: 'size-5' })}
          Bookmark
        {/if}
      </button>
    </div>
  </div>
  <form
    method="GET"
    bind:this={formEl}
    data-sveltekit-keepfocus
    data-sveltekit-noscroll
  >
    <div class="flex items-center gap-4">
      <details class="dropdown" open={showCalendar}>
        <summary class="input w-auto">
          <span class="label">Dates</span>
          <span
            >{query.from || stats.earliestStart?.split(' ')[0]}
            <span class="text-base-content/50">→</span>
            {query.to || stats.latestEnd?.split(' ')[0]}</span
          >
          <a
            class="label text-base-content/40 hover:text-base-content"
            href={replaceSearchParams({ from: '', to: '' })}>×</a
          >
        </summary>
        <div
          class="dropdown-content bg-base-100 rounded-box grid gap-2 py-4 shadow-lg"
        >
          <div class="flex flex-wrap gap-2 px-2">
            {#each Object.entries(calendarPresets) as [label, url] (label)}
              <a href={url} class="btn btn-xs btn-ghost">
                {label}
              </a>
            {/each}
          </div>

          <div class="flex justify-center">
            <calendar-range
              value="{query.from}/{query.to}"
              class="cally justify-center"
              months={2}
              bind:this={calendarEl}
            >
              <span slot="previous"
                >{@render ChevronLeftIcon({
                  class: 'size-4 fill-current',
                })}</span
              >
              <span slot="next"
                >{@render ChevronRightIcon({
                  class: 'size-4 fill-current',
                })}</span
              >
              <div class="flex justify-center gap-4">
                <calendar-month></calendar-month>
                <calendar-month offset={1}></calendar-month>
              </div>
            </calendar-range>
          </div>
          <div class="flex justify-between gap-2 px-2">
            <label class="input input-xs">
              <span class="label">From</span>
              <input
                type="date"
                name="from"
                value={query.from}
                onchange={() => formEl.requestSubmit()}
              />
            </label>
            <label class="input input-xs">
              <span class="label">To</span>
              <input
                type="date"
                name="to"
                value={query.to}
                onchange={() => formEl.requestSubmit()}
              />
            </label>
          </div>
        </div>
      </details>
      <label class="input w-auto">
        <span class="label">Summary</span>
        <input
          type="text"
          name="summary"
          value={query.summary}
          oninput={debounce(() => formEl.requestSubmit(), 300)}
        />
        <a
          class="label text-base-content/40 hover:text-base-content"
          href={replaceSearchParams({ summary: '' })}>×</a
        >
      </label>
      <label class="select w-auto">
        <span class="label">Sort</span>
        <select
          name="sort"
          value={query.sort}
          onchange={() => formEl.requestSubmit()}
        >
          <option value="date-asc">Date Ascending</option>
          <option value="date-desc">Date Descending</option>
          <option value="summary-asc">Summary Ascending</option>
          <option value="summary-desc">Summary Descending</option>
        </select>
      </label>
      <label class="select w-auto">
        <span class="label">Group by</span>
        <select
          name="grouped"
          value={query.grouped || ''}
          onchange={() => formEl.requestSubmit()}
        >
          <option value="">No grouping</option>
          <option value="summary">Summary</option>
          <option value="month">Month</option>
        </select>
      </label>
      <input type="hidden" name="url" value={query.url} />
    </div>
    {#if stats.totalEventsCount && stats.filteredEventsCount !== undefined}
      <div class="mt-1 flex items-center justify-between gap-4">
        <div class="text-sm text-base-content/60">
          {#if query.grouped}
            Showing {events.length} groups ({stats.filteredEventsCount} events, {stats.totalHours.toFixed(
              2
            )} hours{#if stats.totalAmount}{' '}=
              {formatCurrency(stats.totalAmount)}{/if}) / {stats.totalEventsCount}
            total events
          {:else}
            Showing {stats.filteredEventsCount} events ({stats.totalHours.toFixed(
              2
            )} hours{#if stats.totalAmount}{' '}= {formatCurrency(
                stats.totalAmount
              )}{/if}) / {stats.totalEventsCount} total events
          {/if}
        </div>
        <label class="input input-xs w-auto">
          <span class="label text-xs">Rate</span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            class="w-16 text-xs"
            name="hourlyRate"
            value={query.hourlyRate || ''}
            oninput={debounce(() => formEl.requestSubmit(), 300)}
          />
          <span class="label text-xs text-base-content/50">€/h</span>
        </label>
      </div>
    {/if}
  </form>

  <div
    class="card bg-base-100 border-base-300 border text-sm shadow-md
 "
  >
    <ul class="list">
      {#each events as event, i (i)}
        <li class="list-row">
          <div class="list-col-grow">
            <div class="font-semibold">{event.summary}</div>
            <div class="text-xs text-base-content/40">
              {event.start}
              {#if event.start !== event.end}
                → {event.end}
              {/if}
              ({event.totalHours} h{#if event.amount}{' '}= {formatCurrency(
                  event.amount
                )}{/if}){#if event.location}, {event.location}{/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
  :global(.cally) {
    ::part(day) {
      block-size: 1.5rem;
      inline-size: 1.5rem;
    }

    &::part(container) {
      padding: calc(var(--spacing) * 2);
    }
  }
</style>
