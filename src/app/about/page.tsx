import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: '会社情報 | Algion株式会社',
  description: 'Algion株式会社の会社概要、代表プロフィール、Vision・Missionについて',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 tracking-tight">
            Algionについて
          </h1>
          <p className="text-xl lg:text-2xl text-gray-900 mb-8 max-w-4xl mx-auto">
            テクノロジーを価値に変え、人々の創造と成長を加速させる
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-16 text-center">会社概要</h2>
          
          <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
            <div className="space-y-0">
              {[
                { label: "会社名", value: "Algion株式会社" },
                { label: "代表者", value: "代表取締役CEO 岡本 秀明" },
                { label: "設立日", value: "2025年6月10日" },
                { label: "所在地", value: "〒107-0062 東京都港区南青山3-1-36 青山丸竹ビル6F" },
                { label: "資本金", value: "1,000,000円" },
                { label: "事業内容", value: "法人向けAIソリューション、AIコンサルティング、SaaSプロダクト" }
              ].map((item, index) => (
                <div key={index} className={`p-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${index < 5 ? 'border-b border-gray-200' : ''}`}>
                  <dt className="font-semibold text-black mb-2">{item.label}</dt>
                  <dd className="text-gray-700">{item.value}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CEO Profile */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-16 text-center">代表プロフィール</h2>
          
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <div className="relative">
                  <Image 
                    src="/hideaki-okamoto-profile.jpg"
                    alt="岡本 秀明"
                    width={400}
                    height={533}
                    className="w-full max-w-sm mx-auto rounded-2xl shadow-elegant object-cover aspect-[3/4]"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-3xl font-bold text-black mb-6">岡本 秀明 / Hideaki Okamoto</h3>
                <div className="space-y-4 text-gray-700">
              <p>法政大学大学院にて機械学習およびコンピュータビジョンの研究に取り組み、修士号取得。在学中にIEEE BigDataに論文発表。</p>
              
              <p>2021年4月〜2023年10月、ソフトバンク株式会社に機械学習エンジニアとして在籍。高市場価値AI人材に認定され、リーダー/係長級へ飛び級昇進を達成。</p>
              
              <p>2023年11月よりPayPay株式会社にSenior Software Engineer, Machine Learningとして参画。AIを活用したプロダクトの開発をはじめ、ローカルLLM/RAGやAIエージェントの開発を主導。</p>
              
              <p>並行して、東京大学松尾研究室発の株式会社Almondoをはじめとする複数のAIスタートアップにおいて、機械学習エンジニア、ソフトウェアエンジニア、プロジェクトマネージャーとして幅広く活動。</p>
              
              <p>2025年6月にAlgion株式会社を設立し、代表取締役CEOに就任。法人向けAIソリューション、AIコンサルティング、SaaSプロダクトを展開し、「あらゆる人々が創造と成長に時間を注げる社会」の実現を目指す。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-16 text-center">AlgionのVision & Mission</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-elegant">
              <div className="flex items-center mb-4">
                <Eye className="mr-3 text-black" size={32} />
                <h3 className="text-2xl font-bold text-black">Vision</h3>
              </div>
              <p className="text-gray-700 text-lg">人々の可能性を最大限に引き出す</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-elegant">
              <div className="flex items-center mb-4">
                <Target className="mr-3 text-black" size={32} />
                <h3 className="text-2xl font-bold text-black">Mission</h3>
              </div>
              <p className="text-gray-700 text-lg">テクノロジーを価値に変え、人々の創造と成長を加速させる</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">Algionについてのお問い合わせ</h2>
          <p className="text-xl text-gray-700 mb-8">
            Algionに関するお問い合わせやご相談は、お気軽にご連絡ください。
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