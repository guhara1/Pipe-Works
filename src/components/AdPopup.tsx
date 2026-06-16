"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

// 광고주 모집 팝업 배너 — 진입 시 6초간 노출 후 자동 닫힘(세션당 1회).
export default function AdPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // 세션당 1회만 노출 (페이지 이동마다 반복 노출 방지)
    if (sessionStorage.getItem("adPopupShown")) return;
    sessionStorage.setItem("adPopupShown", "1");
    setOpen(true);
    const t = setTimeout(() => setOpen(false), 6000); // 6초 후 자동 닫힘
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div className="ad-popup-overlay" role="dialog" aria-label="광고주 모집 안내" onClick={() => setOpen(false)}>
      <div className="ad-popup" onClick={(e) => e.stopPropagation()}>
        <button className="ad-popup__close" aria-label="닫기" onClick={() => setOpen(false)}>
          ×
        </button>
        <div className="ad-popup__icon" aria-hidden>
          📢
        </div>
        <h3 className="ad-popup__title">광고주 모집합니다</h3>
        <p className="ad-popup__desc">
          {site.name} 사이트에 광고·제휴를 원하시는 분은 텔레그램으로 문의해 주세요.
        </p>
        <a className="ad-popup__cta" href={site.adInquiry.telegram} target="_blank" rel="noopener noreferrer">
          ✈️ 텔레그램으로 광고문의
        </a>
        <div className="ad-popup__bar" aria-hidden />
      </div>
    </div>
  );
}
