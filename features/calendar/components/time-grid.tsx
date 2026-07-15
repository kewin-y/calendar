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
  onCreateEvent,
  onEditEvent,
}: {
  date: Date
  events: Doc<"events">[]
  days?: 1 | 7
  onCreateEvent: (start: Date) => void
  onEditEvent: (event: Doc<"events">) => void
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

        {visibleDays.map((day) => {
          const dayEvents = getPositionedEvents(
            events.filter((event) => isSameDay(event.startAt, day)),
          )

          return (
            <div key={day.toISOString()} className="relative border-l" style={{ height: HOURS.length * HOUR_HEIGHT }}>
              {HOURS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  className="block w-full border-b text-left"
                  style={{ height: HOUR_HEIGHT }}
                  onDoubleClick={() => {
                    const start = startOfDay(day)
                    start.setHours(hour, 0, 0, 0)
                    onCreateEvent(start)
                  }}
                  aria-label={`Create event on ${format(day, "MMM d")} at ${format(new Date(2000, 0, 1, hour), "h a")}`}
                />
              ))}
              {dayEvents.map((positionedEvent) => (
                <PositionedEvent
                  key={positionedEvent.event._id}
                  positionedEvent={positionedEvent}
                  onEditEvent={onEditEvent}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type PositionedCalendarEvent = {
  event: Doc<"events">
  column: number
  columnCount: number
}

function PositionedEvent({
  positionedEvent,
  onEditEvent,
}: {
  positionedEvent: PositionedCalendarEvent
  onEditEvent: (event: Doc<"events">) => void
}) {
  const { event, column, columnCount } = positionedEvent
  const start = new Date(event.startAt)
  const end = new Date(event.endAt)
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const durationMinutes = Math.max(30, (end.getTime() - start.getTime()) / 60000)
  const width = 100 / columnCount

  return (
    <div
      className="absolute z-10 px-0.5"
      style={{
        top: (startMinutes / 60) * HOUR_HEIGHT,
        height: (durationMinutes / 60) * HOUR_HEIGHT,
        left: `${column * width}%`,
        width: `${width}%`,
      }}
    >
      <EventCard event={event} className="h-full" onClick={onEditEvent} />
    </div>
  )
}

function getPositionedEvents(events: Doc<"events">[]): PositionedCalendarEvent[] {
  const sortedEvents = [...events].sort((a, b) => {
    if (a.startAt !== b.startAt) return a.startAt - b.startAt
    return a.endAt - b.endAt
  })
  const clusters: Doc<"events">[][] = []
  let currentCluster: Doc<"events">[] = []
  let currentClusterEnd = 0

  for (const event of sortedEvents) {
    if (currentCluster.length === 0 || event.startAt < currentClusterEnd) {
      currentCluster.push(event)
      currentClusterEnd = Math.max(currentClusterEnd, event.endAt)
      continue
    }

    clusters.push(currentCluster)
    currentCluster = [event]
    currentClusterEnd = event.endAt
  }

  if (currentCluster.length > 0) {
    clusters.push(currentCluster)
  }

  return clusters.flatMap(positionCluster)
}

function positionCluster(events: Doc<"events">[]): PositionedCalendarEvent[] {
  const columns: Doc<"events">[][] = []
  const positionedEvents: PositionedCalendarEvent[] = []

  for (const event of events) {
    const column = columns.findIndex((columnEvents) => {
      const lastEvent = columnEvents.at(-1)
      return lastEvent === undefined || lastEvent.endAt <= event.startAt
    })
    const targetColumn = column === -1 ? columns.length : column

    columns[targetColumn] ??= []
    columns[targetColumn].push(event)
    positionedEvents.push({
      event,
      column: targetColumn,
      columnCount: 1,
    })
  }

  return positionedEvents.map((positionedEvent) => ({
    ...positionedEvent,
    columnCount: columns.length,
  }))
}
