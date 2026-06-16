import Link from "next/link";
import { site } from "@/data/site";

const navItems = [
  { href: "/service/", label: "서비스 안내" },
  { href: "/area/", label: "지역별 찾기" },
  { href: "/case/", label: "현장사례" },
  { href: "/price/", label: "비용 안내" },
  { href: "/faq/", label: "고객센터" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label={`${site.name} 홈`}>
          <span className="brand__mark" aria-hidden>
            🔧
          </span>
          {site.name}
        </Link>

        <nav className="nav" aria-label="주요 메뉴">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="header-cta">
          <a className="btn btn--cta" href={site.phoneHref}>
            📞 {site.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
