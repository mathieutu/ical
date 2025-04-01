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
  import { formatDateIso, strictDifferenceInHours } from '$lib/utils/date.js'
  import 'cally'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import type { SearchParam } from '../json/+server'
  import type { Event } from '$lib/utils/calendar.server'

  let { data }: PageProps = $props()

  type Entry = Event & { totalHours: number; key: string }
  let entries: Entry[] = $derived(
    !data.grouped
      ? data.calendar.events.map((ev) => ({
          ...ev,
          start: formatDateIso(ev.start),
          end: formatDateIso(ev.end),
          key: ev.start,
          totalHours: strictDifferenceInHours(ev.end, ev.start),
        }))
      : Object.values(
          data.calendar.events.reduce(
            (acc, ev) => {
              const existingEntry = acc[ev.summary] || {
                ...ev,
                key: ev.summary,
                start: ev.start,
                end: ev.end,
                totalHours: 0,
              }

              return {
                ...acc,
                [ev.summary]: {
                  ...existingEntry,
                  start: formatDateIso(
                    isBefore(existingEntry.start, ev.start)
                      ? existingEntry.start
                      : ev.start
                  ),
                  end: formatDateIso(
                    isAfter(existingEntry.end, ev.end)
                      ? existingEntry.end
                      : ev.end
                  ),
                  totalHours:
                    existingEntry.totalHours +
                    strictDifferenceInHours(ev.end, ev.start),
                  location: '',
                },
              }
            },
            {} as Record<string, Entry>
          )
        )
  )
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
      entries.reduce(
        (acc, event) => (isBefore(acc, event.start) ? acc : event.start),
        ''
      )
    )
  )

  let newestEventDate = $derived(
    formatDateIso(
      entries.reduce(
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
  <div class="flex items-center justify-between">
    <div class="">
      <h1 class="text-5xl font-black text-indigo-600 dark:text-gray-200">
        iCal manipulation API
      </h1>
      <a
        class="font-extralight underline hover:text-indigo-500"
        href="https://github.com/mathieutu">@mathieutu</a
      >
    </div>
    <div>
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
    <label class="input w-auto cursor-pointer">
      <input
        type="checkbox"
        name="grouped"
        checked={data.grouped}
        class="checkbox bg-white!"
        onchange={() => form.requestSubmit()}
      />
      Grouped by Summary
    </label>
    <input type="hidden" name="url" value={data.url} />
  </form>

  <div
    class="card bg-base-100 border-base-300 border text-sm shadow-md
 "
  >
    <ul class="list">
      {#each entries as entry, i (i)}
        <li class="list-row">
          <div class="list-col-grow">
            <div class="font-semibold">{entry.summary}</div>
            <div class="text-xs text-gray-400 uppercase">
              {entry.start}
              {#if entry.start !== entry.end}
                → {entry.end}
              {/if}
              ({entry.totalHours} h){#if entry.location}, {entry.location}{/if}
            </div>
          </div>
          <a
            class="btn btn-square btn-ghost"
            aria-labelledby="title"
            title="Filter by summary"
            href={replaceSearchParams({ summary: entry.summary })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
          </a>
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
