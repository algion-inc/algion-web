"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-2xl border-b border-white/20 shadow-elegant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          <div className="flex items-center">
            <Link href="/" className="group">
              <div className="bg-black rounded-xl overflow-hidden group-hover:-translate-y-1 transition-all duration-300 shadow-elegant group-hover:shadow-elegant-hover">
                <div className="px-4 sm:px-8 py-2 sm:py-3">
                  <span className="text-white font-bold text-2xl sm:text-3xl tracking-tight text-hierarchy-primary">Algion</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation - Always visible */}
          <div className="flex items-center space-x-4 sm:space-x-8 lg:space-x-16">
            <Link 
              href="/"
              className={`text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 relative ${
                pathname === '/' 
                  ? 'text-white text-hierarchy-primary after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full' 
                  : 'text-white text-hierarchy-tertiary hover:text-hierarchy-primary'
              }`}
            >
              ホーム
            </Link>
            <Link 
              href="/services"
              className={`text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 relative ${
                pathname === '/services' 
                  ? 'text-white text-hierarchy-primary after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full' 
                  : 'text-white text-hierarchy-tertiary hover:text-hierarchy-primary'
              }`}
            >
              サービス
            </Link>
            <Link 
              href="/media"
              className={`text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 relative ${
                pathname === '/media' 
                  ? 'text-white text-hierarchy-primary after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full' 
                  : 'text-white text-hierarchy-tertiary hover:text-hierarchy-primary'
              }`}
            >
              メディア
            </Link>
            <Link 
              href="/about"
              className={`text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 relative ${
                pathname === '/about' 
                  ? 'text-white text-hierarchy-primary after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full' 
                  : 'text-white text-hierarchy-tertiary hover:text-hierarchy-primary'
              }`}
            >
              会社情報
            </Link>
            <Link 
              href="/contact"
              className="bg-gradient-to-r from-white via-gray-100 to-white text-black px-4 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:shadow-elegant-hover hover:shadow-white/25 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">お問い合わせ</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;