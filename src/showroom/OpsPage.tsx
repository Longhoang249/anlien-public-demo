"use client";

import { useState } from "react";
import type { DemoSnapshot } from "@/src/contracts/shell";
import { ScopeBadge, SectionIntro, StatusMark } from "./ui";

export function OpsPage({
  snapshot,
  onAction,
}: {
  snapshot: DemoSnapshot;
  onAction: (label: string) => void;
}) {
  const [reminded, setReminded] = useState(false);
  const [lastDone, setLastDone] = useState(false);
  const shift = snapshot.ops.shift;
  const checklist = snapshot.ops.checklist;
  const completed = checklist.completed + (lastDone ? 1 : 0);

  return (
    <div className="product-page product-page--ops">
      <header className="product-hero">
        <div>
          <div className="product-hero__meta"><ScopeBadge scope="location" /></div>
          <p className="eyebrow">OPS · VẬN HÀNH</p>
          <h1>Không ở quán, vẫn biết mọi việc đến đâu.</h1>
          <p>Biết ai đang làm, việc nào đã xong và quy trình nào đang chậm.</p>
        </div>
        <div className="mini-status"><span>8/9</span><p>nhân sự đã vào ca</p></div>
      </header>

      <section className="ops-grid">
        <article className="shift-card">
          <div className="card-head">
            <div><p className="eyebrow">CA ĐANG DIỄN RA</p><h2>{shift.name}</h2><span>{shift.time} · {shift.location}</span></div>
            <span className="live-dot">Đang theo dõi</span>
          </div>
          <div className="staff-list">
            {shift.members.map((member) => (
              <div key={member.id} className={member.status === "missing" ? "is-missing" : ""}>
                <StatusMark tone={member.status === "missing" ? "warning" : "success"} />
                <span><strong>{member.name}</strong><small>{member.id === "nam" && reminded ? "Đã gửi lời nhắc · Demo" : member.detail}</small></span>
                {member.id === "nam" ? <button onClick={() => setReminded(true)}>{reminded ? "Đã nhắc" : "Nhắc Nam"}</button> : null}
              </div>
            ))}
          </div>
          <button className="text-link text-link--button" onClick={() => onAction("Xem toàn bộ ca")}>Xem toàn bộ ca ↗</button>
        </article>

        <article className="checklist-card">
          <div className="card-head">
            <div><p className="eyebrow">{checklist.name}</p><h2>{completed} / {checklist.total} hoàn thành</h2></div>
            <div className="progress-ring" style={{ "--progress": `${(completed / checklist.total) * 100}%` } as React.CSSProperties}><span>{completed}/{checklist.total}</span></div>
          </div>
          <div className="checklist-list">
            {checklist.items.map((item, index) => {
              const complete = item.complete || (index === checklist.items.length - 1 && lastDone);
              return (
                <button
                  key={item.id}
                  onClick={() => index === checklist.items.length - 1 && setLastDone((value) => !value)}
                  className={complete ? "is-complete" : ""}
                >
                  <span>{complete ? "✓" : "○"}</span>{item.label}
                </button>
              );
            })}
          </div>
          <button className="text-link text-link--button" onClick={() => onAction("Xem công việc")}>Xem công việc ↗</button>
        </article>
      </section>

      <section className="remote-proof">
        <SectionIntro eyebrow="CHỦ QUÁN CHỈ XỬ LÝ NGOẠI LỆ" title="Quán đang làm đúng quy trình không?" />
        <div className="proof-grid">
          <div><strong>{lastDone ? "20/20" : "17/20"}</strong><span>mục đã hoàn thành</span><small>từ checklist tại cơ sở</small></div>
          <div><strong>02</strong><span>việc đang trễ</span><small>cần quản lý xử lý</small></div>
          <div><strong>01</strong><span>bằng chứng chờ xem</span><small>ảnh đóng ca · Demo</small></div>
        </div>
      </section>
    </div>
  );
}
