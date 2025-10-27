<script lang="ts">
  import type { PageProps } from './$types'
  import { page } from '$app/state'
  import { debounce } from '$lib/utils/debounce.js'
  import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
  import { formatDateIso } from '$lib/utils/date.js'
  import { formatCurrency } from '$lib/utils/number.js'
  import 'cally'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
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
  import { buildUrlWithParams, getQueryParams, type QueryParams } from '$lib/utils/searchParams'

  const { data }: PageProps = $props()
  const { events, stats, query, error, errorDetails, ...calendar } = $derived(data)

  const bookmarks = useBookmarks()

  const bookmarked = $derived(bookmarks.isBookmarked(page.url.toString()))

  const replaceSearchParams = (newSearchParams: Partial<QueryParams>): string =>
    buildUrlWithParams(page.url.pathname, page.url, {
      ...query,
      ...newSearchParams,
    })

  const updateEvents = (newSearchParams: Partial<QueryParams>): Promise<void> =>
    goto(
      buildUrlWithParams(page.url.pathname, page.url, {
        ...query,
        ...newSearchParams,
      }),
      { keepFocus: true, noScroll: true }
    )

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

  let formEl: HTMLFormElement
  let calendarEl: HTMLElement

  onMount(() => {
    calendarEl.addEventListener('change', (e) => {
      // @ts-expect-error event is not well typed
      const [from, to] = e.target!.value.split('/')
      updateEvents({ from, to })
    })
  })

  const updateFiltersFromForm = () => {
    // @ts-expect-error Works perfectly!
    const queryParams = getQueryParams(new URLSearchParams(new FormData(formEl)))
    updateEvents(queryParams)
  }

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    updateFiltersFromForm()
  }
</script>

<svelte:head>
  <title>iCal Analytics - {calendar.name}</title>
</svelte:head>

<div class="from-base-200 via-base-100 to-base-200 min-h-screen bg-gradient-to-br">
  <!-- Header with Filters -->
  <div class="bg-primary/5 border-primary/10 border-b">
    <div class="container mx-auto max-w-6xl px-4 py-4">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <a href="/">
            <h1 class="text-base-content mb-1 text-2xl font-black">
              <span class="text-primary">iCal</span> Analytics
            </h1>
          </a>
          <div class="flex items-center gap-2">
            {@render CalendarIcon({ class: 'text-primary size-4' })}
            <h2 class="text-base-content/80 text-sm font-semibold">{calendar.name}</h2>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            onclick={() => navigator.clipboard.writeText(page.url.toString())}
            class="btn btn-ghost btn-sm">Copy URL</button
          >
          <details class="dropdown dropdown-end">
            <summary class="btn btn-ghost btn-sm gap-1">
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
                <a href="/json?{page.url.searchParams.toString()}" target="_blank" class="gap-2">
                  {@render CodeBracketIcon({ class: 'size-5' })}
                  See JSON
                </a>
              </li>
            </ul>
          </details>
          <button
            onclick={() => bookmarks.toggle(page.url.toString())}
            class="btn btn-ghost btn-sm"
          >
            {#if bookmarked}
              {@render BookmarkSlashIcon({ class: 'size-5' })}
              Remove from bookmarks
            {:else}
              {@render BookmarkIcon({ class: 'size-5' })}
              Bookmark
            {/if}
          </button>
        </div>
      </div>

      <!-- Filters in Header -->
      <form bind:this={formEl} onsubmit={handleSubmit}>
        <div class="flex flex-wrap items-center gap-2">
          <div>
            <details class="dropdown">
              <summary class="input input-sm w-auto cursor-pointer">
                {query.urls.length} Calendar{query.urls.length === 1 ? '' : 's'}
              </summary>
              <div
                class="dropdown-content bg-base-100 rounded-box border-base-300 z-[1] mt-1 w-96 border p-3 shadow-lg"
              >
                <div class="space-y-2">
                  <div class="text-base-content/70 mb-2 text-xs font-semibold">
                    Calendar Sources
                  </div>
                  {#each query.urls as url, i (i)}
                    <div class="input input-xs input-bordered w-full flex-1">
                      <input
                        placeholder="https://calendar.example.com/feed.ics"
                        value={url}
                        type="url"
                        name="urls"
                      />
                      {#if query.urls.length > 1}
                        <a
                          class="label text-base-content/40 hover:text-base-content"
                          href={replaceSearchParams({ urls: query.urls.toSpliced(i, 1) })}>×</a
                        >
                      {/if}
                    </div>
                  {/each}
                  <div class="flex gap-2">
                    <div class="flex-1">
                      {#key query.urls}
                        <input
                          placeholder="https://calendar.example.com/feed.ics"
                          type="url"
                          name="urls"
                          class="input input-xs input-bordered w-full"
                        />
                      {/key}
                    </div>
                  </div>
                  <div class="flex justify-end pt-2">
                    <button type="submit" class="btn btn-soft btn-xs"> Apply </button>
                  </div>
                </div>
              </div>
            </details>

            <details class="dropdown">
              <summary class="input input-sm w-auto cursor-pointer">
                <span class="label">Dates</span>
                <span
                  >{query.from || stats.earliestStart?.split(' ')[0]}
                  <span class="text-base-content/50">→</span>
                  {query.to || stats.latestEnd?.split(' ')[0]}</span
                >
                {#if query.from || query.to}
                  <a
                    class="label text-base-content/40 hover:text-base-content"
                    href={replaceSearchParams({ from: '', to: '' })}>×</a
                  >
                {/if}
              </summary>
              <div class="dropdown-content bg-base-100 rounded-box grid gap-2 py-4 shadow-lg">
                <div class="flex flex-wrap gap-2 px-2">
                  {#each Object.entries(calendarPresets) as [label, url] (label)}
                    <a href={url} class="btn btn-xs btn-ghost">
                      {label}
                    </a>
                  {/each}
                </div>

                <div class="flex justify-center">
                  <calendar-range
                    class="cally"
                    value="{query.from}/{query.to}"
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
                    <div class="cally flex justify-center gap-4">
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
                      onchange={updateFiltersFromForm}
                    />
                  </label>
                  <label class="input input-xs">
                    <span class="label">To</span>
                    <input
                      type="date"
                      name="to"
                      value={query.to}
                      onchange={updateFiltersFromForm}
                    />
                  </label>
                </div>
              </div>
            </details>

            <label class="input input-sm w-auto min-w-48">
              <span class="label">Summary</span>
              <input
                type="text"
                name="summary"
                placeholder="ClientDoe -daily"
                value={query.summary}
                oninput={debounce(updateFiltersFromForm, 300)}
              />
              {#if query.summary}
                <a
                  class="label text-base-content/40 hover:text-base-content"
                  href={replaceSearchParams({ summary: '' })}>×</a
                >
              {/if}
            </label>
          </div>
          <div>
            <label class="select select-sm w-auto">
              <span class="label">Sort</span>
              <select name="sort" value={query.sort} onchange={updateFiltersFromForm}>
                <option value="date-asc">Date ↑</option>
                <option value="date-desc">Date ↓</option>
                <option value="summary-asc">Summary ↑</option>
                <option value="summary-desc">Summary ↓</option>
              </select>
            </label>

            <label class="select select-sm w-auto">
              <span class="label">Group by</span>
              <select name="grouped" value={query.grouped || ''} onchange={updateFiltersFromForm}>
                <option value="">No grouping</option>
                <option value="summary">Summary</option>
                <option value="month">Month</option>
              </select>
            </label>

            <label class="input input-sm ml-auto w-auto">
              <span class="label">Rate</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                class="w-16"
                name="hourlyRate"
                value={query.hourlyRate || ''}
                oninput={debounce(updateFiltersFromForm, 300)}
              />
              <span class="label text-base-content/50">€/h</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  </div>

  {#if error}
    <div class="container mx-auto max-w-6xl px-4 pt-4">
      <div role="alert" class="alert alert-error shadow-lg">
        <div>
          <div class="font-bold">{error}</div>
          {#if errorDetails}
            <div class="text-sm">{errorDetails}</div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Stats Bar -->
  {#if stats.totalEventsCount && stats.filteredEventsCount !== undefined}
    <div class="bg-base-100 border-base-300 border-b">
      <div class="container mx-auto max-w-6xl px-4 py-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-6">
            <div>
              <div class="text-primary text-2xl font-bold">
                {stats.filteredEventsCount}
              </div>
              <div class="text-base-content/60 text-xs">
                {stats.filteredEventsCount === 1 ? 'Event' : 'Events'}
                {#if query.grouped}
                  <span class="text-base-content/40">in {events.length} groups</span>
                {/if}
              </div>
            </div>
            <div class="border-base-300 h-10 w-px border-l"></div>
            <div>
              <div class="text-secondary text-2xl font-bold">
                {stats.totalHours.toFixed(1)}h
              </div>
              <div class="text-base-content/60 text-xs">Total Hours</div>
            </div>
            {#if stats.totalAmount}
              <div class="border-base-300 h-10 w-px border-l"></div>
              <div>
                <div class="text-accent text-2xl font-bold">
                  {formatCurrency(stats.totalAmount)}
                </div>
                <div class="text-base-content/60 text-xs">Total Amount</div>
              </div>
            {/if}
          </div>
          {#if stats.filteredEventsCount !== stats.totalEventsCount}
            <div class="text-base-content/50 text-sm">
              Filtered from {stats.totalEventsCount} total events
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Events List -->
  <div class="">
    <div class="container mx-auto max-w-6xl">
      <ul class="list">
        {#each events as event, i (i)}
          <li class="list-row group hover:bg-base-200/50 transition-colors">
            <div class="list-col-grow px-4">
              <div class="mb-1 flex items-start justify-between gap-4">
                <div
                  class="text-base-content group-hover:text-primary font-semibold transition-colors"
                >
                  {event.summary}
                </div>
                <div class="flex shrink-0 items-center gap-2">
                  <div
                    class="bg-secondary/10 text-secondary rounded px-2 py-0.5 text-xs font-medium"
                  >
                    {event.totalHours}h
                  </div>
                  {#if event.amount}
                    <div class="bg-accent/10 text-accent rounded px-2 py-0.5 text-xs font-semibold">
                      {formatCurrency(event.amount)}
                    </div>
                  {/if}
                </div>
              </div>
              <div class="text-base-content/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span class="inline-flex items-center gap-1">
                  <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  {event.start}
                  {#if event.start !== event.end}
                    <span class="text-base-content/40">→</span>
                    {event.end}
                  {/if}
                </span>
                {#if event.location}
                  <span class="inline-flex items-center gap-1">
                    <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    {event.location}
                  </span>
                {/if}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style>
  :global(.cally) {
    ::part(day) {
      block-size: 1.5rem;
      inline-size: 1.5rem;
    }

    &::part(container) {
      padding: calc(var(--spacing) * 2);
    }

    &::part(day--today) {
      font-weight: 600;
    }

    &::part(day--in-range) {
      background: oklch(var(--p) / 0.15);
    }

    &::part(day--range-start),
    &::part(day--range-end) {
      background: oklch(var(--p));
      color: oklch(var(--pc));
      font-weight: 600;
    }
  }
</style>
