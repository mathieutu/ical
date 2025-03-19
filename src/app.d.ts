// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}

import type {
  CalendarRangeProps,
  CalendarMonthProps,
  CalendarDateProps,
} from 'cally'

import 'svelte/elements'

type MapEvents<T> = {
  [K in keyof T as K extends `on${infer E}` ? `on${Lowercase<E>}` : K]: T[K]
}

declare module 'svelte/elements' {
  export interface SvelteHTMLElements {
    'calendar-range': MapEvents<CalendarRangeProps>
    'calendar-month': MapEvents<CalendarMonthProps>
    'calendar-date': MapEvents<CalendarDateProps>
  }
}
