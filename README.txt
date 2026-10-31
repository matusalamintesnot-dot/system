# DATA SANA MEMORIAL SCHOOL — EduTrack AI

## Account policy (confirmed)
- Students create their own account and submit a registration request.
- A student remains pending until an administrator approves the request.
- Teachers do not self-register. An administrator creates teacher accounts.
- The first administrator is provisioned manually by the trusted project owner.
- Browser role selectors in the preview are demonstrations only, not security controls.

## What is included
- `index.html`, `styles.css`, `app.js`: responsive interactive local demo.
- `assets/school-logo.jpg`: school emblem supplied in the conversation.
- `supabase/migrations/0001_initial_schema.sql`: starting multi-user schema and row-level security policies.
- `manifest.webmanifest`, `sw.js`: installable PWA foundation.

## Demo portal access codes
- Administrator: `DSMS-ADMIN-2026` — approve student applications, create classrooms, and assign homeroom teachers. Administrators cannot submit attendance.
- Teacher: `DSMS-TEACHER-2026` — record attendance for the demo homeroom assigned to Mr. Daniel.
- Student: `DSMS-STUDENT-2026` — submit a registration application and use student-facing information pages; students cannot record attendance.

These codes are intentionally simple classroom-demo codes. They are visible in the frontend code and are NOT real authentication or suitable for real student information.

## Preview the demo
Open `index.html` directly for a local demonstration. For PWA/service-worker testing, serve the folder:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

The preview stores sample records in the current browser only. It is not a deployed production system and must not be used with real student information.

## Next: connect a real Supabase project
1. Create a Supabase project owned by the school or its authorized administrator.
2. Review and apply `supabase/migrations/0001_initial_schema.sql` in the Supabase SQL editor.
3. Create the first administrator's Auth account, then promote that verified account using the documented SQL statement at the bottom of the migration.
4. Build server-side/Edge Functions for:
   - administrator-only teacher invitation and account provisioning;
   - student registration submission and admin approval;
   - approval transaction that creates the enrollment and assigns a student ID;
   - attendance validation and audit logging.
5. Connect the frontend using the Supabase project URL and anon/publishable key.
6. Keep the service-role key only in server-side secrets. Never put it in frontend JavaScript.
7. Test row-level security with separate student, teacher, and admin test accounts before importing any real data.
8. Configure backups, retention, consent, school data policies, and incident response before launch.

## Security and completeness notes
This SQL is a foundation, not a completed production deployment. In particular, do not expose direct profile role updates to users; use trusted server-side admin operations. Add audit logs, rate limits, verified email/phone policy, secure password reset, and stricter attendance date/class membership validation before launch. Have a qualified developer review all policies and local student-data/privacy obligations.

## Product scope
- School: DATA SANA MEMORIAL SCHOOL
- Level: Secondary (Grades 9–12)
- Languages: English and Amharic
- Roles: Administrator, Teacher, Student
- Attendance: daily homeroom attendance
- Assistant: school FAQ/NLP in English and Amharic, with role-filtered access to school information
