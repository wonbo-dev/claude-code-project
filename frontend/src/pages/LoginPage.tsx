import { Link } from 'react-router-dom'
import Login, { type LoginCredentials } from '../components/Login'

function LoginPage() {
  const handleLogin = (credentials: LoginCredentials) => {
    // TODO: 백엔드 인증 API 연동
    console.log('login', credentials)
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">로그인</h1>
      <Login onLogin={handleLogin} />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="font-medium text-blue-600 hover:underline">
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
