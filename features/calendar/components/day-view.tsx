import { type Doc } from "@/convex/_generated/dataModel"
import { TimeGrid } from "./time-grid"

export function DayView({ date, events }: { date: Date; events: Doc<"events">[] }) {
  return <TimeGrid date={date} events={events} days={1} />
}
