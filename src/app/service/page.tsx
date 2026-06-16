import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "서비스 안내 | 하수구막힘·배관공사·고압세척",
  description: "하수구막힘, 싱크대·변기·욕실 배수구막힘, 오수관 역류, 배관내시경, 고압세척, 배관교체까지 증상과 공법별 서비스를 안내합니다.",
  alternates: { canonical: "/service/" },
};

export default function ServiceIndex() {
  const groups = {
    증상: services.filter((s) => s.category === "증상"),
    공법: services.filter((s) => s.category === "공법"),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "홈", url: "/" }, { name: "서비스 안내", url: "/service/" }])} />
      <Breadcrumb items={[{ name: "홈", url: "/" }, { name: "서비스 안내", url: "/service/" }]} />

      <section className="section section--tight">
        <div className="container">
          <span className="eyebrow">서비스 안내</span>
          <h1 className="section-title">증상별 · 공법별 서비스</h1>
          <p className="section-sub">막힘 위치와 원인을 먼저 확인하고 필요한 작업만 진행합니다.</p>

          <h2 style={{ marginTop: 28 }}>증상별</h2>
          <div className="grid grid--3" style={{ marginTop: 12 }}>
            {groups.증상.map((s) => (
              <Link key={s.slug} href={`/service/${s.slug}/`} className="card">
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
              </Link>
            ))}
          </div>

          <h2 style={{ marginTop: 36 }}>장비·공법별</h2>
          <div className="grid grid--3" style={{ marginTop: 12 }}>
            {groups.공법.map((s) => (
              <Link key={s.slug} href={`/service/${s.slug}/`} className="card">
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
              </Link>
            ))}
          </div>

          <CtaBlock />
        </div>
      </section>
    </>
  );
}
