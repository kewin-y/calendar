import { v } from "convex/values"
import { mutation } from "../_generated/server"
import { requireUserId } from "../shared/auth"

const eventDetailsValidator = {
  title: v.string(),
  description: v.optional(v.string()),
  location: v.optional(v.string()),
  color: v.optional(v.string()),
  startAt: v.number(),
  endAt: v.number(),
  allDay: v.boolean(),
}

function validateEventRange(startAt: number, endAt: number) {
  if (endAt <= startAt) {
    throw new Error("endAt must be after startAt")
  }
}

export const create = mutation({
  args: eventDetailsValidator,
  handler: async (ctx, args) => {
    validateEventRange(args.startAt, args.endAt)

    const userId = await requireUserId(ctx)
    const now = Date.now()

    return await ctx.db.insert("events", {
      userId,
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("events"),
    ...eventDetailsValidator,
  },
  handler: async (ctx, args) => {
    validateEventRange(args.startAt, args.endAt)

    const userId = await requireUserId(ctx)
    const event = await ctx.db.get(args.id)

    if (event === null || event.userId !== userId) {
      throw new Error("Event not found")
    }

    const { id, ...patch } = args

    await ctx.db.patch(id, {
      ...patch,
      updatedAt: Date.now(),
    })
  },
})

export const move = mutation({
  args: {
    id: v.id("events"),
    startAt: v.number(),
    endAt: v.number(),
    allDay: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    validateEventRange(args.startAt, args.endAt)

    const userId = await requireUserId(ctx)
    const event = await ctx.db.get(args.id)

    if (event === null || event.userId !== userId) {
      throw new Error("Event not found")
    }

    await ctx.db.patch(args.id, {
      startAt: args.startAt,
      endAt: args.endAt,
      allDay: args.allDay ?? event.allDay,
      updatedAt: Date.now(),
    })
  },
})

export const remove = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const event = await ctx.db.get(args.id)

    if (event === null || event.userId !== userId) {
      throw new Error("Event not found")
    }

    await ctx.db.delete(args.id)
  },
})
