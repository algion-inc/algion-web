import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | Algion株式会社',
  description: 'Algion株式会社のプライバシーポリシー',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-32 lg:py-40 pt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 tracking-tight">
            プライバシーポリシー
          </h1>
          <p className="text-xl lg:text-2xl text-gray-900 mb-8 max-w-4xl mx-auto">
            Algion株式会社は、<br />お客様の個人情報を適切に取り扱い、その保護に努めます。
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-2xl shadow-elegant space-y-8">
            <div>
              <h2 className="text-xl font-bold text-black mb-4">個人情報の取得</h2>
              <p className="text-gray-700 mb-4">当社は、お客様から以下の情報を取得する場合があります。</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>お名前</li>
                <li>メールアドレス</li>
                <li>会社名</li>
                <li>所属部署・役職</li>
                <li>お問い合わせ内容</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-black mb-4">個人情報の利用目的</h2>
              <p className="text-gray-700 mb-4">収集した情報は以下の目的で利用します。</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>お問い合わせやご相談への対応</li>
                <li>取材対応</li>
                <li>当社サービスの改善および案内</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-black mb-4">AI特有のデータ利用方針</h2>
              <p className="text-gray-700 mb-4">当社は、お客様から提供された個人情報や法人情報をAIモデルの学習や改善に利用することはありません。</p>
              <p className="text-gray-700">AIモデルの改善等の目的でデータを利用する場合には、事前にお客様から明確な同意を取得いたします。</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-black mb-4">個人情報の安全管理措置</h2>
              <p className="text-gray-700 mb-4">当社は、取得した個人情報の漏洩、滅失、き損などを防止するため、以下の措置を講じます。</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>個人情報取扱いに関する基本方針の策定</li>
                <li>個人情報の取扱責任者および体制の整備</li>
                <li>情報アクセス権限の制限および管理</li>
                <li>セキュリティ対策ソフトウェアの導入、定期的な更新</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-black mb-4">個人情報の第三者への提供</h2>
              <p className="text-gray-700 mb-4">当社は、以下の場合を除き、お客様の同意なしに個人情報を第三者に提供しません。</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>法令に基づく場合</li>
                <li>人の生命、身体、財産保護のために必要がある場合で、お客様の同意取得が困難なとき</li>
                <li>公衆衛生や児童の健全育成のために特に必要がある場合</li>
                <li>国や地方公共団体からの法令に基づく協力要請があり、同意取得が困難な場合</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-black mb-4">個人情報の開示・訂正・削除について</h2>
              <p className="text-gray-700">お客様は、ご自身の個人情報の開示・訂正・削除を求めることが可能です。開示・訂正・削除をご希望の場合は、お問い合わせフォームよりご連絡ください。</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-black mb-4">プライバシーポリシーの変更</h2>
              <p className="text-gray-700">当社は、本ポリシーを必要に応じて改定することがあります。変更があった場合は、本ウェブサイトに掲載いたします。</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-black mb-4">お問い合わせ窓口</h2>
              <p className="text-gray-700">プライバシーポリシーに関するお問い合わせは、
                <Link 
                  href="/contact"
                  className="text-blue-600 hover:text-blue-700 underline ml-1"
                >
                  お問い合わせフォーム
                </Link>
                よりご連絡ください。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}