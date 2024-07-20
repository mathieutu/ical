import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
// @ts-expect-error - no types available
import ICAL from "ical.js";

export const GET: RequestHandler = async ({ url }) => {
  const icalUrls = url.searchParams.getAll("url");

  if (!icalUrls.length) {
    return error(400, "No URLs provided");
  }

  const calendars: ICAL.Component[] = await Promise.all(
    icalUrls.map(async (url) => {
      const data = await fetch(url).then((response) => response.text());

      try {
        const jcalData = ICAL.parse(data);
        return new ICAL.Component(jcalData);
      } catch (e) {
        console.error(e);
        error(400, `Invalid iCal data for URL: "${url}"`);
      }
    }),
  );

  const mergedCalendar = new ICAL.Component(["vcalendar", [], []]);

  const mergedEvents = [
    ...mergedCalendar.getAllSubcomponents("vevent"),
    ...calendars
      .map((calendar) => calendar.getAllSubcomponents("vevent"))
      .flat(),
  ];

  mergedEvents.forEach((event) => {
    mergedCalendar.addSubcomponent(event);
  });

  const newIcal = mergedCalendar.toString();

  return new Response(newIcal, {
    headers: { "Content-Type": "text/calendar" },
  });
};
