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