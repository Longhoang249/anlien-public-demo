import Link from "next/link";
import type { DemoSnapshot } from "@/src/contracts/shell";
import { Arrow, SectionIntro, StatusMark } from "./ui";

const ownerAssets = [
  {
    key: "people",
    eyebrow: "NHÂN SỰ",
    value: "8 / 9",
    label: "đã vào ca",
    facts: ["17 / 20 checklist", "2 việc đang chậm"],
    href: "/demo/ops",
    action: "Xem vận hành",
  },
  {
    key: "customers",
    eyebrow: "KHÁCH HÀNG",
    value: "486",
    label: "khách đã lưu",
    facts: ["87 khách lâu chưa quay lại", "18 voucher đã dùng"],
    href: "/demo/loyalty",
    action: "Xem khách hàng",
  },
  {
    key: "brand",
    eyebrow: "THƯƠNG HIỆU",
    value: "DNA",
    label: "đã chuẩn hóa",
    facts: ["4 ý tưởng hôm nay", "3 điểm chạm cần bổ sung"],
    href: "/demo/marketing",
    action: "Xem thương hiệu",
  },
] as const;

const attentionItems = [
  { id: "staff", tone: "warning", label: "Nam chưa vào ca tối", href: "/demo/ops" },
  { id: "customers", tone: "neutral", label: "87 khách đã hơn 45 ngày chưa quay lại", href: "/demo/loyalty" },
  { id: "dna", tone: "success", label: "Brand DNA đã sẵn sàng", href: "/demo/marketing" },
  { id: "ideas", tone: "neutral", label: "Có 4 ý tưởng phù hợp hôm nay", href: "/demo/marketing" },
] as const;

export function OverviewPage({
  snapshot,
}: {
  snapshot: DemoSnapshot;
}) {
  return (
    <>
      <section className="hero owner-hero" id="today">
        <div className="owner-hero__intro">
          <p className="eyebrow">FN B ĂN LIỀN · HÔM NAY</p>
          <h1>Quán hôm nay ra sao?</h1>
          <p className="owner-hero__axes">Nhân sự <span>·</span> Khách hàng <span>·</span> Thương hiệu</p>
        </div>
        <div className="owner-pulse" aria-label="Tóm tắt quán hôm nay">
          <div><strong>8/9</strong><span>nhân sự đã vào ca</span></div>
          <div><strong>87</strong><span>khách cần nhớ tới</span></div>
          <div><strong>4</strong><span>ý tưởng đáng làm</span></div>
          <small>{snapshot.generatedAtLabel}</small>
        </div>
      </section>

      <section className="attention-section" id="attention">
        <SectionIntro
          eyebrow="OWNER COMMAND CENTER"
          title="Cần bạn chú ý"
          aside={<span className="count-pill">4 việc</span>}
        />
        <div className="attention-list owner-attention-list">
          {attentionItems.map((item) => (
            <Link key={item.id} className="attention-row" href={item.href}>
              <StatusMark tone={item.tone} />
              <span className="attention-row__copy"><strong>{item.label}</strong></span>
              <span className="attention-row__view">Xem</span>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>

      <section className="summary-section owner-assets-section">
        <SectionIntro
          eyebrow="BA TÀI SẢN SỐNG CÒN"
          title="Nắm quán trong một lượt xem"
        />
        <div className="owner-assets-grid">
          {ownerAssets.map((asset) => (
            <article key={asset.key} className={`owner-asset owner-asset--${asset.key}`}>
              <p className="eyebrow">{asset.eyebrow}</p>
              <div className="owner-asset__metric"><strong>{asset.value}</strong><span>{asset.label}</span></div>
              <ul>{asset.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
              <Link href={asset.href} className="text-link">{asset.action} <Arrow /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="idea-today">
        <div>
          <p className="eyebrow">HÔM NAY NÊN LÀM GÌ?</p>
          <h2>Đẩy nhóm đồ uống mát vào nội dung chiều nay.</h2>
          <p>Gợi ý này dựa trên Brand DNA, nhóm món và bối cảnh hôm nay của FnB Ăn Liền.</p>
        </div>
        <Link href="/demo/marketing" className="button button--primary">Xem ý tưởng <Arrow /></Link>
      </section>

      <section className="deep-tools-section">
        <SectionIntro eyebrow="KHI CẦN LÀM VIỆC SÂU" title="Ba không gian, chung một trí nhớ về quán" />
        <div className="deep-tools-grid">
          <Link href="/demo/marketing">
            <span>THƯƠNG HIỆU</span><h3>ANLIEN Marketing</h3><p>Brand DNA · Kho ý tưởng · Điểm chạm · Trợ lý cố vấn</p><Arrow />
          </Link>
          <Link href="/demo/loyalty">
            <span>KHÁCH HÀNG</span><h3>ANLIEN Loyalty</h3><p>Hồ sơ khách · Phân nhóm · Voucher · Khách quay lại</p><Arrow />
          </Link>
          <Link href="/demo/ops">
            <span>NHÂN SỰ</span><h3>ANLIEN Ops</h3><p>Ca làm · Check-in · Checklist · SOP và công việc</p><Arrow />
          </Link>
        </div>
      </section>

      <section className="day-teaser compact-day-teaser">
        <div><p className="eyebrow">MỘT NGÀY VỚI ANLIEN</p><h2>Biết chuyện gì xảy ra. Biết việc gì cần làm.</h2></div>
        <Link href="/demo/day" className="button button--light">Xem hành trình <Arrow /></Link>
      </section>
    </>
  );
}
