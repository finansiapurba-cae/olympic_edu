# Connect Olympic Edu to a Google Sheet

Every finished practice session adds one row to your sheet:
date, name, device code, grade, mode, set, level, answered, correct, wrong, skipped, accuracy %, score, duration, language.

## 1. Make the sheet
1. Go to https://sheets.new (signed in to your Google account).
2. Name it, for example "Olympic Edu – Hasil".

## 2. Add the script
1. In the sheet: **Extensions → Apps Script**.
2. Delete what is in `Code.gs` and paste the contents of `google-sheet/Code.gs`.
3. Click **Save** (disk icon).

## 3. Publish it as a web app
1. Click **Deploy → New deployment**.
2. Gear icon next to "Select type" → **Web app**.
3. Execute as: **Me**. Who has access: **Anyone**.
4. Click **Deploy**, then **Authorize access** and allow it with your Google account
   (if you see "Google hasn't verified this app": **Advanced → Go to … (unsafe)** — it is your own script).
5. Copy the **Web app URL** (it ends in `/exec`).

## 4. Turn it on in the website
In Netlify: **Site configuration → Environment variables → Add a variable**
- Key: `VITE_SHEET_URL`
- Value: the `/exec` URL

Then **Deploys → Trigger deploy → Deploy site**. (Or send the URL to Claude and it will be added to the code.)

## Notes
- The website shows students a short notice that their name, grade and score are sent to the teacher.
- Only "Anyone" can *send* rows; only you can *see* the sheet.
- If you change the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
