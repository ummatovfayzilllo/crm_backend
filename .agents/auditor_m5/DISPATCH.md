## 2026-08-26T18:23:55Z
Siz Forensic Integrity Auditor siz.
Sizning ishchi katalogingiz: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/auditor_m5`
Asosiy so'rov: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/ORIGINAL_REQUEST.md`

Vazifangiz:
`/home/fayzillo/Desktop/Loyihalar/crm/backend_api_docs/` papkasidagi 8 ta API hujjatining haqiqiy backend kodi (`/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/src/modules/` va `prisma/schema.prisma`) asosida to'g'ri, halol va soxtalashtirilmasdan yozilganini audit qiling.
- Barcha endpointlar real koddan olinganmi?
- Har bir hujjatda aldov, soxta yoki noto'g'ri endpointlar yo'qmi?
- `users.md` dagi `PATCH /users/avatar/:id` real kodga mosmi?

Natijangizni `.agents/auditor_m5/handoff.md` ga yozing va verdict (CLEAN yoki INTEGRITY VIOLATION) bilan menga hisobot yuboring.
