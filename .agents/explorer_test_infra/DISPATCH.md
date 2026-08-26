## 2026-08-26T17:18:00Z
Topshiriq:
`/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service` loyihasidagi test infratuzilmasi va avtomatlashtirilgan verifikatsiya imkoniyatlarini tekshiring.
Ayniqsa:
1. `file_upload_service` qanday ishga tushiriladi (`npm run start:dev` yoki `npm run build && npm run start:prod`)? `package.json` dagi scriptlar va dependencylar nimalardan iborat?
2. Loyihada Jest, ts-node yoki alohida standalone test skripti (masalan, `tests/e2e-sync-gc.test.ts` yoki `scripts/verify-sync.ts`) qanday ishlatilishi mumkin?
3. Avtomatlashtirilgan verifikatsiya skripti qanday qadamlarni bajarishi kerak:
   - 1-qadam: Test rasm faylini yaratish va `POST /api/upload` orqali yuklash.
   - 2-qadam: `database.json` faylida yangi `file_id` va `message_id` yozilganini tekshirish.
   - 3-qadam: Telegram kanalida `masterMessageId` orqali zaxira bazasi (`database.json`) yangilanganini va `ALLOWED_USER_ID` ga xabarnoma borganini (yoki meta faylda `masterMessageId` borligini) tekshirish.
   - 4-qadam: `DELETE /api/delete/:fileName` orqali faylni o'chirish.
   - 5-qadam: Telegram kanaldan ushbu `message_id` xabari o'chirilganini (`getChat` / `deleteMessage` status yoki DB dan tozalanganini) tekshirish.
   - 6-qadam: `database.json` va `.sync_meta.json` yangilanganini tasdiqlash.
4. Test skripti 0 xato (exit code 0) bilan ishlashi uchun nimalar talab etiladi?

Barcha dalillarni `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/explorer_test_infra/handoff.md` fayliga yozing va tugatgach `send_message` orqali xabar bering. Hech qanday kodni o'zgartirmang (read-only).
