import Link from "next/link";
import { site } from "@/data/site";

// 모바일 하단 고정 3버튼: 전화 / 사진상담 / 지역찾기 (스펙 13)
export default function MobileBottomCTA() {
  return (
    <nav className="mobile-cta" aria-label="빠른 상담">
      <a className="call" href={site.phoneHref}>
        <span aria-hidden>📞</span>
        전화 상담
      </a>
      <Link href="/contact/">
        <span aria-hidden>📷</span>
        사진 상담
      </Link>
      <Link href="/area/">
        <span aria-hidden>📍</span>
        지역 찾기
      </Link>
    </nav>
  );
}
