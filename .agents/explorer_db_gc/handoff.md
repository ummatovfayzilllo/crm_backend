# File Upload Service: Controllerlar, Baza (database.json), Meta (.sync_meta.json) va Garbage Collection (GC) Tahlil Hisoboti (Handoff)

## 1. Observation (Kuzatuvlar va Dalillar)

### 1.1. Loyiha va Controller / Service Fayllari Joylashuvi
- **Loyiha ildiz katalogi**: `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service`
- **Konfiguratsiya fayli** (`/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/.env`):
  ```env
  PORT=3001
  APP_BASE_URL=http://localhost:3001
  HOST=localhost
  BOT_TOKEN=7563561103:AAH0u8zxI94sCiIf5RHrQMHkNL9vt3c1oFA
  ALLOWED_USER_ID=7463402937
  CHANNEL_ID=@upload_C
  ```
- **Global API Prefiksi** (`src/main.ts:11`):
  ```typescript
  app.setGlobalPrefix("api");
  ```
- **Server Porti** (`src/main.ts:14`):
  ```typescript
  const port = process.env.PORT || 3001;
  ```

---

### 1.2. `POST /api/upload` va `DELETE /api/delete/:file` Endpointlari
Kuzatilgan joylashuvlar:
1. **Controller Fayli**: `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/file.stream.controller.ts`
   - Class: `FileStreamerController` (`@Controller()`, `file.stream.controller.ts:10-11`)
   - **`DELETE /api/delete/:file`** (`file.stream.controller.ts:23-26`):
     ```typescript
     @Delete('delete/:file')
     async deleteFile(@Param('file') fileName: string) {
       return this.fileService.deleteFile(fileName);
     }
     ```
   - **`POST /api/upload`** (`file.stream.controller.ts:28-32`):
     ```typescript
     @UseInterceptors(FileInterceptor("file", fileStorages([])))
     @Post("upload")
     async uploadFile(@UploadedFile() file: Express.Multer.File) {
       return this.fileService.uploadFileService(file);
     }
     ```
2. **Service Fayllari**:
   - `FileStreamService`: `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/file.stream.service.ts`
     - Metod: `uploadFileService(file: Express.Multer.File)` (`file.stream.service.ts:18-45`)
     - Metod: `deleteFile(fileName: string)` (`file.stream.service.ts:71-82`)
   - `TelegramService`: `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/telegram.service.ts`
     - Metod: `uploadFile(filePath: string): Promise<string>` (`telegram.service.ts:18-49`)
     - Metod: `downloadFile(fileId: string, destPath: string): Promise<void>` (`telegram.service.ts:65-97`)
     - Metod: `testConnection(): Promise<string>` (`telegram.service.ts:52-63`)

---

### 1.3. Hozirgi Telegram Response, Olinadigan Ma'lumotlar va Saqlash Oqimi
1. **Telegramga yuborish kodi** (`src/core/services/telegram.service.ts:26-44`):
   ```typescript
   const form = new FormData();
   form.append('chat_id', this.channelId);
   form.append('document', fs.createReadStream(filePath));

   const response = await axios.post(`https://api.telegram.org/bot${this.botToken}/sendDocument`, form, {
       headers: form.getHeaders(),
   });

   // Fayl ID sini ajratib olish
   const document = response.data?.result?.document;
   if (!document) {
       const photo = response.data?.result?.photo;
       const video = response.data?.result?.video;
       if (video) return video.file_id;
       if (photo) return photo[photo.length - 1].file_id;
       throw new Error('Telegram fayl ID qaytarmadi');
   }
   return document.file_id;
   ```
2. **Telegram Bot API `sendDocument` javobining to'liq formati**:
   Telegram serveri javobida quyidagi ma'lumotlar qaytadi:
   - `response.data.result.message_id` — Telegram kanaldagi xabar raqami (`number`).
   - `response.data.result.document.file_id` — Telegramdagi fayl identifikatori (`string`).
   - `response.data.result.document.file_unique_id` — Telegramdagi unikal identifikator (`string`).
   - `response.data.result.document.file_size` — Fayl hajmi baytlarda (`number`).
   - `response.data.result.document.file_name` — Fayl nomi (`string`).
3. **Koddagi hozirgi kamchilik va ma'lumotlar holati**:
   - Hozirgi kodda **FAQAT `file_id`** ajratib olinmoqda (`telegram.service.ts:44`).
   - `message_id` va `file_unique_id` **butunlay tashlab yuborilmoqda** va saqlanmayapti.
   - Olingan `file_id` asosida `finalName = `${fileId}${ext}`` tuzilib, fayl faqat lokal diskka (`uploads/images/${finalName}`) o'tkazilmoqda (`file.stream.service.ts:33-38`).
   - **Hech qanday `database.json` yoki metadata fayli saqlanmayapti**.
   - Hozirgi `deleteFile` metodi (`file.stream.service.ts:71-82`) faqat lokal keshdan `unlinkSync(filePath)` qilmoqda, Telegram kanaldan xabarni o'chira olmaydi (chunki `message_id` mavjud emas).

---

## 2. Logic Chain (Mantiqiy Zanjir va Arxitektura Yechimi)

### 2.1. `database.json` Fayli va Strukturasi
1. **Saqlash joyi**:
   - Tavsiya etilgan joy: `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/database.json` (Loyiha ildizida yoki `uploads/database.json`).
   - Ildizda saqlanishi server qayta yonganda yoki kesh tozalanganda ham metama'lumotlarning butunligini ta'minlaydi.
2. **Struktura Formati**:
   - Massiv (`Array`) emas, **Kalit-Qiymat Lug'ati (Key-Value Dictionary Object: `Record<string, FileRecord>`)** formati eng maqbul:
   ```json
   {
     "BQACAgIAAyEGAAMBCLDDIgADB2qO8jx02If9z9rsWma5OaA1noxbAALupgACEVx4SAYlqJjne2ItPQQ.svg": {
       "file_id": "BQACAgIAAyEGAAMBCLDDIgADB2qO8jx02If9z9rsWma5OaA1noxbAALupgACEVx4SAYlqJjne2ItPQQ",
       "message_id": 1042,
       "file_unique_id": "AQADupgACEVx4Ug",
       "originalName": "avatar.svg",
       "mimeType": "image/svg+xml",
       "size": 24560,
       "uploadedAt": "2026-08-26T17:15:00.000Z"
     }
   }
   ```
3. **Nega Key-Value Map tanlandi?**:
   - **$O(1)$ Tezkor qidiruv**: `DELETE /api/delete/:fileName` so'rovi kelganda `db[fileName]` orqali bir zumda `message_id` topiladi.
   - **$O(1)$ O'chirish va yangilash**: `delete db[fileName]` orqali butun massivni filtrlab o'tirishga hojat qolmaydi.
   - **Duplikatlarning oldini olish**: `fileName` tabiiy unikal kalit (primary key) vazifasini bajaradi.

---

### 2.2. `.sync_meta.json` Fayli va Strukturasi
1. **Saqlash joyi**:
   - `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/.sync_meta.json`
2. **Maqsadi**:
   - Telegram kanalida butun `database.json` zaxirasi yagona "Master Message" sifatida turadi.
   - Har bir yangilanishda (upload yoki delete) `database.json` Telegram kanalga `editMessageMedia` orqali qayta yoziladi.
   - Buning uchun Telegram kanaldagi o'sha zaxira xabarining ID si — `masterMessageId` zarur.
3. **Struktura Formati**:
   ```json
   {
     "masterMessageId": 1045,
     "channelId": "@upload_C",
     "lastSyncedAt": "2026-08-26T17:15:00.000Z",
     "version": 1,
     "totalFiles": 1
   }
   ```
   - `masterMessageId: number | null` — Telegram kanalidagi `database.json` zaxira xabarining `message_id` si.
   - `channelId: string` — Zaxira saqlanayotgan Telegram kanal (`@upload_C`).
   - `lastSyncedAt: string` — Oxirgi marta `editMessageMedia` qilingan sana (ISO 8601).
   - `version: number` — Sinxronizatsiya versiyasi (inkremental: 1, 2, 3...).
   - `totalFiles: number` — Bazadagi jami yozuvlar soni.

---

### 2.3. DELETE / Garbage Collection (GC) Oqim Zanjiri
To'liq va xatosiz ishlaydigan Garbage Collection zanjiri 7 ta aniq bosqichdan iborat:

```
[Client/Frontend]
       │
       ▼ (1. DELETE /api/delete/:fileName)
[FileStreamerController.deleteFile]
       │
       ▼
[FileStreamService.deleteFile]
       │
       ├─► (2. Read database.json) ──► Topildi: { message_id, file_id }
       │
       ├─► (3. TelegramService.deleteMessage) ──► POST https://api.telegram.org/bot<TOKEN>/deleteMessage
       │                                         { chat_id: CHANNEL_ID, message_id: 1042 }
       │                                         (Kanal postidan o'chiriladi)
       │
       ├─► (4. Disk Cleanup) ──► unlinkSync(uploads/images/fileName)
       │
       ├─► (5. Update database.json) ──► delete db[fileName] & writeFileSync
       │
       ├─► (6. Sync Master to Telegram) ──► TelegramService.syncDatabaseBackup()
       │                                    POST https://api.telegram.org/bot<TOKEN>/editMessageMedia
       │                                    (masterMessageId ustiga yangi database.json yoziladi)
       │                                    Agar masterMessageId bo'lmasa: sendDocument + ALLOWED_USER_ID ga alert
       │
       ▼ (7. Return Response)
{ "success": true, "message": "Fayl keshdan va Telegram kanaldan muvaffaqiyatli o'chirildi" }
```

---

## 3. Caveats (Cheklovlar va Diqqat Talab Qiladigan Joylar)

1. **Telegram API Cheklovlari (Rate Limits va Error Handling)**:
   - Agar o'chirilayotgan `message_id` allaqachon Telegramdan qo'lda yoki bot tomonidan o'chirilgan bo'lsa, Telegram `400 Bad Request: message to delete not found` qaytaradi. Service bu xatoni ushlashi (`catch`) va jarayonni to'xtatmasdan kesh va `database.json` ni tozalashda davom etishi kerak.
2. **`editMessageMedia` Parametrlari**:
   - Telegram Bot API da `editMessageMedia` orqali fayl yangilanganda `media: JSON.stringify({ type: 'document', media: 'attach://database_doc' })` va multipart `database_doc` fayl oqimi yuboriladi.
   - Agar kanal master xabari o'chib ketgan bo'lsa (yoki birinchi ishga tushish bo'lsa), avtomatik `sendDocument` orqali yangi master xabar yaratilishi, `.sync_meta.json` ga yangi `masterMessageId` yozilishi va `ALLOWED_USER_ID` ga `"Yangi Baza yaratildi"` xabari borishi shart.
3. **Fayl Tizimi Concurrency**:
   - Bir vaqtda bir nechta fayl yuklanganda yoki o'chirilganda `database.json` ga yozishda poyga holati (race condition) bo'lmasligi uchun faylga yozish operatsiyalari sinxron (`writeFileSync`) yoki sodda navbat (mutex/queue) orqali boshqarilishi lozim.

---

## 4. Conclusion (Aniq Xulosa va Takliflar)

1. **Controller va Service'lar**:
   - Controller: `src/core/services/file.stream.controller.ts` (`@Post('upload')` va `@Delete('delete/:file')`).
   - Servicelar: `src/core/services/file.stream.service.ts` va `src/core/services/telegram.service.ts`.
2. **Telegram Metama'lumotlari**:
   - `TelegramService.uploadFile` metodini faqat `file_id` emas, `{ file_id, message_id, file_unique_id, size }` ob'ektini qaytaradigan qilib kengaytirish kerak.
3. **`database.json`**:
   - Loyiha ildizida saqlanadi.
   - Format: `{ [fileName: string]: { file_id: string, message_id: number, file_unique_id?: string, size: number, uploadedAt: string } }`.
4. **`.sync_meta.json`**:
   - Loyiha ildizida saqlanadi.
   - Format: `{ masterMessageId: number | null, channelId: string, lastSyncedAt: string, version: number, totalFiles: number }`.
5. **Garbage Collection (GC) Zanjiri**:
   - `DELETE /api/delete/:file` kelganda:
     1) `database.json` dan `message_id` topiladi;
     2) Telegram Bot API `deleteMessage` orqali kanaldan o'chiriladi;
     3) Lokal kesh fayli o'chiriladi (`unlinkSync`);
     4) `database.json` dan yozuv o'chirilib, fayl yangilanadi;
     5) Telegram kanalidagi master xabarga `editMessageMedia` orqali yangi `database.json` zaxiralanadi (agar master xabar bo'lmasa, `sendDocument` qilinib, `ALLOWED_USER_ID` ga xabarnoma jo'natiladi).

---

## 5. Verification Method (Mustaqil Tekshirish Usuli)

Quyidagi qadamlar orqali tekshirish mumkin:

1. **Controller va Service fayllarini tekshirish**:
   - `view_file` `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/file.stream.controller.ts`
   - `view_file` `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/file.stream.service.ts`
   - `view_file` `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/telegram.service.ts`
2. **Konfiguratsiya va Telegram sozlamalarini tekshirish**:
   - `view_file` `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/.env` (`BOT_TOKEN`, `CHANNEL_ID`, `ALLOWED_USER_ID`)
3. **Amaliy Test (Implementatsiyadan so'ng)**:
   - Rasm yuklash: `curl -F "file=@test.png" http://localhost:3001/api/upload`
   - `database.json` da `message_id` va `file_id` yozilganini hamda `.sync_meta.json` da `masterMessageId` paydo bo'lganini tekshirish.
   - O'chirish (GC): `curl -X DELETE http://localhost:3001/api/delete/<fileName>`
   - Telegram kanalda xabar o'chganini (`deleteMessage`) va master backup yangilanganini (`editMessageMedia`) tekshirish.
