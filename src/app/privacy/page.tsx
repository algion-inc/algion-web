import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Algion株式会社",
  description: "Algion株式会社のプライバシーポリシー",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "取得する情報",
    body: "当社は、お問い合わせへの対応に必要な範囲で、次の情報を取得する場合があります。",
    items: ["お名前、メールアドレス、会社名", "所属部署・役職", "相談段階、業務・課題、お問い合わせ内容", "データ状況、開始時期、予算帯", "参照元、UTMパラメータ、初回閲覧ページ"],
  },
  {
    title: "利用目的",
    body: "取得した情報は、次の目的で利用します。",
    items: ["お問い合わせやご相談への対応", "提案内容と連絡方法の検討", "当社サービスとウェブサイトの改善", "不正利用、迷惑行為、セキュリティ上の問題への対応"],
  },
  {
    title: "AIと提供データの取り扱い",
    body: "お客様から提供された個人情報や法人情報を、許可なくAIモデルの学習や改善に利用することはありません。詳細なデータの確認が必要な場合は、ご相談後に目的と取り扱い方法を合意します。",
  },
  {
    title: "安全管理",
    body: "取得した情報へのアクセスを必要な範囲に制限し、漏えい、滅失、き損、不正アクセスの防止に必要な措置を講じます。",
  },
  {
    title: "外部サービスの利用",
    body: "お問い合わせフォームの不正利用防止にCloudflare Turnstileを、問い合わせ対応のメール送信にGoogleのGmail APIを利用します。これらのサービスでは、セキュリティ確認やメール送信に必要な範囲で情報が取り扱われる場合があります。",
  },
  {
    title: "委託先の管理",
    body: "利用目的の達成に必要な範囲で個人情報の取り扱いを外部へ委託する場合は、委託先を適切に選定し、必要かつ適切な監督を行います。",
  },
  {
    title: "第三者提供",
    body: "法令に基づく場合、人の生命・身体・財産の保護に必要な場合など、法令上認められる場合を除き、ご本人の同意なく個人情報を第三者へ提供しません。",
  },
  {
    title: "開示・訂正・削除",
    body: "ご本人から開示、訂正、削除等のご希望があった場合は、法令に従い適切に対応します。",
  },
  {
    title: "ポリシーの変更",
    body: "本ポリシーは、法令やサービス内容の変更に応じて改定する場合があります。変更後の内容は本ウェブサイトに掲載します。",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 py-20 sm:py-28"><div className="mx-auto max-w-5xl px-4 sm:px-6"><p className="text-sm font-semibold text-blue-700">PRIVACY</p><h1 className="mt-4 text-4xl font-bold text-gray-950 sm:text-5xl">プライバシーポリシー</h1><p className="mt-5 text-lg text-gray-600">Algion株式会社は、取得する情報を目的に必要な範囲で適切に取り扱います。</p><p className="mt-4 text-sm text-gray-500">最終改定日：2026年7月19日</p></div></section>
      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-lg border border-gray-200 bg-white px-6 py-2 sm:px-10">
            {sections.map((section) => (
              <section key={section.title} className="border-b border-gray-200 py-8 last:border-b-0">
                <h2 className="text-xl font-bold text-gray-950">{section.title}</h2>
                <p className="mt-4 leading-relaxed text-gray-600">{section.body}</p>
                {section.items && <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
              </section>
            ))}
            <section className="py-8"><h2 className="text-xl font-bold text-gray-950">お問い合わせ窓口</h2><p className="mt-4 text-gray-600">本ポリシーに関するお問い合わせは、<Link href="/contact" className="font-semibold text-blue-700 underline">お問い合わせフォーム</Link>よりご連絡ください。</p></section>
          </div>
        </div>
      </section>
    </div>
  );
}
