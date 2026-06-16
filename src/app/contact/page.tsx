import type { Metadata } from "next";
import { site } from "@/data/site";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "전화·사진 상담 | 예약 문의",
  description: "전화 상담, 사진 상담, 예약 문의 안내. 증상과 현장 사진을 보내주시면 원인과 작업 방식, 비용 기준을 안내합니다.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const crumbs = [{ name: "홈", url: "/" }, { name: "상담·예약", url: "/contact/" }];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumb items={crumbs} />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 820 }}>
          <span className="eyebrow">고객센터</span>
          <h1 className="section-title">전화·사진 상담</h1>
          <p className="section-sub">증상과 현장 사진을 보내주시면 더 정확히 안내할 수 있습니다.</p>

          <div className="grid grid--2">
            <div className="card">
              <h3>📞 전화 상담</h3>
              <p>가장 빠른 방법입니다. 증상과 위치를 말씀해 주세요.</p>
              <a className="btn btn--cta" href={site.phoneHref} style={{ marginTop: 12 }}>
                {site.phone}
              </a>
            </div>
            <div className="card">
              <h3>📷 사진 상담</h3>
              <p>증상이 보이는 부위 사진 1~3장을 전화·메시지로 보내주세요. 원인 추정과 비용 기준을 안내합니다.</p>
            </div>
            <div className="card">
              <h3>🗓️ 예약 문의</h3>
              <p>원하는 방문 시간대를 알려주시면 일정을 조율합니다. 야간·주말 출동도 가능합니다.</p>
            </div>
            <div className="card">
              <h3>🔧 A/S 문의</h3>
              <p>작업 후 같은 원인으로 재발하면 A/S 기준에 따라 재점검합니다.</p>
            </div>
          </div>

          <div className="glass" style={{ padding: 22, marginTop: 24 }}>
            <h3 style={{ marginTop: 0 }}>상담 시 알려주시면 좋은 정보</h3>
            <ul className="prose" style={{ paddingLeft: 18, margin: 0 }}>
              <li>막힘 증상과 발생 위치(싱크대/욕실/변기/바닥 등)</li>
              <li>건물 종류와 층, 노후 여부</li>
              <li>영업장 여부와 작업 가능 시간대</li>
              <li>지역(시·군·구·동)</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
