"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DemoSnapshot, OwnerAssignment } from "@/src/contracts/shell";
import { Arrow, SectionIntro, StatusMark } from "./ui";

type DashboardAction = "assign" | "customers" | "brand" | "feedback" | null;

const statusLabel: Record<OwnerAssignment["status"], string> = {
  doing: "Đang làm",
  review: "Chờ duyệt",
  late: "Đang trễ",
};

export function OverviewPage({ snapshot }: { snapshot: DemoSnapshot }) {
  const data = snapshot.owner;
  const [action, setAction] = useState<DashboardAction>(null);
  const [assignments, setAssignments] = useState(data.assignments);
  const [resolved, setResolved] = useState<string[]>([]);
  const [brandReadiness, setBrandReadiness] = useState(data.brand.readiness);
  const [offerReady, setOfferReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [location, setLocation] = useState("Tất cả cơ sở");

  const priorities = useMemo(() => [
    { id: "checkin", tone: "warning" as const, area: "Nhân sự", title: "Nam chưa vào ca tối", detail: "Ca bắt đầu lúc 17:00", action: "assign" as const, button: "Xử lý" },
    { id: "review", tone: "warning" as const, area: "Vận hành", title: "1 việc chờ duyệt quá 15 phút", detail: "Đối soát quầy thu ngân", action: "assign" as const, button: "Xem việc" },
    { id: "inactive", tone: "neutral" as const, area: "Khách hàng", title: `${data.customers.inactive} khách hơn 45 ngày chưa quay lại`, detail: "Có thể tạo một lời mời quay lại", action: "customers" as const, button: "Chăm lại" },
    { id: "feedback", tone: "neutral" as const, area: "Khách hàng", title: "1 phản hồi 2 sao chưa trả lời", detail: "Khách chờ món lâu trong giờ cao điểm", action: "feedback" as const, button: "Phản hồi" },
    { id: "dna", tone: "success" as const, area: "Thương hiệu", title: "Còn 3 điểm chạm cần chuẩn hóa", detail: "Bao bì, kịch bản chào khách, mẫu trả lời review", action: "brand" as const, button: "Cập nhật" },
  ].filter((item) => !resolved.includes(item.id)), [data.customers.inactive, resolved]);

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
    toast("Đã lưu ưu đãi mẫu cho 87 khách");
  };

  const saveBrand = () => {
    setBrandReadiness(91);
    setResolved((current) => [...current, "dna"]);
    setAction(null);
    toast("DNA thương hiệu đã được cập nhật");
  };

  const saveFeedback = () => {
    setResolved((current) => [...current, "feedback"]);
    setAction(null);
    toast("Đã lưu câu trả lời mẫu");
  };

  return (
    <>
      <section className="dashboard-head" id="today">
        <div>
          <p className="eyebrow">TRUNG TÂM ĐIỀU HÀNH · HÔM NAY</p>
          <h1>Nắm quán. Chốt việc.</h1>
          <p>Chỉ hiện những gì chủ quán cần biết và cần làm tiếp.</p>
        </div>
        <div className="dashboard-head__tools">
          <label>Phạm vi<select value={location} onChange={(event) => setLocation(event.target.value)}><option>Tất cả cơ sở</option><option>Nguyễn Thái Học</option><option>Trần Phú</option></select></label>
          <span>{snapshot.generatedAtLabel}</span>
        </div>
      </section>

      <section className="daily-kpis" aria-label="Chỉ số chính hôm nay">
        <article><span className="metric-icon metric-icon--blue">N</span><div><small>Nhân sự vào ca</small><strong>{data.operations.staffCheckedIn}/{data.operations.staffScheduled}</strong><p><b className="is-warning">1 người cần kiểm tra</b></p></div></article>
        <article><span className="metric-icon metric-icon--orange">V</span><div><small>Việc đúng chuẩn</small><strong>{data.operations.tasksCompleted}/{data.operations.tasksTotal}</strong><p>{data.operations.overdue} việc đang trễ</p></div></article>
        <article><span className="metric-icon metric-icon--purple">K</span><div><small>Khách quay lại</small><strong>{data.customers.returningToday}</strong><p>+{data.customers.newToday} khách mới hôm nay</p></div></article>
        <article><span className="metric-icon metric-icon--green">D</span><div><small>DNA sẵn sàng</small><strong>{brandReadiness}%</strong><p>{data.brand.ideasToday} ý tưởng phù hợp</p></div></article>
      </section>

      <section className="dashboard-grid dashboard-grid--primary">
        <div className="dashboard-panel priority-panel">
          <SectionIntro eyebrow="QUẢN LÝ THEO NGOẠI LỆ" title="Cần bạn xử lý" aside={<span className="count-pill">{priorities.length} việc</span>} />
          <div className="priority-list">
            {priorities.length ? priorities.map((item) => (
              <div className="priority-item" key={item.id}>
                <StatusMark tone={item.tone} />
                <div><small>{item.area}</small><strong>{item.title}</strong><p>{item.detail}</p></div>
                <button onClick={() => setAction(item.action)}>{item.button}</button>
              </div>
            )) : <div className="empty-state"><strong>Đã xử lý hết việc cần chú ý</strong><p>Các chỉ số khác vẫn được cập nhật phía dưới.</p></div>}
          </div>
        </div>

        <aside className="dashboard-panel quick-actions">
          <SectionIntro eyebrow="LÀM NGAY" title="Thao tác nhanh" />
          <button onClick={() => setAction("assign")}><span>01</span><div><strong>Phân công việc</strong><small>Giao từ SOP có sẵn</small></div><Arrow /></button>
          <button onClick={() => setAction("customers")}><span>02</span><div><strong>Chăm khách cũ</strong><small>Chọn nhóm và ưu đãi</small></div><Arrow /></button>
          <button onClick={() => setAction("brand")}><span>03</span><div><strong>Cập nhật quán</strong><small>Bổ sung DNA và điểm chạm</small></div><Arrow /></button>
        </aside>
      </section>

      <section className="dashboard-grid dashboard-grid--signals">
        <article className="dashboard-panel signal-card signal-card--ops">
          <div className="signal-card__head"><div><p className="eyebrow">VẬN HÀNH</p><h2>Quán có chạy đúng chuẩn?</h2></div><Link href="/demo/ops">Mở Ops <Arrow /></Link></div>
          <div className="signal-stats"><div><strong>{data.operations.overdue}</strong><span>việc trễ</span></div><div><strong>{data.operations.pendingReview}</strong><span>chờ duyệt</span></div><div><strong>{data.operations.openIssues}</strong><span>sự cố mở</span></div><div><strong>{data.operations.cashDifference}</strong><span>lệch bàn giao</span></div></div>
          <div className="branch-list">
            {data.branches.map((branch) => <div key={branch.name}><p><strong>{branch.name}</strong><span>{branch.completion}% · {branch.status}</span></p><i><b style={{ width: `${branch.completion}%` }} /></i></div>)}
          </div>
        </article>

        <article className="dashboard-panel signal-card signal-card--loyalty">
          <div className="signal-card__head"><div><p className="eyebrow">KHÁCH HÀNG</p><h2>Khách có quay lại?</h2></div><Link href="/demo/loyalty">Mở Loyalty <Arrow /></Link></div>
          <div className="customer-number"><strong>{data.customers.total}</strong><span>hồ sơ khách đã lưu</span></div>
          <div className="customer-pulse"><span><b>{data.customers.vouchersToday}</b> voucher dùng hôm nay</span><span><b>{data.customers.gamePlaysToday}</b> lượt chơi</span><span><b>{data.customers.feedbackPending}</b> phản hồi cần xử lý</span></div>
          <button className="inline-action" onClick={() => setAction("customers")}>{offerReady ? "Ưu đãi mẫu đã sẵn sàng" : `Chăm lại ${data.customers.inactive} khách cũ`} <Arrow /></button>
        </article>

        <article className="dashboard-panel signal-card signal-card--brand">
          <div className="signal-card__head"><div><p className="eyebrow">THƯƠNG HIỆU</p><h2>Hôm nay nên làm gì?</h2></div><Link href="/demo/marketing">Mở Marketing <Arrow /></Link></div>
          <div className="brand-readiness"><div className="brand-ring" style={{ "--progress": `${brandReadiness * 3.6}deg` } as React.CSSProperties}><span>{brandReadiness}%</span></div><div><strong>DNA đã đủ để AI hiểu quán</strong><p>Còn {data.brand.touchpointsPending} điểm chạm cần bổ sung.</p></div></div>
          <div className="today-idea"><small>GỢI Ý ĐÁNG LÀM</small><strong>Đẩy nhóm đồ uống mát vào khung giờ chiều.</strong><span>Dựa trên DNA, nhóm món và bối cảnh hôm nay.</span></div>
          <button className="inline-action" onClick={() => setAction("brand")}>Bổ sung dữ liệu quán <Arrow /></button>
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
        <div className="deep-tools-grid">
          <Link href="/demo/ops"><span>NHÂN SỰ VÀ SOP</span><h3>ANLIEN Ops</h3><p>Ca làm, bằng chứng, duyệt việc, sự cố và đào tạo.</p><Arrow /></Link>
          <Link href="/demo/loyalty"><span>KHÁCH VÀ LƯỢT QUAY LẠI</span><h3>ANLIEN Loyalty</h3><p>Hồ sơ khách, trò chơi, Xu, voucher và phản hồi.</p><Arrow /></Link>
          <Link href="/demo/marketing"><span>DNA VÀ Ý TƯỞNG</span><h3>ANLIEN Marketing</h3><p>DNA thương hiệu, điểm chạm và cố vấn cho quán.</p><Arrow /></Link>
        </div>
      </section>

      {notice ? <div className="dashboard-toast" role="status">✓ {notice}</div> : null}

      {action ? (
        <div className="dashboard-drawer-backdrop">
          <button className="drawer-overlay-close" onClick={() => setAction(null)} aria-label="Đóng bảng thao tác" />
          <aside className="dashboard-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
            <button className="drawer-close" onClick={() => setAction(null)} aria-label="Đóng">×</button>
            {action === "assign" ? <AssignForm onSave={addAssignment} /> : null}
            {action === "customers" ? <CustomerForm count={data.customers.inactive} onSave={prepareOffer} /> : null}
            {action === "brand" ? <BrandForm onSave={saveBrand} /> : null}
            {action === "feedback" ? <FeedbackForm onSave={saveFeedback} /> : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}

function AssignForm({ onSave }: { onSave: () => void }) {
  return <><p className="eyebrow">OPS · GIAO TỪ SOP</p><h2 id="drawer-title">Phân công việc</h2><p className="drawer-lead">Chọn quy trình chuẩn, người làm và hạn hoàn thành.</p><div className="drawer-form"><label>Công việc<select defaultValue="Kiểm tra khu vực khách"><option>Kiểm tra khu vực khách</option><option>Đối soát quầy thu ngân</option><option>Vệ sinh quầy bar cuối ca</option></select></label><label>Người phụ trách<select defaultValue="Nam"><option>Nam</option><option>Linh</option><option>Minh</option></select></label><div className="drawer-form__split"><label>Hạn hoàn thành<input defaultValue="19:15" type="time" /></label><label>Ưu tiên<select><option>Bình thường</option><option>Cao</option><option>Khẩn cấp</option></select></label></div><label>Yêu cầu bằng chứng<select><option>1 ảnh sau khi hoàn thành</option><option>Không cần ảnh</option></select></label></div><div className="drawer-preview"><span>Quy trình chuẩn</span><strong>4 bước · 1 ảnh đối chiếu · Quản lý duyệt</strong></div><button className="button button--primary drawer-submit" onClick={onSave}>Giao việc mẫu</button></>;
}

function CustomerForm({ count, onSave }: { count: number; onSave: () => void }) {
  return <><p className="eyebrow">LOYALTY · GIỮ KHÁCH</p><h2 id="drawer-title">Mời khách quay lại</h2><p className="drawer-lead">Hệ thống đã tìm nhóm khách có nguy cơ rời đi.</p><div className="segment-preview"><strong>{count}</strong><span>khách không có hoạt động trong 45 ngày</span></div><div className="drawer-form"><label>Quà quay lại<select><option>Tặng 20 Xu</option><option>Voucher giảm 15%</option><option>Tặng topping</option></select></label><label>Hiệu lực<select><option>7 ngày</option><option>14 ngày</option></select></label><label>Lời nhắn<textarea defaultValue="Lâu rồi chưa gặp bạn. FnB Ăn Liền gửi tặng 20 Xu cho lần ghé tới nhé!" /></label></div><div className="demo-action-note">Đây là thao tác demo. Không có tin nhắn thật được gửi.</div><button className="button button--primary drawer-submit" onClick={onSave}>Lưu ưu đãi mẫu</button></>;
}

function BrandForm({ onSave }: { onSave: () => void }) {
  return <><p className="eyebrow">MARKETING · BỘ NHỚ QUÁN</p><h2 id="drawer-title">Cập nhật DNA</h2><p className="drawer-lead">Thông tin này giúp các trợ lý hiểu đúng quán trước khi gợi ý.</p><div className="drawer-form"><label>Món chủ lực<input defaultValue="Trà trái cây và cà phê pha máy" /></label><label>Lý do khách quay lại<input defaultValue="Nhanh, vui, vừa túi tiền" /></label><div className="drawer-form__split"><label>Giờ đông khách<input defaultValue="11:30 · 17:30" /></label><label>Chi tiêu trung bình<input defaultValue="59.000đ" /></label></div><label>Điểm chạm đang bổ sung<select><option>Bao bì mang đi</option><option>Kịch bản chào khách</option><option>Mẫu trả lời review</option></select></label></div><button className="button button--primary drawer-submit" onClick={onSave}>Lưu vào DNA mẫu</button></>;
}

function FeedbackForm({ onSave }: { onSave: () => void }) {
  return <><p className="eyebrow">LOYALTY · PHẢN HỒI</p><h2 id="drawer-title">Trả lời khách</h2><p className="drawer-lead">Khách đánh giá 2 sao vì chờ món lâu trong giờ cao điểm.</p><div className="feedback-quote">“Đồ uống ổn nhưng mình phải chờ gần 25 phút.”</div><div className="drawer-form"><label>Câu trả lời gợi ý<textarea defaultValue="FnB Ăn Liền xin lỗi vì đã để bạn chờ lâu. Quán đã ghi nhận khung giờ này để điều chỉnh nhân sự. Mong được đón bạn ở lần ghé tới tốt hơn." /></label><label>Chuyển thành việc vận hành<select><option>Tạo việc rà soát giờ cao điểm</option><option>Chưa cần</option></select></label></div><button className="button button--primary drawer-submit" onClick={onSave}>Lưu phản hồi mẫu</button></>;
}
