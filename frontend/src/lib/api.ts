// 백엔드 API 호출 헬퍼.
// - 로컬 개발: VITE_API_BASE_URL 미설정 → 상대 경로(/api)로 호출하고 Vite 프록시가 localhost:3000으로 전달.
// - 배포(Vercel): VITE_API_BASE_URL에 백엔드 절대 URL(예: Railway) 지정 → 그 도메인으로 직접 호출(CORS 필요).
import { getToken } from './auth'

// 끝의 슬래시는 제거해 `//api` 같은 이중 슬래시를 방지한다.
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const apiUrl = (path: string) => `${API_BASE}${path}`

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResult {
  token: string
  user: { id: number; email: string; createdAt: string }
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  userId: number
  createdAt: string
}

// --- 인증 ---

async function postAuth(path: string, body: AuthCredentials): Promise<AuthResult> {
  const res = await fetch(apiUrl(`/api/auth/${path}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`AUTH_FAILED_${res.status}`)
  }

  return (await res.json()) as AuthResult
}

export const register = (body: AuthCredentials) => postAuth('register', body)
export const login = (body: AuthCredentials) => postAuth('login', body)

// --- 태스크 (JWT 인증 필요) ---

function authHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token ?? ''}`,
  }
}

export async function listTasks(): Promise<Task[]> {
  const res = await fetch(apiUrl('/api/tasks'), { headers: authHeaders() })
  if (!res.ok) throw new Error(`TASKS_LIST_FAILED_${res.status}`)
  return (await res.json()) as Task[]
}

export async function createTask(input: { title: string; description?: string }): Promise<Task> {
  const res = await fetch(apiUrl('/api/tasks'), {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`TASK_CREATE_FAILED_${res.status}`)
  return (await res.json()) as Task
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const res = await fetch(apiUrl(`/api/tasks/${id}`), {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(`TASK_UPDATE_FAILED_${res.status}`)
  return (await res.json()) as Task
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(apiUrl(`/api/tasks/${id}`), {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(`TASK_DELETE_FAILED_${res.status}`)
}
