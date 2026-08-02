import { Hono } from 'hono'

import auth from './routes/auth'
import tasks from './routes/tasks'

const app = new Hono()

// 헬스 체크 — dev 서버 기동 확인용
app.get('/', (c) => c.text('ok'))

app.route('/api/auth', auth)
app.route('/api/tasks', tasks)

export default app
