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