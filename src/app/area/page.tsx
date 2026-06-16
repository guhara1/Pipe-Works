import type { Metadata } from "next";
import Link from "next/link";
import { sidoList } from "@/data/regions";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "전국 배관공사 지역 찾기 | 시·도별 안내",
  description: "서울·경기·인천·부산 등 전국 시·도별 하수구막힘·배관공사 안내. 시·도를 선택하면 시·군·구로 이동합니다. 실제 출동 가능 지역 중심으로 운영합니다.",
  alternates: { canonical: "/area/" },
};

export default function AreaIndex() {
  const crumbs = [{ name: "홈", url: "/" }, { name: "지역별 찾기", url: "/area/" }];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumb items={crumbs} />

      <section className="section section--tight">
        <div className="container">
          <span className="eyebrow">전국 지역 허브</span>
          <h1 className="section-title">전국 배관공사 지역 찾기</h1>
          <p className="section-sub">
            전국 시·도 → 시·군·구 → 실제 사례가 있는 읍·면·동 순으로 안내합니다. 지역마다 주거·상가·공장 특성이 달라 현장 조건에 맞춰 처리합니다.
          </p>

          <div className="glass area-search">
            <input type="search" placeholder="지역명 입력: 강남구, 수원시, 역삼동, 양평읍" aria-label="지역 검색" />
          </div>

          <div className="grid grid--4" style={{ marginTop: 24 }}>
            {sidoList.map((s) => (
              <Link key={s.slug} href={`/area/${s.slug}/`} className="card">
                <h3>{s.shortName} 배관공사</h3>
                <p>{s.name} · 하위 {s.children?.length ?? 0}개 지역</p>
              </Link>
            ))}
          </div>

          <CtaBlock />
        </div>
      </section>
    </>
  );
}
