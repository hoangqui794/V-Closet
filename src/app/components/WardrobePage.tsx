import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { SlideUp } from "./PageTransition";
import { useMenu } from "./MenuContext";
import svgPaths from "../../imports/svg-38y878fasw";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import imgWhiteTee from "@/assets/white-tee.png";
import imgLinenPants from "@/assets/linen-pants.png";
import imgBlackHoodie from "@/assets/black-hoodie.png";
import imgDenimJeans from "@/assets/denim-jeans.png";

const categories = ["All", "Tops", "Bottoms", "Outwear", "Shoes"];

const clothingItems = [
  {
    id: 1,
    name: "White Essential Tee",
    category: "Tops",
    image: imgWhiteTee,
  },
  {
    id: 2,
    name: "Earth Linen Slacks",
    category: "Bottoms",
    image: imgLinenPants,
  },
  {
    id: 3,
    name: "Midnight Hoodie",
    category: "Tops",
    image: imgBlackHoodie,
  },
  {
    id: 4,
    name: "Classic Straight Denim",
    category: "Bottoms",
    image: imgDenimJeans,
  },
];

export function WardrobePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { openMenu, openNotif } = useMenu();
  const navigate = useNavigate();

  const filteredItems =
    activeCategory === "All"
      ? clothingItems
      : clothingItems.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-[#fdfaf6] w-full min-h-full flex flex-col">
      {/* Header */}
      <div className="backdrop-blur-[6px] bg-[rgba(253,250,246,0.9)] flex items-center justify-between p-[16px] sticky top-0 z-10">
        <button onClick={openMenu} className="shrink-0 bg-transparent border-none cursor-pointer p-0 active:opacity-60 transition-opacity">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <path d={svgPaths.p2bce57c0} fill="#3B2D22" />
          </svg>
        </button>
        <div className="font-['Manrope',sans-serif] font-[800] text-[18px] text-[#4a3728] tracking-[-0.45px]">
          V-Closet
        </div>
        <button onClick={openNotif} className="shrink-0 bg-transparent border-none cursor-pointer p-0 active:opacity-60 transition-opacity">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d={svgPaths.p164b49c0} fill="#3B2D22" />
          </svg>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[12px] px-[16px] pt-[8px] pb-[16px]">
        <button onClick={() => navigate("/app/outfit")} className="bg-[#4a3728] flex gap-[8px] items-center justify-center px-[20px] py-[12px] rounded-[9999px] border-none cursor-pointer">
          <svg width="11.667" height="9.333" viewBox="0 0 11.667 9.333" fill="none">
            <path d={svgPaths.p4d36180} fill="white" />
          </svg>
          <span className="font-['Manrope',sans-serif] font-bold text-[14px] text-white whitespace-nowrap">
            V-Closet Try-on
          </span>
        </button>
        <button onClick={() => navigate("/app/shopee")} className="bg-white flex gap-[8px] items-center justify-center px-[20px] py-[12px] rounded-[9999px] border border-[#dccbb5] cursor-pointer active:scale-95 transition-transform">
          <svg width="9.333" height="11.667" viewBox="0 0 9.333 11.667" fill="none">
            <path d={svgPaths.p1b92a600} fill="#4a3728" />
          </svg>
          <span className="font-['Manrope',sans-serif] font-medium text-[14px] text-[#4a3728] whitespace-nowrap">
            Import from Shopee
          </span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-[20px] px-[16px] pb-[12px] border-b border-[rgba(74,55,40,0.1)]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`bg-transparent border-none cursor-pointer pb-[8px] px-0 font-['Manrope',sans-serif] text-[14px] ${activeCategory === cat
              ? "text-[#4a3728] font-bold border-b-2 border-[#4a3728]"
              : "text-[rgba(74,55,40,0.5)] font-medium"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* AI Processing Banner */}
      <SlideUp delay={0.1} className="mx-[16px] mt-[16px] bg-white rounded-[12px] border border-[rgba(74,55,40,0.1)] flex items-center justify-between px-[16px] py-[14px]">
        <div className="flex items-center gap-[12px]">
          <div className="bg-[#f5f0e6] rounded-[10px] p-[10px]">
            <svg width="22" height="22" viewBox="0 0 31 30" fill="none">
              <path d={svgPaths.p1dd1f730} fill="#4a3728" />
            </svg>
          </div>
          <div>
            <div className="font-['Manrope',sans-serif] font-bold text-[14px] text-[#4a3728]">
              Tách nền AI
            </div>
            <div className="font-['Manrope',sans-serif] font-normal text-[12px] text-[rgba(74,55,40,0.6)]">
              Đang xử lý 3 món đồ...
            </div>
          </div>
        </div>
        <button onClick={() => toast("⚙️ Đang xử lý 3 trang phục...")} className="bg-[#4a3728] rounded-[9999px] px-[16px] py-[8px] border-none cursor-pointer">
          <span className="font-['Manrope',sans-serif] font-bold text-[12px] text-white">
            View Status
          </span>
        </button>
      </SlideUp>

      {/* Clothing Grid */}
      <div className="grid grid-cols-2 gap-[12px] px-[16px] py-[16px]">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.15 + index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileTap={{ scale: 0.96 }}
            onClick={() => toast(`👕 ${item.name} — ${item.category}`)}
            className="relative rounded-[16px] overflow-hidden aspect-[3/4] bg-[#f5f0e6] cursor-pointer"
          >
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain p-[12px]"
            />
            <div className="absolute bottom-0 left-0 right-0 p-[12px] bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent">
              <div className="font-['Manrope',sans-serif] font-bold text-[14px] text-white leading-[18px]">
                {item.name}
              </div>
              <div className="font-['Manrope',sans-serif] font-normal text-[12px] text-[rgba(255,255,255,0.8)]">
                {item.category}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}