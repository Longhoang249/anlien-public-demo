"use client";

import { useState } from "react";
import type { DemoSnapshot } from "@/src/contracts/shell";
import { DemoBadge, ScopeBadge, SectionIntro } from "./ui";

export function MarketingPage({
  snapshot,
  onAction,
}: {
  snapshot: DemoSnapshot;
  onAction: (label: string) => void;
}) {
  const [approved, setApproved] = useState(false);
  const [variant, setVariant] = useState(0);
  const draft = snapshot.marketing.draft;
  const title = variant
    ? "Một ly mát, một khoảng nghỉ vừa đủ cho chiều nay."
    : draft.title;

  return (
    <div className="product-page product-page--marketing">
      <header className="product-hero">
        <div>
          <div className="product-hero__meta"><DemoBadge /><ScopeBadge scope="business" /></div>
          <p className="eyebrow">MARKETING · KÉO KHÁCH</p>
          <h1>Hôm nay page nên đăng gì?</h1>
          <p>ANLIEN đi cùng bạn từ lúc nghĩ ý tưởng đến khi bài được duyệt và sẵn sàng lên lịch.</p>
        </div>
        <div className="mini-status"><span>3</span><p>nội dung đang chuẩn bị</p></div>
      </header>

      <section className="suggestion-card">
        <div className="suggestion-card__label">GỢI Ý HÔM NAY</div>
        <div className="suggestion-card__content">
          <h2>{snapshot.marketing.suggestion}</h2>
          <div>
            <p className="eyebrow">VÌ SAO ANLIEN GỢI Ý?</p>
            <ul>{snapshot.marketing.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="creative-workspace">
        <div className="post-preview">
          <div className="post-preview__visual" aria-label="Minh họa thiết kế bài đăng đồ uống mát">
            <span className="poster-kicker">CHIỀU MÁT</span>
            <div className="drink-illustration"><span /><i /></div>
            <strong>TRÀ ĐÀO<br />CAM SẢ</strong>
            <small>FnB Ăn Liền · Demo</small>
          </div>
          <div className="post-preview__caption">
            <span>{draft.eyebrow}</span>
            <p>{draft.caption}</p>
          </div>
        </div>

        <div className="draft-panel">
          <div className="draft-panel__head">
            <div><span className="draft-status">{approved ? "ĐÃ DUYỆT" : "BẢN NHÁP"}</span><p>Facebook · 15:00 hôm nay</p></div>
            <span className="demo-label">Demo</span>
          </div>
          <h2>{title}</h2>
          <p>{draft.body}</p>
          <div className="draft-actions">
            <button onClick={() => onAction("Chỉnh sửa bản nháp")}>Chỉnh sửa</button>
            <button onClick={() => setVariant((value) => (value ? 0 : 1))}>Tạo lại</button>
            <button className={approved ? "is-approved" : ""} onClick={() => setApproved(true)}>
              {approved ? "Đã duyệt ✓" : "Duyệt"}
            </button>
            <button className="button--dark" onClick={() => onAction("Lên lịch bài đăng")}>Lên lịch</button>
          </div>
        </div>
      </section>

      <section className="workflow-section">
        <SectionIntro eyebrow="WORKFLOW MẪU" title="Từ một ý nghĩ đến bài đăng sẵn sàng" />
        <ol className="workflow-steps">
          {snapshot.marketing.workflow.map((step, index) => (
            <li key={step} className={approved || index < 2 ? "is-complete" : ""}>
              <span>{index + 1}</span><strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

