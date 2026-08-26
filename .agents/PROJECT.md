# Project: Backend API Documentation Sync & Verification

## Architecture & Scope
Sync all 8 API markdown documentation files in `/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/` with the current NestJS backend code in `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/src/modules/` and Prisma schema in `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/prisma/schema.prisma`.

## Feature Inventory
| # | Feature / Target Doc | Backend Module | Milestone | Status | Source |
|---|----------------------|----------------|-----------|--------|--------|
| 1 | users.md | src/modules/users | M1 | DONE | /backend_api_docs/users.md |
| 2 | staffs.md | src/modules/staffs | M1 | DONE | /backend_api_docs/staffs.md |
| 3 | courses.md | src/modules/courses | M2 | DONE | /backend_api_docs/courses.md |
| 4 | rom.md | src/modules/rom | M2 | DONE | /backend_api_docs/rom.md |
| 5 | groupes.md | src/modules/groupes | M3 | DONE | /backend_api_docs/groupes.md |
| 6 | student-groups.md | src/modules/student-groups | M3 | DONE | /backend_api_docs/student-groups.md |
| 7 | lessons.md | src/modules/lessons | M4 | DONE | /backend_api_docs/lessons.md |
| 8 | attendentionals.md | src/modules/attendentionals | M4 | DONE | /backend_api_docs/attendentionals.md |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Users & Staffs Docs | users.md, staffs.md | none | DONE |
| M2 | Courses & Rooms Docs | courses.md, rom.md | none | DONE |
| M3 | Groups & Student-Groups Docs | groupes.md, student-groups.md | none | DONE |
| M4 | Lessons & Attendances Docs | lessons.md, attendentionals.md | none | DONE |
| M5 | Quality Audit & Final Verification | All 8 docs & notifications | M1, M2, M3, M4 | DONE |

## Template Requirement
For every endpoint:
### Endpoint: [METHOD] /[path]
**Controller:** [fayl yo'li]:[method nomi]

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l
- Controller class + method nomi

**2. ApiBody / Misollar:**
[Request body misollari]

**3. Guard:**
[Auth holati]

**4. DTO:**
[Request/Response DTO lar]

**5. Service:**
[Service metodi va mantiqi]

**6. Response:**
[Javob formati]

**7. Error case:**
[Xato holatlari]

**8. DB struktura:**
[Prisma model va maydonlar]
