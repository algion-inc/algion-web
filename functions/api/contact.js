export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    let body;
    
    // Content-Typeに基づいて適切な処理を選択
    if (request.headers.get('content-type')?.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        position: formData.get('position'),
        message: formData.get('message'),
      };
    }

    const { name, email, company, position, message } = body;

    // 入力値のバリデーション
    if (!name || !email || !company || !position || !message) {
      return new Response(JSON.stringify({ error: '必須項目が入力されていません。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 文字列の長さチェック
    if (name.length > 100 || company.length > 200 || position.length > 100) {
      return new Response(JSON.stringify({ error: '入力内容が長すぎます。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (message.length > 2000) {
      return new Response(JSON.stringify({ error: 'お問い合わせ内容は2000文字以内で入力してください。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return new Response(JSON.stringify({ error: '有効なメールアドレスを入力してください。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // XSS対策: HTMLタグを含む場合の警告
    const htmlRegex = /<[^>]*>/;
    if (htmlRegex.test(name) || htmlRegex.test(company) || htmlRegex.test(position) || htmlRegex.test(message)) {
      return new Response(JSON.stringify({ error: 'HTMLタグは使用できません。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 環境変数のチェック
    if (!env.EMAIL_USER || !env.EMAIL_PASS) {
      return new Response(JSON.stringify({ error: 'メール送信の設定が完了していません。管理者にお問い合わせください。' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // メール本文のHTMLを生成（Webサイトデザインに合わせて）
    const inquiryHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>お問い合わせ - Algion株式会社</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #000000; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%);">
  
  <!-- Main Container -->
  <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #000000 0%, #374151 100%); padding: 40px 32px; text-align: center; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50px; left: 20%; width: 150px; height: 150px; background: rgba(34, 197, 94, 0.1); border-radius: 50%; filter: blur(40px);"></div>
      <div style="position: absolute; bottom: -50px; right: 20%; width: 150px; height: 150px; background: rgba(59, 130, 246, 0.1); border-radius: 50%; filter: blur(40px);"></div>
      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.025em; position: relative;">
        新しいお問い合わせが届きました
      </h1>
      <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 16px; font-weight: 300; position: relative;">
        Algion 公式サイトより
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 48px 32px;">
      
      <!-- Contact Info Card -->
      <div style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 24px; padding: 32px; margin-bottom: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);">
        <h2 style="margin: 0 0 24px 0; color: #000000; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">
          お問い合わせ者情報
        </h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1); font-weight: 600; color: #000000; width: 140px; vertical-align: top;">
              お名前
            </td>
            <td style="padding: 16px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1); color: #000000; font-size: 16px;">
              ${name}
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1); font-weight: 600; color: #000000; vertical-align: top;">
              メール
            </td>
            <td style="padding: 16px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1); color: #2563eb; font-size: 16px;">
              <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1); font-weight: 600; color: #000000; vertical-align: top;">
              会社名
            </td>
            <td style="padding: 16px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1); color: #000000; font-size: 16px;">
              ${company}
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 0; font-weight: 600; color: #000000; vertical-align: top;">
              部署・役職
            </td>
            <td style="padding: 16px 0; color: #000000; font-size: 16px;">
              ${position}
            </td>
          </tr>
        </table>
      </div>

      <!-- Message Card -->
      <div style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 24px; padding: 32px; margin-bottom: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);">
        <h3 style="margin: 0 0 20px 0; color: #000000; font-size: 20px; font-weight: 600; letter-spacing: -0.025em;">
          お問い合わせ内容
        </h3>
        <div style="background-color: #f8fafc; border: 2px solid rgba(0, 0, 0, 0.1); border-radius: 16px; padding: 24px; white-space: pre-wrap; font-size: 16px; line-height: 1.6; color: #000000;">
${message}
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin: 48px 0;">
        <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #000000 0%, #374151 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 16px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: all 0.3s;">
          返信する
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid rgba(0, 0, 0, 0.1);">
      <div style="margin-bottom: 16px;">
        <h4 style="margin: 0; color: #000000; font-size: 18px; font-weight: 700; letter-spacing: -0.025em;">
          Algion株式会社
        </h4>
      </div>
      <p style="margin: 0; color: rgba(0, 0, 0, 0.6); font-size: 14px; line-height: 1.5;">
        〒107-0062 東京都港区南青山3-1-36 青山丸竹ビル6F<br>
        Email: <a href="mailto:info@algion.co.jp" style="color: #2563eb;">info@algion.co.jp</a>
      </p>
      <p style="margin: 16px 0 0 0; color: rgba(0, 0, 0, 0.4); font-size: 12px;">
        このメールはAlgion公式サイトのお問い合わせフォームから自動送信されました。
      </p>
    </div>

  </div>
</body>
</html>`;
    
    
    // Gmail API を使用してメール送信
    const mailResult = await sendGmail(env, {
      to: 'info@algion.co.jp',
      from: 'Algion株式会社 お問い合わせ窓口 <info@algion.co.jp>',
      replyTo: email,
      subject: `【お問い合わせ】${company} ${name}様より`,
      html: inquiryHtml
    });

    // 自動返信メール
    try {
      await sendGmail(env, {
        to: email,
        from: 'Algion株式会社 お問い合わせ窓口 <info@algion.co.jp>',
        subject: 'お問い合わせありがとうございます - Algion株式会社',
        html: `
          <h2>お問い合わせありがとうございます</h2>
          <p>${name} 様</p>

          <p>この度はAlgion株式会社へお問い合わせいただき、誠にありがとうございます。</p>
          <p>下記の内容にてお問い合わせを承りました。</p>

          <hr>
          <p><strong>お名前：</strong> ${name}</p>
          <p><strong>会社名：</strong> ${company}</p>
          <p><strong>所属部署・役職：</strong> ${position}</p>
          <hr>

          <h3>お問い合わせ内容：</h3>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr>

          <p>内容を確認の上、担当者より折り返しご連絡いたしますので、今しばらくお待ちください。</p>

          <p>今後とも何卒よろしくお願いいたします。</p>

          <br>

          <p>Algion株式会社<br>
          〒107-0062 東京都港区南青山3-1-36 青山丸竹ビル6F<br>
          Email: info@algion.co.jp</p>
        `
      });

      return new Response(JSON.stringify({ 
        message: 'お問い合わせを送信しました。ありがとうございます。確認メールもお送りしました。' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (autoReplyError) {
      console.error('自動返信メール送信エラー:', autoReplyError);
      return new Response(JSON.stringify({ 
        message: 'お問い合わせを送信しました。ありがとうございます。（確認メールの送信に失敗しましたが、お問い合わせは正常に受け付けられました）' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('メール送信エラー:', error);
    return new Response(JSON.stringify({ 
      error: 'メールの送信に失敗しました。時間をおいて再度お試しください。' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Gmail API を使用したメール送信関数
async function sendGmail(env, mailOptions) {
  // OAuth2 トークン取得
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: env.GMAIL_CLIENT_ID,
      client_secret: env.GMAIL_CLIENT_SECRET,
      refresh_token: env.GMAIL_REFRESH_TOKEN,
    }),
  });

  const { access_token } = await tokenResponse.json();

  // メール送信
  const email = createEmailMessage(mailOptions);
  // quoted-printableの場合はそのまま送信
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const base64Email = btoa(String.fromCharCode(...data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
    
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64Email,
    }),
  });

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.status}`);
  }

  return response.json();
}

// RFC2822形式のメール作成
function createEmailMessage({ to, from, replyTo, subject, html }) {
  const boundary = '----=_Part_' + Math.random().toString(36).substr(2, 9);
  
  // 日本語を含む場合のエンコード処理
  const encodeHeader = (text) => {
    // ASCIIのみかチェック
    if (/^[\x00-\x7F]*$/.test(text)) {
      return text;
    }
    // 日本語を含む場合はRFC2047形式でエンコード
    return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(text)))}?=`;
  };
  
  // FromフィールドのパースとエンコーディングM
  let encodedFrom = from;
  const fromMatch = from.match(/^(.*?)\s*<(.+)>$/);
  if (fromMatch) {
    const displayName = fromMatch[1];
    const emailAddress = fromMatch[2];
    encodedFrom = `${encodeHeader(displayName)} <${emailAddress}>`;
  }
  
  // subjectのエンコード
  const encodedSubject = encodeHeader(subject);
  
  // HTMLからプレーンテキストを抽出（改良版）
  const plainText = html
    .replace(/<hr\s*\/?>/gi, '\n' + '-'.repeat(40) + '\n')  // <hr>を区切り線に
    .replace(/<h[1-6][^>]*>/gi, '\n')  // 見出しの前に改行
    .replace(/<\/h[1-6]>/gi, '\n')     // 見出しの後に改行
    .replace(/<br\s*\/?>/gi, '\n')     // <br>を改行に
    .replace(/<\/p>/gi, '\n\n')        // 段落の終わりに改行
    .replace(/<[^>]*>/g, '')           // 残りのHTMLタグを削除
    .replace(/&nbsp;/g, ' ')           // &nbsp;をスペースに
    .replace(/&amp;/g, '&')            // &amp;を&に
    .replace(/&lt;/g, '<')             // &lt;を<に
    .replace(/&gt;/g, '>')             // &gt;を>に
    .replace(/\n\s*\n/g, '\n\n')       // 連続する空行を整理
    .trim();
  
  // プレーンテキストとHTMLコンテンツのbase64エンコード
  const base64Text = btoa(unescape(encodeURIComponent(plainText)));
  const base64Html = btoa(unescape(encodeURIComponent(html)));
  
  let message = [
    `To: ${to}`,
    `From: ${encodedFrom}`,
    replyTo ? `Reply-To: ${replyTo}` : '',
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    html.replace(/=/, '=3D').replace(/\r?\n/g, '\r\n')
  ].filter(line => line !== '').join('\r\n');

  return message;
}