import type { LocalizedText } from "./types";

export type ResumeExperience = {
  id?: string;
  logoUrl?: string;
  period: LocalizedText;
  title: LocalizedText;
  context: LocalizedText;
  description: LocalizedText;
  projectSlug?: string;
  evidenceUrl?: string;
  evidenceLabel?: LocalizedText;
};

export const resumeExperience: ResumeExperience[] = [
  {
    period: { vi: "12/2025 — hiện tại", en: "12/2025 — present" },
    title: { vi: "Software Engineer", en: "Software Engineer" },
    context: {
      vi: "Skipli · phần mềm cho nhà hàng",
      en: "Skipli · restaurant software",
    },
    description: {
      vi: "Tôi làm Software Engineer tại Skipli từ tháng 12/2025. Công ty phát triển website, online ordering và marketing cho nhà hàng. Tôi không đưa chi tiết triển khai nội bộ vào portfolio.",
      en: "I've worked as a Software Engineer at Skipli since December 2025. The company develops restaurant websites, online ordering, and marketing tools. Internal implementation details are not included in this portfolio.",
    },
    evidenceUrl: "https://www.skiplinow.com/",
    evidenceLabel: { vi: "Website công ty", en: "Company website" },
  },
  {
    period: { vi: "2025", en: "2025" },
    title: { vi: "Sản phẩm cá nhân", en: "Independent product work" },
    context: { vi: "Tutor Connect", en: "Tutor Connect" },
    description: {
      vi: "Phát triển ứng dụng React Native/Expo cho người học và gia sư, gồm tìm kiếm, hồ sơ, đặt lịch và chat.",
      en: "Developed a React Native/Expo app for learners and tutors, covering discovery, profiles, booking, and chat.",
    },
    projectSlug: "tutor-connect",
  },
  {
    period: { vi: "2023", en: "2023" },
    title: { vi: "Phát triển giao diện", en: "Interface development" },
    context: { vi: "Zing Music", en: "Zing Music" },
    description: {
      vi: "Thực hành React Native, Expo và Firebase qua ứng dụng nghe nhạc, tập trung vào playlist, player và navigation.",
      en: "Practiced React Native, Expo, and Firebase through a music app focused on playlists, the player, and navigation.",
    },
    projectSlug: "zing-music",
  },
  {
    period: { vi: "2022", en: "2022" },
    title: { vi: "Frontend developer", en: "Frontend developer" },
    context: { vi: "Motorcycle Store", en: "Motorcycle Store" },
    description: {
      vi: "Làm các trang danh sách xe, chi tiết sản phẩm và giỏ hàng bằng HTML, CSS, Bootstrap trong đồ án frontend.",
      en: "Built listing, product detail, and cart pages with HTML, CSS, and Bootstrap for frontend coursework.",
    },
    projectSlug: "motorcycle-store",
  },
  {
    period: { vi: "2021", en: "2021" },
    title: { vi: "Phát triển hệ thống", en: "System development" },
    context: { vi: "Bus Management", en: "Bus Management" },
    description: {
      vi: "Làm đồ án C#/.NET và SQL Server về quản lý chuyến xe, chọn ghế và nhập thông tin hành khách.",
      en: "Built C#/.NET and SQL Server coursework covering trips, seat selection, and passenger details.",
    },
    projectSlug: "bus-management",
  },
];

export const resumeCapabilities: Array<{
  name: string;
  title: LocalizedText;
  detail: LocalizedText;
  tools: string[];
}> = [
  {
    name: "Frontend and mobile",
    title: { vi: "Frontend và mobile", en: "Frontend and mobile" },
    detail: {
      vi: "Xây giao diện, form, navigation và xử lý state cho web/mobile.",
      en: "Build interfaces, forms, navigation, and state handling for web and mobile.",
    },
    tools: ["React", "Next.js", "React Native"],
  },
  {
    name: "Backend and data",
    title: { vi: "Backend và dữ liệu", en: "Backend and data" },
    detail: {
      vi: "Thiết kế API, tổ chức dữ liệu và xử lý request giữa frontend và backend.",
      en: "Design APIs, organize data, and handle requests between frontend and backend.",
    },
    tools: ["TypeScript", "PostgreSQL", "GraphQL"],
  },
  {
    name: "Development tools",
    title: { vi: "Công cụ phát triển", en: "Development tools" },
    detail: {
      vi: "Dùng Git, Docker và Figma để quản lý code, chạy ứng dụng và trao đổi về giao diện.",
      en: "Use Git, Docker, and Figma to manage code, run apps, and discuss interfaces.",
    },
    tools: ["Docker", "Git", "Figma"],
  },
];
