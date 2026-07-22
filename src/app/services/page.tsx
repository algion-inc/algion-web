import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardList,
  FlaskConical,
  MessagesSquare,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "サービス・目安料金 | Algion株式会社",
  description: "AI構想整理、PoC開発・評価、本開発・運用設計、技術顧問・継続改善の内容、成果物、目安料金をご案内します。",
  alternates: { canonical: "/services" },
};

const services = [
  {
    icon: ClipboardList,
    title: "業務・AI設計",
    price: "30〜50万円",
    period: "2〜4週",
    forWhom: "AIをどこに使うか、何を検証するかが決まっていないチーム",
    actions: ["業務・データ・制約の整理", "AI・ルール・人の役割分担", "評価方針とPoC範囲の設計"],
    outputs: "業務整理、AIの役割、評価方針、PoC計画",
    boundary: "方針と検証計画を納品するサービスです。ソフトウェア実装は含みません。",
  },
  {
    icon: FlaskConical,
    title: "PoC開発・評価",
    price: "150万円〜",
    period: "1〜2ヶ月",
    forWhom: "技術・業務の成立性を、動くものと評価結果で判断したいチーム",
    actions: ["検証用プロトタイプの開発", "評価データ・評価指標の設計", "品質・速度・コスト等の比較"],
    outputs: "試作、評価セット、評価結果、次段階の判断材料",
    boundary: "合意した検証論点が対象です。データ収集、大規模なデータ整備、本番運用は標準範囲に含みません。",
  },
  {
    icon: Wrench,
    title: "本開発・運用設計",
    price: "個別見積",
    period: "伴走は月50万円〜",
    forWhom: "PoCを既存業務・システムへ組み込み、継続利用できる形にしたいチーム",
    actions: ["API・DB・クラウドへの実装", "ログ・監視・安全性の設計", "回帰評価・更新・切り戻し設計"],
    outputs: "本番実装、運用設計、評価・監視基盤、技術ドキュメント",
    boundary: "月額伴走は稼働上限付きです。フルタイム常駐、24時間監視、SLA、運用代行は含みません。",
  },
  {
    icon: MessagesSquare,
    title: "技術顧問・継続改善",
    price: "月10〜30万円",
    period: "月次契約",
    forWhom: "社内チームの設計・実装判断と、品質・コスト改善を継続的に支えたいチーム",
    actions: ["設計・コードレビュー", "モデル・評価・コストの相談", "改善テーマと優先順位の整理"],
    outputs: "レビュー記録、技術助言、改善提案",
    boundary: "月10万円の枠は相談・定例レビュー等の上限を定め、実装を含みません。",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-gray-950 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-cyan-400">SERVICES</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            構想整理から本番実装まで、<br />必要な段階から。
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70 sm:text-xl">
            業務と技術をつなぎ、次の意思決定に必要な成果物をフェーズごとに提供します。初回相談は無料です。
          </p>
          <Link href="/contact" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-7 py-3 font-semibold text-black hover:bg-cyan-50">
            無料相談を申し込む <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-700">SERVICE MENU</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">4つのご支援</h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              無料相談では適合性と次の進め方を整理します。調査・設計・開発を伴う工程は、目的と成果物を定めてご提案します。
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {services.map(({ icon: Icon, ...service }) => (
              <article key={service.title} className="flex flex-col rounded-lg border border-gray-200 bg-white p-7 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Icon className="text-blue-600" size={28} />
                    <h3 className="mt-5 text-2xl font-bold text-gray-950">{service.title}</h3>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-2xl font-bold text-gray-950">{service.price}</p>
                    <p className="mt-1 text-sm text-gray-500">{service.period}</p>
                  </div>
                </div>
                <p className="mt-6 font-semibold leading-relaxed text-gray-800">{service.forWhom}</p>
                <ul className="mt-5 space-y-3">
                  {service.actions.map((action) => (
                    <li key={action} className="flex gap-3 text-gray-600"><Check className="mt-0.5 shrink-0 text-cyan-600" size={18} />{action}</li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-gray-200 pt-5">
                  <p className="text-sm font-semibold text-gray-950">主な成果物</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{service.outputs}</p>
                  <p className="mt-4 text-sm leading-relaxed text-gray-500">{service.boundary}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-blue-200 bg-blue-50 p-6 text-sm leading-relaxed text-gray-700">
            <p className="font-semibold text-gray-950">価格について</p>
            <p className="mt-2">表示価格は税別の目安です。要件・データ状況・開発範囲に応じて個別にお見積もりします。クラウド、外部API、ライセンス等の利用料は、特記がない限り別途です。</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-blue-700">HOW WE WORK</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">進め方</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {[
              ["01", "無料相談", "相談内容と適合性を確認"],
              ["02", "設計", "業務・データ・評価を整理"],
              ["03", "検証", "試作と評価で成立性を判断"],
              ["04", "実装・改善", "使えるものを本番へ接続"],
            ].map(([step, title, text]) => (
              <div key={step} className="border-t-2 border-blue-600 pt-5">
                <p className="text-sm font-bold text-blue-600">{step}</p>
                <h3 className="mt-3 text-xl font-bold text-gray-950">{title}</h3>
                <p className="mt-2 text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">依頼する範囲が決まっていなくても大丈夫です。</h2>
          <p className="mt-5 text-lg text-white/65">業務と制約を伺い、最初に整理すべきことからご提案します。</p>
          <Link href="/contact" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-7 py-3 font-semibold text-black hover:bg-cyan-50">
            無料相談を申し込む <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
