const requiredEnvironmentVariables = ["GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN"];
const turnstileVerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const defaultTurnstileHostnames = ["algion.co.jp", "www.algion.co.jp"];

const limits = {
  name: 100,
  email: 254,
  company: 200,
  position: 150,
  consultationStage: 100,
  message: 3000,
  dataStatus: 100,
  startTiming: 100,
  budget: 100,
  source: 250,
  utmSource: 250,
  utmMedium: 250,
  utmCampaign: 250,
  landingPage: 500,
  turnstileToken: 2048,
};

const asText = (value) => typeof value === "string" ? value.trim() : "";
const escapeHtml = (value) => asText(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8" },
});

function normalizeBody(body) {
  return {
    name: asText(body.name),
    email: asText(body.email),
    company: asText(body.company),
    position: asText(body.position),
    consultationStage: asText(body.consultationStage),
    message: asText(body.message),
    dataStatus: asText(body.dataStatus),
    startTiming: asText(body.startTiming),
    budget: asText(body.budget),
    website: asText(body.website),
    privacy: body.privacy === true || body.privacy === "true",
    source: asText(body.source),
    utmSource: asText(body.utmSource),
    utmMedium: asText(body.utmMedium),
    utmCampaign: asText(body.utmCampaign),
    landingPage: asText(body.landingPage),
    turnstileToken: asText(body.turnstileToken),
  };
}

function validateInput(input) {
  if (!input.name || !input.email || !input.company || !input.consultationStage || !input.message || !input.privacy) {
    return "必須項目が入力されていません。";
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(input.email) || input.email.length > limits.email) {
    return "有効なメールアドレスを入力してください。";
  }

  for (const [field, limit] of Object.entries(limits)) {
    if (input[field] && input[field].length > limit) {
      return field === "message" ? "ご相談内容は3000文字以内で入力してください。" : "入力内容が長すぎます。";
    }
  }

  return null;
}

function allowedTurnstileHostnames(env) {
  const configured = asText(env.TURNSTILE_ALLOWED_HOSTNAMES);
  return configured
    ? configured.split(",").map((hostname) => hostname.trim()).filter(Boolean)
    : defaultTurnstileHostnames;
}

async function verifyTurnstile(request, env, token) {
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("Missing Turnstile environment variable: TURNSTILE_SECRET_KEY");
    return { error: "セキュリティ確認の設定を確認しています。時間をおいて再度お試しください。", status: 503 };
  }

  if (!token || token.length > limits.turnstileToken) {
    return { error: "セキュリティ確認の完了後に送信してください。", status: 400 };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const body = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
    });
    const remoteIp = request.headers.get("CF-Connecting-IP");
    if (remoteIp) body.set("remoteip", remoteIp);

    const response = await fetch(turnstileVerifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error("Turnstile verification request failed:", response.status);
      return { error: "セキュリティ確認に失敗しました。再度お試しください。", status: 503 };
    }

    const result = await response.json();
    const hostnameAllowed = allowedTurnstileHostnames(env).includes(asText(result.hostname));
    const actionMatches = asText(result.action) === "contact_form";

    if (!result.success || !hostnameAllowed || !actionMatches) {
      console.warn("Turnstile verification rejected:", {
        hostname: asText(result.hostname),
        action: asText(result.action),
        errorCodes: Array.isArray(result["error-codes"]) ? result["error-codes"] : [],
      });
      return { error: "セキュリティ確認に失敗しました。再度お試しください。", status: 400 };
    }

    return null;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { error: "セキュリティ確認に失敗しました。時間をおいて再度お試しください。", status: 503 };
  } finally {
    clearTimeout(timeout);
  }
}

async function readBody(request) {
  if (request.headers.get("content-type")?.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

function detailRows(input, includeTraffic = false) {
  const rows = [
    ["お名前", input.name],
    ["メールアドレス", input.email],
    ["会社名", input.company],
    ["部署・役職", input.position],
    ["相談段階", input.consultationStage],
    ["データ状況", input.dataStatus],
    ["開始時期", input.startTiming],
    ["予算帯", input.budget],
    ["ご相談内容", input.message],
  ];

  if (includeTraffic) {
    rows.push(
      ["流入元", input.source],
      ["UTM source", input.utmSource],
      ["UTM medium", input.utmMedium],
      ["UTM campaign", input.utmCampaign],
      ["初回ページ", input.landingPage],
    );
  }

  return rows.filter(([, value]) => value).map(([label, value]) => `
    <tr>
      <th style="width:140px;padding:12px;border:1px solid #e5e7eb;background:#f9fafb;text-align:left;vertical-align:top;">${escapeHtml(label)}</th>
      <td style="padding:12px;border:1px solid #e5e7eb;white-space:pre-line;">${escapeHtml(value)}</td>
    </tr>`).join("");
}

function emailTemplate({ heading, intro, input, includeTraffic = false }) {
  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;background:#ffffff;color:#111827;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:680px;margin:0 auto;padding:40px 20px;">
    <p style="font-size:22px;font-weight:700;margin:0 0 24px;">Algion</p>
    <h1 style="font-size:22px;margin:0 0 20px;">${escapeHtml(heading)}</h1>
    <p style="line-height:1.8;margin:0 0 24px;">${escapeHtml(intro)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">${detailRows(input, includeTraffic)}</table>
    <p style="line-height:1.8;margin:28px 0 0;">内容を確認のうえ、担当者よりご連絡します。</p>
    <p style="margin:32px 0 0;padding-top:24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:13px;line-height:1.7;">Algion株式会社<br>info@algion.co.jp</p>
  </div>
</body></html>`;
}

export async function onRequestPost({ request, env }) {
  try {
    const input = normalizeBody(await readBody(request));

    // Botには成功を返して通知メールを送らない
    if (input.website) {
      return jsonResponse({ message: "お問い合わせを受け付けました。" });
    }

    const validationError = validateInput(input);
    if (validationError) return jsonResponse({ error: validationError }, 400);

    const turnstileError = await verifyTurnstile(request, env, input.turnstileToken);
    if (turnstileError) return jsonResponse({ error: turnstileError.error }, turnstileError.status);

    const missingEnvironment = requiredEnvironmentVariables.filter((key) => !env[key]);
    if (missingEnvironment.length > 0) {
      console.error("Missing Gmail environment variables:", missingEnvironment.join(", "));
      return jsonResponse({ error: "メール送信の設定を確認しています。時間をおいて再度お試しください。" }, 500);
    }

    await sendGmail(env, {
      to: "info@algion.co.jp",
      from: "Algion株式会社 お問い合わせ窓口 <info@algion.co.jp>",
      replyTo: input.email,
      subject: `【無料相談】${input.company} ${input.name}様より`,
      html: emailTemplate({ heading: "無料相談を受け付けました", intro: `${input.company} ${input.name}様からのお問い合わせです。`, input, includeTraffic: true }),
    });

    try {
      await sendGmail(env, {
        to: input.email,
        from: "Algion株式会社 お問い合わせ窓口 <info@algion.co.jp>",
        subject: "お問い合わせありがとうございます - Algion株式会社",
        html: emailTemplate({ heading: "お問い合わせありがとうございます", intro: `${input.name}様、この度はAlgion株式会社へお問い合わせいただき、ありがとうございます。以下の内容で承りました。`, input }),
      });
    } catch (error) {
      console.error("Auto reply failed:", error);
    }

    return jsonResponse({ message: "お問い合わせを受け付けました。" });
  } catch (error) {
    console.error("Contact form error:", error);
    return jsonResponse({ error: "送信できませんでした。時間をおいて再度お試しください。" }, 500);
  }
}

async function sendGmail(env, mailOptions) {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env.GMAIL_CLIENT_ID,
      client_secret: env.GMAIL_CLIENT_SECRET,
      refresh_token: env.GMAIL_REFRESH_TOKEN,
    }),
  });

  if (!tokenResponse.ok) throw new Error(`Gmail token error: ${tokenResponse.status}`);
  const token = await tokenResponse.json();
  if (!token.access_token) throw new Error("Gmail access token is missing");

  const raw = createEmailMessage(mailOptions);
  const bytes = new TextEncoder().encode(raw);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const base64Email = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: base64Email }),
  });

  if (!response.ok) throw new Error(`Gmail API error: ${response.status}`);
  return response.json();
}

function createEmailMessage({ to, from, replyTo, subject, html }) {
  const encodeHeader = (value) => /^[\x00-\x7F]*$/.test(value)
    ? value
    : `=?UTF-8?B?${btoa(unescape(encodeURIComponent(value)))}?=`;
  const fromMatch = from.match(/^(.*?)\s*<(.+)>$/);
  const encodedFrom = fromMatch ? `${encodeHeader(fromMatch[1])} <${fromMatch[2]}>` : from;
  const encodedHtml = btoa(unescape(encodeURIComponent(html)));

  return [
    `To: ${to}`,
    `From: ${encodedFrom}`,
    replyTo ? `Reply-To: ${replyTo}` : "",
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    encodedHtml,
  ].filter((line, index) => line !== "" || index >= 6).join("\r\n");
}
