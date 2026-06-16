import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container center" style={{ maxWidth: 560 }}>
        <h1 className="section-title">페이지를 찾을 수 없습니다</h1>
        <p className="section-sub" style={{ margin: "0 auto 24px" }}>
          주소가 바뀌었거나 준비 중인 지역 페이지일 수 있습니다. 아래에서 다시 찾아보세요.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn--cta" href="/">
            홈으로
          </Link>
          <Link className="btn btn--ghost" href="/area/">
            지역 찾기
          </Link>
          <Link className="btn btn--ghost" href="/service/">
            서비스 안내
          </Link>
        </div>
      </div>
    </section>
  );
}
