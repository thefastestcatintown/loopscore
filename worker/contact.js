const RECIPIENT_EMAIL = "chris@loopscore.app";
const FROM_EMAIL = "Loopscore Website <kontakt@loopscore.app>";
const ALLOWED_ORIGINS = new Set([
  "https://loopscore.app",
  "https://www.loopscore.app",
]);

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };

  if (ALLOWED_ORIGINS.has(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function jsonResponse(request, payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(request),
    },
  });
}

function normalizeValue(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeMessage(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().slice(0, 3000);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildEmail({ name, course, email, phone, message }) {
  const text = [
    `Name: ${name}`,
    `Anlage: ${course || "-"}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone || "-"}`,
    "",
    "Nachricht:",
    message,
  ].join("\n");

  const rows = [
    ["Name", name],
    ["Anlage", course || "-"],
    ["E-Mail", email],
    ["Telefon", phone || "-"],
  ]
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:6px 16px 6px 0">${escapeHtml(label)}</th>` +
        `<td style="padding:6px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return {
    text,
    html:
      `<h2>Neue Anfrage über loopscore.app</h2>` +
      `<table>${rows}</table>` +
      `<h3>Nachricht</h3>` +
      `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  };
}

async function readJson(request) {
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return null;
  }

  try {
    return await request.json();
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/contact") {
      return jsonResponse(request, { error: "not-found" }, 404);
    }

    if (request.method !== "POST") {
      return jsonResponse(request, { error: "method-not-allowed" }, 405);
    }

    const body = await readJson(request);
    if (!body || typeof body !== "object") {
      return jsonResponse(request, { error: "invalid-json" }, 400);
    }

    const name = normalizeValue(body.name, 120);
    const course = normalizeValue(body.course, 160);
    const email = normalizeValue(body.email, 180);
    const phone = normalizeValue(body.phone, 80);
    const message = normalizeMessage(body.message);

    if (!name || !email || !message || !isValidEmail(email)) {
      return jsonResponse(request, { error: "invalid-contact-message" }, 400);
    }

    if (!env.RESEND_API_KEY) {
      return jsonResponse(request, { error: "server-misconfigured" }, 500);
    }

    const emailBody = buildEmail({ name, course, email, phone, message });
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "loopscore-contact-worker/1.0",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [RECIPIENT_EMAIL],
        reply_to: email,
        subject: `Neue Loopscore Anfrage von ${name}`,
        text: emailBody.text,
        html: emailBody.html,
      }),
    });

    if (!resendResponse.ok) {
      console.error("resend-email-failed", {
        status: resendResponse.status,
        body: (await resendResponse.text()).slice(0, 500),
      });
      return jsonResponse(request, { error: "email-send-failed" }, 502);
    }

    return jsonResponse(request, { ok: true });
  },
};
