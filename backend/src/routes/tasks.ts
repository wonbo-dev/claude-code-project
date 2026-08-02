import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

import { db } from '../db'
import { tasks } from '../db/schema'

const jwtSecret = process.env.JWT_SECRET ?? 'taskflow-development-secret'
const authMiddleware = jwt({ secret: jwtSecret, alg: 'HS256' })

const taskCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
})

const taskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})

const tasksRoute = new Hono()

const getUserId = (c: any) => {
  const jwtPayload = c.get('jwtPayload')
  if (!jwtPayload?.sub) return null
  const userId = Number(jwtPayload.sub)
  return Number.isNaN(userId) ? null : userId
}

tasksRoute.use('*', authMiddleware)

tasksRoute.get('/', async (c) => {
  const userId = getUserId(c)
  if (!userId) return c.text('Unauthorized', 401)

  const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId))
  return c.json(userTasks)
})

tasksRoute.post('/', async (c) => {
  const userId = getUserId(c)
  if (!userId) return c.text('Unauthorized', 401)

  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.text('Invalid JSON body', 400)
  }

  const parsed = taskCreateSchema.safeParse(body)
  if (!parsed.success) {
    return c.text('Invalid task payload', 400)
  }

  const [createdTask] = await db.insert(tasks)
    .values({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      userId,
    })
    .returning()

  return c.json(createdTask, 201)
})

tasksRoute.patch('/:id', async (c) => {
  const userId = getUserId(c)
  if (!userId) return c.text('Unauthorized', 401)

  const idParam = c.req.param('id')
  const taskId = Number(idParam)
  if (!idParam || Number.isNaN(taskId) || taskId < 1) {
    return c.text('Invalid task id', 400)
  }

  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.text('Invalid JSON body', 400)
  }

  const parsed = taskUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return c.text('Invalid task payload', 400)
  }

  const updateData = parsed.data
  const updatedTasks = await db.update(tasks)
    .set(updateData)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning()

  if (updatedTasks.length === 0) {
    return c.text('Task not found', 404)
  }

  return c.json(updatedTasks[0])
})

tasksRoute.delete('/:id', async (c) => {
  const userId = getUserId(c)
  if (!userId) return c.text('Unauthorized', 401)

  const idParam = c.req.param('id')
  const taskId = Number(idParam)
  if (!idParam || Number.isNaN(taskId) || taskId < 1) {
    return c.text('Invalid task id', 400)
  }

  const deleteResult = await db.delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .execute()

  if (deleteResult.length === 0) {
    return c.text('Task not found', 404)
  }

  return c.body(null, 204)
})

export default tasksRoute
