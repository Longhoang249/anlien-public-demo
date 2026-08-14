# AnLiên Reality Contract Audit

Audit date: 2026-08-14
Shell commit: c85c6e6
Audit mode: repository evidence only, read-only

## 1. Executive conclusion

The current Shell is a useful product narrative, but it is not yet a truthful live dashboard. Every number currently shown is a demo fixture. The audit found 29 fields with direct product support, 14 fields that can be derived after a definition is locked, 6 fields that need a product-owner semantic decision, 5 unsupported claims, and 8 explicitly demo-only fields.

| Classification | Count | Meaning |
|---|---:|---|
| GREEN | 29 | The owning product already has a direct source or active computation for this concept. The current demo value is still not production-verified. |
| YELLOW | 14 | The product has sufficient raw data, but Shell needs a locked formula, window, scope, or contract. |
| ORANGE | 6 | Multiple plausible meanings exist. The product owner must choose one before integration. |
| RED | 5 | No current supported product source was found, or the domain was deliberately removed. |
| GREY | 8 | Narrative or fixture content intended only for the public demo. |
| **Total** | **62** | Unique user-facing signals. Repeated appearances are counted once. |

Classification describes whether the concept can be supported. It does not certify the displayed demo number. No current production row count or value was queried in this audit.

## 2. Evidence inspected

| Product | Repository | Commit audited | Primary evidence |
|---|---|---|---|
| Shell | Longhoang249/anlien-public-demo | c85c6e6 | src/contracts/shell.ts, src/data/demo/fixtures.ts, overview and product pages, current web-state and integration-readiness documents |
| Marketing | Longhoang249/dong-goi-thuong-hieu | 12be77c | types/supabase.ts, types/brand.ts, lib/marketingCalendarEngine.ts, journey services and migrations, Brand DNA migrations, cross-product contract documents |
| Loyalty | Longhoang249/fnbanlien-play | 953024e | docs/00_MASTER_SPEC_V1.2_FINAL.md, PROJECT_STATE.md, dashboard KPI RPC migration, manual loyalty foundation migration, voucher/game/member schema |
| Ops | Longhoang249/fnbanlien-tu-van-hanh | 7c9a5a4 | schema migrations, operationService.ts, reportService.ts, Dashboard.tsx, review SLA migration, current task and handoff documents |

Repository documents sometimes state that migrations or releases are synchronized with production. Those statements are useful release evidence, but live deployed data and current production values remain **NOT VERIFIED** because no production database or runtime API was queried.

The requested Ops file docs/anlien/OPS_PLATFORM_SEMANTICS.md is **NOT VERIFIED** because it is absent from the audited Ops commit.

Key traceability paths:

| Area | Repository paths used |
|---|---|
| Shared laws | ANLIEN_PLATFORM_CONSTITUTION.md; docs/anlien/ANLIEN_VOCABULARY.md; docs/anlien/ENTITY_MAPPING_REGISTRY.md; docs/anlien/DOMAIN_OWNERSHIP.md; docs/anlien/CROSS_PRODUCT_CONTRACT_STANDARD.md; docs/anlien/PHASE_2_IDENTITY_BRIDGE_DESIGN.md |
| Marketing DNA and ideas | types/supabase.ts; types/brand.ts; lib/marketingCalendarEngine.ts; supabase/migrations/20260602120002_add_shop_dna_and_flags.sql; supabase/migrations/20260503000000_v3_brand_dna_3tier.sql; supabase/functions/matcha-daily-companion/index.ts |
| Marketing touchpoints | services/journeyPlanService.ts; supabase/migrations/20260516010000_customer_journey_v2.sql; services/marketingWorkspaceService.ts; supabase/migrations/20260724093558_marketing_idea_interactions.sql |
| Loyalty memberships and activity | docs/00_MASTER_SPEC_V1.2_FINAL.md; PROJECT_STATE.md; supabase/migrations/20260704021451_phase_6_dashboards_kpis.sql; supabase/migrations/20260709100000_rc02_manual_loyalty_foundation.sql |
| Ops work and review | src/features/operations/services/operationService.ts; src/features/operations/services/reportService.ts; src/pages/Dashboard.tsx; supabase/migrations/20260803100000_shop_review_sla.sql |
| Ops attendance and scope removals | src/features/attendance/services/attendanceService.ts; src/features/scoring/services/scoreEventService.ts; supabase/migrations/20260731200000_attendance_checkins.sql; supabase/migrations/20260731210000_shift_assignments.sql |

## 3. Field-by-field reality matrix

Priority appears only for GREEN and YELLOW items, as requested. P0 is the safest and most useful first integration set, P1 follows, and P2 is lower urgency.

| Shell field | Current value | Product owner | Classification | Real source | Raw entity/table/function | Definition needed | Future projection | Recommended action |
|---|---|---|---|---|---|---|---|---|
| Business context | An Liên Coffee | Shell / cross-product | GREY | Demo fixture only | snapshot.business | Canonical Business mapping is not verified | envelope.scope with product-local source ID | Keep as demo label; do not emit canonical_business_ref |
| Location selector | All, Nguyen Thai Hoc, Tran Phu | Shell / cross-product | RED | Fixture contains only Nguyen Thai Hoc while Overview and branch cards also hard-code Tran Phu | snapshot.locations plus hard-coded UI options | One authoritative location list and verified product mappings | envelope.scope plus locations from projection | Remove hard-coded options; source all options from the snapshot |
| Role-oriented views | owner, manager, marketing, staff | Cross-product | ORANGE | Each product has different local role semantics | Marketing user/shop roles; Loyalty shop_user_roles; Ops memberships.role | Visibility persona versus authorization entitlement | shell_view_role, never canonical entitlement | Product-owner decision; do not map these four roles across products |
| Demo/data state signal | Demo | Shell | GREY | Shell contract | IntegrationStatus = demo or not-connected | Separate data mode, fetch state, and data health | data_mode plus health envelope | Keep one small Demo badge until live projections exist |
| Brand DNA score | 82% | Marketing | YELLOW | Fields dna_score and dna_completeness exist, but the active calculation and consistency policy were not found | brand_info.dna_score, brand_info.dna_completeness, shops.dna_status | Required fields, weighting, validation, rounding, and update trigger | marketing.brand_context.status; score optional | P1: show dna_status now; suppress percentage until formula is approved |
| Missing brand touchpoints | 3 | Marketing | YELLOW | Journey plans and plan items have real statuses | journey_plans, journey_plan_items, journey_library_touchpoints | Active plan, relevant statuses, and what counts as missing | marketing.touchpoints.attention_count | P1: lock definition and aggregate current active plan |
| Ideas for today | 4 | Marketing | GREEN | Active deterministic calendar engine outputs one activity and three content ideas | marketingCalendarEngine v2.1.0 | Local date, brand profile, and whether 1 activity + 3 ideas is labeled as four ideas | marketing.today.activity and content_ideas | P1: project engine output and expose engine_version |
| Today's recommendation | Push cold drinks in the afternoon | Marketing | GREEN | Calendar engine returns recommendedAction | marketingCalendarEngine.recommendedAction | Local date and input brand snapshot | marketing.today.recommended_action | P1: render generated output, not the fixture sentence |
| Why the idea fits | Young voice and cold menu | Marketing | GREEN | Engine returns whyItFits and contextSignals | marketingCalendarEngine.whyItFits, contextSignals | None beyond engine input and local day | marketing.today.why_it_fits and context_signals | P1: project with the recommendation |
| Brand voice | Young, friendly, playful | Marketing | GREEN | Direct Brand DNA fields | brand_info.voice_keywords and Brand DNA JSON | Fallback when empty | marketing.brand_context.voice | P1: project direct values with updated_at |
| Target audience | 18 to 30 years old | Marketing | GREEN | Direct Brand DNA fields | brand_info.target_customer and Brand DNA JSON | Preferred source when both legacy and current JSON exist | marketing.brand_context.audience | P1: select one canonical Marketing source |
| Visual style | Fresh, clean, young | Marketing | GREEN | Direct Brand DNA fields | brand_info.design_style, visual_concept and Brand DNA JSON | Preferred source and empty-state behavior | marketing.brand_context.visual_style | P2: project after voice and audience |
| Brand promise | Current fixture sentence | Marketing | GREEN | Brand model contains promise/positioning fields | Brand DNA JSON and typed brand model | Exact canonical field in the current DNA version | marketing.brand_context.promise | P2: publish only when a non-empty canonical field is selected |
| Touchpoint readiness list | Menu/Facebook ready; others pending | Marketing | YELLOW | Plan-item status model exists | journey_plan_items and openingJourneyService | Status mapping into ready, in_progress, attention, not_applicable | marketing.touchpoints.items | P1: define status translation and include plan_id |
| Four advisor cards | Strategy, content, visual, operations advice | Marketing | YELLOW | AI chat, content and image capabilities exist; four stable advisor personas were not verified | ai-chat function, content/image services | Persona catalogue, version, availability, and ownership | marketing.capabilities/advisors | P2: label as demo shortcuts until a stable catalogue is exposed |
| Customer profiles | 486 | Loyalty | GREEN | Shop-scoped membership count exists and dashboard RPC exposes total_players | shop_memberships joined to players; get_shop_dashboard | Active membership policy and shop timezone | loyalty.customers.total_memberships | P0: integrate active shop membership count |
| Customers today | 29 | Loyalty | ORANGE | Several real events could qualify, none is the locked meaning | staff_bill_entries, game_sessions, redemptions, shop_memberships | Paid bill, loyalty activity, visit, or any event; deduplication and timezone | Omit until definition approved | Product-owner decision; never label manual activity as complete footfall |
| Returning customers today | 23 | Loyalty | ORANGE | Repeat behavior can be derived from several event types, but purchase truth is incomplete and no definition exists | staff_bill_entries, game_sessions, redemptions, membership history | Qualifying event, prior-event window, identity dedupe, manual capture coverage | Omit until definition approved | Product-owner decision; do not call this real return visits yet |
| New customers today | 6 | Loyalty | YELLOW | Dashboard RPC directly counts memberships created today | shop_memberships.created_at; get_shop_dashboard.new_players_today | Confirm that new member, not first purchase, is intended | loyalty.customers.new_members_today | P1: relabel to New loyalty members today |
| Inactive over 45 days | 87 | Loyalty | YELLOW | Last observed Loyalty activity can be derived | valid staff_bill_entries, valid/completed game_sessions, redemptions | Qualifying activity set, inclusive boundary, timezone, never-active treatment | loyalty.retention.inactive_observed_45d | P1: label as no observed Loyalty activity for 45 days |
| Vouchers used today | 18 | Loyalty | GREEN | Atomic voucher redemption records have redeemed_at | redemptions and vouchers.redeemed_at | Shop timezone; count redemption records versus vouchers | loyalty.activity.voucher_redemptions_today | P1: integrate direct redemption count |
| Game plays today | 42 | Loyalty | GREEN | Shop-scoped game sessions have timestamps and validation state | game_sessions.started_at, ended_at, validation_status | Started versus valid completed session | loyalty.activity.valid_game_sessions_today | P2: use valid completed sessions and publish definition |
| Feedback waiting | 1; two-star review unanswered | Loyalty | RED | No Loyalty feedback or rating domain was found | NOT VERIFIED | A new owned feedback source would be required | None | Remove from Loyalty card and priority inbox for now |
| Active customer group | 132 | Loyalty | YELLOW | Segment can be computed from membership and activity data | shop_memberships plus qualifying activity events | Active window and minimum activity | loyalty.segments.active_count | P2: implement only after shared retention definitions |
| New customer group | 41 | Loyalty | YELLOW | Membership creation is available | shop_memberships.created_at | New window and active membership policy | loyalty.segments.new_member_count | P2: define as new membership, not new purchaser |
| Loyal customer group | 68 | Loyalty | ORANGE | Raw behavior exists, but loyal has no canonical threshold | bill entries, game sessions, redemptions, membership balances | Frequency, recency, spend/points thresholds, and observation window | Omit until definition approved | Product-owner decision |
| Inactive customer group | 87 | Loyalty | YELLOW | Same derivation as the inactive KPI | Loyalty activity events | Same single definition as inactive over 45 days | loyalty.segments.inactive_observed_count | P1: reuse one calculation, never maintain two numbers |
| Return offer suggestion | 20 Xu for 7 days | Loyalty | GREY | Reward and voucher capabilities exist, but this exact recommendation engine was not found | reward catalogue and grant/redemption capabilities | Eligibility, budget, approval, expiry, delivery channel | None until recommendation contract exists | Keep as demo-only; do not present as a live recommendation |
| Staff in shift | 8/9 | Ops | GREEN | Scheduled employee assignments and trusted check-ins exist | shift_assignments, memberships.user_id, staff_profiles, attendance_checkins | Active non-owner employee, shift/date/location, distinct employee count | ops.attendance summary | P0: first integration field |
| Work completed correctly | 17/20 | Ops | ORANGE | Completion is supported, but correctly may mean completed, approved, on time, or no rework | task_instances, submissions, reviews, task_step_executions | Choose the numerator and denominator and remove ambiguous wording | Omit or rename to completed work | Rename to Work completed unless a stricter rule is approved |
| Overdue work | 2 | Ops | GREEN | Active service has an overdue formula | task_instances.status, due_at/is_overdue; reportService | Scope and reporting window | ops.work.overdue_count | P0: integrate using the active service rule |
| Pending reviews | 1 | Ops | GREEN | Pending-review status is active | task_instances/submissions/reviews; reportService | Location and current queue scope | ops.reviews.pending_count | P0: integrate direct queue count |
| Review waiting over 15 minutes | 1 | Ops | GREEN | Shop-level review SLA and submission timestamps exist | shops.review_sla_minutes, pending_review status, submitted_at | Use location SLA, not a hard-coded 15 | ops.reviews.sla_breached_count | P0: integrate with sla_minutes in projection |
| Open issue | 1 | Ops | RED | Issue workflow was intentionally removed from the current scope | NOT VERIFIED; removal documented in operationService and App routes | A new domain decision and schema would be required | None | Remove; do not rename overdue work as an incident |
| Cash handover difference | 0 VND | Ops | RED | Cash reconciliation and EOD handover were intentionally removed | NOT VERIFIED; removal documented in operationService and score events | A trusted POS/cash source and workflow would be required | None | Remove from Shell for now |
| Location performance | 85% and 94% | Ops | YELLOW | Tasks are location-scoped, but the current branch KPI service groups by operating area rather than actual shop | task_instances.shop_id, shops; reportService.getBranchKpis is not suitable as-is | Window, eligible tasks, completion/approval rule, empty denominator | ops.locations[].work_completion_rate | P1: aggregate by shop_id with an approved formula |
| Assigned work list | Three named rows | Ops | GREEN | Tasks have assignee, status, schedule, and location | task_instances, memberships/profiles, operationService | Privacy-safe display name and active window | ops.assignments.items | P1: project current scoped assignments |
| Active shift | Evening shift | Ops | YELLOW | Shift assignments and configurable shift hours exist | shift_assignments, shops.shift_hours | Overnight shifts, timezone, unassigned rows, and current-time rule | ops.shift.current | P1: derive after time semantics are locked |
| Checklist completion | 3/4 and 17/20 | Ops | GREEN | SOP steps and execution states are active | sop_templates, sop_steps, task_instances, task_step_executions | Current task/SOP and required-step denominator | ops.checklists summary | P1: project direct scoped checklist execution |
| Evidence waiting | 1 | Ops | YELLOW | Submission and evidence records exist | submissions, submission_evidence, task state | What counts as waiting: upload missing, review pending, or invalid evidence | ops.reviews.evidence_attention_count | P1: define one attention rule |
| Missing check-in alert | Nam has not checked in | Ops | YELLOW | Schedule and check-in data can identify absence | shift_assignments plus attendance_checkins | Grace period, approved leave, active employee, and shift boundary | ops.attendance.missing_items | P0: define grace period before alerting |
| Opening checklist complete alert | 3/4 complete | Ops | GREEN | Checklist execution is directly available | task_instances and task_step_executions | Opening SOP selection | ops.checklists.opening | P1: link the alert to the exact task instance |
| Quick action: assign from SOP | Assign work | Ops | YELLOW | Ops supports creating/scheduling work from an SOP; Shell has no write command contract | SOP/task creation services | Authorization, idempotency, target location, assignee, audit log | Future command, not read projection | P1: deep-link first; design command contract separately |
| Quick action: care for old customers | Select segment and reward | Loyalty | ORANGE | Segmentation and reward mechanics are partial; messaging/delivery and segment meaning are not locked | Loyalty membership/activity/reward entities | Segment, budget, approval, delivery channel, consent | None until semantic and command decision | Use a read-only deep link after inactive definition is approved |
| Quick action: view today's idea | Open recommendation | Marketing | GREEN | Calendar engine provides current recommendation and ideas | marketingCalendarEngine | Preserve local date and source version | marketing.today link target | P1: deep-link to Marketing with source context |
| Preview: Ops shifts | Ca lam | Ops | GREEN | Shift scheduling and attendance exist | shift_assignments, shift_hours, attendance_checkins | None beyond scope | ops capability link | P2: keep |
| Preview: Ops checklist | Checklist | Ops | GREEN | Active SOP task execution exists | SOP and task step tables | None beyond scope | ops capability link | P2: keep |
| Preview: Ops SOP | SOP | Ops | GREEN | SOP templates and steps exist | sop_templates, sop_steps | None | ops capability link | P2: keep |
| Preview: Ops work | Cong viec | Ops | GREEN | Task instances and assignment workflow exist | task_instances | None beyond scope | ops capability link | P2: keep |
| Preview: Loyalty customers | Khach hang | Loyalty | GREEN | Players and shop memberships exist | players, shop_memberships | Customer means shop member | loyalty capability link | P2: keep with member wording |
| Preview: Loyalty vouchers | Voucher | Loyalty | GREEN | Voucher issuance and redemption exist | vouchers, redemptions | None | loyalty capability link | P2: keep |
| Preview: Loyalty points | Diem thuong | Loyalty | GREEN | Membership balances and reward ledger behavior exist | shop_memberships balances and reward functions | Name of unit, including Xu where appropriate | loyalty capability link | P2: keep |
| Preview: Loyalty feedback | Phan hoi | Loyalty | RED | No owned feedback/rating domain found | NOT VERIFIED | New source/product ownership needed | None | Remove |
| Preview: Marketing Brand DNA | Brand DNA | Marketing | GREEN | Direct Brand DNA model exists | shops.brand_dna, brand_info, typed brand model | Prefer current model over legacy duplicates | marketing capability link | P2: keep |
| Preview: Marketing ideas | Y tuong | Marketing | GREEN | Calendar engine and saved idea interactions exist | marketingCalendarEngine, marketing_idea_interactions | None beyond day/scope | marketing capability link | P2: keep |
| Preview: Marketing content | Content | Marketing | GREEN | Generated content and content services exist | generated_contents and generation services | None | marketing capability link | P2: keep |
| Preview: Marketing design | Thiet ke | Marketing | GREEN | Brand assets, boards, generated images, and design configuration exist | brand_assets, brand_boards, generated_images | None | marketing capability link | P2: keep |
| Timeline 07:30 opening | 17/20 items | Shell narrative | GREY | Demo fixture | timeline fixture | None while demo-only | None | Keep only in clearly labeled Demo mode |
| Timeline 10:00 marketing | Four ideas | Shell narrative | GREY | Demo fixture | timeline fixture | None while demo-only | None | Keep only in clearly labeled Demo mode |
| Timeline 14:00 customers | 87 inactive and offer | Shell narrative | GREY | Demo fixture | timeline fixture | None while demo-only | None | Keep only in clearly labeled Demo mode |
| Timeline 17:00 evening shift | 8/9 checked in | Shell narrative | GREY | Demo fixture | timeline fixture | None while demo-only | None | Keep only in clearly labeled Demo mode |
| Timeline 22:30 end of day | Combined summary | Shell narrative | GREY | Demo fixture | timeline fixture | None while demo-only | None | Keep only in clearly labeled Demo mode |

## 4. Product-specific findings

### 4.1 Marketing

Marketing already owns the most important source truth for Brand DNA, touchpoints, ideas, content, and design. The active calendar engine is especially suitable for the Shell because it is deterministic, versioned, date-aware, and can produce one recommendation, one activity, three content ideas, reasons, and context signals when invoked. This is a context-based suggestion capability, not proof of an autonomous system that runs and publishes a recommendation every day.

The persistent Matcha daily companion is not an alternative live source today. Its current Edge Function returns HTTP 403 immediately with a message that automatic companion generation is paused for the Gold 5G policy. Code after that return is unreachable. Therefore:

- deterministic calendar output is supported;
- saved idea interactions and calendar tasks are supported;
- a persisted AI-generated daily companion is not a supported live claim today.

For the 82% DNA score, the database has score/completeness fields, but the current authoritative calculation is **NOT VERIFIED**. The safest current UI is a status derived directly from shops.dna_status: draft, ready, or handed_over. If the owner later requires a percentage, approve a versioned formula first. One candidate is:

DNA score = round to nearest 5 of 30 x identity completeness + 25 x audience/offer completeness + 25 x voice completeness + 20 x visual completeness.

Each component must use a published list of required, validated fields, not merely non-empty JSON keys. The score should carry formula_version and calculated_at. This is a proposal, not current product truth.

### 4.2 Loyalty

The correct customer scope is an active shop_memberships record joined to the global players identity. It is not an admin/staff account. The existing dashboard RPC directly supports shop-level total members and memberships created today.

Manual paid-bill capture is real product data, but the repository explicitly states that there is no POS integration. It is therefore an observed Loyalty signal, not complete transaction truth. Shell must not translate it into total visits, total purchasers, or complete customer return behavior.

Recommended retention event definition for a future approved metric:

- qualifying activity is the latest of a valid staff bill entry, a valid completed game session, or a voucher redemption;
- compute in the shop timezone;
- count distinct active shop memberships;
- label the result No observed Loyalty activity for 45 days;
- publish coverage metadata that manual bill capture may be incomplete.

This supports a useful attention list without claiming POS-level return truth.

### 4.3 Ops

Ops has strong support for daily owner attention: scheduled staff, trusted check-ins, task status, overdue work, pending review, review SLA, SOP/checklist progress, assignments, and evidence.

The employee denominator must use active non-owner employee memberships/staff profiles that are actually scheduled. A generic organization membership count is not an employee count.

The labels Open issue and Cash handover difference are not gaps that can be solved by a query. Their workflows were deliberately removed from the current Ops scope. They must be removed from Shell until a separately approved domain and trusted source exist.

The current reportService function named getBranchKpis groups by operating area or position, not physical shop. A location KPI is still derivable because task instances carry shop_id, but Shell needs a new read aggregation grouped by shop_id and a locked window/formula.

## 5. Quick actions and preview claims

| Claim | Status | Audit conclusion |
|---|---|---|
| Ops shifts, checklist, SOP, work | SUPPORTED | Real product domains exist. Use deep links until write command contracts are designed. |
| Loyalty customers, vouchers, points | SUPPORTED | Real domains exist. Use shop membership wording for customers. |
| Loyalty feedback | UNSUPPORTED | Remove now. |
| Marketing Brand DNA, ideas, content, design | SUPPORTED | Real product domains exist. |
| Assign work from SOP | PARTIAL | Product capability exists; Shell authorization/idempotency/audit contract does not. |
| Care for old customers | PARTIAL | Requires approved inactive semantics and a delivery/consent workflow. |
| View today's idea | SUPPORTED | Safe read/deep-link path. |

## 6. Roles and identity boundary

The four Shell roles are presentation personas, not a shared authorization model.

| Shell persona | Marketing reality | Loyalty reality | Ops reality | Decision |
|---|---|---|---|---|
| owner | owner/shop_owner concepts exist in more than one local model | shop_admin is closest, but not identical to owner | owner membership exists | Do not canonicalize entitlement |
| manager | manager may be a personalization/profile concept | no distinct manager role; shop_admin is closest | store_manager exists | Do not canonicalize entitlement |
| marketing | marketer exists as a local Marketing profile/persona | no equivalent | no equivalent | Shell view only |
| staff | local staff concepts exist | shop staff exists | staff membership exists | Same word, different capabilities |

Business Membership is not Employee. Identity Mapping is not Entitlement. A future identity bridge may say that two identities belong to the same person; it must not silently grant product permissions.

Cross-product documents show partial semantic confidence for Business/Location mapping, but no verified runtime bridge was found. Marketing shop_id, Loyalty shop_id, and Ops organization_id/shop_id remain product-local source identifiers. canonical_business_ref and canonical_location_ref must be absent or null until a mapping registry marks the relationship VERIFIED.

## 7. Answers to the eight required decisions

1. **Keep DNA 82%?** No, not as live truth. Keep Brand DNA status and the direct voice/audience/visual summary. The percentage is YELLOW until a versioned formula and recalculation policy are approved.
2. **Is returning customers 23 truthful?** No. It is ORANGE. Real events exist, but returning customer has no locked qualifying event and manual bill capture is not complete POS truth.
3. **Can inactive 87 be derived?** Yes, YELLOW. Derive No observed Loyalty activity for 45 days from an approved set of valid bill, game, and voucher events, with coverage metadata.
4. **Does voucher 18 have a source?** Yes, GREEN. Count shop-scoped redemption records by redeemed_at in the shop timezone.
5. **Is Loyalty feedback real?** No. RED. No owned feedback/rating source was found.
6. **Does Ops support cash difference?** No. RED. Cash reconciliation was intentionally removed from current scope.
7. **Does Ops have an open-issue concept?** No current supported issue workflow. RED. Do not relabel overdue tasks as incidents.
8. **Which five fields should integrate first?** Ops attendance, Ops overdue work, Ops pending review/SLA, Loyalty total shop memberships, and Marketing Brand DNA status/summary. These cover all three products with the lowest semantic risk. Voucher redemptions today is the next field.

## 8. Action lists

### KEEP NOW

- Ops attendance, overdue work, pending reviews, and review SLA breach.
- Loyalty total shop memberships and voucher redemptions.
- Marketing Brand DNA status/summary and context-based suggestion capability.
- Product capability previews except Loyalty feedback.
- A single small Demo badge while all values are fixtures.

### KEEP AFTER DEFINITION

- Marketing DNA percentage and touchpoint attention count.
- Loyalty new members, inactive observed members, activity groups, and game-session count.
- Ops location performance, current shift, evidence attention, and missing-check-in grace period.
- Any quick action that could mutate a product.

### REMOVE FOR NOW

- Loyalty feedback and two-star unanswered review.
- Ops open issue.
- Ops cash handover difference.
- Hard-coded Tran Phu location until it exists in the authoritative Shell location list and has verified product mapping.
- Returning customers today and Customers today until their meanings are approved.

### DEMO ONLY

- The five time-of-day timeline entries.
- Exact fixture numbers and named staff/customer examples.
- The 20 Xu for 7 days recommendation.
- The four advisor-persona presentation if no stable Marketing catalogue is exposed.

## 9. P0, P1, P2 implementation order for supported and derivable fields

| Priority | Fields |
|---|---|
| P0 | Ops attendance; overdue work; pending reviews; review SLA breaches; missing-check-in after approved grace period; Loyalty total memberships |
| P1 | Marketing DNA status, touchpoints, daily recommendation/ideas/reasons, voice and audience; Loyalty new memberships, inactive observed memberships, voucher redemptions; Ops location aggregation, assignments, current shift, checklists, evidence attention; safe deep links |
| P2 | Marketing visual/promise/advisor capability; Loyalty valid game sessions and derived non-critical segments; preview links |

## 10. Audit limitations and mutation record

- No production database, private runtime response, or live authenticated API was queried.
- Current deployed row values, completeness, and freshness are **NOT VERIFIED**.
- Canonical Business/Location mappings are **NOT VERIFIED**.
- No product repository was edited.
- No API, database, migration, deployment, feature, UI, or fixture was changed.
- Production mutations: **NONE**.

The companion proposal in ANLIEN_READ_PROJECTION_V1_PROPOSAL.md defines how these results can become a minimal read-only integration after approval.
