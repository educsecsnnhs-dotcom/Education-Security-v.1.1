# School Role-Based Backend (MongoDB + Node.js + Google Sheets API)

Backend scaffold tailored to the requested design:

- **No JWT/bcrypt/OAuth/sessions** — only a **custom Caesar cipher** for password encryption and simple **role-based restrictions**.
- **Roles** (real-world meanings in comments throughout the code):
  - `SuperAdmin` = **Principal** (highest authority; assigns `Registrar` and `Admin`)
  - `Admin` = **Department Head** (manages teachers; can view/export grades; oversees classes)
  - `Registrar` = **Records Office** (enrollment, archives; can assign `Student`, `Moderator`, `SSG`)
  - `Moderator` = **Teacher** (owns Google Sheets record books; inputs grades/attendance/warnings)
  - `Student` (views grades/attendance; can vote)
  - `SSG` = **Student Government** (special role added on top of Student/Moderator; adds SSG menu)
  - `User` = default newly registered account (can only see Enrollment page)
- **Google Sheets API** via service account for Record Books (each class links to a Sheet by ID).

> ⚠️ This scaffold is intentionally minimal and not production-secure. It follows the constraints requested.

## Quick Start

1. **Install**
   ```bash
   npm install
   ```

2. **Create `.env`**
   Copy `.env.example` to `.env` and fill in values.

3. **Run**
   ```bash
   npm run dev
   ```

4. **Deploy to Render**
   - Set **Build Command**: `npm install`
   - Set **Start Command**: `node server.js`
   - Add environment variables from `.env.example` in your Render service.
   - Ensure `GOOGLE_PRIVATE_KEY` contains literal `\n` line breaks.

## Simple "Auth" Model (No Sessions/JWT)

- After `POST /auth/login`, the response includes the user's `_id` and roles.
- For subsequent requests, send header **`X-User-Id`** with that `_id`.
- Middleware `authRequired` loads `req.user` by reading `X-User-Id` from DB.
- Role guards check `req.user.roles` against required roles.

## Record Book (Google Sheets)

- **GET `/recordbook/:classId?range=Sheet1!A1:Z100`** → reads range.
- **POST `/recordbook/:classId`** with JSON `{ "range": "Sheet1!A1:C3", "values": [[...], ...] }` → writes values.
- Uses service account credentials from env.

## Project Structure

```
.
├─ server.js
├─ package.json
├─ .env.example
├─ config/
│  └─ db.js
├─ models/
│  ├─ User.js
│  └─ Class.js
├─ utils/
│  └─ caesarCipher.js
├─ middleware/
│  └─ roleMiddleware.js
├─ controllers/
│  ├─ authController.js
│  ├─ roleController.js
│  ├─ classController.js
│  └─ recordBookController.js
└─ routes/
   ├─ authRoutes.js
   ├─ roleRoutes.js
   ├─ classRoutes.js
   └─ recordBookRoutes.js
```

## Notes

- Optional export to `.xlsx` is left as a stub in the controller — wire it up if you decide to later.
- All files include inline comments reminding role meanings (Principal, Teacher, Student, etc.).
