import { defineConfig, devices } from '@playwright/test'

// Playwright E2E 설정 — 프론트엔드와 백엔드 전체 스택을 구동하는 브라우저 테스트.
// 테스트는 e2e/ 디렉터리에 위치. (CLAUDE.md 참고)

const FRONTEND_URL = 'http://localhost:5173' // Vite dev server 기본 포트

export default defineConfig({
  testDir: './e2e',
  // CI에서만 fail-fast/재시도 정책을 강화
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry', // 실패 후 재시도 시 트레이스 수집
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 테스트 실행 전 개발 서버(프론트엔드 + 백엔드)를 자동 기동한다.
  webServer: [
    {
      // 백엔드는 in-memory DB → 매 실행마다 새로 기동해 깨끗한 상태 보장
      // (기존 서버 재사용 시 회원가입 테스트가 중복 이메일 409로 실패)
      command: 'npm run start',
      cwd: './backend',
      url: 'http://localhost:3000',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run dev',
      cwd: './frontend',
      url: FRONTEND_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
