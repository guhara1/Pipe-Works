import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { name: string; url: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb container" aria-label="경로">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={it.url}>
            {last ? <span style={{ color: "var(--text-warm-white)", margin: 0 }}>{it.name}</span> : <Link href={it.url}>{it.name}</Link>}
            {!last && <span aria-hidden>/</span>}
          </Fragment>
        );
      })}
    </nav>
  );
}
