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

## 2. Cloudflare Pages環境変数

Cloudflare Pages dashboard → Settings → Environment variables:

```
GMAIL_CLIENT_ID=取得したクライアントID
GMAIL_CLIENT_SECRET=取得したクライアントシークレット
GMAIL_REFRESH_TOKEN=取得したリフレッシュトークン
```

## 3. デプロイ手順

1. GitHubにpush
2. Cloudflare Pages → 「Create a project」
3. GitHub連携してリポジトリ選択
4. Build settings:
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `out`
5. 環境変数を設定
6. Deploy

## 4. 従来のnodemailer削除

デプロイ前に不要な依存関係を削除:
```bash
npm uninstall nodemailer @types/nodemailer
```

## 5. DNS設定

お名前.com等でCNAMEレコード設定:
```
algion.co.jp → Cloudflareから提供されるURL
```