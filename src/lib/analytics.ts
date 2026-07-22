export type TrafficContext = {
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  landingPage: string;
};

export function getTrafficContext(): TrafficContext {
  if (typeof window === "undefined") {
    return { source: "direct", utmSource: "", utmMedium: "", utmCampaign: "", landingPage: "" };
  }

  const storageKey = "algion_first_touch";
  const stored = window.sessionStorage.getItem(storageKey);
  if (stored) {
    try {
      return JSON.parse(stored) as TrafficContext;
    } catch {
      window.sessionStorage.removeItem(storageKey);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const referrer = document.referrer ? new URL(document.referrer).hostname : "";
  const context: TrafficContext = {
    source: params.get("utm_source") || referrer || "direct",
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    landingPage: `${window.location.pathname}${window.location.search}`,
  };

  window.sessionStorage.setItem(storageKey, JSON.stringify(context));
  return context;
}
