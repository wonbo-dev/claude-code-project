import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

import { db } from '../db'
import { users } from '../db/schema'

const auth = new Hono()
const jwtSecret = process.env.JWT_SECRET ?? 'taskflow-development-secret'

const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

const errorResponse = (message: string, status: 400 | 401 | 409) =>
    Response.json({ error: message }, { status })

const createToken = (userId: number, email: string) =>
    sign({ sub: String(userId), email }, jwtSecret)

auth.post('/register', async (c) => {
    let body: unknown

    try {
        body = await c.req.json()
    } catch {
        return errorResponse('Invalid JSON body', 400)
    }

    const parsed = credentialsSchema.safeParse(body)
    if (!parsed.success) {
        return errorResponse('Invalid email or password', 400)
    }

    const existingUser = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.email, parsed.data.email))
        .get()

    if (existingUser) {
        return errorResponse('Email is already registered', 409)
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10)
    const [user] = await db.insert(users)
        .values({ email: parsed.data.email, password: hashedPassword })
        .returning({ id: users.id, email: users.email, createdAt: users.createdAt })

    if (!user) {
        return errorResponse('Unable to create user', 400)
    }

    const token = await createToken(user.id, user.email)
    return c.json({ token, user }, 201)
})

auth.post('/login', async (c) => {
    let body: unknown

    try {
        body = await c.req.json()
    } catch {
        return errorResponse('Invalid JSON body', 400)
    }

    const parsed = credentialsSchema.safeParse(body)
    if (!parsed.success) {
        return errorResponse('Invalid email or password', 400)
    }

    const user = await db.select()
        .from(users)
        .where(eq(users.email, parsed.data.email))
        .get()

    if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
        return errorResponse('Invalid email or password', 401)
    }

    const token = await createToken(user.id, user.email)
    return c.json({ token, user: { id: user.id, email: user.email, createdAt: user.createdAt } })
})

export default auth
