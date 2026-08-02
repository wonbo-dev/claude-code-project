// JWT 토큰 저장/조회 헬퍼. 로그인·회원가입 성공 시 저장하고,
// 인증이 필요한 API 호출(태스크 CRUD)에서 사용한다.

const TOKEN_KEY = 'taskflow_token'

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
