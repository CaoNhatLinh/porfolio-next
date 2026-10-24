import { siFacebook, siGoogle, siInstagram, siTiktok } from "simple-icons";
import type { Locale } from "../../features/content/types";

const platforms = [
  { name: "Facebook", icon: siFacebook },
  { name: "Instagram", icon: siInstagram },
  { name: "TikTok", icon: siTiktok },
  { name: "Google Business Profile", icon: siGoogle },
];

export function ProjectPlatforms({ locale }: { locale: Locale }) {
  const copy = locale === "vi";

  return (
    <section className="page-width pb-24 md:pb-36">
      <div className="grid gap-10 border-t border-white/15 pt-6 md:grid-cols-[.55fr_1.45fr]">
        <div>
          <p className="editorial-kicker text-[var(--accent)]">
            {copy ? "Tích hợp nền tảng" : "Platform integrations"}
          </p>
          <h2 className="display mt-5 max-w-sm text-5xl font-bold leading-[.84] md:text-7xl">
            {copy ? "Các kênh đăng nội dung." : "Publishing channels."}
          </h2>
        </div>
        <div>
          <p className="max-w-2xl text-lg leading-relaxed text-white/65 md:text-2xl">
            {copy
              ? "Các kênh trong luồng tích hợp gồm Facebook, Instagram, TikTok và Google Business Profile. Việc đăng thật còn phụ thuộc vào quyền API và tài khoản được kết nối của từng nền tảng."
              : "The integration workflow includes Facebook, Instagram, TikTok, and Google Business Profile. Live publishing depends on each platform's API permissions and connected accounts."}
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-white/15 bg-white/15 sm:grid-cols-4">
            {platforms.map((platform) => (
              <li key={platform.name} className="bg-[#111312] p-5 md:p-7">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  aria-hidden="true"
                  style={{ color: `#${platform.icon.hex}` }}
                >
                  <path d={platform.icon.path} fill="currentColor" />
                </svg>
                <p className="mt-8 text-sm font-medium text-white">
                  {platform.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
