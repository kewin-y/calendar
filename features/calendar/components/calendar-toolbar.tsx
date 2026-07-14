"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type CalendarView } from "../lib/date-utils"

export function CalendarToolbar({
  view,
  label,
  onToday,
  onPrevious,
  onNext,
  onViewChange,
}: {
  view: CalendarView
  label: string
  onToday: () => void
  onPrevious: () => void
  onNext: () => void
  onViewChange: (view: CalendarView) => void
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Calendar</h1>
        <Button variant="outline" onClick={onToday}>
          Today
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onPrevious} aria-label="Previous range">
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext} aria-label="Next range">
            <ChevronRight />
          </Button>
        </div>
        <div className="text-lg font-medium">{label}</div>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        View
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={view}
          onChange={(event) => onViewChange(event.target.value as CalendarView)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </label>
    </header>
  )
}
