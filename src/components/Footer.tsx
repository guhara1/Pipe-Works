import Link from "next/link";
import { site } from "@/data/site";
import { sidoList } from "@/data/regions";
import { featuredServiceSlugs, getService } from "@/data/services";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>{site.name}</h4>
            <p className="muted" style={{ margin: "0 0 10px" }}>
              {site.description}
            </p>
            <p className="muted mt-0">상담 시간: {site.hours}</p>
            <p className="muted mt-0">{site.emergency}</p>
            <a className="btn btn--cta" href={site.phoneHref} style={{ marginTop: 10 }}>
              📞 전화 상담 {site.phone}
            </a>
          </div>

          <div>
            <h4>대표 서비스</h4>
            <div className="footer-links">
              {featuredServiceSlugs.slice(0, 6).map((slug) => {
                const s = getService(slug);
                if (!s) return null;
                return (
                  <Link key={slug} href={`/service/${slug}/`}>
                    {s.title}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h4>지역별 배관공사</h4>
            <div className="footer-links">
              <Link href="/area/">전국 지역 허브</Link>
              {sidoList.slice(0, 8).map((s) => (
                <Link key={s.slug} href={`/area/${s.slug}/`}>
                  {s.shortName} 배관공사
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>고객센터</h4>
            <div className="footer-links">
              <Link href="/about/">회사소개</Link>
              <Link href="/price/">비용 안내</Link>
              <Link href="/case/">현장사례</Link>
              <Link href="/faq/">자주 묻는 질문</Link>
              <Link href="/contact/">예약·사진 상담</Link>
              <Link href="/privacy/">개인정보처리방침</Link>
            </div>
          </div>
        </div>

        <hr className="divider" />
        <p className="muted mt-0">
          상호: {site.name} · 서비스 가능 지역: 전국 주요 지역 출동 · 작업 후 배수 테스트 및 A/S 기준 안내
        </p>
        <p className="muted mt-0" style={{ fontSize: "0.82rem" }}>
          © {new Date().getFullYear()} {site.name}. 실제 출동 가능 지역 중심으로 운영하며, 검증 불가한 표현과 허위 정보를 사용하지 않습니다.
        </p>
      </div>
    </footer>
  );
}
