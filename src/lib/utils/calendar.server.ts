import ICAL from "ical.js";

export const fetchCalendar = async (url: string): Promise<ICAL.Component> => {
    const data = await fetch(url).then((response) => response.text());
    try {
        const jcalData = ICAL.parse(data);
        return new ICAL.Component(jcalData);
    } catch (e) {

        console.error(e);
        throw new Error(`Invalid iCal data for URL: "${url}"`)
    }
}

export type Event = {
    summary: string | undefined;
    description: string | undefined;
    location: string | undefined;
    start: string | undefined;
    end: string | undefined;
}

export type Calendar = {
    name: string | undefined;
    description: string | undefined;
    timezone: string | undefined;
    events: Event[];
}
export const parseCalendar = (calendar: ICAL.Component): Calendar => ({
    name: calendar.getFirstPropertyValue("x-wr-calname")?.toString(),
    description: calendar.getFirstPropertyValue("x-wr-caldesc")?.toString(),
    timezone: calendar.getFirstPropertyValue("x-wr-timezone")?.toString(),
    events: calendar.getAllSubcomponents("vevent").map(ev => ({
        summary: ev.getFirstPropertyValue("summary")?.toString(),
        description: ev.getFirstPropertyValue("description")?.toString(),
        location: ev.getFirstPropertyValue("location")?.toString(),
        start: ev.getFirstPropertyValue("dtstart")?.toString(),
        end: ev.getFirstPropertyValue("dtend")?.toString()
    }))
});
