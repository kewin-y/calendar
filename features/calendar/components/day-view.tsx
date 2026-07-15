import { type Doc } from "@/convex/_generated/dataModel"
import { TimeGrid } from "./time-grid"

export function DayView({
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
  return (
    <TimeGrid
      date={date}
      events={events}
      days={1}
      onCreateEvent={onCreateEvent}
      onEditEvent={onEditEvent}
    />
  )
}
