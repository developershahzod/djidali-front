import { useParams, useNavigate, Link } from "react-router-dom";
import { getLocalizedNewsData } from "./NewsPage";
import { svgPaths } from "../utils/svgPaths";
import { useLanguage } from "../contexts/LanguageContext";

// Import images
const topImage = "/94eadad3f522e8bdfb19c56bb585ddeaf0e637a3.webp";
const bottomLeftImage = "/2b6a963dd74a6d1123449922b8611661d321728f.webp";
const bottomRightImage = "/8d906978fc716fe472c5b52bc4524b8e62b9bf38.webp";
const similarNewsImage = "/fcd4ea8bf176e4851a46f14de3020f62faed656d (1).webp";

// Navigation Components (reused from NewsPage)
function Group() {
  return (
    <div className="absolute inset-[5%_13.95%_5%_15%]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 39 49"
      >
        <g>
          <path
            clipRule="evenodd"
            d={svgPaths.p108d200}
            fill="white"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d={svgPaths.pa388e00}
            fill="white"
            fillRule="evenodd"
          />
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
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g clipPath="url(#clip0_1_216)">
          <path d={svgPaths.p12c5be40} fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_1_216">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[14px] text-nowrap text-white uppercase whitespace-pre">
        РУ
      </p>
      <Frame />
    </div>
  );
}

function Button() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[100px]"
      />
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[14px] text-nowrap text-white uppercase whitespace-pre">
        Забронировать
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-end relative shrink-0">
      <Frame5 />
      <Button />
    </div>
  );
}

function NavItem({
  label,
  isActive = false,
}: {
  label: string;
  isActive?: boolean;
}) {
  return (
    <div
      className={`box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0 ${isActive ? "bg-[rgba(255,255,255,0.4)]" : ""}`}
    >
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[14px] text-nowrap text-white uppercase whitespace-pre">
        {label}
      </p>
    </div>
  );
}

function NavItems() {
  return (
    <div className="absolute content-stretch flex items-center left-[calc(50%+0.5px)] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <NavItem label="О нас" />
      <NavItem label="Виды туризма" />
      <NavItem label="Наши туры" />
      <NavItem label="Новости" isActive />
      <NavItem label="Контакты" />
    </div>
  );
}

function NavContent() {
  return (
    <div className="backdrop-blur-sm backdrop-filter basis-0 bg-[rgba(255,255,255,0.1)] grow max-w-[1680px] min-h-px min-w-px relative rounded-[16px] shrink-0">
      <div className="flex flex-row items-center max-w-inherit size-full">
        <div className="box-border content-stretch flex items-center justify-between max-w-inherit px-[32px] py-[12px] relative w-full">
          <Logo />
          <Frame4 />
          <NavItems />
        </div>
      </div>
    </div>
  );
}

function _Nav() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-between left-0 pb-0 pt-[20px] px-[20px] md:px-[50px] right-0 top-0">
      <NavContent />
    </div>
  );
}

// Hero Section with Back Button
interface HeroSectionProps {
  title: string;
  backgroundImage: string;
  onBack: () => void;
}

function HeroSection({ title, backgroundImage, onBack }: HeroSectionProps) {
  const { translate } = useLanguage();

  return (
    <div className="relative h-[400px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <img
          alt=""
          className="absolute object-cover size-full"
          src={backgroundImage}
        />
        <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute left-[20px] md:left-[50px] top-[100px] md:top-[138px] z-20 flex items-center gap-[8px] text-white hover:text-white/80 transition-colors group"
      >
        <div className="flex items-center justify-center size-[24px]">
          <svg
            className="block size-full rotate-90"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[16px] md:text-[20px] tracking-[-0.4px]">
          {translate({ ru: "Назад", uz: "Orqaga", en: "Back", de: "Zurück" })}
        </p>
      </button>

      {/* Title */}
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[40px] md:leading-[60px] lg:leading-[100px] left-[20px] md:left-[50px] right-[20px] md:right-auto text-[32px] md:text-[60px] lg:text-[90px] text-white top-[200px] md:top-[350px] lg:top-[450px] tracking-[-1.2px] md:tracking-[-2px] lg:tracking-[-2.7px] max-w-[calc(100%-40px)] md:w-[900px] lg:w-[1340px]">
        {title}
      </p>

      {/* Decorative line */}
      <div className="hidden md:block absolute h-0 left-[80px] md:left-[120px] top-[550px] md:top-[617px] w-[60px] md:w-[100px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-6px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 100 6"
          >
            <line stroke="white" strokeWidth="6" x2="100" y1="3" y2="3" />
          </svg>
        </div>
      </div>
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
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] min-w-full relative shrink-0 text-[#333333] text-[35px] tracking-[-0.7px] w-[min-content]">
        О нас
      </p>
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
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] min-w-full relative shrink-0 text-[#333333] text-[35px] tracking-[-0.7px] w-[min-content]">
        Виды туризма
      </p>
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
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#333333] text-[35px] text-nowrap tracking-[-0.7px] whitespace-pre">
        Наши туры
      </p>
      <OurToursLinks />
    </div>
  );
}

function ArrowIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
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

function _Footer() {
  return (
    <footer className="bg-white w-full py-16 px-[50px] mt-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Contact Section */}
        <div className="mb-16">
          <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[20px] tracking-[-0.4px] mb-8">
            Связаться с нами
          </p>
          <div className="flex gap-16">
            <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[35px] tracking-[-0.7px]">
              +998(94)470-88-44
            </p>
            <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[35px] tracking-[-0.7px]">
              hello@djidali.uz
            </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-4 gap-8 mb-16">
          <div>
            <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[20px] tracking-[-0.4px] mb-6">
              Разделы сайта
            </p>
            <AboutSection />
          </div>
          <div>
            <TourismTypesSection />
          </div>
          <div>
            <OurToursSection />
          </div>
          <div>
            <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[20px] tracking-[-0.4px] mb-6">
              Социальные сети
            </p>
            <div className="flex flex-col gap-8 text-[#333333] text-[35px] tracking-[-0.7px]">
              <p className="font-['Montserrat:Medium',sans-serif] font-medium">
                Facebook
              </p>
              <p className="font-['Montserrat:Medium',sans-serif] font-medium">
                Instagram
              </p>
              <p className="font-['Montserrat:Medium',sans-serif] font-medium">
                Linkedin
              </p>
              <p className="font-['Montserrat:Medium',sans-serif] font-medium">
                Twitter
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center pt-8 border-t border-[#e0e0e0]">
          <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#767676] text-[16px] tracking-[-0.48px]">
            © 2025 DjidaliTravel
          </p>
          <div className="flex gap-4 items-center cursor-pointer hover:text-[#8f7b49] transition-colors">
            <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[35px] tracking-[-0.7px]">
              Наши контакты
            </p>
            <ArrowIcon />
          </div>
        </div>
      </div>
    </footer>
  );
}

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { translate, language } = useLanguage();
  const newsData = getLocalizedNewsData(language);
  const newsItem = newsData.find((item) => item.id === Number(id));

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[#333] text-[32px] mb-4">
            {translate({
              ru: "Новость не найдена",
              uz: "Yangilik topilmadi",
              en: "News not found",
              de: "Nachricht nicht gefunden",
            })}
          </h1>
          <button
            onClick={() => navigate("/news")}
            className="bg-[#8f7b49] hover:bg-[#7a6839] text-white px-8 py-3 rounded-full font-['Montserrat:SemiBold',sans-serif] font-semibold text-[14px] uppercase transition-all duration-200"
          >
            {translate({
              ru: "Вернуться к новостям",
              uz: "Yangiliklarга qaytish",
              en: "Back to news",
              de: "Zurück zu den Nachrichten",
            })}
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate("/news");
  };

  // Get related news (same category, exclude current)
  const relatedNews = newsData
    .filter(
      (item) => item.category === newsItem.category && item.id !== newsItem.id,
    )
    .slice(0, 3);

  return (
    <div className="bg-[#f4f2ed] min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title={newsItem.title}
        backgroundImage={
          newsItem.image.startsWith("/") ? newsItem.image : `/${newsItem.image}`
        }
        onBack={handleBack}
      />

      {/* Main Content */}
      <div className="max-w-[1340px] mx-auto px-[20px] md:px-[50px] pt-10 md:pt-20 pb-10 md:pb-16">
        <div className="flex flex-col gap-[60px] items-start w-full">
          {/* Title and Description */}
          <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 text-[#333333] w-full">
            <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[32px] md:leading-[48px] lg:leading-[60px] relative shrink-0 text-[28px] md:text-[48px] lg:text-[60px] tracking-[-0.9px] md:tracking-[-1.5px] lg:tracking-[-1.8px] w-full">
              {translate({
                ru: "Внедрение устойчивых экологических практик",
                uz: "Barqaror ekologik amaliyotlarni joriy qilish",
                en: "Implementation of sustainable environmental practices",
                de: "Umsetzung nachhaltiger Umweltpraktiken",
              })}
            </p>
            <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[24px] md:leading-[32px] lg:leading-[40px] relative shrink-0 text-[16px] md:text-[20px] lg:text-[24px] tracking-[-0.32px] md:tracking-[-0.4px] lg:tracking-[-0.48px] w-full">
              {translate({
                ru: "Мы использовали немецкий опыт озеленения, чтобы подобрать виды деревьев, которые легко переносят засуху и укрепляют экосистему. Такой подход помогает восстанавливать природный баланс на долгие годы",
                uz: "Biz quruqchilikka chidamli va ekotizimni mustahkamlaydigan daraxt turlarini tanlash uchun nemis ko'kamlantirish tajribasidan foydalandik. Bunday yondashuv uzoq yillar davomida tabiiy muvozanatni tiklashga yordam beradi",
                en: "We used German greening experience to select tree species that easily tolerate drought and strengthen the ecosystem. This approach helps restore natural balance for years to come",
                de: "Wir nutzten deutsche Begrünungserfahrung, um Baumarten auszuwählen, die Trockenheit leicht vertragen und das Ökosystem stärken. Dieser Ansatz hilft, das natürliche Gleichgewicht für Jahre wiederherzustellen",
              })}
            </p>
          </div>

          {/* Top Image */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            <div className="h-[250px] md:h-[400px] lg:h-[500px] relative rounded-[10px] md:rounded-[20px] shrink-0 w-full">
              <img
                alt=""
                className="absolute inset-0 object-cover rounded-[10px] md:rounded-[20px] size-full"
                src={topImage}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="content-stretch flex flex-col gap-[12px] items-start leading-[40px] relative shrink-0 text-[#333333] w-full">
            <p className="font-['Montserrat:Medium',sans-serif] font-medium relative shrink-0 text-[20px] md:text-[26px] lg:text-[32px] tracking-[-0.4px] md:tracking-[-0.52px] lg:tracking-[-0.64px] w-full">
              {translate({
                ru: "Разнообразие посаженных пород",
                uz: "Ekilgan turlarning xilma-xilligi",
                en: "Diversity of planted species",
                de: "Vielfalt gepflanzter Arten",
              })}
            </p>
            <p className="font-['Montserrat:Regular',sans-serif] font-normal relative shrink-0 text-[16px] md:text-[20px] lg:text-[24px] tracking-[-0.32px] md:tracking-[-0.4px] lg:tracking-[-0.48px] w-full">
              {translate({
                ru: "Всего высажено 665 деревьев 11 видов — клёны, тополя, дубы и вяз. Это создаёт устойчивую природную среду, где разные породы поддерживают друг друга и повышают биоразнообразие территории",
                uz: "Jami 11 turdan 665 ta daraxt — zarang, terak, eman va qarag'ay ekildi. Bu turli xil turlar bir-birini qo'llab-quvvatlaydigan va hududning bioturliligini oshiradigan barqaror tabiiy muhitni yaratadi",
                en: "A total of 665 trees of 11 species were planted — maples, poplars, oaks and elm. This creates a sustainable natural environment where different species support each other and increase the biodiversity of the area",
                de: "Insgesamt wurden 665 Bäume aus 11 Arten gepflanzt — Ahorne, Pappeln, Eichen und Ulmen. Dies schafft eine nachhaltige natürliche Umgebung, in der verschiedene Arten sich gegenseitig unterstützen und die Artenvielfalt des Gebiets erhöhen",
              })}
            </p>
          </div>

          {/* Bottom Images */}
          <div className="content-stretch flex flex-col md:flex-row items-center gap-2 relative shrink-0 w-full">
            <div className="w-full md:basis-0 md:grow h-[300px] md:h-[400px] lg:h-[586px] min-h-px min-w-px relative rounded-[10px] md:rounded-bl-[20px] md:rounded-tl-[20px] md:rounded-tr-[0px] md:rounded-br-[0px] shrink-0">
              <img
                alt=""
                className="absolute inset-0 object-cover rounded-[10px] md:rounded-bl-[20px] md:rounded-tl-[20px] md:rounded-tr-[0px] md:rounded-br-[0px] size-full"
                src={bottomLeftImage}
              />
            </div>
            <div className="w-full md:basis-0 md:grow h-[300px] md:h-[400px] lg:h-[586px] min-h-px min-w-px relative rounded-[10px] md:rounded-br-[20px] md:rounded-tr-[20px] md:rounded-tl-[0px] md:rounded-bl-[0px] shrink-0">
              <img
                alt=""
                className="absolute inset-0 object-cover rounded-[10px] md:rounded-br-[20px] md:rounded-tr-[20px] md:rounded-tl-[0px] md:rounded-bl-[0px] size-full"
                src={bottomRightImage}
              />
            </div>
          </div>

          {/* Final Content Section */}
          <div className="content-stretch flex flex-col gap-[12px] items-start leading-[40px] relative shrink-0 text-[#333333] w-full">
            <p className="font-['Montserrat:Medium',sans-serif] font-medium relative shrink-0 text-[20px] md:text-[26px] lg:text-[32px] tracking-[-0.4px] md:tracking-[-0.52px] lg:tracking-[-0.64px] w-full">
              {translate({
                ru: "Восстановление природных ландшафтов",
                uz: "Tabiiy landshaftlarni tiklash",
                en: "Restoration of natural landscapes",
                de: "Wiederherstellung natürlicher Landschaften",
              })}
            </p>
            <p className="font-['Montserrat:Regular',sans-serif] font-normal relative shrink-0 text-[16px] md:text-[20px] lg:text-[24px] tracking-[-0.32px] md:tracking-[-0.4px] lg:tracking-[-0.48px] w-full">
              {translate({
                ru: "Дополнительно посеяны 6 кг семян трёх видов деревьев, включая орех чёрный. Это помогает укреплять почвы, улучшать структуру лесных массивов и ускорять восстановление природных зон",
                uz: "Qo'shimcha ravishda qora yong'oq daraxtining uch turidan 6 kg urug' ekildi. Bu tuproqni mustahkamlash, o'rmon massivlarining tuzilishini yaxshilash va tabiiy hududlarni tiklashni tezlashtirish",
                en: "Additionally, 6 kg of seeds from three tree species, including black walnut, were sown. This helps strengthen soils, improve the structure of forest areas and accelerate the restoration of natural zones",
                de: "Zusätzlich wurden 6 kg Samen von drei Baumarten, darunter Schwarznuss, gesät. Dies hilft, Böden zu stärken, die Struktur von Waldgebieten zu verbessern und die Wiederherstellung natürlicher Zonen zu beschleunigen",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Related News Section */}
      <div className="max-w-[1340px] mx-auto px-[20px] md:px-[50px] py-10 md:py-16">
        <h2 className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[32px] md:text-[48px] lg:text-[60px] tracking-[-1px] md:tracking-[-1.5px] lg:tracking-[-1.8px] mb-8 md:mb-12">
          {translate({
            ru: "Похожие новости",
            uz: "O'xshash yangiliklar",
            en: "Similar news",
            de: "Ähnliche Nachrichten",
          })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-4 md:gap-6">
          {/* Featured Promotional Card */}
          <div className="relative h-[540px] rounded-[20px] overflow-hidden group cursor-pointer">
            <img
              alt="Путешествовать"
              className="absolute inset-0 object-cover size-full transition-transform duration-500 group-hover:scale-110"
              src={similarNewsImage}
            />
            <div className="absolute bg-[rgba(0,0,0,0.3)] inset-0 rounded-[20px]" />
            <div className="relative z-10 p-10 h-full flex flex-col justify-between">
              <p className="font-['Montserrat:Medium',sans-serif] font-medium text-white text-[16px] tracking-[-0.48px]">
                {translate({
                  ru: "Путешествовать",
                  uz: "Sayohat qilish",
                  en: "Travel",
                  de: "Reisen",
                })}
              </p>
              <div>
                <p className="font-['Montserrat:Regular',sans-serif] text-white text-[45px] leading-[60px] tracking-[-1.35px]">
                  {translate({
                    ru: "Мы поможем вам",
                    uz: "Biz sizga yordam beramiz",
                    en: "We will help you",
                    de: "Wir helfen Ihnen",
                  })}
                  <br />
                  {translate({
                    ru: "найти ",
                    uz: "topishga ",
                    en: "find ",
                    de: "finden ",
                  })}
                  <span className="font-['Montserrat:SemiBold',sans-serif] font-semibold">
                    {translate({
                      ru: "свою мечту",
                      uz: "o'z orzuingizni",
                      en: "your dream",
                      de: "Ihren Traum",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Related News Cards */}
          {relatedNews.slice(0, 2).map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="flex flex-col gap-[20px] group"
            >
              <div className="h-[285px] relative rounded-[20px] overflow-hidden">
                <img
                  alt={item.title}
                  className="absolute inset-0 object-cover rounded-[20px] size-full transition-transform duration-500 group-hover:scale-110"
                  src={
                    item.image.startsWith("/") ? item.image : `/${item.image}`
                  }
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[#333333] text-[22px] tracking-[-0.44px] group-hover:text-[#8f7b49] transition-colors">
                  {item.title}
                </p>
                <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[#5c5c5c] text-[16px] tracking-[-0.48px] line-clamp-2">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
    </div>
  );
}
