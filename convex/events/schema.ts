import { defineTable } from "convex/server"
import { v } from "convex/values"

export const eventTables = {
  events: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    color: v.optional(v.string()),
    startAt: v.number(),
    endAt: v.number(),
    allDay: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_start", ["userId", "startAt"])
    .index("by_user_updated", ["userId", "updatedAt"]),
}
