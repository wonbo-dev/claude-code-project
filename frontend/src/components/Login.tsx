import { useState, type FormEvent } from 'react'

// 로그인 자격 증명 — onLogin 콜백으로 전달되는 페이로드
export interface LoginCredentials {
  email: string
  password: string
}

interface LoginProps {
  onLogin: (credentials: LoginCredentials) => void
}

// 필드별 에러를 담는 통일된 에러 상태
type LoginErrors = Partial<Record<keyof LoginCredentials, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password }: LoginCredentials): LoginErrors {
  const errors: LoginErrors = {}

  if (!email.trim()) {
    errors.email = '이메일을 입력하세요.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.'
  }

  if (!password) {
    errors.password = '비밀번호를 입력하세요.'
  } else if (password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.'
  }

  return errors
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate({ email, password })
    setErrors(nextErrors)

    // 검증 실패 시 콜백을 호출하지 않음
    if (Object.keys(nextErrors).length > 0) return

    onLogin({ email, password })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-lg border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.password && (
          <p id="login-password-error" role="alert" className="text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        로그인
      </button>
    </form>
  )
}

export default Login
