"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    position: '',
    message: '',
    privacy: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.company || !formData.position || !formData.message || !formData.privacy) {
      alert('必須項目をすべて入力してください。');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          position: formData.position,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // フォームをリセット
        setFormData({
          name: '',
          email: '',
          company: '',
          position: '',
          message: '',
          privacy: false
        });
        alert('お問い合わせを送信しました。ありがとうございます。確認メールをお送りしましたのでご確認ください。');
      } else {
        alert(result.error || 'エラーが発生しました。');
      }
    } catch {
      alert('ネットワークエラーが発生しました。時間をおいて再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-32 lg:py-48 pt-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50/30"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-green-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-8xl font-bold text-black mb-8 tracking-tight leading-tight">
            お問い合わせ
          </h1>
          <p className="text-xl lg:text-3xl text-gray-900 mb-12 max-w-5xl mx-auto font-light leading-relaxed">
            Algionのサービスに関するご質問やご相談、取材のお申し込みはこちらからお気軽にご連絡ください。
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-black mb-6 tracking-tight">お問い合わせフォーム</h2>
            <p className="text-xl text-gray-700 font-light">以下のフォームより必要事項をご入力の上、「送信」ボタンを押してください。</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-elegant border border-black/5 space-y-8">
            <div className="space-y-8">
              <div>
                <div className="block text-lg font-semibold text-black mb-3">お名前 <span className="text-red-500">*</span></div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border-2 border-black/10 rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white text-black placeholder-gray-400"
                  placeholder="山田 太郎"
                />
              </div>

              <div>
                <div className="block text-lg font-semibold text-black mb-3">メールアドレス <span className="text-red-500">*</span></div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border-2 border-black/10 rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white text-black placeholder-gray-400"
                  placeholder="example@company.com"
                />
              </div>

              <div>
                <div className="block text-lg font-semibold text-black mb-3">会社名 <span className="text-red-500">*</span></div>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full border-2 border-black/10 rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white text-black placeholder-gray-400"
                  placeholder="株式会社Example"
                />
              </div>

              <div>
                <div className="block text-lg font-semibold text-black mb-3">所属部署・役職 <span className="text-red-500">*</span></div>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full border-2 border-black/10 rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white text-black placeholder-gray-400"
                  placeholder="営業部・マネージャー"
                />
              </div>

              <div>
                <div className="block text-lg font-semibold text-black mb-3">お問い合わせ内容 <span className="text-red-500">*</span></div>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full border-2 border-black/10 rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white text-black placeholder-gray-400 resize-none"
                  placeholder="〇〇業界におけるAI導入事例について詳細をお伺いしたいです。"
                />
              </div>

              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={formData.privacy}
                  onChange={(e) => setFormData({...formData, privacy: e.target.checked})}
                  className="mt-1 w-5 h-5 rounded border-2 border-black/20 text-blue-600 focus:ring-blue-500"
                />
                <div className="text-lg text-gray-700">
                  <Link 
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-700 underline font-semibold"
                  >
                    プライバシーポリシー
                  </Link>
                  に同意する <span className="text-red-500">*</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform ${
                  isSubmitting 
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-black to-gray-800 text-white hover:shadow-elegant-hover hover:-translate-y-1'
                }`}
              >
                {isSubmitting ? '送信中...' : '送信する'}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}