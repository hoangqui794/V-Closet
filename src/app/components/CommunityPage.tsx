import { useState } from "react";
import { toast } from "sonner";
import svgPaths from "../../imports/svg-tskucucll3";
import { SlideUp, ScaleIn } from "./PageTransition";
import { useMenu } from "./MenuContext";
import { LuckySpin } from "./LuckySpin";
import imgMainChallengeBanner from "@/assets/banner-autumn.png";
import imgOutfit1 from "@/assets/outfit-chic.png";
import imgOutfit2 from "@/assets/326b63c3da871b8711d1a8fa3ef055247c3f40b5.png";
import imgAvatar1 from "@/assets/109b45115e6cae70563f18222565ef1658795233.png";
import imgAvatar2 from "@/assets/c456c257d3afb30112c96701963e7d5a9961f01a.png";
import imgAvatar3 from "@/assets/ba2f29fa0edae9166043e99ba9c38a268998ad84.png";
import imgOutfit3 from "@/assets/6795ac54644e05698aee53d27671804b5860b6ea.png";

export function CommunityPage() {
  const { openMenu, openNotif } = useMenu();
  const [votes, setVotes] = useState<Record<number, boolean>>({});
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>({ 1: 128, 2: 94 });

  const toggleVote = (id: number) => {
    setVotes((prev) => {
      const wasVoted = prev[id];
      if (!wasVoted) toast.success("Đã bình chọn!");
      return { ...prev, [id]: !wasVoted };
    });
    setVoteCounts((prev) => ({
      ...prev,
      [id]: votes[id] ? prev[id] - 1 : prev[id] + 1,
    }));
  };

  const handleJoinChallenge = () => {
    toast.success("Đã đăng ký Autumn Elegance Challenge! 🍂");
  };

  const [showSpin, setShowSpin] = useState(false);

  const handleLuckySpin = () => {
    setShowSpin(true);
  };

  return (
    <div className="bg-[#fafafa] w-full flex flex-col">
      {/* Header */}
      <div className="backdrop-blur-[6px] bg-[rgba(245,235,224,0.8)] flex items-center justify-between px-[16px] py-[16px] sticky top-0 z-10">
        <button onClick={openMenu} className="bg-transparent border-none cursor-pointer p-0 active:opacity-60 transition-opacity">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <path d={svgPaths.p2bce57c0} fill="#3B2D22" />
          </svg>
        </button>
        <div className="font-['Manrope',sans-serif] font-[800] text-[18px] text-[#5d4037] text-center tracking-[-0.45px]">
          Cong Dong
        </div>
        <button onClick={openNotif} className="relative bg-transparent border-none cursor-pointer p-0 active:opacity-60 transition-opacity">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d={svgPaths.p164b49c0} fill="#3B2D22" />
          </svg>
          <div className="absolute bg-[#d4a373] right-0 rounded-full size-[8px] top-0" />
        </button>
      </div>

      {/* Main Challenge Banner */}
      <ScaleIn delay={0.1} className="mx-[16px] mt-[24px] relative aspect-video rounded-[16px] overflow-hidden shadow-[0px_4px_20px_0px_rgba(59,45,34,0.08)]">
        <img
          src={imgMainChallengeBanner}
          alt="Autumn Challenge"
          className="absolute inset-0 w-full h-[177.77%] top-[-38.89%] object-cover"
        />
        <div className="absolute bg-gradient-to-t from-[rgba(59,45,34,0.8)] to-transparent via-transparent inset-0" />
        <div className="absolute bottom-0 left-0 p-[24px]">
          <div className="bg-[#d4a373] rounded-[4px] px-[8px] py-[4px] inline-block mb-[8px]">
            <span className="font-['Manrope',sans-serif] font-bold text-[10px] text-white tracking-[1px] uppercase">
              Thang 10 Challenge
            </span>
          </div>
          <div className="font-['Manrope',sans-serif] font-bold text-[24px] text-white leading-[32px]">
            Autumn Elegance
          </div>
          <div className="font-['Manrope',sans-serif] font-bold text-[14px] text-[rgba(255,255,255,0.8)] leading-[20px] mt-[4px]">
            Khoe phong cach thu nhe nhang cua ban
          </div>
          <button className="mt-[12px] bg-white rounded-full px-[20px] py-[8px] border-none cursor-pointer flex items-center gap-[8px]" onClick={handleJoinChallenge}>
            <span className="font-['Manrope',sans-serif] font-[200] text-[12px] text-[#3b2d22] tracking-[0.6px] uppercase">
              Tham gia ngay
            </span>
            <svg width="9.333" height="9.333" viewBox="0 0 9.33333 9.33333" fill="none">
              <path d={svgPaths.pce77c00} fill="#3B2D22" />
            </svg>
          </button>
        </div>
      </ScaleIn>

      {/* Lucky Spin Section */}
      <SlideUp delay={0.2} className="mx-[16px] mt-[24px] bg-[#edede9] rounded-[16px] p-[21px] flex gap-[16px] items-center border border-[rgba(59,45,34,0.05)] shadow-[0px_4px_20px_0px_rgba(59,45,34,0.08)]">
        <div className="relative size-[96px] flex items-center justify-center shrink-0">
          <div className="bg-[#3b2d22] rounded-full size-[64px] flex items-center justify-center shadow-[0px_4px_20px_0px_rgba(59,45,34,0.08)]">
            <svg width="22.5" height="22.5" viewBox="0 0 22.5 22.5" fill="none">
              <path d={svgPaths.p3f106680} fill="white" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-[rgba(212,163,115,0.3)]" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="font-['Manrope',sans-serif] font-bold text-[18px] text-[#3b2d22] leading-[22.5px]">
            Vong Xoay May Man
          </div>
          <div className="font-['Manrope',sans-serif] font-[200] text-[14px] text-[#7f5539] leading-[20px] pb-[12px]">
            Quay ngay de nhan voucher
            <br />
            mua sam & qua tang!
          </div>
          <button className="bg-[#3b2d22] rounded-[12px] py-[10px] w-full border-none cursor-pointer" onClick={handleLuckySpin}>
            <span className="font-['Manrope',sans-serif] font-bold text-[14px] text-white text-center tracking-[0.35px]">
              THU VAN MAY
            </span>
          </button>
        </div>
      </SlideUp>

      {/* Vote Section */}
      <SlideUp delay={0.3} className="mt-[24px] py-[8px]">
        <div className="flex items-center justify-between px-[16px] mb-[16px]">
          <div className="font-['Manrope',sans-serif] font-bold text-[18px] text-[#3b2d22]">
            Vote Phoi Do Dep
          </div>
          <span className="font-['Manrope',sans-serif] font-[200] text-[12px] text-[#d4a373] tracking-[0.6px] uppercase">
            Xem tat ca
          </span>
        </div>
        <div className="flex gap-[16px] px-[16px] overflow-x-auto pb-[8px]">
          {/* Vote Item 1 */}
          <div className="min-w-[200px] bg-white rounded-[12px] overflow-hidden shadow-[0px_4px_20px_0px_rgba(59,45,34,0.08)] shrink-0">
            <div className="h-[256px] relative">
              <img
                src={imgOutfit1}
                alt="Beige Minimalist"
                className="w-full h-full object-cover"
              />
              <button className="absolute right-[8px] top-[8px] bg-[rgba(255,255,255,0.9)] rounded-full size-[32px] flex items-center justify-center border-none cursor-pointer shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" onClick={() => toggleVote(1)}>
                <svg width="16.667" height="15.292" viewBox="0 0 16.6667 15.2917" fill="none">
                  <path d={svgPaths.p28063980} fill="#3B2D22" />
                </svg>
              </button>
            </div>
            <div className="p-[12px]">
              <div className="font-['Manrope',sans-serif] font-bold text-[14px] text-[#3b2d22] text-center">
                Beige Minimalist
              </div>
              <div className="font-['Manrope',sans-serif] font-[200] text-[11px] text-[#7f5539] text-center pb-[13px]">
                boi @linh_linh
              </div>
              <div className="bg-[#f5ebe0] rounded-[8px] py-[6px] flex items-center justify-center gap-[4px]">
                <svg width="12.25" height="11.667" viewBox="0 0 12.25 11.6667" fill="none">
                  <path d={svgPaths.p1fd12b00} fill="#3B2D22" />
                </svg>
                <span className="font-['Manrope',sans-serif] font-bold text-[12px] text-[#3b2d22]">
                  {voteCounts[1]} Votes
                </span>
              </div>
            </div>
          </div>

          {/* Vote Item 2 */}
          <div className="min-w-[200px] bg-white rounded-[12px] overflow-hidden shadow-[0px_4px_20px_0px_rgba(59,45,34,0.08)] shrink-0">
            <div className="h-[256px] relative">
              <img
                src={imgOutfit2}
                alt="Streetwear Vibes"
                className="w-full h-full object-cover"
              />
              <button className="absolute right-[8px] top-[8px] bg-[rgba(255,255,255,0.9)] rounded-full size-[32px] flex items-center justify-center border-none cursor-pointer shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" onClick={() => toggleVote(2)}>
                <svg width="16.667" height="15.292" viewBox="0 0 16.6667 15.2917" fill="none">
                  <path d={svgPaths.p28063980} fill="#3B2D22" />
                </svg>
              </button>
            </div>
            <div className="p-[12px]">
              <div className="font-['Manrope',sans-serif] font-bold text-[14px] text-[#3b2d22] text-center">
                Streetwear Vibes
              </div>
              <div className="font-['Manrope',sans-serif] font-[200] text-[11px] text-[#7f5539] text-center pb-[13px]">
                boi @minh_khoi
              </div>
              <div className="bg-[#f5ebe0] rounded-[8px] py-[6px] flex items-center justify-center gap-[4px]">
                <svg width="12.25" height="11.667" viewBox="0 0 12.25 11.6667" fill="none">
                  <path d={svgPaths.p1fd12b00} fill="#3B2D22" />
                </svg>
                <span className="font-['Manrope',sans-serif] font-bold text-[12px] text-[#3b2d22]">
                  {voteCounts[2]} Votes
                </span>
              </div>
            </div>
          </div>
        </div>
      </SlideUp>

      {/* Recent Activity */}
      <SlideUp delay={0.4} className="px-[16px] pt-[24px] pb-[24px]">
        <div className="font-['Manrope',sans-serif] font-bold text-[18px] text-[#3b2d22] mb-[16px]">
          Hoat dong gan day
        </div>

        {/* Activity 1 */}
        <div className="flex gap-[16px] items-start mb-[16px]">
          <div className="rounded-full size-[40px] overflow-hidden shrink-0 border border-[rgba(59,45,34,0.1)]">
            <img src={imgAvatar1} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 border-b border-[rgba(59,45,34,0.05)] pb-[17px]">
            <div className="font-['Manrope',sans-serif] text-[14px] text-[#3b2d22] leading-[20px]">
              <span className="font-bold">Lan Anh</span>
              <span className="font-[200]">{" "}da binh chon cho trang phuc cua</span>
              <br />
              <span className="font-bold">Manh Tung</span>
            </div>
            <div className="font-['Manrope',sans-serif] font-[200] text-[11px] text-[#7f5539] mt-[3px]">
              2 phut truoc
            </div>
          </div>
        </div>

        {/* Activity 2 */}
        <div className="flex gap-[16px] items-start mb-[16px]">
          <div className="rounded-full size-[40px] overflow-hidden shrink-0 border border-[rgba(59,45,34,0.1)]">
            <img src={imgAvatar2} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 border-b border-[rgba(59,45,34,0.05)] pb-[17px]">
            <div className="font-['Manrope',sans-serif] text-[14px] text-[#3b2d22] leading-[20px]">
              <span className="font-bold">Hoang Nam</span>
              <span className="font-[200]">{" "}da dang mot phoi do moi trong</span>
              <br />
              <span className="font-bold">Autumn Challenge</span>
            </div>
            <div className="mt-[8px] bg-[#edede9] rounded-[4px] w-[64px] h-[79px] overflow-hidden">
              <img src={imgOutfit3} alt="" className="w-[125%] h-full left-[-12.5%] relative object-cover" />
            </div>
            <div className="font-['Manrope',sans-serif] font-[200] text-[11px] text-[#7f5539] mt-[8px]">
              15 phut truoc
            </div>
          </div>
        </div>

        {/* Activity 3 */}
        <div className="flex gap-[16px] items-start">
          <div className="rounded-full size-[40px] overflow-hidden shrink-0 border border-[rgba(59,45,34,0.1)]">
            <img src={imgAvatar3} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 border-b border-[rgba(59,45,34,0.05)] pb-[17px]">
            <div className="font-['Manrope',sans-serif] text-[14px] text-[#3b2d22] leading-[20px]">
              <span className="font-[200]">Thanh Lam</span>
              <span className="font-[200]">{" "}vua trung </span>
              <span className="font-[200]">Voucher 50k</span>
              <span className="font-[200]">{" "}tu Vong</span>
              <br />
              <span className="font-[200]">Xoay!</span>
            </div>
            <div className="font-['Manrope',sans-serif] font-[200] text-[11px] text-[#7f5539] mt-[3px]">
              1 gio truoc
            </div>
          </div>
        </div>
      </SlideUp>

      {/* Lucky Spin Modal */}
      {showSpin && <LuckySpin onClose={() => setShowSpin(false)} />}
    </div>
  );
}