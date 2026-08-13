import type { ReactNode } from "react";

export function DemoBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "demo-badge demo-badge--compact" : "demo-badge"}>
      <span aria-hidden="true" className="demo-badge__dot" />
      Demo
    </span>
  );
}

export function ScopeBadge({ scope }: { scope: "business" | "location" }) {
  return (
    <span className="scope-badge">
      {scope === "business" ? "Toàn thương hiệu" : "Theo cơ sở"}
    </span>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="section-intro">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description ? <p className="section-intro__description">{description}</p> : null}
      </div>
      {aside ? <div className="section-intro__aside">{aside}</div> : null}
    </div>
  );
}

export function StatusMark({ tone }: { tone: "warning" | "neutral" | "success" }) {
  return (
    <span className={`status-mark status-mark--${tone}`} aria-hidden="true">
      {tone === "warning" ? "!" : tone === "success" ? "✓" : "○"}
    </span>
  );
}

export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
