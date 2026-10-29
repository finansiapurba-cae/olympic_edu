// Olympic Edu → Google Sheet
// Paste this into Extensions → Apps Script of your Google Sheet, then Deploy → New deployment → Web app.
// Every finished practice session on the website adds one row to the "Hasil" sheet.

const NAMA_SHEET = "Hasil";
const KOLOM = [
  ["tanggal", "Tanggal"],
  ["nama", "Nama"],
  ["perangkat", "Kode perangkat"],
  ["kelas", "Kelas"],
  ["mode", "Mode"],
  ["paket", "Paket"],
  ["tingkat", "Tingkat"],
  ["dijawab", "Dijawab"],
  ["benar", "Benar"],
  ["salah", "Salah"],
  ["dilewati", "Dilewati"],
  ["ketepatan", "Ketepatan (%)"],
  ["skor", "Skor"],
  ["durasiDetik", "Durasi (detik)"],
  ["bahasa", "Bahasa"],
];

function doPost(e) {
  const kunci = LockService.getScriptLock();
  kunci.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(NAMA_SHEET);
    if (!sh) sh = ss.insertSheet(NAMA_SHEET);
    if (sh.getLastRow() === 0) {
      sh.appendRow(KOLOM.map((k) => k[1]));
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, KOLOM.length).setFontWeight("bold");
    }
    const baris = KOLOM.map(([k]) => {
      const v = data[k];
      if (k === "tanggal") return v ? new Date(v) : new Date();
      // Teks dibatasi agar sheet tetap rapi; "=" di depan dicegah agar tidak dianggap rumus.
      if (typeof v === "string") return v.replace(/^[=+\-@]/, "'$&").slice(0, 60);
      return typeof v === "number" ? v : "";
    });
    sh.appendRow(baris);
    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err);
  } finally {
    kunci.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("Olympic Edu sheet is ready.");
}
