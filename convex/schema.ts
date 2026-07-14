import { defineSchema } from "convex/server"
import { authTables } from "@convex-dev/auth/server"
import { eventTables } from "./events/schema"

export default defineSchema({
  ...authTables,
  ...eventTables,
})
