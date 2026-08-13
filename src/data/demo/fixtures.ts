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
      value: "82%",
      owner: "marketing",
      futureSource: "marketing.brand_dna_summary.v1",
      scope: "business",
      status: "demo",
    },
    {
      id: "marketing-ideas-today",
      label: "ý tưởng phù hợp hôm nay",
      value: "4",
      owner: "marketing",
      futureSource: "marketing.daily_recommendation.v1",
      scope: "business",
      status: "demo",
    },
    {
      id: "marketing-touchpoints",
      label: "điểm chạm cần hoàn thiện",
      value: "3",
      owner: "marketing",
      futureSource: "marketing.brand_touchpoints.v1",
      scope: "business",
      status: "demo",
    },
  ],
  alerts: [
    {
      id: "marketing-dna-ready",
      product: "marketing",
      tone: "success",
      label: "DNA thương hiệu hoàn thiện 82%",
      detail: "Còn 3 điểm chạm cần bổ sung.",
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
      futureSource: "loyalty.customer_summary.v1",
      scope: "business",
      status: "demo",
    },
    {
      id: "loyalty-voucher-redeemed",
      label: "voucher đã sử dụng",
      value: "18",
      owner: "loyalty",
      futureSource: "loyalty.redemption_summary.v1",
      scope: "business",
      status: "demo",
    },
    {
      id: "loyalty-inactive",
      label: "khách lâu chưa quay lại",
      value: "87",
      owner: "loyalty",
      futureSource: "loyalty.customer_segments.v1",
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
      futureSource: "ops.attendance_summary.v1",
      scope: "location",
      status: "demo",
    },
    {
      id: "ops-checklist",
      label: "checklist hoàn thành",
      value: "17 / 20",
      owner: "ops",
      futureSource: "ops.task_completion.v1",
      scope: "location",
      status: "demo",
    },
    {
      id: "ops-overdue",
      label: "việc cần quản lý xử lý",
      value: "2",
      owner: "ops",
      futureSource: "ops.task_attention.v1",
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
    "Giọng quán trẻ và gần gũi",
    "Nhóm món lạnh có nhiều góc khai thác",
  ],
  brandDna: {
    readiness: 82,
    status: "82% hoàn thiện",
    voice: ["Trẻ", "Gần gũi", "Tinh nghịch"],
    audience: "18 đến 30 tuổi",
    visualStyle: ["Tươi", "Sạch", "Trẻ"],
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
  metrics: {
    staffCheckIn: { id: "owner-staff-checkin", label: "Nhân sự vào ca", value: "8/9", detail: "1 người cần kiểm tra", owner: "ops", scope: "location", status: "demo", futureSource: "ops.attendance_summary.v1" },
    taskCompletion: { id: "owner-task-completion", label: "Việc hoàn thành đúng", value: "17/20", detail: "2 việc đang trễ", owner: "ops", scope: "location", status: "demo", futureSource: "ops.task_completion.v1" },
    customersToday: { id: "owner-customers-today", label: "Khách hôm nay", value: "29", detail: "23 quay lại · 6 khách mới", owner: "loyalty", scope: "business", status: "demo", futureSource: "loyalty.daily_customer_activity.v1" },
    returningToday: { id: "owner-returning-today", label: "Khách quay lại", value: "23", owner: "loyalty", scope: "business", status: "demo", futureSource: "loyalty.daily_customer_activity.v1" },
    newToday: { id: "owner-new-today", label: "Khách mới", value: "6", owner: "loyalty", scope: "business", status: "demo", futureSource: "loyalty.daily_customer_activity.v1" },
    brandReadiness: { id: "owner-brand-readiness", label: "DNA thương hiệu", value: "82%", detail: "Còn 3 điểm chạm cần bổ sung", owner: "marketing", scope: "business", status: "demo", futureSource: "marketing.brand_dna_summary.v1" },
    opsOverdue: { id: "owner-ops-overdue", label: "việc trễ", value: "2", owner: "ops", scope: "location", status: "demo", futureSource: "ops.task_attention.v1" },
    opsPendingReview: { id: "owner-ops-review", label: "chờ duyệt", value: "1", owner: "ops", scope: "location", status: "demo", futureSource: "ops.review_queue.v1" },
    opsOpenIssues: { id: "owner-ops-issues", label: "sự cố mở", value: "1", owner: "ops", scope: "location", status: "demo", futureSource: "ops.open_issues.v1" },
    opsCashDifference: { id: "owner-ops-cash", label: "lệch bàn giao", value: "0đ", owner: "ops", scope: "location", status: "demo", futureSource: "ops.shift_handover_summary.v1" },
    customerProfiles: { id: "owner-customer-profiles", label: "hồ sơ khách đã lưu", value: "486", owner: "loyalty", scope: "business", status: "demo", futureSource: "loyalty.customer_summary.v1" },
    inactiveCustomers: { id: "owner-inactive-customers", label: "khách hơn 45 ngày chưa quay lại", value: "87", owner: "loyalty", scope: "business", status: "demo", futureSource: "loyalty.customer_segments.v1" },
    vouchersToday: { id: "owner-vouchers-today", label: "voucher dùng hôm nay", value: "18", owner: "loyalty", scope: "business", status: "demo", futureSource: "loyalty.redemption_summary.v1" },
    gamePlaysToday: { id: "owner-game-plays", label: "lượt chơi", value: "42", owner: "loyalty", scope: "business", status: "demo", futureSource: "loyalty.activity_summary.v1" },
    feedbackPending: { id: "owner-feedback-pending", label: "phản hồi cần xử lý", value: "1", owner: "loyalty", scope: "business", status: "demo", futureSource: "loyalty.feedback_attention.v1" },
    ideasToday: { id: "owner-ideas-today", label: "ý tưởng hôm nay", value: "4", owner: "marketing", scope: "business", status: "demo", futureSource: "marketing.daily_recommendation.v1" },
    touchpointsPending: { id: "owner-touchpoints-pending", label: "điểm chạm cần bổ sung", value: "3", owner: "marketing", scope: "business", status: "demo", futureSource: "marketing.brand_touchpoints.v1" },
  },
  branches: [
    { name: "Nguyễn Thái Học", completion: { id: "branch-nth-completion", label: "Việc hoàn thành đúng", value: "85%", owner: "ops", scope: "location", status: "demo", futureSource: "ops.location_completion.v1" }, status: "2 việc trễ" },
    { name: "Trần Phú", completion: { id: "branch-tp-completion", label: "Việc hoàn thành đúng", value: "94%", owner: "ops", scope: "location", status: "demo", futureSource: "ops.location_completion.v1" }, status: "Đúng nhịp" },
  ],
  assignments: [
    { id: "a1", task: "Vệ sinh khu vực khách", assignee: "Linh", due: "18:45", status: "doing" },
    { id: "a2", task: "Đối soát quầy thu ngân", assignee: "Minh", due: "19:00", status: "review" },
    { id: "a3", task: "Bổ sung nguyên liệu quầy bar", assignee: "Nam", due: "18:20", status: "late" },
  ],
  priorities: [
    { id: "checkin", owner: "ops", scope: "location", status: "demo", futureSource: "ops.attendance_attention.v1", tone: "warning", area: "Nhân sự", title: "Nam chưa vào ca tối", detail: "Ca bắt đầu lúc 17:00", action: "assign", actionLabel: "Xử lý" },
    { id: "review", owner: "ops", scope: "location", status: "demo", futureSource: "ops.review_queue.v1", tone: "warning", area: "Vận hành", title: "1 việc chờ duyệt quá 15 phút", detail: "Đối soát quầy thu ngân", action: "assign", actionLabel: "Xem việc" },
    { id: "inactive", owner: "loyalty", scope: "business", status: "demo", futureSource: "loyalty.customer_segments.v1", tone: "neutral", area: "Khách hàng", title: "87 khách hơn 45 ngày chưa quay lại", detail: "Có thể tạo một lời mời quay lại", action: "customers", actionLabel: "Chăm lại" },
    { id: "feedback", owner: "loyalty", scope: "business", status: "demo", futureSource: "loyalty.feedback_attention.v1", tone: "neutral", area: "Khách hàng", title: "1 phản hồi 2 sao chưa trả lời", action: "feedback", actionLabel: "Phản hồi" },
    { id: "dna", owner: "marketing", scope: "business", status: "demo", futureSource: "marketing.brand_dna_summary.v1", tone: "success", area: "Thương hiệu", title: "DNA còn thiếu 3 điểm chạm", detail: "Thông tin quán chưa hoàn chỉnh", action: "brand", actionLabel: "Bổ sung" },
  ],
  quickActions: [
    { id: "01", label: "Phân công việc", detail: "Giao từ SOP có sẵn", action: "assign" },
    { id: "02", label: "Chăm khách cũ", detail: "Chọn nhóm và ưu đãi", action: "customers" },
    { id: "03", label: "Xem gợi ý hôm nay", detail: "Ý tưởng từ DNA và bối cảnh quán", action: "idea" },
  ],
  productPreviews: [
    { product: "ops", eyebrow: "VẬN HÀNH QUÁN", title: "ANLIEN Ops", promise: "Vận hành", features: ["Ca làm", "Checklist", "SOP", "Công việc"], facts: ["8/9 đã vào ca", "17/20 việc hoàn thành"], href: "/demo/ops", actionLabel: "Xem cách vận hành" },
    { product: "loyalty", eyebrow: "GIỮ KHÁCH", title: "ANLIEN Loyalty", promise: "Giữ khách", features: ["Khách hàng", "Voucher", "Điểm thưởng", "Phản hồi"], facts: ["486 hồ sơ khách", "87 khách cần chăm lại"], href: "/demo/loyalty", actionLabel: "Xem cách giữ khách" },
    { product: "marketing", eyebrow: "XÂY THƯƠNG HIỆU", title: "ANLIEN Marketing", promise: "Xây thương hiệu và kéo khách", features: ["Brand DNA", "Ý tưởng", "Content", "Thiết kế"], facts: ["DNA 82%", "4 ý tưởng hôm nay"], href: "/demo/marketing", actionLabel: "Xem cách làm marketing" },
  ],
};

export const dayTimeline: DayMoment[] = [
  {
    time: "07:30",
    label: "Mở quán",
    product: "ops",
    message: "Checklist mở ca · 17/20 việc hoàn thành.",
    action: "3 việc còn lại được đưa vào danh sách chú ý.",
  },
  {
    time: "10:00",
    label: "Marketing",
    product: "marketing",
    message: "ANLIEN gợi ý 4 ý tưởng hôm nay.",
    action: "Chủ quán chọn ý tưởng phù hợp.",
  },
  {
    time: "14:00",
    label: "Khách hàng",
    product: "loyalty",
    message: "87 khách lâu chưa quay lại.",
    action: "Một lời mời quay lại đã được gợi ý.",
  },
  {
    time: "17:00",
    label: "Ca tối",
    product: "ops",
    message: "8/9 nhân sự đã check-in.",
    action: "Nam được đưa vào danh sách cần xử lý.",
  },
  {
    time: "22:30",
    label: "Cuối ngày",
    product: "overview",
    message: "Các việc còn tồn được gom cho quản lý.",
    action: "Ngày mai bắt đầu với danh sách rõ ràng.",
  },
];
