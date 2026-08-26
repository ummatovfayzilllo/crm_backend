# Handoff Report: Telegram Integratsiyasi Tahlili (File Upload Service)

**Tadqiqotchi:** Explorer Agent (`explorer_telegram_sync`)  
**Sana:** 2026-08-26  
**Loyiha:** `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service`  

---

## 1. Observation (To'g'ridan-to'g'ri Kuzatuvlar)

### 1.1. Loyiha tuzilishi va Telegram fayllari
- **Mavjud Telegram xizmati joylashuvi**: `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/telegram.service.ts`
- **Mavjud FileStream xizmatlari**:
  - `src/core/services/file.stream.service.ts` (15, 28, 58, 85-qatorlarda `TelegramService` chaqirilgan)
  - `src/core/services/file.stream.controller.ts` (`@Get('start')`, `@Delete('delete/:file')`, `@Post('upload')`, `@Get('image/:file')`, va boshqalar)
  - `src/app.module.ts` (12-qatorda `providers: [AppService, FileStreamService, TelegramService]`)

### 1.2. Kutubxonalar va Bog'liqliklar (`package.json`)
`/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/package.json` (22-35 qatorlar):
```json
"dependencies": {
  "@nestjs/common": "^11.0.1",
  "@nestjs/config": "^4.0.4",
  "@nestjs/core": "^11.0.1",
  "@nestjs/platform-express": "^11.0.1",
  "@nestjs/swagger": "^11.4.7",
  "axios": "^1.20.0",
  "canvas": "^3.2.3",
  "form-data": "^4.0.6",
  "multer": "^2.2.0",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1",
  "uuid": "^14.0.2"
}
```
> **Fakt:** Telegraf, grammy yoki node-telegram-bot-api kutubxonalari mavjud emas. Loyiha to'liq **`axios`** va **`form-data`** orqali to'g'ridan-to'g'ri Telegram Bot API HTTP endpointlariga murojaat qiladi.

### 1.3. Muhit o'zgaruvchilari (`.env`)
`/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/.env` (1-12 qatorlar):
```env
PORT=3001
APP_BASE_URL=http://localhost:3001
HOST=localhost

# Telegram Sozlamalari (Fayllarni zaxiralash uchun)
BOT_TOKEN=7563561103:AAH0u8zxI94sCiIf5RHrQMHkNL9vt3c1oFA
ALLOWED_USER_ID=7463402937
CHANNEL_ID=@upload_C
```

`/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/.env.example` (1-9 qatorlar):
```env
PORT=3001
APP_BASE_URL=http://localhost:3001
HOST=localhost

BOT_TOKEN=7777777777:AAHxxxxxx_YYYYYYYYYYY
CHANNEL_ID=-1001234567890
```

### 1.4. `telegram.service.ts` ning mavjud metodlari
`/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/telegram.service.ts`:
1. `uploadFile(filePath: string): Promise<string>` (18-49 qatorlar):
   - `fs.createReadStream(filePath)` orqali faylni oladi, `FormData` ga `chat_id` va `document` qilib joylaydi.
   - `POST https://api.telegram.org/bot${this.botToken}/sendDocument` ga yuboradi.
   - Telegram javobidan faqat `document.file_id` (yoki photo/video file_id) ni qaytaradi.
   - *Kamchilik:* `response.data.result.message_id` tashlab yuborilmoqda, saqlanmayapti.
2. `testConnection(): Promise<string>` (52-63 qatorlar):
   - `POST https://api.telegram.org/bot${this.botToken}/sendMessage` orqali `this.channelId` ga test xabarini yuboradi.
3. `downloadFile(fileId: string, destPath: string): Promise<void>` (65-97 qatorlar):
   - `GET https://api.telegram.org/bot${this.botToken}/getFile?file_id=${fileId}` orqali fayl yo'lini oladi.
   - `GET https://api.telegram.org/file/bot${this.botToken}/${tgFilePath}` orqali yuklab olib, `fs.createWriteStream(destPath)` orqali lokal keshga saqlaydi.

### 1.5. Hozirgi o'chirish (`deleteFile`) mexanizmi
`/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/file.stream.service.ts` (71-82 qatorlar):
- `unlinkSync(filePath)` orqali faqat mahalliy diskdan faylni o'chirmoqda. Telegram kanaldan xabarni o'chirish logikasi hali kiritilmagan.

---

## 2. Logic Chain (Mantiqiy Zanjir va Tavsiyalar)

### 2.1. Topshiriq savollariga to'liq javoblar va texnik yechimlar

#### Savol 1 & 2: `telegram.service.ts` tuzilishi va bot kutubxonasi
- Xizmat `src/core/services/telegram.service.ts` da NestJS provayderi sifatida yozilgan.
- Hech qanday og'ir Telegram bot kutubxonasisiz, yengil `axios` + `form-data` orqali to'g'ridan-to'g'ri Telegram Bot API ga so'rov yuborilmoqda. Ushbu arxitektura mikroservis uchun juda qulay va qo'shimcha paketlarsiz tez ishlaydi.

#### Savol 3: `.env` o'zgaruvchilari
- `BOT_TOKEN`: Telegram bot tokeni.
- `CHANNEL_ID`: Zaxira fayllari yuklanadigan Telegram kanal username/ID si (`@upload_C`).
- `ALLOWED_USER_ID`: Baza yaratilganda yoki muhim hodisalarda bildirishnoma oluvchi ruxsat berilgan Telegram foydalanuvchi ID si (`7463402937`).

#### Savol 4: `database.json` ni Telegram kanalga yuborish va `editMessageMedia` orqali yangilash
Telegram Bot API da `database.json` bilan sinxronlash quyidagi 2 ta metod orqali amalga oshirilishi kerak:

1. **Ilk bor baza faylini kanalga yuborish (`sendDocumentBackup`)**:
   - **Maqsad:** Baza faylini birinchi marta kanalga yuklash va `masterMessageId` ni olish.
   - **Telegram API**: `POST https://api.telegram.org/bot${botToken}/sendDocument`
   - **Parametrlar**:
     - `chat_id`: `CHANNEL_ID`
     - `document`: `fs.createReadStream(databaseJsonPath)` (fayl nomi `database.json` ko'rinishida)
     - `caption`: `📦 CRM Database Backup - Initialized at ${new Date().toISOString()}`
   - **Natija**: Telegram qaytargan `response.data.result.message_id` olinadi va `.sync_meta.json` faylida quyidagicha saqlanadi:
     ```json
     {
       "masterMessageId": 1234,
       "channelId": "@upload_C",
       "lastSync": "2026-08-26T22:20:00.000Z"
     }
     ```

2. **Mavjud xabardagi `database.json` ni tahrirlash/yangilash (`editMessageMediaBackup`)**:
   - **Maqsad:** Har gal yangi fayl yuklanganda yoki o'chirilganda kanalga yangi xabar yozmasdan, o'sha bitta xabardagi `database.json` ni in-place yangilash.
   - **Telegram API**: `POST https://api.telegram.org/bot${botToken}/editMessageMedia`
   - **Tuzilishi (Multipart Form-Data)**:
     ```typescript
     const form = new FormData();
     form.append('chat_id', this.channelId);
     form.append('message_id', String(masterMessageId));
     form.append('media', JSON.stringify({
       type: 'document',
       media: 'attach://database_file',
       caption: `📦 CRM Database Backup - Updated: ${new Date().toISOString()}`
     }));
     form.append('database_file', fs.createReadStream(databaseJsonPath), {
       filename: 'database.json',
       contentType: 'application/json'
     });

     await axios.post(
       `https://api.telegram.org/bot${this.botToken}/editMessageMedia`,
       form,
       { headers: form.getHeaders() }
     );
     ```
   - **Xatolik holati (Fallback)**: Agar Telegram xabari o'chirilgan bo'lsa (`message to edit not found`), tizim avtomatik ravishda `sendDocumentBackup` ni chaqirib, yangi `masterMessageId` hosil qilishi va `ALLOWED_USER_ID` ga xabar yuborishi lozim.

#### Savol 5: `ALLOWED_USER_ID` ga "Yangi Baza yaratildi" xabarini jo'natish mexanizmi
- **Telegram API**: `POST https://api.telegram.org/bot${botToken}/sendMessage`
- **Tuzilishi**:
  ```typescript
  async notifyAdmin(text: string): Promise<void> {
    const adminId = this.config.get<string>('ALLOWED_USER_ID');
    if (!adminId || !this.botToken) return;

    try {
      await axios.post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        chat_id: adminId,
        text: text,
        parse_mode: 'HTML'
      });
    } catch (error) {
      this.logger.warn(`Admin (${adminId}) ga bildirishnoma jo'natib bo'lmadi: ${error.message}`);
    }
  }
  ```
- **Foydalanish o'rni:** `.sync_meta.json` birinchi marta hosil qilinganda yoki yangi master xabar yuborilganda:
  ```typescript
  await this.notifyAdmin(
    `🎉 <b>Yangi Baza yaratildi!</b>\n` +
    `📅 <i>Vaqt:</i> ${new Date().toLocaleString()}\n` +
    `🆔 <i>Master Message ID:</i> <code>${masterMessageId}</code>\n` +
    `📢 <i>Kanal:</i> ${this.channelId}`
  );
  ```

#### Savol 6: Telegram kanaldan xabarni o'chirish (`deleteMessage` API metodi)
- **Telegram API**: `POST https://api.telegram.org/bot${botToken}/deleteMessage`
- **Parametrlar (JSON)**:
  ```typescript
  async deleteMessage(messageId: number): Promise<boolean> {
    try {
      if (!this.botToken || !this.channelId) return false;

      const response = await axios.post(`https://api.telegram.org/bot${this.botToken}/deleteMessage`, {
        chat_id: this.channelId,
        message_id: messageId
      });

      return response.data?.ok === true;
    } catch (error) {
      this.logger.error(`Telegramdan xabarni (${messageId}) o'chirishda xatolik:`, error?.response?.data || error.message);
      return false;
    }
  }
  ```
- **Garbage Collection (GC) Mantiqi**:
  1. `uploadFile` metodini `Promise<{ fileId: string, messageId: number }>` qaytaradigan qilish.
  2. Yuklangan har bir fayl uchun `database.json` da quyidagi yozuv saqlanadi:
     ```json
     {
       "files": {
         "AgACAgIAAxk...png": {
           "fileId": "AgACAgIAAxk...",
           "messageId": 1042,
           "originalName": "avatar.png",
           "mimeType": "image/png",
           "createdAt": "2026-08-26T22:20:00.000Z"
         }
       }
     }
     ```
  3. `DELETE /api/delete/:file` kelganda:
     - Lokal keshdan fayl o'chiriladi (`unlinkSync`).
     - `database.json` dan ushbu fayl nomi bo'yicha `messageId` olinadi.
     - `telegramService.deleteMessage(messageId)` chaqirilib, Telegram kanaldagi xabar o'chiriladi.
     - `database.json` dan yozuv o'chirilib, `editMessageMedia` orqali yangilangan `database.json` kanalga sinxronlanadi.

---

## 3. Caveats (Cheklovlar va Diqqat qilinishi kerak bo'lgan holatlar)

1. **`ALLOWED_USER_ID` bilan bot muloqoti**:
   - Telegram Bot API qoidasiga ko'ra, bot foydalanuvchiga (`ALLOWED_USER_ID`) birinchi bo'lib yozishi uchun foydalanuvchi botga kamida 1 marta `/start` bosgan bo'lishi kerak. Aks holda `403 Forbidden: bot can't initiate conversation with a user` xatosi qaytadi. Shuning uchun `notifyAdmin` metodi `try/catch` orqali xavfsiz o'ralishi shart.
2. **Kanal admin ruxsati**:
   - Bot kanalda administrator bo'lishi va "Post Messages", "Edit Messages", "Delete Messages" ruxsatlariga ega bo'lishi shart.
3. **`editMessageMedia` tezligi va Telegram cheklovlari (Rate Limiting)**:
   - Telegram Bot API kanallarga sekundiga 1 ta xabar yuborish/tahrirlash chekloviga ega. Agar fayllar ketma-ket ko'p yuklansa, `editMessageMedia` chaqiruvlarini debounce qilish yoki navbatga (queue/mutex) qo'yish maqsadga muvofiq.
4. **Lokal fayl vs Telegram oqimi**:
   - `database.json` faylini doimiy tarzda xavfsiz yozish uchun atomik yozish (`fs.writeFileSync(tmpPath); fs.renameSync(tmpPath, realPath)`) tavsiya etiladi.

---

## 4. Conclusion (Xulosa va Tavsiya etilgan Reja)

1. **Kutubxona:** Mavjud arxitekturani buzmasdan `axios` va `form-data` yordamida davom ettirish eng to'g'ri yo'l.
2. **`telegram.service.ts` ga qo'shilishi kerak bo'lgan 4 ta yangi metod**:
   - `uploadFileWithDetails(filePath: string): Promise<{ fileId: string, messageId: number }>`
   - `syncDatabaseToTelegram(databasePath: string, masterMessageId?: number): Promise<number>` (agar masterMessageId bo'lsa `editMessageMedia`, bo'lmasa `sendDocument`)
   - `deleteTelegramMessage(messageId: number): Promise<boolean>`
   - `notifyAllowedUser(text: string): Promise<void>`
3. **`database.json` & `.sync_meta.json` boshqaruvi**:
   - `database.json`: Barcha yuklangan fayllarning `{ [fileName]: { fileId, messageId, createdAt } }` xaritasi.
   - `.sync_meta.json`: `{ masterMessageId: number, lastSync: string }`.
4. **O'chirish (GC)**: `DELETE /api/delete/:file` endpointi to'liq `database.json` orqali `messageId` ni topib, `deleteMessage` orqali kanaldan o'chiradi va `database.json` ni qayta sinxronlaydi.

---

## 5. Verification Method (Mustaqil Tekshirish Usuli)

Quyidagi amallar orqali hisobotdagi faktlarni mustaqil tekshirish mumkin:

1. **Fayllarni va kutubxonalarni ko'rish**:
   ```bash
   cat /home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/package.json
   cat /home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/.env
   cat /home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/telegram.service.ts
   ```
2. **Bot ulanishini tekshirish**:
   `file_upload_service` ishga tushirilganda `curl http://localhost:3001/api/start` orqali kanalga test xabari borishini tekshirish.
3. **Telegram Bot API sinovlari**:
   Bot tokeni va kanal ID orqali `sendDocument`, `editMessageMedia` va `deleteMessage` endpointlari Telegram rasmiy Bot API spetsifikatsiyasiga (`https://core.telegram.org/bots/api#editmessagemedia`) 100% mos kelishi tasdiqlangan.
