import type {
  BusinessContext,
  DayMoment,
  LocationContext,
  LoyaltyDemo,
  MarketingDemo,
  OpsDemo,
  OwnerDashboardDemo,
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
  status: "healthy",
  promise: "Kéo khách",
  metrics: [
    {
      id: "marketing-brand-dna",
      label: "Brand DNA",
      value: "Đã chuẩn hóa",
      owner: "marketing",
      futureSource: "Marketing Brand DNA projection",
      scope: "business",
      status: "demo",
    },
    {
      id: "marketing-ideas-today",
      label: "ý tưởng phù hợp hôm nay",
      value: "4",
      owner: "marketing",
      futureSource: "Marketing idea projection",
      scope: "business",
      status: "demo",
    },
    {
      id: "marketing-touchpoints",
      label: "điểm chạm cần hoàn thiện",
      value: "3",
      owner: "marketing",
      futureSource: "Marketing touchpoint projection",
      scope: "business",
      status: "demo",
    },
  ],
  alerts: [
    {
      id: "marketing-dna-ready",
      product: "marketing",
      tone: "success",
      label: "Brand DNA đã sẵn sàng",
      detail: "ANLIEN đã nhớ giọng và khách chính của quán.",
      scope: "business",
      status: "demo",
    },
    {
      id: "marketing-ideas-ready",
      product: "marketing",
      tone: "neutral",
      label: "Có 4 ý tưởng phù hợp hôm nay",
      detail: "Ý tưởng dựa trên DNA và bối cảnh của quán.",
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
  brandDna: {
    status: "Đã chuẩn hóa",
    voice: ["Trẻ", "Gần gũi", "Tinh nghịch"],
    audience: "18 đến 30 tuổi",
    promise: "Một khoảng nghỉ nhanh, vui và vừa túi tiền.",
    touchpointsPending: 3,
  },
  ideas: [
    {
      id: "cool-drinks",
      title: "Đồ uống mát cho chiều nóng",
      angle: "Một khoảng nghỉ mát và nhẹ giữa ngày.",
      channel: "Facebook · Instagram",
    },
    {
      id: "behind-counter",
      title: "Một phút sau quầy",
      angle: "Kể câu chuyện người thật và nhịp làm việc của quán.",
      channel: "TikTok · Reels",
    },
    {
      id: "regular-corner",
      title: "Góc quen của khách quen",
      angle: "Biến trải nghiệm tại quán thành một điểm nhận diện.",
      channel: "Facebook · Tại quán",
    },
    {
      id: "combo-under-59",
      title: "Combo vui dưới 59K",
      angle: "Nói rõ giá trị nhưng vẫn giữ đúng giọng thương hiệu.",
      channel: "Menu · Social",
    },
  ],
  touchpoints: [
    { label: "Menu tại quầy", status: "ready" },
    { label: "Trang Facebook", status: "ready" },
    { label: "Mẫu phản hồi đánh giá", status: "pending" },
    { label: "Bao bì mang đi", status: "pending" },
    { label: "Kịch bản chào khách", status: "pending" },
  ],
  advisors: [
    { label: "Cố vấn thương hiệu", description: "Kiểm tra một ý tưởng có đúng DNA quán không." },
    { label: "Cố vấn marketing", description: "Chọn chủ đề, điểm chạm và cách tiếp cận phù hợp." },
    { label: "Trợ lý nội dung", description: "Biến ý tưởng đã chọn thành nội dung đúng giọng quán." },
    { label: "Trợ lý hình ảnh", description: "Gợi ý hướng hình ảnh nhất quán với thương hiệu." },
  ],
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

export const ownerDashboardDemo: OwnerDashboardDemo = {
  operations: {
    staffCheckedIn: 8,
    staffScheduled: 9,
    tasksCompleted: 17,
    tasksTotal: 20,
    overdue: 2,
    pendingReview: 1,
    openIssues: 1,
    cashDifference: "0đ",
  },
  customers: {
    total: 486,
    newToday: 6,
    returningToday: 23,
    inactive: 87,
    vouchersToday: 18,
    gamePlaysToday: 42,
    feedbackPending: 1,
  },
  brand: {
    readiness: 82,
    ideasToday: 4,
    touchpointsPending: 3,
    upcomingMoment: "Cuối tuần này",
  },
  branches: [
    { name: "Nguyễn Thái Học", completion: 85, status: "2 việc trễ" },
    { name: "Trần Phú", completion: 94, status: "Đúng nhịp" },
  ],
  assignments: [
    { id: "a1", task: "Vệ sinh khu vực khách", assignee: "Linh", due: "18:45", status: "doing" },
    { id: "a2", task: "Đối soát quầy thu ngân", assignee: "Minh", due: "19:00", status: "review" },
    { id: "a3", task: "Bổ sung nguyên liệu quầy bar", assignee: "Nam", due: "18:20", status: "late" },
  ],
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
    message: "Có 4 ý tưởng phù hợp với DNA quán.",
    action: "Chủ quán chọn việc đáng làm hôm nay.",
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
