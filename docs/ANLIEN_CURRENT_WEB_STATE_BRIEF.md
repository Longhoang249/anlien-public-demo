# CODEX BRIEF: ANLIEN CURRENT WEB STATE

> Historical note, 2026-08-14: this brief describes the pre-audit V2.1 state. For current product truth, use `ANLIEN_REALITY_CONTRACT_AUDIT.md`, `ANLIEN_READ_PROJECTION_V1_PROPOSAL.md`, and `ANLIEN_SHELL_INTEGRATION_READINESS.md`.

## 0. Cách dùng tài liệu này

Tài liệu này mô tả trạng thái hiện tại của ANLIEN Public Demo Shell để một GPT khác có thể:

1. Hiểu web đang là gì.
2. Phân biệt phần đã có, phần chỉ là demo và phần chưa kết nối.
3. Đánh giá UX, product semantics và kiến trúc.
4. Đưa ra phương án tiếp theo theo thứ tự ưu tiên.

Trong phản hồi đầu tiên, không viết code và không tự triển khai. Hãy phân tích hiện trạng, chỉ ra vấn đề và đề xuất phương án.

## 1. Tóm tắt hiện trạng

ANLIEN Public Demo Shell hiện là một Owner Command Center dành cho chủ quán F&B.

Mục tiêu của màn hình chính:

- Biết quán đang thế nào.
- Biết việc nào cần xử lý.
- Theo dõi vận hành, khách hàng và thương hiệu.
- Thực hiện một số thao tác mẫu ngay trên dashboard.
- Đi sâu vào từng product khi cần.

Đây vẫn là prototype dùng dữ liệu mô phỏng có cấu trúc. Web chưa kết nối dữ liệu production của ba product.

## 2. Link hiện tại

### Link dành cho người dùng và GPT đọc web

`https://anlien-public-demo.vercel.app`

### Link Sites

`https://anlien-public-demo.khoinghiep202.chatgpt.site`

Hai link đã được kiểm tra ngày 14/08/2026 và đều trả về nội dung Owner Command Center V2.1.

## 3. Ba product nguồn

| Domain trong Shell | Product nguồn | Vai trò |
| --- | --- | --- |
| Thương hiệu | `dong-goi-thuong-hieu` | Brand DNA, bối cảnh quán, ý tưởng, content, design, campaign planning và trợ lý cố vấn |
| Khách hàng | `fnbanlien-play` | Hồ sơ khách, Xu, voucher, redemption, trò chơi, phản hồi và retention |
| Vận hành | `fnbanlien-tu-van-hanh` | Nhân sự, ca làm, attendance, SOP, checklist, task, evidence và review |

Ba product vẫn là ba hệ thống độc lập. Shell hiện chỉ mô phỏng projection tổng hợp từ ba domain.

## 4. Kiến trúc hiện tại

```text
ANLIEN Public Demo Shell
↓
Typed contracts
↓
Mock adapters
↓
Deterministic demo fixtures
```

Kiến trúc mong muốn trong tương lai:

```text
ANLIEN Owner Portal
↓
Identity và Business Context chung
↓
Versioned product projections
├── Marketing projection
├── Loyalty projection
└── Ops projection
```

Không nên cho Shell đọc trực tiếp bảng dữ liệu nội bộ của ba product.

## 5. Công nghệ và hosting

- React 19.
- Next.js 16 cho Vercel build.
- Vinext và Cloudflare Worker output cho Sites build.
- TypeScript.
- CSS thuần trong `app/globals.css`.
- Không có database cho Shell.
- Không có authentication.
- Không gọi production API.
- Không có production mutation.
- Có hai deployment target: Vercel và ChatGPT Sites.

## 6. Routes hiện tại

| Route | Nội dung |
| --- | --- |
| `/` | Owner Command Center public entry |
| `/demo` | Owner Command Center |
| `/demo/marketing` | Brand DNA, ý tưởng, điểm chạm và trợ lý |
| `/demo/loyalty` | Nhóm khách, voucher và ưu đãi quay lại |
| `/demo/ops` | Ca làm, check-in, checklist và bằng chứng vận hành |
| `/demo/day` | Hành trình một ngày của chủ quán |

Navigation hiện tại:

```text
Tổng quan
Thương hiệu
Khách hàng
Vận hành
Một ngày
```

## 7. Màn hình Tổng quan hiện tại

### Hero

```text
Nắm quán. Chốt việc.
Việc cần biết. Việc cần làm.
```

### Bốn KPI đầu trang

| KPI | Giá trị demo | Owner | Scope |
| --- | --- | --- | --- |
| Nhân sự vào ca | 8/9 | Ops | Location |
| Việc hoàn thành đúng | 17/20 | Ops | Location |
| Khách hôm nay | 29 | Loyalty | Business |
| DNA thương hiệu | 82% | Marketing | Business |

Chi tiết Khách hôm nay:

```text
23 quay lại · 6 khách mới
```

Chi tiết DNA:

```text
Còn 3 điểm chạm cần bổ sung
```

### Priority inbox

Block `Cần bạn xử lý` hiện có năm item:

1. Nam chưa vào ca tối.
2. Một việc chờ duyệt quá 15 phút.
3. 87 khách hơn 45 ngày chưa quay lại.
4. Một phản hồi 2 sao chưa trả lời.
5. DNA còn thiếu 3 điểm chạm.

### Thao tác nhanh

1. Phân công việc từ SOP.
2. Chăm khách cũ bằng ưu đãi.
3. Xem gợi ý hôm nay từ DNA và bối cảnh quán.

### Ba domain card

Vận hành:

- Việc trễ.
- Việc chờ duyệt.
- Sự cố mở.
- Lệch bàn giao.
- So sánh trạng thái giữa hai cơ sở demo.

Khách hàng:

- 486 hồ sơ khách.
- 18 voucher dùng hôm nay.
- 42 lượt chơi.
- Một phản hồi cần xử lý.
- 87 khách cần chăm lại.

Thương hiệu:

- DNA 82%.
- Ba điểm chạm còn thiếu.
- Một gợi ý đáng làm hôm nay.

### Bảng công việc

Block `Ai đang làm gì?` hiển thị ba công việc mẫu với người phụ trách, thời hạn và trạng thái.

### Product previews

Ba card cuối giới thiệu Ops, Loyalty và Marketing bằng feature cụ thể cùng dữ liệu demo, sau đó dẫn tới route nội bộ tương ứng.

## 8. Tương tác demo hiện có

Các thao tác sau chỉ thay đổi local component state:

- Giao việc mẫu cho nhân sự.
- Chuẩn bị ưu đãi cho nhóm khách cũ.
- Lưu câu trả lời phản hồi mẫu.
- Cập nhật Brand DNA mẫu.
- Chọn ý tưởng Marketing.
- Nhắc nhân sự check-in.
- Hoàn thành một checklist item.

Không có dữ liệu thật được gửi hoặc lưu.

## 9. Data contract hiện tại

Mỗi Overview metric có:

```ts
{
  id
  label
  value
  detail
  owner
  scope
  status
  futureSource
}
```

Ví dụ:

```ts
{
  id: "owner-staff-checkin",
  label: "Nhân sự vào ca",
  value: "8/9",
  owner: "ops",
  scope: "location",
  status: "demo",
  futureSource: "ops.attendance_summary.v1"
}
```

Tài liệu mapping chi tiết:

`docs/ANLIEN_SHELL_INTEGRATION_READINESS.md`

## 10. Visual direction

- Dùng đúng theme FnB Ăn Liền.
- Font Be Vietnam Pro.
- Background xám trung tính.
- Card trắng, bo góc vừa phải.
- Orange dùng cho CTA và highlight chính.
- Ops dùng accent xanh dương.
- Loyalty dùng accent tím.
- Marketing dùng accent cam.
- Không sidebar.
- Không futuristic AI visual.
- Không dùng copy landing page SaaS dài.
- Không dùng em dash trong user-facing Vietnamese copy.

## 11. Spacing hiện tại

Spacing vừa được refine:

| Khu vực | Desktop | Mobile |
| --- | --- | --- |
| Giữa các KPI | 20px | 14px |
| Hero tới KPI | 24px | 18px |
| KPI tới priority inbox | 28px | 18px |
| Priority inbox tới quick actions theo chiều ngang | 24px | Chuyển thành một cột |
| Giữa các section chính | 28px | 18px |

Không có horizontal overflow trong QA gần nhất.

## 12. Trạng thái kiểm thử gần nhất

- Typecheck: passed.
- Lint: passed.
- Tests: 2/2 passed.
- Sites build: passed.
- Vercel build: passed.
- Browser console errors: 0.
- Desktop QA: passed.
- Mobile QA: passed.

Latest local commit:

```text
d8aa6af Improve dashboard card spacing
```

## 13. Những phần chưa có

- Chưa có đăng nhập dùng chung.
- Chưa có Identity Bridge.
- Chưa có canonical Business và Location mapping thật.
- Chưa có versioned read projection thật từ ba product.
- Chưa có cơ chế write-back từ Shell về product.
- Chưa có permission và entitlement thật.
- Chưa có database hoặc persistent state cho Shell.
- Location filter mới là UI demo.
- Marketing và Loyalty vẫn giữ Business scope.
- Ops là domain duy nhất có Location-aware metrics.
- CTA `Dùng cho quán của bạn` chưa dẫn tới onboarding thật.

## 14. Vấn đề cần GPT đánh giá

### Product

1. Owner Command Center hiện đã cho chủ quán thấy đúng những gì cần theo dõi hằng ngày chưa?
2. KPI nào nên giữ, bỏ hoặc thay?
3. Priority inbox có đang là trung tâm đúng nghĩa chưa?
4. Dashboard đang quá giống demo showroom hay đã đủ giống một sản phẩm dùng hằng ngày?
5. `Một ngày` nên giữ như route riêng hay tích hợp vào Overview?

### UX

1. Information hierarchy có rõ trong năm giây đầu không?
2. Có phần nào đang lặp metric mà không tạo thêm insight không?
3. Mức độ dày thông tin hiện tại có phù hợp chủ quán nhỏ và vừa không?
4. Thao tác nhanh nào thật sự cần nằm trên Overview?
5. Cần thay đổi gì cho mobile?

### Architecture

1. Nên xây Identity và Business Context chung theo hướng nào?
2. Read projection đầu tiên của mỗi product nên chứa field nào?
3. Nên tích hợp read-only trước rồi mới write-back như thế nào?
4. Shell nên là product độc lập, BFF hay frontend federation?
5. Làm thế nào để ba product vẫn deploy và phát triển độc lập?

## 15. Constraints bắt buộc

- Không gộp ba codebase thành một monolith nếu chưa có lý do rõ ràng.
- Không đọc trực tiếp database nội bộ của product khác.
- Không tự giả định cùng một `shop_id` dùng được ở cả ba hệ thống.
- Không tạo metric sai domain owner.
- Không claim workflow Marketing chưa tồn tại.
- Không mô tả AI tự publish, tự gửi voucher hoặc tự giao việc.
- Human vẫn là người xác nhận hành động.
- Ưu tiên read-only integration trước mutation.
- Không thay visual direction nếu chưa chứng minh vấn đề.
- Không viết lại toàn bộ prototype từ đầu.

## 16. Yêu cầu đầu ra từ GPT

Hãy trả lời theo cấu trúc:

### A. Chẩn đoán hiện trạng

- Điểm đang làm tốt.
- Điểm chưa rõ.
- Rủi ro product.
- Rủi ro UX.
- Rủi ro architecture.

### B. Phương án đề xuất

Đưa ra tối đa ba phương án:

1. Tiếp tục làm public demo showroom.
2. Chuyển dần thành Owner Portal read-only.
3. Xây cổng điều hành có write-back được kiểm soát.

Với mỗi phương án, nêu:

- Mục tiêu.
- Phạm vi.
- Lợi ích.
- Chi phí và rủi ro.
- Điều kiện để thực hiện.

### C. Phương án khuyến nghị

- Chọn một phương án.
- Giải thích vì sao.
- Nêu những gì chưa nên làm.

### D. Roadmap

Đề xuất roadmap theo phase:

```text
Phase 0: Chốt product contract
Phase 1: Read-only projections
Phase 2: Identity và Business Context
Phase 3: Controlled write-back
Phase 4: Auth, permission và onboarding
```

Hãy điều chỉnh phase nếu có lý do tốt hơn.

### E. Việc cần quyết định từ owner

Chỉ hỏi những quyết định thật sự ảnh hưởng tới kiến trúc hoặc product direction.

## 17. Các file nên đọc nếu có quyền truy cập workspace

- `src/contracts/shell.ts`
- `src/data/demo/fixtures.ts`
- `src/adapters/demo-snapshot.ts`
- `src/adapters/product-adapters.ts`
- `src/showroom/OverviewPage.tsx`
- `src/showroom/MarketingPage.tsx`
- `src/showroom/LoyaltyPage.tsx`
- `src/showroom/OpsPage.tsx`
- `src/showroom/DayPage.tsx`
- `docs/ANLIEN_SHELL_INTEGRATION_READINESS.md`
- `docs/ANLIEN_PUBLIC_DEMO_SHELL_V2_1_REPORT.md`

## 18. Screenshots tham khảo

- `artifacts/v2.1/full-page-desktop.png`
- `artifacts/v2.1/overview-desktop.png`
- `artifacts/v2.1/overview-mobile.png`
- `artifacts/v2.1/thuong-hieu-desktop.png`
- `artifacts/v2.1/khach-hang-desktop.png`
- `artifacts/v2.1/van-hanh-desktop.png`
- `artifacts/v2.1/spacing-after.png`

## 19. Handoff prompt

```text
Bạn đang review ANLIEN Public Demo Shell, một Owner Command Center mô phỏng cho chủ quán F&B. Shell tổng hợp ba domain độc lập: Marketing, Loyalty và Ops. Hiện tại toàn bộ dữ liệu là deterministic mock fixtures, chưa có auth, database, production API hoặc cross-product identity mapping.

Hãy đọc brief này như nguồn sự thật về trạng thái hiện tại. Không viết code ở phản hồi đầu tiên. Hãy chẩn đoán product, UX và architecture; so sánh tối đa ba hướng phát triển; chọn một hướng khuyến nghị; sau đó đưa ra roadmap theo phase và các quyết định owner cần chốt.

Không giả định ba product dùng chung ID. Không đề xuất Shell đọc trực tiếp database nội bộ. Không claim AI tự publish, tự gửi voucher hoặc tự giao việc. Ưu tiên read-only integration trước controlled write-back.
```
