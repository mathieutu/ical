<script lang="ts">
  import { useBookmarks } from '$lib/utils/bookmarks.svelte'
  import {
    TagIcon,
    ChatIcon,
    BookmarkIcon,
    ChevronDownIcon,
    ChartBarIcon,
    LinkIcon,
    LockClosedIcon,
    SquaresIcon,
  } from '$lib/components/icons.svelte'
  import BookmarkCard from '$lib/components/BookmarkCard.svelte'

  let calendarUrls: string[] = $state([])
  let validUrls = $derived(calendarUrls.filter((url) => url.trim()))

  const bookmarks = useBookmarks()

  const removeUrlField = (index: number) => {
    calendarUrls = calendarUrls.filter((_, i) => i !== index)
  }
</script>

<svelte:head>
  <title>iCal Tools - Manipulate your calendars with ease</title>
  <meta
    name="description"
    content="Merge, convert and analyze your iCal files with our simple API"
  />
</svelte:head>

<div class="from-base-200 via-base-100 to-base-200 min-h-screen w-full bg-gradient-to-br">
  <!-- Hero Section -->
  <div class="bg-primary/5 border-primary/10 border-b">
    <div class="container mx-auto max-w-6xl px-4 py-12">
      <div class="text-center">
        <div
          class="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        >
          {@render TagIcon({ class: 'size-4' })}
          Calendar Management Tool
        </div>
        <h1 class="text-base-content mb-4 text-5xl font-black lg:text-6xl">
          <span class="text-primary">iCal</span> Tools
        </h1>
        <p class="text-base-content/70 mx-auto mb-6 max-w-2xl text-lg">
          Powerful calendar manipulation and analysis tools.
          <br />
          Merge multiple calendars, filter events, calculate billable hours, and export to various formats.
        </p>
        <a
          class="text-base-content/60 hover:text-primary inline-flex items-center gap-2 text-sm transition"
          href="https://github.com/mathieutu"
          target="_blank"
        >
          {@render ChatIcon({ class: 'size-4' })}
          Made by @mathieutu
        </a>
      </div>
    </div>
  </div>

  <div class="container mx-auto max-w-4xl px-4 py-8">
    <!-- Bookmarks Section -->
    {#if Object.keys(bookmarks.urls).length}
      <details class="mb-8 [&[open]_.transition-transform]:rotate-180">
        <summary class="btn btn-ghost mb-4 gap-2">
          {@render BookmarkIcon({ class: 'size-5' })}
          <span class="font-semibold">Bookmarks</span>
          <span class="badge badge-primary">{Object.keys(bookmarks.urls).length}</span>
          {@render ChevronDownIcon({
            class: `size-4 transition-transform`,
          })}
        </summary>
        <div class="card bg-base-100 border-base-300 border shadow-xl">
          <div class="card-body p-6">
            <div class="mb-4">
              <h3 class="text-base-content mb-1 text-lg font-bold">Saved Calendars</h3>
              <p class="text-base-content/60 text-sm">
                Quick access to your bookmarked calendar views
              </p>
            </div>

            <div class="grid gap-3">
              {#each Object.entries(bookmarks.urls) as [url, name] (url)}
                <BookmarkCard {url} {name} onRemove={() => bookmarks.remove(url)} />
              {/each}
            </div>
          </div>
        </div>
      </details>
    {/if}

    <!-- Features Documentation -->
    <div class="mt-12 space-y-8">
      <div class="text-center">
        <h2 class="text-base-content mb-2 text-3xl font-bold">Powerful Features</h2>
        <p class="text-base-content/60">
          Everything you need to manage and analyze your calendar data
        </p>
      </div>

      <!-- Analyze & Filter Feature -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-start gap-4">
            <div class="text-primary bg-primary/10 rounded-full p-2">
              {@render ChartBarIcon({ class: 'size-6' })}
            </div>
            <div class="flex-1">
              <h3 class="mb-2 text-2xl font-bold">Analyze & Filter Events</h3>
              <p class="text-base-content/70 mb-4">
                Get deep insights into your calendar data with powerful filtering and analysis
                tools. Perfect for freelancers tracking billable hours, project managers analyzing
                team time, or anyone wanting to understand their schedule better.
              </p>

              <div class="grid gap-3 sm:grid-cols-2">
                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">📅 Date Range Filtering</div>
                  <p class="text-xs opacity-70">
                    Select custom date ranges or use presets like "Last Month" or "This Month" to
                    analyze specific periods.
                  </p>
                </div>

                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">🔍 Event Search</div>
                  <p class="text-xs opacity-70">
                    Filter events by title/summary to focus on specific types of meetings or
                    activities.
                  </p>
                </div>

                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">📊 Sorting & Grouping</div>
                  <p class="text-xs opacity-70">
                    Sort events by date or name. Group by month or by summary to see totals per
                    category.
                  </p>
                </div>

                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">💰 Hourly Rate Calculator</div>
                  <p class="text-xs opacity-70">
                    Set an hourly rate to automatically calculate earnings based on event durations.
                  </p>
                </div>

                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">📈 Statistics</div>
                  <p class="text-xs opacity-70">
                    View total hours, event counts, date ranges, and monetary totals at a glance.
                  </p>
                </div>

                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">🔖 Bookmarks</div>
                  <p class="text-xs opacity-70">
                    Save your frequently used calendar views for quick access later.
                  </p>
                </div>
              </div>

              <div class="bg-primary/10 border-primary/20 mt-4 rounded-lg border p-4">
                <div class="mb-2 text-sm font-semibold">💡 Example Use Case:</div>
                <p class="text-xs opacity-80">
                  <strong>Freelancer invoicing:</strong> Filter your calendar for "Client A" meetings
                  in October, set your hourly rate to €75/h, and see that you worked 42.5 hours for a
                  total of €3,187.50. Export to CSV and attach to your invoice!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Merge Calendars Feature -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-start gap-4">
            <div class="text-primary bg-primary/10 rounded-full p-2">
              {@render SquaresIcon({ class: 'size-6' })}
            </div>
            <div class="flex-1">
              <h3 class="mb-2 text-2xl font-bold">Merge Multiple Calendars</h3>
              <p class="text-base-content/70 mb-4">
                Combine as many calendar feeds as you need into a single unified view. Perfect for
                managing multiple clients, coordinating between work and personal calendars, or
                consolidating schedules from different platforms.
              </p>

              <div class="space-y-3">
                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">✨ Unlimited Calendars</div>
                  <p class="text-xs opacity-70">
                    Add as many calendar URLs as you need. No limits on the number of sources.
                  </p>
                </div>

                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">🔄 Real-time Sync</div>
                  <p class="text-xs opacity-70">
                    Subscribe to the merged feed URL in your calendar app (Google Calendar, Apple
                    Calendar, Outlook) and it will automatically update as your source calendars
                    change.
                  </p>
                </div>

                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">🎯 All Features Available</div>
                  <p class="text-xs opacity-70">
                    Once merged, use all analysis features on the combined calendar: filter, search,
                    calculate hours, and export.
                  </p>
                </div>
              </div>

              <div class="bg-primary/10 border-primary/20 mt-4 rounded-lg border p-4">
                <div class="mb-2 text-sm font-semibold">💡 Example Use Case:</div>
                <p class="text-xs opacity-80">
                  <strong>Multi-client consultant:</strong> Merge calendars from Client A (Google), Client
                  B (Outlook), and Client C (Apple) into one feed. Subscribe to it in your main calendar
                  app to see all engagements in one place without switching between accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Data Feature -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-start gap-4">
            <div class="text-primary bg-primary/10 rounded-full p-2">
              {@render LinkIcon({ class: 'size-6' })}
            </div>
            <div class="flex-1">
              <h3 class="mb-2 text-2xl font-bold">Export to Any Format</h3>
              <p class="text-base-content/70 mb-4">
                Export your calendar data in the format that works best for your workflow. All
                exports respect your filters and include calculated fields like total hours and
                amounts.
              </p>

              <div class="grid gap-3 sm:grid-cols-3">
                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">📋 CSV Export</div>
                  <p class="mb-2 text-xs opacity-70">
                    Download as CSV for any spreadsheet application.
                  </p>
                  <code class="bg-base-300 rounded px-1 py-0.5 text-[10px]">
                    Summary,Start,End,Hours,Amount
                  </code>
                </div>

                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">{'{ }'} JSON API</div>
                  <p class="mb-2 text-xs opacity-70">
                    Get structured JSON data for custom integrations and automation.
                  </p>
                  <code class="bg-base-300 rounded px-1 py-0.5 text-[10px]">
                    /json?urls=...&from=...
                  </code>
                </div>

                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">📅 ICS Feed</div>
                  <p class="mb-2 text-xs opacity-70">
                    Subscribe to filtered/merged calendar in any calendar app.
                  </p>
                  <code class="bg-base-300 rounded px-1 py-0.5 text-[10px]">
                    /ics?urls=...&summary=...
                  </code>
                </div>
              </div>
              <div class="bg-base-200/50 mt-2 rounded-lg p-3">
                <div class="mb-1 font-semibold">✨ Auto-sync</div>
                <p class="mb-2 text-xs opacity-70">
                  Your calendar app will automatically refresh the feed periodically. Any changes to
                  your filters or source calendars will be reflected automatically!
                </p>
              </div>

              <div class="bg-primary/10 border-primary/20 mt-4 rounded-lg border p-4">
                <div class="mb-2 text-sm font-semibold">💡 Example Use Case:</div>
                <p class="mb-3 text-xs opacity-80">
                  <strong>Subscribe to Filtered Calendar:</strong>
                  You want to track all "Sprint Planning" and "Retrospective" meetings across multiple
                  team calendars in your personal calendar app, without all the noise.
                </p>
                <div class="text-xs opacity-80">
                  <div><strong>Steps:</strong></div>
                  <ol class="list-inside list-decimal pl-2">
                    <li>
                      Add your team calendar URLs and filter by summary (e.g., "Sprint" or "Retro")
                    </li>
                    <li>Click "Copy calendar URL" in the export dropdown on the analysis page</li>
                    <li>
                      Subscribe in your calendar app:
                      <ul class="list-inside list-disc pl-2 text-xs">
                        <li class="">
                          Google Calendar:
                          <span class="opacity-70"
                            >Settings → "Add calendar" → "From URL" → Paste ICS URL → Add calendar</span
                          >
                        </li>
                        <li class="">
                          Apple Calendar:
                          <span class="opacity-70"
                            >File → "New Calendar Subscription" → Paste ICS URL → Subscribe</span
                          >
                        </li>
                        <li class="">
                          Outlook:
                          <span class="opacity-70"
                            >Add calendar → "Subscribe from web" → Paste ICS URL → Import</span
                          >
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy Feature -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-start gap-4">
            <div class="text-primary bg-primary/10 rounded-full p-2">
              {@render LockClosedIcon({ class: 'size-6' })}
            </div>
            <div class="flex-1">
              <h3 class="mb-2 text-2xl font-bold">Privacy & Security First</h3>
              <p class="text-base-content/70 mb-4">
                Your calendar data is sensitive. We take privacy seriously with a zero-storage
                architecture.
              </p>

              <div class="grid gap-3 sm:grid-cols-2">
                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">🚫 No Data Storage</div>
                  <p class="text-xs opacity-70">
                    All processing happens on-the-fly, in lambda functions ran when you request it.
                    We never save your calendar data to disk or memory.
                  </p>
                </div>

                <div class="bg-base-200/50 rounded-lg p-3">
                  <div class="mb-1 font-semibold">📝 No Logging</div>
                  <p class="text-xs opacity-70">
                    We don't log your calendar URLs or event data. Bookmarks are stored in your
                    browser's local storage and can be cleared anytime.
                  </p>
                </div>
              </div>

              <div class="bg-primary/10 border-primary/20 mt-4 rounded-lg border p-4">
                <div class="mb-2 text-sm font-semibold">💡 Open source</div>
                <p class="text-xs opacity-80">
                  This tool is built with transparency in mind. Check out the <a
                    class="link"
                    href="https://github.com/mathieutu/ical">source code</a
                  > to see exactly how your data is processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action Form -->
    <div
      class="card from-primary/10 to-accent/10 border-primary/20 mt-12 border-2 bg-gradient-to-br shadow-2xl"
    >
      <div class="card-body p-8 text-center">
        <h2 class="mb-2 text-3xl font-bold">Ready to Get Started?</h2>
        <p class="text-base-content/70 mb-6">
          Enter your calendar feed URLs below to begin analyzing, merging, and exporting your
          events.
        </p>

        <form action="/analyse" method="GET" class="mx-auto w-full max-w-2xl space-y-4">
          <div class="space-y-3">
            {#each [...validUrls, ''] as url, i (i)}
              <div class="input w-full">
                <label for="calendar-url-{i}" class="sr-only">
                  Calendar feed URL {i + 1}
                </label>
                <input
                  id="calendar-url-{i}"
                  bind:value={calendarUrls[i]}
                  name="urls"
                  type="url"
                  class=""
                  placeholder="https://calendar.example.com/feed{i ? `_${i + 1}` : ''}.ics"
                  required={i === 0}
                  aria-label="Calendar feed URL {i + 1}"
                />
                {#if validUrls.length > 1 && url}
                  <button
                    type="button"
                    class="label text-base-content/40 hover:text-base-content cursor-pointer"
                    onclick={() => removeUrlField(i)}
                    title="Remove calendar URL {i + 1}"
                  >
                    ×
                  </button>
                {/if}
              </div>
            {/each}
          </div>

          <div class="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="submit"
              class="btn btn-primary btn-outline"
              disabled={validUrls.length === 0}
            >
              {validUrls.length > 1 ? `Merge and Analyse Calendars` : 'Analyse Calendar'}
            </button>
          </div>
        </form>

        <div class="text-base-content/50 mt-6 text-sm">
          <p>All operations are performed on the fly, server-side. No data is stored.</p>
        </div>
      </div>
    </div>
  </div>
</div>
