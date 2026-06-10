import React from 'react';
import { svgPaths } from '../utils/svgPaths';

// Image imports (will be used in components)
const imgImage = '/images/complete-order.webp';
const similarNewsImage = '/images/similar-news-bg.webp';

// Reused components from NewsPage
function Group() {
  return (
    <div className="absolute inset-[5%_13.95%_5%_15%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 49">
        <g id="Group 1">
          <path clipRule="evenodd" d={svgPaths.p108d200} fill="var(--fill-0, #8F7B49)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.pa388e00} fill="var(--fill-0, #8F7B49)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="overflow-clip relative shrink-0 size-[54px]" data-name="Logo">
      <Group />
    </div>
  );
}

function Nav() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-between left-0 pb-0 pt-[20px] px-[50px] right-0 top-0" data-name="Nav">
      <NavContent />
    </div>
  );
}

function NavContent() {
  return (
    <div className="backdrop-blur-sm backdrop-filter basis-0 bg-[rgba(51,51,51,0.1)] grow max-w-[1680px] min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Nav Content">
      <div className="flex flex-row items-center max-w-inherit size-full">
        <div className="box-border content-stretch flex items-center justify-between max-w-inherit px-[32px] py-[12px] relative w-full">
          <Logo />
          <Frame2 />
          <NavItems />
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-end relative shrink-0">
      <Frame3 />
      <Button />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">РУ</p>
      <Frame />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_687)" id="Frame">
          <g id="Vector"></g>
          <path d={svgPaths.p12c5be40} fill="var(--fill-0, #333333)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_687">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Забронировать</p>
    </div>
  );
}

function NavItems() {
  return (
    <div className="absolute content-stretch flex items-center left-[calc(50%+0.5px)] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Nav Items">
      <NavItem />
      <NavItem1 />
      <NavItem2 />
      <NavItem3 />
      <NavItem4 />
    </div>
  );
}

function NavItem() {
  return (
    <div className="absolute content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">NavItem</p>
    </div>
  );
}

function NavItem1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">NavItem1</p>
    </div>
  );
}

function NavItem2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">NavItem2</p>
    </div>
  );
}

function NavItem3() {
  return (
    <div className="absolute content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">NavItem3</p>
    </div>
  );
}

function NavItem4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">NavItem4</p>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-white bottom-0 h-[663px] left-1/2 translate-x-[-50%] w-[1440px]" data-name="Footer">
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[711px] text-[#333333] text-[35px] text-nowrap top-[94px] tracking-[-0.7px] whitespace-pre">hello@djidali.uz</p>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[50px] text-[#333333] text-[35px] text-nowrap top-[94px] tracking-[-0.7px] whitespace-pre">+998 00 000 00 00</p>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[50px] text-[#333333] text-[20px] text-nowrap top-[60px] tracking-[-0.4px] whitespace-pre">Связаться с нами</p>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[50px] text-[#333333] text-[20px] text-nowrap top-[217px] tracking-[-0.4px] whitespace-pre">Разделы сайта</p>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[1048px] text-[#333333] text-[20px] text-nowrap top-[217px] tracking-[-0.4px] whitespace-pre">Социальные сети</p>
      <SectionsContainer />
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[28px] left-[645px] text-[#767676] text-[16px] text-nowrap top-[595px] tracking-[-0.48px] whitespace-pre"> 2025 DjidaliTravel</p>
      <ScrollToTopButton />
      <ContactInfo />
      <SocialMediaLinks />
    </div>
  );
}

function SectionsContainer() {
  return (
    <div className="absolute content-stretch flex items-start justify-between left-[50px] top-[291px] w-[918px]" data-name="Sections container">
      <AboutSection />
      <TourismTypesSection />
      <OurToursSection />
    </div>
  );
}

function AboutSection() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-start relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">About</p>
    </div>
  );
}

function TourismTypesSection() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-start relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Tourism Types</p>
    </div>
  );
}

function OurToursSection() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-start relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Our Tours</p>
    </div>
  );
}

function SocialMediaLinks() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Montserrat:Medium',sans-serif] font-medium gap-[32px] items-start leading-[normal] left-[1048px] text-[#333333] text-[35px] text-nowrap top-[291px] tracking-[-0.7px] whitespace-pre" data-name="Social media links">
      <p className="relative shrink-0">Facebook</p>
      <p className="relative shrink-0">Instagram</p>
      <p className="relative shrink-0">Linkedin</p>
      <p className="relative shrink-0">Twitter</p>
    </div>
  );
}

function SimilarNewsBackground() {
  return (
    <div className="absolute flex h-[540px] items-center justify-center left-0 top-[100px] w-[655px]">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <div className="h-[540px] relative rounded-[20px] w-[655px] bg-[#8f7b49] overflow-hidden">
          <img alt="" className="absolute inset-0 object-cover size-full" src={similarNewsImage} />
          <div className="absolute bg-[rgba(0,0,0,0.3)] inset-0 rounded-[20px]" />
          <p className="absolute font-['Montserrat:Medium'] font-medium left-[40px] text-white top-[140px]">
            Путешествовать
          </p>
          <p className="absolute font-['Montserrat:Regular'] font-normal left-[40px] text-white top-[480px] text-[45px] leading-[60px]">
            Мы поможем вам<br />найти свою мечту
          </p>
        </div>
      </div>
    </div>
  );
}

function ScrollToTopButton() {
  return (
    <div className="absolute content-stretch flex items-center justify-center right-[50px] bottom-[50px]" data-name="Scroll To Top Button">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Scroll To Top</p>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start justify-start left-[1048px] top-[400px]" data-name="Contact Info">
      <Contact />
      <Contact1 />
      <Contact2 />
      <Contact3 />
      <Contact4 />
    </div>
  );
}

function Contact() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Contact</p>
    </div>
  );
}

function Contact1() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Contact1</p>
    </div>
  );
}

function Contact2() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Contact2</p>
    </div>
  );
}

function Contact3() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Contact3</p>
    </div>
  );
}

function Contact4() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Contact4</p>
    </div>
  );
}

function CardTour() {
  return (
    <div className="absolute bg-white h-[1054px] left-[50px] rounded-[20px] top-[178px] w-[1340px]" data-name="Card Tour">
      <ImageContainer />
      <TitleContainer />
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[30px] left-[40px] text-[#333333] text-[24px] text-nowrap top-[650px] tracking-[-0.48px] whitespace-pre">Стоимость тура</p>
      <Frame12 />
      <CheckinInfo />
      <Frame19 />
      <TextComponent />
      <BookButton />
    </div>
  );
}

function ImageContainer() {
  return (
    <div className="absolute contents left-[725px] top-[40px]" data-name="Image Container">
      <div className="absolute h-[974px] left-[725px] rounded-[20px] top-[40px] w-[575px]" data-name="Image">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[20px]">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[20px] size-full" src={imgImage} />
          <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[20px]" />
        </div>
      </div>
      <ImageType />
    </div>
  );
}

function ImageType() {
  return (
    <div className="absolute content-stretch flex items-center justify-center right-[40px] top-[40px]" data-name="Image Type">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">ImageType</p>
    </div>
  );
}

function TitleContainer() {
  return (
    <div className="absolute h-[100px] left-[40px] top-[500px] w-[400px]" data-name="Title Container">
      <Title />
    </div>
  );
}

function Title() {
  return (
    <div className="absolute content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Title</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute h-[50px] left-[40px] top-[700px] w-[200px]" data-name="Frame 12">
      <Frame120 />
    </div>
  );
}

function Frame120() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Frame120</p>
    </div>
  );
}

function CheckinInfo() {
  return (
    <div className="absolute h-[50px] left-[40px] top-[800px] w-[200px]" data-name="Checkin Info">
      <CheckinInfo0 />
    </div>
  );
}

function CheckinInfo0() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">CheckinInfo0</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute h-[50px] left-[40px] top-[900px] w-[200px]" data-name="Frame 19">
      <Frame190 />
    </div>
  );
}

function Frame190() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Frame190</p>
    </div>
  );
}

function TextComponent() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[16px] items-start justify-center left-[40px] pb-[20px] pt-0 px-0 top-[40px] w-[575px]" data-name="text">
      <div aria-hidden="true" className="absolute border-[#ebebeb] border-[0px_0px_2px] border-solid inset-0 pointer-events-none" />
      <p className="font-['DM_Sans:Bold',sans-serif] font-bold leading-[60px] relative shrink-0 text-[60px] text-[silver] tracking-[-1.2px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        
      </p>
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[24px] text-[silver] tracking-[-0.48px] w-full">!</p>
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[40px] relative shrink-0 text-[#333333] text-[32px] tracking-[-0.64px] w-full">,  ,  .</p>
    </div>
  );
}

function BookButton() {
  return (
    <div className="absolute h-[50px] left-[40px] top-[1100px] w-[200px]" data-name="Book Button">
      <BookButton0 />
    </div>
  );
}

function BookButton0() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">BookButton0</p>
    </div>
  );
}

// Main component
export default function CompleteOrderPage() {
  return (
    <div className="bg-[#f4f2ed] relative size-full" data-name="Complete">
      <Nav />
      <Footer />
      <CardTour />
      <SimilarNewsBackground />
    </div>
  );
}
