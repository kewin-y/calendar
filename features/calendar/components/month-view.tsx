import { format, isSameDay, isSameMonth, isToday } from "date-fns"
import { type Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { getMonthGridDays } from "../lib/date-utils"
import { EventCard } from "./event-card"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function MonthView({
  date,
  events,
  onCreateEvent,
  onEditEvent,
}: {
  date: Date
  events: Doc<"events">[]
  onCreateEvent: (start: Date) => void
  onEditEvent: (event: Doc<"events">) => void
}) {
  const days = getMonthGridDays(date)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card">
      <div className="grid grid-cols-7 border-b bg-muted/40">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
            {weekday}
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7 auto-rows-fr overflow-hidden">
        {days.map((day) => {
          const dayEvents = events.filter((event) => eventOccursOnDay(event, day))

          return (
            <div
              key={day.toISOString()}
              onDoubleClick={() => onCreateEvent(day)}
              className={cn(
                "min-h-28 overflow-hidden border-r border-b p-2 last:border-r-0",
                !isSameMonth(day, date) && "bg-muted/30 text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "mb-1 flex size-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <EventCard key={event._id} event={event} compact onClick={onEditEvent} />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function eventOccursOnDay(event: Doc<"events">, day: Date) {
  return isSameDay(event.startAt, day) || (event.startAt < day.getTime() && event.endAt > day.getTime())
}
