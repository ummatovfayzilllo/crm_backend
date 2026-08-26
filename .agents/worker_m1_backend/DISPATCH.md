## 2026-08-26T15:56:21Z

You are a Worker agent assigned to Milestone 1: CRM Backend Avatar API.
Your working directory is `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/worker_m1_backend`.
Original request file: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/ORIGINAL_REQUEST.md`.
Project plan file: `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/PROJECT.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Create `src/modules/users/dto/update-avatar.dto.ts` in `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend`:
   - DTO class `UpdateAvatarDto` with `@IsString()` and `@IsNotEmpty()` for `image: string`.
   - Add Swagger `@ApiProperty`.
2. Update `src/modules/users/users.service.ts`:
   - Add `async updateAvatar(id: string, image: string)` method.
   - Validate user exists and is not deleted (`checkExistsResurs`, `isDeleted` check).
   - If user already had a local image file that is different, unlink the old file.
   - Update user in prisma with `data: { image }`.
   - Return `{ message: 'Avatar successfully updated', user: flattenUser(this.config, updatedUser) }`.
3. Update `src/modules/users/user..controller.ts`:
   - Add `@Patch('avatar/:id')` endpoint taking `@Param('id') id: string` and `@Body() dto: UpdateAvatarDto`.
   - Ensure it does NOT have `@UseInterceptors(FileInterceptor(...))` and does NOT consume multipart. It must be clean JSON.
4. Run `npm run build` in `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend` to verify compilation.
5. Create or run a unit test if appropriate to verify the endpoint logic.
6. Write your detailed handoff report in `/home/fayzillo/Desktop/Loyihalar/crm/crm_backend/.agents/worker_m1_backend/handoff.md` and send a message back with the status.
