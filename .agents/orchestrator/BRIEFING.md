# BRIEFING — 2026-08-26T23:27:00+05:00

## Mission
backend_api_docs papkasidagi 8 ta API hujjatini backend kodi (src/modules) asosida to'liq tekshirish, yangilash va Frontend agentiga xabar berish.

## 🔒 My Identity
- Archetype: teamwork_preview_orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/orchestrator
- Original parent: parent (Sentinel)
- Original parent conversation ID: 5fb32caf-5398-4cb9-aac6-2d7acc41daa3

## 🔒 My Workflow
- **Pattern**: Project / Milestone Decomposition
- **Scope document**: /home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/PROJECT.md
1. **Decompose**: 8 ta API hujjatini modullar bo'yicha alohida ish bo'laklariga ajratish va Worker agentlarga biriktirish.
2. **Dispatch & Execute**: Har bir modul uchun Worker to'liq tekshirib yangiladi. Har bir .md tayyor bo'lgach Frontend agentiga (5eac2b38-30f8-4e2a-b9b2-6dc0cd7a5ee3) send_message yuborildi.
3. **Review & Audit**: Reviewer APPROVE berdi, Auditor CLEAN verdictini qaytardi.
4. **Conclusion**: Barcha 8 ta hujjat to'liq yangilandi.

## 🔒 Key Constraints
- Har bir endpoint 8 bandli shablon bo'yicha yozildi.
- users.md da PATCH /users/avatar/:id mavjud.
- FileInterceptor o'rniga JSON image: string va h.k. dolzarb backend holati aks ettirildi.
- Har bir fayl yangilanganda Frontend agentiga xabar yuborildi.
- DISPATCH-ONLY: Barcha vazifalar subagentlar orqali amalga oshirildi.

## Current Parent
- Conversation ID: 5fb32caf-5398-4cb9-aac6-2d7acc41daa3
- Updated: 2026-08-26T23:27:00+05:00

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| worker_m1 | teamwork_preview_worker | users.md, staffs.md | completed | 320942bf-e188-44ae-ae38-522fa85422c4 |
| worker_m2 | teamwork_preview_worker | courses.md, rom.md | completed | 6d9f44df-5db6-4909-8eea-d19cf4817dc0 |
| worker_m3 | teamwork_preview_worker | groupes.md, student-groups.md | completed | 0c135f0e-0c8e-4ad4-b037-1b94f4a92b36 |
| worker_m4 | teamwork_preview_worker | lessons.md, attendentionals.md | completed | 672ebd83-1329-4b44-ad34-a971d7ce0b09 |
| reviewer_m5 | teamwork_preview_reviewer | Quality Review all 8 docs | completed (APPROVE) | a386d8d4-467a-4e66-8657-0439052a3f4a |
| auditor_m5 | teamwork_preview_auditor | Forensic Integrity Audit | completed (CLEAN) | a0f2e978-19d6-4d5f-9b30-9fb5c97aa164 |

## Succession Status
- Succession required: no
- Spawn count: 6 / 16
- Pending subagents: none
- Predecessor: none
- Successor: not needed

## Active Timers
- Heartbeat cron: 050243a5-fc96-4da6-b2f8-9ae6b5dce1a5/task-12 (yakunlashda to'xtatiladi)
- Safety timer: none
