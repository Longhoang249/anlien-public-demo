# ANLIEN Shell Integration Readiness

**Prototype:** ANLIEN Public Demo Shell V2.x Reality Aligned
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
| Demo score DNA 82% | Marketing | `ownerDashboardDemo.metrics.brandReadiness` | No production score until formula is approved | Business | Demo only |
| Trạng thái và tóm tắt Brand DNA | Marketing | `marketingDemo.brandDna` | `marketing.brand_context.v1` | Business | Ready for future projection after verified mapping |
| 3 điểm chạm cần bổ sung | Marketing | `ownerDashboardDemo.metrics.touchpointsPending` | `marketing.brand_touchpoints.v1` | Business | Demo, not connected |
| 4 ý tưởng hôm nay | Marketing | `ownerDashboardDemo.metrics.ideasToday` | `marketing.daily_recommendation.v1` | Business | Demo, not connected |
| Gợi ý đồ uống mát | Marketing | `marketingDemo.suggestion` | `marketing.daily_recommendation.v1` | Business | Demo, not connected |
| Giọng, khách chính, phong cách hình ảnh | Marketing | `marketingDemo.brandDna` | `marketing.brand_dna_summary.v1` | Business | Demo, not connected |
| 29 tín hiệu Loyalty hôm nay | Loyalty | `ownerDashboardDemo.metrics.loyaltySignalsToday` | No production aggregate until event semantics are approved | Business | Demo only |
| 23 hoạt động ghi nhận | Loyalty | Included in demo detail only | No production field selected | Business | Demo only, not a returning-customer claim |
| 6 thành viên mới | Loyalty | `ownerDashboardDemo.metrics.newToday` | `loyalty.customer_summary.v1` | Business | Demo, wording aligned to membership |
| 486 hồ sơ khách | Loyalty | `ownerDashboardDemo.metrics.customerProfiles` | `loyalty.customer_summary.v1` | Business | Demo, not connected |
| 87 thành viên không có hoạt động Loyalty trong 45 ngày | Loyalty | `ownerDashboardDemo.metrics.inactiveCustomers` | `loyalty.retention_attention.v1` | Business | Demo, definition required before projection |
| 18 voucher dùng hôm nay | Loyalty | `ownerDashboardDemo.metrics.vouchersToday` | `loyalty.redemption_summary.v1` | Business | Demo, not connected |
| 42 lượt chơi | Loyalty | `ownerDashboardDemo.metrics.gamePlaysToday` | `loyalty.activity_summary.v1` | Business | Demo, not connected |
| Nhân sự vào ca 8/9 | Ops | `ownerDashboardDemo.metrics.staffCheckIn` | `ops.attendance_summary.v1` | Location | Demo, not connected |
| Việc đã hoàn thành 17/20 | Ops | `ownerDashboardDemo.metrics.taskCompletion` | `ops.task_completion.v1` | Location | Demo, wording aligned to supported status |
| 2 việc trễ | Ops | `ownerDashboardDemo.metrics.opsOverdue` | `ops.task_attention.v1` | Location | Demo, not connected |
| 1 việc chờ duyệt | Ops | `ownerDashboardDemo.metrics.opsPendingReview` | `ops.review_queue.v1` | Location | Demo, not connected |
| Hiệu suất từng cơ sở | Ops | `ownerDashboardDemo.branches[].completion` | `ops.location_completion.v1` | Location | Demo, not connected |
| Priority inbox | Marketing, Loyalty, Ops | `ownerDashboardDemo.priorities` | Product-owned attention projections | Business / Location | Demo, not connected |
| Bảng ai đang làm gì | Ops | `ownerDashboardDemo.assignments` | `ops.active_assignments.v1` | Location | Demo, not connected |
| Role-oriented visibility | Shell prototype | local UI state | Future identity + membership + entitlement contracts | Business / Location | Not connected; not authorization |
| Business context | Shell prototype | `demo-business-fnb-an-lien` | Future verified Identity Bridge resolution | Business | Not connected |
| Location context | Shell prototype | `demoLocations[]` | Future verified Identity Bridge resolution | Location | Two consistent demo locations, not connected |

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

Reality Contract Audit inspected canonical repository snapshots for Marketing, Loyalty, and Ops. The full source ledger and field classifications are recorded in `docs/ANLIEN_REALITY_CONTRACT_AUDIT.md`. Minimal future shapes are proposed in `docs/ANLIEN_READ_PROJECTION_V1_PROPOSAL.md`.

The remaining architectural blocker is unchanged: no runtime Identity Bridge mapping is VERIFIED for the pilot Business/Locations, and no product read projection has been implemented.

## Data health contract

The typed Shell status is prepared for `demo | live | stale | unavailable | error`. All current fixtures remain `demo`. No live status is emitted and no adapter falls back silently from a failed live source to fixture data.

## Intentional placeholders / not-connected areas

- Signup/onboarding CTA opens a “Sắp sẵn sàng” explanation; there is no auth.
- Quick actions and workflow buttons update local demo state or open an explanatory panel only.
- “Giao việc mẫu”, “Lưu ưu đãi mẫu”, “Nhắc Nam”, and checklist changes do not persist.
- Business switcher contains one demo Business only.
- Location context uses two synthetic Locations from one `demoLocations` source and “Tất cả cơ sở”.
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
