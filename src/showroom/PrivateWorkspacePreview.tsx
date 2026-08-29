"use client";

import { useState } from "react";
import {
  privateAccessScenarios,
  type PrivateAccessScenario,
} from "@/src/data/demo/private-access-fixtures";
import { ProductLauncher } from "./ProductLauncher";

const scenarioLabels: Record<PrivateAccessScenario, string> = {
  one_business: "Một Business",
  multi_business: "Nhiều Business",
  inactive_membership: "Membership inactive",
  no_entitlements: "Chưa có entitlement",
  not_authenticated: "Chưa xác thực",
  core_unavailable: "Core unavailable",
  adapter_error: "Adapter error",
};

const failureCopy = {
  none: "Access projection sẵn sàng cho workspace.",
  not_authenticated: "Chưa có Account đã xác thực cho workspace này.",
  not_member: "Account không có Membership active trong Business.",
  not_entitled: "Membership hợp lệ nhưng chưa có sản phẩm được bật.",
  core_unavailable: "Core access projection tạm thời không khả dụng.",
  invalid_response: "Core trả về projection không đúng contract.",
  adapter_error: "Shell adapter không thể hoàn tất projection.",
} as const;

export function PrivateWorkspacePreview() {
  const [scenario, setScenario] = useState<PrivateAccessScenario>("multi_business");
  const context = privateAccessScenarios[scenario];
  const [selectedByScenario, setSelectedByScenario] = useState<Record<string, string>>({});
  const selectedBusinessId = selectedByScenario[scenario] ?? context.selectedBusinessId ?? "";

  return (
    <main className="private-preview">
      <header className="private-preview__hero">
        <p className="eyebrow">ANLIEN PRIVATE WORKSPACE · BUILD PREVIEW</p>
        <h1>Account → Business → sản phẩm</h1>
        <p>
          Đây là fixture synthetic để kiểm tra trạng thái Shell. Không đăng nhập thật, không gọi
          production, không SSO và không chuyển session sang sản phẩm.
        </p>
      </header>

      <nav className="private-preview__scenarios" aria-label="Kịch bản access">
        {(Object.keys(privateAccessScenarios) as PrivateAccessScenario[]).map((key) => (
          <button
            key={key}
            type="button"
            className={scenario === key ? "is-active" : ""}
            onClick={() => setScenario(key)}
          >
            {scenarioLabels[key]}
          </button>
        ))}
      </nav>

      <section className="private-preview__status" data-health={context.health}>
        <div>
          <small>Account</small>
          <strong>{context.account?.label ?? "Không khả dụng"}</strong>
        </div>
        <div>
          <small>Projection health</small>
          <strong>{context.health}</strong>
        </div>
        <p>{failureCopy[context.failure]}</p>
      </section>

      {context.businesses.length > 0 ? (
        <>
          <label className="private-preview__selector">
            <span>Business đang chọn</span>
            <select
              value={selectedBusinessId}
              onChange={(event) =>
                setSelectedByScenario((current) => ({
                  ...current,
                  [scenario]: event.target.value,
                }))
              }
            >
              {context.businesses.map(({ business }) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          </label>
          <ProductLauncher context={context} selectedBusinessId={selectedBusinessId} />
        </>
      ) : null}

      <footer className="private-preview__guardrail">
        Product destinations vẫn để trống. Mỗi sản phẩm giữ đăng nhập độc lập cho đến khi activation
        được phê duyệt riêng.
      </footer>
    </main>
  );
}
