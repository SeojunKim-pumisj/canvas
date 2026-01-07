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