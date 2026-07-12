# Event pressure 자동화 runbook

Germany Travel Checker는 독일의 큰 행사나 이벤트가 여행자에게 줄 수 있는 영향을 "event pressure signal"로 보여준다.

이 시스템은 보수적으로 동작해야 한다.  
실시간 군중 상태, 열차 지연, 호텔 예약 가능 여부, 상점 영업 상태를 알려주는 시스템이 아니다.

## 제품 원칙

Event pressure note는 이렇게 말할 수 있다.

- 큰 행사가 여행 계획에 영향을 줄 수 있는 신호다.
- 방문자는 이동 시간을 더 여유 있게 잡는 것이 좋다.
- 공식 행사장, 도시, 교통 페이지에서 다시 확인해야 한다.
- 특정 장소나 도시 구역 주변의 수요가 평소보다 높을 수 있다.

Event pressure note는 이렇게 말하면 안 된다.

- 도시가 지금 붐빈다.
- 열차가 지연되거나 취소된다.
- 상점이 모두 닫힌다.
- 호텔이 매진되었거나 예약이 꽉 찼다.
- 이 시스템이 live 또는 real-time 상태를 알고 있다.

## 자동화 흐름

목표 흐름은 이렇다.

known event sources
→ source scan
→ candidate JSON
→ candidate PR
→ 사람이 merge
→ promotion workflow
→ generated notes PR
→ 사람이 merge
→ 사이트에서 event pressure signal 노출

자동화는 PR, 리포트, 검증, 안전장치를 만든다.  
하지만 generated note가 실제 사이트에 반영되기 전에는 사람이 한 번 더 검토한다.

## 주요 데이터 파일

- `src/data/eventPressureSources.json`
- `src/data/eventPressureKnownEvents.json`
- `src/data/eventPressureCandidates.generated.json`
- `src/data/eventPressureNotes.generated.json`

`*.generated.json` 파일은 의도한 변경이 아니라면 직접 수정하지 않는다.

## 주요 workflow

### Event pressure check

파일:

- `.github/workflows/event-pressure-check.yml`

역할:

- 관련 PR에서 실행된다.
- `main`에 관련 파일이 push될 때 실행된다.
- schedule과 manual dispatch도 유지한다.
- 핵심 명령은 `npm run event-pressure:automation-check`이다.

### Known source write scan

파일:

- `.github/workflows/event-pressure-known-source-write.yml`

역할:

- known event source를 write mode로 스캔한다.
- candidate PR을 만들거나 업데이트한다.
- candidate report에 copy safety review와 source trust review를 붙인다.
- candidate workflow가 예상한 파일만 바꾸는지 검사한다.

허용되는 변경 파일:

- `src/data/eventPressureCandidates.generated.json`
- `event-pressure-candidate-report.md`

### Candidate promotion

파일:

- `.github/workflows/event-pressure-promote-candidates.yml`

역할:

- 유효한 candidate를 generated note로 승격한다.
- schedule로 실행된다.
- `main`의 candidate JSON이 변경되면 실행된다.
- generated-note PR을 만들거나 업데이트한다.
- promotion report에 copy safety review와 source trust review를 붙인다.
- promotion workflow가 예상한 파일만 바꾸는지 검사한다.

허용되는 변경 파일:

- `src/data/eventPressureNotes.generated.json`
- `src/data/eventPressureCandidates.generated.json`
- `event-pressure-promotion-report.md`

## 핵심 명령어

전체 read-only 자동화 체크:

    npm run event-pressure:automation-check

이 명령은 로컬과 CI에서 자동화 엔진 전체를 확인하는 기본 명령이다.

이 명령은 read-only여야 한다.  
아래 파일들을 변경한 채로 남기면 안 된다.

- `src/data/eventPressureCandidates.generated.json`
- `src/data/eventPressureNotes.generated.json`
- `event-pressure-candidate-report.md`
- `event-pressure-promotion-report.md`

Candidate pipeline report-only:

    npm run event-pressure:auto-pipeline:candidates

Candidate pipeline write mode:

    npm run event-pressure:auto-pipeline:candidates:write

Candidate pipeline 제한 smoke test:

    npm run event-pressure:auto-pipeline:candidates:write -- --limit=1

Promotion pipeline report-only:

    npm run event-pressure:auto-pipeline:promote

Promotion pipeline write mode:

    npm run event-pressure:auto-pipeline:promote:write

Promotion checked-at 지정:

    npm run event-pressure:auto-pipeline:promote:write -- --checked-at=2026-07-12

전체 pipeline report-only:

    npm run event-pressure:auto-pipeline

전체 pipeline write mode:

    npm run event-pressure:auto-pipeline:write

## 안전장치

### 날짜 추출

- `npm run event-pressure:date-extraction:test`
- `npm run event-pressure:date-range-selection:test`

날짜 파싱과 date range 선택 로직을 보호한다.

### Known event profile

- `npm run event-pressure:known-profiles`
- `npm run event-pressure:known-dates:strict`

`dateExtraction` profile이 올바른지 확인하고, known date가 이미 지난 날짜인지 검사한다.

### 만료된 generated note

- `npm run event-pressure:expired:strict`

generated event pressure note는 만료된 날짜를 가지면 안 된다.

### Copy safety

- `npm run event-pressure:copy-safety:test`
- `npm run event-pressure:copy-safety`
- `npm run event-pressure:copy-safety:report:test`

generated note와 candidate note가 live status, real-time transport, crowd, shop, hotel, availability 상태를 아는 것처럼 말하지 않도록 막는다.

### Source trust

- `npm run event-pressure:source-trust:test`
- `npm run event-pressure:source-trust`
- `npm run event-pressure:source-trust:report:test`

note에 최소 하나 이상의 trusted source URL이 있는지 검사한다.

### Review report guard

- `npm run event-pressure:review-report:test`
- `npm run event-pressure:review-report:candidate`
- `npm run event-pressure:review-report:promotion`

candidate PR body와 promotion PR body에 필수 섹션이 있는지 검사한다.

필수 섹션:

- 기본 candidate 또는 promotion review
- Copy safety review
- Source trust review

### Output guard

- `npm run event-pressure:outputs:test`
- `npm run event-pressure:outputs:candidate`
- `npm run event-pressure:outputs:promotion`

write-mode workflow가 예상한 출력 파일만 바꾸는지 검사한다.

## PR body 순서

Candidate PR body 순서:

1. Event pressure candidate review
2. Copy safety review
3. Source trust review

Promotion PR body 순서:

1. Event pressure promotion review
2. Copy safety review
3. Source trust review

## 로컬 작업 후 확인 순서

event pressure 자동화 관련 변경을 만든 뒤에는 커밋 전에 항상 실행한다.

    npm run event-pressure:automation-check
    npm run build
    git status

의도하지 않게 generated JSON이나 markdown report가 바뀌었다면 되돌린다.

    git restore src/data/eventPressureCandidates.generated.json src/data/eventPressureNotes.generated.json
    rm -f event-pressure-candidate-report.md event-pressure-promotion-report.md

그 다음 다시 확인한다.

    npm run event-pressure:automation-check
    npm run build
    git status

## 중요한 주의사항

generated event pressure note는 자동 merge하지 않는다.

자동화는 PR, report, guardrail을 만들 수 있다.  
하지만 generated note가 사이트에 노출되기 전에는 사람이 한 번 더 검토해야 한다.
