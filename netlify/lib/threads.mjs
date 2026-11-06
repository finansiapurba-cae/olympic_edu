// Klien kecil untuk Threads API (Meta), versi v1.0.
const DASAR = "https://graph.threads.net";

export function buatThreads(ambilToken, { fetchFn = fetch, tunggu = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  async function panggil(path, params = {}, method = "GET") {
    const url = new URL(DASAR + path);
    for (const [k, v] of Object.entries({ ...params, access_token: await ambilToken() })) if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    const res = await fetchFn(url, { method });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error(`Threads ${method} ${path}: ${data.error?.message ?? res.status}`);
    return data;
  }
  return {
    saya: () => panggil("/v1.0/me", { fields: "id,username" }),
    /** Membuat lalu menerbitkan post teks. replyTo = id post/balasan yang dibalas. Mengembalikan id post baru. */
    async posting(userId, teks, replyTo) {
      const wadah = await panggil(`/v1.0/${userId}/threads`, { media_type: "TEXT", text: teks, reply_to_id: replyTo }, "POST");
      for (let coba = 0; ; coba++) {
        try {
          const hasil = await panggil(`/v1.0/${userId}/threads_publish`, { creation_id: wadah.id }, "POST");
          return hasil.id;
        } catch (e) {
          if (coba >= 2) throw e;
          await tunggu(2000);
        }
      }
    },
    /** Balasan langsung (tingkat pertama) pada sebuah post. */
    async balasan(mediaId) {
      const data = await panggil(`/v1.0/${mediaId}/replies`, { fields: "id,text,username,timestamp,is_reply_owned_by_me", reverse: "false" });
      return data.data ?? [];
    },
    kuota: (userId) => panggil(`/v1.0/${userId}/threads_publishing_limit`, { fields: "quota_usage,config,reply_quota_usage,reply_config" }),
    /** Token jangka panjang berlaku 60 hari; diperpanjang lewat endpoint ini. */
    perpanjangToken: () => panggil("/refresh_access_token", { grant_type: "th_refresh_token" }),
  };
}
