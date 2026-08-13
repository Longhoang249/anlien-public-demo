"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DemoSnapshot } from "@/src/contracts/shell";
import { DayPage } from "./DayPage";
import { LoyaltyPage } from "./LoyaltyPage";
import { MarketingPage } from "./MarketingPage";
import { OpsPage } from "./OpsPage";
import { OverviewPage } from "./OverviewPage";
import { DemoBadge } from "./ui";

export type ShowroomPage = "overview" | "marketing" | "loyalty" | "ops" | "day";

const navItems: Array<{
  page: ShowroomPage;
  href: string;
  label: string;
  promise: string;
  short: string;
}> = [
  { page: "overview", href: "/demo", label: "Tổng quan", promise: "Hôm nay", short: "Tổng quan" },
  { page: "marketing", href: "/demo/marketing", label: "Thương hiệu", promise: "DNA và ý tưởng", short: "Thương hiệu" },
  { page: "loyalty", href: "/demo/loyalty", label: "Khách hàng", promise: "Giữ khách", short: "Khách hàng" },
  { page: "ops", href: "/demo/ops", label: "Nhân sự", promise: "Vận hành", short: "Nhân sự" },
  { page: "day", href: "/demo/day", label: "Một ngày", promise: "Hành trình", short: "Một ngày" },
];

const modalCopy: Record<string, { eyebrow: string; title: string; body: string; steps?: string[] }> = {
  "Dùng ANLIEN cho quán của bạn": {
    eyebrow: "SẮP SẴN SÀNG",
    title: "ANLIEN đang mở chương trình trải nghiệm sớm.",
    body: "Bản demo đang dùng dữ liệu mẫu. Khi kết nối với quán, ANLIEN sẽ gom các tín hiệu quan trọng về nhân sự, khách hàng và thương hiệu vào cùng một nơi.",
  },
  "Tạo ưu đãi": {
    eyebrow: "LOYALTY · DEMO",
    title: "Mời đúng nhóm khách quay lại.",
    body: "Loyalty sở hữu hồ sơ khách, Xu, voucher và redemption. Shell chỉ xem projection tổng hợp.",
    steps: ["Chọn nhóm khách", "Xem ưu đãi gợi ý", "Xác nhận trước khi gửi"],
  },
  "Check-in": {
    eyebrow: "OPS · DEMO",
    title: "Check-in ca làm tại cơ sở.",
    body: "Trong sản phẩm thật, Ops xử lý attendance theo Location. Prototype này không ghi dữ liệu hay yêu cầu quyền vị trí.",
  },
};

export function ShowroomApp({
  page,
  snapshot,
}: {
  page: ShowroomPage;
  snapshot: DemoSnapshot;
  publicEntry?: boolean;
}) {
  const [modal, setModal] = useState<string | null>(null);
  const [contextOpen, setContextOpen] = useState(false);

  useEffect(() => {
    if (!modal) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setModal(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  const openAction = (label: string) => setModal(label);
  const resolvedModal = modal
    ? modalCopy[modal] ?? {
        eyebrow: "THAO TÁC MẪU",
        title: modal,
        body: "Đây là một thao tác mẫu để bạn hình dung cách ANLIEN hỗ trợ quán.",
        steps: ["Xem bối cảnh", "Nhận gợi ý", "Chọn việc cần làm"],
      }
    : null;

  return (
    <div className={`app-shell app-shell--${page}`}>
      <header className="topbar">
        <Link href="/" className="wordmark" aria-label="ANLIEN · Trang chủ">
          <span className="wordmark__mark" aria-hidden="true"><i /></span>
          <span><strong>ANLIEN</strong><small>For better F&amp;B days</small></span>
        </Link>

        <div className="topbar__context">
          <button className="business-switcher" onClick={() => setContextOpen((value) => !value)} aria-expanded={contextOpen}>
            <span className="business-switcher__avatar">F</span>
            <span><small>Business</small><strong>{snapshot.business.name}</strong></span>
            <b aria-hidden="true">⌄</b>
          </button>
          <div className="location-context"><small>Location</small><strong>Tất cả cơ sở</strong></div>
          {contextOpen ? (
            <div className="context-popover">
              <p className="eyebrow">BUSINESS CONTEXT</p>
              <strong>{snapshot.business.name}</strong>
              <span>Organization → Business → Location</span>
              <div><b>Marketing &amp; Loyalty</b><small>Phạm vi toàn thương hiệu</small></div>
              <div><b>Ops</b><small>Có thể lọc theo cơ sở</small></div>
              <DemoBadge compact />
            </div>
          ) : null}
        </div>

        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <Link key={item.page} href={item.href} className={page === item.page ? "is-active" : ""}>{item.label}</Link>
          ))}
        </nav>

        <div className="topbar__actions">
          <DemoBadge compact />
          <button className="top-cta" onClick={() => openAction("Dùng ANLIEN cho quán của bạn")}>Dùng cho quán của bạn</button>
        </div>
      </header>

      <main className="shell-main">
        {page === "overview" ? <OverviewPage snapshot={snapshot} /> : null}
        {page === "marketing" ? <MarketingPage snapshot={snapshot} onAction={openAction} /> : null}
        {page === "loyalty" ? <LoyaltyPage snapshot={snapshot} onAction={openAction} /> : null}
        {page === "ops" ? <OpsPage snapshot={snapshot} onAction={openAction} /> : null}
        {page === "day" ? <DayPage snapshot={snapshot} /> : null}
        <footer className="site-footer">
          <div><span className="wordmark__mark" aria-hidden="true"><i /></span><strong>ANLIEN</strong></div>
          <p>Nhân sự · Khách hàng · Thương hiệu</p>
          <small>Demo với dữ liệu mẫu</small>
        </footer>
      </main>

      <nav className="mobile-nav" aria-label="Điều hướng nhanh">
        {navItems.map((item) => (
          <Link key={item.page} href={item.href} className={page === item.page ? "is-active" : ""}>
              <span>{item.page === "overview" ? "⌂" : item.page === "day" ? "↻" : item.page === "marketing" ? "T" : item.page === "loyalty" ? "K" : "N"}</span>
            <small>{item.short}</small>
          </Link>
        ))}
      </nav>

      {resolvedModal ? (
        <div className="modal-backdrop">
          <section className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
            <button className="modal-close" aria-label="Đóng" onClick={() => setModal(null)}>×</button>
            <p className="eyebrow">{resolvedModal.eyebrow}</p>
            <h2 id="demo-modal-title">{resolvedModal.title}</h2>
            <p>{resolvedModal.body}</p>
            {resolvedModal.steps ? (
              <ol>{resolvedModal.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
            ) : null}
            <div className="modal-demo-note"><DemoBadge /><span>Thao tác này chỉ dùng dữ liệu mẫu.</span></div>
            <button className="button button--primary" onClick={() => setModal(null)}>Tiếp tục xem demo</button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
