# ANLIEN Shell Integration Readiness

**Prototype:** ANLIEN Public Demo Shell  
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
| Marketing | `dong-goi-thuong-hieu.nosync` (`dong-goi-thuong-hieu`) | Brand Context, Content, Creative, Campaign, Marketing activity |
| Loyalty | `fnbanlien-play` | Customer, Loyalty profile, Membership, Points/Xu, Voucher, Reward, Redemption, Retention activity |
| Ops | `fnbanlien-tu-van-hanh` | Employee, Shift, Attendance, SOP, Checklist, Task, Evidence, Review/Approval |

## Field-to-projection map

| UI field | Product owner | Current demo source | Future projection | Scope | Integration status |
| --- | --- | --- | --- | --- | --- |
| Content being prepared | Marketing | `marketingSummary` mock fixture | `marketing.content_summary.v1` | Business | Not connected |
| Content pending review | Marketing | `marketingSummary` mock fixture | `marketing.review_queue.v1` | Business | Not connected |
| Today content suggestion | Marketing | `marketingDemo` mock fixture | `marketing.daily_recommendation.v1` | Business | Not connected |
| Prepared post draft | Marketing | `marketingDemo` mock fixture | `marketing.content_draft.v1` | Business | Not connected |
| Draft review state | Marketing | local prototype state | Marketing domain action request (future, human-confirmed) | Business | Not connected |
| Total customer members | Loyalty | `loyaltySummary` mock fixture | `loyalty.customer_summary.v1` | Business | Not connected |
| Recently active customers | Loyalty | `loyaltyDemo.groups` mock fixture | `loyalty.customer_segments.v1` | Business | Not connected |
| Inactive-customer segment | Loyalty | `loyaltySummary` + group mock fixture | `loyalty.customer_segments.v1` | Business | Not connected |
| Voucher redeemed | Loyalty | `loyaltySummary` mock fixture | `loyalty.redemption_summary.v1` | Business | Not connected |
| Return offer suggestion | Loyalty | `loyaltyDemo` mock fixture | `loyalty.retention_recommendation.v1` | Business | Not connected |
| Employees scheduled | Ops | `opsSummary` mock fixture | `ops.shift_roster.v1` | Location | Not connected |
| Employees checked in | Ops | `opsSummary` + shift mock fixture | `ops.attendance_projection.v1` | Location | Not connected |
| Active shift | Ops | `opsDemo.shift` mock fixture | `ops.active_shift.v1` | Location | Not connected |
| Checklist completion | Ops | `opsSummary` + checklist mock fixture | `ops.checklist_progress.v1` | Location | Not connected |
| Overdue tasks | Ops | `opsSummary` mock fixture | `ops.task_attention.v1` | Location | Not connected |
| Evidence waiting for review | Ops | demo-only overview fixture | `ops.evidence_review.v1` | Location | Not connected |
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
- Quick actions and workflow buttons update local demo state or open an explanatory modal only.
- “Duyệt”, “Lên lịch”, “Chuẩn bị ưu đãi”, “Nhắc Nam”, and checklist changes do not persist.
- Role switching changes mock visibility and emphasis; it is not authorization.
- Business switcher contains one demo Business only.
- Location context shows one synthetic Location and “Tất cả cơ sở”.
- External product destinations are deliberately `null`; no links point at product production apps.
- No real AI call, Supabase client, POS data, revenue attribution, customer PII, or production analytics is present.

## Integration gate

The shell is ready for UI/contract review only. Connectivity remains blocked until each product publishes an approved, versioned read projection and Identity Bridge mappings are verified under the platform governance process.

