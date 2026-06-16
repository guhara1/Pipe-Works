import type { Metadata } from "next";
import { site } from "@/data/site";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "스피드 배관공사 개인정보처리방침 및 현장 사진 사용 동의 기준 안내.",
  alternates: { canonical: "/privacy/" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  const crumbs = [{ name: "홈", url: "/" }, { name: "개인정보처리방침", url: "/privacy/" }];
  return (
    <>
      <Breadcrumb items={crumbs} />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 820 }}>
          <h1 className="section-title">개인정보처리방침</h1>
          <div className="prose">
            <p>
              {site.name}(이하 ‘회사’)는 상담·예약 및 작업 진행에 필요한 최소한의 개인정보만 수집·이용하며, 관련 법령에 따라 안전하게 관리합니다. 아래 내용은 표준 안내 예시이며, 실제 운영 정책에 맞게 보완해 주세요.
            </p>
            <h2>수집 항목 및 목적</h2>
            <ul>
              <li>연락처·주소(상담 응대, 출동·작업 진행)</li>
              <li>현장 사진(증상 확인 및 작업 기록)</li>
            </ul>
            <h2>보유 및 이용 기간</h2>
            <p>수집 목적이 달성되면 지체 없이 파기하며, 관련 법령이 정한 기간 동안 보관해야 하는 경우 해당 기간을 따릅니다.</p>
            <h2>현장 사진 사용 동의 기준</h2>
            <p>작업 전·후 현장 사진은 동의를 받은 경우에만 사례 등에 사용하며, 개인정보와 주소가 드러나는 부분은 제거합니다.</p>
            <h2>문의</h2>
            <p>개인정보 관련 문의는 대표 연락처({site.phone})로 문의해 주세요.</p>
          </div>
        </div>
      </section>
    </>
  );
}
