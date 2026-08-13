import Link from "next/link";
import type { DemoSnapshot, ProductKey, RoleKey } from "@/src/contracts/shell";
import { Arrow, DemoBadge, ScopeBadge, SectionIntro, StatusMark } from "./ui";

const productMeta: Record<
  ProductKey,
  { label: string; promise: string; english: string; href: string; number: string }
> = {
  marketing: {
    label: "Marketing",
    promise: "Kéo khách",
    english: "Get Customers",
    href: "/demo/marketing",
    number: "01",
  },
  loyalty: {
    label: "Loyalty",
    promise: "Giữ khách",
    english: "Keep Customers",
    href: "/demo/loyalty",
    number: "02",
  },
  ops: {
    label: "Ops",
    promise: "Vận hành",
    english: "Run Better",
    href: "/demo/ops",
    number: "03",
  },
};

const roleConfig: Record<
  RoleKey,
  { priority: string; visible: ProductKey[]; actions: string[] }
> = {
  owner: {
    priority: "Bạn chỉ cần xử lý 3 ngoại lệ — phần còn lại của quán đang chạy đúng nhịp.",
    visible: ["marketing", "loyalty", "ops"],
    actions: [
      "Tạo bài đăng",
      "Thiết kế ảnh",
      "Tạo ưu đãi",
      "Xem khách lâu chưa quay lại",
      "Xem ca hôm nay",
      "Kiểm tra checklist",
    ],
  },
  manager: {
    priority: "Ưu tiên ca tối: 1 nhân sự chưa check-in và 2 công việc cần xử lý.",
    visible: ["ops", "loyalty"],
    actions: ["Xem ca hôm nay", "Kiểm tra checklist", "Xem công việc", "Xem ưu đãi đang chạy"],
  },
  marketing: {
    priority: "Bản nháp đồ uống chiều đang chờ bạn duyệt trước 14:30.",
    visible: ["marketing", "loyalty"],
    actions: ["Tạo bài đăng", "Thiết kế ảnh", "Duyệt nội dung", "Xem nhóm khách"],
  },
  staff: {
    priority: "Ca tối bắt đầu lúc 17:00. Bạn còn 1 mục trong checklist mở ca.",
    visible: ["ops"],
    actions: ["Xem lịch làm", "Check-in", "Xem công việc", "Kiểm tra checklist"],
  },
};

const painItems = [
  { label: "Tôi không biết hôm nay đăng gì", product: "Marketing", href: "/demo/marketing" },
  { label: "Tôi muốn khách cũ quay lại", product: "Loyalty", href: "/demo/loyalty" },
  { label: "Tôi không muốn phải đứng quán cả ngày", product: "Ops", href: "/demo/ops" },
  { label: "Tôi muốn biết nhân viên có làm đúng việc không", product: "Ops", href: "/demo/ops" },
  { label: "Tôi muốn quản lý quán từ xa", product: "Tổng quan + Ops", href: "/demo/ops" },
  { label: "Tôi muốn xây thương hiệu bài bản hơn", product: "Marketing", href: "/demo/marketing" },
] as const;

export function OverviewPage({
  snapshot,
  role,
  onAction,
}: {
  snapshot: DemoSnapshot;
  role: RoleKey;
  onAction: (label: string) => void;
}) {
  const config = roleConfig[role];
  const summaries = config.visible.map((key) => snapshot.summaries[key]);
  const alerts = summaries.flatMap((summary) => summary.alerts);

  return (
    <>
      <section className="hero" id="today">
        <div className="hero__copy">
          <div className="hero__meta">
            <DemoBadge />
            <span>{snapshot.generatedAtLabel}</span>
          </div>
          <p className="eyebrow">Xin chào 👋</p>
          <h1>Hôm nay quán có gì cần chú ý?</h1>
          <p className="hero__lead">
            Mở ANLIEN là biết việc nào cần xử lý — từ bài đăng, khách quay lại đến ca làm tại quán.
          </p>
          <div className="hero__actions">
            <a href="#attention" className="button button--primary">
              Thử vận hành quán mẫu <span aria-hidden="true">↓</span>
            </a>
            <button className="button button--ghost" onClick={() => onAction("Dùng ANLIEN cho quán của bạn")}>
              Dùng ANLIEN cho quán của bạn
            </button>
          </div>
        </div>
        <aside className="today-card" aria-label="Nhịp quán hôm nay">
          <div className="today-card__head">
            <span className="eyebrow">NHỊP QUÁN · HÔM NAY</span>
            <span className="live-dot">Đang hoạt động</span>
          </div>
          <div className="today-card__big">
            <strong>8/9</strong>
            <span>nhân sự đã vào ca</span>
          </div>
          <div className="today-card__track" aria-label="8 trên 9 nhân sự đã vào ca">
            <span style={{ width: "88.8%" }} />
          </div>
          <div className="today-card__facts">
            <div><strong>17/20</strong><span>checklist</span></div>
            <div><strong>1</strong><span>bài chờ duyệt</span></div>
            <div><strong>87</strong><span>khách cần nhớ</span></div>
          </div>
          <p className="today-card__note">{config.priority}</p>
        </aside>
      </section>

      <section className="attention-section" id="attention">
        <SectionIntro
          eyebrow="ANLIEN GỢI Ý VIỆC TIẾP THEO"
          title="Cần bạn chú ý"
          description="Không phải xem hết dashboard. Chỉ cần bắt đầu từ những việc này."
          aside={<span className="count-pill">{alerts.length} việc</span>}
        />
        <div className="attention-list">
          {alerts.map((alert) => (
            <button key={alert.id} className="attention-row" onClick={() => onAction(alert.label)}>
              <StatusMark tone={alert.tone} />
              <span className="attention-row__copy">
                <strong>{alert.label}</strong>
                {alert.detail ? <small>{alert.detail}</small> : null}
              </span>
              <ScopeBadge scope={alert.scope} />
              <Arrow />
            </button>
          ))}
        </div>
      </section>

      <section className="summary-section">
        <SectionIntro
          eyebrow="MỘT NƠI, BA NHỊP CÔNG VIỆC"
          title="Kéo khách. Giữ khách. Vận hành tốt hơn."
          description="Mỗi sản phẩm giữ đúng dữ liệu và workflow của mình; ANLIEN chỉ gom phần bạn cần thấy hôm nay."
        />
        <div className={`summary-grid summary-grid--${summaries.length}`}>
          {summaries.map((summary) => {
            const meta = productMeta[summary.product];
            return (
              <article key={summary.product} className={`product-summary product-summary--${summary.product}`}>
                <div className="product-summary__head">
                  <span className="product-number">{meta.number}</span>
                  <div>
                    <p>{meta.promise}</p>
                    <h3>{meta.label}</h3>
                    <small>{meta.english}</small>
                  </div>
                  <ScopeBadge scope={summary.product === "ops" ? "location" : "business"} />
                </div>
                <div className="metrics">
                  {summary.metrics.map((metric) => (
                    <div className="metric" key={metric.id}>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>
                <Link href={meta.href} className="text-link">
                  Xem {meta.label} <Arrow />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="quick-section">
        <SectionIntro eyebrow="LÀM NGAY TRÊN QUÁN MẪU" title="Bạn muốn làm gì?" />
        <div className="quick-grid">
          {config.actions.map((action, index) => (
            <button key={action} onClick={() => onAction(action)} className="quick-action">
              <span className="quick-action__index">0{index + 1}</span>
              <span>{action}</span>
              <small>Demo</small>
            </button>
          ))}
        </div>
      </section>

      <section className="pain-section" id="problems">
        <SectionIntro
          eyebrow="KHÔNG CẦN BIẾT THUẬT NGỮ PHẦN MỀM"
          title="Bạn đang gặp vấn đề gì?"
          description="Chọn đúng câu đang làm bạn đau đầu. ANLIEN sẽ dẫn tới một workflow mẫu."
        />
        <div className="pain-grid">
          {painItems.map((item) => (
            <Link className="pain-card" href={item.href} key={item.label}>
              <span>{item.label}</span>
              <small>{item.product} <Arrow /></small>
            </Link>
          ))}
        </div>
      </section>

      <section className="day-teaser">
        <div>
          <p className="eyebrow">TỪ MỞ QUÁN ĐẾN CUỐI NGÀY</p>
          <h2>Ngày mai dùng ANLIEN, ngày của bạn sẽ khác thế nào?</h2>
        </div>
        <Link href="/demo/day" className="button button--light">
          Xem một ngày với ANLIEN <Arrow />
        </Link>
      </section>
    </>
  );
}

