import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  format,
  isValid,
  parse,
  set,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns"

export type CalendarView = "day" | "week" | "month"

export const DAY_MS = 24 * 60 * 60 * 1000

const SUNDAY_WEEK_START = { weekStartsOn: 0 as const }

export function isCalendarView(value: string | null): value is CalendarView {
  return value === "day" || value === "week" || value === "month"
}

export function parseDateParam(value: string | null) {
  if (value === null) {
    return startOfDay(new Date())
  }

  const date = parse(value, "yyyy-MM-dd", new Date())

  if (!isValid(date) || format(date, "yyyy-MM-dd") !== value) {
    return startOfDay(new Date())
  }

  return date
}

export function formatDateParam(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export function getVisibleRange(view: CalendarView, date: Date) {
  if (view === "day") {
    const start = startOfDay(date)
    return { start, end: addDays(start, 1) }
  }

  if (view === "week") {
    const start = startOfWeek(date, SUNDAY_WEEK_START)
    return { start, end: addWeeks(start, 1) }
  }

  const monthStart = startOfMonth(date)
  const nextMonthStart = addMonths(monthStart, 1)

  return {
    start: startOfWeek(monthStart, SUNDAY_WEEK_START),
    end: addWeeks(startOfWeek(nextMonthStart, SUNDAY_WEEK_START), 1),
  }
}

export function getMonthGridDays(date: Date) {
  const { start, end } = getVisibleRange("month", date)

  return eachDayOfInterval({
    start,
    end: addDays(end, -1),
  })
}

export function getTimeSlotDate(date: Date, hour: number, minute = 0) {
  return set(startOfDay(date), {
    hours: hour,
    minutes: minute,
    seconds: 0,
    milliseconds: 0,
  })
}

export function getNextDate(view: CalendarView, date: Date) {
  if (view === "day") return addDays(date, 1)
  if (view === "week") return addWeeks(date, 1)
  return addMonths(date, 1)
}

export function getPreviousDate(view: CalendarView, date: Date) {
  if (view === "day") return addDays(date, -1)
  if (view === "week") return addWeeks(date, -1)
  return addMonths(date, -1)
}

export function getRangeLabel(view: CalendarView, date: Date) {
  if (view === "day") {
    return format(date, "EEEE, MMMM d, yyyy")
  }

  if (view === "week") {
    const { start, end } = getVisibleRange("week", date)
    return `${formatShortDate(start)} – ${formatShortDate(addDays(end, -1))}`
  }

  return format(date, "MMMM yyyy")
}

function formatShortDate(date: Date) {
  return format(date, "MMM d, yyyy")
}
