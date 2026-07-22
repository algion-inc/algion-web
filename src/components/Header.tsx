"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "ホーム" },
  { href: "/services", label: "サービス" },
  { href: "/media", label: "メディア" },
  { href: "/about", label: "会社情報" },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setIsOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:h-24 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold sm:text-3xl" aria-label="Algion ホーム">
          Algion
        </Link>

        <nav className="hidden items-center gap-7 md:flex lg:gap-10" aria-label="メインナビゲーション">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`border-b py-2 text-sm font-semibold transition-colors lg:text-base ${
                isActive(item.href)
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-white/65 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-cyan-50 lg:px-6 lg:text-base"
          >
            無料相談を申し込む
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav id="mobile-navigation" className="border-t border-white/10 bg-black px-4 py-5 md:hidden" aria-label="モバイルナビゲーション">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-3 font-semibold ${isActive(item.href) ? "bg-white/10 text-white" : "text-white/70"}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="mt-3 rounded-lg bg-white px-4 py-3 text-center font-semibold text-black">
              無料相談を申し込む
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
