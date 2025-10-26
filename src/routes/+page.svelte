<script lang="ts">
  import { useBookmarks } from '$lib/utils/bookmarks.svelte'
  import { buildUrlWithParams } from '$lib/utils/url'
  import { page } from '$app/state'
  import {
    TagIcon,
    ChatIcon,
    BookmarkIcon,
    ChevronDownIcon,
    CopyIcon,
    XMarkIcon,
    ChartBarIcon,
    SquaresIcon,
    CodeBracketIcon,
    TableCellsIcon,
    InfoCircleIcon,
    ArrowTopRightOnSquareIcon,
    DownloadIcon,
  } from '$lib/components/icons.svelte'
  import BookmarkCard from '$lib/components/BookmarkCard.svelte'

  let mergeUrl: string[] = $state([])
  let mergeUrlToLink = $derived([...mergeUrl.filter(Boolean)])
  let mergeFinalUrl = $derived.by(() => {
    if (!mergeUrlToLink.length) return ''
    return buildUrlWithParams('analyse', page.url, { url: mergeUrlToLink })
  })
  let mergeIcsUrl = $derived.by(() => {
    if (!mergeUrlToLink.length) return ''
    return buildUrlWithParams('ics', page.url, { url: mergeUrlToLink })
  })

  let singleUrl: string = $state('')

  let activeTab = $derived.by(() => {
    const tab = page.url.searchParams.get('tab') ?? 'analyse'
    return ['merge', 'json', 'csv', 'analyse'].includes(tab) ? tab : 'analyse'
  })

  let singleUrlFinalUrl = $derived.by(() => {
    if (!singleUrl.length) return ''
    return buildUrlWithParams(activeTab, page.url, { url: singleUrl })
  })

  const { bookmarkedUrls, addBookmark, removeBookmark } = useBookmarks()

  let showBookmarks = $state(false)
</script>

<svelte:head>
  <title>iCal Tools - Manipulate your calendars with ease</title>
  <meta
    name="description"
    content="Merge, convert and analyze your iCal files with our simple API"
  />
</svelte:head>

<div
  class="from-base-200 via-base-100 to-base-200 min-h-screen w-full bg-gradient-to-br"
>
  <!-- Hero Section -->
  <div class="bg-primary/5 border-primary/10 border-b">
    <div class="container mx-auto max-w-6xl px-4 py-12">
      <div class="text-center">
        <div
          class="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        >
          {@render TagIcon({ class: 'size-4' })}
          Calendar Management API
        </div>
        <h1 class="text-base-content mb-4 text-5xl font-black lg:text-6xl">
          <span class="text-primary">iCal</span> Tools
        </h1>
        <p class="text-base-content/70 mx-auto mb-6 max-w-2xl text-lg">
          Merge multiple calendars, convert them to JSON or CSV, <br />or
          analyze, filter and search their content.
          <br class="hidden sm:block" />
          Enter your URLs and get instant results.
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

  <div class="container mx-auto max-w-6xl px-4 py-8">
    <!-- Bookmarks Section -->
    {#if Object.keys(bookmarkedUrls).length}
      <div class="mb-8">
        <button
          onclick={() => (showBookmarks = !showBookmarks)}
          class="btn btn-ghost mb-4 gap-2"
        >
          {@render BookmarkIcon({ class: 'size-5' })}
          <span class="font-semibold">Your Bookmarked URLs</span>
          <span class="badge badge-primary"
            >{Object.keys(bookmarkedUrls).length}</span
          >
          {@render ChevronDownIcon({
            class: `size-4 transition-transform ${showBookmarks ? 'rotate-180' : ''}`,
          })}
        </button>

        {#if showBookmarks}
          <div class="card bg-base-100 border-base-300 border shadow-xl">
            <div class="card-body p-6">
              <div class="mb-4">
                <h3 class="text-base-content mb-1 text-lg font-bold">
                  Saved Calendars
                </h3>
                <p class="text-base-content/60 text-sm">
                  Quick access to your frequently used calendar URLs and merged
                  feeds
                </p>
              </div>

              <div class="grid gap-3">
                {#each Object.entries(bookmarkedUrls) as [url, name] (url)}
                  <BookmarkCard
                    {url}
                    {name}
                    onRemove={() => removeBookmark(url)}
                  />
                {/each}
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Main Tool Section -->
    <div class="card bg-base-100 shadow-2xl">
      <!-- Tabs -->
      <div
        role="tablist"
        class="tabs tabs-boxed bg-base-200 rounded-b-none p-2"
      >
        <a
          role="tab"
          href="?tab=analyse"
          class="tab gap-2 {activeTab === 'analyse' ? 'tab-active' : ''}"
        >
          {@render ChartBarIcon({ class: 'size-5' })}
          <span class="hidden sm:inline">Analyze</span>
        </a>
        <a
          role="tab"
          href="?tab=merge"
          class="tab gap-2 {activeTab === 'merge' ? 'tab-active' : ''}"
        >
          {@render SquaresIcon({ class: 'size-5' })}
          <span class="hidden sm:inline">Merge</span>
        </a>
        <a
          role="tab"
          href="?tab=json"
          class="tab gap-2 {activeTab === 'json' ? 'tab-active' : ''}"
        >
          {@render CodeBracketIcon({ class: 'size-5' })}
          <span class="hidden sm:inline">JSON</span>
        </a>
        <a
          role="tab"
          href="?tab=csv"
          class="tab gap-2 {activeTab === 'csv' ? 'tab-active' : ''}"
        >
          {@render TableCellsIcon({ class: 'size-5' })}
          <span class="hidden sm:inline">CSV</span>
        </a>
      </div>

      <div class="card-body p-6 lg:p-8">
        <!-- Analyze Tab -->
        {#if activeTab === 'analyse'}
          <div class="space-y-4">
            <div>
              <h2 class="mb-2 text-2xl font-bold">Analyze a Calendar</h2>
              <p class="text-base-content/70 text-sm">
                Get detailed statistics and an overview of your iCal feed with
                powerful filtering and analysis tools.
              </p>
            </div>

            <div class="alert bg-base-200/50">
              {@render InfoCircleIcon({ class: 'size-5 self-start' })}
              <div class="text-sm">
                <div class="mb-1 font-semibold">
                  Powerful Calendar Analytics
                </div>
                <div class="space-y-1 text-xs opacity-70">
                  <div>
                    Track billable hours, analyze time spent on projects, or get
                    insights into your schedule. Filter by date ranges, search
                    events, and calculate totals with hourly rates.
                  </div>
                </div>
                <details class="mt-2">
                  <summary
                    class="hover:text-primary cursor-pointer text-xs font-medium"
                    >Available features</summary
                  >
                  <div class="mt-2 space-y-2 text-xs">
                    <div class="bg-base-300 rounded p-2">
                      <div class="mb-1 font-semibold">📅 Date Filtering</div>
                      <div class="opacity-70">
                        Select custom date ranges or use presets (Last Month,
                        This Month) to analyze specific periods.
                      </div>
                    </div>
                    <div class="bg-base-300 rounded p-2">
                      <div class="mb-1 font-semibold">🔍 Search Events</div>
                      <div class="opacity-70">
                        Filter events by summary/title to focus on specific
                        types of meetings or activities.
                      </div>
                    </div>
                    <div class="bg-base-300 rounded p-2">
                      <div class="mb-1 font-semibold">
                        📊 Sorting & Grouping
                      </div>
                      <div class="opacity-70">
                        Sort by date or summary (ascending/descending). Group
                        events by month or by summary to see totals per
                        category.
                      </div>
                    </div>
                    <div class="bg-base-300 rounded p-2">
                      <div class="mb-1 font-semibold">
                        💰 Hourly Rate Calculation
                      </div>
                      <div class="opacity-70">
                        Set an hourly rate to automatically calculate earnings
                        based on event durations - perfect for freelancers and
                        consultants!
                      </div>
                    </div>
                    <div class="bg-base-300 rounded p-2">
                      <div class="mb-1 font-semibold">📈 Statistics</div>
                      <div class="opacity-70">
                        View total hours, event counts, date ranges, and
                        monetary totals at a glance.
                      </div>
                    </div>
                    <div class="bg-base-300 rounded p-2">
                      <div class="mb-1 font-semibold">💾 Export to CSV</div>
                      <div class="opacity-70">
                        Export your filtered and analyzed data to CSV for
                        further processing in Excel or other tools.
                      </div>
                    </div>
                  </div>
                </details>
                <details class="mt-2">
                  <summary
                    class="hover:text-primary cursor-pointer text-xs font-medium"
                    >Example usage</summary
                  >
                  <div class="bg-base-300 mt-2 rounded p-2 text-xs">
                    <div class="mb-2 font-semibold">
                      Freelancer tracking billable hours for a client:
                    </div>
                    <div class="space-y-1 opacity-70">
                      <div>
                        <strong>Scenario:</strong> You want to invoice Client A for
                        October 2025
                      </div>
                      <div class="mt-2"><strong>Steps:</strong></div>
                      <div class="pl-2">
                        1. Enter your client's calendar URL
                      </div>
                      <div class="pl-2">
                        2. Select date range: October 1-31, 2025
                      </div>
                      <div class="pl-2">3. Filter by summary: "Client A"</div>
                      <div class="pl-2">4. Set hourly rate: €75/h</div>
                      <div class="pl-2">
                        5. Group by: Summary (to see totals per meeting type)
                      </div>
                      <div class="mt-2">
                        <strong>Result:</strong> See all Client A meetings with total
                        hours (e.g., 42.5h) and calculated amount (€3,187.50). Export
                        to CSV for your invoice!
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            <div>
              <input
                bind:value={singleUrl}
                type="url"
                class="input input-bordered w-full"
                placeholder="https://calendar.example.com/feed.ics"
              />
            </div>

            {#if singleUrlFinalUrl}
              <div class="flex justify-end gap-2">
                <button
                  type="button"
                  onclick={() => addBookmark(singleUrlFinalUrl)}
                  class="btn btn-ghost btn-sm gap-2"
                  title="Bookmark this url"
                >
                  {@render BookmarkIcon({ class: 'size-5' })}
                  Bookmark
                </button>
                <a
                  href={singleUrlFinalUrl}
                  class="btn btn-sm gap-2"
                  target="_blank"
                >
                  {@render ArrowTopRightOnSquareIcon({ class: 'size-5' })}
                  Analyse Calendar
                </a>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Merge Tab -->
        {#if activeTab === 'merge'}
          <div class="space-y-4">
            <div>
              <h2 class="mb-2 text-2xl font-bold">Merge Multiple Calendars</h2>
              <p class="text-base-content/70 text-sm">
                Combine as many calendar feeds as needed from different clients,
                schools, organizations, or projects into a single unified feed.
              </p>
            </div>

            <div class="alert bg-base-200/50">
              {@render InfoCircleIcon({ class: 'size-5 self-start' })}
              <div class="text-sm">
                <details class="mt-2">
                  <summary
                    class="hover:text-primary cursor-pointer text-xs font-medium"
                    >Example usage</summary
                  >
                  <div class="bg-base-300 mt-2 rounded p-2 text-xs">
                    <div class="mb-2 font-semibold">
                      Freelance consultant managing multiple clients:
                    </div>
                    <div class="space-y-1 opacity-70">
                      <div><strong>Input URLs:</strong></div>
                      <div class="pl-2">
                        •
                        https://calendar.google.com/calendar/ical/.../client-a-meetings.ics
                      </div>
                      <div class="pl-2">
                        •
                        https://outlook.office365.com/owa/calendar/.../client-b-project.ics
                      </div>
                      <div class="pl-2">
                        •
                        https://calendar.google.com/calendar/ical/.../client-c-deadlines.ics
                      </div>
                      <div class="mt-2"><strong>Generated URL:</strong></div>
                      <div class="pl-2 font-mono text-[10px] break-all">
                        {window.location
                          .origin}/ics?url=https://calendar.google.com/...&url=https://outlook.office365.com/...&url=https://calendar.google.com/...
                      </div>
                      <div class="mt-2">
                        <strong>Result:</strong> One unified calendar showing all
                        client meetings, project milestones, and deadlines across
                        all your engagements!
                      </div>
                    </div>
                  </div>
                </details>
                <details class="mt-2">
                  <summary
                    class="hover:text-primary cursor-pointer text-xs font-medium"
                    >How to use the generated URL</summary
                  >
                  <div class="mt-2 space-y-2 text-xs">
                    <div class="bg-base-300 rounded p-2">
                      <div class="mb-1 font-semibold">1. Copy the ICS URL</div>
                      <div class="opacity-70">
                        After adding your calendar URLs, click "Copy ICS URL"
                        to get your unique merged calendar URL.
                      </div>
                    </div>
                    <div class="bg-base-300 rounded p-2">
                      <div class="mb-1 font-semibold">
                        2. Subscribe in your calendar app
                      </div>
                      <div class="space-y-1 opacity-70">
                        <div>
                          <strong>Google Calendar:</strong> Settings → Add calendar
                          → From URL → Paste your ICS URL
                        </div>
                        <div>
                          <strong>Apple Calendar:</strong> File → New Calendar Subscription
                          → Paste your ICS URL
                        </div>
                        <div>
                          <strong>Outlook:</strong> Add calendar → Subscribe from
                          web → Paste your ICS URL
                        </div>
                      </div>
                    </div>
                    <div class="bg-base-300 rounded p-2">
                      <div class="mb-1 font-semibold">3. Auto-sync</div>
                      <div class="opacity-70">
                        Your calendar app will automatically refresh the merged
                        feed. All events from your source calendars will appear
                        together in one unified view!
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            <div class="space-y-3">
              {#each [...mergeUrlToLink, ''] as _url, i (i)}
                <div class="flex gap-2">
                  <div class="flex-1">
                    <input
                      placeholder="https://calendar.example.com/feed.ics"
                      bind:value={mergeUrl[i]}
                      type="url"
                      class="input input-bordered w-full"
                    />
                  </div>
                  {#if mergeUrl[i]}
                    <button
                      class="btn btn-square btn-ghost"
                      onclick={() => (mergeUrl[i] = '')}
                      title="Remove"
                    >
                      <span class="sr-only">Remove</span>
                      {@render XMarkIcon({ class: 'size-5' })}
                    </button>
                  {/if}
                </div>
              {/each}
            </div>

            {#if mergeFinalUrl}
              <div class="flex justify-end gap-2">
                <button
                  type="button"
                  onclick={() => addBookmark(mergeFinalUrl)}
                  class="btn btn-ghost btn-sm gap-2"
                  title="Bookmark this url"
                >
                  {@render BookmarkIcon({ class: 'size-5' })}
                  Bookmark
                </button>
                <a
                  href={mergeFinalUrl}
                  class="btn btn-primary btn-sm gap-2"
                  title="Analyze merged calendars"
                >
                  {@render ChartBarIcon({ class: 'size-5' })}
                  Analyze Merged Calendars
                </a>
                <button
                  type="button"
                  onclick={() => navigator.clipboard.writeText(mergeIcsUrl)}
                  class="btn btn-primary btn-sm btn-soft gap-2"
                  title="Copy Merged Calendar URL"
                >
                  {@render CopyIcon({ class: 'size-5' })}
                  Copy ICS URL
                </button>
              </div>
            {/if}
          </div>
        {/if}

        <!-- JSON Tab -->
        {#if activeTab === 'json'}
          <div class="space-y-4">
            <div>
              <h2 class="mb-2 text-2xl font-bold">Convert to JSON</h2>
              <p class="text-base-content/70 text-sm">
                Transform an iCal feed into JSON format for easier programmatic
                processing.
              </p>
            </div>

            <div class="alert bg-base-200/50">
              {@render InfoCircleIcon({ class: 'size-5 self-start' })}
              <div class="text-sm">
                <div class="mb-1 font-semibold">JSON Output Format</div>
                <div class="space-y-1 text-xs opacity-70">
                  <div>
                    <strong>Query parameters:</strong>
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >url</code
                    >
                    (required),
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >from</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >to</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >summary</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >sort</code
                    >
                    (date-asc|date-desc|summary-asc|summary-desc),
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >grouped</code
                    >
                    (month|summary),
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >hourlyRate</code
                    >
                  </div>
                  <div>
                    <strong>Returns:</strong> Events with
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >summary</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >start</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >end</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >description</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >location</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >totalHours</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >amount</code
                    > (if hourlyRate set), plus stats.
                  </div>
                </div>
                <details class="mt-2">
                  <summary
                    class="hover:text-primary cursor-pointer text-xs font-medium"
                    >View example output</summary
                  >
                  <pre
                    class="bg-base-300 mt-2 overflow-x-auto rounded p-2 text-xs"><code
                      >{JSON.stringify(
                        {
                          name: 'My Calendar',
                          events: [
                            {
                              summary: 'Team Meeting',
                              start: '2025-10-22T10:00:00.000Z',
                              end: '2025-10-22T11:00:00.000Z',
                              description: 'Weekly sync',
                              location: 'Room 101',
                              totalHours: 1,
                              amount: 50,
                            },
                            {
                              summary: 'Project Review',
                              start: '2025-10-23T14:00:00.000Z',
                              end: '2025-10-23T16:00:00.000Z',
                              description: 'Q4 project review',
                              location: 'Conference Room',
                              totalHours: 2,
                              amount: 100,
                            },
                          ],
                          stats: {
                            totalEventsCount: 10,
                            filteredEventsCount: 2,
                            totalHours: 3,
                            totalAmount: 150,
                            earliestStart: '2025-10-22 10:00',
                            latestEnd: '2025-10-23 16:00',
                          },
                          query: {
                            url: '...',
                            from: '2025-10-01 00:00',
                            to: '2025-10-31 00:00',
                            summary: null,
                            sort: 'date-asc',
                            grouped: null,
                            hourlyRate: '50',
                          },
                        },
                        null,
                        2
                      )}</code
                    ></pre>
                </details>
              </div>
            </div>

            <div>
              <input
                bind:value={singleUrl}
                type="url"
                class="input input-bordered w-full"
                placeholder="https://calendar.example.com/feed.ics"
              />
            </div>

            {#if singleUrlFinalUrl}
              <div class="flex justify-end gap-2">
                <button
                  type="button"
                  onclick={() => addBookmark(singleUrlFinalUrl)}
                  class="btn btn-ghost btn-sm gap-2"
                  title="Bookmark this url"
                >
                  {@render BookmarkIcon({ class: 'size-5' })}
                  Bookmark
                </button>
                <a
                  href={singleUrlFinalUrl}
                  class="btn btn-ghost btn-sm gap-2"
                  target="_blank"
                >
                  {@render ArrowTopRightOnSquareIcon({ class: 'size-5' })}
                  Customize Calendar
                </a>
                <button
                  type="button"
                  onclick={() =>
                    navigator.clipboard.writeText(singleUrlFinalUrl)}
                  class="btn btn-sm gap-2"
                  title="Copy JSON URL"
                >
                  {@render CopyIcon({ class: 'size-5' })}
                  Copy JSON URL
                </button>
              </div>
            {/if}
          </div>
        {/if}

        <!-- CSV Tab -->
        {#if activeTab === 'csv'}
          <div class="space-y-4">
            <div>
              <h2 class="mb-2 text-2xl font-bold">Convert to CSV</h2>
              <p class="text-base-content/70 text-sm">
                Transform an iCal feed into CSV format for spreadsheet
                applications.
              </p>
            </div>

            <div class="alert bg-base-200/50">
              {@render InfoCircleIcon({ class: 'size-5 self-start' })}
              <div class="text-sm">
                <div class="mb-1 font-semibold">CSV Output Format</div>
                <div class="space-y-1 text-xs opacity-70">
                  <div>
                    <strong>Query parameters:</strong> Same as JSON -
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >url</code
                    >
                    (required),
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >from</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >to</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >summary</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >sort</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >grouped</code
                    >,
                    <code class="bg-base-300 rounded px-1 py-0.5 text-xs"
                      >hourlyRate</code
                    >
                  </div>
                  <div>
                    <strong>Returns:</strong> CSV file with columns Summary, Start,
                    End, Total Hours, Amount (if hourlyRate set), plus a TOTAL summary
                    row.
                  </div>
                </div>
                <details class="mt-2">
                  <summary
                    class="hover:text-primary cursor-pointer text-xs font-medium"
                    >View example output</summary
                  >
                  <pre
                    class="bg-base-300 mt-2 overflow-x-auto rounded p-2 text-xs"><code
                      >Summary,Start,End,Total Hours,Amount
"Team Meeting","2025-10-22 10:00","2025-10-22 11:00",1.00,50.00
"Project Review","2025-10-23 14:00","2025-10-23 16:00",2.00,100.00
TOTAL,"2025-10-22 10:00","2025-10-23 16:00",3.00,150.00</code
                    ></pre>
                </details>
              </div>
            </div>

            <div>
              <input
                bind:value={singleUrl}
                type="url"
                class="input input-bordered w-full"
                placeholder="https://calendar.example.com/feed.ics"
              />
            </div>

            {#if singleUrlFinalUrl}
              <div class="flex justify-end gap-2">
                <button
                  type="button"
                  onclick={() => addBookmark(singleUrlFinalUrl)}
                  class="btn btn-ghost btn-sm gap-2"
                  title="Bookmark this url"
                >
                  {@render BookmarkIcon({ class: 'size-5' })}
                  Bookmark
                </button>
                <a
                  href={singleUrlFinalUrl}
                  class="btn btn-ghost btn-sm gap-2"
                  target="_blank"
                >
                  {@render ArrowTopRightOnSquareIcon({ class: 'size-5' })}
                  Customize Calendar
                </a>
                <a href={singleUrlFinalUrl} class="btn btn-sm gap-2">
                  {@render DownloadIcon({ class: 'size-5' })}
                  Download CSV
                </a>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <div class="text-base-content/50 mt-8 text-center text-sm">
      <p>
        All operations are performed on the fly, server-side. No data is stored.
      </p>
    </div>
  </div>
</div>
