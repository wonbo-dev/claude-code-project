# 보안 리스크 기록 (Security Risk Register)

수용(accept)하기로 결정한 알려진 취약점 및 리스크를 기록합니다. 각 항목은
재평가 시점 또는 조건이 충족되면 다시 검토합니다.

---

## RISK-001: react-router RSC Mode CSRF Bypass (GHSA-qwww-vcr4-c8h2)

| 항목 | 내용 |
|------|------|
| **상태** | 수용 (Accepted) — 조치 없이 유지 |
| **기록일** | 2026-08-02 |
| **심각도** | High (npm audit 기준) |
| **패키지** | `react-router` / `react-router-dom` (frontend) |
| **영향 버전** | 7.12.0 – 8.2.0 |
| **설치 버전** | `react-router-dom@7.18.2` → `react-router@7.18.2` |
| **Advisory** | https://github.com/advisories/GHSA-qwww-vcr4-c8h2 |
| **npm audit 카운트** | 2건 (동일 CVE가 `react-router` + `react-router-dom` 두 노드로 집계) |

### 취약점 요약
React Router의 **RSC(React Server Components) 모드**에서 CSRF 방어가 우회되어,
서버가 400 응답을 반환하기 전에 **server action**이 실행될 수 있는 문제.

### 수용 근거 (영향 없음)
현재 프론트엔드(`frontend/`)는 다음 조건이므로 취약한 코드 경로를 사용하지 않는다:
- Vite + React 기반 **클라이언트 사이드 SPA**
- 라우팅은 `BrowserRouter` 사용 (`frontend/src/App.tsx`)
- **RSC 모드 미사용**, server action 없음, 서버 사이드 렌더링 없음

따라서 실질적 악용 가능성이 없어 즉시 조치하지 않고 수용한다.

### 조치하지 않은 이유
- `npm audit fix --force` → `react-router-dom@7.11.0`으로 **다운그레이드**되며
  기능 후퇴 + breaking change 발생. (취약점 도입 이전 버전으로 내리는 것)
- v8(`react-router@8.3.0`, 패치됨)은 major 업그레이드로 마이그레이션 비용 발생,
  현재 리스크 대비 불필요.

### 재검토 조건
- 7.x 라인에 정식 패치 버전이 릴리스되면 `npm update`로 반영 후 이 리스크 종료.
- 프론트엔드에 **RSC 모드 / server action / SSR을 도입**하게 되면 즉시 재평가
  (이 경우 취약점이 실제 위협이 되므로 우선 조치 필요).
