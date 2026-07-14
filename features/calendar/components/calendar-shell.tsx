"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { startOfDay } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { type Doc } from "@/convex/_generated/dataModel"
import { CalendarToolbar } from "./calendar-toolbar"
import { DayView } from "./day-view"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import {
  formatDateParam,
  getNextDate,
  getPreviousDate,
  getRangeLabel,
  getVisibleRange,
  isCalendarView,
  parseDateParam,
  type CalendarView,
} from "../lib/date-utils"

export function CalendarShell() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const view = getView(searchParams.get("view"))
  const date = parseDateParam(searchParams.get("date"))
  const visibleRange = getVisibleRange(view, date)
  const events = useQuery(api.events.queries.listForRange, {
    rangeStart: visibleRange.start.getTime(),
    rangeEnd: visibleRange.end.getTime(),
  })

  function navigate(next: { view?: CalendarView; date?: Date }) {
    const params = new URLSearchParams(searchParams)
    params.set("view", next.view ?? view)
    params.set("date", formatDateParam(next.date ?? date))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <CalendarToolbar
        view={view}
        label={getRangeLabel(view, date)}
        onToday={() => navigate({ date: startOfDay(new Date()) })}
        onPrevious={() => navigate({ date: getPreviousDate(view, date) })}
        onNext={() => navigate({ date: getNextDate(view, date) })}
        onViewChange={(nextView) => navigate({ view: nextView })}
      />

      <section className="flex min-h-0 flex-1 flex-col p-4">
        {events === undefined ? (
          <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
            Loading calendar…
          </div>
        ) : (
          <CalendarViewRenderer view={view} date={date} events={events} />
        )}
      </section>
    </main>
  )
}

function CalendarViewRenderer({
  view,
  date,
  events,
}: {
  view: CalendarView
  date: Date
  events: Doc<"events">[]
}) {
  if (view === "day") {
    return <DayView date={date} events={events} />
  }

  if (view === "month") {
    return <MonthView date={date} events={events} />
  }

  return <WeekView date={date} events={events} />
}

function getView(value: string | null): CalendarView {
  if (isCalendarView(value)) {
    return value
  }

  return "week"
}
