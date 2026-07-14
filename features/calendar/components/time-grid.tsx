import { addDays, format, isSameDay, isToday, startOfDay } from "date-fns"
import { type Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { getVisibleRange } from "../lib/date-utils"
import { EventCard } from "./event-card"

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)
const HOUR_HEIGHT = 64

export function TimeGrid({
  date,
  events,
  days = 1,
}: {
  date: Date
  events: Doc<"events">[]
  days?: 1 | 7
}) {
  const rangeStart = days === 7 ? getVisibleRange("week", date).start : startOfDay(date)
  const visibleDays = Array.from({ length: days }, (_, index) => addDays(rangeStart, index))

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card">
      <div className="grid border-b bg-background" style={{ gridTemplateColumns: `4rem repeat(${days}, minmax(0, 1fr))` }}>
        <div />
        {visibleDays.map((day) => (
          <div key={day.toISOString()} className="border-l px-2 py-2 text-center">
            <div className="text-xs font-medium uppercase text-muted-foreground">{format(day, "EEE")}</div>
            <div className={cn("mx-auto mt-1 flex size-8 items-center justify-center rounded-full text-sm font-semibold", isToday(day) && "bg-primary text-primary-foreground")}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="grid flex-1 overflow-auto" style={{ gridTemplateColumns: `4rem repeat(${days}, minmax(0, 1fr))` }}>
        <div className="relative" style={{ height: HOURS.length * HOUR_HEIGHT }}>
          {HOURS.map((hour) => (
            <div key={hour} className="relative border-b pr-2 text-right text-xs text-muted-foreground" style={{ height: HOUR_HEIGHT }}>
              <span className="relative -top-2 bg-card px-1">{hour === 0 ? "" : format(new Date(2000, 0, 1, hour), "ha")}</span>
            </div>
          ))}
        </div>

        {visibleDays.map((day) => (
          <div key={day.toISOString()} className="relative border-l" style={{ height: HOURS.length * HOUR_HEIGHT }}>
            {HOURS.map((hour) => (
              <div key={hour} className="border-b" style={{ height: HOUR_HEIGHT }} />
            ))}
            {events
              .filter((event) => isSameDay(event.startAt, day))
              .map((event) => (
                <PositionedEvent key={event._id} event={event} />
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function PositionedEvent({ event }: { event: Doc<"events"> }) {
  const start = new Date(event.startAt)
  const end = new Date(event.endAt)
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const durationMinutes = Math.max(30, (end.getTime() - start.getTime()) / 60000)

  return (
    <div
      className="absolute right-1 left-1 z-10"
      style={{
        top: (startMinutes / 60) * HOUR_HEIGHT,
        height: (durationMinutes / 60) * HOUR_HEIGHT,
      }}
    >
      <EventCard event={event} className="h-full" />
    </div>
  )
}
