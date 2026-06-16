import Link from "next/link";
import { site } from "@/data/site";

// 페이지 하단 공통 CTA (스펙: 각 페이지 전화 CTA)
export default function CtaBlock({ label }: { label?: string }) {
  return (
    <div className="glass" style={{ padding: 28, textAlign: "center", marginTop: 36 }}>
      <h3 style={{ margin: "0 0 8px", fontSize: "1.25rem" }}>
        {label ?? "증상과 현장 사진을 확인한 뒤 필요한 작업만 안내합니다"}
      </h3>
      <p className="muted" style={{ margin: "0 0 18px" }}>
        {site.emergency} · {site.hours}
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <a className="btn btn--cta" href={site.phoneHref}>
          📞 전화 상담 {site.phone}
        </a>
        <Link className="btn btn--ghost" href="/contact/">
          📷 사진 보내기
        </Link>
        <Link className="btn btn--ghost" href="/price/">
          💰 비용 기준 보기
        </Link>
      </div>
    </div>
  );
}
