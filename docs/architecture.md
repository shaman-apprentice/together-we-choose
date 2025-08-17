# Architecture (Initial Minimal Version)

Scope: MVP defined in `prd.md` <br/>
Principles: Minimal overhead, fast iterations, privacy-first (German law), low maintenance.

All decisions should support fast iteration, especially reducing time to production to enable fast experimentation and early product evaluation. Decisions that are hard to revise are discouraged. If necessary, they should be documented in an ADR complementing this document.

## High-Level Overview

A small full‑stack monorepo containing:

- `frontend/`: Angular app (public pages + admin view) with Angular Material (rose light/dark), i18n (EN/DE), simple password gate for admin route.
- `backend/`: NestJS API (REST)
- `shared/`: Mainly shared DTOs between frontend and backend.
- `sqlite`: Simple DB integrated into backend via TypeORM. Easy future migration to PostgreSQL if needed.
- `fileStorage/`: (mounted volume) for user‑uploaded images (low volume, simple file system store; later S3‑compatible bucket if needed).
- Minimal custom cookie-less tracking service: (events sent to backend and stored in a separate table) – no 3rd‑party analytics, minimalistic and privacy‑friendly.

## Tech Stack Decisions

| Concern | Choice | Rationale | Alternatives (Not Chosen) |
|---------|--------|-----------|----------------------------|
| Frontend framework | Angular (latest LTS) | Team skill, Angular Material with rose themes available, built‑in i18n, structured architecture | React (would add decisions & libs), Svelte (less team exposure) |
| State management | Use Angular's native signals in components and shared services | Low complexity; small data surface | NgRx (overkill) |
| Forms | Angular Reactive Forms | Built‑in solution by Angular; no extra learning for the team | Unfortunately new built‑in signal form is not out yet, ng-signal-forms (likely deprecated once built‑in form ships) |
| Internationalization | Angular i18n (compile‑time) | Low integration and bundle overhead | ngx-translate (adds dependency and runtime integration) |
| Backend framework | NestJS | Structured modules, DI, TypeORM integration | Fastify raw, Express raw (lose structure), Analog (risk of diverging from main Angular development) |
| Data access | TypeORM | Simplifies later DB switch | Prisma (no familiarity in team) |
| DB | SQLite | Zero config, low traffic, easy backup | PostgreSQL (can migrate later) |
| User-uploaded image storage | Local volume | Extremely low volume, simplest | Object storage like S3 |
| Auth (admin) | Single env-configured password checked server side | No user accounts needed; minimal risk | JWT sessions, OAuth (overkill) |
| Rate limiting | In‑process implementation in backend or native cloud solution | Choose quickest solution as risks is negligible for MVP |
| Tracking | Custom event endpoint → aggregated table | Privacy control; no cookies | Matomo/self‑hosted analytics (overkill) |
| Testing | Playwright E2E tests for core flows | Core flows should already cover almost everything; low maintenance and low complexity | Developers are encouraged to add tests as needed |
| Containerization | Docker | Uniform env, easy deploy to Hetzner, easy setup for E2E tests | Direct host Node install (less reproducible) |
| Orchestration | Serve static built Angular app from backend and mount SQLite DB file | Simplicity | Docker Compose, Kubernetes (both overkill) |
| Documentation | Markdown in repo | Close to source code; minimal overhead | External wiki (silo; can be added later for non‑technical stakeholders) |

## Deployment & Environments

Environments: `local`, `prod` (no staging initially). For ad hoc tests create a temporary branch and build & run locally or create a new Docker deployment.

Docker images:

- `backend`: Node image, mount volumes: `/data/sqlite` and `/data/file-storage`.


TLS: Use a native cloud solution or Nginx reverse proxy + Let's Encrypt, whatever is quicker for the MVP.

## Testing Strategy

Given low risk and low complexity the following quality gates are sufficient:

- E2E tests for core flows must pass.
- Manual exploratory testing based on intuition.

## Threat & Risk Considerations

Lightweight analysis is sufficient for MVP:

| Risk | Mitigation |
|------|------------|
| Spam / abuse | Rate limit per IP; could add CAPTCHA later if abused. |
| Image payload exploits | Verify MIME + extension + size (<2MB). |
| Admin password brute force | Limit login attempts per IP/time |
| Data leakage | Periodically run scrub action + restrict admin endpoints. Store no personal data besides temporary emails solely for replying. |
| Data loss (no backups) | Accept risk; can add volume backup later. |
| Server crashes | Configure automatic restart and accept short downtimes. |

## Out of scope / not required for MVP

- Observability is neither in scope of product design learning path nor technical learning path for this project. Low performance and complexity is expected. So ignore this topic completely.
- Rolling updates are not needed for MVP. Short downtimes are negligible.
- SEO optimization is only nice to have.
- Accessibility audit is only nice to have.
- Image CDN / optimization pipeline is only nice to have.
- DTO validation (`class-validator` / `class-transformer` for Nest pipes). As we provide no API access, wrong API call parameters are not our problem.
