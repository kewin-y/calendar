export type CalendarView = "day" | "week" | "month"

const DAY_MS = 24 * 60 * 60 * 1000

export function isCalendarView(value: string | null): value is CalendarView {
  return value === "day" || value === "week" || value === "month"
}

export function parseDateParam(value: string | null) {
  if (value === null || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return startOfDay(new Date())
  }

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return startOfDay(new Date())
  }

  return date
}

export function formatDateParam(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

export function startOfWeek(date: Date) {
  return addDays(startOfDay(date), -date.getDay())
}

export function endOfWeek(date: Date) {
  return addDays(startOfWeek(date), 7)
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1)
}

export function getVisibleRange(view: CalendarView, date: Date) {
  if (view === "day") {
    const start = startOfDay(date)
    return { start, end: addDays(start, 1) }
  }

  if (view === "week") {
    return { start: startOfWeek(date), end: endOfWeek(date) }
  }

  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)

  return {
    start: startOfWeek(monthStart),
    end: addDays(startOfWeek(monthEnd), 7),
  }
}

export function getMonthGridDays(date: Date) {
  const { start, end } = getVisibleRange("month", date)
  const days: Date[] = []

  for (let day = start; day < end; day = addDays(day, 1)) {
    days.push(day)
  }

  return days
}

export function getTimeSlotDate(date: Date, hour: number, minute = 0) {
  const slot = startOfDay(date)
  slot.setHours(hour, minute, 0, 0)
  return slot
}

export function getNextDate(view: CalendarView, date: Date) {
  if (view === "day") return addDays(date, 1)
  if (view === "week") return addDays(date, 7)
  return addMonths(date, 1)
}

export function getPreviousDate(view: CalendarView, date: Date) {
  if (view === "day") return addDays(date, -1)
  if (view === "week") return addDays(date, -7)
  return addMonths(date, -1)
}

export function getRangeLabel(view: CalendarView, date: Date) {
  if (view === "day") {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  if (view === "week") {
    const { start, end } = getVisibleRange("week", date)
    return `${formatShortDate(start)} – ${formatShortDate(addDays(end, -1))}`
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(date)
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export { DAY_MS }
