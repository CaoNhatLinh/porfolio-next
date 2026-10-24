import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
if (!url || !serviceKey || !adminEmail)
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and ADMIN_EMAIL before seeding.",
  );

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data: users, error: usersError } = await supabase.auth.admin.listUsers({
  perPage: 1000,
});
if (usersError) throw usersError;
const owner = users.users.find(
  (user) => user.email?.toLowerCase() === adminEmail.toLowerCase(),
);
if (!owner)
  throw new Error(
    `No Supabase Auth user found for ${adminEmail}. Create the single admin user first.`,
  );

const profile = {
  owner_id: owner.id,
  name: "Cao Nhật Linh",
  title: { vi: "Lập trình viên full-stack", en: "Full-stack developer" },
  intro: {
    vi: "Tôi xây những sản phẩm số rõ ràng, nhanh và có cảm giác thật tốt khi sử dụng.",
    en: "I build digital products that feel clear, fast, and genuinely good to use.",
  },
  bio: {
    vi: "Từ giao diện đến kiến trúc phía sau, tôi thích biến những vấn đề phức tạp thành trải nghiệm dễ hiểu và có thể tin cậy.",
    en: "From interface to infrastructure, I turn complex problems into experiences people can understand and trust.",
  },
  email: "caonhatlinh1312@gmail.com",
  image_url: "/media/profile.jpg",
  location: "Ho Chi Minh City, Vietnam",
  availability: {
    vi: "Đang nhận dự án chọn lọc",
    en: "Open to selected projects",
  },
  response_time: {
    vi: "Thường phản hồi trong 2 ngày làm việc",
    en: "Usually replies within two working days",
  },
  engagement_modes: ["full-time", "freelance", "consulting", "conversation"],
  resume_updated_at: "2026-08-29",
  socials: [{ label: "GitHub", href: "https://github.com/CaoNhatLinh" }],
  resume_url: "",
  seo: {
    title: "Cao Nhật Linh | Full-stack developer",
    description: "Clear, fast, and human digital products.",
  },
};
const projects = [
  {
    slug: "tutor-connect",
    title: "Tutor Connect",
    category: "Mobile application",
    summary: {
      vi: "Kết nối gia sư và người học qua một trải nghiệm mobile gọn gàng.",
      en: "A focused mobile experience connecting tutors and learners.",
    },
    role: { vi: "Thiết kế và phát triển", en: "Design and development" },
    duration: "2024",
    team_context: {
      vi: "Độc lập / sản phẩm cá nhân",
      en: "Independent / personal product",
    },
    year: "2024",
    stack: ["React Native", "Expo", "TypeScript"],
    image_url: "/media/tutor-connect.jpg",
    gallery: [
      {
        src: "/media/tutor-connect.jpg",
        alt: "Tutor Connect project interface",
      },
    ],
    is_featured: true,
    featured_order: 1,
    sort_order: 1,
    status: "PUBLISHED",
    links: [{ label: "GitHub", href: "https://github.com/CaoNhatLinh" }],
    proof_links: [{ label: "Case study", href: "/work/tutor-connect" }],
    outcome: {
      vi: "Một luồng học tập rõ ràng hơn, từ tìm kiếm đến đặt lịch.",
      en: "A calmer learning flow from discovery to booking.",
    },
  },
  {
    slug: "zing-music",
    title: "Zing Music",
    category: "Mobile application",
    summary: {
      vi: "Một bài tập về playlist, nhịp điệu và những chuyển động nhỏ.",
      en: "An exploration of playlists, rhythm, and small moments of motion.",
    },
    role: { vi: "Phát triển giao diện", en: "Interface development" },
    duration: "2023",
    team_context: {
      vi: "Độc lập / exploration",
      en: "Independent / exploration",
    },
    year: "2023",
    stack: ["React Native", "Expo", "Firebase"],
    image_url: "/media/zing-music.png",
    is_featured: false,
    featured_order: 0,
    sort_order: 2,
    status: "PUBLISHED",
    links: [
      { label: "GitHub", href: "https://github.com/CaoNhatLinh/ZingMusic" },
    ],
    proof_links: [{ label: "Case study", href: "/work/zing-music" }],
    outcome: {
      vi: "Một không gian nghe nhạc thân thiện, ưu tiên nội dung đang phát.",
      en: "A friendly listening space that keeps the current track in focus.",
    },
  },
  {
    slug: "motorcycle-store",
    title: "Motorcycle Store",
    category: "Web application",
    summary: {
      vi: "Giao diện thương mại điện tử cho sản phẩm cần được nhìn thật kỹ.",
      en: "An ecommerce interface for products that deserve a closer look.",
    },
    role: { vi: "Frontend developer", en: "Frontend developer" },
    duration: "2022",
    team_context: {
      vi: "Độc lập / coursework",
      en: "Independent / coursework",
    },
    year: "2022",
    stack: ["HTML", "CSS", "Bootstrap"],
    image_url: "/media/motorcycle-store.png",
    is_featured: false,
    featured_order: 0,
    sort_order: 3,
    status: "PUBLISHED",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/CaoNhatLinh/GUI_WebBanXeMay",
      },
    ],
    proof_links: [{ label: "Case study", href: "/work/motorcycle-store" }],
    outcome: {
      vi: "Luồng chọn xe, xem chi tiết và thêm vào giỏ được làm gọn.",
      en: "A simpler path from browsing to product detail and cart.",
    },
  },
  {
    slug: "bus-management",
    title: "Bus Management",
    category: "Backend system",
    summary: {
      vi: "Công cụ quản lý đội xe và lịch trình cho một bài toán nhiều dữ liệu.",
      en: "A fleet and schedule management tool for a data-heavy problem.",
    },
    role: { vi: "Phát triển hệ thống", en: "System development" },
    duration: "2021",
    team_context: {
      vi: "Độc lập / coursework",
      en: "Independent / coursework",
    },
    year: "2021",
    stack: ["C#", ".NET", "SQL Server"],
    image_url: "/media/bus-management.png",
    is_featured: false,
    featured_order: 0,
    sort_order: 4,
    status: "PUBLISHED",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/CaoNhatLinh/Bus-management_.Net",
      },
    ],
    proof_links: [{ label: "Case study", href: "/work/bus-management" }],
    outcome: {
      vi: "Một màn hình quản lý bớt nhiễu và dễ theo dõi hơn.",
      en: "A quieter management surface that is easier to scan.",
    },
  },
].map((project) => ({ ...project, owner_id: owner.id }));

for (const [table, rows, conflict] of [
  ["site_profile", [profile], "owner_id"],
  ["projects", projects, "slug"],
]) {
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflict });
  if (error) throw error;
  console.log(`Seeded ${rows.length} ${table} record(s).`);
}
