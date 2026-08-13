"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DemoSnapshot, RoleKey } from "@/src/contracts/shell";
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
  { page: "marketing", href: "/demo/marketing", label: "Marketing", promise: "Kéo khách", short: "Marketing" },
  { page: "loyalty", href: "/demo/loyalty", label: "Loyalty", promise: "Giữ khách", short: "Loyalty" },
  { page: "ops", href: "/demo/ops", label: "Ops", promise: "Vận hành", short: "Ops" },
  { page: "day", href: "/demo/day", label: "Một ngày", promise: "Với ANLIEN", short: "Một ngày" },
];

const roleLabels: Record<RoleKey, string> = {
  owner: "Chủ quán",
  manager: "Quản lý",
  marketing: "Marketing",
  staff: "Nhân viên",
};

const roleDescription: Record<RoleKey, string> = {
  owner: "Ưu tiên tổng quan, cảnh báo và hiệu quả.",
  manager: "Ưu tiên ca, checklist và công việc.",
  marketing: "Ưu tiên nội dung, thiết kế và chiến dịch.",
  staff: "Ưu tiên lịch làm và việc cần hoàn thành.",
};

const modalCopy: Record<string, { eyebrow: string; title: string; body: string; steps?: string[] }> = {
  "Dùng ANLIEN cho quán của bạn": {
    eyebrow: "SẮP SẴN SÀNG",
    title: "ANLIEN đang mở chương trình trải nghiệm sớm.",
    body: "Đây là prototype công khai nên chưa tạo tài khoản hay kết nối dữ liệu thật. Khi onboarding sẵn sàng, quán của bạn sẽ đi vào cùng mental model đang thấy ở đây.",
  },
  "Tạo bài đăng": {
    eyebrow: "MARKETING · DEMO",
    title: "Từ một gợi ý thành bài đăng.",
    body: "ANLIEN đọc Brand Context của Marketing, chuẩn bị bản nháp rồi chờ chủ quán duyệt.",
    steps: ["Chọn mục tiêu hôm nay", "Xem bản nháp AI", "Duyệt và lên lịch"],
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
  publicEntry = false,
}: {
  page: ShowroomPage;
  snapshot: DemoSnapshot;
  publicEntry?: boolean;
}) {
  const [role, setRole] = useState<RoleKey>("owner");
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
        body: "Bạn đang thử workflow với dữ liệu mô phỏng. Không có API production nào được gọi và không có thay đổi nào được lưu.",
        steps: ["Mở ngữ cảnh liên quan", "Xem đề xuất", "Xác nhận trước khi hành động"],
      }
    : null;

  return (
    <div className={`app-shell app-shell--${page}`}>
      <header className="topbar">
        <Link href="/" className="wordmark" aria-label="ANLIEN — Trang chủ">
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

        <div className="topbar__actions">
          <DemoBadge compact />
          <button className="top-cta" onClick={() => openAction("Dùng ANLIEN cho quán của bạn")}>Dùng cho quán của bạn</button>
        </div>
      </header>

      <aside className="sidebar">
        <nav aria-label="Điều hướng sản phẩm">
          {navItems.map((item, index) => (
            <Link key={item.page} href={item.href} className={page === item.page ? "is-active" : ""}>
              <span>0{index + 1}</span>
              <div><small>{item.promise}</small><strong>{item.label}</strong></div>
            </Link>
          ))}
        </nav>
        <div className="role-panel">
          <label htmlFor="role-select">Bạn đang xem với vai trò</label>
          <select id="role-select" value={role} onChange={(event) => setRole(event.target.value as RoleKey)}>
            {Object.entries(roleLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <p>{roleDescription[role]}</p>
        </div>
        <div className="shell-note"><span>DEMO MODE</span><p>Không kết nối dữ liệu thật</p></div>
      </aside>

      <main className="shell-main">
        {publicEntry ? (
          <div className="public-ribbon">
            <span>PUBLIC PRODUCT SHOWROOM</span>
            <p>Không cần đăng nhập. Hãy thử một ngày vận hành quán mẫu.</p>
            <a href="#today">Bắt đầu ↓</a>
          </div>
        ) : null}
        {page === "overview" ? <OverviewPage snapshot={snapshot} role={role} onAction={openAction} /> : null}
        {page === "marketing" ? <MarketingPage snapshot={snapshot} onAction={openAction} /> : null}
        {page === "loyalty" ? <LoyaltyPage snapshot={snapshot} onAction={openAction} /> : null}
        {page === "ops" ? <OpsPage snapshot={snapshot} onAction={openAction} /> : null}
        {page === "day" ? <DayPage snapshot={snapshot} /> : null}
        <footer className="site-footer">
          <div><span className="wordmark__mark" aria-hidden="true"><i /></span><strong>ANLIEN</strong></div>
          <p>Kéo khách · Giữ khách · Vận hành tốt hơn</p>
          <small>Prototype công khai · Toàn bộ số liệu là dữ liệu mô phỏng</small>
        </footer>
      </main>

      <nav className="mobile-nav" aria-label="Điều hướng nhanh">
        {navItems.map((item) => (
          <Link key={item.page} href={item.href} className={page === item.page ? "is-active" : ""}>
            <span>{item.page === "overview" ? "⌂" : item.page === "day" ? "↻" : item.label.charAt(0)}</span>
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
            <div className="modal-demo-note"><DemoBadge /><span>Không có dữ liệu production nào được đọc hoặc ghi.</span></div>
            <button className="button button--primary" onClick={() => setModal(null)}>Tiếp tục xem demo</button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
