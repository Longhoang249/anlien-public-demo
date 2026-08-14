"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DemoSnapshot, OwnerActionKey, OwnerAssignment } from "@/src/contracts/shell";
import { Arrow, SectionIntro, StatusMark } from "./ui";

type DashboardAction = OwnerActionKey | null;

const statusLabel: Record<OwnerAssignment["status"], string> = {
  doing: "Đang làm",
  review: "Chờ duyệt",
  late: "Đang trễ",
};

export function OverviewPage({ snapshot }: { snapshot: DemoSnapshot }) {
  const data = snapshot.owner;
  const metrics = data.metrics;
  const [action, setAction] = useState<DashboardAction>(null);
  const [assignments, setAssignments] = useState(data.assignments);
  const [resolved, setResolved] = useState<string[]>([]);
  const [brandReadiness, setBrandReadiness] = useState(Number.parseInt(metrics.brandReadiness.value, 10));
  const [offerReady, setOfferReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [locationId, setLocationId] = useState("all");

  const priorities = useMemo(
    () => data.priorities.filter((item) => !resolved.includes(item.id)),
    [data.priorities, resolved],
  );

  const toast = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  };

  const addAssignment = () => {
    setAssignments((current) => [
      { id: `a${current.length + 1}`, task: "Kiểm tra khu vực khách", assignee: "Nam", due: "19:15", status: "doing" },
      ...current,
    ]);
    setResolved((current) => [...current, "checkin"]);
    setAction(null);
    toast("Đã giao việc mẫu cho Nam");
  };

  const prepareOffer = () => {
    setOfferReady(true);
    setResolved((current) => [...current, "inactive"]);
    setAction(null);
    toast(`Đã lưu ưu đãi mẫu cho ${metrics.inactiveCustomers.value} khách`);
  };

  const saveBrand = () => {
    setBrandReadiness(91);
    setResolved((current) => [...current, "dna"]);
    setAction(null);
    toast("DNA thương hiệu đã được cập nhật");
  };

  return (
    <>
      <section className="dashboard-head" id="today">
        <div>
          <p className="eyebrow">TRUNG TÂM ĐIỀU HÀNH · HÔM NAY</p>
          <h1>Nắm quán. Chốt việc.</h1>
          <p>Việc cần biết. Việc cần làm.</p>
        </div>
        <div className="dashboard-head__tools">
          <label>Phạm vi<select value={locationId} onChange={(event) => setLocationId(event.target.value)}><option value="all">Tất cả cơ sở</option>{snapshot.locations.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
          <span>{snapshot.generatedAtLabel}</span>
        </div>
      </section>

      <section className="daily-kpis" aria-label="Chỉ số chính hôm nay">
        <MetricCard metric={metrics.staffCheckIn} mark="N" tone="blue" warning />
        <MetricCard metric={metrics.taskCompletion} mark="V" tone="orange" />
        <MetricCard metric={metrics.loyaltySignalsToday} mark="K" tone="purple" />
        <MetricCard metric={{ ...metrics.brandReadiness, value: `${brandReadiness}%` }} mark="D" tone="green" />
      </section>

      <section className="dashboard-grid dashboard-grid--primary">
        <div className="dashboard-panel priority-panel">
          <SectionIntro eyebrow="QUẢN LÝ THEO NGOẠI LỆ" title="Cần bạn xử lý" aside={<span className="count-pill">{priorities.length} việc</span>} />
          <div className="priority-list">
            {priorities.length ? priorities.map((item) => (
              <div className="priority-item" key={item.id}>
                <StatusMark tone={item.tone} />
                <div><small>{item.area}</small><strong>{item.title}</strong><p>{item.detail}</p></div>
                <button onClick={() => setAction(item.action)}>{item.actionLabel}</button>
              </div>
            )) : <div className="empty-state"><strong>Đã xử lý hết việc cần chú ý</strong><p>Các chỉ số khác vẫn được cập nhật phía dưới.</p></div>}
          </div>
        </div>

        <aside className="dashboard-panel quick-actions">
          <SectionIntro eyebrow="LÀM NGAY" title="Thao tác nhanh" />
          {data.quickActions.map((item) => (
            <button key={item.id} onClick={() => setAction(item.action)}><span>{item.id}</span><div><strong>{item.label}</strong><small>{item.detail}</small></div><Arrow /></button>
          ))}
        </aside>
      </section>

      <section className="dashboard-grid dashboard-grid--signals">
        <article className="dashboard-panel signal-card signal-card--ops">
          <div className="signal-card__head"><div><p className="eyebrow">VẬN HÀNH</p><h2>Quán có chạy đúng chuẩn?</h2></div><Link href="/demo/ops">Mở Ops <Arrow /></Link></div>
          <div className="signal-stats">{[metrics.opsOverdue, metrics.opsPendingReview].map((metric) => <div key={metric.id}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>
          <div className="branch-list">
            {data.branches.map((branch) => { const branchLocation = snapshot.locations.find((item) => item.id === branch.locationId); return <div key={branch.locationId}><p><strong>{branchLocation?.name ?? "Cơ sở demo"}</strong><span>{branch.completion.value} · {branch.status}</span></p><i><b style={{ width: branch.completion.value }} /></i></div>; })}
          </div>
        </article>

        <article className="dashboard-panel signal-card signal-card--loyalty">
          <div className="signal-card__head"><div><p className="eyebrow">KHÁCH HÀNG</p><h2>Hệ thống đang nhận biết ai?</h2></div><Link href="/demo/loyalty">Mở Loyalty <Arrow /></Link></div>
          <div className="customer-number"><strong>{metrics.customerProfiles.value}</strong><span>{metrics.customerProfiles.label}</span></div>
          <div className="customer-pulse">{[metrics.vouchersToday, metrics.gamePlaysToday].map((metric) => <span key={metric.id}><b>{metric.value}</b> {metric.label}</span>)}</div>
          <button className="inline-action" onClick={() => setAction("customers")}>{offerReady ? "Ưu đãi mẫu đã sẵn sàng" : `Xem ${metrics.inactiveCustomers.value} thành viên ít hoạt động`} <Arrow /></button>
        </article>

        <article className="dashboard-panel signal-card signal-card--brand">
          <div className="signal-card__head"><div><p className="eyebrow">THƯƠNG HIỆU</p><h2>Hôm nay nên làm gì?</h2></div><Link href="/demo/marketing">Mở Marketing <Arrow /></Link></div>
          <div className="brand-readiness"><div className="brand-ring" style={{ "--progress": `${brandReadiness * 3.6}deg` } as React.CSSProperties}><span>{brandReadiness}%</span></div><div><strong>Điểm DNA mô phỏng cho trải nghiệm Demo.</strong><p>{metrics.brandReadiness.detail}.</p></div></div>
          <div className="today-idea"><small>GỢI Ý ĐÁNG LÀM</small><strong>Đẩy nhóm đồ uống mát vào khung giờ chiều.</strong><span>Dựa trên DNA, nhóm món và bối cảnh hôm nay.</span></div>
          <Link className="inline-action" href="/demo/marketing">Xem thêm gợi ý <Arrow /></Link>
        </article>
      </section>

      <section className="dashboard-panel assignment-panel">
        <SectionIntro eyebrow="PHÂN BỔ CÔNG VIỆC" title="Ai đang làm gì?" aside={<button className="button button--primary button--small" onClick={() => setAction("assign")}>+ Giao việc</button>} />
        <div className="assignment-table">
          <div className="assignment-row assignment-row--head"><span>Công việc</span><span>Người làm</span><span>Hạn</span><span>Trạng thái</span></div>
          {assignments.map((item) => <div className="assignment-row" key={item.id}><strong>{item.task}</strong><span>{item.assignee}</span><span>{item.due}</span><b className={`assignment-status assignment-status--${item.status}`}>{statusLabel[item.status]}</b></div>)}
        </div>
      </section>

      <section className="deep-tools-section dashboard-deep-tools">
        <SectionIntro eyebrow="ĐI SÂU KHI CẦN" title="Ba công cụ, một bức tranh về quán" />
        <div className="deep-tools-grid product-preview-grid">
          {data.productPreviews.map((preview) => (
            <Link href={preview.href} key={preview.product} className={`product-preview product-preview--${preview.product}`}>
              <span>{preview.eyebrow}</span><h3>{preview.title}</h3><p className="product-preview__promise">{preview.promise}</p>
              <div className="product-preview__features">{preview.features.map((feature) => <small key={feature}>{feature}</small>)}</div>
              <div className="product-preview__facts">{preview.facts.map((fact) => <strong key={fact}>{fact}</strong>)}</div>
              <b>{preview.actionLabel} <Arrow /></b>
            </Link>
          ))}
        </div>
      </section>

      {notice ? <div className="dashboard-toast" role="status">✓ {notice}</div> : null}

      {action ? (
        <div className="dashboard-drawer-backdrop">
          <button className="drawer-overlay-close" onClick={() => setAction(null)} aria-label="Đóng bảng thao tác" />
          <aside className="dashboard-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
            <button className="drawer-close" onClick={() => setAction(null)} aria-label="Đóng">×</button>
            {action === "assign" ? <AssignForm onSave={addAssignment} /> : null}
            {action === "customers" ? <CustomerForm count={metrics.inactiveCustomers.value} onSave={prepareOffer} /> : null}
            {action === "idea" ? <IdeaForm snapshot={snapshot} /> : null}
            {action === "brand" ? <BrandForm onSave={saveBrand} /> : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}

function MetricCard({ metric, mark, tone, warning = false }: { metric: DemoSnapshot["owner"]["metrics"][keyof DemoSnapshot["owner"]["metrics"]]; mark: string; tone: "blue" | "orange" | "purple" | "green"; warning?: boolean }) {
  return <article><span className={`metric-icon metric-icon--${tone}`}>{mark}</span><div><small>{metric.label}</small><strong>{metric.value}</strong>{metric.detail ? <p><b className={warning ? "is-warning" : ""}>{metric.detail}</b></p> : null}</div></article>;
}

function AssignForm({ onSave }: { onSave: () => void }) {
  return <><p className="eyebrow">OPS · GIAO TỪ SOP</p><h2 id="drawer-title">Phân công việc</h2><p className="drawer-lead">Chọn quy trình chuẩn, người làm và hạn hoàn thành.</p><div className="drawer-form"><label>Công việc<select defaultValue="Kiểm tra khu vực khách"><option>Kiểm tra khu vực khách</option><option>Đối soát quầy thu ngân</option><option>Vệ sinh quầy bar cuối ca</option></select></label><label>Người phụ trách<select defaultValue="Nam"><option>Nam</option><option>Linh</option><option>Minh</option></select></label><div className="drawer-form__split"><label>Hạn hoàn thành<input defaultValue="19:15" type="time" /></label><label>Ưu tiên<select><option>Bình thường</option><option>Cao</option><option>Khẩn cấp</option></select></label></div><label>Yêu cầu bằng chứng<select><option>1 ảnh sau khi hoàn thành</option><option>Không cần ảnh</option></select></label></div><div className="drawer-preview"><span>Quy trình chuẩn</span><strong>4 bước · 1 ảnh đối chiếu · Quản lý duyệt</strong></div><button className="button button--primary drawer-submit" onClick={onSave}>Giao việc mẫu</button></>;
}

function CustomerForm({ count, onSave }: { count: string; onSave: () => void }) {
  return <><p className="eyebrow">LOYALTY · DEMO TÁI KÍCH HOẠT</p><h2 id="drawer-title">Chuẩn bị ưu đãi mẫu</h2><p className="drawer-lead">Nhóm này được xác định theo hoạt động Loyalty quan sát được trong bản Demo.</p><div className="segment-preview"><strong>{count}</strong><span>thành viên không có hoạt động Loyalty trong 45 ngày</span></div><div className="drawer-form"><label>Ưu đãi mẫu<select><option>Tặng 20 Xu</option><option>Voucher giảm 15%</option><option>Tặng topping</option></select></label><label>Hiệu lực<select><option>7 ngày</option><option>14 ngày</option></select></label><label>Lời nhắn<textarea defaultValue="Lâu rồi chưa gặp bạn. FnB Ăn Liền gửi tặng 20 Xu cho lần ghé tới nhé!" /></label></div><div className="demo-action-note">Đây là thao tác demo. Không có tin nhắn thật được gửi.</div><button className="button button--primary drawer-submit" onClick={onSave}>Lưu ưu đãi mẫu</button></>;
}

function IdeaForm({ snapshot }: { snapshot: DemoSnapshot }) {
  return <><p className="eyebrow">MARKETING · GỢI Ý HÔM NAY</p><h2 id="drawer-title">{snapshot.marketing.suggestion}</h2><p className="drawer-lead">Dựa trên DNA, nhóm món và bối cảnh hôm nay.</p><div className="idea-drawer-reasons">{snapshot.marketing.reasons.map((reason) => <span key={reason}>✓ {reason}</span>)}</div><Link className="button button--primary drawer-submit" href="/demo/marketing">Xem ý tưởng</Link></>;
}

function BrandForm({ onSave }: { onSave: () => void }) {
  return <><p className="eyebrow">MARKETING · BỘ NHỚ QUÁN</p><h2 id="drawer-title">Cập nhật DNA</h2><p className="drawer-lead">Thông tin này giúp các trợ lý hiểu đúng quán trước khi gợi ý.</p><div className="drawer-form"><label>Món chủ lực<input defaultValue="Trà trái cây và cà phê pha máy" /></label><label>Lý do khách quay lại<input defaultValue="Nhanh, vui, vừa túi tiền" /></label><div className="drawer-form__split"><label>Giờ đông khách<input defaultValue="11:30 · 17:30" /></label><label>Chi tiêu trung bình<input defaultValue="59.000đ" /></label></div><label>Điểm chạm đang bổ sung<select><option>Bao bì mang đi</option><option>Kịch bản chào khách</option><option>Mẫu trả lời review</option></select></label></div><button className="button button--primary drawer-submit" onClick={onSave}>Lưu vào DNA mẫu</button></>;
}
