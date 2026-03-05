import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import svgPaths from "../../imports/svg-38y878fasw";
import { useLanguage } from "./LanguageContext";

const navItems = [
  { path: "/app/community", icon: "community" },
  { path: "/app/wardrobe", icon: "wardrobe" },
  { path: "/app/camera", icon: "camera" },
  { path: "/app/outfit", icon: "outfit" },
  { path: "/app/profile", icon: "profile" },
];

function CommunityIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="17" viewBox="0 0 19.1 15.6741" fill="none">
      <path
        d={svgPaths.p27c25f80}
        stroke={active ? "#4A3728" : "#8B7355"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function WardrobeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <path d={svgPaths.p23c4d380} fill={active ? "#4A3728" : "#8B7355"} />
    </svg>
  );
}

function CameraIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
      <path d={svgPaths.p6da5600} fill={active ? "#4A3728" : "#8B7355"} />
    </svg>
  );
}

function OutfitIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d={svgPaths.p11c2d500} fill={active ? "#4A3728" : "#8B7355"} />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d={svgPaths.p85bff00} fill={active ? "#4A3728" : "#8B7355"} />
    </svg>
  );
}

const iconMap: Record<string, React.FC<{ active: boolean }>> = {
  community: CommunityIcon,
  wardrobe: WardrobeIcon,
  camera: CameraIcon,
  outfit: OutfitIcon,
  profile: ProfileIcon,
};



export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <nav className="bg-[#fdfaf6] flex items-start justify-center pb-[20px] pt-[10px] px-[8px] w-full shrink-0 relative border-t border-[rgba(74,55,40,0.08)]">
      {navItems.map((item) => {
        const active =
          location.pathname === item.path ||
          (item.path === "/app/community" && location.pathname === "/app");
        const IconComponent = iconMap[item.icon];

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex-1 flex flex-col gap-[3px] items-center justify-center cursor-pointer bg-transparent border-none p-0 pt-[6px] relative active:opacity-60 transition-opacity duration-100"
          >
            {/* Active indicator dot */}
            {active && (
              <motion.div
                layoutId="bottom-nav-dot"
                className="absolute top-0 w-[4px] h-[4px] bg-[#4a3728] rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}

            <div
              className="flex h-[28px] items-center justify-center transition-transform duration-150"
              style={{ transform: active ? "scale(1.08)" : "scale(1)" }}
            >
              <IconComponent active={active} />
            </div>

            <span
              className={`font-['Manrope',sans-serif] text-[10px] tracking-[0.2px] transition-colors duration-150 ${active
                  ? "text-[#4a3728]"
                  : "text-[#8b7355]"
                }`}
              style={{ fontWeight: active ? 700 : 400 }}
            >
              {t(item.icon)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
