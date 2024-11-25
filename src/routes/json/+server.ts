import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
// @ts-expect-error - no types available
import ICAL from "ical.js";
import { fetchCalendar } from "$lib/utils/calendar.server";

export const GET: RequestHandler = async ({ url }) => {
  const icalUrl = url.searchParams.get("url");

  if (!icalUrl?.length) {
    return error(400, "No URL provided");
  }

  const calendar: ICAL.Component = await fetchCalendar(icalUrl).catch((e: Error) => error(400, e.message));
  
  const calendarJson = {
    name: calendar.getFirstPropertyValue('x-wr-calname'),
    description: calendar.getFirstPropertyValue('x-wr-caldesc'),
    timezone: calendar.getFirstPropertyValue('x-wr-timezone'),
    events: calendar.getAllSubcomponents('vevent').map(ev => ({
      summary: ev.getFirstPropertyValue('summary'),
      description: ev.getFirstPropertyValue('description'),
      location: ev.getFirstPropertyValue('location'),
      start: ev.getFirstPropertyValue('dtstart').toString(),
      end: ev.getFirstPropertyValue('dtend').toString()
    }))
  };


  return new Response(JSON.stringify(calendarJson), {
    headers: { "Content-Type": "application/json" },
  });
};