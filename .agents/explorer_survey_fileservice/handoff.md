# File Service va Integratsiya / Rollback Tahlil Hisoboti (Handoff)

## 1. Observation (Kuzatuvlar va Dalillar)

### 1.1. File Upload Service joylashuvi va umumiy arxitekturasi
- **Katalog yo'li**: `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service`
- **Freymvork**: NestJS (TypeScript)
- **Konfiguratsiya fayli** (`file_upload_service/.env`):
  ```env
  PORT=3001
  APP_BASE_URL=http://localhost:3001
  HOST=localhost
  BOT_TOKEN=7563561103:AAH0u8zxI94sCiIf5RHrQMHkNL9vt3c1oFA
  ALLOWED_USER_ID=7463402937
  CHANNEL_ID=@upload_C
  ```
- **Global API Prefix** (`file_upload_service/src/main.ts:11`): `app.setGlobalPrefix("api");`
- **Server Port**: `3001` (`const port = process.env.PORT || 3001;` - `src/main.ts:14`)
- **Asosiy Base URL**: `http://localhost:3001/api`
- **Arxitektura asosi** (`plan.md`): Render/server uxlab qolganda fayllarni yo'qotmaslik uchun Telegram Bot/Kanal cheksiz bulutli zaxira sifatida ishlatiladi, lokal disk esa tezkor kesh vazifasini bajaradi.

---

### 1.2. Upload API Endpoint
- **Yo'nalish (Route)**: `POST /api/upload` (To'liq URL: `http://localhost:3001/api/upload`)
- **Controller metodi** (`src/core/services/file.stream.controller.ts:30-33`):
  ```typescript
  @Post("upload")
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFileService(file);
  }
  ```
- **So'rov (Request) formati**:
  - `Content-Type`: `multipart/form-data`
  - Maydon kaliti (Field key): `file` (Multer `FileInterceptor("file")` orqali kutiladi)
- **Muvaffaqiyatli javob (Response 200/201)**:
  ```json
  {
    "fileName": "AgADBA123...png",
    "url": "http://localhost:3001/api/image/AgADBA123...png"
  }
  ```
  (`fileName` = Telegram `file_id` + kengaytma, masalan `AgADBA...png`).
- **Xatolik kodlari va holatlar**:
  - `400 Bad Request`: Form-data ichida `file` kaliti bo'lmaganda yoki fayl kelmaganda (`src/core/services/file.stream.service.ts:20-23`: `"Fayl topilmadi! Iltimos, form-data kaliti 'file' ekanligini tekshiring."`).
  - `415 Unsupported Media Type`: Multer filtridan o'tmagan noto'g'ri fayl turi yuborilganda (`src/common/config/multer.config.ts:30-32`).
  - `500 Internal Server Error`: Telegram Bot API orqali yuklashda tarmoq yoki token xatosi yuz berganda (`src/core/services/telegram.service.ts:47`).

> **⚠️ MUHIM TEXNIK TOPILMA (KODDAGI BUG)**:
> `src/core/services/file.stream.controller.ts` faylida (23-33-qatorlar):
> ```typescript
> @UseInterceptors(FileInterceptor("file", fileStorages([])))
> @Delete('delete/:file')
> async deleteFile(@Param('file') fileName: string) { ... }
> 
> @Post("upload")
> async uploadFile(@UploadedFile() file: Express.Multer.File) { ... }
> ```
> `@UseInterceptors(...)` dekoratori adashib `@Delete` ustiga qo'yilgan. Oqibatda `@Post("upload")` da faylni Multer parse qilmaydi va `@UploadedFile() file` `undefined` bo'lib qoladi. `@Post("upload")` ga `@UseInterceptors(FileInterceptor("file", fileStorages([])))` dekoratori qaytarilishi shart.

---

### 1.3. DELETE (Garbage Collection / Rollback) API Endpoint
- **Yo'nalish (Route)**: `DELETE /api/delete/:file` (To'liq URL: `http://localhost:3001/api/delete/:file`)
  - Misol: `DELETE http://localhost:3001/api/delete/AgADBA123...png`
- **Controller metodi** (`src/core/services/file.stream.controller.ts:25-28`):
  ```typescript
  @Delete('delete/:file')
  async deleteFile(@Param('file') fileName: string) {
    return this.fileService.deleteFile(fileName);
  }
  ```
- **Service mantiqi** (`src/core/services/file.stream.service.ts:71-82`):
  ```typescript
  async deleteFile(fileName: string) {
      this.logger.warn(`[DELETE] Frontend faylni o'chirishni (TTL/GC) so'radi: ${fileName}`);
      const destFolder = getPathInFileType(fileName);
      const filePath = join(destFolder, fileName);
      if (existsSync(filePath)) {
          unlinkSync(filePath);
          this.logger.log(`[DELETED] Fayl keshdan muvaffaqiyatli tozalandi: ${fileName}`);
      } else {
          this.logger.log(`[SKIP] Fayl keshda yo'q, o'chirishga hojat qolmadi.`);
      }
      return { message: 'Fayl keshdan tozalandi' };
  }
  ```
- **So'rov parametrlari**:
  - `fileName` (URL param): Upload qilingan fayl nomi (string).
- **Javob formati (Response 200 OK)**:
  ```json
  {
    "message": "Fayl keshdan tozalandi"
  }
  ```
- **Xususiyati**: Idempotent. Agar fayl lokal diskda bo'lmasa ham 200 qaytaradi (`[SKIP]`), tizim qulab tushmaydi.

---

### 1.4. Boshqa mavjud File Service Endpointlari
- `GET /api/image/:file` — Rasmlarni uzatish (keshdan yoki Telegramdan lazy load).
- `GET /api/video/:file` — Videolarni stream qilish (HTTP 206 Partial Content qo'llab-quvvatlaydi).
- `GET /api/docs/:file` va `GET /api/archive/:file` — Hujjat va arxivlar.
- `GET /api/start` — Telegram bot aloqasini tekshiruvchi test endpoint.

---

### 1.5. Frontend Garbage Collection (Rollback) Mantiqi
`crm_frontend/file_upload_logic.md` hujjatida va `crm_frontend/src/components/modal/CreateUser.tsx` (64-115-qatorlar) hamda `UpdateUser.tsx` da mavjud namuna:
```typescript
let uploadedFileName: string | null = null;

try {
  // 1-QADAM: Faylni File Service'ga yuklash
  const fileForm = new FormData();
  fileForm.append("file", selectedFile);
  
  const uploadRes = await fetch("http://localhost:3001/api/upload", {
    method: "POST",
    body: fileForm
  });

  if (!uploadRes.ok) {
    throw new Error("File upload failed");
  }

  const uploadData = await uploadRes.json();
  uploadedFileName = uploadData.fileName; // Masalan: "AgADBA...png"

  // 2-QADAM: CRM Backend'ga faqat rasm ID (JSON) yuborish
  await api.patch(`/users/avatar/${userId}`, {
    image: uploadedFileName
  });

  // Muvaffaqiyatli yakunlandi!

} catch (backendError) {
  // 3-QADAM: Backend 4xx/5xx xato qaytarganda File Servicedagi yetim faylni tozalash (GC / Rollback)
  if (uploadedFileName) {
    await fetch(`http://localhost:3001/api/delete/${uploadedFileName}`, {
      method: "DELETE"
    }).catch(console.error);
  }
  // Foydalanuvchiga xatolik bildirishnomasi
}
```

---

## 2. Logic Chain (Mantiqiy Zanjir)

1. **Mikroxizmatlar mustaqilligi**: CRM Backend katta fayllarni multipart/form-data orqali qabul qilib xotirasini band qilmasligi uchun barcha fayllar alohida `file_upload_service` (port 3001) orqali boshqariladi.
2. **Direct Upload**: Frontend foydalanuvchi tanlagan rasmni `POST http://localhost:3001/api/upload` ga yuboradi. File Service uni Telegramga zaxiralab, keshga saqlab, `fileName` (`AgAD...png`) qaytaradi.
3. **Backend bilan muloqot**: Frontend CRM Backendga faqat JSON `{ "image": "AgAD...png" }` yuboradi. Backend `FileInterceptor` talab qilmaydi, oddiy DTO bilan bazadagi `user.image` ustunini yangilaydi.
4. **Garbage Collection zarurati**: Agar Backend bazasiga yozishda validatsiya xatosi (400), avtorizatsiya xatosi (401/403) yoki server xatosi (500) yuz bersa, File Serviceda qolib ketgan yetim fayl zudlik bilan `DELETE http://localhost:3001/api/delete/:file` orqali tozalanishi zarur.

---

## 3. Caveats (Cheklovlar va Diqqat Talab Qiladigan Joylar)

1. **File Controller Interceptor O'rni**: `file.stream.controller.ts` faylidagi `@UseInterceptors` dekoratori `@Delete` va `@Post` o'rtasida adashib qolgan. Controller tuzatilmaguncha `upload` ishlamaydi.
2. **Port va CORS**: Frontend `http://localhost:3001` bilan bog'lanishi uchun File Service `.env` da `PORT=3001` ochiq bo'lishi va `app.enableCors({ origin: true })` saqlanishi kerak.
3. **Avatar ko'rsatish URL**: `TeacherPage` (`teachers/[teacherId]/page.tsx`) da rasm ko'rsatishda eski `http://localhost:15976/${teacher.user.image}` o'rniga File Service URL `http://localhost:3001/api/image/${teacher.user.image}` (yoki backend `flattenUser` qaytargan tayyor URL) ishlatilishi lozim.

---

## 4. Conclusion (Xulosa)

1. **File Service joylashuvi**: `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service`.
2. **Upload Endpoint**: `POST http://localhost:3001/api/upload` (Form-data: `file`).
3. **Delete Endpoint**: `DELETE http://localhost:3001/api/delete/:file` (URL param: `fileName`).
4. **Rollback mexanizmi**: Frontend rasm yuklangandan so'ng qaytgan `fileName` ni saqlab turadi; Backend 4xx/5xx xato bersa, `catch` blokida `DELETE http://localhost:3001/api/delete/${fileName}` chaqiradi.
5. **Talab qilinadigan tuzatish**: File Service controlleridagi `@UseInterceptors` ni `@Post("upload")` ustiga to'g'ri o'rnatish.

---

## 5. Verification Method (Mustaqil Tekshirish Usuli)

1. **File Service kodini ko'rish**:
   - `view_file` `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/file.stream.controller.ts`
   - `view_file` `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service/src/core/services/file.stream.service.ts`
2. **Frontend GC namunasini ko'rish**:
   - `view_file` `/home/fayzillo/Desktop/Loyihalar/crm/crm_frontend/src/components/modal/CreateUser.tsx` (55–115-qatorlar)
   - `view_file` `/home/fayzillo/Desktop/Loyihalar/crm/crm_frontend/file_upload_logic.md`
3. **API endpointlarini sinash (File service ishga tushirilganda)**:
   - Yuklash: `curl -F "file=@test.png" http://localhost:3001/api/upload`
   - O'chirish (GC): `curl -X DELETE http://localhost:3001/api/delete/<fileName>`
