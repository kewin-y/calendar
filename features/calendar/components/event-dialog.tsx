"use client"

import { useMutation } from "convex/react"
import { format } from "date-fns"
import { z } from "zod"
import { api } from "@/convex/_generated/api"
import { type Doc } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFieldContext } from "@/hooks/form-context"
import { useAppForm } from "@/hooks/form"

const eventSchema = z
  .object({
    title: z.string().min(1, "Required"),
    description: z.string(),
    location: z.string(),
    color: z.string(),
    startAt: z.coerce.date<string>({ error: "Required" }),
    endAt: z.coerce.date<string>({ error: "Required" }),
    allDay: z.boolean(),
  })
  .refine((value) => value.endAt.getTime() > value.startAt.getTime(), {
    message: "End time must be after start time",
    path: ["endAt"],
  })

export function EventDialog({
  open,
  event,
  initialStart,
  onOpenChange,
}: {
  open: boolean
  event: Doc<"events"> | null
  initialStart: Date
  onOpenChange: (open: boolean) => void
}) {
  const createEvent = useMutation(api.events.mutations.create)
  const updateEvent = useMutation(api.events.mutations.update)
  const deleteEvent = useMutation(api.events.mutations.remove)
  const initialEnd = new Date(initialStart.getTime() + 60 * 60 * 1000)

  const form = useAppForm({
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      location: event?.location ?? "",
      color: event?.color ?? "#2563eb",
      startAt: formatDateTimeLocal(event?.startAt ?? initialStart),
      endAt: formatDateTimeLocal(event?.endAt ?? initialEnd),
      allDay: event?.allDay ?? false,
    },
    validators: { onSubmit: eventSchema },
    onSubmit: async ({ value }) => {
      const parsed = eventSchema.parse(value)
      const payload = {
        title: parsed.title,
        description: parsed.description || undefined,
        location: parsed.location || undefined,
        color: parsed.color || undefined,
        startAt: parsed.startAt.getTime(),
        endAt: parsed.endAt.getTime(),
        allDay: parsed.allDay,
      }

      if (event) {
        await updateEvent({ id: event._id, ...payload })
      } else {
        await createEvent(payload)
      }

      onOpenChange(false)
    },
  })

  async function handleDelete() {
    if (!event) return
    await deleteEvent({ id: event._id })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit event" : "Create event"}</DialogTitle>
          <DialogDescription>Add the event details for your calendar.</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(submitEvent) => {
            submitEvent.preventDefault()
            submitEvent.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.AppForm>
            <form.AppField name="title">
              {(field) => <field.TextField label="Title" placeholder="Event title" />}
            </form.AppField>

            <form.AppField name="description">
              {() => <TextareaField label="Description" />}
            </form.AppField>

            <form.AppField name="location">
              {(field) => <field.TextField label="Location" placeholder="Optional" />}
            </form.AppField>

            <div className="grid gap-4 sm:grid-cols-2">
              <form.AppField name="startAt">
                {(field) => <field.TextField label="Start" type="datetime-local" />}
              </form.AppField>
              <form.AppField name="endAt">
                {(field) => <field.TextField label="End" type="datetime-local" />}
              </form.AppField>
            </div>

            <form.AppField name="color">
              {(field) => <field.TextField label="Color" type="color" />}
            </form.AppField>

            <form.AppField name="allDay">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Input
                        className="size-4"
                        type="checkbox"
                        checked={field.state.value}
                        aria-invalid={isInvalid}
                        onBlur={field.handleBlur}
                        onChange={(changeEvent) => field.handleChange(changeEvent.target.checked)}
                      />
                      All day
                    </label>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.AppField>

            <DialogFooter>
              {event && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <form.SubmitButton>{event ? "Save" : "Create"}</form.SubmitButton>
            </DialogFooter>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TextareaField({ label }: { label: string }) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

function formatDateTimeLocal(value: number | Date) {
  return format(value, "yyyy-MM-dd'T'HH:mm")
}
