"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DemoSnapshot, OwnerActionKey, OwnerAssignment, SummaryMetric } from "@/src/contracts/shell";
import { Arrow, StatusMark } from "./ui";
import styles from "./command-center-v3.module.css";

type DashboardAction = OwnerActionKey | null;

const statusLabel: Record<OwnerAssignment["status"], string> = {
  doing: "Đang làm",
  review: "Chờ duyệt",
  late: "Đang trễ",
};

const sourceLabel = {
  ops: "Vận hành",
  loyalty: "Khách hàng",
  marketing: "Thương hiệu",
} as const;

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

  const operationalAttention = priorities.filter((item) => item.owner === "ops").length;

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
    toast(`Đã lưu ưu đãi mẫu cho ${metrics.inactiveCustomers.value} thành viên`);
  };

  const saveBrand = () => {
    setBrandReadiness(91);
    setResolved((current) => [...current, "dna"]);
    setAction(null);
    toast("DNA thương hiệu mẫu đã được cập nhật");
  };

  return (
    <>
      <section className={styles.commandHero} id="today">
        <div className={styles.commandHeroIntro}>
          <p className="eyebrow">TỔNG QUAN · HÔM NAY</p>
          <h1>Nắm quán. Chốt việc.</h1>
          <p className={styles.commandHeroLead}>
            {operationalAttention > 0
              ? `Quán đang hoạt động. Có ${operationalAttention} việc vận hành cần bạn chú ý.`
              : "Quán đang hoạt động ổn định. Chưa có ngoại lệ vận hành cần bạn xử lý."}
          </p>
        </div>

        <div className={styles.commandHeroTools}>
          <label>
            <span>Phạm vi</span>
            <select value={locationId} onChange={(event) => setLocationId(event.target.value)}>
              <option value="all">Tất cả cơ sở</option>
              {snapshot.locations.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <small>{snapshot.generatedAtLabel}</small>
        </div>

        <div className={styles.healthStrip} aria-label="Sức khỏe các mảng hôm nay">
          <HealthItem label="Vận hành" state={operationalAttention > 0 ? "attention" : "good"} text={operationalAttention > 0 ? "Cần chú ý" : "Ổn định"} />
          <HealthItem label="Khách hàng" state="good" text="Đang có tín hiệu" />
          <HealthItem label="Thương hiệu" state={metrics.touchpointsPending.value === "0" ? "good" : "attention"} text={metrics.touchpointsPending.value === "0" ? "Đủ bối cảnh" : "Cần bổ sung"} />
        </div>
      </section>

      <section className={styles.inboxLayout} id="owner-inbox">
        <div className={styles.panel}>
          <div className={styles.sectionHead}>
            <div>
              <p className="eyebrow">OWNER INBOX</p>
              <h2>Cần bạn xử lý</h2>
              <p>Chỉ gom những việc cần quyết định hoặc can thiệp của chủ quán.</p>
            </div>
            <span className={styles.countBadge}>{priorities.length} việc</span>
          </div>

          <div className={styles.inboxList}>
            {priorities.length ? priorities.map((item) => (
              <article className={styles.inboxItem} key={item.id}>
                <StatusMark tone={item.tone} />
                <div className={styles.inboxCopy}>
                  <small>{sourceLabel[item.owner]} · {item.area}</small>
                  <strong>{item.title}</strong>
                  {item.detail ? <p>{item.detail}</p> : null}
                </div>
                <button onClick={() => setAction(item.action)}>{item.actionLabel}</button>
              </article>
            )) : (
              <div className={styles.emptyInbox}>
                <strong>Đã xử lý hết việc cần chú ý</strong>
                <p>ANLIEN sẽ đưa ngoại lệ mới về đây khi có tín hiệu cần chủ quán can thiệp.</p>
              </div>
            )}
          </div>
        </div>

        <aside className={`${styles.panel} ${styles.quickPanel}`}>
          <p className="eyebrow">LÀM NHANH</p>
          <h2>Tạo việc mới</h2>
          <p className={styles.quickLead}>Đi thẳng vào hành động, không cần chọn ứng dụng trước.</p>
          <div className={styles.quickList}>
            {data.quickActions.map((item) => (
              <button key={item.id} onClick={() => setAction(item.action)}>
                <span>{item.id}</span>
                <div><strong>{item.label}</strong><small>{item.detail}</small></div>
                <Arrow />
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.todaySection}>
        <div className={styles.sectionHeadSimple}>
          <div><p className="eyebrow">HÔM NAY</p><h2>Một vòng là nắm được quán</h2></div>
          <small>Dữ liệu mẫu · chưa kết nối POS</small>
        </div>
        <div className={styles.kpiGrid}>
          <MetricCard metric={metrics.taskCompletion} accent="ops" />
          <MetricCard metric={metrics.loyaltySignalsToday} accent="loyalty" />
          <MetricCard metric={metrics.staffCheckIn} accent="ops" />
          <article className={styles.kpiCard}>
            <span className={`${styles.kpiMark} ${styles.kpiMarkAttention}`}>!</span>
            <div><small>Cần bạn xử lý</small><strong>{priorities.length}</strong><p>Ngoại lệ đang mở</p></div>
          </article>
        </div>
      </section>

      <section className={styles.domainGrid}>
        <article className={`${styles.panel} ${styles.domainCard}`}>
          <div className={styles.domainHead}>
            <div><p className={`${styles.domainEyebrow} ${styles.opsText}`}>VẬN HÀNH HÔM NAY</p><h2>Cái gì đang lệch?</h2></div>
            <Link href="/demo/ops">Mở Vận hành <Arrow /></Link>
          </div>
          <div className={styles.domainMetrics}>
            <DomainMetric value={metrics.staffCheckIn.value} label="Nhân sự vào ca" />
            <DomainMetric value={metrics.taskCompletion.value} label="Việc hoàn thành" />
            <DomainMetric value={metrics.opsOverdue.value} label="Việc đang trễ" attention />
            <DomainMetric value={metrics.opsPendingReview.value} label="Chờ duyệt" />
          </div>
          <div className={styles.branchCompact}>
            {data.branches.map((branch) => {
              const location = snapshot.locations.find((item) => item.id === branch.locationId);
              return (
                <div key={branch.locationId}>
                  <span><strong>{location?.name ?? "Cơ sở demo"}</strong><small>{branch.status}</small></span>
                  <b>{branch.completion.value}</b>
                </div>
              );
            })}
          </div>
        </article>

        <article className={`${styles.panel} ${styles.domainCard}`}>
          <div className={styles.domainHead}>
            <div><p className={`${styles.domainEyebrow} ${styles.loyaltyText}`}>KHÁCH HÀNG HÔM NAY</p><h2>Khách đang có tín hiệu gì?</h2></div>
            <Link href="/demo/loyalty">Mở Khách hàng <Arrow /></Link>
          </div>
          <div className={styles.domainMetrics}>
            <DomainMetric value={metrics.loyaltySignalsToday.value} label="Tín hiệu hôm nay" />
            <DomainMetric value={metrics.newToday.value} label="Thành viên mới" />
            <DomainMetric value={metrics.vouchersToday.value} label="Voucher đã dùng" />
            <DomainMetric value={metrics.gamePlaysToday.value} label="Lượt chơi" />
          </div>
          <button className={styles.domainAction} onClick={() => setAction("customers")}>
            <span><strong>{metrics.inactiveCustomers.value} thành viên</strong><small>không có hoạt động Loyalty quan sát được trong 45 ngày</small></span>
            <Arrow />
          </button>
        </article>
      </section>

      <section className={`${styles.panel} ${styles.brandPanel}`}>
        <div className={styles.domainHead}>
          <div><p className={`${styles.domainEyebrow} ${styles.brandText}`}>THƯƠNG HIỆU &amp; MARKETING</p><h2>Hôm nay nên làm gì?</h2></div>
          <Link href="/demo/marketing">Mở Thương hiệu <Arrow /></Link>
        </div>
        <div className={styles.brandBody}>
          <div className={styles.brandScore}>
            <span>Demo score</span>
            <strong>{brandReadiness}%</strong>
            <small>DNA thương hiệu mẫu</small>
          </div>
          <div className={styles.brandSuggestion}>
            <span>GỢI Ý ĐÁNG LÀM</span>
            <h3>{snapshot.marketing.suggestion}</h3>
            <p>{snapshot.marketing.reasons.join(" · ")}</p>
          </div>
          <div className={styles.brandStats}>
            <DomainMetric value={metrics.ideasToday.value} label="Ý tưởng hôm nay" />
            <DomainMetric value={metrics.touchpointsPending.value} label="Điểm chạm cần bổ sung" attention />
          </div>
        </div>
      </section>

      <section className={styles.bottomGrid}>
        <div className={`${styles.panel} ${styles.insightPanel}`}>
          <div className={styles.sectionHeadSimple}>
            <div><p className="eyebrow">CƠ HỘI &amp; RỦI RO</p><h2>Điều đáng để nhìn kỹ</h2></div>
          </div>
          <div className={styles.insightList}>
            <button onClick={() => setAction("customers")}>
              <span className={styles.insightIndex}>01</span>
              <span><strong>{metrics.inactiveCustomers.value} thành viên chưa có hoạt động Loyalty quan sát được trong 45 ngày.</strong><small>Có thể chuẩn bị một ưu đãi tái kích hoạt mẫu. Không đồng nghĩa họ chưa quay lại quán.</small></span>
              <Arrow />
            </button>
            <Link href="/demo/ops">
              <span className={styles.insightIndex}>02</span>
              <span><strong>{metrics.opsOverdue.value} việc vận hành đang trễ.</strong><small>Ưu tiên xem ngoại lệ thay vì đọc toàn bộ checklist.</small></span>
              <Arrow />
            </Link>
            <Link href="/demo/marketing">
              <span className={styles.insightIndex}>03</span>
              <span><strong>Có {metrics.ideasToday.value} ý tưởng phù hợp với bối cảnh thương hiệu hôm nay.</strong><small>Đây là gợi ý theo yêu cầu trong Demo, không phải chiến dịch tự động.</small></span>
              <Arrow />
            </Link>
          </div>
        </div>

        <div className={`${styles.panel} ${styles.activityPanel}`}>
          <div className={styles.sectionHeadSimple}>
            <div><p className="eyebrow">HOẠT ĐỘNG GẦN ĐÂY</p><h2>Quán đang làm gì?</h2></div>
          </div>
          <div className={styles.activityList}>
            {snapshot.timeline.slice().reverse().map((item) => (
              <div key={`${item.time}-${item.label}`}>
                <time>{item.time}</time>
                <span className={styles.activityDot} />
                <p><strong>{item.label}</strong><span>{item.message}</span></p>
              </div>
            ))}
          </div>
          <div className={styles.assignmentMini}>
            <span>Đang phân công</span>
            {assignments.slice(0, 3).map((item) => (
              <div key={item.id}><strong>{item.task}</strong><small>{item.assignee} · {item.due} · {statusLabel[item.status]}</small></div>
            ))}
          </div>
        </div>
      </section>

      {notice ? <div className="dashboard-toast" role="status">✓ {notice}</div> : null}

      {action ? (
        <div className="dashboard-drawer-backdrop">
          <button className="drawer-overlay-close" onClick={() => setAction(null)} aria-label="Đóng bảng thao tác" />
          <aside className="dashboard-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
            <button className="drawer-close" onClick={() => setAction(null)} aria-label="Đóng">×</button>
            {action === "assign" ? <AssignForm onSave={addAssignment} /> : null}
            {action === "customers" ? <CustomerForm count={metrics.inactiveCustomers.value} onSave={prepareOffer} ready={offerReady} /> : null}
            {action === "idea" ? <IdeaForm snapshot={snapshot} /> : null}
            {action === "brand" ? <BrandForm onSave={saveBrand} /> : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}

function HealthItem({ label, state, text }: { label: string; state: "good" | "attention"; text: string }) {
  return (
    <div className={styles.healthItem}>
      <span className={`${styles.healthDot} ${state === "good" ? styles.healthGood : styles.healthAttention}`} />
      <p><small>{label}</small><strong>{text}</strong></p>
    </div>
  );
}

function MetricCard({ metric, accent }: { metric: SummaryMetric; accent: "ops" | "loyalty" }) {
  return (
    <article className={styles.kpiCard}>
      <span className={`${styles.kpiMark} ${accent === "ops" ? styles.kpiMarkOps : styles.kpiMarkLoyalty}`}>
        {accent === "ops" ? "V" : "K"}
      </span>
      <div><small>{metric.label}</small><strong>{metric.value}</strong>{metric.detail ? <p>{metric.detail}</p> : null}</div>
    </article>
  );
}

function DomainMetric({ value, label, attention = false }: { value: string; label: string; attention?: boolean }) {
  return <div className={styles.domainMetric}><strong className={attention ? styles.attentionValue : ""}>{value}</strong><span>{label}</span></div>;
}

function AssignForm({ onSave }: { onSave: () => void }) {
  return <><p className="eyebrow">OPS · GIAO TỪ SOP</p><h2 id="drawer-title">Phân công việc</h2><p className="drawer-lead">Chọn quy trình chuẩn, người làm và hạn hoàn thành.</p><div className="drawer-form"><label>Công việc<select defaultValue="Kiểm tra khu vực khách"><option>Kiểm tra khu vực khách</option><option>Đối soát quầy thu ngân</option><option>Vệ sinh quầy bar cuối ca</option></select></label><label>Người phụ trách<select defaultValue="Nam"><option>Nam</option><option>Linh</option><option>Minh</option></select></label><div className="drawer-form__split"><label>Hạn hoàn thành<input defaultValue="19:15" type="time" /></label><label>Ưu tiên<select><option>Bình thường</option><option>Cao</option><option>Khẩn cấp</option></select></label></div><label>Yêu cầu bằng chứng<select><option>1 ảnh sau khi hoàn thành</option><option>Không cần ảnh</option></select></label></div><div className="drawer-preview"><span>Quy trình chuẩn</span><strong>4 bước · 1 ảnh đối chiếu · Quản lý duyệt</strong></div><button className="button button--primary drawer-submit" onClick={onSave}>Giao việc mẫu</button></>;
}

function CustomerForm({ count, onSave, ready }: { count: string; onSave: () => void; ready: boolean }) {
  return <><p className="eyebrow">LOYALTY · DEMO TÁI KÍCH HOẠT</p><h2 id="drawer-title">{ready ? "Ưu đãi mẫu đã sẵn sàng" : "Chuẩn bị ưu đãi mẫu"}</h2><p className="drawer-lead">Nhóm này chỉ phản ánh hoạt động Loyalty quan sát được, chưa có dữ liệu mua hàng POS đầy đủ.</p><div className="segment-preview"><strong>{count}</strong><span>thành viên không có hoạt động Loyalty quan sát được trong 45 ngày</span></div><div className="drawer-form"><label>Ưu đãi mẫu<select><option>Tặng 20 Xu</option><option>Voucher giảm 15%</option><option>Tặng topping</option></select></label><label>Hiệu lực<select><option>7 ngày</option><option>14 ngày</option></select></label><label>Lời nhắn<textarea defaultValue="Lâu rồi chưa gặp bạn. FnB Ăn Liền gửi tặng 20 Xu cho lần ghé tới nhé!" /></label></div><div className="demo-action-note">Đây là thao tác demo. Không có tin nhắn thật được gửi.</div><button className="button button--primary drawer-submit" onClick={onSave}>Lưu ưu đãi mẫu</button></>;
}

function IdeaForm({ snapshot }: { snapshot: DemoSnapshot }) {
  return <><p className="eyebrow">MARKETING · GỢI Ý HÔM NAY</p><h2 id="drawer-title">{snapshot.marketing.suggestion}</h2><p className="drawer-lead">Dựa trên DNA, nhóm món và bối cảnh hôm nay.</p><div className="idea-drawer-reasons">{snapshot.marketing.reasons.map((reason) => <span key={reason}>✓ {reason}</span>)}</div><Link className="button button--primary drawer-submit" href="/demo/marketing">Xem ý tưởng</Link></>;
}

function BrandForm({ onSave }: { onSave: () => void }) {
  return <><p className="eyebrow">MARKETING · BỘ NHỚ QUÁN</p><h2 id="drawer-title">Cập nhật DNA</h2><p className="drawer-lead">Thông tin này giúp các trợ lý hiểu đúng quán trước khi gợi ý.</p><div className="drawer-form"><label>Món chủ lực<input defaultValue="Trà trái cây và cà phê" /></label><label>Khách chính<input defaultValue="18 đến 30 tuổi" /></label><label>Giọng thương hiệu<input defaultValue="Trẻ, gần gũi, tinh nghịch" /></label></div><div className="demo-action-note">Điểm phần trăm trên Demo là điểm mô phỏng, chưa phải công thức production.</div><button className="button button--primary drawer-submit" onClick={onSave}>Lưu bản Demo</button></>;
}
