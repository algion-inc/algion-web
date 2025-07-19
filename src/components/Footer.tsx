"use client";

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12 md:items-start">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold tracking-tight">Algion</h3>
            <p className="text-white/70 text-lg font-light leading-relaxed">
              データとアルゴリズムで<br />人々のビジョンを実現する
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-xl tracking-tight">ナビゲーション</h4>
            <div className="space-y-3">
              <Link href="/" className="block text-white/70 hover:text-white transition-colors duration-300 font-medium">ホーム</Link>
              <Link href="/services" className="block text-white/70 hover:text-white transition-colors duration-300 font-medium">サービス</Link>
              <Link href="/media" className="block text-white/70 hover:text-white transition-colors duration-300 font-medium">メディア</Link>
              <Link href="/about" className="block text-white/70 hover:text-white transition-colors duration-300 font-medium">会社情報</Link>
              <Link href="/contact" className="block text-white/70 hover:text-white transition-colors duration-300 font-medium">お問い合わせ</Link>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-xl tracking-tight">法的事項</h4>
            <div className="space-y-3">
              <Link href="/privacy" className="block text-white/70 hover:text-white transition-colors duration-300 font-medium">プライバシーポリシー</Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/50 font-light">© 2025 Algion Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;