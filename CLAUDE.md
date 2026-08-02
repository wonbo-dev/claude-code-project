# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트

**TaskFlow** — TDD(테스트 주도 개발) 기반 할 일 관리 앱.

## 현재 상태

세 계층 모두 스캐폴드가 완료되어 각자 `package.json`과 설정된 테스트 러너를 갖추고
있습니다. 구현된 기능:

- **인증** — 회원가입/로그인(`/api/auth/register`, `/api/auth/login`), bcrypt 비밀번호
  해싱, JWT 발급. 프론트엔드는 토큰을 `localStorage`(`taskflow_token`)에 저장합니다.
- **태스크 CRUD** — 목록/생성/상태 변경/삭제(`/api/tasks`), JWT 인증 필요.
- **프론트엔드** — 로그인/회원가입/대시보드 페이지, React Router 기반 라우팅.

각 계층은 서로 독립적으로 의존성을 설치·실행합니다(루트에 통합 스크립트 없음).

## 구조

세 개의 계층으로 나뉘며, 각 계층은 자체 테스트를 가집니다:

- `backend/` — HTTP API. 단위·통합 테스트는 `backend/tests/`. 개발/실행 포트 `3000`.
- `frontend/` — React UI. 컴포넌트 테스트는 `frontend/tests/`. 개발 서버 포트 `5173`.
- `e2e/` — 프론트엔드와 백엔드를 아우르는 엔드투엔드 테스트. Playwright 설정은
  저장소 루트의 `playwright.config.ts`.

## 명령어

각 계층 디렉터리에서 실행합니다(별도 명시가 없으면 해당 디렉터리 기준).

**백엔드** (`backend/`)

- `npm run dev` — 개발 서버(tsx watch, 포트 3000)
- `npm run start` — 서버 실행(tsx)
- `npm test` — 단위·통합 테스트(`vitest run`)
- `npm run test:watch` — 감시 모드 / `npm run test:coverage` — 커버리지

**프론트엔드** (`frontend/`)

- `npm run dev` — Vite 개발 서버(포트 5173)
- `npm run build` — 타입 체크 + 빌드(`tsc -b && vite build`)
- `npm run lint` — ESLint(`eslint .`)
- `npm test` — 컴포넌트 테스트(`vitest run`) / `npm run test:watch` — 감시 모드
- `npm run preview` — 빌드 결과 미리보기

**E2E** (저장소 루트)

- `npx playwright test` — 전체 E2E 실행. `playwright.config.ts`의 `webServer` 설정이
  백엔드(3000)와 프론트엔드(5173)를 자동 기동하므로 서버를 따로 띄울 필요 없음.
- `npx playwright test e2e/tasks.spec.ts` — 특정 스펙만 실행.

## 백엔드 스택

- **Hono** — 웹 프레임워크 / 라우팅.
- **Drizzle ORM** — 스키마 정의, 쿼리, 마이그레이션.
- **SQLite** — 데이터베이스.
- **Zod** — 요청/응답 검증. 별도의 인터페이스를 중복해서 손으로 작성하기보다 Zod
  스키마와 Drizzle 테이블 정의에서 타입을 파생시키는 방식을 선호하세요. 단일 진실
  공급원(single source of truth)을 유지해야 검증·ORM·TypeScript 타입이 서로 어긋나지
  않습니다.

## 프론트엔드 스택

- **React** — UI 컴포넌트.
- **Vite** — 개발 서버 및 빌드 도구.
- **TailwindCSS** — 유틸리티 클래스 기반 스타일링. 유틸리티 클래스로 해결되는 부분은
  별도 CSS 파일을 만들지 마세요.

## 테스트

- **Vitest** — `backend/`와 `frontend/`의 단위·통합 테스트. 아래 레드/그린 사이클에서
  사용하는 러너입니다.
- **Playwright** — 프론트엔드와 백엔드 전체 스택을 구동하는 `e2e/` 브라우저 테스트.

## TDD 워크플로 (필수)

이 프로젝트는 TDD 기반으로 정의되어 있습니다. 이는 권장 사항이 아니라 핵심 작업
원칙입니다. 모든 변경은 레드 → 그린 → 리팩터 순서를 따르세요:

1. **레드(Red)** — 구현 코드를 작성하기 전에, 해당 계층의 `tests/` 디렉터리에 동작을
   명세하는 실패하는 테스트를 먼저 작성합니다. 실행해서 "올바른 이유로" 실패하는지
   확인하세요.
2. **그린(Green)** — 테스트를 통과시키는 최소한의 구현만 작성합니다.
3. **리팩터(Refactor)** — 테스트가 계속 통과하는 상태를 유지하며 코드를 정리합니다.

실패하는 테스트가 요구하지 않는 프로덕션 코드는 작성하지 마세요. 프론트엔드/백엔드
경계를 넘나드는 사용자 흐름에는 `e2e/`(Playwright)를, 한 계층에 국한된 로직에는 각
계층의 `tests/` 디렉터리(Vitest)를 사용하세요.

## 코드 컨벤션
- Typescript strict mode
- 함수형 컴포넌트 + Hooks
- 에러는 Zod 스키마로 검증
- 한글 주석 허용