import { v } from "convex/values"
import { query } from "../_generated/server"
import { requireUserId } from "../shared/auth"

export const listForRange = query({
  args: {
    rangeStart: v.number(),
    rangeEnd: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.rangeEnd <= args.rangeStart) {
      throw new Error("rangeEnd must be after rangeStart")
    }

    const userId = await requireUserId(ctx)

    const events = await ctx.db
      .query("events")
      .withIndex("by_user_start", (q) =>
        q.eq("userId", userId).lte("startAt", args.rangeEnd),
      )
      .collect()

    return events.filter((event) => event.endAt >= args.rangeStart)
  },
})
