import { Hono } from 'hono'

import auth from './routes/auth'
import tasks from './routes/tasks'

const app = new Hono()

app.route('/api/auth', auth)
app.route('/api/tasks', tasks)

export default app
