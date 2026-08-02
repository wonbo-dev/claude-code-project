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

  // 테스트 실행 전 개발 서버를 자동 기동한다.
  webServer: [
    {
      command: 'npm run dev',
      cwd: './frontend',
      url: FRONTEND_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    // TODO: 백엔드 서버 진입점(@hono/node-server의 serve() 호출)과
    //       start 스크립트가 추가되면 아래 블록을 활성화한다.
    //       현재 backend/src/app.ts는 Hono 앱을 export만 하고 서버를 기동하지 않는다.
    // {
    //   command: 'npm run start',
    //   cwd: './backend',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    //   timeout: 120_000,
    // },
  ],
})
