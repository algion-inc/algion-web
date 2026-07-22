import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-gray-950 py-20 text-white">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <p className="text-sm font-semibold text-cyan-400">404</p>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">ページが見つかりません</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">
          URLが変更されたか、ページが削除された可能性があります。
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 font-semibold text-black hover:bg-cyan-50">
            <ArrowLeft className="mr-2" size={18} />ホームへ戻る
          </Link>
          <Link href="/services" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-7 py-3 font-semibold text-white hover:bg-white/10">
            サービスを見る<ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
