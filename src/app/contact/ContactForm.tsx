"use client";

import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { getTrafficContext } from "@/lib/analytics";
import TurnstileWidget from "@/components/TurnstileWidget";

type FormData = {
  name: string;
  email: string;
  company: string;
  position: string;
  consultationStage: string;
  message: string;
  dataStatus: string;
  startTiming: string;
  budget: string;
  website: string;
  privacy: boolean;
};

const initialForm: FormData = {
  name: "",
  email: "",
  company: "",
  position: "",
  consultationStage: "",
  message: "",
  dataStatus: "",
  startTiming: "",
  budget: "",
  website: "",
  privacy: false,
};

const fieldClass = "mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const setField = (field: keyof FormData, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleTurnstileError = useCallback(() => {
    setStatus({ type: "error", message: "セキュリティ確認に失敗しました。再度お試しください。" });
  }, []);

  const handleText = (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setField(field, event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!formData.privacy) {
      setStatus({ type: "error", message: "プライバシーポリシーへの同意が必要です。" });
      return;
    }

    if (!turnstileToken) {
      setStatus({ type: "error", message: "セキュリティ確認の完了後に送信してください。" });
      return;
    }

    setIsSubmitting(true);
    const traffic = getTrafficContext();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...traffic, turnstileToken }),
      });
      const responseText = await response.text();
      let result: { message?: string; error?: string } = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("送信できませんでした。時間をおいて再度お試しください。");
      }

      if (!response.ok) {
        throw new Error(result.error || "送信できませんでした。時間をおいて再度お試しください。");
      }

      setFormData(initialForm);
      setStatus({ type: "success", message: result.message || "お問い合わせを受け付けました。" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "ネットワークエラーが発生しました。";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
      setTurnstileToken("");
      setTurnstileResetKey((current) => current + 1);
    }
  };

  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-950">ご相談内容をお聞かせください</h2>
          <p className="mt-5 leading-relaxed text-gray-600">現在の検討状況やお困りごとをお聞かせください。内容を拝見し、次の進め方をご連絡します。関連資料がある場合は、ご相談後に安全な共有方法をご案内します。</p>
          <div className="mt-8 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
            <AlertTriangle className="mt-0.5 shrink-0" size={19} />
            <p><strong>機密情報は記載しないでください。</strong><br />詳細はご相談後、安全な方法で確認します。</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="font-semibold text-gray-900">お名前 <span className="text-red-600">*</span><input required maxLength={100} autoComplete="name" value={formData.name} onChange={handleText("name")} className={fieldClass} /></label>
            <label className="font-semibold text-gray-900">メールアドレス <span className="text-red-600">*</span><input required maxLength={254} type="email" autoComplete="email" value={formData.email} onChange={handleText("email")} className={fieldClass} /></label>
            <label className="font-semibold text-gray-900">会社名 <span className="text-red-600">*</span><input required maxLength={200} autoComplete="organization" value={formData.company} onChange={handleText("company")} className={fieldClass} /></label>
            <label className="font-semibold text-gray-900">部署・役職 <span className="text-sm font-normal text-gray-400">任意</span><input maxLength={150} autoComplete="organization-title" value={formData.position} onChange={handleText("position")} className={fieldClass} /></label>
          </div>

          <label className="mt-6 block font-semibold text-gray-900">現在の相談段階 <span className="text-red-600">*</span>
            <select required value={formData.consultationStage} onChange={handleText("consultationStage")} className={fieldClass}>
              <option value="">選択してください</option>
              <option>AIの活用場所から相談したい</option>
              <option>要件・評価方法を整理したい</option>
              <option>PoCを開発・評価したい</option>
              <option>本開発・運用へ進めたい</option>
              <option>技術顧問・開発パートナーを探している</option>
              <option>その他</option>
            </select>
          </label>

          <label className="mt-6 block font-semibold text-gray-900">ご相談内容・業務上の課題 <span className="text-red-600">*</span>
            <textarea required rows={7} maxLength={3000} value={formData.message} onChange={handleText("message")} className={`${fieldClass} resize-y`} placeholder="解決したい業務上の課題や、現在の検討状況をお書きください。" />
          </label>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <label className="font-semibold text-gray-900">データ状況 <span className="text-sm font-normal text-gray-400">任意</span><select value={formData.dataStatus} onChange={handleText("dataStatus")} className={fieldClass}><option value="">選択なし</option><option>利用可能なデータがある</option><option>一部ある・確認中</option><option>これから準備する</option><option>分からない</option></select></label>
            <label className="font-semibold text-gray-900">開始時期 <span className="text-sm font-normal text-gray-400">任意</span><select value={formData.startTiming} onChange={handleText("startTiming")} className={fieldClass}><option value="">選択なし</option><option>できるだけ早く</option><option>1〜3ヶ月以内</option><option>3ヶ月以降</option><option>未定</option></select></label>
            <label className="font-semibold text-gray-900">予算帯 <span className="text-sm font-normal text-gray-400">任意</span><select value={formData.budget} onChange={handleText("budget")} className={fieldClass}><option value="">選択なし</option><option>50万円未満</option><option>50〜150万円</option><option>150〜500万円</option><option>500万円以上</option><option>未定</option></select></label>
          </div>

          <div className="absolute left-[-9999px]" aria-hidden="true"><label>ウェブサイト<input tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleText("website")} /></label></div>

          <div className="mt-7">
            <TurnstileWidget onTokenChange={setTurnstileToken} onError={handleTurnstileError} resetKey={turnstileResetKey} />
          </div>

          <label className="mt-7 flex items-start gap-3 text-sm leading-relaxed text-gray-600">
            <input type="checkbox" checked={formData.privacy} onChange={(event) => setField("privacy", event.target.checked)} className="mt-1 size-5 shrink-0 accent-blue-600" />
            <span><Link href="/privacy" className="font-semibold text-blue-700 underline">プライバシーポリシー</Link>に同意する <span className="text-red-600">*</span></span>
          </label>

          {status && (
            <div role="status" aria-live="polite" className={`mt-6 flex gap-3 rounded-lg p-4 text-sm ${status.type === "success" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
              {status.type === "success" ? <CheckCircle2 className="shrink-0" size={19} /> : <AlertTriangle className="shrink-0" size={19} />}
              <p>{status.message}</p>
            </div>
          )}

          <button type="submit" disabled={isSubmitting || !turnstileToken} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-black px-7 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400">
            <Send className="mr-2" size={18} />{isSubmitting ? "送信中..." : "送信する"}
          </button>
        </form>
      </div>
    </section>
  );
}
