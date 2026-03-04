import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useMenu } from "./MenuContext";
import svgPaths from "../../imports/svg-mco234z0i7";
import imgSimulatedCameraFeed from "@/assets/9a60c62ec0a94e6fea91975e696ee10ea06c745a.png";
import imgRecent from "@/assets/d58875bc2ec02b537258bf3dc3b59666782fc97c.png";

export function CameraPage() {
  const navigate = useNavigate();
  const { openMenu } = useMenu();
  const [aiOn, setAiOn] = useState(true);
  const [capturing, setCapturing] = useState(false);

  const handleCapture = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      toast.success("📸 Đã chụp! Đang xử lý tách nền...");
    }, 400);
  };

  return (
    <div className="bg-[#fdfaf6] w-full h-full flex flex-col relative">
      {/* Flash overlay */}
      <AnimatePresence>
        {capturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-[#fdfaf6] flex items-center justify-between px-[16px] py-[12px] shrink-0">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center rounded-full size-[40px] cursor-pointer bg-transparent border-none active:bg-[rgba(74,55,40,0.06)] transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d={svgPaths.p15494480} fill="#4A3728" />
          </svg>
        </button>

        <span
          className="font-['Manrope',sans-serif] text-[17px] text-[#4a3728] text-center tracking-[-0.4px]"
          style={{ fontWeight: 700 }}
        >
          Chụp ảnh trang phục
        </span>

        <button onClick={() => toast("⚡ Đèn flash đã " + (aiOn ? "bật" : "tắt"))} className="flex items-center justify-center rounded-full size-[40px] cursor-pointer bg-transparent border-none active:bg-[rgba(74,55,40,0.06)] transition-colors">
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d={svgPaths.p37f8d380} fill="#4A3728" />
          </svg>
        </button>
      </div>

      {/* Camera Viewport */}
      <div className="flex-1 bg-[#171717] relative overflow-hidden">
        {/* Camera Feed */}
        <div className="absolute inset-0">
          <img
            alt=""
            className="w-full h-full object-cover opacity-80"
            src={imgSimulatedCameraFeed}
          />
        </div>

        {/* Vignette gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(74,55,40,0.38) 0%, rgba(74,55,40,0) 16%, rgba(74,55,40,0) 84%, rgba(74,55,40,0.38) 100%)",
          }}
        />

        {/* Guide frame + instruction */}
        <div className="absolute inset-0 flex items-center justify-center px-[24px]">
          <div className="relative w-full max-w-[340px] aspect-[3/4]">
            {/* Dashed border */}
            <div className="absolute inset-0 border-[2px] border-dashed border-[rgba(255,255,255,0.55)] rounded-[12px] pointer-events-none" />

            {/* Centered instruction */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="backdrop-blur-[4px] bg-[rgba(74,55,40,0.2)] rounded-[8px] px-[24px] py-[18px] flex flex-col gap-[8px] items-center">
                <svg width="30" height="18" viewBox="0 0 30 18" fill="none">
                  <path d={svgPaths.p876af00} fill="white" fillOpacity="0.55" />
                </svg>
                <span
                  className="font-['Manrope',sans-serif] text-[14px] text-[rgba(255,255,255,0.6)] text-center"
                  style={{ fontWeight: 500 }}
                >
                  Đặt trang phục phẳng{"\n"}trong khung hình
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Background Removal Toggle */}
        <div className="absolute bottom-[16px] left-0 right-0 flex justify-center px-[24px]">
          <button
            onClick={() => setAiOn(!aiOn)}
            className="backdrop-blur-[8px] bg-[rgba(74,55,40,0.8)] rounded-full flex items-center pl-[20px] pr-[8px] py-[8px] gap-[14px] border border-[rgba(255,255,255,0.15)] shadow-[0px_16px_24px_-8px_rgba(0,0,0,0.2)] cursor-pointer active:scale-[0.97] transition-transform duration-100"
          >
            <div className="flex flex-col items-start">
              <span
                className="font-['Manrope',sans-serif] text-[12px] text-white tracking-[0.5px] uppercase"
                style={{ fontWeight: 700, lineHeight: "16px" }}
              >
                Tách nền AI
              </span>
              <span
                className="font-['Manrope',sans-serif] text-[10px] text-[rgba(255,255,255,0.65)]"
                style={{ fontWeight: 400, lineHeight: "14px" }}
              >
                Tự động làm sạch ảnh
              </span>
            </div>

            <div
              className={`rounded-full size-[40px] flex items-center justify-center transition-colors duration-200 ${aiOn ? "bg-white" : "bg-[rgba(255,255,255,0.15)]"
                }`}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                className={`transition-transform duration-200 ${aiOn ? "scale-100" : "scale-90 opacity-60"}`}
              >
                <path
                  d={svgPaths.pb589888}
                  fill={aiOn ? "#4A3728" : "rgba(255,255,255,0.5)"}
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Camera Controls */}
      <div className="bg-[#fdfaf6] flex items-center justify-center gap-[48px] py-[20px] px-[36px] shrink-0">
        {/* Recent */}
        <button onClick={() => toast("🖼️ Mở ảnh gần đây...")} className="flex flex-col gap-[5px] items-center bg-transparent border-none cursor-pointer p-0 active:opacity-60 transition-opacity">
          <div className="bg-[#f5f0e6] rounded-[8px] size-[48px] overflow-hidden border border-[rgba(74,55,40,0.1)]">
            <img src={imgRecent} alt="" className="w-full h-full object-cover" />
          </div>
          <span
            className="font-['Manrope',sans-serif] text-[10px] text-[rgba(74,55,40,0.5)] tracking-[0.4px] uppercase"
            style={{ fontWeight: 700 }}
          >
            Gần đây
          </span>
        </button>

        {/* Capture Button */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute rounded-full size-[80px] border-4 border-[rgba(74,55,40,0.15)]" />

          {/* Pulse on capture */}
          <AnimatePresence>
            {capturing && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.35, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute rounded-full size-[80px] border-[3px] border-[#4a3728]"
              />
            )}
          </AnimatePresence>

          <button
            onClick={handleCapture}
            className="bg-[#4a3728] rounded-full size-[64px] flex items-center justify-center border-none cursor-pointer shadow-[0px_4px_16px_rgba(74,55,40,0.3)] active:scale-[0.88] transition-transform duration-100"
          >
            <svg width="25" height="22.5" viewBox="0 0 25 22.5" fill="none">
              <path d={svgPaths.p326c1780} fill="white" />
            </svg>
          </button>
        </div>

        {/* Gallery */}
        <button onClick={() => toast("📁 Mở thư viện ảnh...")} className="flex flex-col gap-[5px] items-center bg-transparent border-none cursor-pointer p-0 active:opacity-60 transition-opacity">
          <div className="bg-[#f5f0e6] rounded-full size-[48px] flex items-center justify-center border border-[rgba(74,55,40,0.1)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d={svgPaths.p27589980} fill="#4A3728" fillOpacity="0.55" />
            </svg>
          </div>
          <span
            className="font-['Manrope',sans-serif] text-[10px] text-[rgba(74,55,40,0.5)] tracking-[0.4px] uppercase"
            style={{ fontWeight: 700 }}
          >
            Thư viện
          </span>
        </button>
      </div>
    </div>
  );
}