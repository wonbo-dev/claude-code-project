import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Login, { type LoginCredentials } from '../components/Login'
import { login } from '../lib/api'

function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (credentials: LoginCredentials) => {
    setError(null)
    try {
      await login(credentials)
      // 로그인 성공 → 대시보드로 이동
      navigate('/dashboard')
    } catch {
      // 인증 실패(401 등) → 통일된 에러 메시지 표시, 현재 페이지 유지
      setError('이메일 또는 비밀번호가 잘못되었습니다.')
    }
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">로그인</h1>

      {error && (
        <p className="error-message error w-full rounded-md bg-red-50 px-3 py-2 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      <Login onLogin={handleLogin} />

      <p className="text-sm text-gray-600 dark:text-gray-400">
        계정이 없으신가요?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:underline">
          회원가입
        </Link>
      </p>
      <Link to="/" className="text-sm text-gray-500 hover:underline">
        ← 홈으로
      </Link>
    </main>
  )
}

export default LoginPage
