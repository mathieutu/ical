import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import ICAL from "ical.js";
import { fetchCalendar, parseCalendar } from "$lib/utils/calendar.server";

export const GET: RequestHandler = async ({ url }) => {
      const icalUrl = url.searchParams.get("url");
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      const summary = url.searchParams.get("summary");
      const sort = url.searchParams.get("sort") || "date-asc";

      if (!icalUrl?.length) {
        return error(400, "No URL provided");
      }

      const calendar: ICAL.Component = await fetchCalendar(icalUrl).catch((e: Error) => error(400, e.message));
      const calendarJson = parseCalendar(calendar);

      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;

  const sortedEvents = calendarJson.events
    .filter(event => {
        const matchesFrom = fromDate && event.start ? new Date(event.start) >= fromDate : true;
        const matchesTo = toDate && event.end ? new Date(event.end) <= toDate : true;
        const matchesTitle = summary && event.summary ? event.summary.includes(summary) : true;

        return matchesFrom && matchesTo && matchesTitle;
      })
    .sort((a, b) => {
      const [field, order] = sort.split("-");

      const handleOrder = (value: number) => order === "desc" ? value * -1 : value;

      if (field === "date") {
        return handleOrder(new Date(a.start || 0).getTime() - new Date(b.start || 0).getTime())
      }

      if (field === "summary") {
        return handleOrder((a.summary || '').localeCompare(b.summary || ''));
      }

      return 0
    })

      const filteredCalendarJson = { ...calendarJson, events: sortedEvents };

      return new Response(JSON.stringify(filteredCalendarJson), {
        headers: { "Content-Type": "application/json" },
      });
    };
