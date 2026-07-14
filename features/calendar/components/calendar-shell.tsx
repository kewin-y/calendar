"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CalendarToolbar } from "./calendar-toolbar"
import {
  formatDateParam,
  getNextDate,
  getPreviousDate,
  getRangeLabel,
  getVisibleRange,
  isCalendarView,
  parseDateParam,
  startOfDay,
  type CalendarView,
} from "../lib/date-utils"

export function CalendarShell() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const view = getView(searchParams.get("view"))
  const date = parseDateParam(searchParams.get("date"))
  const visibleRange = getVisibleRange(view, date)

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

      <section className="flex flex-1 flex-col p-4">
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            {view.toUpperCase()} VIEW
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {getRangeLabel(view, date)}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Visible range: {visibleRange.start.toLocaleDateString()} –{" "}
            {visibleRange.end.toLocaleDateString()}. Calendar grid rendering starts
            in phase 3.
          </p>
        </div>
      </section>
    </main>
  )
}

function getView(value: string | null): CalendarView {
  if (isCalendarView(value)) {
    return value
  }

  return "week"
}
