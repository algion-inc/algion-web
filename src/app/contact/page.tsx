import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "無料相談・お問い合わせ | Algion株式会社",
  description: "AI活用構想、PoC開発・評価、本番実装に関する無料相談を受け付けています。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-gray-950 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-cyan-400">CONTACT</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">無料相談を申し込む</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70 sm:text-xl">
            内容を確認のうえ、必要に応じて30分ほどオンラインでお話しします。相談範囲が決まっていなくても構いません。
          </p>
        </div>
      </section>
      <ContactForm />
    </div>
  );
}
