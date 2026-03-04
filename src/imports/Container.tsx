import svgPaths from "./svg-mco234z0i7";
import imgSimulatedCameraFeed from "@/assets/9a60c62ec0a94e6fea91975e696ee10ea06c745a.png";
import imgAb6AXuB1YsHDvhAfj5PWyrqmlt9VARabBgCsuOvOjCXhUjJpKlrRZkk1QmufdIbgYoCqrKceCn21IDx0TBpHxzPtjcTj5Ou1CPeP5LHboloS3K8D2S3WjEewQikjcUy1E92Gzm6L90P9GCbk2DNYakDVpDwz72NKk5Et2HIxq3JIwnKam9WNRbLcBgLaQ6CfGwc90BEQrqXcnPqhiMy0RSyuKaj6Rcxp5K7Ls4M2GhMhM2YprIEr72NRYzhyiWyl3Fl4V4I3M from "@/assets/d58875bc2ec02b537258bf3dc3b59666782fc97c.png";

function Container1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[30px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 18">
        <g id="Container">
          <path d={svgPaths.p876af00} fill="var(--fill-0, white)" fillOpacity="0.6" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.6)] text-center w-[256.11px]">
        <p className="leading-[20px]">Đặt trang phục phẳng trong khung hình</p>
      </div>
    </div>
  );
}

function OverlayOverlayBlur() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(74,55,40,0.2)] relative rounded-[8px] shrink-0" data-name="Overlay+OverlayBlur">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center p-[24px] relative">
        <Container1 />
        <Container2 />
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[384px] px-[2px] py-[159.33px] relative rounded-[12px] shrink-0 w-full" data-name="Border">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.6)] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <OverlayOverlayBlur />
    </div>
  );
}

function AiGuideOverlay() {
  return (
    <div className="absolute content-stretch flex flex-col inset-0 items-center justify-center p-[32px]" data-name="AI Guide Overlay" style={{ backgroundImage: "linear-gradient(rgba(74, 55, 40, 0.4) 0%, rgba(74, 55, 40, 0) 15%, rgba(74, 55, 40, 0) 85%, rgba(74, 55, 40, 0.4) 100%)" }}>
      <Border />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[12px] text-white tracking-[0.6px] uppercase w-[79.44px]">
        <p className="leading-[16px]">Tách nền AI</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[15px] justify-center leading-[0] relative shrink-0 text-[10px] text-[rgba(255,255,255,0.7)] w-[99.7px]">
        <p className="leading-[15px]">Tự động làm sạch ảnh</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-[99.7px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Container4 />
        <Container5 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="Container">
          <path d={svgPaths.pb589888} fill="var(--fill-0, #4A3728)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container6 />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(74,55,40,0.8)] relative rounded-[9999px] self-stretch shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] h-full items-center pl-[21px] pr-[9px] py-[9px] relative">
          <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[9999px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" data-name="Overlay+Shadow" />
          <Container3 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function AiBackgroundRemovalToggle() {
  return (
    <div className="absolute bottom-[19px] content-stretch flex h-[58px] items-start justify-center left-0 px-[24px] right-0" data-name="AI Background Removal Toggle">
      <OverlayBorderOverlayBlur />
    </div>
  );
}

function CameraViewport() {
  return (
    <div className="absolute bg-[#171717] inset-[72px_0_218px_0] overflow-clip" data-name="Camera Viewport">
      <div className="absolute inset-0 opacity-80" data-name="Simulated Camera Feed">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-[-26.15%] max-w-none top-0 w-[152.31%]" src={imgSimulatedCameraFeed} />
        </div>
      </div>
      <AiGuideOverlay />
      <AiBackgroundRemovalToggle />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Container">
          <path d={svgPaths.p15494480} fill="var(--fill-0, #4A3728)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button">
      <Container7 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-center relative shrink-0 w-[292px]" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[22.5px] relative shrink-0 text-[#4a3728] text-[18px] text-center tracking-[-0.45px] w-[232px]">
        <p className="mb-0">&nbsp;</p>
        <p>Chụp ảnh trang phục</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 20">
        <g id="Container">
          <path d={svgPaths.p37f8d380} fill="var(--fill-0, #4A3728)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button">
      <Container9 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-[40px]" data-name="Container">
      <Button2 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(253,250,246,0.9)] content-stretch flex items-center justify-between left-0 p-[16px] right-0 top-0" data-name="Header">
      <Button1 />
      <Heading />
      <Container8 />
    </div>
  );
}

function Ab6AXuB1YsHDvhAfj5PWyrqmlt9VARabBgCsuOvOjCXhUjJpKlrRZkk1QmufdIbgYoCqrKceCn21IDx0TBpHxzPtjcTj5Ou1CPeP5LHboloS3K8D2S3WjEewQikjcUy1E92Gzm6L90P9GCbk2DNYakDVpDwz72NKk5Et2HIxq3JIwnKam9WNRbLcBgLaQ6CfGwc90BEQrqXcnPqhiMy0RSyuKaj6Rcxp5K7Ls4M2GhMhM2YprIEr72NRYzhyiWyl3Fl4V4I3M() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="AB6AXuB1ysH-dvhAfj5_pWYRQMLT9v_aRabBgCsuOvOjCXhUjJpKlrRZkk1QMUFDIbgYoCQRKceCN21iDX0TBpHXZPtjcTJ5OU1CPeP5LHboloS3k8d2s3wjEewQikjcUy_1_e92GZM_6L90p9gCbk2dNYakDVpDwz72nKk5Et2hIXQ3J-iwnKam9wN_RbLcBGLaQ6cf-Gwc90bEQrqXCNPqhiMY0RSyuKaj6Rcxp5K7LS4M2ghMhM2YprIEr72N_rYZHYIWyl3FL4v4i3M">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuB1YsHDvhAfj5PWyrqmlt9VARabBgCsuOvOjCXhUjJpKlrRZkk1QmufdIbgYoCqrKceCn21IDx0TBpHxzPtjcTj5Ou1CPeP5LHboloS3K8D2S3WjEewQikjcUy1E92Gzm6L90P9GCbk2DNYakDVpDwz72NKk5Et2HIxq3JIwnKam9WNRbLcBgLaQ6CfGwc90BEQrqXcnPqhiMy0RSyuKaj6Rcxp5K7Ls4M2GhMhM2YprIEr72NRYzhyiWyl3Fl4V4I3M} />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#f5f0e6] relative rounded-[8px] shrink-0 size-[48px]" data-name="Background+Border">
      <div className="content-stretch flex items-center justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <Ab6AXuB1YsHDvhAfj5PWyrqmlt9VARabBgCsuOvOjCXhUjJpKlrRZkk1QmufdIbgYoCqrKceCn21IDx0TBpHxzPtjcTj5Ou1CPeP5LHboloS3K8D2S3WjEewQikjcUy1E92Gzm6L90P9GCbk2DNYakDVpDwz72NKk5Et2HIxq3JIwnKam9WNRbLcBgLaQ6CfGwc90BEQrqXcnPqhiMy0RSyuKaj6Rcxp5K7Ls4M2GhMhM2YprIEr72NRYzhyiWyl3Fl4V4I3M />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(74,55,40,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Button">
      <BackgroundBorder />
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[10px] text-[rgba(74,55,40,0.6)] text-center w-[42.45px]">
        <p className="leading-[15px]">GẦN ĐÂY</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[25px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 22.5">
        <g id="Container">
          <path d={svgPaths.p326c1780} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#4a3728] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[64px]" data-name="Background">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[rgba(255,255,255,0)] left-1/2 rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[64px] top-1/2" data-name="Overlay+Shadow" />
      <Container10 />
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button">
      <div className="absolute left-[-8px] rounded-[9999px] size-[80px] top-[-8px]" data-name="Border">
        <div aria-hidden="true" className="absolute border-4 border-[rgba(74,55,40,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      </div>
      <Background />
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p27589980} fill="var(--fill-0, #4A3728)" fillOpacity="0.6" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#f5f0e6] content-stretch flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(74,55,40,0.1)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container11 />
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Button">
      <BackgroundBorder1 />
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[10px] text-[rgba(74,55,40,0.6)] text-center w-[44.73px]">
        <p className="leading-[15px]">THƯ VIỆN</p>
      </div>
    </div>
  );
}

function CameraControls() {
  return (
    <div className="absolute bg-[#fdfaf6] content-stretch flex gap-[55.3px] items-center left-0 pl-[59.66px] pr-[59.69px] py-[32px] right-0 top-[666px]" data-name="Camera Controls">
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Group() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1">
      <div className="col-1 h-[16.889px] ml-0 mt-0 overflow-clip relative row-1 w-[20px]" data-name="Coffee">
        <div className="absolute inset-[4.17%_4.17%_12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-5.68%_-4.57%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.1 15.6741">
              <path d={svgPaths.p27c25f80} id="Icon" stroke="var(--stroke-0, #8B7355)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1">
      <Group />
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group1 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Group2 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Container">
      <Container13 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[18px] justify-center leading-[0] relative shrink-0 text-[#8b7355] text-[12px] tracking-[0.3px] w-[66px]">
        <p className="leading-[18px]">Cộng đồng</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center justify-end relative size-full">
        <Container12 />
        <Container14 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[16px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16">
        <g id="Container">
          <path d={svgPaths.p23c4d380} fill="var(--fill-0, #8B7355)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Container">
      <Container16 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[18px] justify-center leading-[0] relative shrink-0 text-[#8b7355] text-[12px] tracking-[0.3px] w-[32.78px]">
        <p className="leading-[18px]">Tủ đồ</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center justify-end relative size-full">
        <Container15 />
        <Container17 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Container">
          <path d={svgPaths.p6da5600} fill="var(--fill-0, #4A3728)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container20 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Container">
      <Container19 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[18px] justify-center leading-[0] relative shrink-0 text-[#4a3728] text-[12px] tracking-[0.3px] w-[61px]">
        <p className="leading-[18px]">Chụp ảnh</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center justify-end relative size-full">
        <Container18 />
        <Container21 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Container">
          <path d={svgPaths.p11c2d500} fill="var(--fill-0, #8B7355)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Container">
      <Container23 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[83px]" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[18px] justify-center leading-[0] relative shrink-0 text-[#8b7355] text-[12px] text-center tracking-[0.3px] w-[83px]">
        <p className="leading-[18px]">Phối đồ</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center justify-end relative size-full">
        <Container22 />
        <Container24 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p85bff00} fill="var(--fill-0, #8B7355)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Container">
      <Container26 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Medium',sans-serif] font-medium h-[18px] justify-center leading-[0] relative shrink-0 text-[#8b7355] text-[12px] tracking-[0.3px] w-[48.45px]">
        <p className="leading-[18px]">Cá nhân</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center justify-end relative size-full">
        <Container25 />
        <Container27 />
      </div>
    </div>
  );
}

function BottomNavigationBar() {
  return (
    <div className="absolute bg-[#fdfaf6] content-stretch flex gap-[8px] h-[96px] items-start justify-center left-0 pb-[25px] pt-[27px] px-[16px] top-[797px] w-[390px]" data-name="Bottom Navigation Bar">
      <div aria-hidden="true" className="absolute border-[rgba(74,55,40,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
      <Link4 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="relative size-full" data-name="Container">
      <CameraViewport />
      <Header />
      <CameraControls />
      <BottomNavigationBar />
    </div>
  );
}