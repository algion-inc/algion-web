# Algion株式会社 コーポレートWebサイト

> Algion株式会社のコーポレートWebサイトのソースコードです。Next.js によって構築され、Cloudflare Pages 上で高速かつ安全にホスティングされています。

## 技術スタック

- [Next.js](https://nextjs.org) - React フレームワーク
- TypeScript - 型安全性
- Tailwind CSS - スタイリング
- Cloudflare Pages - ホスティング
- Cloudflare Functions - サーバーサイド機能（お問い合わせフォーム等）

## 開発環境のセットアップ

### 必要な環境

- Node.js 20.9以上
- npm または yarn

### ローカル開発サーバーの起動

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてサイトを確認できます。

### ビルド

```bash
npm run build
```

## デプロイ

このサイトは Cloudflare Pages でホスティングされており、main ブランチへの push により自動で本番環境へデプロイされます。

## お問い合わせ機能

お問い合わせフォームは Cloudflare Turnstile、Cloudflare Pages Functions、Gmail APIを組み合わせています。Turnstileのサーバー検証とCloudflare側のレート制限を有効にしてから公開してください。環境変数と公開前設定については `CLOUDFLARE_SETUP.md` を参照してください。
