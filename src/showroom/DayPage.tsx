import Link from "next/link";
import type { DemoSnapshot } from "@/src/contracts/shell";
import { SectionIntro } from "./ui";

const productLabel = {
  overview: "Tổng quan",
  marketing: "Marketing",
  loyalty: "Loyalty",
  ops: "Ops",
} as const;

export function DayPage({ snapshot }: { snapshot: DemoSnapshot }) {
  return (
    <div className="day-page">
      <header className="day-hero">
        <div><p className="eyebrow">MỘT NGÀY VỚI ANLIEN</p><h1>Từ mở quán<br />đến chốt ngày.</h1></div>
        <p>Mỗi tín hiệu dẫn tới một việc rõ ràng.</p>
      </header>
      <section className="timeline-section">
        <SectionIntro eyebrow="FN B ĂN LIỀN · NGÀY MẪU" title="Một ngày, năm thời điểm cần nắm" />
        <ol className="day-timeline">
          {snapshot.timeline.map((moment, index) => (
            <li key={moment.time} className={`day-moment day-moment--${moment.product}`}>
              <time>{moment.time}</time>
              <span className="day-moment__line"><i>{index + 1}</i></span>
              <div>
                <span>{productLabel[moment.product]}</span>
                <h2>{moment.label}</h2>
                <p>{moment.message}</p>
                <strong>→ {moment.action}</strong>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="day-outro">
        <p className="eyebrow">22:31 · BẠN ĐÃ NẮM ĐƯỢC CẢ NGÀY</p>
        <h2>Việc còn lại đã rõ.<br />Ngày mai bắt đầu gọn hơn.</h2>
        <Link href="/demo" className="button button--light">Quay lại tổng quan ↗</Link>
      </section>
    </div>
  );
}
