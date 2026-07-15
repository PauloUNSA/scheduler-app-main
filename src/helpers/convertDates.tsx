import { AgendaEntry } from 'react-native-calendars';
import { Event } from '../interfaces/storeInterfaces';

export interface DateItem extends AgendaEntry {
    event: Event
}

export interface Dates {
    [date: string]: DateItem[]
}

export const convertDates = (events: Event[] = []) => {
    const dates: Dates = {};

    if (!events) {return dates;}

    events.forEach((event) => {

        const dateStr = flatDate(event.start);

        if (!Object.hasOwn(dates, dateStr)) {
            dates[dateStr] = [];
            dates[dateStr].push({
                day: dateStr,
                name: event.title,
                height: 200,
                event,
            });
        } else {
            dates[dateStr].push({
                day: dateStr,
                name: event.title,
                height: 200,
                event,
            });
        }
    });
    return dates;
};

export const flatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-ZA').replaceAll('/', '-');
};
