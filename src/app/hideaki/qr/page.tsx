import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "QR | 岡本 秀明",
  description: "岡本秀明のデジタル名刺を開くQRコードです。",
  alternates: { canonical: "/hideaki/qr/" },
  robots: { index: false, follow: false },
};

export default function HideakiQrPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070b12] px-5 py-10 text-white">
      <div className="w-full max-w-sm text-center">
        <p className="text-2xl font-bold">Algion</p>
        <h1 className="mt-7 text-3xl font-bold">岡本 秀明</h1>
        <p className="mt-2 text-sm text-white/55">Digital Business Card</p>
        <div className="mx-auto mt-8 aspect-square w-full rounded-lg bg-white p-5 shadow-2xl">
          <Image src="/hideaki-okamoto-qr.png" alt="岡本秀明のデジタル名刺を開くQRコード" width={1024} height={1024} priority className="h-full w-full" />
        </div>
        <p className="mt-6 text-sm leading-relaxed text-white/60">カメラで読み取ると<br />デジタル名刺が開きます</p>
        <Link href="/hideaki" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold hover:bg-white/10"><ArrowLeft className="mr-2" size={18} />名刺に戻る</Link>
      </div>
    </main>
  );
}
