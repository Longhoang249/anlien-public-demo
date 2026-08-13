# ANLIEN Shell Integration Readiness

**Prototype:** ANLIEN Public Demo Shell V2.1
**Business context:** `FnB Ăn Liền (Demo quán)`  
**Current data mode:** deterministic mock fixtures only  
**Connectivity:** no production API, database, authentication, SSO, or cross-product write

## Architecture boundary

```text
UI
↓
typed contracts
↓
product adapter boundary
↓
MockMarketingAdapter / MockLoyaltyAdapter / MockOpsAdapter (now)
↓
versioned read projections owned by each product (later)
```

The shell must never query Marketing, Loyalty, or Ops internal tables directly. A future integration replaces only the mock adapter for that product with a versioned, read-only projection adapter. Each product remains independently operable.

## Product source mapping

| Shell domain | Product project | Domain ownership used by the shell |
| --- | --- | --- |
| Marketing | `dong-goi-thuong-hieu` | Brand DNA, Business Context, Idea, Content, Design, Campaign planning, Advice |
| Loyalty | `fnbanlien-play` | Customer, Loyalty profile, Membership, Points/Xu, Voucher, Reward, Redemption, Retention activity |
| Ops | `fnbanlien-tu-van-hanh` | Employee, Shift, Attendance, SOP, Checklist, Task, Evidence, Review/Approval |

## Field-to-projection map

| UI field | Product owner | Current demo source | Future projection | Scope | Integration status |
| --- | --- | --- | --- | --- | --- |
| DNA thương hiệu 82% | Marketing | `ownerDashboardDemo.metrics.brandReadiness` | `marketing.brand_dna_summary.v1` | Business | Demo, not connected |
| 3 điểm chạm cần bổ sung | Marketing | `ownerDashboardDemo.metrics.touchpointsPending` | `marketing.brand_touchpoints.v1` | Business | Demo, not connected |
| 4 ý tưởng hôm nay | Marketing | `ownerDashboardDemo.metrics.ideasToday` | `marketing.daily_recommendation.v1` | Business | Demo, not connected |
| Gợi ý đồ uống mát | Marketing | `marketingDemo.suggestion` | `marketing.daily_recommendation.v1` | Business | Demo, not connected |
| Giọng, khách chính, phong cách hình ảnh | Marketing | `marketingDemo.brandDna` | `marketing.brand_dna_summary.v1` | Business | Demo, not connected |
| Khách hôm nay 29 | Loyalty | `ownerDashboardDemo.metrics.customersToday` | `loyalty.daily_customer_activity.v1` | Business | Demo, not connected |
| 23 khách quay lại | Loyalty | `ownerDashboardDemo.metrics.returningToday` | `loyalty.daily_customer_activity.v1` | Business | Demo, not connected |
| 6 khách mới | Loyalty | `ownerDashboardDemo.metrics.newToday` | `loyalty.daily_customer_activity.v1` | Business | Demo, not connected |
| 486 hồ sơ khách | Loyalty | `ownerDashboardDemo.metrics.customerProfiles` | `loyalty.customer_summary.v1` | Business | Demo, not connected |
| 87 khách hơn 45 ngày chưa quay lại | Loyalty | `ownerDashboardDemo.metrics.inactiveCustomers` | `loyalty.customer_segments.v1` | Business | Demo, not connected |
| 18 voucher dùng hôm nay | Loyalty | `ownerDashboardDemo.metrics.vouchersToday` | `loyalty.redemption_summary.v1` | Business | Demo, not connected |
| 42 lượt chơi | Loyalty | `ownerDashboardDemo.metrics.gamePlaysToday` | `loyalty.activity_summary.v1` | Business | Demo, not connected |
| 1 phản hồi cần xử lý | Loyalty | `ownerDashboardDemo.metrics.feedbackPending` | `loyalty.feedback_attention.v1` | Business | Demo, not connected |
| Nhân sự vào ca 8/9 | Ops | `ownerDashboardDemo.metrics.staffCheckIn` | `ops.attendance_summary.v1` | Location | Demo, not connected |
| Việc hoàn thành đúng 17/20 | Ops | `ownerDashboardDemo.metrics.taskCompletion` | `ops.task_completion.v1` | Location | Demo, not connected |
| 2 việc trễ | Ops | `ownerDashboardDemo.metrics.opsOverdue` | `ops.task_attention.v1` | Location | Demo, not connected |
| 1 việc chờ duyệt | Ops | `ownerDashboardDemo.metrics.opsPendingReview` | `ops.review_queue.v1` | Location | Demo, not connected |
| 1 sự cố mở | Ops | `ownerDashboardDemo.metrics.opsOpenIssues` | `ops.open_issues.v1` | Location | Demo, not connected |
| 0đ lệch bàn giao | Ops | `ownerDashboardDemo.metrics.opsCashDifference` | `ops.shift_handover_summary.v1` | Location | Demo, not connected |
| Hiệu suất từng cơ sở | Ops | `ownerDashboardDemo.branches[].completion` | `ops.location_completion.v1` | Location | Demo, not connected |
| Priority inbox | Marketing, Loyalty, Ops | `ownerDashboardDemo.priorities` | Product-owned attention projections | Business / Location | Demo, not connected |
| Bảng ai đang làm gì | Ops | `ownerDashboardDemo.assignments` | `ops.active_assignments.v1` | Location | Demo, not connected |
| Role-oriented visibility | Shell prototype | local UI state | Future identity + membership + entitlement contracts | Business / Location | Not connected; not authorization |
| Business context | Shell prototype | `demo-business-fnb-an-lien` | Future verified Identity Bridge resolution | Business | Not connected |
| Location context | Shell prototype | `demo-location-01` | Future verified Identity Bridge resolution | Location | Not connected |

Projection names above are proposed contract labels for handoff, not claims that contracts already exist. The current cross-product contract standard confirms that no real contract is implemented yet.

## Canonical context readiness

- `Organization`, `Business`, and `Location` are separate typed concepts.
- The demo Business has an `organizationId`; the demo Location has a `businessId`.
- Demo IDs use a `demo-` prefix and must never be treated as production/canonical IDs.
- Marketing and Loyalty cards remain Business-scoped.
- Ops cards are Location-scoped while still Business-aware.
- The shell does not assume `Marketing.shop_id = Loyalty.shop_id = Ops.organization_id`.
- A future resolver may return a canonical identifier only for a `VERIFIED` mapping. Unverified or not-found mappings must not expose a guessed canonical ID.
- Identity mapping must not be interpreted as product entitlement.

## Discovery evidence and gaps

Read from `dong-goi-thuong-hieu.nosync`:

- `ANLIEN_PLATFORM_CONSTITUTION.md`
- `docs/anlien/ANLIEN_VOCABULARY.md`
- `docs/anlien/ENTITY_MAPPING_REGISTRY.md`
- `docs/anlien/DOMAIN_OWNERSHIP.md`
- `docs/anlien/CROSS_PRODUCT_CONTRACT_STANDARD.md`
- `docs/anlien/PHASE_2_IDENTITY_BRIDGE_DESIGN.md`

The governance copies inside the Ops and Loyalty project directories are zero-byte placeholders. Their source trees and `AGENTS.md` files are currently macOS/iCloud `dataless` placeholders and timed out when read. Therefore the shell does not invent product-local schemas from those repos; it uses the canonical cross-product evidence above and treats all future projection shapes as unresolved until those source trees are locally available.

## Intentional placeholders / not-connected areas

- Signup/onboarding CTA opens a “Sắp sẵn sàng” explanation; there is no auth.
- Quick actions and workflow buttons update local demo state or open an explanatory panel only.
- “Giao việc mẫu”, “Lưu ưu đãi mẫu”, “Nhắc Nam”, and checklist changes do not persist.
- Business switcher contains one demo Business only.
- Location context shows one synthetic Location and “Tất cả cơ sở”.
- External product destinations are deliberately `null`; no links point at product production apps.
- No real AI call, Supabase client, POS data, revenue attribution, customer PII, or production analytics is present.

## V2.1 owner command center semantics

- Overview copy is status-led. It does not explain software capabilities when a concrete signal is available.
- Marketing is represented as Brand DNA, Business Context, ideas, design, content, campaign planning, and human-confirmed advice.
- No content approval queue, scheduled publishing, or autonomous campaign execution is represented.
- Loyalty metrics remain Business-scoped even when the Ops location filter is visible.
- Ops metrics remain Location-aware and are the only metrics compared across demo locations.
- Every Overview metric declares `owner`, `scope`, `status`, and `futureSource` in typed fixtures.
- Product preview cards route only to local demo pages. No external product URL is active.

## Integration gate

The shell is ready for UI/contract review only. Connectivity remains blocked until each product publishes an approved, versioned read projection and Identity Bridge mappings are verified under the platform governance process.
