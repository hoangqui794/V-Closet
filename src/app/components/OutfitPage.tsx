import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useMenu } from "./MenuContext";
import { useUserProfile } from "./UserProfileContext";
import { SlideUp, ScaleIn, StaggerContainer, StaggerItem } from "./PageTransition";
import svgPaths from "../../imports/svg-qmpue4vmel";
import img3DStylishMannequinModel from "@/assets/mannequin-3d.png";
import imgOrganicCottonTShirt from "@/assets/outfit-chic.png";
import imgDenimShorts from "@/assets/276e8e204190fc4880b226a31087cc029ffd76f3.png";
import imgOrganicTee from "@/assets/b80ef58802fb5301ad07563a92bfc142b3d8419e.png";
import imgBeigeJacket from "@/assets/a9426fd437c4c217d8b03a3ca79bd9563d34c3f1.png";

const bodyShapes = ["Cân đối", "Quả lê", "Đồng hồ cát", "Đầy đặn"];
const sizes = ["S", "M", "L"];

const dragItems = [
  { name: "Quần Short Denim", img: imgDenimShorts },
  { name: "Áo Thun Organic", img: imgOrganicTee },
  { name: "Áo Khoác Nhẹ", img: imgBeigeJacket },
];

/* ── AI Scan Prompt Modal ── */
function AIScanPrompt({
  onScan,
  onDismiss,
}: {
  onScan: () => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-end justify-center bg-[rgba(0,0,0,0.35)]"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#fdfaf6] w-full rounded-t-[28px] px-[24px] pt-[28px] pb-[36px] shadow-[0px_-4px_20px_rgba(0,0,0,0.1)]"
      >
        {/* Handle */}
        <div className="flex justify-center mb-[20px]">
          <div className="w-[40px] h-[4px] rounded-full bg-[rgba(74,55,40,0.15)]" />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-[16px]">
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#4a3728] to-[#6b5344] flex items-center justify-center shadow-[0px_8px_24px_rgba(74,55,40,0.3)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M3 7V5C3 3.9 3.9 3 5 3H7" stroke="#fdfaf6" strokeWidth="2" strokeLinecap="round" />
              <path d="M17 3H19C20.1 3 21 3.9 21 5V7" stroke="#fdfaf6" strokeWidth="2" strokeLinecap="round" />
              <path d="M21 17V19C21 20.1 20.1 21 19 21H17" stroke="#fdfaf6" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 21H5C3.9 21 3 20.1 3 19V17" stroke="#fdfaf6" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="10" r="3" stroke="#fdfaf6" strokeWidth="1.5" />
              <path d="M8 18C8 15.8 9.8 14 12 14C14.2 14 16 15.8 16 18" stroke="#fdfaf6" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-[8px]">
          <div className="font-['Manrope',sans-serif] font-[800] text-[20px] text-[#4a3728] tracking-[-0.5px] leading-[26px]">
            AI Body Scan 🤖
          </div>
        </div>
        <div className="text-center mb-[24px]">
          <div className="font-['Manrope',sans-serif] font-[400] text-[14px] text-[rgba(74,55,40,0.6)] leading-[20px] max-w-[280px] mx-auto">
            Để AI scan cơ thể bạn để xem outfit chuẩn nhất nhé! Chỉ cần 1 tấm ảnh toàn thân là đủ ✨
          </div>
        </div>

        {/* Privacy note */}
        <div className="bg-[#f0e6da] rounded-[14px] px-[16px] py-[12px] mb-[20px] flex items-start gap-[10px]">
          <span className="text-[16px] shrink-0 mt-[1px]">🔒</span>
          <span className="font-['Manrope',sans-serif] font-[400] text-[12px] text-[rgba(74,55,40,0.6)] leading-[17px]">
            Chúng tôi chỉ lưu trữ các chỉ số tỷ lệ, không lưu trữ hình ảnh nhạy cảm của bạn. Ảnh sẽ được xóa ngay sau khi phân tích.
          </span>
        </div>

        {/* Buttons */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onScan}
          className="w-full h-[52px] rounded-[14px] bg-[#4a3728] border-none cursor-pointer flex items-center justify-center gap-[8px] shadow-[0px_8px_16px_rgba(74,55,40,0.2)] mb-[10px]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M23 19C23 19.5 22.8 20 22.4 20.4C22 20.8 21.5 21 21 21H3C2.5 21 2 20.8 1.6 20.4C1.2 20 1 19.5 1 19V8C1 7.5 1.2 7 1.6 6.6C2 6.2 2.5 6 3 6H7L9 3H15L17 6H21C21.5 6 22 6.2 22.4 6.6C22.8 7 23 7.5 23 8V19Z" stroke="#fdfaf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="4" stroke="#fdfaf6" strokeWidth="1.5" />
          </svg>
          <span className="font-['Manrope',sans-serif] font-bold text-[15px] text-[#fdfaf6] tracking-[0.3px]">
            Chụp ảnh ngay
          </span>
        </motion.button>

        <button
          onClick={onDismiss}
          className="w-full h-[44px] rounded-[14px] bg-transparent border-none cursor-pointer"
        >
          <span className="font-['Manrope',sans-serif] font-[600] text-[14px] text-[rgba(74,55,40,0.5)]">
            Để sau nhé
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}

export function OutfitPage() {
  const [activeShape, setActiveShape] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const [activeColor, setActiveColor] = useState(1);
  const [saved, setSaved] = useState(false);
  const {
    profile,
    showAIScanPrompt,
    completeAIScan,
    dismissAIScan,
  } = useUserProfile();

  const [showScan, setShowScan] = useState(false);

  useEffect(() => {
    if (!profile.hasCompletedAIScan) {
      const timer = setTimeout(() => {
        setShowScan(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [profile.hasCompletedAIScan]);

  const handleScan = () => {
    toast("📸 Đang mở camera để scan cơ thể...");
    completeAIScan();
    setShowScan(false);
    setTimeout(() => {
      toast.success("AI đã phân tích xong! Dáng người: Cân đối 🎉");
    }, 2000);
  };

  const handleDismissScan = () => {
    dismissAIScan();
    setShowScan(false);
  };

  const navigate = useNavigate();

  return (
    <div className="bg-[#fdfaf7] w-full min-h-screen flex flex-col relative overflow-x-hidden">
      <StaggerContainer>
        {/* AI Scan Prompt */}
        <AnimatePresence>
          {showScan && (
            <AIScanPrompt onScan={handleScan} onDismiss={handleDismissScan} />
          )}
        </AnimatePresence>

        {/* Header */}
        <StaggerItem className="backdrop-blur-[12px] bg-[rgba(253,250,247,0.85)] flex items-center justify-between px-[16px] py-[16px] sticky top-0 z-30 border-b border-[rgba(214,204,194,0.3)]">
          <button onClick={() => navigate(-1)} className="rounded-full size-[40px] flex items-center justify-center cursor-pointer bg-transparent border-none active:bg-[rgba(74,55,40,0.06)] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#3B2D22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          Phòng Thử Đồ
          <button onClick={() => { setSaved(!saved); toast(saved ? "Đã bỏ lưu" : "💾 Đã lưu phối đồ!"); }} className="rounded-full size-[40px] flex items-center justify-end cursor-pointer bg-transparent border-none active:bg-[rgba(74,55,40,0.06)] transition-colors">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path d={svgPaths.p2b729200} fill="#3B2D22" />
            </svg>
          </button>
        </StaggerItem>

        <div className="flex-1 flex flex-col pb-[60px]">
          {/* Mannequin Viewport - Studio Layout */}
          <StaggerItem className="mx-0 aspect-[5/6] bg-white relative overflow-hidden flex items-center justify-center border-b border-[rgba(214,204,194,0.2)]">
            <motion.img
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={img3DStylishMannequinModel}
              alt="3D Mannequin"
              className="w-full h-full object-cover"
            />

            {/* AI Scan Status Badge */}
            {!profile.hasCompletedAIScan && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-[16px] left-[16px] backdrop-blur-[12px] bg-[rgba(74,55,40,0.7)] rounded-full pl-[10px] pr-[14px] py-[6px] flex items-center gap-[6px] border border-[rgba(255,255,255,0.1)] shadow-lg cursor-pointer"
                onClick={() => setShowScan(true)}
              >
                <div className="size-[16px] bg-white rounded-full animate-pulse opacity-40" />
                <span className="font-['Manrope',sans-serif] font-extrabold text-[9px] text-white uppercase tracking-[1px]">
                  AI Scan Pending
                </span>
              </motion.div>
            )}

            {/* View Tools */}
            <div className="absolute bottom-[16px] right-[16px] flex flex-col gap-[8px]">
              <button className="backdrop-blur-[8px] bg-[rgba(255,255,255,0.7)] rounded-full p-[8px] border-none shadow-sm cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="#3B2D22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="backdrop-blur-[8px] bg-[rgba(255,255,255,0.7)] rounded-full p-[8px] border-none shadow-sm cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10" stroke="#3B2D22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </StaggerItem>

          {/* Customization Options */}
          <StaggerItem className="px-[16px] pt-[24px]">
            <div className="flex gap-[8px] items-center mb-[20px]">
              <div className="bg-[#3b2d22] h-[4px] rounded-full w-[32px]" />
              <div className="font-['Manrope',sans-serif] font-[800] text-[14px] text-[#3b2d22] tracking-[1.4px] uppercase">
                Tùy Chỉnh Nhân Vật
              </div>
            </div>

            {/* Dáng người */}
            <div className="mb-[24px]">
              <div className="font-['Manrope',sans-serif] font-bold text-[11px] text-[rgba(59,45,34,0.5)] uppercase mb-[12px] px-[4px]">
                Dáng người
              </div>
              <div className="flex gap-[10px] overflow-x-auto pb-[4px]">
                {bodyShapes.map((shape, i) => (
                  <button
                    key={shape}
                    onClick={() => setActiveShape(i)}
                    className={`px-[18px] py-[11px] rounded-full border-none cursor-pointer whitespace-nowrap transition-all ${i === activeShape
                      ? "bg-[#3b2d22] text-[#f5ebe0] shadow-md"
                      : "bg-[#e3d5ca] text-[#3b2d22] opacity-70"
                      }`}
                  >
                    <span className="font-['Manrope',sans-serif] font-bold text-[14px]">{shape}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size & Color Picker */}
            <div className="grid grid-cols-2 gap-[20px] mb-[32px]">
              <div>
                <div className="font-['Manrope',sans-serif] font-bold text-[11px] text-[rgba(59,45,34,0.5)] uppercase mb-[12px] px-[4px]">
                  Kich co
                </div>
                <div className="flex gap-[8px]">
                  {sizes.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => setActiveSize(i)}
                      className={`flex-1 h-[48px] rounded-[16px] flex items-center justify-center border-none cursor-pointer transition-all ${i === activeSize
                        ? "bg-[#3b2d22] text-white shadow-md scale-[1.02]"
                        : "bg-white border border-[rgba(0,0,0,0.1)] text-[#3b2d22]"
                        }`}
                    >
                      <span className="font-['Manrope',sans-serif] font-extrabold text-[15px]">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-['Manrope',sans-serif] font-bold text-[11px] text-[rgba(59,45,34,0.5)] uppercase mb-[12px] px-[4px]">
                  Mau sac
                </div>
                <div className="flex gap-[14px] items-center h-[48px]">
                  {[0, 1, 2].map((ci) => (
                    <button
                      key={ci}
                      onClick={() => setActiveColor(ci)}
                      className={`rounded-full size-[26px] border-none cursor-pointer transition-transform ${ci === 0 ? "bg-white border border-gray-200" : ci === 1 ? "bg-[#3b2d22]" : "bg-[#d7b286]"} 
                      ${activeColor === ci ? "ring-2 ring-offset-2 ring-[#4a3728] scale-110" : "opacity-40 scale-100"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Buy Button - Fixed Style */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => toast("🛒 Đang liên kết Shopee...")}
              className="w-full h-[58px] bg-[#3b2d22] rounded-[20px] border-none flex items-center justify-center gap-[12px] mb-[36px] shadow-[0px_10px_20px_rgba(59,45,34,0.2)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="#f5ebe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 6H21" stroke="#f5ebe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14" stroke="#f5ebe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-['Manrope',sans-serif] font-extrabold text-[15px] text-[#f5ebe0] uppercase tracking-[1.5px]">Mua trên Shopee</span>
            </motion.button>
          </StaggerItem>

          {/* Wardrobe Selector */}
          <StaggerItem className="px-[16px]">
            <div className="flex items-center justify-between mb-[16px] px-[4px]">
              <div className="font-['Manrope',sans-serif] font-bold text-[11px] text-[rgba(59,45,34,0.5)] uppercase tracking-[1px]">
                KÉO VÀ THẢ ĐỂ THỬ ĐỒ
              </div>
              <button
                onClick={() => navigate("/app/wardrobe")}
                className="bg-transparent border-none cursor-pointer text-[10px] text-[rgba(59,45,34,0.4)] font-extrabold uppercase active:opacity-60 transition-opacity"
              >
                Xem tất cả
              </button>
            </div>
            <div className="flex gap-[14px] overflow-x-auto pb-[20px]">
              <button onClick={() => toast("📷 Chụp để thêm đồ...")} className="flex flex-col items-center shrink-0 w-[110px] bg-transparent border-none cursor-pointer">
                <div className="aspect-square bg-[rgba(245,235,224,0.4)] border-2 border-dashed border-[rgba(213,189,175,0.5)] rounded-[24px] w-full flex items-center justify-center">
                  <span className="text-[28px] text-[rgba(213,189,175,0.7)] font-light">+</span>
                </div>
                <span className="font-['Manrope',sans-serif] font-bold text-[10px] text-[rgba(59,45,34,0.4)] uppercase mt-[8px]">Thêm đồ</span>
              </button>
              {dragItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toast(`👕 Thử: ${item.name}`)}
                  className="flex flex-col items-center shrink-0 w-[110px] bg-transparent border-none cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="bg-white rounded-[24px] border border-[rgba(214,204,194,0.25)] shadow-sm w-full p-[10px] aspect-square flex items-center justify-center overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-['Manrope',sans-serif] font-bold text-[10px] text-[#3b2d22] uppercase mt-[10px] opacity-60 truncate w-full text-center px-[4px]">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </StaggerItem>
        </div>
      </StaggerContainer>
    </div>
  );
}
