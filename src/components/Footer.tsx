import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-3xl font-bold">Algion</p>
            <p className="mt-4 max-w-sm leading-relaxed text-white/65">
              構想段階のAIを、現場で使える仕組みへ。
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/45">NAVIGATION</p>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href="/services" className="text-white/70 hover:text-white">サービス</Link>
              <Link href="/media" className="text-white/70 hover:text-white">メディア</Link>
              <Link href="/about" className="text-white/70 hover:text-white">会社情報</Link>
              <Link href="/contact" className="text-white/70 hover:text-white">お問い合わせ</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/45">LEGAL</p>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href="/privacy" className="text-white/70 hover:text-white">プライバシーポリシー</Link>
            </div>
          </div>
        </div>
        <p className="pt-8 text-sm text-white/45">© {new Date().getFullYear()} Algion株式会社</p>
      </div>
    </footer>
  );
}
