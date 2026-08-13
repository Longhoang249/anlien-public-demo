# ANLIEN PUBLIC DEMO SHELL V2.1 REPORT

## Refined

- Hero: giữ “Nắm quán. Chốt việc.” và rút subtitle còn “Việc cần biết. Việc cần làm.”
- Summary: chỉnh thành Nhân sự vào ca, Việc hoàn thành đúng, Khách hôm nay và DNA thương hiệu.
- Priority inbox: giữ vị trí trung tâm với 5 tín hiệu thuộc Ops, Loyalty và Marketing.
- Quick actions: đổi action số 03 thành “Xem gợi ý hôm nay”.
- Operations: hiện việc trễ, việc chờ duyệt, sự cố, lệch bàn giao và so sánh cơ sở.
- Customers: hiện hồ sơ khách, voucher, lượt chơi, phản hồi và nhóm cần chăm lại.
- Brand: hiện DNA 82%, điểm chạm còn thiếu và gợi ý từ bối cảnh quán.
- Product previews: ba card có feature, tín hiệu thật và đường dẫn vào demo nội bộ.
- One-day experience: năm thời điểm từ mở quán tới cuối ngày.
- Navigation: đổi “Nhân sự” thành “Vận hành”.

## Copy cleanup

- Long copy removed: hero và ba product page đã được rút gọn.
- Em dash occurrences remaining: 0.
- Unsupported product claims removed: không có content approval, scheduled publishing hoặc autonomous workflow.

## Marketing semantics

- Brand DNA representation: 82% hoàn thiện, giọng thương hiệu, khách chính, phong cách hình ảnh và điểm chạm còn thiếu.
- Idea/recommendation representation: 4 ý tưởng từ DNA và bối cảnh quán.
- Removed fake content workflow assumptions: yes.

## Integration readiness

- Updated fields: DNA thương hiệu, khách hôm nay, khách quay lại, khách mới, khách lâu chưa quay lại, task overdue, staff check-in và idea recommendation.
- Product ownership verified: Marketing, Loyalty và Ops giữ đúng domain ownership.
- Future projections mapped: mỗi Overview metric có owner, scope, status và futureSource.

## Validation

- Typecheck: passed.
- Lint: passed.
- Tests: passed, 2/2.
- Build: Sites and Vercel builds passed.
- Console errors: 0 trong browser QA.
- Production APIs called: NO.
- Production mutations: NONE.

## Files changed

- `src/contracts/shell.ts`
- `src/data/demo/fixtures.ts`
- `src/showroom/OverviewPage.tsx`
- `src/showroom/ShowroomApp.tsx`
- `src/showroom/MarketingPage.tsx`
- `src/showroom/LoyaltyPage.tsx`
- `src/showroom/OpsPage.tsx`
- `src/showroom/DayPage.tsx`
- `app/globals.css`
- `tests/rendered-html.test.mjs`
- `docs/ANLIEN_SHELL_INTEGRATION_READINESS.md`
- `docs/ANLIEN_PUBLIC_DEMO_SHELL_V2_1_REPORT.md`

## Screenshots

- `artifacts/v2.1/full-page-desktop.png`
- `artifacts/v2.1/overview-desktop.png`
- `artifacts/v2.1/overview-mobile.png`
- `artifacts/v2.1/thuong-hieu-desktop.png`
- `artifacts/v2.1/khach-hang-desktop.png`
- `artifacts/v2.1/van-hanh-desktop.png`

## Known gaps

- Prototype vẫn dùng deterministic mock fixtures.
- Location filter chưa thay đổi Marketing hoặc Loyalty vì hai domain này giữ Business scope.
- Demo actions chỉ thay đổi local component state và không lưu dữ liệu.
- Chưa có identity bridge, auth, production API hoặc product projection thật.

## Final status

READY FOR OWNER/CHATGPT REVIEW

## Handoff to ChatGPT

ANLIEN Public Demo Shell V2.1 has been refined as an Owner Command Center. Product semantics, demo data boundaries and future integration mapping remain isolated from production. Please review UX and architecture before any connectivity work.
