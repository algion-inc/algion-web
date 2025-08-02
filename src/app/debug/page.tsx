"use client";

import { useEffect } from 'react';

export default function DebugPage() {
  useEffect(() => {
    console.log('User Agent:', navigator.userAgent);
    console.log('Screen Width:', window.screen.width);
    console.log('Window Width:', window.innerWidth);
    console.log('Device Pixel Ratio:', window.devicePixelRatio);
    
    // CSSが読み込まれているかチェック
    const styles = document.styleSheets;
    console.log('Stylesheets loaded:', styles.length);
    
    for (let i = 0; i < styles.length; i++) {
      try {
        console.log(`Stylesheet ${i}:`, styles[i].href || 'inline');
      } catch (e) {
        console.log(`Stylesheet ${i}: Cannot access (CORS)`);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-black mb-8">デバッグページ</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Tailwind CSSテスト</h2>
          <p className="text-blue-600">この文字が青色ならTailwindが機能しています</p>
          <div className="mt-2 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded"></div>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">デバイス情報</h2>
          <p>User Agent: <span className="text-sm font-mono">{typeof window !== 'undefined' ? navigator.userAgent : 'SSR'}</span></p>
        </div>
      </div>
    </div>
  );
}