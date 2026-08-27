import Link from "next/link";
import { productDestinations } from "@/src/config/product-destinations";
import { getSelectedBusinessAccess, isProductAvailable } from "@/src/contracts/access-context";
import type { AccessContext } from "@/src/contracts/shell";
import { Arrow } from "./ui";

const products = Object.values(productDestinations);

export function ProductLauncher({
  context,
  selectedBusinessId,
}: {
  context: AccessContext;
  selectedBusinessId: string;
}) {
  const selected = getSelectedBusinessAccess(context, selectedBusinessId);
  const membershipActive = selected?.membership.status === "active";
  const accessContextLabel = `ACCESS CONTEXT · ${
    context.source === "synthetic" ? "SYNTHETIC" : context.health.toUpperCase()
  }`;

  return (
    <section className="access-foundation" aria-label="Bối cảnh truy cập ANLIEN">
      <div className="access-foundation__copy">
        <p className="eyebrow">{accessContextLabel}</p>
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
          const available = isProductAvailable(context, product.productId, selectedBusinessId);
          const href = context.mode === "PUBLIC_DEMO" ? product.demoHref : product.privateHref;
          const launchable = available && Boolean(href);
          const content = (
            <>
              <span>{product.displayName.slice(0, 1)}</span>
              <div><strong>{product.displayName}</strong><small>{product.promise}</small></div>
              <b>{available ? (launchable ? "Available" : "Available · destination pending") : "Not enabled"}</b>
              {launchable ? <Arrow /> : null}
            </>
          );

          return launchable && href ? (
            <Link
              key={product.productId}
              href={href}
              className="product-launcher__item is-available"
            >
              {content}
            </Link>
          ) : (
            <div
              key={product.productId}
              className={`product-launcher__item ${available ? "is-pending" : "is-unavailable"}`}
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
