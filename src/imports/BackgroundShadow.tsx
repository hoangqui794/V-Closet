import svgPaths from "./svg-qmpue4vmel";
import img3DStylishMannequinModel from "@/assets/ea4d5ffbd427a301810b61408ec986172abd2cde.png";
import imgOrganicCottonTShirt from "@/assets/9c9b988782b56498d8e7beb615f90a34c8ef1f67.png";
import imgDenimShorts from "@/assets/d57baeac03342025bc2bedb9a0a901349ff9039a.png";
import imgOrganicTee from "@/assets/b80ef58802fb5301ad07563a92bfc142b3d8419e.png";
import imgBeigeJacket from "@/assets/a9426fd437c4c217d8b03a3ca79bd9563d34c3f1.png";

function Container1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p300a1100} fill="var(--fill-0, #3B2D22)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="relative shrink-0" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Manrope:Extra_Bold',sans-serif] h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b2d22] text-[18px] tracking-[-0.45px] uppercase w-[130.58px]">
          <p className="leading-[28px]">Phòng Thử Đồ</p>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
        <g id="Container">
          <path d={svgPaths.p2b729200} fill="var(--fill-0, #3B2D22)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container3 />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-end relative size-full">
        <Button />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(253,250,247,0.8)] relative shrink-0 w-full z-[3]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[rgba(214,204,194,0.3)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[17px] pl-[16px] pr-[16.02px] pt-[16px] relative w-full">
          <Container />
          <Heading />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Component3DStylishMannequinModel() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px mix-blend-multiply opacity-90 relative" data-name="3D Stylish Mannequin Model">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-full left-[-16.67%] max-w-none top-0 w-[133.33%]" src={img3DStylishMannequinModel} />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[7.583px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 7.58333">
        <g id="Container">
          <path d={svgPaths.p23c13860} fill="var(--fill-0, #3B2D22)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
      <Container5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.pfda3580} fill="var(--fill-0, #3B2D22)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
      <Container6 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bottom-[16px] content-stretch flex flex-col gap-[8px] items-start right-[16px]" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

function VirtualMannequinViewport() {
  return (
    <div className="aspect-[3/4] bg-gradient-to-b content-stretch flex from-[#f5ebe0] items-center justify-center overflow-clip relative rounded-[19.2px] shrink-0 to-[#e3d5ca]" data-name="Virtual Mannequin Viewport">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Component3DStylishMannequinModel />
      </div>
      <Container4 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Extra_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b2d22] text-[14px] tracking-[1.4px] uppercase w-[173.41px]">
        <p className="leading-[20px]">Tùy Chỉnh Nhân Vật</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#3b2d22] h-[4px] rounded-[9999px] shrink-0 w-[32px]" data-name="Background" />
      <Heading1 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-[rgba(59,45,34,0.6)] tracking-[0.6px] uppercase w-full">
        <p className="leading-[16px]">Dáng người</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#3b2d22] content-stretch flex flex-col items-center justify-center left-0 pb-[9.5px] pt-[8.5px] px-[16px] rounded-[9999px] top-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[9999px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
      <div className="flex flex-col font-['Manrope:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#f5ebe0] text-[14px] text-center w-[50.38px]">
        <p className="leading-[20px]">Cân đối</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#e3d5ca] content-stretch flex flex-col items-center justify-center left-[90.38px] px-[17px] py-[9px] rounded-[9999px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d6ccc2] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-col font-['Manrope:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b2d22] text-[14px] text-center w-[41.81px]">
        <p className="leading-[20px]">Quả lê</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#e3d5ca] content-stretch flex flex-col items-center justify-center left-[174.19px] px-[17px] py-[9px] rounded-[9999px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d6ccc2] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-col font-['Manrope:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b2d22] text-[14px] text-center w-[79.81px]">
        <p className="leading-[20px]">Đồng hồ cát</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[#e3d5ca] content-stretch flex flex-col items-center justify-center left-[296px] px-[17px] py-[9px] rounded-[9999px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d6ccc2] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-col font-['Manrope:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b2d22] text-[14px] text-center w-[53.22px]">
        <p className="leading-[20px]">Đầy đặn</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[#e3d5ca] content-stretch flex flex-col items-center justify-center left-[391.22px] px-[17px] py-[9px] rounded-[9999px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d6ccc2] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-col font-['Manrope:Semi_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b2d22] text-[14px] text-center w-[81.05px]">
        <p className="leading-[20px]">Mảnh khảnh</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[46px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function BodyShapeSelection() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Body Shape Selection">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[12px] text-[rgba(59,45,34,0.6)] tracking-[0.6px] uppercase w-[117.7px]">
        <p className="leading-[16px]">Kích cỡ áo (Size)</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[15px] justify-center leading-[0] relative shrink-0 text-[10px] text-[rgba(59,45,34,0.5)] w-[161.69px]">
        <p className="leading-[15px]">{`(cân nặng: <45kg, chiều cao < 1m5)`}</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#3b2d22] content-stretch flex flex-col items-center justify-center pl-[50.39px] pr-[50.41px] py-[13px] relative rounded-[12.8px] shrink-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[12.8px] shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#3b2d22]" data-name="Button:shadow" />
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white w-[10.53px]">
        <p className="leading-[24px]">S</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center pl-[48.81px] pr-[48.83px] py-[13px] relative rounded-[12.8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d6ccc2] border-solid inset-0 pointer-events-none rounded-[12.8px]" />
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#3b2d22] text-[16px] text-center w-[13.69px]">
        <p className="leading-[24px]">M</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center pl-[51.39px] pr-[51.4px] py-[13px] relative rounded-[12.8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d6ccc2] border-solid inset-0 pointer-events-none rounded-[12.8px]" />
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#3b2d22] text-[16px] text-center w-[8.55px]">
        <p className="leading-[24px]">L</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <Button8 />
      <Button9 />
      <Button10 />
    </div>
  );
}

function SizeSelection() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start pt-[8px] relative shrink-0 w-full" data-name="Size Selection">
      <Container10 />
      <Container13 />
    </div>
  );
}

function CustomizationSection() {
  return (
    <div className="relative shrink-0 w-full" data-name="Customization Section">
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-[48px] pt-[24px] px-[16px] relative w-full">
        <Container7 />
        <BodyShapeSelection />
        <SizeSelection />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Extra_Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b2d22] text-[14px] tracking-[1.4px] uppercase w-[171.47px]">
        <p className="leading-[20px]">Sản phẩm đang thử</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative w-full">
        <div className="bg-[#3b2d22] h-[4px] rounded-[9999px] shrink-0 w-[32px]" data-name="Background" />
        <Heading2 />
      </div>
    </div>
  );
}

function OrganicCottonTShirt() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Organic Cotton T-Shirt">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgOrganicCottonTShirt} />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#e3d5ca] relative rounded-[12.8px] shrink-0 size-[80px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <OrganicCottonTShirt />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[24px] relative shrink-0 text-[#3b2d22] text-[16px] w-full">
        <p className="mb-0">Áo Thun Cotton</p>
        <p>Organic</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(59,45,34,0.7)] w-full">
        <p className="leading-[20px]">250.000đ</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex gap-[4px] items-start pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-white relative rounded-[9999px] shrink-0 size-[12px]" data-name="Background+Border">
        <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      </div>
      <div className="bg-[#3b2d22] rounded-[9999px] shrink-0 size-[12px]" data-name="Background" />
      <div className="bg-[#d5bdaf] rounded-[9999px] shrink-0 size-[12px]" data-name="Background" />
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Heading3 />
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[20px] relative shrink-0 w-[19.982px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9815 20">
        <g id="Container">
          <path d={svgPaths.pb5c2400} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-[#3b2d22] relative rounded-[12.8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[8px] relative">
        <Container18 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white relative rounded-[19.2px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[rgba(214,204,194,0.3)] border-solid inset-0 pointer-events-none rounded-[19.2px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center p-[17px] relative w-full">
          <Background />
          <Container15 />
          <Button11 />
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p3faf9100} fill="var(--fill-0, #F5EBE0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#3b2d22] relative rounded-[19.2px] shrink-0 w-full" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center py-[16px] relative w-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[19.2px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
        <Container19 />
        <div className="flex flex-col font-['Manrope:Extra_Bold',sans-serif] h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#f5ebe0] text-[16px] text-center tracking-[1.6px] uppercase w-[171.7px]">
          <p className="leading-[24px]">Mua trên Shopee</p>
        </div>
      </div>
    </div>
  );
}

function CurrentItemSection() {
  return (
    <div className="bg-[rgba(245,235,224,0.4)] relative shrink-0 w-full" data-name="Current Item Section">
      <div aria-hidden="true" className="absolute border-[#e3d5ca] border-b border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-[17px] pt-px px-[16px] relative w-full">
        <Container14 />
        <BackgroundBorderShadow />
        <Button12 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Extra_Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b2d22] text-[10px] tracking-[1px] uppercase w-[131.33px]">
        <p className="leading-[15px]">Kéo và thả để thử đồ</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[8.333px] relative shrink-0 w-[4.906px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.90625 8.33333">
        <g id="Container">
          <path d={svgPaths.p1f369980} fill="var(--fill-0, #3B2D22)" fillOpacity="0.4" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[15px] justify-center leading-[0] relative shrink-0 text-[10px] text-[rgba(59,45,34,0.4)] w-[48.7px]">
        <p className="leading-[15px]">Xem tất cả</p>
      </div>
      <Container22 />
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative w-full">
          <Heading4 />
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 17.5">
        <g id="Container">
          <path d={svgPaths.p2f5d9c00} fill="var(--fill-0, #D5BDAF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(245,235,224,0.2)] content-stretch flex items-center justify-center px-[2px] py-[38px] relative rounded-[16px] shrink-0 w-full" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border-2 border-[#d5bdaf] border-dashed inset-0 pointer-events-none rounded-[16px]" />
      <Container24 />
    </div>
  );
}

function AddItem() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[8px] items-center left-[16px] top-0 w-[112px]" data-name="Add Item">
      <OverlayBorder />
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[10px] text-[rgba(59,45,34,0.6)] text-center w-[41.53px]">
        <p className="leading-[15px]">Thêm đồ</p>
      </div>
    </div>
  );
}

function DenimShorts() {
  return (
    <div className="h-[94px] relative shrink-0 w-full" data-name="Denim Shorts">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgDenimShorts} />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[22px] relative shrink-0 w-[19.8px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.8 22">
        <g id="Container">
          <path d={svgPaths.p31f1e80} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="absolute bg-[rgba(59,45,34,0.1)] inset-px opacity-0 rounded-[16px]" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container25 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[rgba(214,204,194,0.4)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[9px] relative w-full">
          <DenimShorts />
          <Overlay />
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#3b2d22] text-[10px] text-center w-[88.03px]">
        <p className="leading-[15px]">Quần Short Denim</p>
      </div>
    </div>
  );
}

function Item() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[8px] items-center left-[144px] top-0 w-[112px]" data-name="Item 1">
      <BackgroundBorderShadow1 />
      <Container26 />
    </div>
  );
}

function OrganicTee() {
  return (
    <div className="h-[94px] relative shrink-0 w-full" data-name="Organic Tee">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgOrganicTee} />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[22px] relative shrink-0 w-[19.8px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.8 22">
        <g id="Container">
          <path d={svgPaths.p31f1e80} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="absolute bg-[rgba(59,45,34,0.1)] inset-px opacity-0 rounded-[16px]" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container27 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[rgba(214,204,194,0.4)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[9px] relative w-full">
          <OrganicTee />
          <Overlay1 />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#3b2d22] text-[10px] text-center w-[79.75px]">
        <p className="leading-[15px]">Áo Thun Organic</p>
      </div>
    </div>
  );
}

function Item1() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[8px] items-center left-[272px] top-0 w-[112px]" data-name="Item 2">
      <BackgroundBorderShadow2 />
      <Container28 />
    </div>
  );
}

function BeigeJacket() {
  return (
    <div className="h-[94px] relative shrink-0 w-full" data-name="Beige Jacket">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBeigeJacket} />
      </div>
    </div>
  );
}

function BackgroundBorderShadow3() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[rgba(214,204,194,0.4)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[9px] relative w-full">
          <BeigeJacket />
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#3b2d22] text-[10px] text-center w-[66.77px]">
        <p className="leading-[15px]">Áo Khoác Nhẹ</p>
      </div>
    </div>
  );
}

function Item2() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[8px] items-center left-[400px] top-0 w-[112px]" data-name="Item 3">
      <BackgroundBorderShadow3 />
      <Container29 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[135px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <AddItem />
      <Item />
      <Item1 />
      <Item2 />
    </div>
  );
}

function SectionDragDropSlider() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip pb-[24px] pt-[8px] relative shrink-0 w-full" data-name="Section - Drag & Drop Slider">
      <Container20 />
      <Container23 />
    </div>
  );
}

function Main() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center overflow-clip pb-[10px] pt-[16px] relative shrink-0 w-full z-[2]" data-name="Main">
      <VirtualMannequinViewport />
      <CustomizationSection />
      <CurrentItemSection />
      <SectionDragDropSlider />
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

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Group2 />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Container">
      <Container31 />
    </div>
  );
}

function Container32() {
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
        <Container30 />
        <Container32 />
      </div>
    </div>
  );
}

function Container34() {
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

function Container33() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Container">
      <Container34 />
    </div>
  );
}

function Container35() {
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
        <Container33 />
        <Container35 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Container">
          <path d={svgPaths.p6da5600} fill="var(--fill-0, #8B7355)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container38 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Container">
      <Container37 />
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[18px] justify-center leading-[0] relative shrink-0 text-[#8b7355] text-[12px] tracking-[0.3px] w-[57px]">
        <p className="leading-[18px]">Chụp ảnh</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center justify-end relative size-full">
        <Container36 />
        <Container39 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Container">
          <path d={svgPaths.p11c2d500} fill="var(--fill-0, #4A3728)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Container">
      <Container41 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[83px]" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[18px] justify-center leading-[0] relative shrink-0 text-[#4a3728] text-[12px] text-center tracking-[0.3px] w-[83px]">
        <p className="leading-[18px]">Phối đồ</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center justify-end relative size-full">
        <Container40 />
        <Container42 />
      </div>
    </div>
  );
}

function Container44() {
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

function Container43() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center relative shrink-0" data-name="Container">
      <Container44 />
    </div>
  );
}

function Container45() {
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
        <Container43 />
        <Container45 />
      </div>
    </div>
  );
}

function BottomNavigationBar() {
  return (
    <div className="bg-[#fdfaf6] content-stretch flex gap-[8px] h-[96px] items-start justify-center pb-[25px] pt-px px-[16px] relative shrink-0 w-[390px] z-[1]" data-name="Bottom Navigation Bar">
      <div aria-hidden="true" className="absolute border-[rgba(74,55,40,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
      <Link4 />
    </div>
  );
}

export default function BackgroundShadow() {
  return (
    <div className="bg-[#fdfaf7] content-stretch flex flex-col isolate items-start relative shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] size-full" data-name="Background+Shadow">
      <Header />
      <Main />
      <BottomNavigationBar />
    </div>
  );
}