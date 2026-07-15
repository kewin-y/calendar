"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { startOfDay } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { type Doc } from "@/convex/_generated/dataModel"
import { CalendarToolbar } from "./calendar-toolbar"
import { DayView } from "./day-view"
import { EventDialog } from "./event-dialog"
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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Doc<"events"> | null>(null)
  const [initialStart, setInitialStart] = useState(date)
  const events = useQuery(api.events.queries.listForRange, {
    rangeStart: visibleRange.start.getTime(),
    rangeEnd: visibleRange.end.getTime(),
  })

  function openCreateEvent(start: Date) {
    setSelectedEvent(null)
    setInitialStart(start)
    setDialogOpen(true)
  }

  function openEditEvent(event: Doc<"events">) {
    setSelectedEvent(event)
    setInitialStart(new Date(event.startAt))
    setDialogOpen(true)
  }

  function navigate(next: { view?: CalendarView; date?: Date }) {
    const params = new URLSearchParams(searchParams)
    params.set("view", next.view ?? view)
    params.set("date", formatDateParam(next.date ?? date))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <main className="flex h-svh flex-col overflow-hidden bg-background text-foreground">
      <CalendarToolbar
        view={view}
        label={getRangeLabel(view, date)}
        onToday={() => navigate({ date: startOfDay(new Date()) })}
        onPrevious={() => navigate({ date: getPreviousDate(view, date) })}
        onNext={() => navigate({ date: getNextDate(view, date) })}
        onViewChange={(nextView) => navigate({ view: nextView })}
        onCreateEvent={() => openCreateEvent(new Date())}
      />

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        {events === undefined ? (
          <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
            Loading calendar…
          </div>
        ) : (
          <CalendarViewRenderer
            view={view}
            date={date}
            events={events}
            onCreateEvent={openCreateEvent}
            onEditEvent={openEditEvent}
          />
        )}
      </section>

      {dialogOpen && (
        <EventDialog
          key={selectedEvent?._id ?? initialStart.toISOString()}
          open={dialogOpen}
          event={selectedEvent}
          initialStart={initialStart}
          onOpenChange={setDialogOpen}
        />
      )}
    </main>
  )
}

function CalendarViewRenderer({
  view,
  date,
  events,
  onCreateEvent,
  onEditEvent,
}: {
  view: CalendarView
  date: Date
  events: Doc<"events">[]
  onCreateEvent: (start: Date) => void
  onEditEvent: (event: Doc<"events">) => void
}) {
  if (view === "day") {
    return (
      <DayView
        date={date}
        events={events}
        onCreateEvent={onCreateEvent}
        onEditEvent={onEditEvent}
      />
    )
  }

  if (view === "month") {
    return (
      <MonthView
        date={date}
        events={events}
        onCreateEvent={onCreateEvent}
        onEditEvent={onEditEvent}
      />
    )
  }

  return (
    <WeekView
      date={date}
      events={events}
      onCreateEvent={onCreateEvent}
      onEditEvent={onEditEvent}
    />
  )
}

function getView(value: string | null): CalendarView {
  if (isCalendarView(value)) {
    return value
  }

  return "week"
}
