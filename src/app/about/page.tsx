import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "会社情報 | Algion株式会社",
  description: "Algion株式会社の会社概要、代表プロフィール、Vision・Missionをご紹介します。",
  alternates: { canonical: "/about" },
};

const company = [
  ["会社名", "Algion株式会社"],
  ["代表者", "代表取締役CEO 岡本 秀明"],
  ["設立日", "2025年6月10日"],
  ["所在地", "〒107-0062 東京都港区南青山3-1-36 青山丸竹ビル6F"],
  ["資本金", "1,000,000円"],
  ["事業内容", "AI活用構想・評価設計、PoC開発、本番実装・運用設計、技術顧問"],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-blue-700">ABOUT ALGION</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-950 sm:text-5xl lg:text-6xl">テクノロジーを価値へ変える。</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Algionは、業務理解、AI設計、ソフトウェア実装、評価を一貫して担い、AI活用の構想から本番運用・継続改善までを支援します。
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-950 sm:text-4xl">会社概要</h2>
          <dl className="mt-10 overflow-hidden rounded-lg border border-gray-200 bg-white">
            {company.map(([label, value]) => (
              <div key={label} className="grid gap-2 border-b border-gray-200 px-6 py-5 last:border-b-0 sm:grid-cols-[160px_1fr]">
                <dt className="font-semibold text-gray-500">{label}</dt>
                <dd className="text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[360px_1fr] lg:items-start">
            <Image src="/hideaki-okamoto-profile.jpg" alt="岡本秀明" width={720} height={960} className="aspect-[3/4] w-full max-w-[420px] rounded-lg object-cover" priority />
            <div>
              <p className="text-sm font-semibold text-blue-700">FOUNDER</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">岡本 秀明 / Hideaki Okamoto</h2>
              <p className="mt-2 font-semibold text-gray-700">代表取締役CEO / AI & Software Engineer</p>
              <div className="mt-8 space-y-5 leading-relaxed text-gray-600">
                <p>法政大学大学院にて機械学習およびコンピュータビジョンの研究に取り組み、修士号を取得。在学中にIEEE BigDataで論文発表。</p>
                <p>2021年からソフトバンク株式会社に機械学習エンジニアとして在籍。AIプロダクトの研究開発とソフトウェア実装に携わり、高市場価値AI人材に認定され、リーダー／係長級へ飛び級昇進。</p>
                <p>2023年よりPayPay株式会社にSenior Software Engineer, Machine Learningとして参画。現在はFDEとしてAIエージェントの開発を主導。</p>
                <p>並行して、東京大学松尾研究室発の株式会社AlmondoをはじめとするAIスタートアップで、機械学習エンジニア、ソフトウェアエンジニア、プロジェクトマネージャーとして活動。</p>
                <p>2025年6月にAlgion株式会社を設立。機械学習とソフトウェア開発の両面から、業務理解、技術検証、本番実装、運用改善まで支援しています。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="rounded-lg border border-gray-200 bg-white p-8">
            <Eye className="text-blue-600" size={28} />
            <p className="mt-6 text-sm font-semibold text-gray-500">VISION</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-950">人々の可能性を最大限に引き出す</h2>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-8">
            <Target className="text-cyan-600" size={28} />
            <p className="mt-6 text-sm font-semibold text-gray-500">MISSION</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-950">テクノロジーを価値に変え、人々の創造と成長を加速させる</h2>
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">AI開発について相談する</h2>
          <p className="mt-5 text-lg text-white/65">構想段階からご相談いただけます。</p>
          <Link href="/contact" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-7 py-3 font-semibold text-black hover:bg-cyan-50">無料相談を申し込む <ArrowRight className="ml-2" size={18} /></Link>
        </div>
      </section>
    </div>
  );
}
