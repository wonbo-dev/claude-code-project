import { Hono } from 'hono'
import { cors } from 'hono/cors'

import auth from './routes/auth'
import tasks from './routes/tasks'

const app = new Hono()

// CORS — Vercel 프론트엔드가 다른 출처(cross-origin)에서 API를 호출할 수 있도록 허용.
// 허용 출처는 CORS_ORIGIN 환경 변수(콤마로 여러 개)로 지정하고, 지정이 없으면
// 로컬 개발 출처만 허용한다. 이 프로젝트의 Vercel 프리뷰/프로덕션 도메인은 패턴으로 허용.
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(
    '/api/*',
    cors({
        origin: (origin) => {
            if (allowedOrigins.includes(origin)) return origin
            // claude-code-project.vercel.app / claude-code-project-<hash>.vercel.app 형태 허용
            if (/^https:\/\/claude-code-project[a-z0-9-]*\.vercel\.app$/.test(origin)) return origin
            return null
        },
        allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
    }),
)

// 헬스 체크 — dev 서버 기동 확인용
app.get('/', (c) => c.text('ok'))

app.route('/api/auth', auth)
app.route('/api/tasks', tasks)

export default app
