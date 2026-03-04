import svgPaths from "./svg-ta7we0nsx9";
import imgImage1 from "@/assets/c22b93679af3b6264b2299da42054740eb04018f.png";
import imgLogo from "@/assets/92375b66cc5f6db228cbba4fabc2bd6032c970de.png";

function Frame() {
  return <div className="h-[6px] shrink-0 w-px" />;
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 1">
      <div className="flex flex-col font-['Manrope:Extra_Bold',sans-serif] h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a3728] text-[30px] tracking-[-0.75px] w-[122.44px]">
        <p className="leading-[36px]">V-Closet</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <Heading />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[40px] relative shrink-0" data-name="Margin">
      <Container2 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[30px] justify-center leading-[0] relative shrink-0 text-[#4a3728] text-[24px] text-center w-[167.77px]">
        <p className="leading-[30px]">Welcome Back</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(74,55,40,0.7)] text-center w-[344.95px]">
        <p className="leading-[24px]">Access your digital wardrobe and virtual try-on.</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[344.95px]" data-name="Container">
      <Heading1 />
      <Container4 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[32px] relative shrink-0" data-name="Margin">
      <Container3 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Manrope:Semi_Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(74,55,40,0.8)] w-full">
        <p className="leading-[20px]">Email or Username</p>
      </div>
    </div>
  );
}

function LabelMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label:margin">
      <div className="content-stretch flex flex-col items-start pl-[4px] relative w-full">
        <Label />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6b7280] text-[16px] w-full">
          <p className="leading-[normal]">Enter your email</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[56px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pl-[49px] pr-[17px] py-[17px] relative size-full">
          <Container8 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#dccbb5] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bottom-[13.39%] content-stretch flex flex-col items-start left-[16px] top-[36.61%]" data-name="Container">
      <div className="relative shrink-0 size-[13.333px]" data-name="Icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
          <path d={svgPaths.pfeb5cc0} fill="var(--fill-0, #4A3728)" fillOpacity="0.5" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Input />
      <Container9 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <LabelMargin />
      <Container7 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Label">
      <div className="flex flex-col font-['Manrope:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(74,55,40,0.8)] w-[64.36px]">
        <p className="leading-[20px]">Password</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#4a3728] text-[12px] w-[103.05px]">
        <p className="leading-[16px]">Forgot password?</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <Link />
    </div>
  );
}

function Margin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="content-stretch flex flex-col items-start pl-[4px] relative w-full">
        <Container11 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6b7280] text-[16px] w-full">
          <p className="leading-[normal]">••••••••</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[56px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pl-[49px] pr-[17px] py-[17px] relative size-full">
          <Container13 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#dccbb5] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bottom-[13.39%] content-stretch flex flex-col items-start left-[20px] top-[36.61%]" data-name="Container">
      <div className="h-[17.5px] relative shrink-0 w-[13.333px]" data-name="Icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 17.5">
          <path d={svgPaths.p2eed4060} fill="var(--fill-0, #4A3728)" fillOpacity="0.5" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Input1 />
      <Container14 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Margin2 />
      <Container12 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#fdfaf6] text-[16px] text-center w-[154.77px]">
        <p className="leading-[24px]">Login to Your Closet</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[12px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 12">
        <g id="Container">
          <path d={svgPaths.p1acd9480} fill="var(--fill-0, #FDFAF6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#4a3728] content-stretch flex gap-[8px] h-[56px] items-center justify-center relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] h-[56px] left-0 right-0 rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(74,55,40,0.2),0px_4px_6px_-4px_rgba(74,55,40,0.2)] top-0" data-name="Button:shadow" />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[350px]" data-name="Container">
      <Container6 />
      <Container10 />
      <Button />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[12px] text-[rgba(74,55,40,0.4)] tracking-[0.6px] uppercase w-[123.72px]">
        <p className="leading-[16px]">Or continue with</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <div className="bg-[rgba(220,203,181,0.6)] flex-[1_0_0] h-px min-h-px min-w-px" data-name="Horizontal Divider" />
      <Container18 />
      <div className="bg-[rgba(220,203,181,0.6)] flex-[1_0_0] h-px min-h-px min-w-px" data-name="Horizontal Divider" />
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-[254px]" data-name="Margin">
      <Container17 />
    </div>
  );
}

function Logo() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Logo">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_478)" id="Logo">
          <path d={svgPaths.p33b7ccc0} fill="var(--fill-0, #4285F4)" id="Vector" />
          <path d={svgPaths.p15123a40} fill="var(--fill-0, #34A853)" id="Vector_2" />
          <path d={svgPaths.p28bf8e80} fill="var(--fill-0, #FBBC05)" id="Vector_3" />
          <path d={svgPaths.p1e563600} fill="var(--fill-0, #EB4335)" id="Vector_4" />
        </g>
        <defs>
          <clipPath id="clip0_1_478">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative">
        <div className="flex flex-col font-['Manrope:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[#4a3728] text-[14px] text-center w-[46.97px]">
          <p className="leading-[20px]">Google</p>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[48px] items-center justify-center pl-[48.02px] pr-[48.01px] py-px relative rounded-[12px] shrink-0 w-[151px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#dccbb5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Logo />
      <Container20 />
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative">
        <div className="flex flex-col font-['Manrope:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[#4a3728] text-[14px] text-center w-[37.61px]">
          <p className="leading-[20px]">Apple</p>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[48px] items-center justify-center pl-[52.69px] pr-[52.7px] py-px relative rounded-[12px] shrink-0 w-[143px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#dccbb5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="relative shrink-0 size-[20px]" data-name="Logo">
        <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-[-28.84%] max-w-none size-[158.73%] top-[-29.1%]" src={imgLogo} />
        </div>
      </div>
      <Container21 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[316px]" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#4a3728] text-[16px] text-center w-[65.72px]">
        <p className="leading-[24px]">Register</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(74,55,40,0.6)] text-center w-[174.83px]">
        <p className="leading-[24px]">{`Don't have an account? `}</p>
      </div>
      <Link1 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[11px] relative shrink-0" data-name="Margin">
      <Container22 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[690px] items-center relative shrink-0 w-full" data-name="Container">
      <Margin />
      <Margin1 />
      <Container5 />
      <Margin3 />
      <Container19 />
      <Margin4 />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[927px] min-h-[884px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[11px] items-center justify-center min-h-[inherit] pb-[81px] pt-[28px] px-[16px] relative size-full">
          <Frame />
          <div className="h-[142px] relative rounded-[119px] shrink-0 w-[136px]" data-name="image 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[119px]">
              <img alt="" className="absolute h-[110.82%] left-[-13.97%] max-w-none top-[-11.12%] w-[127.44%]" src={imgImage1} />
            </div>
          </div>
          <Container1 />
        </div>
      </div>
    </div>
  );
}

export default function LoginScreenNewPalette() {
  return (
    <div className="bg-[#fdfaf6] content-stretch flex flex-col items-start relative size-full" data-name="Login Screen (New Palette)">
      <Container />
    </div>
  );
}