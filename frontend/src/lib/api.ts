// 백엔드 인증 API 호출 헬퍼. Vite 프록시를 통해 /api → http://localhost:3000

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResult {
  token: string
  user: { id: number; email: string; createdAt: string }
}

// 성공 시 AuthResult, 실패 시 Error를 throw
async function postAuth(path: string, body: AuthCredentials): Promise<AuthResult> {
  const res = await fetch(`/api/auth/${path}`, {
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
