import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useMenu } from "./MenuContext";
import { useUserProfile, BodyMeasurements } from "./UserProfileContext";
import { SlideUp, ScaleIn, StaggerContainer, StaggerItem } from "./PageTransition";
import svgPaths from "../../imports/svg-38y878fasw";

const BODY_SHAPE_LABELS: Record<string, string> = {
  hourglass: "Đồng hồ cát",
  pear: "Quả lê",
  rectangle: "Cân đối",
  apple: "Quả táo",
  "inverted-triangle": "Tam giác ngược",
  unsure: "Chưa xác định",
};

/* ── Interactive Body Figure ── */
function BodyMeasurementPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { profile, setMeasurement } = useUserProfile();
  const m = profile.measurements;

  const [activePoint, setActivePoint] = useState<keyof BodyMeasurements | null>(null);

  const measurementPoints: {
    key: keyof BodyMeasurements;
    label: string;
    unit: string;
    cx: number;
    cy: number;
    placeholder: string;
    min: number;
    max: number;
  }[] = [
    { key: "height", label: "Chiều cao", unit: "cm", cx: 80, cy: 8, placeholder: "165", min: 140, max: 200 },
    { key: "chest", label: "Vòng ngực", unit: "cm", cx: 80, cy: 75, placeholder: "88", min: 60, max: 130 },
    { key: "waist", label: "Vòng eo", unit: "cm", cx: 80, cy: 105, placeholder: "68", min: 50, max: 120 },
    { key: "hips", label: "Vòng hông", unit: "cm", cx: 80, cy: 130, placeholder: "92", min: 60, max: 140 },
    { key: "weight", label: "Cân nặng", unit: "kg", cx: 80, cy: 195, placeholder: "55", min: 30, max: 150 },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.35)]"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fdfaf6] w-full max-w-[430px] rounded-t-[28px] px-[20px] pt-[20px] pb-[36px] max-h-[85vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center mb-[16px]">
              <div className="w-[40px] h-[4px] rounded-full bg-[rgba(74,55,40,0.15)]" />
            </div>

            <div className="font-['Manrope',sans-serif] font-[800] text-[20px] text-[#4a3728] tracking-[-0.5px] mb-[4px]">
              Số đo cá nhân 📐
            </div>
            <div className="font-['Manrope',sans-serif] font-[400] text-[13px] text-[rgba(74,55,40,0.5)] mb-[20px]">
              Chạm vào vị trí trên hình người để nhập số đo
            </div>

            <div className="flex gap-[20px]">
              {/* 2D Body Figure */}
              <div className="relative w-[160px] shrink-0">
                <svg viewBox="0 0 160 220" className="w-full">
                  {/* Body outline */}
                  {/* Head */}
                  <ellipse cx="80" cy="28" rx="16" ry="18" fill="#e3d5ca" stroke="#c9b9a8" strokeWidth="1.5"/>
                  {/* Neck */}
                  <rect x="74" y="44" width="12" height="10" rx="4" fill="#e3d5ca" stroke="#c9b9a8" strokeWidth="1"/>
                  {/* Torso */}
                  <path d="M52 54 C48 56 44 64 44 76 L44 100 C44 108 48 116 56 120 L60 122 C64 130 64 140 60 148 L54 180 C52 188 56 196 64 196 L72 196 C76 196 78 192 78 188 L82 148 L86 188 C86 192 88 196 92 196 L100 196 C108 196 112 188 110 180 L104 148 C100 140 100 130 104 122 L108 120 C116 116 120 108 120 100 L120 76 C120 64 116 56 112 54 C106 50 94 48 80 48 C66 48 58 50 52 54Z" fill="#e3d5ca" stroke="#c9b9a8" strokeWidth="1.5"/>

                  {/* Measurement point indicators */}
                  {measurementPoints.map((pt) => (
                    <g key={pt.key} onClick={() => setActivePoint(pt.key)} className="cursor-pointer">
                      {/* Dashed line */}
                      <line
                        x1={pt.key === "height" ? 30 : 20}
                        y1={pt.cy}
                        x2={pt.key === "height" ? 130 : 140}
                        y2={pt.cy}
                        stroke={activePoint === pt.key ? "#4a3728" : "rgba(74,55,40,0.2)"}
                        strokeWidth="1"
                        strokeDasharray="4 3"
                      />
                      {/* Circle */}
                      <circle
                        cx={pt.key === "height" ? 15 : 148}
                        cy={pt.cy}
                        r="8"
                        fill={activePoint === pt.key ? "#4a3728" : (m[pt.key] ? "#6b5344" : "white")}
                        stroke={activePoint === pt.key ? "#4a3728" : "#c9b9a8"}
                        strokeWidth="1.5"
                      />
                      {m[pt.key] && (
                        <text
                          x={pt.key === "height" ? 15 : 148}
                          y={pt.cy + 3.5}
                          textAnchor="middle"
                          fill={activePoint === pt.key ? "white" : "white"}
                          fontSize="7"
                          fontWeight="700"
                          fontFamily="Manrope, sans-serif"
                        >
                          ✓
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
              </div>

              {/* Input panel */}
              <div className="flex-1 flex flex-col gap-[8px]">
                {measurementPoints.map((pt) => (
                  <motion.div
                    key={pt.key}
                    animate={{
                      backgroundColor: activePoint === pt.key ? "rgba(74,55,40,0.06)" : "rgba(255,255,255,1)",
                      borderColor: activePoint === pt.key ? "#4a3728" : "rgba(237,228,217,1)",
                    }}
                    className="rounded-[14px] border-2 px-[12px] py-[10px] cursor-pointer"
                    onClick={() => setActivePoint(pt.key)}
                  >
                    <div className="font-['Manrope',sans-serif] font-[700] text-[11px] text-[rgba(74,55,40,0.5)] tracking-[0.5px] uppercase mb-[4px]">
                      {pt.label}
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <input
                        type="number"
                        placeholder={pt.placeholder}
                        value={m[pt.key] ?? ""}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (v >= pt.min && v <= pt.max) {
                            setMeasurement(pt.key, v);
                          } else if (e.target.value === "") {
                            setMeasurement(pt.key, 0);
                          }
                        }}
                        onFocus={() => setActivePoint(pt.key)}
                        className="w-full bg-transparent border-none outline-none font-['Manrope',sans-serif] font-[800] text-[18px] text-[#4a3728] placeholder-[rgba(74,55,40,0.25)] p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-['Manrope',sans-serif] font-[600] text-[12px] text-[rgba(74,55,40,0.4)] shrink-0">
                        {pt.unit}
                      </span>
                    </div>
                  </motion.div>
                ))}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    toast.success("Đã lưu số đo cá nhân! ✨");
                    onClose();
                  }}
                  className="mt-[6px] w-full h-[44px] rounded-[12px] bg-[#4a3728] border-none cursor-pointer shadow-[0px_4px_12px_rgba(74,55,40,0.2)]"
                >
                  <span className="font-['Manrope',sans-serif] font-bold text-[14px] text-[#fdfaf6]">
                    Lưu số đo
                  </span>
                </motion.button>
              </div>
            </div>

            <div className="mt-[16px] bg-[#f0e6da] rounded-[12px] px-[14px] py-[10px] flex items-start gap-[8px]">
              <span className="text-[14px] shrink-0">💡</span>
              <span className="font-['Manrope',sans-serif] font-[400] text-[11px] text-[rgba(74,55,40,0.55)] leading-[16px]">
                Dùng thước dây đo vòng ngực, eo, hông ở vị trí rộng nhất. Số đo chính xác giúp AI gợi ý size chuẩn nhất cho bạn.
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { openMenu } = useMenu();
  const { profile } = useUserProfile();
  const [showMeasurements, setShowMeasurements] = useState(false);

  const menuActions: Record<string, () => void> = {
    "Chỉnh sửa hồ sơ": () => toast("✏️ Mở trang chỉnh sửa hồ sơ..."),
    "Số đo cá nhân": () => setShowMeasurements(true),
    "Lịch sử mua hàng": () => toast("📜 Mở lịch sử mua hàng..."),
    "Cài đặt": () => toast("⚙️ Mở cài đặt..."),
    "Trợ giúp": () => toast("❓ Mở trung tâm trợ giúp..."),
  };

  const bodyShapeLabel = profile.bodyShape
    ? BODY_SHAPE_LABELS[profile.bodyShape] || profile.bodyShape
    : null;

  return (
    <div className="bg-[#fdfaf6] w-full min-h-full flex flex-col">
      {/* Header */}
      <div className="backdrop-blur-[6px] bg-[rgba(253,250,246,0.9)] flex items-center justify-between p-[16px] relative">
        <button onClick={openMenu} className="bg-transparent border-none cursor-pointer p-0 active:opacity-60 transition-opacity">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <path d="M0 0H18V2H0V0ZM0 5H18V7H0V5ZM0 10H18V12H0V10Z" fill="#4a3728" />
          </svg>
        </button>
        <div className="font-['Manrope',sans-serif] font-[800] text-[18px] text-[#4a3728] tracking-[-0.45px] uppercase">
          Cá nhân
        </div>
        <div className="w-[18px]" />
      </div>

      {/* Profile Info */}
      <ScaleIn delay={0.1} className="flex flex-col items-center pt-[32px] pb-[24px]">
        <div className="w-[80px] h-[80px] rounded-full bg-[#e3d5ca] flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
            <path d={svgPaths.p85bff00} fill="#4a3728" />
          </svg>
        </div>
        <div className="mt-[16px] font-['Manrope',sans-serif] font-bold text-[20px] text-[#4a3728]">
          {profile.nickname || "Người dùng V-Closet"}
        </div>
        <div className="mt-[4px] font-['Manrope',sans-serif] font-normal text-[14px] text-[rgba(74,55,40,0.6)]">
          @{profile.nickname || "vcloset_user"}
        </div>
        {/* Badges */}
        {(bodyShapeLabel || profile.lifestyle) && (
          <div className="mt-[10px] flex items-center gap-[6px] flex-wrap justify-center">
            {bodyShapeLabel && (
              <div className="bg-[#4a3728] px-[14px] py-[5px] rounded-full">
                <span className="font-['Manrope',sans-serif] font-[600] text-[12px] text-[#fdfaf6]">
                  👗 {bodyShapeLabel}
                </span>
              </div>
            )}
            {profile.colorPalette && profile.colorPalette !== "unsure" && (
              <div className="bg-white border border-[rgba(74,55,40,0.12)] px-[10px] py-[5px] rounded-full">
                <span className="font-['Manrope',sans-serif] font-[600] text-[12px] text-[rgba(74,55,40,0.6)]">
                  🎨 {profile.colorPalette === "warm-bright" ? "Ấm áp" : profile.colorPalette === "cool-soft" ? "Mát mẻ" : profile.colorPalette === "warm-deep" ? "Sâu lắng" : "Cá tính"}
                </span>
              </div>
            )}
          </div>
        )}
      </ScaleIn>

      {/* Stats */}
      <SlideUp delay={0.2} className="flex justify-around px-[32px] py-[20px] mx-[16px] bg-white rounded-[16px] border border-[rgba(74,55,40,0.1)]">
        <div className="flex flex-col items-center">
          <div className="font-['Manrope',sans-serif] font-bold text-[20px] text-[#4a3728]">
            24
          </div>
          <div className="font-['Manrope',sans-serif] font-normal text-[12px] text-[rgba(74,55,40,0.6)]">
            Trang phục
          </div>
        </div>
        <div className="w-px bg-[rgba(74,55,40,0.1)]" />
        <div className="flex flex-col items-center">
          <div className="font-['Manrope',sans-serif] font-bold text-[20px] text-[#4a3728]">
            8
          </div>
          <div className="font-['Manrope',sans-serif] font-normal text-[12px] text-[rgba(74,55,40,0.6)]">
            Phối đồ
          </div>
        </div>
        <div className="w-px bg-[rgba(74,55,40,0.1)]" />
        <div className="flex flex-col items-center">
          <div className="font-['Manrope',sans-serif] font-bold text-[20px] text-[#4a3728]">
            156
          </div>
          <div className="font-['Manrope',sans-serif] font-normal text-[12px] text-[rgba(74,55,40,0.6)]">
            Votes
          </div>
        </div>
      </SlideUp>

      {/* Menu Items */}
      <StaggerContainer delay={0.3} className="flex flex-col gap-[2px] mt-[24px] mx-[16px]">
        {[
          { label: "Chỉnh sửa hồ sơ", icon: "edit", subtitle: null },
          {
            label: "Số đo cá nhân",
            icon: "ruler",
            subtitle: profile.measurements.height
              ? `${profile.measurements.height}cm • ${profile.measurements.weight || "—"}kg`
              : "Chưa cập nhật",
          },
          { label: "Lịch sử mua hàng", icon: "history", subtitle: null },
          { label: "Cài đặt", icon: "settings", subtitle: null },
          { label: "Trợ giúp", icon: "help", subtitle: null },
        ].map((item, idx) => (
          <StaggerItem key={item.label}>
            <motion.button
              whileTap={{ scale: 0.98, backgroundColor: "rgba(74,55,40,0.04)" }}
              onClick={menuActions[item.label]}
              className={`bg-white flex items-center justify-between px-[20px] py-[16px] border-none cursor-pointer w-full ${
                idx === 0 ? "rounded-t-[16px]" : ""
              } ${idx === 4 ? "rounded-b-[16px]" : ""}`}
            >
              <div className="flex flex-col items-start">
                <span className="font-['Manrope',sans-serif] font-medium text-[16px] text-[#4a3728]">
                  {item.label}
                </span>
                {item.subtitle && (
                  <span className="font-['Manrope',sans-serif] font-[400] text-[12px] text-[rgba(74,55,40,0.45)] mt-[2px]">
                    {item.subtitle}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-[8px]">
                {item.label === "Số đo cá nhân" && !profile.measurements.height && (
                  <span className="bg-[#e74c3c] text-white font-['Manrope',sans-serif] font-[700] text-[9px] px-[7px] py-[2px] rounded-full tracking-[0.3px]">
                    MỚI
                  </span>
                )}
                <svg width="8" height="14" viewBox="0 0 4.90625 8.33333" fill="none">
                  <path
                    d="M0.739583 8.33333L0 7.59375L3.42708 4.16667L0 0.739583L0.739583 0L4.90625 4.16667L0.739583 8.33333V8.33333"
                    fill="rgba(74,55,40,0.4)"
                  />
                </svg>
              </div>
            </motion.button>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Logout */}
      <SlideUp delay={0.6} className="mx-[16px] mt-[24px] mb-[24px]">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { toast("👋 Đã đăng xuất"); navigate("/"); }}
          className="w-full bg-transparent border border-[#4a3728] rounded-[12px] py-[14px] cursor-pointer"
        >
          <span className="font-['Manrope',sans-serif] font-bold text-[16px] text-[#4a3728]">
            Đăng xuất
          </span>
        </motion.button>
      </SlideUp>

      {/* Body Measurement Panel */}
      <BodyMeasurementPanel
        open={showMeasurements}
        onClose={() => setShowMeasurements(false)}
      />
    </div>
  );
}