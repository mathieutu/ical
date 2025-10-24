import type { RequestHandler } from './$types'
import type { Response } from '../json/+server'
import { format, toDate as date } from 'date-fns'
import { redirect } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, fetch }) => {
  if (!url.searchParams.get('url')) {
    return redirect(303, '/?tab=csv')
  }

  // Fetch data from the JSON route
  const res = await fetch(`/json?${url.searchParams.toString()}`)
  const calendar: Response = await res.json()

  const { events, stats } = calendar

  // Convert to CSV
  const headers = ['Summary', 'Start', 'End', 'Total Hours']
  if (stats.totalAmount) {
    headers.push('Amount')
  }

  const escapeCsvValue = (
    value: string | number | null | undefined
  ): string => {
    if (value === null || value === undefined) return ''

    const stringValue = String(value)
    if (
      stringValue.includes(',') ||
      stringValue.includes('"') ||
      stringValue.includes('\n')
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }

    return stringValue
  }

  const rows = events.map((event) => {
    const row = [
      escapeCsvValue(event.summary),
      escapeCsvValue(format(date(event.start), 'yyyy-MM-dd HH:mm')),
      escapeCsvValue(format(date(event.end), 'yyyy-MM-dd HH:mm')),
      escapeCsvValue(event.totalHours.toFixed(2)),
    ]
    if (event.amount) {
      row.push(escapeCsvValue(event.amount?.toFixed(2)))
    }
    return row.join(',')
  })

  // Add summary row
  const summaryRow = [
    'TOTAL',
    escapeCsvValue(stats.earliestStart),
    escapeCsvValue(stats.latestEnd),
    escapeCsvValue(stats.totalHours.toFixed(2)),
  ]
  if (stats.totalAmount) {
    summaryRow.push(escapeCsvValue(stats.totalAmount?.toFixed(2)))
  }
  rows.push(summaryRow.join(','))

  const csv = [headers.join(','), ...rows].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="calendar-export-${format(new Date(), 'yyyy-MM-dd')}.csv"`,
    },
  })
}
