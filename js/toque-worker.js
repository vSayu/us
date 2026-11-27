/* Cloudflare Worker: recibe el toque y manda el push al otro.
   Variables que debes crear en Cloudflare (Settings > Variables and Secrets):
   ONESIGNAL_APP_ID, ONESIGNAL_API_KEY (secret), SHARED_SECRET (secret), ALLOWED_ORIGIN (ej: https://tuusuario.github.io) */
export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("no", { status: 405, headers: cors });

    let body;
    try { body = await req.json(); } catch { return new Response("bad", { status: 400, headers: cors }); }

    const names = { jair: "Jair", nicole: "Nicole" };
    if (body.secret !== env.SHARED_SECRET || !names[body.from]) {
      return new Response("no", { status: 403, headers: cors });
    }
    const to = body.from === "jair" ? "nicole" : "jair";

    const r = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Key " + env.ONESIGNAL_API_KEY },
      body: JSON.stringify({
        app_id: env.ONESIGNAL_APP_ID,
        target_channel: "push",
        include_aliases: { external_id: [to] },
        headings: { en: "Un toquecito ♡" },
        contents: { en: names[body.from] + " te dio un toque ♡" }
      })
    });
    return new Response(r.ok ? "ok" : "error", { status: r.ok ? 200 : 502, headers: cors });
  }
};
