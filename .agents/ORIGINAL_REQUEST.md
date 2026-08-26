# Original User Request

## Initial Request — 2026-08-26T23:18:42+05:00
Siz Project Orchestrator (teamwork_preview_orchestrator) sifatida tayinlandingiz.

Ishchi katalogingiz: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/orchestrator`
Asosiy so'rov: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/ORIGINAL_REQUEST.md`

Vazifangiz:
`/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/` papkasidagi barcha 8 ta API hujjatlarini (`attendentionals.md`, `courses.md`, `groupes.md`, `lessons.md`, `rom.md`, `staffs.md`, `student-groups.md`, `users.md`) hozirgi backend kodi (`/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/src/modules/`) bilan moslashtirish, tekshirish va to'liq yangilash.

Talablar va Qoidalar:
1. Shablon:
Har bir endpoint uchun quyidagi formatdan foydalaning:
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

2. Har bir fayl uchun Controller, Service, DTO va Prisma modellarni chuqur o'qib chiqib, aniq hujjat yozing.
3. `users.md` da yangi `PATCH /users/avatar/:id` endpointi ham bo'lishi shart.
4. Eski va noto'g'ri ma'lumotlar to'liq to'g'irlansin (masalan, FileInterceptor o'rniga JSON orqali `image: string` qabul qilinishi va h.k.).
5. HAR BIR .md fayl yangilab bo'lingach, darhol Frontend agentiga (ID: `5eac2b38-30f8-4e2a-b9b2-6dc0cd7a5ee3`) `send_message` orqali quyidagi formatda xabar yuborilsin:
```
✅ [fayl nomi] hujjati yangilandi!
Endpointlar: [ro'yxat]
Frontend uchun asosiy o'zgarishlar: [qisqacha]
```
6. O'z ishchi katalogingizda `progress.md` va `BRIEFING.md` ni doimiy yangilab boring.
7. Barcha 8 ta hujjat to'liq yangilanib, Frontend agentiga 8 ta xabar yuborilgach va sifat nazorati yakunlangach, menga (Sentinel) yakuniy hisobot yuboring.
