// @ts-expect-error - no types available
import ICAL from "ical.js";

export const fetchCalendar = async (url: string): ICAL.Component => {
    const data = await fetch(url).then((response) => response.text());
    try {
        const jcalData = ICAL.parse(data);
        return new ICAL.Component(jcalData);
    } catch (e) {

        console.error(e);
        throw new Error(`Invalid iCal data for URL: "${url}"`)
    }
}