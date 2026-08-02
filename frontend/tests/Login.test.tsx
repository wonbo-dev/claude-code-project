import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import Login from '../src/components/Login'

describe('Login Component', () => {
  test('이메일과 비밀번호 입력 필드를 렌더링한다', () => {
    // Arrange
    render(<Login onLogin={vi.fn()} />)
    // Act (없음)

    // Assert
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  test('폼 제출 시 onLogin 콜백을 호출한다', () => {
    // Arrange
    const mockOnLogin = vi.fn()
    render(<Login onLogin={mockOnLogin} />)

    // Act
    fireEvent.change(screen.getByLabelText('이메일'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('비밀번호'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))

    // Assert
    expect(mockOnLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  test('이메일 형식이 잘못되면 에러 메시지를 표시하고 onLogin을 호출하지 않는다', () => {
    // Arrange
    const mockOnLogin = vi.fn()
    render(<Login onLogin={mockOnLogin} />)

    // Act
    fireEvent.change(screen.getByLabelText('이메일'), {
      target: { value: 'invalid-email' },
    })
    fireEvent.change(screen.getByLabelText('비밀번호'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))

    // Assert
    expect(screen.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument()
    expect(mockOnLogin).not.toHaveBeenCalled()
  })

  test('비밀번호가 8자 미만이면 에러 메시지를 표시하고 onLogin을 호출하지 않는다', () => {
    // Arrange
    const mockOnLogin = vi.fn()
    render(<Login onLogin={mockOnLogin} />)

    // Act
    fireEvent.change(screen.getByLabelText('이메일'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('비밀번호'), {
      target: { value: 'short' },
    })
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))

    // Assert
    expect(screen.getByText('비밀번호는 8자 이상이어야 합니다.')).toBeInTheDocument()
    expect(mockOnLogin).not.toHaveBeenCalled()
  })
})