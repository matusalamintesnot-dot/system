DATA SANA MEMORIAL SCHOOL — EduTrack AI (Next-version starter)
============================================================

Branding retained: DATA SANA MEMORIAL SCHOOL; motto “To seek · To serve · To know”; supplied school logo; English/Amharic UI; responsive web/PWA foundation.

WHAT IS INCLUDED
----------------
- Existing interactive front-end demonstration (index.html, app.js, styles.css).
- School logo, manifest and service worker.
- firebase/config.example.js: safe example Firebase web configuration (copy to firebase-config.js and fill in your own project values).
- firebase/firestore.rules: starting role-aware Firestore security rules.
- firebase/firestore.indexes.json: suggested query indexes.
- firebase/firebase.json: Firebase deployment configuration.
- firebase/functions: callable Cloud Functions starter for admin-created teacher accounts and a school FAQ assistant endpoint.

IMPORTANT — HONEST IMPLEMENTATION STATUS
----------------------------------------
This is a development starter, NOT a finished production deployment. The existing front-end still runs its demonstration workflow using browser-local sample data and demo role codes. The Firebase files provide the backend foundation, but the front-end has NOT yet been wired to Firebase Authentication/Firestore. Therefore two devices will NOT synchronize until that integration is completed and the Firebase project is configured/deployed.

No Firebase project credentials were supplied, so no live database can be activated from this package alone. Do not enter real student information in the demo.

TARGET WORKFLOW
---------------
1. Administrator accounts are provisioned by the project owner. Admin creates teacher accounts and assigns classIds.
2. Students create individual Firebase Authentication accounts and submit pending registration requests.
3. Admin approves requests and assigns a class; only then is a student profile activated.
4. Teacher accounts have classIds. Attendance writes are allowed only for assigned classes.
5. Students can read their own attendance but cannot create or edit attendance.
6. Announcements and notifications are shared through Firestore.
7. FAQ Cloud Function provides a controlled starter answer endpoint. It is not yet a generative AI model; connect a vetted AI provider using server-side secrets if required.

FIREBASE SETUP (PROJECT OWNER / TEACHER)
----------------------------------------
1. Create a project at https://console.firebase.google.com/.
2. Add a Web App in Project settings and copy its Firebase web configuration.
3. Copy firebase/config.example.js to firebase-config.js and fill in the values. Never add a service-account JSON or Admin SDK private key to the website.
4. Enable Authentication > Email/Password.
5. Create a Cloud Firestore database.
6. Install Firebase CLI, sign in, and from the project folder initialize/link the Firebase project. Review firebase/firebase.json paths for your chosen deployment layout.
7. Deploy reviewed Firestore rules and indexes. Deploy Cloud Functions from firebase/functions after setting up billing/region as required by Firebase.
8. Bootstrap the first administrator securely using a trusted server-side script or Firebase Admin SDK. Never allow a user to choose their own admin/teacher role in the browser.
9. Complete the frontend integration: replace demo access-code login with Firebase Auth; read role/status from trusted profile/custom claims; move applications, classes, attendance, announcements and notifications to Firestore listeners/writes; use Cloud Functions for teacher invitations and approvals.
10. Test with three separate accounts on two devices: admin, teacher, student. Verify that students cannot write attendance and teachers cannot write outside assigned classIds.

SECURITY NOTES
--------------
- The rules are a starting point and require a qualified review before real use. Custom claims must be set by trusted server code and kept consistent with profile documents.
- Do not deploy until the rules, role provisioning, student approval transaction, attendance validation, audit logging, rate limiting and account recovery are tested.
- Firebase web apiKey is not a secret; access is protected by Auth and Firestore Rules. Never expose service-account credentials or private AI keys.
- Use fictional sample data for school demonstrations. Obtain school approval and follow applicable student-data privacy requirements before collecting real data.

GITHUB PAGES
------------
GitHub Pages can host the static front end, but cannot run Cloud Functions. Deploy the functions separately using Firebase CLI. Keep index.html at the repository root and upload the contents of this package (not the ZIP itself). After updating, hard-refresh the website to bypass cached files.
