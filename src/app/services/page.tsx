import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'サービス | Algion株式会社',
  description: 'Algionの法人向けAIソリューション・AIコンサルティング・SaaSプロダクトが企業課題を解決します。',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-32 lg:py-48 pt-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50/30"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-8xl font-bold text-black mb-8 tracking-tight leading-tight">
            AIでビジネスを
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              次のステージへ
            </span>
          </h1>
          <p className="text-xl lg:text-3xl text-gray-900 mb-12 max-w-5xl mx-auto font-light leading-relaxed">
            Algionの法人向けAIソリューション、AIコンサルティング、<br />SaaSプロダクトが企業課題を解決します。
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-elegant-hover hover:-translate-y-1 transition-all duration-300 transform"
          >
            お問い合わせ
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-16 text-center">提供するサービス</h2>
          
          {/* 法人向けAIソリューション */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-black mb-8 flex items-center">
              <span className="mr-3"></span>法人向けAIソリューション
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "生成AI導入基盤", desc: "各社LLMサービスやローカルLLMの導入と運用基盤、セキュリティ・権限管理を提供" },
                { title: "AIナレッジ検索", desc: "社内外ドキュメントのAI検索・再生成・RAG活用" },
                { title: "文書・会議サポートAI", desc: "ドキュメント・議事録の自動生成、音声文字起こし、要約・タスク抽出" },
                { title: "業務自動化AIエージェント", desc: "調査分析・戦略策定支援・コード生成などの業務を自動化するAIエージェント" },
                { title: "画像認識AI", desc: "製造ライン検品自動化・帳票OCR処理・店舗棚割チェックなどの画像認識ソリューション" },
                { title: "需要予測・在庫最適化AI", desc: "需要予測による欠品防止・在庫圧縮、小売・物流向けソリューション" },
                { title: "業界特化型生成AI", desc: "保険査定支援・医療問診サマリ化・不動産レコメンドAIなど業界特有業務向け生成AI" }
              ].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-elegant">
                  <h4 className="font-bold text-black mb-3">{service.title}</h4>
                  <p className="text-gray-700 text-sm">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AIコンサルティング */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-black mb-8 flex items-center">
              <span className="mr-3"></span>AIコンサルティング
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "AI戦略・導入支援コンサルティング", desc: "AI導入ロードマップ策定、ROI評価、実施計画立案" },
                { title: "データ戦略コンサルティング", desc: "AI導入のためのデータ設計、データ収集戦略、品質管理支援" },
                { title: "教育支援・AI人材育成", desc: "法人向けAI研修、ハンズオン教育、教材作成・提供、社内AI人材育成支援" },
                { title: "研究開発・R&Dパートナー", desc: "最新AI技術検証、共同研究、業界・顧客向けカスタムAIモデル開発" }
              ].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-elegant">
                  <h4 className="font-bold text-black mb-3">{service.title}</h4>
                  <p className="text-gray-700 text-sm">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SaaSプロダクト */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-black mb-8 flex items-center">
              <span className="mr-3"></span>SaaSプロダクト
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "生成AIマネージドプラットフォーム", desc: "Algion管理のクラウド型生成AIインフラ。インフラ運用不要で生成AIを活用可能。β版リリース準備中" },
                { title: "運用・MLOpsサポート", desc: "モデル運用管理・精度監視・再学習など継続運用支援" }
              ].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-elegant">
                  <h4 className="font-bold text-black mb-3">{service.title}</h4>
                  <p className="text-gray-700 text-sm">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-16 text-center">Algionの提供価値</h2>
          
          <div className="space-y-12">
            {[
              {
                title: "高度な技術力と豊富な実績",
                desc: "国際学会での論文発表や受賞経験をはじめ、ソフトバンクでの飛び級昇進、PayPay、ソニー、IBM、東大松尾研発AIスタートアップ等での実務経験を持つメンバーが在籍。研究開発から社会実装までの幅広い経験に基づき、高品質なAIを提供します。"
              },
              {
                title: "課題抽出から運用まで一気通貫",
                desc: "お客様のビジョンと業務ニーズを的確に捉え、要件定義・PoC・開発・運用改善までを一貫して支援。導入後も継続的に改善をサポートし、現場でのAIの定着と活用を促進します。"
              },
              {
                title: "柔軟でスピーディなAI導入",
                desc: "技術動向やビジネス環境の変化に柔軟に対応できる設計思想で、迅速な検証と改善を繰り返し早期の成果創出を実現します。小さく始めて確実に成果を拡大するアプローチで、お客様のビジネス成長を支援します。"
              }
            ].map((value, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-black mb-4">
                  <span className="mr-3">{"①②③"[index]}</span> {value.title}
                </h3>
                <p className="text-gray-700">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">AlgionのAIサービスについて</h2>
          <p className="text-xl text-gray-700 mb-8">
            AlgionのAIサービスに関するご質問・資料請求はお気軽にどうぞ。
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium text-lg hover:opacity-80 transition-opacity"
          >
            お問い合わせフォームへ
          </Link>
        </div>
      </section>
    </div>
  );
}