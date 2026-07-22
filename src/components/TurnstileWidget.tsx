"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const LOCAL_TEST_SITE_KEY = "1x00000000000000000000AA";

type TurnstileOptions = {
  sitekey: string;
  action: string;
  theme: "light";
  size: "flexible";
  language: string;
  appearance: "interaction-only";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileWidgetProps = {
  onTokenChange: (token: string) => void;
  onError: () => void;
  resetKey: number;
};

export default function TurnstileWidget({ onTokenChange, onError, resetKey }: TurnstileWidgetProps) {
  const configuredSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const [siteKey, setSiteKey] = useState(configuredSiteKey);
  const [scriptReady, setScriptReady] = useState(false);
  const [verified, setVerified] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
    onErrorRef.current = onError;
  }, [onError, onTokenChange]);

  useEffect(() => {
    if (configuredSiteKey) return;

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal) setSiteKey(LOCAL_TEST_SITE_KEY);
  }, [configuredSiteKey]);

  useEffect(() => {
    if (window.turnstile) setScriptReady(true);
  }, []);

  useEffect(() => {
    if (!scriptReady || !siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: "contact_form",
      theme: "light",
      size: "flexible",
      language: "ja",
      appearance: "interaction-only",
      callback: (token) => {
        setVerified(true);
        onTokenChangeRef.current(token);
      },
      "expired-callback": () => {
        setVerified(false);
        onTokenChangeRef.current("");
      },
      "error-callback": () => {
        setVerified(false);
        onTokenChangeRef.current("");
        onErrorRef.current();
      },
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady, siteKey]);

  useEffect(() => {
    if (!resetKey || !widgetIdRef.current || !window.turnstile) return;
    setVerified(false);
    window.turnstile.reset(widgetIdRef.current);
    onTokenChangeRef.current("");
  }, [resetKey]);

  if (!siteKey) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950" role="status">
        セキュリティ確認を読み込めません。時間をおいて再度お試しください。
      </p>
    );
  }

  return (
    <>
      <Script src={TURNSTILE_SCRIPT_URL} strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
      <div
        ref={containerRef}
        className={verified ? "h-0 w-full overflow-hidden" : "min-h-[65px] w-full"}
        aria-label="不正送信防止のためのセキュリティ確認"
      />
      {verified && <p className="text-sm text-gray-500">セキュリティ確認済み</p>}
    </>
  );
}
