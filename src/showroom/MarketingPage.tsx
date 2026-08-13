"use client";

import { useState } from "react";
import type { DemoSnapshot } from "@/src/contracts/shell";
import { Arrow, ScopeBadge, SectionIntro } from "./ui";

export function MarketingPage({
  snapshot,
  onAction,
}: {
  snapshot: DemoSnapshot;
  onAction: (label: string) => void;
}) {
  const [selectedIdea, setSelectedIdea] = useState(snapshot.marketing.ideas[0].id);
  const idea = snapshot.marketing.ideas.find((item) => item.id === selectedIdea) ?? snapshot.marketing.ideas[0];
  const dna = snapshot.marketing.brandDna;

  return (
    <div className="product-page product-page--marketing marketing-v2">
      <header className="product-hero marketing-command-hero">
        <div>
          <div className="product-hero__meta"><ScopeBadge scope="business" /></div>
          <p className="eyebrow">THƯƠNG HIỆU · Ý TƯỞNG · CỐ VẤN</p>
          <h1>Quán là ai. Hôm nay nên làm gì?</h1>
          <p>ANLIEN nhớ quán là ai.</p>
        </div>
        <div className="mini-status brand-status"><span>{dna.readiness}%</span><p>DNA thương hiệu</p></div>
      </header>

      <section className="brand-dna-card">
        <div className="brand-dna-card__title">
          <p className="eyebrow">DNA THƯƠNG HIỆU</p>
          <h2>{dna.readiness}% hoàn thiện</h2>
          <span className="live-dot">{dna.status}</span>
        </div>
        <dl>
          <div><dt>Giọng thương hiệu</dt><dd>{dna.voice.join(" · ")}</dd></div>
          <div><dt>Khách chính</dt><dd>{dna.audience}</dd></div>
          <div><dt>Phong cách hình ảnh</dt><dd>{dna.visualStyle.join(" · ")}</dd></div>
          <div><dt>Cần bổ sung</dt><dd>{dna.touchpointsPending} điểm chạm</dd></div>
        </dl>
        <button className="text-link text-link--button" onClick={() => onAction("Xem DNA thương hiệu")}>Xem DNA thương hiệu <Arrow /></button>
      </section>

      <section className="marketing-ideas-section">
        <SectionIntro eyebrow="HÔM NAY NÊN LÀM GÌ?" title={`${snapshot.marketing.ideas.length} ý tưởng từ DNA và bối cảnh quán`} />
        <div className="marketing-ideas-layout">
          <div className="idea-picker">
            {snapshot.marketing.ideas.map((item, index) => (
              <button key={item.id} className={selectedIdea === item.id ? "is-selected" : ""} onClick={() => setSelectedIdea(item.id)}>
                <span>0{index + 1}</span><strong>{item.title}</strong><small>{item.channel}</small>
              </button>
            ))}
          </div>
          <article className="idea-detail">
            <p className="eyebrow">GỢI Ý ĐANG CHỌN</p>
            <h2>{idea.title}</h2>
            <p>{idea.angle}</p>
            <div><span>Vì sao phù hợp</span><ul>{snapshot.marketing.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>
            <button className="button button--dark" onClick={() => onAction(`Phát triển ý tưởng: ${idea.title}`)}>Phát triển ý tưởng <Arrow /></button>
          </article>
        </div>
      </section>

      <section className="touchpoints-section">
        <SectionIntro eyebrow="ĐIỂM CHẠM THƯƠNG HIỆU" title="Mỗi nơi khách gặp quán đều nên cùng một DNA" />
        <div className="touchpoint-grid">
          {snapshot.marketing.touchpoints.map((item) => (
            <button key={item.label} onClick={() => onAction(item.label)} className={item.status === "ready" ? "is-ready" : "is-pending"}>
              <span>{item.status === "ready" ? "✓" : "+"}</span><strong>{item.label}</strong><small>{item.status === "ready" ? "Đã có DNA" : "Cần hoàn thiện"}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="advisor-section">
        <SectionIntro eyebrow="TRỢ LÝ XOAY QUANH QUÁN" title="Hỏi đúng người cho từng việc" />
        <div className="advisor-grid">
          {snapshot.marketing.advisors.map((advisor) => (
            <button key={advisor.label} onClick={() => onAction(advisor.label)}><strong>{advisor.label}</strong><p>{advisor.description}</p><Arrow /></button>
          ))}
        </div>
      </section>
    </div>
  );
}
