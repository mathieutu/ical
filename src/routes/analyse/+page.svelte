<script lang="ts">
  import type { PageProps } from './$types'
  import { page } from '$app/state'
  import { debounce } from '$lib/utils/debounce.js'
  import {
    endOfMonth,
    isAfter,
    isBefore,
    startOfMonth,
    subMonths,
  } from 'date-fns'
  import { formatDateIso } from '$lib/utils/date.js'
  import 'cally'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import type { SearchParam } from '../json/+server'

  let { data }: PageProps = $props()

  const replaceSearchParams = (
    newSearchParams: Partial<Record<SearchParam, string>>
  ) => {
    const url = new URL(page.url.toString())
    Object.entries(newSearchParams).forEach(([key, value]) =>
      url.searchParams.set(key, value)
    )

    return url.toString()
  }

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

  let form: HTMLFormElement
  let calendar: HTMLElement

  let oldestEventDate = $derived(
    formatDateIso(
      data.events.reduce(
        (acc, event) => (isBefore(acc, event.start) ? acc : event.start),
        ''
      )
    )
  )

  let newestEventDate = $derived(
    formatDateIso(
      data.events.reduce(
        (acc, event) => (isAfter(acc, event.end) ? acc : event.end),
        ''
      )
    )
  )

  onMount(() => {
    calendar.addEventListener('change', (e) => {
      const [from, to] = e.target!.value.split('/')
      showCalendar = false
      goto(replaceSearchParams({ from, to }))
    })
  })
</script>

<main class="grid gap-4 p-4">
  <div class="">
    <h1 class="text-5xl font-black text-indigo-600 dark:text-gray-200">
      iCal manipulation API
    </h1>
    <a
      class="font-extralight underline hover:text-indigo-500"
      href="https://github.com/mathieutu">@mathieutu</a
    >
  </div>

  <div class="flex items-center justify-between">
    <h2
      class="inline-flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-gray-200"
    >
      <svg
        class="size-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#4f46e5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
        />
      </svg>

      {data.name}
    </h2>
    <div class="flex flex-wrap items-center justify-end gap-1">
      <a href="/" class="btn">← Back</a>
      <button
        onclick={() =>
          navigator.clipboard.writeText(window.location.toString())}
        class="btn">Copy URL</button
      >
    </div>
  </div>
  <form
    class="flex items-center gap-4"
    method="GET"
    bind:this={form}
    data-sveltekit-keepfocus
    data-sveltekit-noscroll
  >
    <details class="dropdown" open={showCalendar}>
      <summary class="input w-auto">
        <span class="label">Dates</span>
        <span
          >{data.from || oldestEventDate} <span class="text-gray-500">→</span>
          {data.to || newestEventDate}</span
        >
        <a
          class="label text-gray-400 hover:text-gray-900"
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
            value="{data.from}/{data.to}"
            class="cally justify-center"
            months={2}
            onchange={console.log}
            bind:this={calendar}
          >
            <svg
              aria-label="Previous"
              class="size-4 fill-current"
              slot="previous"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
            </svg>
            <svg
              aria-label="Next"
              class="size-4 fill-current"
              slot="next"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
            </svg>
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
              value={data.from}
              onchange={() => form.requestSubmit()}
            />
          </label>
          <label class="input input-xs">
            <span class="label">To</span>
            <input
              type="date"
              name="to"
              value={data.to}
              onchange={() => form.requestSubmit()}
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
        value={data.summary}
        oninput={debounce(() => form.requestSubmit(), 300)}
      />
      <a
        class="label text-gray-400 hover:text-gray-900"
        href={replaceSearchParams({ summary: '' })}>×</a
      >
    </label>
    <label class="select w-auto">
      <span class="label">Sort</span>
      <select
        name="sort"
        value={data.sort}
        onchange={() => form.requestSubmit()}
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
        value={data.grouped || ''}
        onchange={() => form.requestSubmit()}
      >
        <option value="">No grouping</option>
        <option value="summary">Summary</option>
        <option value="month">Month</option>
      </select>
    </label>
    <input type="hidden" name="url" value={data.url} />
  </form>

  {#if data.totalEventsCount && data.filteredEventsCount !== undefined}
    <div class="text-sm text-gray-600 dark:text-gray-400">
      {#if data.grouped}
        Showing {data.events.length} groups ({data.filteredEventsCount} events) / {data.totalEventsCount} total events
      {:else}
        Showing {data.filteredEventsCount} / {data.totalEventsCount} events
      {/if}
    </div>
  {/if}

  <div
    class="card bg-base-100 border-base-300 border text-sm shadow-md
 "
  >
    <ul class="list">
      {#each data.events as event, i (i)}
        <li class="list-row">
          <div class="list-col-grow">
            <div class="font-semibold">{event.summary}</div>
            <div class="text-xs text-gray-400 uppercase">
              {event.start}
              {#if event.start !== event.end}
                → {event.end}
              {/if}
              ({event.totalHours} h){#if event.location}, {event.location}{/if}
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
