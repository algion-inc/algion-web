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

    // シンプルで清潔感のあるメールテンプレート
    const autoReplyHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お問い合わせありがとうございます | Algion</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #333333;">

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
        
        <!-- Header -->
        <tr>
          <td style="padding: 40px 0; text-align: center; border-bottom: 1px solid #eee;">
            <h1 style="margin: 0; color: #000000; font-size: 24px; font-weight: normal;">
              Algion
            </h1>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 40px 0;">
            
            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.5;">
              ${name} 様
            </p>
            
            <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.5;">
              この度はAlgion株式会社へお問い合わせいただき、ありがとうございます。<br>
              以下の内容でお問い合わせを受け付けました。
            </p>

            <!-- Contact Details -->
            <table style="width: 100%; border: 1px solid #eee; border-collapse: collapse; margin-bottom: 30px;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; background-color: #f8f9fa; font-weight: 500; width: 120px;">
                  お名前
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; background-color: #f8f9fa; font-weight: 500;">
                  メールアドレス
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                  ${email}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; background-color: #f8f9fa; font-weight: 500;">
                  会社名
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                  ${company}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; background-color: #f8f9fa; font-weight: 500;">
                  部署・役職
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                  ${position}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; background-color: #f8f9fa; font-weight: 500; vertical-align: top;">
                  お問い合わせ内容
                </td>
                <td style="padding: 12px;">
                  <div style="white-space: pre-wrap;">${message}</div>
                </td>
              </tr>
            </table>

            <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.5;">
              担当者より折り返しご連絡いたします。今しばらくお待ちください。
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 30px 0; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0; color: #000000; font-size: 16px; font-weight: 500;">
              Algion株式会社
            </p>
            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
              〒107-0062 東京都港区南青山3-1-36 青山丸竹ビル6F<br>
              info@algion.co.jp
            </p>
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