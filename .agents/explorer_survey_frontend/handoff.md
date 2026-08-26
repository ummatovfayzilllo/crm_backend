# Frontend Survey & Avatar Update Architecture Handoff Report

## 1. Observation

### 1.1. Workspace Structure & Directories
- **Frontend App Path:** `/home/fayzillo/Desktop/Loyihalar/crm/crm_frontend`
- **File Upload Service Path:** `/home/fayzillo/Desktop/Loyihalar/crm/file_upload_service`
- **CRM Backend Path:** `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend`
- **Frontend Tech Stack (`crm_frontend/package.json`):**
  - Next.js: `15.5.5` (App router, Turbopack)
  - React: `19.1.0`
  - Tailwind CSS: `^4`
  - Axios: `^1.12.2`
  - State Management: `zustand ^5.0.8`
  - Icons: `lucide-react ^0.546.0`

### 1.2. HTTP Client Configuration
- **File:** `/home/fayzillo/Desktop/Loyihalar/crm/crm_frontend/src/lib/axios.ts`
  - `baseURL`: `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:15976/api'`
  - Interceptors: Automatically attaches `Authorization: Bearer <access_token>` from `localStorage`.
  - Unifies error rejections.
- **File Service Configuration:**
  - File Upload Service (`file_upload_service/src/main.ts`): Port `3001` (or `process.env.PORT`), global prefix `"api"`.
  - In `CreateUser.tsx` and `UpdateUser.tsx`, `fetch("http://localhost:3001/api/upload")` and `fetch("http://localhost:3001/api/delete/${fileName}")` are currently hardcoded to `http://localhost:3001`.

### 1.3. Existing Teacher Profile & Avatar Components
- **Teacher Profile Page (`crm_frontend/src/app/admin-panel/teachers/[teacherId]/page.tsx`):**
  - Lines 44-54: Avatar is displayed via:
    ```tsx
    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
      <img
        src={
          teacher.user.image
            ? `http://localhost:15976/${teacher.user.image}`
            : "https://via.placeholder.com/150"
        }
        alt={teacher.user.fullName}
        className="w-full h-full object-cover"
      />
    </div>
    ```
    *Issue noted:* The hardcoded `http://localhost:15976/` prefix conflicts when `teacher.user.image` is already a full URL returned by backend `flattenUser` (`http://localhost:15976/api/image/...`).
  - Lines 79-86: Only "Batafsil ma'lumot" and "Tahrirlash" buttons exist.
  - Lines 88-92: Clicking "Tahrirlash" opens `UpdateUser` modal (`crm_frontend/src/components/modal/UpdateUser.tsx`).
  - There is **no dedicated button or modal** for updating only the avatar.

- **Teacher List Page (`crm_frontend/src/app/admin-panel/teachers/page.tsx`):**
  - Lines 96-106 & 150-160: Renders avatar directly using `t.user?.image` if present.

### 1.4. Current File Upload Patterns
1. **Direct File Service Upload + Direct string ID (`CreateUser.tsx` & `UpdateUser.tsx`):**
   - User chooses file -> on submit, creates `FormData` with key `"file"` -> `POST http://localhost:3001/api/upload`.
   - File Service returns `{ fileName: "AgADBA123...png", url: "http://localhost:3001/api/image/AgADBA123...png" }`.
   - Frontend passes `dto.image = uploadedFileName` to CRM Backend (`POST /users/create` or `PATCH /users/update-one/:id`).
   - If CRM Backend returns error (catch block), sends `DELETE http://localhost:3001/api/delete/${uploadedFileName}` to prevent orphan files (Garbage Collection).
2. **Legacy Multipart Direct to CRM Backend (`src/features/courses/api.ts` & `src/features/users/api.ts`):**
   - `usersApi.create(dto, image?: File)` sets up `FormData` with `form.append('image', image)` and sends to CRM backend with `multipart/form-data`.

---

## 2. Logic Chain

1. **Direct Upload Architecture Alignment:**
   Following `file_upload_logic.md`, avatars should NOT be sent as multipart files to CRM Backend. Instead:
   - Frontend uploads raw image to File Service (`POST /api/upload`).
   - File Service stores image (with Telegram backup/caching) and returns `{ fileName: string, url: string }`.
   - Frontend sends only the `fileName` (e.g. `"AgADBA123...png"`) to the CRM Backend Avatar API via JSON.
2. **UI Placement & UX on Teacher Profile:**
   - On `/admin-panel/teachers/[teacherId]`, the user needs a quick and intuitive way to change their avatar without opening the comprehensive 8-field `UpdateUser` modal.
   - Recommended UI:
     - A camera icon hover/badge overlay on the circular avatar container (standard modern UX).
     - An explicit "Rasmni yangilash" (Update Avatar) action button next to "Tahrirlash".
     - Clicking either opens a dedicated lightweight `UpdateAvatarModal`.
3. **Garbage Collection (TTL / Cleanup):**
   - If the CRM Backend Avatar API fails (network error, 400 Bad Request, 500 Server Error), the uploaded file in File Service is orphaned.
   - The catch block in frontend MUST call `DELETE /api/delete/:fileName` to clean up the orphaned file on File Service.
4. **Environment Configuration:**
   - Hardcoded `http://localhost:3001` should be refactored into a centralized `src/lib/fileService.ts` or `src/features/files/api.ts` utilizing `process.env.NEXT_PUBLIC_FILE_SERVICE_URL || 'http://localhost:3001'`.

---

## 3. Caveats

- **Read-Only Inspection:** No source files have been modified during this exploratory phase.
- **Backend API Endpoint Naming:** The backend team should confirm the final avatar endpoint route (e.g. `PATCH /api/users/avatar/:id` or `PATCH /api/users/:id/avatar`). The frontend implementation will bind to this exact route.
- **URL Resolution:** In `crm_frontend/src/app/admin-panel/teachers/[teacherId]/page.tsx`, line 48 currently prefixes `http://localhost:15976/`. When updated, image rendering should handle both full URLs (starting with `http`) and fallback placeholder avatars safely.

---

## 4. Conclusion & Implementation Recommendations

### Proposed Solution Architecture

#### Component 1: Centralized File Service Utility (`crm_frontend/src/lib/fileService.ts` or `src/features/files/api.ts`)
```typescript
const FILE_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_FILE_SERVICE_URL || 'http://localhost:3001';

export const fileService = {
  uploadImage: async (file: File): Promise<{ fileName: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const res = await fetch(`${FILE_SERVICE_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Rasm yuklashda xatolik yuz berdi');
    }

    return await res.json();
  },

  deleteFile: async (fileName: string): Promise<void> => {
    try {
      await fetch(`${FILE_SERVICE_BASE_URL}/api/delete/${fileName}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error(`Failed to delete orphan file: ${fileName}`, e);
    }
  },
};
```

#### Component 2: Dedicated Avatar API in `src/features/users/api.ts`
```typescript
// In src/features/users/api.ts:
updateAvatar: async (userId: string, imageFileName: string) => {
  const { data } = await api.patch(`/users/avatar/${userId}`, {
    image: imageFileName,
  });
  return data as { message: string; user: UserFlat };
},
```

#### Component 3: Dedicated UI Modal (`src/components/modal/UpdateAvatarModal.tsx`)
Key Features:
- File dropzone / file picker (`accept="image/png, image/jpeg, image/webp"`).
- Instant preview via `URL.createObjectURL(selectedFile)`.
- Step 1: Uploads to File Service via `fileService.uploadImage(file)`.
- Step 2: Calls `Users.usersApi.updateAvatar(userId, uploadResult.fileName)`.
- Step 3 (Garbage Collection): If Step 2 fails, catches error and calls `fileService.deleteFile(uploadResult.fileName)`.
- Loading spinner and disabled buttons during upload.
- On success: notifies parent component / updates Zustand store (`fetchAll()`) and closes modal.

#### Component 4: Integration in `src/app/admin-panel/teachers/[teacherId]/page.tsx`
- Add Camera overlay button on avatar (`lucide-react` `Camera` icon).
- Add "Rasmni yangilash" button.
- Render `UpdateAvatarModal` when open.

---

## 5. Verification Method

1. **File Selection & Preview:**
   - Open `/admin-panel/teachers/[teacherId]`, click the avatar update button.
   - Choose a `.png` or `.jpg` image and verify that the preview displays instantly.
2. **Happy Path Verification:**
   - Click "Saqlash".
   - Inspect Network Tab:
     - `POST http://localhost:3001/api/upload` returns `201/200` with `{ fileName: "...", url: "..." }`.
     - `PATCH http://localhost:15976/api/users/avatar/:id` with payload `{"image": "<fileName>"}` returns `200`.
     - Profile avatar refreshes to show the new image.
3. **Garbage Collection (Error Flow) Verification:**
   - Simulate backend failure (e.g. temporary wrong endpoint or mock error 500).
   - Verify that in Network Tab:
     - `POST http://localhost:3001/api/upload` completes.
     - `PATCH /users/avatar/:id` fails.
     - `DELETE http://localhost:3001/api/delete/<fileName>` is immediately triggered in the catch block.
     - Toast/alert notifies user of the failure.
