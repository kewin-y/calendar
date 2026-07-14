"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        View
        <Select
          value={view}
          onValueChange={(value) => onViewChange(value as CalendarView)}
        >
          <SelectTrigger aria-label="Calendar view">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}
