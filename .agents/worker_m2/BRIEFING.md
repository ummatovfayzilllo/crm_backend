# BRIEFING — 2026-08-26T23:23:10+05:00

## Mission
Backend modullari (`courses`, `rom`) va ularning Prisma modellarini to'liq o'rganib, `backend_api_docs/courses.md` va `backend_api_docs/rom.md` API hujjatlarini 8 bandli standart shablon asosida yangilash, frontend agentiga bildirishnoma yuborish va hisobot berish.

## 🔒 My Identity
- Archetype: M2 Doc Worker
- Roles: implementer, qa, specialist
- Working directory: /home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/worker_m2
- Original parent: 050243a5-fc96-4da6-b2f8-9ae6b5dce1a5
- Milestone: M2 API Documentation Update (courses & rom)

## 🔒 Key Constraints
- Har bir endpoint uchun majburiy 8 bandli shablon qo'llansin.
- Har bir .md fayl yangilangach DARHOL Frontend agentiga (`5eac2b38-30f8-4e2a-b9b2-6dc0cd7a5ee3`) `send_message` yuborilsin.
- Hamma ma'lumotlar aniq, haqqoniy va kod bazasiga to'liq mos bo'lsin.
- Yakunda `handoff.md` va orchestratorga xabar yuborilsin.

## Current Parent
- Conversation ID: 050243a5-fc96-4da6-b2f8-9ae6b5dce1a5
- Updated: not yet

## Task Summary
- **What to build**: Yangilangan `backend_api_docs/courses.md` va `backend_api_docs/rom.md`.
- **Success criteria**: 8 bandli shablon to'liq to'ldirilgan, real controller/service/dto/prisma kodiga asoslangan, frontend agent xabardor qilingan.
- **Interface contracts**: `src/modules/courses/*`, `src/modules/rom/*`, `prisma/schema.prisma`
- **Code layout**: API hujjatlari `/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/` da joylashgan.

## Change Tracker
- **Files modified**:
  - `/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/courses.md`: Courses API hujjati 8 bandli shablon asosida yangilandi.
  - `/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/rom.md`: Rom API hujjati 8 bandli shablon asosida yangilandi.
- **Build status**: pass (hujjatlashtirish vazifasi)
- **Pending issues**: none

## Quality Status
- **Build/test result**: pass
- **Lint status**: clean
- **Tests added/modified**: none (docs only)

## Loaded Skills
- none

## Key Decisions Made
- `courses` va `rom` modullari to'liq tahlil qilindi; ikkala controller ham `JwtAuthGuard` bilan himoyalangani va `rom` controller yo'li `/rooms` ekani hujjatlarda aniq aks ettirildi.

## Artifact Index
- `/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/courses.md`
- `/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/rom.md`
- `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/worker_m2/handoff.md`
