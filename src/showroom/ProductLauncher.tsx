import Link from "next/link";
import { getSelectedBusinessAccess, isProductAvailable } from "@/src/contracts/access-context";
import type { AccessContext, ProductKey } from "@/src/contracts/shell";
import { Arrow } from "./ui";

const products: Array<{
  key: ProductKey;
  label: string;
  promise: string;
  href: string;
}> = [
  { key: "marketing", label: "Marketing", promise: "Kéo khách", href: "/demo/marketing" },
  { key: "loyalty", label: "Loyalty", promise: "Giữ khách", href: "/demo/loyalty" },
  { key: "ops", label: "Ops", promise: "Vận hành tốt hơn", href: "/demo/ops" },
];

export function ProductLauncher({
  context,
  selectedBusinessId,
}: {
  context: AccessContext;
  selectedBusinessId: string;
}) {
  const selected = getSelectedBusinessAccess(context, selectedBusinessId);
  const membershipActive = selected?.membership.status === "active";

  return (
    <section className="access-foundation" aria-label="Bối cảnh truy cập ANLIEN">
      <div className="access-foundation__copy">
        <p className="eyebrow">ACCESS CONTEXT · SYNTHETIC</p>
        <strong>{context.account?.label ?? "Chưa có Account"}</strong>
        <span>
          {membershipActive
            ? `Đang xem ${selected?.business.name}`
            : "Business workspace chưa khả dụng"}
        </span>
        <small>Minh họa kiến trúc — không phải đăng nhập hay quyền truy cập thật.</small>
      </div>

      <div className="product-launcher">
        {products.map((product) => {
          const available = isProductAvailable(context, product.key, selectedBusinessId);
          const content = (
            <>
              <span>{product.label.slice(0, 1)}</span>
              <div><strong>{product.label}</strong><small>{product.promise}</small></div>
              <b>{available ? "Available" : "Not enabled"}</b>
              {available ? <Arrow /> : null}
            </>
          );

          return available ? (
            <Link key={product.key} href={product.href} className="product-launcher__item is-available">
              {content}
            </Link>
          ) : (
            <div
              key={product.key}
              className="product-launcher__item is-unavailable"
              aria-disabled="true"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
