import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          TaskFlow
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          할 일을 간편하게 관리하세요.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/login"
          className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          로그인
        </Link>
        <Link
          to="/register"
          className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          회원가입
        </Link>
      </div>
    </main>
  )
}

export default HomePage
