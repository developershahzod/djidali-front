import { useNavigate } from 'react-router-dom';
import { svgPaths } from '../utils/svgPaths';

// Import images
const tourImage = '/images/tour-complete.jpg';

// Navigation Components
function Group() {
  return (
    <div className="absolute inset-[5%_13.95%_5%_15%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 49">
        <g>
          <path clipRule="evenodd" d={svgPaths.p108d200} fill="#8F7B49" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.pa388e00} fill="#8F7B49" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="overflow-clip relative shrink-0 size-[54px]">
      <Group />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_687)">
          <path d={svgPaths.p12c5be40} fill="#333333" />
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

function Frame3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">РУ</p>
      <Frame />
    </div>
  );
}

function Button() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Забронировать</p>
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

function NavItem({ label }: { label: string }) {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">{label}</p>
    </div>
  );
}

function NavItems() {
  return (
    <div className="absolute content-stretch flex items-center left-[calc(50%+0.5px)] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <NavItem label="О нас" />
      <NavItem label="Виды туризма" />
      <NavItem label="Наши туры" />
      <NavItem label="Новости" />
      <NavItem label="Контакты" />
    </div>
  );
}

function NavContent() {
  return (
    <div className="backdrop-blur-sm backdrop-filter basis-0 bg-[rgba(51,51,51,0.1)] grow max-w-[1680px] min-h-px min-w-px relative rounded-[16px] shrink-0">
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

function Nav() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-between left-0 pb-0 pt-[20px] px-[50px] right-0 top-0">
      <NavContent />
    </div>
  );
}

// Footer Components
function AboutLinks() {
  return (
    <div className="content-stretch flex flex-col font-['Montserrat:Medium',sans-serif] font-medium gap-[8px] items-start leading-[28px] relative shrink-0 text-[#767676] text-[16px] text-nowrap tracking-[-0.48px] whitespace-pre">
      <p className="relative shrink-0">Почему мы</p>
      <p className="relative shrink-0">Интересное</p>
      <p className="relative shrink-0">Команда</p>
      <p className="relative shrink-0">Галерея</p>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[257px]">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] min-w-full relative shrink-0 text-[#333333] text-[35px] tracking-[-0.7px] w-[min-content]">О нас</p>
      <AboutLinks />
    </div>
  );
}

function TourismTypesLinks() {
  return (
    <div className="content-stretch flex flex-col font-['Montserrat:Medium',sans-serif] font-medium gap-[8px] items-start leading-[28px] relative shrink-0 text-[#767676] text-[16px] text-nowrap tracking-[-0.48px] whitespace-pre">
      <p className="relative shrink-0">Экотуризм</p>
      <p className="relative shrink-0">Агротуризм</p>
      <p className="relative shrink-0">Тимбилдинг</p>
      <p className="relative shrink-0">Спортивная стрельба</p>
    </div>
  );
}

function TourismTypesSection() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[257px]">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] min-w-full relative shrink-0 text-[#333333] text-[35px] tracking-[-0.7px] w-[min-content]">Виды туризма</p>
      <TourismTypesLinks />
    </div>
  );
}

function OurToursLinks() {
  return (
    <div className="content-stretch flex flex-col font-['Montserrat:Medium',sans-serif] font-medium gap-[8px] items-start leading-[28px] relative shrink-0 text-[#767676] text-[16px] text-nowrap tracking-[-0.48px] whitespace-pre">
      <p className="relative shrink-0">Индивидуальные туры</p>
      <p className="relative shrink-0">Групповые туры</p>
      <p className="relative shrink-0">Семейные туры</p>
      <p className="relative shrink-0">Корпоративные туры</p>
    </div>
  );
}

function OurToursSection() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[257px]">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#333333] text-[35px] text-nowrap tracking-[-0.7px] whitespace-pre">Наши туры</p>
      <OurToursLinks />
    </div>
  );
}

function SectionsContainer() {
  return (
    <div className="absolute content-stretch flex items-start justify-between left-[50px] top-[291px] w-[918px]">
      <AboutSection />
      <TourismTypesSection />
      <OurToursSection />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g clipPath="url(#clip0_1_226)">
          <path d={svgPaths.pa25b5b0} fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_1_226">
            <rect fill="white" height="32" width="32" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ScrollToTopButton() {
  return (
    <div className="absolute bg-[#8f7b49] box-border content-stretch flex gap-[10px] items-center left-[1305px] p-[24px] rounded-[40px] size-[80px] top-[543px]">
      <Frame1 />
    </div>
  );
}

function ArrowIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g clipPath="url(#clip0_1_220)">
          <path d={svgPaths.p1dbe4b80} fill="#333333" />
        </g>
        <defs>
          <clipPath id="clip0_1_220">
            <rect fill="white" height="32" width="32" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="absolute content-stretch flex gap-[20px] items-center left-[50px] top-[520px]">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#333333] text-[35px] text-nowrap tracking-[-0.7px] whitespace-pre">Наши контакты</p>
      <ArrowIcon />
    </div>
  );
}

function SocialMediaLinks() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Montserrat:Medium',sans-serif] font-medium gap-[32px] items-start leading-[normal] left-[1048px] text-[#333333] text-[35px] text-nowrap top-[291px] tracking-[-0.7px] whitespace-pre">
      <p className="relative shrink-0">Facebook</p>
      <p className="relative shrink-0">Instagram</p>
      <p className="relative shrink-0">Linkedin</p>
      <p className="relative shrink-0">Twitter</p>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-white bottom-0 h-[663px] left-1/2 translate-x-[-50%] w-[1440px]">
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[711px] text-[#333333] text-[35px] text-nowrap top-[94px] tracking-[-0.7px] whitespace-pre">hello@djidali.uz</p>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[50px] text-[#333333] text-[35px] text-nowrap top-[94px] tracking-[-0.7px] whitespace-pre">+998(94)470-88-44</p>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[50px] text-[#333333] text-[20px] text-nowrap top-[60px] tracking-[-0.4px] whitespace-pre">Связаться с нами</p>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[50px] text-[#333333] text-[20px] text-nowrap top-[217px] tracking-[-0.4px] whitespace-pre">Разделы сайта</p>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[1048px] text-[#333333] text-[20px] text-nowrap top-[217px] tracking-[-0.4px] whitespace-pre">Социальные сети</p>
      <SectionsContainer />
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[28px] left-[645px] text-[#767676] text-[16px] text-nowrap top-[595px] tracking-[-0.48px] whitespace-pre">© 2025 DjidaliTravel</p>
      <ScrollToTopButton />
      <ContactInfo />
      <SocialMediaLinks />
    </div>
  );
}

// Complete Page Component
export default function CompletePage() {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="bg-[#f4f2ed] relative min-h-screen">
      <Nav />
      
      {/* Card Tour */}
      <div className="absolute bg-white h-[1054px] left-[50px] rounded-[20px] top-[178px] w-[1340px]">
        {/* Image Container */}
        <div className="absolute left-[725px] top-[40px]">
          <div className="h-[974px] rounded-[20px] w-[575px] relative">
            <img alt="Tour" className="absolute inset-0 object-cover rounded-[20px] size-full" src={tourImage} />
            <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[20px]" />
          </div>
          {/* Image Type Badge */}
          <div className="absolute bg-white bottom-[60px] box-border content-stretch flex gap-[10px] h-[22.288px] items-center justify-end px-[6px] py-[2px] right-[60px] rounded-[16px]">
            <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[16px] text-nowrap text-right tracking-[-0.32px] whitespace-pre">Экотуризм</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="absolute box-border content-stretch flex flex-col gap-[16px] items-start justify-center left-[40px] pb-[20px] pt-0 px-0 top-[40px] w-[575px]">
          <div aria-hidden="true" className="absolute border-[#ebebeb] border-[0px_0px_2px] border-solid inset-0 pointer-events-none" />
          <p className="font-['DM_Sans:Bold',sans-serif] font-bold leading-[60px] relative shrink-0 text-[60px] text-[silver] tracking-[-1.2px] w-full">
            🎉
          </p>
          <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[30px] relative shrink-0 text-[24px] text-[silver] tracking-[-0.48px] w-full">Спасибо!</p>
          <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[40px] relative shrink-0 text-[#333333] text-[32px] tracking-[-0.64px] w-full">
            Ваша заявка принята, и мы уже готовим для вас путешествие.
          </p>
        </div>

        {/* Title Container */}
        <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[40px] text-[#333333] top-[322px] w-[575px]">
          <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[40px] relative shrink-0 text-[32px] tracking-[-0.64px] w-full">
            Дальвер Экспедиция в Чаткальский заповедник
          </p>
          <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[20px] tracking-[-0.4px] w-full">
            Ташкентская область, Бекабадский район, Дальверзин
          </p>
        </div>

        {/* Checkin Info */}
        <div className="absolute bg-[rgba(235,235,235,0.4)] box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[40px] px-0 py-[8px] rounded-[16px] top-[466px] w-[575px]">
          {/* Dates */}
          <div className="content-stretch flex gap-[20px] items-center relative shrink-0 w-full px-4">
            <div className="basis-0 grow">
              <div className="box-border flex gap-[12px] items-start p-[12px]">
                <svg className="w-6 h-6" fill="#CBC2AB" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                </svg>
                <div className="flex flex-col gap-[6px] grow">
                  <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#767676] text-[14px]">Дата начала</p>
                  <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[20px] tracking-[-0.4px]">15 Сен, 2025</p>
                </div>
              </div>
            </div>
            <div className="bg-[#dcd6c7] h-[40px] w-px"></div>
            <div className="basis-0 grow">
              <div className="box-border flex gap-[12px] items-start p-[12px]">
                <svg className="w-6 h-6" fill="#CBC2AB" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                </svg>
                <div className="flex flex-col gap-[6px] grow">
                  <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#767676] text-[14px]">Дата окончания</p>
                  <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[20px] tracking-[-0.4px]">20 Сен, 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Participants and Price */}
          <div className="content-stretch flex gap-[20px] items-center relative shrink-0 w-full px-4">
            <div className="basis-0 grow">
              <div className="box-border flex gap-[12px] items-start p-[12px]">
                <svg className="w-6 h-6" fill="#CBC2AB" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <div className="flex flex-col gap-[6px] grow">
                  <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#767676] text-[14px]">Участники</p>
                  <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[20px] tracking-[-0.4px]">5</p>
                </div>
              </div>
            </div>
            <div className="bg-[#dcd6c7] h-[40px] w-px"></div>
            <div className="basis-0 grow">
              <div className="box-border flex gap-[12px] items-start p-[12px]">
                <svg className="w-6 h-6" fill="#CBC2AB" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
                <div className="flex flex-col gap-[6px] grow">
                  <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#767676] text-[14px]">Цена на человека</p>
                  <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[20px] tracking-[-0.4px]">350 000 UZS</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[30px] left-[40px] text-[#333333] text-[24px] text-nowrap top-[650px] tracking-[-0.48px] whitespace-pre">
          Стоимость тура
        </p>

        <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[40px] top-[700px] w-[575px]">
          <div className="content-stretch flex font-['Montserrat:Medium',sans-serif] font-medium items-end justify-between w-full">
            <div className="flex gap-[4px] text-[#767676] text-[16px] tracking-[-0.32px]">
              <span>350 000</span>
              <span>x</span>
              <span>3 ночи</span>
            </div>
            <p className="text-[#333333] text-[20px] tracking-[-0.4px]">1 050 000 UZS</p>
          </div>
          <div className="content-stretch flex font-['Montserrat:Medium',sans-serif] font-medium items-end justify-between w-full">
            <p className="text-[#767676] text-[16px] tracking-[-0.32px]">Скидка 10% по акции</p>
            <p className="text-[#333333] text-[20px] tracking-[-0.4px]">150 000 UZS</p>
          </div>
          <div className="content-stretch flex font-['Montserrat:Medium',sans-serif] font-medium items-end justify-between w-full">
            <p className="text-[#767676] text-[16px] tracking-[-0.32px]">Плата за обслуживание</p>
            <p className="text-[#333333] text-[20px] tracking-[-0.4px]">200 000 UZS</p>
          </div>
        </div>

        {/* Total */}
        <div className="absolute content-stretch flex font-['Montserrat:Medium',sans-serif] font-medium items-end justify-between left-[40px] top-[836px] w-[575px]">
          <p className="text-[#767676] text-[20px] tracking-[-0.4px]">Итого</p>
          <p className="text-[#827042] text-[28px] text-right tracking-[-0.56px] leading-[38px]">1 100 000 UZS</p>
        </div>

        {/* Return Button */}
        <button
          onClick={handleReturnHome}
          className="absolute bg-[#8f7b49] hover:bg-[#7a6839] box-border flex gap-[10px] h-[80px] items-center justify-center left-[40px] px-[56px] py-[30px] rounded-[10px] top-[934px] w-[575px] transition-colors cursor-pointer"
        >
          <p className="font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] text-[20px] text-center text-white tracking-[-0.4px]">
            Вернуться на главное меню
          </p>
        </button>
      </div>

      <Footer />
    </div>
  );
}
