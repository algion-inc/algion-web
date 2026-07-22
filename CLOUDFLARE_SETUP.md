# Cloudflare Pages デプロイ設定

## 1. Gmail API設定

### Google Cloud Console設定
1. https://console.cloud.google.com/ にアクセス
2. 新しいプロジェクト作成 または 既存プロジェクト選択
3. 「APIとサービス」→「ライブラリ」→「Gmail API」を有効化
4. 「認証情報」→「認証情報を作成」→「OAuth 2.0 クライアントID」
5. アプリケーションの種類: 「Webアプリケーション」
6. 承認済みのリダイレクトURI: `https://developers.google.com/oauthplayground`

### OAuth2トークン取得
1. https://developers.google.com/oauthplayground にアクセス
2. 右上の設定アイコン → 「Use your own OAuth credentials」にチェック
3. Client IDとClient Secretを入力
4. 左側で「Gmail API v1」→「https://www.googleapis.com/auth/gmail.send」を選択
5. 「Authorize APIs」→ Googleアカウントでログイン（hideaki.okamoto@algion.co.jp）
6. 「Exchange authorization code for tokens」
7. **Refresh token**をコピー（これが重要）

## 2. Turnstile設定

1. Cloudflare dashboard → Turnstile → Add widget
2. Widget name: `Algion contact form`
3. Hostname: `algion.co.jp`（`www.algion.co.jp`を利用する場合は追加）
4. Widget mode: Managed
5. Site keyとSecret keyを取得

Turnstileはクライアントの表示だけでなく、`functions/api/contact.js`からSiteverify APIを呼び出して検証します。Secret keyはクライアントへ公開しないでください。

## 3. Cloudflare Pages環境変数

Cloudflare Pages dashboard → Settings → Environment variables:

```
GMAIL_CLIENT_ID=取得したクライアントID
GMAIL_CLIENT_SECRET=取得したクライアントシークレット
GMAIL_REFRESH_TOKEN=取得したリフレッシュトークン
NEXT_PUBLIC_TURNSTILE_SITE_KEY=TurnstileのSite key
TURNSTILE_SECRET_KEY=TurnstileのSecret key
TURNSTILE_ALLOWED_HOSTNAMES=algion.co.jp,www.algion.co.jp
NODE_VERSION=22.16.0
```

`NEXT_PUBLIC_TURNSTILE_SITE_KEY`はビルド時に必要です。Preview環境では、本番と分けたTurnstile widgetを使用してください。

## 4. 問い合わせAPIのレート制限

CloudflareのWAF / Rate limiting rulesで、`POST /api/contact`をIP単位で制限します。Freeプランでは次の初期値を使用します。

- 条件: `http.request.method eq "POST" and http.request.uri.path eq "/api/contact"`
- 同じ特性: IPアドレス
- 上限: 10秒間に5回
- アクション: Block
- Mitigation timeout: 10秒

Turnstileを主な不正送信対策とし、レート制限は短時間の連続送信を抑える補助として使用します。

## 5. デプロイ手順

1. GitHubにpush
2. Cloudflare Pages → 「Create a project」
3. GitHub連携してリポジトリ選択
4. Build settings:
   - Framework preset: Next.js (Static HTML Export)
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node.js: `NODE_VERSION=22.16.0`
5. 環境変数を設定
6. Deploy

## 6. メール送信方式

従来のnodemailer依存は削除済みです。Cloudflare Pages FunctionsからGmail APIを直接呼び出します。

## 7. DNS設定

お名前.com等でCNAMEレコード設定:
```
algion.co.jp → Cloudflareから提供されるURL
```
