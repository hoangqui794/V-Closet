import { useState } from "react";
import { toast } from "sonner";
import svgPaths from "../../imports/svg-tskucucll3";
import { SlideUp, ScaleIn } from "./PageTransition";
import { useMenu } from "./MenuContext";
import { LuckySpin } from "./LuckySpin";

// Using local images for assets
import imgMainChallengeBanner from "@/assets/community-banner.png";
import imgOutfit1 from "@/assets/outfit-chic.png";
import imgFeed1 from "@/assets/feed-autumn-girl.png";
import imgFeed2 from "@/assets/feed-streetwear-guy.png";
import imgAvatar1 from "@/assets/109b45115e6cae70563f18222565ef1658795233.png";
import imgAvatar2 from "@/assets/c456c257d3afb30112c96701963e7d5a9961f01a.png";
import imgAvatar3 from "@/assets/ba2f29fa0edae9166043e99ba9c38a268998ad84.png";

export function CommunityPage() {
  const { openMenu, openNotif } = useMenu();
  const [votes, setVotes] = useState<Record<number, boolean>>({});
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>({ 1: 128, 2: 94 });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Kham pha");

  const TABS = ["Kham pha", "Xu huong", "Dang theo doi", "Thach thuc"];

  const TOP_STYLISTS = [
    { name: "Lan Anh", avatar: imgAvatar1, followers: "12k" },
    { name: "Hoang Nam", avatar: imgAvatar2, followers: "8.5k" },
    { name: "Thanh Lam", avatar: imgAvatar3, followers: "15k" },
    { name: "Minh Khoi", avatar: imgAvatar1, followers: "5k" },
    { name: "Tuong Vy", avatar: imgAvatar2, followers: "20k" },
  ];

  const FEED_POSTS = [
    {
      id: 1,
      user: "Minh Khoi",
      avatar: imgAvatar2,
      image: imgFeed2,
      likes: 1240,
      comments: 42,
      caption: "Ngay moi voi phong cach Minimalist ☕️ #minimalist #outfitoftheday",
      time: "2 gio truoc"
    },
    {
      id: 2,
      user: "Lan Anh",
      avatar: imgAvatar1,
      image: imgFeed1,
      likes: 856,
      comments: 18,
      caption: "Mua thu vao pho 🍂 Chut nhe nhang cho ngay cuoi tuan.",
      time: "4 gio truoc"
    }
  ];

  const toggleVote = (id: number) => {
    setVotes((prev) => {
      const wasVoted = prev[id];
      if (!wasVoted) toast.success("Da binh chon!");
      return { ...prev, [id]: !wasVoted };
    });
    setVoteCounts((prev) => ({
      ...prev,
      [id]: votes[id] ? prev[id] - 1 : prev[id] + 1,
    }));
  };

  const toggleLike = (id: number) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
    if (!likes[id]) toast.success("Da thich bai viet!");
  };

  const [showSpin, setShowSpin] = useState(false);

  return (
    <div className="bg-[#faf9f6] w-full flex flex-col min-h-screen pb-[100px]">
      {/* Header */}
      <div className="backdrop-blur-[12px] bg-[rgba(253,250,246,0.85)] flex items-center justify-between px-[20px] py-[16px] sticky top-0 z-20 border-b border-[rgba(59,45,34,0.05)]">
        <button onClick={openMenu} className="bg-transparent border-none cursor-pointer p-0 active:scale-95 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 8h16M4 16h16" stroke="#3B2D22" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="font-['Outfit',sans-serif] font-[700] text-[20px] text-[#3b2d22] tracking-[-0.5px]">
          Community
        </div>
        <div className="flex items-center gap-[16px]">
          <button onClick={openNotif} className="relative bg-transparent border-none cursor-pointer p-0 active:scale-95 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h14s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#3B2D22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute bg-[#d4a373] right-[2px] rounded-full size-[8px] top-[2px] border-2 border-white" />
          </button>
          <div className="size-[32px] rounded-full overflow-hidden border border-[rgba(59,45,34,0.1)]">
            <img src={imgAvatar1} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-[20px] mt-[16px]">
        <div className="relative flex items-center bg-[#f0ede9] rounded-[16px] px-[16px] py-[12px] group focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d4a373] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-40 group-focus-within:opacity-100 transition-opacity">
            <circle cx="11" cy="11" r="8" stroke="#3B2D22" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="#3B2D22" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Tim kiem phong cach, nguoi dung..."
            className="bg-transparent border-none outline-none ml-[12px] w-full font-['Manrope',sans-serif] text-[15px] text-[#3b2d22] placeholder:text-[rgba(59,45,34,0.4)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-[20px] px-[20px] mt-[20px] overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap pb-[8px] border-b-2 transition-all font-['Manrope',sans-serif] font-bold text-[14px] border-none bg-transparent cursor-pointer ${activeTab === tab ? "text-[#3b2d22] border-b-[#3b2d22]!" : "text-[rgba(59,45,34,0.4)] border-transparent!"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Top Stylists (Stories Style) */}
      <SlideUp delay={0.1} className="mt-[24px]">
        <div className="flex items-center justify-between px-[20px] mb-[12px]">
          <div className="font-['Outfit',sans-serif] font-bold text-[18px] text-[#3b2d22]">
            Top Stylist trong tuan
          </div>
          <button className="text-[#d4a373] font-bold text-[13px] bg-transparent border-none">Xem tat ca</button>
        </div>
        <div className="flex gap-[16px] px-[20px] overflow-x-auto no-scrollbar">
          {TOP_STYLISTS.map((stylist, i) => (
            <div key={i} className="flex flex-col items-center gap-[8px] shrink-0">
              <div className="size-[64px] rounded-full p-[2px] border-2 border-[#d4a373] active:scale-95 transition-transform cursor-pointer">
                <div className="size-full rounded-full overflow-hidden border-2 border-white">
                  <img src={stylist.avatar} alt={stylist.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="font-['Manrope',sans-serif] text-[11px] font-bold text-[#3b2d22] max-w-[64px] truncate text-center">
                {stylist.name}
              </span>
            </div>
          ))}
        </div>
      </SlideUp>

      {/* Hero Challenge Banner */}
      <ScaleIn delay={0.2} className="mx-[20px] mt-[28px] relative aspect-[16/10] rounded-[24px] overflow-hidden shadow-[0px_20px_40px_rgba(59,45,34,0.12)]">
        <img
          src={imgMainChallengeBanner}
          alt="Autumn Challenge"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,18,13,0.9)] via-[rgba(26,18,13,0.4)] to-transparent" />
        <div className="absolute bottom-0 left-0 p-[24px] w-full">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <span className="bg-[#d4a373] rounded-[6px] px-[10px] py-[4px] font-['Outfit',sans-serif] font-bold text-[10px] text-white tracking-[1px] uppercase">
              LIVE CHALLENGE
            </span>
            <span className="text-[rgba(255,255,255,0.8)] text-[12px] font-['Manrope',sans-serif]">1.2k dang tham gia</span>
          </div>
          <div className="font-['Outfit',sans-serif] font-bold text-[28px] text-white leading-tight mb-[4px]">
            Autumn Elegance 🍂
          </div>
          <div className="font-['Manrope',sans-serif] text-[14px] text-[rgba(255,255,255,0.7)] mb-[16px]">
            Khoe phong cach thu nhe nhang cua ban nhan ngay voucher 500k.
          </div>
          <div className="flex items-center gap-[12px]">
            <button
              className="bg-white rounded-full px-[24px] py-[12px] border-none cursor-pointer font-['Outfit',sans-serif] font-bold text-[13px] text-[#3b2d22] active:scale-95 transition-transform"
              onClick={() => toast.success("Da dang ky Autumn Challenge! 🍁")}
            >
              Tham gia ngay
            </button>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="size-[24px] rounded-full border-2 border-[#1a120d] overflow-hidden">
                  <img src={imgAvatar1} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="size-[24px] rounded-full bg-[rgba(255,255,255,0.1)] border-2 border-[#1a120d] flex items-center justify-center text-[8px] text-white font-bold backdrop-blur-sm">
                +45
              </div>
            </div>
          </div>
        </div>
      </ScaleIn>

      {/* Lucky Spin Quick Access */}
      <SlideUp delay={0.3} className="mx-[20px] mt-[24px]">
        <button
          onClick={() => setShowSpin(true)}
          className="w-full bg-[#3b2d22] rounded-[20px] p-[20px] flex items-center justify-between border-none cursor-pointer overflow-hidden relative group active:scale-[0.98] transition-all shadow-[0px_10px_30px_rgba(59,45,34,0.15)]"
        >
          <div className="absolute top-[-20px] right-[-20px] size-[100px] bg-[rgba(212,163,115,0.1)] rounded-full blur-[40px] group-hover:bg-[rgba(212,163,115,0.2)] transition-colors" />
          <div className="flex items-center gap-[16px] relative z-10">
            <div className="size-[56px] bg-[#d4a373] rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-['Outfit',sans-serif] font-bold text-[17px] text-white">Vong Xoay May Man</div>
              <div className="font-['Manrope',sans-serif] text-[13px] text-[rgba(212,163,115,0.8)]">Nhan ngay Voucher 100k & qua tang</div>
            </div>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="relative z-10">
            <path d="M9 18l6-6-6-6" stroke="#d4a373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </SlideUp>

      {/* Community Social Feed */}
      <div className="mt-[32px]">
        <div className="px-[20px] mb-[20px] flex items-center justify-between">
          <div className="font-['Outfit',sans-serif] font-bold text-[22px] text-[#3b2d22]">Kham pha style</div>
          <div className="flex gap-[8px]">
            <button className="p-[8px] bg-white rounded-lg border border-[rgba(59,45,34,0.1)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M6 12h12M10 18h4" stroke="#3B2D22" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-[24px] px-[20px]">
          {FEED_POSTS.map((post) => (
            <SlideUp key={post.id} className="bg-white rounded-[28px] overflow-hidden shadow-[0px_4px_25px_rgba(59,45,34,0.06)] border border-[rgba(59,45,34,0.03)]">
              {/* Post Header */}
              <div className="p-[16px] flex items-center justify-between">
                <div className="flex items-center gap-[12px]">
                  <div className="size-[44px] rounded-full overflow-hidden border border-[rgba(59,45,34,0.08)]">
                    <img src={post.avatar} alt={post.user} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-['Outfit',sans-serif] font-bold text-[15px] text-[#3b2d22]">{post.user}</div>
                    <div className="font-['Manrope',sans-serif] text-[11px] text-[rgba(59,45,34,0.5)]">{post.time}</div>
                  </div>
                </div>
                <button className="p-[8px] bg-transparent border-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="5" r="1.5" fill="#3B2D22" />
                    <circle cx="12" cy="12" r="1.5" fill="#3B2D22" />
                    <circle cx="12" cy="19" r="1.5" fill="#3B2D22" />
                  </svg>
                </button>
              </div>

              {/* Post Image */}
              <div className="aspect-[4/5] relative mx-[12px] rounded-[20px] overflow-hidden group">
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button className="absolute bottom-[16px] right-[16px] bg-[rgba(255,255,255,0.9)] backdrop-blur-md rounded-full px-[16px] py-[10px] border-none flex items-center gap-[8px] shadow-lg active:scale-95 transition-transform">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3 6h18M16 10a4 4 0 0 1-8 0" stroke="#3B2D22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-['Outfit',sans-serif] font-bold text-[12px] text-[#3b2d22]">Shop the look</span>
                </button>
              </div>

              {/* Post Actions */}
              <div className="p-[16px]">
                <div className="flex items-center justify-between mb-[12px]">
                  <div className="flex items-center gap-[20px]">
                    <button onClick={() => toggleLike(post.id)} className="flex items-center gap-[6px] bg-transparent border-none p-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={likes[post.id] ? "#e63946" : "none"} stroke={likes[post.id] ? "#e63946" : "#3B2D22"} strokeWidth="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span className="font-['Outfit',sans-serif] font-bold text-[14px] text-[#3b2d22]">{post.likes + (likes[post.id] ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-[6px] bg-transparent border-none p-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B2D22" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <span className="font-['Outfit',sans-serif] font-bold text-[14px] text-[#3b2d22]">{post.comments}</span>
                    </button>
                    <button className="bg-transparent border-none p-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B2D22" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
                      </svg>
                    </button>
                  </div>
                  <button className="bg-transparent border-none p-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B2D22" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
                <div className="font-['Manrope',sans-serif] text-[14px] text-[#3b2d22] leading-[22px]">
                  <span className="font-bold mr-[8px]">{post.user}</span>
                  {post.caption}
                </div>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>

      {/* Style Battle / Vote Section Redesigned */}
      <SlideUp delay={0.4} className="mt-[48px] px-[20px] pb-[40px]">
        <div className="bg-[#f5ebe0] rounded-[32px] p-[24px]">
          <div className="text-center mb-[24px]">
            <div className="font-['Outfit',sans-serif] font-bold text-[24px] text-[#3b2d22]">Style Battle 🔥</div>
            <div className="font-['Manrope',sans-serif] text-[13px] text-[#7f5539]">Binh chon phoi do ban yeu thich</div>
          </div>
          <div className="flex gap-[16px]">
            {/* Card 1 */}
            <div className="flex-1 bg-white rounded-[20px] p-[12px] shadow-sm">
              <div className="aspect-[3/4] rounded-[16px] overflow-hidden mb-[12px] relative">
                <img src={imgOutfit1} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleVote(1)}
                  className={`absolute bottom-[12px] left-1/2 -translate-x-1/2 rounded-full px-[16px] py-[8px] border-none font-bold text-[12px] shadow-lg transition-all ${votes[1] ? "bg-[#3b2d22] text-white" : "bg-white text-[#3b2d22]"
                    }`}
                >
                  {votes[1] ? "Voted!" : "Vote"}
                </button>
              </div>
              <div className="text-center">
                <div className="font-['Outfit',sans-serif] font-bold text-[14px] text-[#3b2d22]">Chic Beige</div>
                <div className="text-[10px] text-[#7f5539]">{voteCounts[1]} votes</div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex-1 bg-white rounded-[20px] p-[12px] shadow-sm">
              <div className="aspect-[3/4] rounded-[16px] overflow-hidden mb-[12px] relative">
                <img src={imgOutfit1} alt="" className="w-full h-full object-cover grayscale" /> {/* Placeholder for contrast */}
                <button
                  onClick={() => toggleVote(2)}
                  className={`absolute bottom-[12px] left-1/2 -translate-x-1/2 rounded-full px-[16px] py-[8px] border-none font-bold text-[12px] shadow-lg transition-all ${votes[2] ? "bg-[#3b2d22] text-white" : "bg-white text-[#3b2d22]"
                    }`}
                >
                  {votes[2] ? "Voted!" : "Vote"}
                </button>
              </div>
              <div className="text-center">
                <div className="font-['Outfit',sans-serif] font-bold text-[14px] text-[#3b2d22]">Urban Dark</div>
                <div className="text-[10px] text-[#7f5539]">{voteCounts[2]} votes</div>
              </div>
            </div>
          </div>
        </div>
      </SlideUp>


      {/* Floating Action Button for Posting */}
      <div className="fixed bottom-[110px] right-[20px] z-30">
        <button
          onClick={() => toast.success("Feature coming soon: Chia se phoi do cua ban! ✨")}
          className="bg-[#3b2d22] text-white size-[60px] rounded-full flex items-center justify-center shadow-[0px_10px_25px_rgba(59,45,34,0.3)] active:scale-90 transition-all group"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <div className="absolute right-full mr-[12px] bg-[#3b2d22] text-white px-[12px] py-[6px] rounded-lg text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Dang phoi do
          </div>
        </button>
      </div>

      {/* Lucky Spin Modal */}
      {showSpin && <LuckySpin onClose={() => setShowSpin(false)} />}
    </div>
  );
}