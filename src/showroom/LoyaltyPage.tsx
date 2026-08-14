"use client";

import { useState } from "react";
import type { DemoSnapshot } from "@/src/contracts/shell";
import { Arrow, ScopeBadge, SectionIntro } from "./ui";

export function LoyaltyPage({
  snapshot,
  onAction,
}: {
  snapshot: DemoSnapshot;
  onAction: (label: string) => void;
}) {
  const [selected, setSelected] = useState("inactive");
  const [ready, setReady] = useState(false);
  const summary = snapshot.summaries.loyalty;
  const memberMetric = summary.metrics.find((metric) => metric.id === "loyalty-members") ?? summary.metrics[0];
  const inactiveGroup = snapshot.loyalty.groups.find((group) => group.id === "inactive");

  return (
    <div className="product-page product-page--loyalty">
      <header className="product-hero">
        <div>
          <div className="product-hero__meta"><ScopeBadge scope="business" /></div>
          <p className="eyebrow">LOYALTY · GIỮ KHÁCH</p>
          <h1>Khách của quán đang thế nào?</h1>
          <p>Ai đã được hệ thống nhận biết. Nhóm nào ít hoạt động.</p>
        </div>
        <div className="mini-status"><span>{memberMetric.value}</span><p>{memberMetric.label}</p></div>
      </header>

      <section className="loyalty-metrics">
        {summary.metrics.map((metric) => (
          <div key={metric.id} className={metric.id === "loyalty-inactive" ? "is-highlighted" : ""}>
            <strong>{metric.value}</strong><span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section className="recommendation-band">
        <div><p className="eyebrow">ANLIEN ĐỀ XUẤT</p><h2>{snapshot.loyalty.recommendation}</h2></div>
        <div className="recommendation-band__actions">
          <button className="button button--light" onClick={() => setSelected("inactive")}>Xem nhóm khách</button>
          <button className="button button--primary" onClick={() => onAction("Xem ưu đãi tái kích hoạt mẫu")}>Xem ưu đãi</button>
        </div>
      </section>

      <section className="customer-workspace">
        <div>
          <SectionIntro eyebrow="NHÓM KHÁCH" title="Ai đang cần được chăm sóc?" />
          <div className="customer-groups">
            {snapshot.loyalty.groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelected(group.id)}
                className={selected === group.id ? "is-selected" : ""}
              >
                <span><strong>{group.label}</strong><small>{group.note}</small></span>
                <b>{group.count}</b>
              </button>
            ))}
          </div>
          <p className="privacy-note">Tất cả hồ sơ trong demo đều là dữ liệu tổng hợp, không có thông tin nhận diện khách thật.</p>
        </div>

        <aside className="offer-card">
          <p className="eyebrow">ƯU ĐÃI GỢI Ý</p>
          <span className="offer-card__seal">20<span>Xu</span></span>
          <h2>{snapshot.loyalty.offer.name}</h2>
          <p>{snapshot.loyalty.offer.value} · {snapshot.loyalty.offer.validity}</p>
          <dl>
            <div><dt>Nhóm nhận</dt><dd>{inactiveGroup?.count ?? 0} thành viên không có hoạt động Loyalty trong 45 ngày</dd></div>
            <div><dt>Trạng thái</dt><dd>{ready ? "Sẵn sàng gửi" : "Bản nháp"}</dd></div>
          </dl>
          <button className="button button--dark" onClick={() => setReady(true)}>
            {ready ? "Ưu đãi đã sẵn sàng ✓" : <>Chuẩn bị ưu đãi <Arrow /></>}
          </button>
          <small>Demo · Không gửi đến khách thật</small>
        </aside>
      </section>
    </div>
  );
}
