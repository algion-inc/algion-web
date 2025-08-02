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

    // 超洗練されたメールテンプレート（大企業レベル）
    const inquiryHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>新しいお問い合わせ | Algion</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">

<!-- Preheader (hidden preview text) -->
<div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f8fafc;">${company} ${name}様からのお問い合わせです。内容: ${message.substring(0, 80)}...</div>

<!-- Wrapper -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      
      <!-- Main Container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);">
        
        <!-- Header with Brand -->
        <tr>
          <td style="background: linear-gradient(135deg, #000000 0%, #1f2937 50%, #374151 100%); padding: 0; position: relative; overflow: hidden;">
            <!-- Decorative elements -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="position: relative; padding: 48px 40px; text-align: center;">
                  <!-- Floating orbs effect -->
                  <div style="position: absolute; top: -30px; left: 10%; width: 60px; height: 60px; background: rgba(34, 197, 94, 0.15); border-radius: 50%; filter: blur(20px);"></div>
                  <div style="position: absolute; top: 20px; right: 15%; width: 80px; height: 80px; background: rgba(59, 130, 246, 0.15); border-radius: 50%; filter: blur(25px);"></div>
                  <div style="position: absolute; bottom: -20px; left: 60%; width: 50px; height: 50px; background: rgba(236, 72, 153, 0.15); border-radius: 50%; filter: blur(15px);"></div>
                  
                  <!-- Logo/Brand -->
                  <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; position: relative; z-index: 1;">
                    Algion
                  </h1>
                  <div style="width: 40px; height: 2px; background: linear-gradient(90deg, #22c55e, #3b82f6); margin: 0 auto 16px; border-radius: 2px;"></div>
                  <p style="margin: 0; color: rgba(255, 255, 255, 0.85); font-size: 16px; font-weight: 400; position: relative; z-index: 1;">
                    新しいお問い合わせが届きました
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Priority Badge -->
        <tr>
          <td style="padding: 0 40px; transform: translateY(-12px);">
            <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; text-align: center; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
              🔥 高優先度
            </div>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 20px 40px 40px;">
            
            <!-- Summary Card -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); opacity: 0.05; border-radius: 50%;"></div>
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
                <span style="display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 12px;"></span>
                お問い合わせ概要
              </h2>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #64748b; font-size: 14px; font-weight: 500;">送信者</span>
                  <span style="color: #0f172a; font-size: 16px; font-weight: 600;">${name}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #64748b; font-size: 14px; font-weight: 500;">会社</span>
                  <span style="color: #0f172a; font-size: 16px; font-weight: 600;">${company}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                  <span style="color: #64748b; font-size: 14px; font-weight: 500;">役職</span>
                  <span style="color: #0f172a; font-size: 16px; font-weight: 600;">${position}</span>
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div style="background: #ffffff; border: 2px solid #f1f5f9; border-radius: 16px; padding: 28px; margin-bottom: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
              <h3 style="margin: 0 0 20px 0; color: #0f172a; font-size: 16px; font-weight: 700; display: flex; align-items: center;">
                <span style="display: inline-block; width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                連絡先情報
              </h3>
              <div style="background: #f8fafc; border-radius: 12px; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 16px; font-weight: 600;">
                    📧
                  </div>
                  <div>
                    <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">メールアドレス</p>
                    <a href="mailto:${email}" style="color: #3b82f6; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                      ${email}
                      <span style="font-size: 12px;">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message -->
            <div style="background: #ffffff; border: 2px solid #f1f5f9; border-radius: 16px; padding: 28px; margin-bottom: 32px;">
              <h3 style="margin: 0 0 20px 0; color: #0f172a; font-size: 16px; font-weight: 700; display: flex; align-items: center;">
                <span style="display: inline-block; width: 6px; height: 6px; background: #f59e0b; border-radius: 50%; margin-right: 10px;"></span>
                お問い合わせ内容
              </h3>
              <div style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); border: 1px solid #fbbf24; border-radius: 12px; padding: 20px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -10px; right: -10px; width: 40px; height: 40px; background: #f59e0b; opacity: 0.1; border-radius: 50%;"></div>
                <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6; white-space: pre-wrap; font-weight: 500; position: relative;">
${message}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 40px 0;">
              <div style="display: inline-flex; gap: 16px; flex-wrap: wrap;">
                <a href="mailto:${email}" style="background: linear-gradient(135deg, #000000 0%, #374151 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 15px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15); transition: all 0.2s;">
                  <span>📧</span> 返信する
                </a>
                <a href="tel:${email.replace('@', '-').replace('.', '-')}" style="background: #ffffff; color: #374151; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 15px; display: inline-flex; align-items: center; gap: 8px; border: 2px solid #e5e7eb; transition: all 0.2s;">
                  <span>📞</span> 電話する
                </a>
              </div>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px 40px; border-top: 1px solid #e2e8f0;">
            <div style="text-align: center;">
              <!-- Company Info -->
              <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px; font-weight: 800; letter-spacing: -0.02em;">
                  Algion株式会社
                </h4>
                <div style="width: 30px; height: 2px; background: linear-gradient(90deg, #22c55e, #3b82f6); margin: 0 auto 12px; border-radius: 2px;"></div>
              </div>
              
              <!-- Address -->
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.5; font-weight: 400;">
                〒107-0062 東京都港区南青山3-1-36 青山丸竹ビル6F<br>
                <a href="mailto:info@algion.co.jp" style="color: #3b82f6; text-decoration: none; font-weight: 500;">info@algion.co.jp</a>
              </p>
              
              <!-- Automated notice -->
              <div style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.1); border-radius: 8px; padding: 12px; margin: 20px 0;">
                <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 6px;">
                  <span style="display: inline-block; width: 4px; height: 4px; background: #6366f1; border-radius: 50%;"></span>
                  このメールはAlgion公式サイトから自動送信されました
                  <span style="display: inline-block; width: 4px; height: 4px; background: #6366f1; border-radius: 50%;"></span>
                </p>
              </div>
            </div>
          </td>
        </tr>

      </table>
      
    </td>
  </tr>
</table>

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