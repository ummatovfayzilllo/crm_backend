# BRIEFING — 2026-08-26T15:56:40Z

## Mission
Implement Milestone 1: CRM Backend Avatar API (`UpdateAvatarDto`, `UsersService.updateAvatar`, `UsersController.updateAvatar`)

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: /home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/worker_m1_backend
- Original parent: 4d7e3d8f-4070-4955-85b0-506443f714c3
- Milestone: M1 (Backend Avatar API)

## 🔒 Key Constraints
- Pure JSON endpoint, no multipart / FileInterceptor.
- Clean validation with class-validator.
- Unlink old local image if applicable.
- Flatten user response with flattenUser.
- Genuine implementation, no hardcoded cheating.

## Current Parent
- Conversation ID: 4d7e3d8f-4070-4955-85b0-506443f714c3
- Updated: 2026-08-26T15:56:40Z

## Task Summary
- **What to build**: UpdateAvatarDto, UsersService.updateAvatar, UsersController.updateAvatar
- **Success criteria**: PATCH /api/users/avatar/:id updates user.image in DB and returns { message: 'Avatar successfully updated', user: ... }, compiles with `npm run build`, verified with unit test.
- **Interface contracts**: PROJECT.md § Interface Contracts
- **Code layout**: PROJECT.md § Code Layout

## Change Tracker
- **Files modified**: None yet
- **Build status**: Untested
- **Pending issues**: None

## Quality Status
- **Build/test result**: Not run yet
- **Lint status**: 0 violations
- **Tests added/modified**: Pending

## Loaded Skills
- None
