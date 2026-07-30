import type { APIRoute } from "astro";

export const prerender = false;

const CONTACT_TO = ["contact@84colors.com", "info@iglooanimations.com"];
const DEFAULT_FROM = "Gimme The Short Version <info@gimmetheshortversion.com>";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_EMAILS_URL = "https://api.resend.com/emails";

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env ?? {};

  try {
    if (!env.RESEND_API_KEY) {
      return jsonResponse({ error: "Missing RESEND_API_KEY" }, 500);
    }

    if (!env.TURNSTILE_SECRET_KEY) {
      return jsonResponse({ error: "Missing TURNSTILE_SECRET_KEY" }, 500);
    }

    const formData = await request.formData();
    const name = clean(formData.get("name"), 120);
    const email = clean(formData.get("email"), 254);
    const message = clean(formData.get("Message"), 5000);
    const honeypot = clean(formData.get("company"), 120);
    const startedAt = Number(formData.get("startedAt"));
    const turnstileToken = formData.get("cf-turnstile-response");

    if (honeypot) {
      return jsonResponse({ ok: true });
    }

    if (Number.isFinite(startedAt) && Date.now() - startedAt < 3000) {
      return jsonResponse({ error: "Please try again." }, 400);
    }

    if (!name || !isEmail(email) || !message) {
      return jsonResponse({ error: "Please complete all required fields." }, 400);
    }

    if (!turnstileToken) {
      return jsonResponse({ error: "Verification is required." }, 400);
    }

    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      "";

    const turnstile = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, turnstileToken, ip);

    if (!turnstile.success) {
      return jsonResponse({ error: "Verification failed." }, 400);
    }

    const subject = `New quote request from ${name}`;
    const text = [
      "New quote request from the website.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const html = `
      <h2>New quote request from the website</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    const resendResponse = await fetch(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM || DEFAULT_FROM,
        to: CONTACT_TO,
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error("Resend error:", errorBody);
      return jsonResponse({ error: "Email could not be sent." }, 502);
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return jsonResponse({ error: "Unexpected error." }, 500);
  }
};

export const GET: APIRoute = () => jsonResponse({ error: "Method not allowed" }, 405);

async function verifyTurnstile(secret: string, token: FormDataEntryValue, remoteip: string) {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token as string);
  if (remoteip) body.append("remoteip", remoteip);

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body,
  });

  return response.json() as Promise<{ success: boolean }>;
}

function clean(value: FormDataEntryValue | null, maxLength: number) {
  return String(value || "")
    .trim()
    .slice(0, maxLength);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, function (char) {
    return (
      {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[char] || char
    );
  });
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
