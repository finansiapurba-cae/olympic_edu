# Student accounts (username + password) with Supabase

1. Sign up at https://supabase.com (free) and click **New project**. Pick a name ("olympic-edu"), a database password (save it), and the region **Southeast Asia (Singapore)**.
2. **SQL Editor → New query**: paste `supabase/setup.sql`, click **Run**.
3. **Authentication → Sign In / Providers → Email**: turn **off** "Confirm email", then **Save**.
   (Students sign in with a username, so there is no real email to confirm.)
4. **Project Settings → API** (or the **Connect** button): copy the **Project URL** and the **anon / publishable key**.
   Never share the `service_role` / secret key.
5. Send both to Claude, or add them in Netlify → Environment variables as `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`, then redeploy.

## Seeing students
- **Authentication → Users**: every account (shown as `username@siswa.olympicedu.app`).
- **Table Editor → progres**: one row per student with name, grade, score, answered, correct, last update.

## Forgotten password
Authentication → Users → the student → **Delete user**, then the student signs up again with the same username.
(This also deletes that student's saved progress.)
