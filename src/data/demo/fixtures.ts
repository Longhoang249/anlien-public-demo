import type {
  BusinessContext,
  DayMoment,
  LocationContext,
  LoyaltyDemo,
  MarketingDemo,
  OpsDemo,
  OrganizationContext,
  ProductSummary,
} from "@/src/contracts/shell";

export const demoOrganization: OrganizationContext = {
  id: "demo-org-fnb-an-lien",
  name: "ANLIEN Demo Organization",
};

export const demoBusiness: BusinessContext = {
  id: "demo-business-fnb-an-lien",
  organizationId: demoOrganization.id,
  name: "FnB Ăn Liền (Demo quán)",
  isDemo: true,
  status: "active",
};

export const demoLocations: LocationContext[] = [
  {
    id: "demo-location-01",
    businessId: demoBusiness.id,
    name: "Cơ sở Nguyễn Thái Học",
  },
];

export const marketingSummary: ProductSummary = {
  product: "marketing",
  status: "attention",
  promise: "Kéo khách",
  metrics: [
    {
      id: "marketing-content-planned",
      label: "nội dung đang chuẩn bị",
      value: "3",
      owner: "marketing",
      futureSource: "Marketing content projection",
      scope: "business",
      status: "demo",
    },
    {
      id: "marketing-content-review",
      label: "nội dung chờ duyệt",
      value: "1",
      owner: "marketing",
      futureSource: "Marketing review projection",
      scope: "business",
      status: "demo",
    },
  ],
  alerts: [
    {
      id: "marketing-review-alert",
      product: "marketing",
      tone: "neutral",
      label: "3 nội dung đang chờ bạn xem",
      detail: "Bản nháp đầu tiên đã sẵn sàng.",
      scope: "business",
      status: "demo",
    },
  ],
};

export const loyaltySummary: ProductSummary = {
  product: "loyalty",
  status: "attention",
  promise: "Giữ khách",
  metrics: [
    {
      id: "loyalty-members",
      label: "khách thành viên",
      value: "486",
      owner: "loyalty",
      futureSource: "Loyalty customer projection",
      scope: "business",
      status: "demo",
    },
    {
      id: "loyalty-voucher-redeemed",
      label: "voucher đã sử dụng",
      value: "18",
      owner: "loyalty",
      futureSource: "Loyalty redemption projection",
      scope: "business",
      status: "demo",
    },
    {
      id: "loyalty-inactive",
      label: "khách lâu chưa quay lại",
      value: "87",
      owner: "loyalty",
      futureSource: "Loyalty inactive-customer segment projection",
      scope: "business",
      status: "demo",
    },
  ],
  alerts: [
    {
      id: "loyalty-inactive-alert",
      product: "loyalty",
      tone: "neutral",
      label: "87 khách đã lâu chưa quay lại",
      detail: "Có thể tạo một ưu đãi quay lại cho nhóm này.",
      scope: "business",
      status: "demo",
    },
  ],
};

export const opsSummary: ProductSummary = {
  product: "ops",
  status: "attention",
  promise: "Vận hành",
  metrics: [
    {
      id: "ops-attendance",
      label: "nhân sự đã vào ca",
      value: "8 / 9",
      owner: "ops",
      futureSource: "Ops attendance projection",
      scope: "location",
      status: "demo",
    },
    {
      id: "ops-checklist",
      label: "checklist hoàn thành",
      value: "17 / 20",
      owner: "ops",
      futureSource: "Ops checklist projection",
      scope: "location",
      status: "demo",
    },
    {
      id: "ops-overdue",
      label: "việc cần quản lý xử lý",
      value: "2",
      owner: "ops",
      futureSource: "Ops overdue-task projection",
      scope: "location",
      status: "demo",
    },
  ],
  alerts: [
    {
      id: "ops-missing-checkin",
      product: "ops",
      tone: "warning",
      label: "Nam chưa check-in ca tối",
      detail: "Ca bắt đầu lúc 17:00.",
      scope: "location",
      status: "demo",
    },
    {
      id: "ops-opening-complete",
      product: "ops",
      tone: "success",
      label: "Checklist mở ca đã hoàn thành",
      scope: "location",
      status: "demo",
    },
  ],
};

export const marketingDemo: MarketingDemo = {
  suggestion: "Đẩy nhóm đồ uống mát vào khung giờ chiều.",
  reasons: [
    "Page chưa có bài hôm nay",
    "Nhóm đồ uống mát hợp với khung giờ chiều",
    "Có thể tận dụng visual sản phẩm đã có",
  ],
  draft: {
    eyebrow: "Bản nháp · 15:00 hôm nay",
    title: "Chiều nay, mình mời bạn một khoảng nghỉ thật mát.",
    body: "Trà đào cam sả mát dịu, thơm vừa đủ — một ly cho buổi chiều nhẹ tênh.",
    caption: "Ghé FnB Ăn Liền, chọn góc quen và để tụi mình làm mát ngày của bạn nhé.",
  },
  workflow: ["Nghĩ ý tưởng", "Tạo nội dung", "Chủ quán duyệt", "Lên lịch"],
};

export const loyaltyDemo: LoyaltyDemo = {
  recommendation:
    "Tạo ưu đãi quay lại cho nhóm khách đã lâu chưa ghé quán.",
  offer: {
    name: "Mời bạn quay lại",
    value: "Tặng 20 Xu",
    validity: "Dùng trong 7 ngày",
  },
  groups: [
    { id: "active", label: "Khách đang hoạt động", count: 132, note: "Có hoạt động gần đây" },
    { id: "new", label: "Khách mới", count: 41, note: "Tham gia trong 30 ngày" },
    { id: "loyal", label: "Khách thân thiết", count: 68, note: "Quay lại thường xuyên" },
    {
      id: "inactive",
      label: "Khách lâu chưa quay lại",
      count: 87,
      note: "Không có hoạt động trong 45 ngày",
      highlighted: true,
    },
  ],
};

export const opsDemo: OpsDemo = {
  shift: {
    name: "Ca tối hôm nay",
    time: "17:00 → 23:00",
    location: demoLocations[0].name,
    members: [
      { id: "linh", name: "Linh", status: "checked-in", detail: "Đã vào ca · 16:56" },
      { id: "minh", name: "Minh", status: "checked-in", detail: "Đã vào ca · 17:01" },
      { id: "nam", name: "Nam", status: "missing", detail: "Chưa check-in" },
    ],
  },
  checklist: {
    name: "Checklist mở ca",
    completed: 3,
    total: 4,
    items: [
      { id: "machine", label: "Kiểm tra máy pha", complete: true },
      { id: "ingredients", label: "Chuẩn bị nguyên liệu", complete: true },
      { id: "counter", label: "Kiểm tra khu vực quầy", complete: true },
      { id: "guest-area", label: "Vệ sinh khu vực khách", complete: false },
    ],
  },
};

export const dayTimeline: DayMoment[] = [
  {
    time: "07:30",
    label: "Mở quán",
    product: "ops",
    message: "Checklist mở ca đạt 80%.",
    action: "Quản lý biết ngay việc nào còn thiếu.",
  },
  {
    time: "10:00",
    label: "Marketing",
    product: "marketing",
    message: "ANLIEN chuẩn bị bài đăng hôm nay.",
    action: "Chủ quán xem và duyệt.",
  },
  {
    time: "14:00",
    label: "Loyalty",
    product: "loyalty",
    message: "Phát hiện nhóm khách lâu chưa quay lại.",
    action: "Gợi ý ưu đãi phù hợp.",
  },
  {
    time: "18:30",
    label: "Giờ cao điểm",
    product: "ops",
    message: "8 / 9 nhân sự đã vào ca, 2 việc đang trễ.",
    action: "Chủ quán chỉ cần xử lý ngoại lệ.",
  },
  {
    time: "22:30",
    label: "Cuối ngày",
    product: "overview",
    message: "ANLIEN gom Marketing, Khách hàng và Vận hành.",
    action: "Một lượt xem là nắm được cả ngày.",
  },
];

