import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useUserProfile, BodyShapeType } from "./UserProfileContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import mascotImg from "@/assets/c743ecc47591b3bbec72e7d78e8a4836897243cc.png";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const GENDERS = [
  { id: "female", label: "Nữ" },
  { id: "male", label: "Nam" },
  { id: "nonbinary", label: "Phi nhị giới" },
  { id: "private", label: "Không muốn tiết lộ" },
];

const COUNTRIES = [
  { id: "vn", label: "Việt Nam", flag: "https://flagsapi.com/VN/flat/64.png" },
  { id: "us", label: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
  { id: "jp", label: "Japan", flag: "https://flagsapi.com/JP/flat/64.png" },
  { id: "kr", label: "South Korea", flag: "https://flagsapi.com/KR/flat/64.png" },
  { id: "th", label: "Thailand", flag: "https://flagsapi.com/TH/flat/64.png" },
  { id: "sg", label: "Singapore", flag: "https://flagsapi.com/SG/flat/64.png" },
  { id: "other", label: "Khác", flag: "GLOBE_ICON" },
];

const LIFESTYLES = [
  { id: "student-hs", label: "Học sinh cấp 2/cấp 3" },
  { id: "student-uni", label: "Sinh viên đại học" },
  { id: "office-casual", label: "Nhân viên mặc trang phục casual" },
  { id: "office-formal", label: "Nhân viên mặc trang phục trang trọng" },
  { id: "uniform", label: "Nhân viên mặc đồng phục" },
  { id: "homemaker", label: "Nội trợ" },
  { id: "other", label: "Khác" },
];

const HAIR_COLORS = [
  { id: "blonde", label: "Tóc vàng", color: "#C5A55A" },
  { id: "brown", label: "Tóc nâu", color: "#6B4226" },
  { id: "black", label: "Tóc nâu sẫm/Đen", color: "#2C2C2C" },
  { id: "red", label: "Tóc đỏ", color: "#8B3A2F" },
  { id: "gray", label: "Tóc xám/Bạc", color: "#A8A8A0" },
  { id: "other", label: "Khác", color: null },
  { id: "unsure", label: "Tôi không chắc", color: null },
];

const EYE_COLORS = [
  { id: "brown", label: "Nâu", color: "#7B5B4C" },
  { id: "black", label: "Đen", color: "#2C2C2C" },
  { id: "blue", label: "Xanh dương", color: "#7CAFE0" },
  { id: "hazel", label: "Nâu hạt dẻ", color: "#C5A55A" },
  { id: "green", label: "Xanh lá", color: "#7CD9A0" },
  { id: "gray", label: "Xám", color: "#A8A898" },
  { id: "other", label: "Khác", color: null },
  { id: "unsure", label: "Tôi không chắc", color: null },
];

const BODY_SHAPES: { id: BodyShapeType; label: string }[] = [
  { id: "unsure", label: "Tôi không chắc" },
  { id: "hourglass", label: "Đồng hồ cát" },
  { id: "pear", label: "Tam giác" },
  { id: "inverted-triangle", label: "Tam giác ngược" },
  { id: "apple", label: "Dáng tròn" },
  { id: "rectangle", label: "Chữ nhật" },
];

const COLOR_PALETTES = [
  { id: "unsure", label: "Tôi không chắc", img: null },
  { id: "warm-bright", label: "Ấm áp · Tươi sáng", img: "https://images.unsplash.com/photo-1633327071214-dc442e4eb932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwYXV0dW1uJTIwb3V0Zml0JTIwZmxhdGxheSUyMGNvenl8ZW58MXx8fHwxNzcyNjI3Nzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "cool-soft", label: "Mát mẻ · Dịu dàng", img: "https://images.unsplash.com/photo-1599445997715-55c4d8853c48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29sJTIwcGFzdGVsJTIwYmx1ZSUyMG91dGZpdCUyMGZsYXRsYXl8ZW58MXx8fHwxNzcyNjI3Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "warm-deep", label: "Ấm áp · Sâu lắng", img: "https://images.unsplash.com/photo-1769200353674-34a06156c66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMHRvbmUlMjBicm93biUyMG91dGZpdCUyMGZsYXRsYXl8ZW58MXx8fHwxNzcyNjI3Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "dark-moody", label: "Tối · Cá tính", img: "https://images.unsplash.com/photo-1638898790370-fc2068b1f8b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9vZHklMjBmYXNoaW9uJTIwb3V0Zml0JTIwd2ludGVyfGVufDF8fHx8MTc3MjYyNzc4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
];

const FASHION_STYLES = [
  { id: "casual", label: "Thường ngày", img: "https://images.unsplash.com/photo-1760551733107-25bd7b041623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzdHJlZXR3ZWFyJTIwd29tYW4lMjBvdXRmaXR8ZW58MXx8fHwxNzcyNjI3Nzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "minimal", label: "Tối giản", img: "https://images.unsplash.com/photo-1663151860665-49dff5bcf3ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMHdvbWFuJTIwY2xlYW58ZW58MXx8fHwxNzcyNjI3Nzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "streetwear", label: "Streetwear", img: "https://images.unsplash.com/photo-1575633660454-cd44c9538d91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwdXJiYW4lMjBmYXNoaW9uJTIwd29tYW58ZW58MXx8fHwxNzcyNjI3Nzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "athleisure", label: "Thể thao/Athleisure", img: "https://images.unsplash.com/photo-1768929096134-f45af7839e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZWlzdXJlJTIwc3BvcnR5JTIwZmFzaGlvbiUyMHdvbWFufGVufDF8fHx8MTc3MjYyNzc3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "elegant", label: "Thanh lịch", img: "https://images.unsplash.com/photo-1756483510840-b0dda5f0dd0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZm9ybWFsJTIwZmFzaGlvbiUyMHdvbWFuJTIwZHJlc3N8ZW58MXx8fHwxNzcyNjI3Nzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "vintage", label: "Vintage/Retro", img: "https://images.unsplash.com/photo-1731513343223-3b12315c4ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcmV0cm8lMjBmYXNoaW9uJTIwd29tYW4lMjBvdXRmaXR8ZW58MXx8fHwxNzcyNjI3Nzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
];

const TOTAL_STEPS = 10;

/* ═══════════════════════════════════════════
   BODY SHAPE SVGs
   ═══════════════════════════════════════════ */

function BodyShapeSVG({ shape }: { shape: BodyShapeType }) {
  const highlight = "#A8C8E8";
  const outline = "#888";

  const shapePaths: Record<string, React.ReactNode> = {
    unsure: (
      <g>
        <text x="50" y="58" textAnchor="middle" fontSize="28" fill="#aaa">🤔</text>
      </g>
    ),
    hourglass: (
      <g>
        <path d="M30 25 C30 25 35 20 50 20 C65 20 70 25 70 25 L70 35 C70 35 60 40 50 40 C40 40 30 35 30 35Z" fill="none" stroke={outline} strokeWidth="1.5" />
        <path d="M30 55 C30 55 35 60 50 60 C65 60 70 55 70 55 L70 45 C70 45 60 40 50 40 C40 40 30 45 30 45Z" fill="none" stroke={outline} strokeWidth="1.5" />
        <path d="M35 25 L35 35 C35 35 42 39 50 39 C58 39 65 35 65 35 L65 25" fill={highlight} opacity="0.5" />
        <path d="M35 55 L35 45 C35 45 42 41 50 41 C58 41 65 45 65 45 L65 55" fill={highlight} opacity="0.5" />
      </g>
    ),
    pear: (
      <g>
        <path d="M37 20 C37 20 42 18 50 18 C58 18 63 20 63 20 L63 35 C63 35 55 38 50 38 C45 38 37 35 37 35Z" fill="none" stroke={outline} strokeWidth="1.5" />
        <path d="M28 62 C28 62 35 65 50 65 C65 65 72 62 72 62 L72 42 C72 42 60 38 50 38 C40 38 28 42 28 42Z" fill="none" stroke={outline} strokeWidth="1.5" />
        <polygon points="40,24 50,38 60,24" fill={highlight} opacity="0.5" />
      </g>
    ),
    "inverted-triangle": (
      <g>
        <path d="M25 20 C25 20 35 18 50 18 C65 18 75 20 75 20 L75 38 C75 38 60 42 50 42 C40 42 25 38 25 38Z" fill="none" stroke={outline} strokeWidth="1.5" />
        <path d="M35 62 C35 62 40 65 50 65 C60 65 65 62 65 62 L65 42 C65 42 58 40 50 40 C42 40 35 42 35 42Z" fill="none" stroke={outline} strokeWidth="1.5" />
        <polygon points="40,60 50,40 60,60" fill={highlight} opacity="0.5" />
      </g>
    ),
    apple: (
      <g>
        <ellipse cx="50" cy="40" rx="25" ry="22" fill="none" stroke={outline} strokeWidth="1.5" />
        <ellipse cx="50" cy="40" rx="20" ry="18" fill={highlight} opacity="0.4" />
        <path d="M38 58 L38 70" stroke={outline} strokeWidth="1.5" />
        <path d="M62 58 L62 70" stroke={outline} strokeWidth="1.5" />
      </g>
    ),
    rectangle: (
      <g>
        <rect x="32" y="18" width="36" height="48" rx="3" fill="none" stroke={outline} strokeWidth="1.5" />
        <rect x="34" y="30" width="32" height="16" rx="2" fill={highlight} opacity="0.4" />
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {shapePaths[shape] || shapePaths.unsure}
    </svg>
  );
}

/* ═══════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════ */

function ListItem({
  label,
  selected,
  onClick,
  colorSwatch,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  colorSwatch?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center justify-between w-full py-[16px] px-[4px] border-b border-[rgba(74,55,40,0.08)] bg-transparent cursor-pointer border-t-0 border-l-0 border-r-0"
    >
      <div className="flex items-center gap-[14px]">
        {colorSwatch !== undefined && (
          colorSwatch ? (
            <div
              className="w-[36px] h-[36px] rounded-[10px] shrink-0"
              style={{ backgroundColor: colorSwatch }}
            />
          ) : icon ? (
            <div className="w-[36px] h-[36px] rounded-[10px] bg-[#f0e6da] flex items-center justify-center shrink-0">
              {icon}
            </div>
          ) : null
        )}
        <span className="font-['Manrope',sans-serif] font-[500] text-[15px] text-[#4a3728] text-left">
          {label}
        </span>
      </div>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {selected ? (
          <>
            <circle cx="10" cy="10" r="10" fill="#4a3728" />
            <path d="M6 10L8.5 12.5L14 7.5" stroke="#fdfaf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <path d="M5.5 10.5L8.5 13L14.5 7" stroke="rgba(74,55,40,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export function OnboardingPage() {
  const navigate = useNavigate();
  const { updateProfile, completeOnboarding } = useUserProfile();

  const [step, setStep] = useState(0);

  // Local state for all steps
  const [nickname, setNickname] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showReferral, setShowReferral] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [country, setCountry] = useState("vn");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [lifestyle, setLifestyle] = useState<string | null>(null);
  const [hairColor, setHairColor] = useState<string | null>(null);
  const [eyeColor, setEyeColor] = useState<string | null>(null);
  const [bodyShape, setBodyShape] = useState<BodyShapeType | null>(null);
  const [colorPalette, setColorPalette] = useState<string | null>(null);
  const [fashionStyles, setFashionStyles] = useState<string[]>([]);

  const nicknameValid = nickname.length >= 5 && nickname.length <= 15 && /^[a-zA-Z0-9_.]+$/.test(nickname);

  const canNext = (): boolean => {
    switch (step) {
      case 0: return true; // welcome always
      case 1: return nicknameValid;
      case 2: return gender !== null;
      case 3: return country !== null;
      case 4: return lifestyle !== null;
      case 5: return hairColor !== null;
      case 6: return eyeColor !== null;
      case 7: return bodyShape !== null;
      case 8: return colorPalette !== null;
      case 9: return fashionStyles.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      // Save all data
      const selectedCountry = COUNTRIES.find(c => c.id === country);
      updateProfile({
        nickname,
        referralCode,
        gender,
        country: selectedCountry?.label || "Việt Nam",
        lifestyle,
        hairColor,
        eyeColor,
        bodyShape,
        colorPalette,
        fashionStyle: fashionStyles,
      });
      completeOnboarding();
      toast.success("Hồ sơ đã sẵn sàng! Chào mừng bạn đến V-Closet 🎉");
      navigate("/app/community");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate("/app/community");
  };

  const toggleFashionStyle = (id: string) => {
    setFashionStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectedCountryData = COUNTRIES.find((c) => c.id === country);

  /* ── Button labels ── */
  const getButtonLabel = () => {
    if (step === 0) return "Tôi đã sẵn sàng";
    if (step === 1) return "Bắt đầu";
    if (step === TOTAL_STEPS - 1) return "Hoàn tất";
    return "Tiếp theo";
  };

  /* ── Progress ── */
  const progress = step === 0 ? 0 : ((step) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="mobile-frame">
      {/* Header */}
      <div className="shrink-0">
        {/* Top nav */}
        <div className="flex items-center justify-between px-[16px] pt-[12px] pb-[8px]">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="bg-transparent border-none cursor-pointer p-[8px] -ml-[8px]"
            >
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M9 1L1 9L9 17" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <div className="w-[26px]" />
          )}
          {step > 0 && (
            <button
              onClick={handleSkip}
              className="font-['Manrope',sans-serif] font-[500] text-[14px] text-[rgba(74,55,40,0.45)] bg-transparent border-none cursor-pointer p-[8px] -mr-[8px]"
            >
              Bỏ qua
            </button>
          )}
          {step === 0 && <div className="w-[26px]" />}
        </div>

        {/* Progress bar */}
        {step > 0 && (
          <div className="px-[16px] pb-[8px]">
            <div className="h-[3px] bg-[#ede4d9] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#4a3728] rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content — scrollable */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="px-[24px] pb-[24px]"
          >
            {/* ── Step 0: Welcome ── */}
            {step === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[65vh] pt-[40px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[26px] text-[#4a3728] text-center leading-[34px] tracking-[-0.5px] mb-[40px]">
                  Trước khi bắt đầu,{"\n"}hãy để tớ làm quen{"\n"}với bạn nhé!
                </div>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1
                  }}
                  className="w-[280px] h-[280px] mb-[32px]"
                >
                  <ImageWithFallback
                    src={mascotImg}
                    alt="V-Closet Mascot"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>
            )}

            {/* ── Step 1: Nickname ── */}
            {step === 1 && (
              <div className="pt-[16px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] leading-[30px] tracking-[-0.5px] mb-[24px]">
                  Nhập biệt danh của bạn
                </div>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="vcloset_user"
                  maxLength={15}
                  className="w-full bg-white border border-[rgba(74,55,40,0.15)] rounded-[14px] px-[16px] py-[16px] font-['Manrope',sans-serif] font-[500] text-[16px] text-[#4a3728] outline-none placeholder-[rgba(74,55,40,0.25)] focus:border-[#4a3728] transition-colors"
                />
                <div className="font-['Manrope',sans-serif] font-[400] text-[12px] text-[rgba(74,55,40,0.4)] mt-[10px] leading-[18px]">
                  Biệt danh phải dài từ 5-15 ký tự và chỉ có thể bao gồm chữ cái, số, dấu gạch dưới (_) và dấu chấm (.).
                </div>

                {/* Referral code */}
                <button
                  onClick={() => setShowReferral(!showReferral)}
                  className="flex items-center justify-between w-full mt-[32px] py-[14px] border-b border-[rgba(74,55,40,0.1)] bg-transparent cursor-pointer border-t-0 border-l-0 border-r-0 px-0"
                >
                  <span className="font-['Manrope',sans-serif] font-[500] text-[15px] text-[#4a3728]">
                    Mã giới thiệu
                  </span>
                  <motion.svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    animate={{ rotate: showReferral ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="rgba(74,55,40,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {showReferral && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        placeholder="Nhập mã giới thiệu (nếu có)"
                        className="w-full bg-white border border-[rgba(74,55,40,0.15)] rounded-[14px] px-[16px] py-[14px] font-['Manrope',sans-serif] font-[500] text-[14px] text-[#4a3728] outline-none placeholder-[rgba(74,55,40,0.25)] mt-[12px] focus:border-[#4a3728] transition-colors"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── Step 2: Gender ── */}
            {step === 2 && (
              <div className="pt-[16px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] leading-[30px] tracking-[-0.5px] mb-[12px]">
                  Giới tính của bạn là gì?
                </div>
                <div className="flex flex-col">
                  {GENDERS.map((g) => (
                    <ListItem
                      key={g.id}
                      label={g.label}
                      selected={gender === g.id}
                      onClick={() => setGender(g.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 3: Location ── */}
            {step === 3 && (
              <div className="pt-[16px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] leading-[30px] tracking-[-0.5px] mb-[20px]">
                  Bạn sống ở đâu?
                </div>
                <button
                  onClick={() => setShowCountryPicker(!showCountryPicker)}
                  className="flex items-center justify-between w-full bg-white border border-[rgba(74,55,40,0.15)] rounded-[14px] px-[16px] py-[14px] cursor-pointer"
                >
                  <div className="flex items-center gap-[12px]">
                    {selectedCountryData?.flag === "GLOBE_ICON" ? (
                      <div className="w-[28px] h-[20px] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-[28px] h-[20px] rounded-[3px] overflow-hidden shrink-0 border border-[rgba(0,0,0,0.05)]">
                        <img
                          src={selectedCountryData?.flag}
                          className="w-full h-full object-cover shadow-sm"
                          alt={selectedCountryData?.label}
                        />
                      </div>
                    )}
                    <span className="font-['Manrope',sans-serif] font-[500] text-[15px] text-[#4a3728]">
                      {selectedCountryData?.label}
                    </span>
                  </div>
                  <motion.svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    animate={{ rotate: showCountryPicker ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="rgba(74,55,40,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {showCountryPicker && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-[8px] bg-white rounded-[14px] border border-[rgba(74,55,40,0.1)]"
                    >
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => { setCountry(c.id); setShowCountryPicker(false); }}
                          className={`flex items-center gap-[12px] w-full px-[16px] py-[12px] border-none cursor-pointer transition-colors ${country === c.id ? "bg-[rgba(74,55,40,0.06)]" : "bg-transparent"
                            }`}
                        >
                          {c.flag === "GLOBE_ICON" ? (
                            <div className="w-[24px] h-[17px] flex items-center justify-center shrink-0">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                              </svg>
                            </div>
                          ) : (
                            <div className="w-[24px] h-[17px] rounded-[2px] overflow-hidden shrink-0 border border-[rgba(0,0,0,0.05)]">
                              <img src={c.flag} className="w-full h-full object-cover" alt={c.label} />
                            </div>
                          )}
                          <span className="font-['Manrope',sans-serif] font-[500] text-[14px] text-[#4a3728]">
                            {c.label}
                          </span>
                          {country === c.id && (
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="ml-auto">
                              <circle cx="10" cy="10" r="10" fill="#4a3728" />
                              <path d="M6 10L8.5 12.5L14 7.5" stroke="#fdfaf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── Step 4: Lifestyle ── */}
            {step === 4 && (
              <div className="pt-[16px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] leading-[30px] tracking-[-0.5px] mb-[12px]">
                  Vui lòng chọn phong cách sống và loại hình công việc chính của bạn.
                </div>
                <div className="flex flex-col">
                  {LIFESTYLES.map((l) => (
                    <ListItem
                      key={l.id}
                      label={l.label}
                      selected={lifestyle === l.id}
                      onClick={() => setLifestyle(l.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 5: Hair Color ── */}
            {step === 5 && (
              <div className="pt-[16px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] leading-[30px] tracking-[-0.5px] mb-[12px]">
                  Màu tóc của bạn là gì?
                </div>
                <div className="flex flex-col">
                  {HAIR_COLORS.map((h) => (
                    <ListItem
                      key={h.id}
                      label={h.label}
                      selected={hairColor === h.id}
                      onClick={() => setHairColor(h.id)}
                      colorSwatch={h.color}
                      icon={
                        h.id === "other" ? (
                          <span className="font-['Manrope',sans-serif] font-[700] text-[14px] text-[rgba(74,55,40,0.4)]">···</span>
                        ) : h.id === "unsure" ? (
                          <span className="text-[16px]">🤔</span>
                        ) : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 6: Eye Color ── */}
            {step === 6 && (
              <div className="pt-[16px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] leading-[30px] tracking-[-0.5px] mb-[12px]">
                  Màu mắt của bạn là gì?
                </div>
                <div className="flex flex-col">
                  {EYE_COLORS.map((e) => (
                    <ListItem
                      key={e.id}
                      label={e.label}
                      selected={eyeColor === e.id}
                      onClick={() => setEyeColor(e.id)}
                      colorSwatch={e.color}
                      icon={
                        e.id === "other" ? (
                          <span className="font-['Manrope',sans-serif] font-[700] text-[14px] text-[rgba(74,55,40,0.4)]">···</span>
                        ) : e.id === "unsure" ? (
                          <span className="text-[16px]">🤔</span>
                        ) : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 7: Body Shape ── */}
            {step === 7 && (
              <div className="pt-[16px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] leading-[30px] tracking-[-0.5px] mb-[16px]">
                  Dáng người của bạn là gì?
                </div>
                <div className="grid grid-cols-2 gap-[12px]">
                  {BODY_SHAPES.map((s) => {
                    const isSelected = bodyShape === s.id;
                    return (
                      <motion.button
                        key={s.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setBodyShape(s.id)}
                        className={`flex flex-col items-center bg-white rounded-[16px] border-2 cursor-pointer p-[12px] transition-all ${isSelected
                          ? "border-[#4a3728] shadow-[0px_2px_12px_rgba(74,55,40,0.15)]"
                          : "border-[rgba(74,55,40,0.1)]"
                          }`}
                      >
                        <div className="w-full h-[80px] mb-[8px]">
                          <BodyShapeSVG shape={s.id} />
                        </div>
                        <span className={`font-['Manrope',sans-serif] font-[600] text-[13px] ${isSelected ? "text-[#4a3728]" : "text-[rgba(74,55,40,0.6)]"
                          }`}>
                          {s.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Step 8: Color Palette ── */}
            {step === 8 && (
              <div className="pt-[16px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] leading-[30px] tracking-[-0.5px] mb-[16px]">
                  Tông màu nào hợp với bạn nhất?
                </div>
                <div className="grid grid-cols-2 gap-[12px]">
                  {COLOR_PALETTES.map((p) => {
                    const isSelected = colorPalette === p.id;
                    return (
                      <motion.button
                        key={p.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setColorPalette(p.id)}
                        className={`flex flex-col bg-white rounded-[16px] border-2 cursor-pointer overflow-hidden transition-all ${isSelected
                          ? "border-[#4a3728] shadow-[0px_2px_12px_rgba(74,55,40,0.15)]"
                          : "border-[rgba(74,55,40,0.1)]"
                          }`}
                      >
                        <div className="w-full aspect-[4/3] bg-[#f0e6da] overflow-hidden">
                          {p.img ? (
                            <ImageWithFallback
                              src={p.img}
                              alt={p.label}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-[32px]">🤔</span>
                            </div>
                          )}
                        </div>
                        <div className="px-[10px] py-[10px]">
                          <span className={`font-['Manrope',sans-serif] font-[600] text-[13px] ${isSelected ? "text-[#4a3728]" : "text-[rgba(74,55,40,0.6)]"
                            }`}>
                            {p.label}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Step 9: Fashion Style (multi-select) ── */}
            {step === 9 && (
              <div className="pt-[16px]">
                <div className="font-['Manrope',sans-serif] font-[800] text-[24px] text-[#4a3728] leading-[30px] tracking-[-0.5px] mb-[16px]">
                  Chọn phong cách bạn yêu thích
                </div>
                <div className="grid grid-cols-2 gap-[12px]">
                  {FASHION_STYLES.map((s) => {
                    const isSelected = fashionStyles.includes(s.id);
                    return (
                      <motion.button
                        key={s.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleFashionStyle(s.id)}
                        className={`flex flex-col bg-white rounded-[16px] border-2 cursor-pointer overflow-hidden transition-all relative ${isSelected
                          ? "border-[#4a3728] shadow-[0px_2px_12px_rgba(74,55,40,0.15)]"
                          : "border-[rgba(74,55,40,0.1)]"
                          }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-[8px] right-[8px] z-10 w-[22px] h-[22px] rounded-full bg-[#4a3728] flex items-center justify-center"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fdfaf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </motion.div>
                        )}
                        <div className="w-full aspect-[4/3] bg-[#f0e6da] overflow-hidden">
                          <ImageWithFallback
                            src={s.img}
                            alt={s.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="px-[10px] py-[10px]">
                          <span className={`font-['Manrope',sans-serif] font-[600] text-[13px] ${isSelected ? "text-[#4a3728]" : "text-[rgba(74,55,40,0.6)]"
                            }`}>
                            {s.label}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-[24px] pb-[32px] pt-[12px] shrink-0">
        <motion.button
          whileTap={canNext() ? { scale: 0.97 } : undefined}
          onClick={canNext() ? handleNext : undefined}
          className={`w-full h-[52px] rounded-[14px] flex items-center justify-center border-none cursor-pointer transition-all duration-300 ${canNext()
            ? "bg-[#4a3728] shadow-[0px_6px_16px_rgba(74,55,40,0.2)]"
            : "bg-[#c4b5a5] cursor-not-allowed"
            }`}
        >
          <span className="font-['Manrope',sans-serif] font-[700] text-[16px] text-[#fdfaf6] tracking-[0.2px]">
            {getButtonLabel()}
          </span>
        </motion.button>
      </div>
    </div>
  );
}