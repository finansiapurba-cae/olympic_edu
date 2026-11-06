# Olympic Edu Threads bot

What it does (runs on Netlify, free):
- **07.00 WIB every day**: replies to yesterday's question post with the answer and explanation, then posts today's "Soal Hari Ini".
- **Every 15 minutes**: reads comments on the last two question posts and replies "Benar! 🎉" or "Hampir 😊 + a hint"
  to comments that contain an answer (A–D, or the answer value). Comments without an answer are ignored.
- Questions come from the website's bank (grades 3–6 and the practice sets), 289 suitable ones, in a fixed shuffled order.

Code: `netlify/functions/threads-*.mjs` (schedules) and `netlify/lib/*.mjs` (logic). Memory (posts made, comments answered,
renewed token) is kept in Netlify Blobs, store `threads-bot`.

## Setup
1. Create the Olympic Edu **Instagram** account, then open **Threads** with it.
2. On developers.facebook.com: create an app with the use case **"Access the Threads API"**, and add the permissions
   `threads_basic`, `threads_content_publish`, `threads_read_replies`, `threads_manage_replies`.
3. App roles → add the Olympic Edu Threads account as a **Threads Tester**; accept the invite in Threads
   (Settings → Account → Website permissions → Invites).
4. Generate a **long-lived access token** for that account (60 days; the bot renews it itself about every 25 days).
5. Netlify → Site configuration → Environment variables:
   - `THREADS_ACCESS_TOKEN` = the token (mark it as secret)
   - `THREADS_BOT_KEY` = any long random text (password for the test page)
   - `THREADS_AKTIF` = `tidak` (turn on later)
   Then Deploys → Trigger deploy.
6. Test: `https://olympicedu.netlify.app/.netlify/functions/threads-uji?kunci=THREADS_BOT_KEY&aksi=contoh` shows today's posts
   without posting; `aksi=status` checks the token and account; `aksi=kuota` shows posting limits;
   `aksi=harian` posts now; `aksi=balas` replies to comments now.
7. Turn on: set `THREADS_AKTIF` = `ya` and redeploy. Turn off the same way with `tidak`.
