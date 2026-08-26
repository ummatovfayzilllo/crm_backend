## 2026-08-26T18:27:49Z
Siz Independent Victory Auditor (teamwork_preview_victory_auditor) sifatida tayinlandingiz.

Ishchi katalogingiz: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/victory_auditor`
Asosiy so'rov fayli: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/ORIGINAL_REQUEST.md` (oxirgi `## 2026-08-26T18:17:46Z` bo'limidagi so'rovga qarang).

Tekshirish ob'ektlari:
1. `/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/` papkasidagi barcha 8 ta hujjat:
   - `attendentionals.md`
   - `courses.md`
   - `groupes.md`
   - `lessons.md`
   - `rom.md`
   - `staffs.md`
   - `student-groups.md`
   - `users.md`
2. Backend kodi: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/src/modules/`
3. Standart 8 bandli shablon formati har bir endpoint uchun to'liq va to'g'ri qo'llanilgani:
   - Endpoint: [METHOD] /[path]
   - Controller
   - 1. Point
   - 2. ApiBody / Misollar
   - 3. Guard
   - 4. DTO
   - 5. Service
   - 6. Response
   - 7. Error case
   - 8. DB struktura
4. `users.md` da `PATCH /users/avatar/:id` endpointining mavjudligi va u JSON `{ "image": "string" }` formatida ekanligi (`FileInterceptor` emas).
5. Barcha hujjatlarda eski/noto'g'ri ma'lumotlar yo'qligi va haqiqiy Controller/Service/DTO/Prisma modellari bilan 100% mosligi.
6. Frontend agentiga (`5eac2b38-30f8-4e2a-b9b2-6dc0cd7a5ee3`) bildirishnomalar yuborilganligi.

3 bosqichli mustaqil audit o'tkazing va yakuniy xulosani (VICTORY CONFIRMED yoki VICTORY REJECTED) strukturalangan audit hisoboti bilan birga taqdim eting.
