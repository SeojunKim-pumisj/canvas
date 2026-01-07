# Project Name: Minimalist Drawing Board (Canvas)

## 1. Project Overview
* **Goal:** React와 HTML5 Canvas API를 사용하여 고성능 드로잉 애플리케이션을 구축한다.
* **Target User:** 빠른 아이디어 스케치와 부드러운 드로잉 경험을 원하는 사용자.
* **Key Value:** 풀스크린 몰입형 UX, 실행 취소/다시 실행(Undo/Redo), 지우개 및 화면 이동 기능.

## 2. Tech Stack
* **Framework:** React (Vite) + TypeScript
* **Styling:** Tailwind CSS (Glassmorphism UI)
* **Icons:** Lucide React
* **State Management:** Custom Hooks (Logic 분리)
* **Canvas:** HTML5 Canvas API

## 3. Core Features (MVP)
### 3.1 Board Layout
* **Full View:** Header와 Footer 없이 화면 전체(100vw, 100vh)를 캔버스로 사용.
* **Floating Toolbar:** * 화면 하단 중앙 배치, 바닥에서 **50px** 띄움.
    * 유리 효과(Glassmorphism) 스타일 적용.
    * 구성: **손(Hand)**, **펜(Pen)**, **지우개(Eraser)**, **색상 선택(Color)**, **실행 취소(Undo)**, **다시 실행(Redo)**.

### 3.2 Drawing & Editing
* **Pen Tool:** 부드러운 선 그리기 (round lineJoin/lineCap).
* **Eraser Tool:** 그려진 내용을 부분적으로 제거 (destination-out 활용).
* **Hand Tool:** 캔버스를 드래그하여 이동(Panning) 가능.
* **Undo/Redo:** 작업 히스토리를 스택으로 관리하여 최대 50단계까지 복구 가능.

### 3.3 Theme & Persistence
* **Dark Mode:** 시스템 설정 감지 및 토글 기능. 
    * 다크모드 배경: `Slate-900`, 캔버스: `Slate-800` (선택적).
* **Persistence:** `localStorage`를 사용하여 새로고침 후에도 그림 데이터 유지.

## 4. Coding Rules & Guidelines

### 1. General Principles
* **KISS (Keep It Simple, Stupid):** 과도한 추상화를 피하고 명확한 코드를 작성하라.
* **DRY (Don't Repeat Yourself):** 반복되는 로직은 커스텀 훅(`hooks/`)이나 유틸리티 함수(`utils/`)로 분리하라.
* **Functional Components:** 모든 컴포넌트는 React Functional Component로 작성하며 Hooks를 사용하라.

### 2. File Structure
* `/src/components`: UI 컴포넌트 (e.g., `CanvasContainer.tsx`, `Toolbar.tsx`, `ToolButton.tsx`)
* `/src/hooks`: 로직 분리 (e.g., `useCanvas.ts`, `useHistory.ts`, `useTheme.ts`)
* `/src/types`: TypeScript 인터페이스 정의 (e.g., `types.ts`)
* *Rule:* 하나의 파일에는 하나의 컴포넌트만 존재해야 한다. (100줄이 넘어가면 분리를 고려할 것)

### 3. Naming Conventions
* **Components:** PascalCase (e.g., `DrawingCanvas`)
* **Functions/Variables:** camelCase (e.g., `handleDrawStart`, `currentStroke`)
* **Types/Interfaces:** PascalCase (e.g., `Stroke`, `Point`, `ToolType`)

### 4. Styling (Tailwind CSS)
* 인라인 스타일(`style={{}}`) 사용 금지. (Canvas 크기 계산 등 필수적인 경우 제외)
* 다크모드는 Tailwind의 `dark:` 클래스 조합을 사용할 것.
* 색상은 하드코딩하지 말고 Tailwind 시맨틱 컬러를 활용할 것.

### 5. State Management & Logic
* `useEffect` 사용을 최소화하고 이벤트 핸들러 내에서 로직을 처리하라.
* Canvas 드로잉 로직과 히스토리 관리 로직은 UI 컴포넌트 내부가 아닌 `hooks`로 분리하라.

### 6. Error Handling & Performance
* `localStorage` 접근 시 예외 처리를 포함하라 (try-catch).
* 드로잉 중 리렌더링 최적화를 위해 `requestAnimationFrame` 고려.

## 5. Development Task List

### Phase 1: Setup & Structure
- [ ] Vite + React + TS + Tailwind 프로젝트 초기화
- [ ] `types.ts` 정의 (Point, Stroke, Tool 타입 등)
- [ ] 기본 풀스크린 레이아웃 구성

### Phase 2: Core Canvas & Drawing (UI)
- [ ] `CanvasContainer` 컴포넌트 및 기본 Canvas API 연결
- [ ] 하단 플로팅 툴바(`Toolbar`) UI 구현 (Bottom 50px)
- [ ] 펜(Pen) 모드 기본 드로잉 구현

### Phase 3: Advanced Features (Logic)
- [ ] `useHistory` 훅 구현 (Undo, Redo 스택 로직)
- [ ] 지우개(Eraser) 기능 구현
- [ ] 손(Hand) 도구를 이용한 캔버스 이동(Panning) 구현

### Phase 4: Data & Theme
- [ ] `useTheme` 훅 구현 및 다크모드 스타일링 적용
- [ ] `localStorage`를 활용한 그림 데이터 자동 저장/불러오기

### Phase 5: Polish & Refactor
- [ ] 코드 클린업 및 가이드라인 준수 여부 확인
- [ ] 창 크기 조절(Resize) 대응 및 성능 최적화
