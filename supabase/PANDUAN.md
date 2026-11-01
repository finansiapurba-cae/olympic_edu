# Student accounts: created by the admin only

Only the admin creates accounts (for paying students or schools). The website has no public sign-up.

## One-time setup
1. **SQL Editor → New query**: paste `supabase/setup.sql`, click **Run** (creates the `progres` and `masukan` tables).
2. **Authentication → Sign In / Providers → User Signups**:
   - **Allow new users to sign up: OFF**, so nobody can create an account except you.
   - **Confirm email: OFF**.
   - **Save changes**.

## Creating an account for a student
1. **Authentication → Users → Add user → Create new user**.
2. Email: `USERNAME@siswa.olympicedu.app`, for example `budi.4a@siswa.olympicedu.app`.
   The username may use lowercase letters, numbers, dots and underscores (3–20 characters).
3. Password: at least 6 characters.
4. Tick **Auto Confirm User**, then **Create user**.
5. Give the student the **username** (`budi.4a`) and the **password**.
   On their first sign-in they type their name and grade once.

## Daily use
- **Table Editor → progres**: each student's name, grade, score, answered, correct, last update.
- **Table Editor → masukan**: feedback and reported questions from students.
- **Forgotten password**: there is no email, so "Send password recovery" does not help. Delete the user and create it again
  with the same username (their progress is deleted too), or ask Claude to add a teacher "reset password" tool.
- **Ending a subscription**: Users → the student → **Delete user**.

## Teacher dashboard
1. Create the teacher account: Authentication → Users → Add user → `guru@siswa.olympicedu.app` + password, tick **Auto Confirm User**.
2. Run the "Dashboard guru" part of `supabase/setup.sql` (it adds `guru@siswa.olympicedu.app` to the teacher list).
   To make another account a teacher: `insert into public.guru (email) values ('USERNAME@siswa.olympicedu.app');`
3. Sign in on the website as `guru`; a **👩‍🏫 Guru** menu appears: students, their wrong answers, often-wrong questions, feedback, and **Download Excel**.
