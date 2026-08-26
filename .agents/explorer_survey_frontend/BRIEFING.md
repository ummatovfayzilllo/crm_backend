# BRIEFING — 2026-08-26T15:53:20Z

## Mission
Frontend kod bazasini to'liq tadqiq qilish, o'qituvchi profilida avatarni yangilash UI va File Service integratsiyasi bo'yicha tavsiyalar va handoff hisobotini tayyorlash.

## 🔒 My Identity
- Archetype: explorer
- Roles: Survey Explorer, Frontend Codebase Analyst
- Working directory: /home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/explorer_survey_frontend
- Original parent: 4d7e3d8f-4070-4955-85b0-506443f714c3
- Milestone: Frontend Survey & Architecture Specification

## 🔒 Key Constraints
- Read-only investigation — do NOT implement directly
- Uzbek language default for communications
- All handoff findings written to handoff.md

## Current Parent
- Conversation ID: 4d7e3d8f-4070-4955-85b0-506443f714c3
- Updated: 2026-08-26T15:53:20Z

## Investigation State
- **Explored paths**:
  - `/home/fayzillo/Desktop/Loyihalar/crm/crm_frontend`
  - `src/app/admin-panel/teachers/[teacherId]/page.tsx`
  - `src/app/admin-panel/teachers/page.tsx`
  - `src/components/modal/UpdateUser.tsx`
  - `src/components/modal/CreateUser.tsx`
  - `src/lib/axios.ts`
  - `src/lib/ui.state.ts`
  - `src/features/users/api.ts`
  - `src/features/staffs/api.ts`
  - `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service`
- **Key findings**:
  - Frontend Next.js 15.5.5, React 19, Tailwind CSS v4, Zustand.
  - Currently, teacher profile renders avatar at `[teacherId]/page.tsx` with a legacy URL prefix.
  - Update user modal is full-form (8 fields) and already contains Direct File Service upload + GC logic.
  - No dedicated Update Avatar button/modal exists currently.
  - Recommendations written with full UI modal design, File Service utility, and garbage collection.
- **Unexplored areas**: None, all requirements answered.

## Key Decisions Made
- Recommended creating a centralized `fileService.ts` utility.
- Recommended adding `updateAvatar` method to `usersApi`.
- Recommended adding `UpdateAvatarModal.tsx` and camera overlay icon on the teacher profile avatar.

## Artifact Index
- `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/explorer_survey_frontend/handoff.md` — Full 5-component handoff report.
