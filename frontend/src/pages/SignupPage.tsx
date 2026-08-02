import { Link } from 'react-router-dom'

function SignupPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">회원가입</h1>
      <p className="text-gray-600 dark:text-gray-400">회원가입 폼은 곧 제공될 예정입니다.</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          로그인
        </Link>
      </p>
      <Link to="/" className="text-sm text-gray-500 hover:underline">
        ← 홈으로
      </Link>
    </main>
  )
}

export default SignupPage
