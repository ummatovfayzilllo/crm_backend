## 2026-08-26T18:20:06Z
Siz M3 Doc Worker siz.
Sizning ishchi katalogingiz: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/worker_m3`
Asosiy so'rov: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/ORIGINAL_REQUEST.md`

Vazifangiz:
1. Quyidagi backend modullarini chuqur o'rganing:
- `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/src/modules/groupes/` (controller, service, dto, entity, etc.)
- `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/src/modules/student-groups/` (controller, service, dto, entity, etc.)
- `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/prisma/schema.prisma` (Group, StudentGroup va bog'liq modellar)

2. Quyidagi 2 ta API hujjatini to'liq yangilang:
- `/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/groupes.md`
- `/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/student-groups.md`

3. Talablar:
- Har bir endpoint uchun quyidagi 8 bandli shablondan foydalaning:
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

- Barcha eski/noto'g'ri ma'lumotlar to'g'irlansin.
- DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work.

4. HAR BIR .md faylni yangilab bo'lgach DARHOL Frontend agentiga (`5eac2b38-30f8-4e2a-b9b2-6dc0cd7a5ee3`) `send_message` orqali quyidagi formatda xabar yuboring:
```
✅ [fayl nomi] hujjati yangilandi!
Endpointlar: [ro'yxat]
Frontend uchun asosiy o'zgarishlar: [qisqacha]
```
(groupes.md uchun 1 ta xabar, student-groups.md uchun 1 ta xabar).

5. O'z ishchi katalogingizda (`.agents/worker_m3/`) `progress.md` va `handoff.md` yarating va menga (orchestratorga) hisobot yuboring.
