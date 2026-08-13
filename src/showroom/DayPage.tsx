import Link from "next/link";
import type { DemoSnapshot } from "@/src/contracts/shell";
import { DemoBadge, SectionIntro } from "./ui";

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
        <div><DemoBadge /><p className="eyebrow">MỘT NGÀY VỚI ANLIEN</p><h1>Bạn vận hành bằng ngoại lệ.<br />ANLIEN theo dõi phần còn lại.</h1></div>
        <p>Từ lúc mở cửa đến cuối ngày, mỗi thông báo đều dẫn tới một hành động cụ thể.</p>
      </header>
      <section className="timeline-section">
        <SectionIntro eyebrow="FN B ĂN LIỀN · NGÀY MẪU" title="Ngày mai sẽ diễn ra như thế này" />
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
        <h2>Không cần học AI.<br />Chỉ cần biết quán đang thế nào.</h2>
        <Link href="/demo" className="button button--light">Quay lại tổng quan ↗</Link>
      </section>
    </div>
  );
}

