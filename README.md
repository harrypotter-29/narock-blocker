# NAROCK BLOCKER STATIC V3.6.1 — ADMIN + RECOMMENDATION

기준 버전: `NAROCK_BLOCKER_STATIC_V3_6_FULL`

기존 V3.6의 메인 디자인과 페이지 구조를 유지하고 아래 기능만 확장한 버전입니다.

## 이번 버전 핵심 기능

### 1. 표현 관리 → Analyzer 연결
- `admin-expressions.html`
- 위험 표현 추가 / 수정 / 삭제 / 승인 상태 관리
- 변형 표현, 카테고리, 위험도, 안전·위험 문맥 관리
- KR / US / JP 대체 표현 관리
- `approved` 상태의 표현은 Analyzer가 검사할 때마다 `RiskStore`에서 다시 읽어 즉시 반영
- 표현 신고 문의를 검토 대기 표현으로 전환 가능

### 2. 표현 추천 및 수정
- `analyzer.html`
- 탐지된 표현마다 국가별 추천 표현 표시
- 개별 추천 표현 적용
- 최소 수정 / 자연스럽게 / 공식 문체 모드
- 전체 추천 적용
- 수정안 재검사
- 원문 복원
- 플랫폼 / 국가 / 사용 환경을 추천 컨텍스트에 반영
- 현재 추천은 AI 생성이 아니라 Risk DB + JavaScript 규칙 기반

### 3. 문의 관리
- `admin-inquiries.html`
- 기업 문의 / 표현 신고 / 일반 문의를 한 화면에서 탭으로 관리
- 문의 상태 변경
- 기업 문의 → 기업 고객 등록
- 표현 신고 → 표현 관리의 검토 대기로 전환

### 4. 통계 관리
- `admin-analytics.html`
- 총 검사 수
- HIGH 이상 비율
- 평균 Finding 수
- 추천 적용 횟수
- 플랫폼 / 국가 / 사용 환경 / 위험도 분포
- 많이 탐지된 표현
- Risk DB 카테고리 구성
- 최근 검사 로그

## 핵심 페이지
- `index.html` : 기존 V3.6 메인
- `analyzer.html` : 검사 + 추천 + 수정
- `admin.html` : 관리자 대시보드
- `admin-expressions.html` : 표현 관리
- `admin-inquiries.html` : 문의 관리
- `admin-analytics.html` : 통계 관리
- `business.html` : 기업 문의 입력
- `feedback.html` : 표현 신고 입력
- `support.html` : 일반 문의 입력

## 연결 구조

```text
admin-expressions.html
       ↓
RiskStore / LocalStorage
       ↓
analyzer.html

business.html ─────────────┐
feedback.html ─────────────┼→ admin-inquiries.html
support.html ──────────────┘

analyzer.html
   ├→ scan logs → admin-analytics.html
   └→ correction events → admin-analytics.html
```

## 로컬에서 확인하기

페이지 간 LocalStorage 연결을 안정적으로 확인하려면 `file://`로 각각 더블클릭하기보다 같은 로컬 서버에서 실행하는 것을 권장합니다.

Windows에서는:

```text
start_preview.bat
```

또는 PowerShell:

```powershell
py -m http.server 5173 --bind 127.0.0.1
```

그리고 `http://127.0.0.1:5173` 접속.

GitHub Pages에서는 모든 페이지가 같은 도메인에서 실행되므로 LocalStorage 기반 Prototype 연결이 정상적으로 공유됩니다.

## 주의
이 버전은 정적 GitHub Pages용 Prototype입니다. 실제 운영 서비스의 관리자 인증, 서버 DB, API Key, 개인정보 보호, 권한 분리는 Backend 구축 시 별도로 구현해야 합니다.


## V3.6.2 변경사항
- `index.html` 상단 네비게이션에 **Admin** 바로가기 추가
- Admin 메뉴 클릭 시 페이지 전환 애니메이션 추가
  - 선택 메뉴 강조
  - 메인 콘텐츠 Fade / Blur / Slide-out
  - 왼쪽 Purple transition line
  - 다음 Admin 페이지 Fade / Slide-in
- `prefers-reduced-motion` 대응
