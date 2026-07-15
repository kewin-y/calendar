import { format } from "date-fns"
import { type Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"

export function EventCard({
  event,
  compact = false,
  className,
  onClick,
}: {
  event: Doc<"events">
  compact?: boolean
  className?: string
  onClick?: (event: Doc<"events">) => void
}) {
  return (
    <button
      type="button"
      onClick={(clickEvent) => {
        clickEvent.stopPropagation()
        onClick?.(event)
      }}
      className={cn(
        "w-full overflow-hidden rounded-md border border-blue-500/20 bg-blue-500 px-2 py-1 text-left text-xs text-white shadow-sm",
        compact ? "truncate" : "space-y-0.5",
        className,
      )}
      style={event.color ? { backgroundColor: event.color } : undefined}
    >
      <div className="truncate font-medium">{event.title}</div>
      {!compact && !event.allDay && (
        <div className="truncate opacity-90">
          {format(event.startAt, "h:mm a")} – {format(event.endAt, "h:mm a")}
        </div>
      )}
    </button>
  )
}
