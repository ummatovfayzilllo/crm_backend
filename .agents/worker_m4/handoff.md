# Handoff Report — Worker M4 (`lessons` & `attendentionals` API Docs)

## 1. Observation
- `src/modules/lessons/lessons.controller.ts`:
  - Controllerda `@ApiBearerAuth()` va `@UseGuards(JwtAuthGuard)` dekoratorlari mavjud.
  - 6 ta endpoint mavjud: `POST /lessons/create`, `GET /lessons/get-all`, `GET /lessons/get-one/by-lessonid/:id`, `GET /lessons/get-all/by-groupid/:id`, `PATCH /lessons/update-one/by-lessonid/:id`, `DELETE /lessons/delete-one/by-lessonid/:id`.
  - Service `flattenLesson` (`src/common/utils/flatter_functions/flatter.functions.ts`) dan foydalanadi va unda `teacherImage` maydoni bor.
- `src/modules/attendentionals/attendentionals.controller.ts`:
  - Controllerda `@ApiBearerAuth()` va `@UseGuards(JwtAuthGuard)` dekoratorlari mavjud.
  - 7 ta endpoint mavjud: `POST /attendentionals/create`, `GET /attendentionals/get-all`, `GET /attendentionals/get-all/by-lessonid/:id`, `GET /attendentionals/get-all/by-groupid/:id`, `GET /attendentionals/get-one/:id`, `PATCH /attendentionals/update-one/:id`, `DELETE /attendentionals/delete-one/:id`.
  - `POST /attendentionals/create` da DTO `CreateAttendentionalDto` orqali `lessonId` va `attendances: AttendanceItemDto[]` qabul qilinadi. Qaytadigan format `{ message, createdCount, skippedCount }`.
  - Qolgan GET, PATCH, DELETE endpointlari `flattenRecord` formatida ma'lumot qaytaradi.
- `prisma/schema.prisma`:
  - `Lesson` modeli: `id`, `groupId`, `teacherId`, `lessonNumber`, `startDate`, `endDate`, `isDeleted`.
  - `Attendentional` modeli: `id`, `lessonId`, `studentId`, `kelganVaqti`, `kelgan`, `isDeleted`.
- Eski `lessons.md` va `attendentionals.md` hujjatlarida Guard holati noto'g'ri ko'rsatilgan ("Hozircha ochiq" deb yozilgan) va ba'zi response maydonlari to'liq emas edi.

## 2. Logic Chain
1. Backend manba kodlari (`controller`, `service`, `dto`, `entities`, `prisma/schema.prisma`, `flatter.functions.ts`) qatorma-qator o'rganildi.
2. `backend_api_docs/lessons.md` faylidagi barcha 6 ta endpoint talab qilingan 8 bandli standart shablonda qayta yozildi.
3. `lessons.md` yangilangandan so'ng darhol Frontend agentiga (`5eac2b38-30f8-4e2a-b9b2-6dc0cd7a5ee3`) xabar yuborildi.
4. `backend_api_docs/attendentionals.md` faylidagi barcha 7 ta endpoint talab qilingan 8 bandli standart shablonda qayta yozildi.
5. `attendentionals.md` yangilangandan so'ng darhol Frontend agentiga (`5eac2b38-30f8-4e2a-b9b2-6dc0cd7a5ee3`) xabar yuborildi.
6. Hujjatlar to'liqligi va aniqligi manba kodi bilan solishtirildi.

## 3. Caveats
- `AttendentionalsService.create` metodida `createMany` orqali yozuvlar kiritilganda `flattenRecord` emas, `{ message, createdCount, skippedCount }` javobi qaytariladi. Bu hujjatda aniq aks ettirildi.
- Dars yaratish va yangilashda xona bandligi (`checkRoomAvailability`) backend kodida vaqtincha izohda (commented out) turibdi, shu sababli xatolik holatlari hozirgi faol kod mantiqiga moslab belgilandi.

## 4. Conclusion
- `lessons.md` va `attendentionals.md` hujjatlari 100% haqiqiy backend kodiga muvofiq ravishda, 8 bandli shablon asosida yangilandi.
- Frontend agentiga har ikkala fayl bo'yicha mustaqil bildirishnomalar yetkazildi.
- Barcha talablar to'liq bajarildi.

## 5. Verification Method
- Tekshirish uchun quyidagi fayllarni ko'zdan kechirish mumkin:
  - `backend_api_docs/lessons.md`
  - `backend_api_docs/attendentionals.md`
- Backend kontroller va servislar bilan solishtirish:
  - `src/modules/lessons/lessons.controller.ts` & `lessons.service.ts`
  - `src/modules/attendentionals/attendentionals.controller.ts` & `attendentionals.service.ts`
