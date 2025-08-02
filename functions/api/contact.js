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

    // Googleスタイル＋Algionデザインの洗練されたメールテンプレート
    const autoReplyHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>お問い合わせありがとうございます | Algion</title>
</head>
<body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; color: #333333;">

<!-- Preheader -->
<div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fafafa;">お問い合わせを受け付けました。担当者より折り返しご連絡いたします。</div>

<!-- Wrapper -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa;">
  <tr>
    <td align="center" style="padding: 60px 20px;">
      
      <!-- Main Container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="580" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #000000 0%, #1f2937 100%); padding: 48px 40px; text-align: center;">
            <!-- Brand -->
            <h1 style="margin: 0 0 12px 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">
              Algion
            </h1>
            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #22c55e, #3b82f6); margin: 0 auto 20px; border-radius: 2px;"></div>
            <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400; letter-spacing: -0.01em;">
              お問い合わせありがとうございます
            </p>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 48px 40px;">
            
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="margin: 0 0 16px 0; color: #000000; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">
                ${name} 様
              </h2>
              <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.6; font-weight: 400;">
                この度はAlgion株式会社へお問い合わせいただき、誠にありがとうございます。
              </p>
            </div>

            <!-- Contact Information -->
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px; margin-bottom: 32px;">
              <h3 style="margin: 0 0 24px 0; color: #000000; font-size: 18px; font-weight: 600; letter-spacing: -0.025em;">
                お問い合わせ内容の確認
              </h3>
              
              <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                <tr>
                  <td style="padding: 12px 0; font-weight: 500; color: #6b7280; font-size: 14px; width: 120px; vertical-align: top;">
                    お名前
                  </td>
                  <td style="padding: 12px 0; color: #000000; font-size: 16px; font-weight: 500;">
                    ${name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: 500; color: #6b7280; font-size: 14px; vertical-align: top;">
                    メールアドレス
                  </td>
                  <td style="padding: 12px 0;">
                    <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none; font-size: 16px; font-weight: 500;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: 500; color: #6b7280; font-size: 14px; vertical-align: top;">
                    会社名
                  </td>
                  <td style="padding: 12px 0; color: #000000; font-size: 16px; font-weight: 500;">
                    ${company}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: 500; color: #6b7280; font-size: 14px; vertical-align: top;">
                    部署・役職
                  </td>
                  <td style="padding: 12px 0; color: #000000; font-size: 16px; font-weight: 500;">
                    ${position}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Message Content -->
            <div style="margin-bottom: 40px;">
              <h4 style="margin: 0 0 16px 0; color: #000000; font-size: 16px; font-weight: 600; letter-spacing: -0.025em;">
                お問い合わせ内容
              </h4>
              <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap; font-weight: 400;">
${message}
                </p>
              </div>
            </div>

            <!-- Next Steps -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #22c55e; border-radius: 8px; padding: 32px; text-align: center; margin-bottom: 32px;">
              <h4 style="margin: 0 0 16px 0; color: #065f46; font-size: 18px; font-weight: 600; letter-spacing: -0.025em;">
                今後の流れ
              </h4>
              <p style="margin: 0; color: #047857; font-size: 15px; line-height: 1.6; font-weight: 400;">
                内容を確認の上、担当者より<strong>24時間以内</strong>に折り返しご連絡いたします。<br>
                今しばらくお待ちください。
              </p>
            </div>

            <!-- Action Button -->
            <div style="text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #000000 0%, #374151 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: -0.01em;">
                返信する
              </a>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #f9fafb; padding: 40px; text-align: center; border-top: 1px solid #e5e7eb;">
            <div style="margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #000000; font-size: 20px; font-weight: 800; letter-spacing: -0.025em;">
                Algion株式会社
              </h4>
              <div style="width: 40px; height: 2px; background: linear-gradient(90deg, #22c55e, #3b82f6); margin: 0 auto; border-radius: 2px;"></div>
            </div>
            
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px; line-height: 1.6; font-weight: 400;">
              〒107-0062 東京都港区南青山3-1-36 青山丸竹ビル6F<br>
              <a href="mailto:info@algion.co.jp" style="color: #3b82f6; text-decoration: none; font-weight: 500;">info@algion.co.jp</a>
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 16px;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; font-weight: 400;">
                このメールはAlgion公式サイトから自動送信されました
              </p>
            </div>
          </td>
        </tr>

      </table>
      
    </td>
  </tr>
</table>

</body>
</html>`;
    
    // Gmail API を使用してメール送信（info側）
    const mailResult = await sendGmail(env, {
      to: 'info@algion.co.jp',
      from: 'Algion株式会社 お問い合わせ窓口 <info@algion.co.jp>',
      replyTo: email,
      subject: `【お問い合わせ】${company} ${name}様より`,
      html: autoReplyHtml
    });

    // 自動返信メール
    try {
      await sendGmail(env, {
        to: email,
        from: 'Algion株式会社 お問い合わせ窓口 <info@algion.co.jp>',
        subject: 'お問い合わせありがとうございます - Algion株式会社',
        html: autoReplyHtml
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