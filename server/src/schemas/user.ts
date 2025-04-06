import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import * as schema from '../database/schema.ts'

export const user = {
  insert: createInsertSchema(schema.user).omit({ id: true }),
  update: createUpdateSchema(schema.user).required({ id: true }),
  queryById: createSelectSchema(schema.user).pick({ id: true }).required({ id: true }),
}
