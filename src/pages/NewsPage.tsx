import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { svgPaths } from '../utils/svgPaths';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollToTopButton from '../components/ScrollToTopButton';

// Import images with local paths
const heroImage = '/about-hero.webp';
const largeCardBg2 = '/fcd4ea8bf176e4851a46f14de3020f62faed656d.jpg';

// News data with multilingual support
export const newsDataRaw = [
  {
    id: 1,
    title: {
      ru: "Озеленение территории",
      uz: "Hududni yashillantirish",
      en: "Territory Greening",
      de: "Gebietsbegrünung"
    },
    description: {
      ru: "Высажено 665 засухоустойчивых деревьев и высеяны семена для укрепления экосистемы",
      uz: "665 ta qurg'oqchilikka chidamli daraxt ekildi va ekotizimni mustahkamlash uchun urug'lar ekildi",
      en: "665 drought-resistant trees planted and seeds sown to strengthen the ecosystem",
      de: "665 trockenresistente Bäume gepflanzt und Samen gesät zur Stärkung des Ökosystems"
    },
    image: "1d6fc91ee2e4eb2215b103735e2a6d41aa28cac8.png",
    category: {
      ru: "Экотуризм",
      uz: "Ekoturizm",
      en: "Ecotourism",
      de: "Ökotourismus"
    },
    date: new Date("2024-11-15"),
    fullContent: {
      ru: "Мы использовали немецкий опыт озеленения, чтобы подобрать виды деревьев, которые легко переносят засуху и укрепляют экосистему. Такой подход помогает восстанавливать природный баланс на долгие годы. Всего высажено 665 деревьев 11 видов — клёны, тополя, дубы и вяз. Это создаёт устойчивую природную среду, где разные породы поддерживают друг друга и повышают биоразнообразие территории.",
      uz: "Biz qurg'oqchilikka chidamli va ekotizimni mustahkamlaydigan daraxt turlarini tanlash uchun nemis ko'kamlantirish tajribasidan foydalandik. Bunday yondashuv uzoq yillar davomida tabiiy muvozanatni tiklashga yordam beradi. Jami 11 turdan 665 ta daraxt — zarang, terak, eman va qarag'ay ekildi.",
      en: "We used German greening experience to select tree species that easily tolerate drought and strengthen the ecosystem. This approach helps restore natural balance for years to come. A total of 665 trees of 11 species were planted — maples, poplars, oaks and elm.",
      de: "Wir nutzten deutsche Begrünungserfahrung, um Baumarten auszuwählen, die Trockenheit leicht vertragen und das Ökosystem stärken. Dieser Ansatz hilft, das natürliche Gleichgewicht für Jahre wiederherzustellen."
    },
    tags: {
      ru: ["озеленение", "экосистема", "деревья"],
      uz: ["yashillantirish", "ekotizim", "daraxtlar"],
      en: ["greening", "ecosystem", "trees"],
      de: ["begrünung", "ökosystem", "bäume"]
    }
  },
  {
    id: 2,
    title: {
      ru: "Мониторинг дикой фауны",
      uz: "Yovvoyi hayvonot dunyosini monitoring qilish",
      en: "Wildlife Monitoring",
      de: "Wildtierüberwachung"
    },
    description: {
      ru: "Специалисты отметили рост численности птиц и мелких животных",
      uz: "Mutaxassislar qushlar va mayda hayvonlarning sonining o'sishini qayd etishdi",
      en: "Specialists noted an increase in the number of birds and small animals",
      de: "Spezialisten stellten eine Zunahme der Vogel- und Kleintierzahlen fest"
    },
    image: "b1b2b7d2c6b5a3943579cce117ca7fc48080d326 (1).jpg",
    category: {
      ru: "Экотуризм",
      uz: "Ekoturizm",
      en: "Ecotourism",
      de: "Ökotourismus"
    },
    date: new Date("2024-11-10"),
    fullContent: {
      ru: "Специалисты отметили рост численности птиц и мелких животных. Мониторинг показывает положительную динамику восстановления природных экосистем.",
      uz: "Mutaxassislar qushlar va mayda hayvonlarning sonining o'sishini qayd etishdi. Monitoring tabiiy ekotizimlarning tiklanishida ijobiy dinamikani ko'rsatadi.",
      en: "Specialists noted an increase in the number of birds and small animals. Monitoring shows positive dynamics in the restoration of natural ecosystems.",
      de: "Spezialisten stellten eine Zunahme der Vogel- und Kleintierzahlen fest. Die Überwachung zeigt positive Dynamik bei der Wiederherstellung natürlicher Ökosysteme."
    },
    tags: {
      ru: ["фауна", "мониторинг", "природа"],
      uz: ["fauna", "monitoring", "tabiat"],
      en: ["fauna", "monitoring", "nature"],
      de: ["fauna", "überwachung", "natur"]
    }
  },
  {
    id: 3,
    title: {
      ru: "Новые экотропы",
      uz: "Yangi ekotrop yo'llar",
      en: "New Eco-trails",
      de: "Neue Ökopfade"
    },
    description: {
      ru: "Обновлены пешие маршруты и оборудованы безопасные зоны отдыха",
      uz: "Piyoda yo'nalishlar yangilandi va xavfsiz dam olish zonalari jihozlandi",
      en: "Hiking routes updated and safe recreation areas equipped",
      de: "Wanderwege aktualisiert und sichere Erholungszonen ausgestattet"
    },
    image: "a4e0ae5b9e8c8fa1e41fe28148d36e09e517dbda.jpg",
    category: {
      ru: "Туризм",
      uz: "Turizm",
      en: "Tourism",
      de: "Tourismus"
    },
    date: new Date("2024-11-05"),
    fullContent: {
      ru: "Обновлены пешие маршруты и оборудованы безопасные зоны отдыха. Новые экотропы обеспечивают комфортное и безопасное передвижение по территории.",
      uz: "Piyoda yo'nalishlar yangilandi va xavfsiz dam olish zonalari jihozlandi. Yangi ekotrop yo'llar hudud bo'ylab qulay va xavfsiz harakatni ta'minlaydi.",
      en: "Hiking routes updated and safe recreation areas equipped. New eco-trails provide comfortable and safe movement through the territory.",
      de: "Wanderwege aktualisiert und sichere Erholungszonen ausgestattet. Neue Ökopfade bieten komfortable und sichere Bewegung durch das Gebiet."
    },
    tags: {
      ru: ["экотропы", "маршруты", "безопасность"],
      uz: ["ekotrop", "yo'nalishlar", "xavfsizlik"],
      en: ["eco-trails", "routes", "safety"],
      de: ["ökopfade", "routen", "sicherheit"]
    }
  },
  {
    id: 4,
    title: {
      ru: "Посадка прибрежных деревьев",
      uz: "Qirg'oq daraxtlarini ekish",
      en: "Coastal Tree Planting",
      de: "Küstenbaumplanzung"
    },
    description: {
      ru: "Укреплены берега водоёмов и высажены устойчивые природные породы",
      uz: "Suv havzalarining qirg'oqlari mustahkamlandi va barqaror tabiiy turlar ekildi",
      en: "Water body banks reinforced and resilient natural species planted",
      de: "Uferbereiche von Gewässern verstärkt und widerstandsfähige natürliche Arten gepflanzt"
    },
    image: "dec86947ffbad2b6e43613a1b55097df4e652225.jpg",
    category: {
      ru: "Экотуризм",
      uz: "Ekoturizm",
      en: "Ecotourism",
      de: "Ökotourismus"
    },
    date: new Date("2024-10-28"),
    fullContent: {
      ru: "Укреплены берега водоёмов и высажены устойчивые природные породы. Этот проект направлен на предотвращение эрозии почвы и сохранение водных ресурсов.",
      uz: "Suv havzalarining qirg'oqlari mustahkamlandi va barqaror tabiiy turlar ekildi. Ushbu loyiha tuproq eroziyasining oldini olish va suv resurslarini saqlashga qaratilgan.",
      en: "Water body banks reinforced and resilient natural species planted. This project aims to prevent soil erosion and preserve water resources.",
      de: "Uferbereiche von Gewässern verstärkt und widerstandsfähige natürliche Arten gepflanzt. Dieses Projekt zielt darauf ab, Bodenerosion zu verhindern und Wasserressourcen zu erhalten."
    },
    tags: {
      ru: ["берега", "водоёмы", "эрозия"],
      uz: ["qirg'oqlar", "suv havzalari", "eroziya"],
      en: ["shores", "water bodies", "erosion"],
      de: ["ufer", "gewässer", "erosion"]
    }
  },
  {
    id: 5,
    title: {
      ru: "Гнездовые платформы",
      uz: "Uyalash platformalari",
      en: "Nesting Platforms",
      de: "Nistplattformen"
    },
    description: {
      ru: "Установлены новые конструкции для сохранения редких видов птиц",
      uz: "Noyob qush turlarini saqlash uchun yangi konstruksiyalar o'rnatildi",
      en: "New structures installed to preserve rare bird species",
      de: "Neue Strukturen zur Erhaltung seltener Vogelarten installiert"
    },
    image: "c306bdf680d1677e4c01bf1bbcc8d8cf985b20ca (1).jpg",
    category: {
      ru: "Экотуризм",
      uz: "Ekoturizm",
      en: "Ecotourism",
      de: "Ökotourismus"
    },
    date: new Date("2024-10-20"),
    fullContent: {
      ru: "Установлены новые конструкции для сохранения редких видов птиц. Гнездовые платформы создают благоприятные условия для размножения и обитания птиц.",
      uz: "Noyob qush turlarini saqlash uchun yangi konstruksiyalar o'rnatildi. Uyalash platformalari qushlarning ko'payishi va yashashi uchun qulay sharoitlar yaratadi.",
      en: "New structures installed to preserve rare bird species. Nesting platforms create favorable conditions for bird breeding and habitation.",
      de: "Neue Strukturen zur Erhaltung seltener Vogelarten installiert. Nistplattformen schaffen günstige Bedingungen für Vogelzucht und -bewohnung."
    },
    tags: {
      ru: ["птицы", "гнёзда", "охрана"],
      uz: ["qushlar", "uyalar", "himoya"],
      en: ["birds", "nests", "conservation"],
      de: ["vögel", "nester", "schutz"]
    }
  },
  {
    id: 6,
    title: {
      ru: "Восстановление природных ландшафтов",
      uz: "Tabiiy landshaftlarni tiklash",
      en: "Restoration of Natural Landscapes",
      de: "Wiederherstellung natürlicher Landschaften"
    },
    description: {
      ru: "Дополнительно посеяны 6 кг семян трёх видов деревьев, включая орех чёрный",
      uz: "Qo'shimcha ravishda qora yong'oq daraxtining uch turidan 6 kg urug' ekildi",
      en: "Additionally, 6 kg of seeds from three tree species sown, including black walnut",
      de: "Zusätzlich 6 kg Samen von drei Baumarten gesät, darunter Schwarznuss"
    },
    image: "b51fa79df5f369fbf30a4b695611c726793f4337.jpg",
    category: {
      ru: "Экотуризм",
      uz: "Ekoturizm",
      en: "Ecotourism",
      de: "Ökotourismus"
    },
    date: new Date("2024-10-15"),
    fullContent: {
      ru: "Дополнительно посеяны 6 кг семян трёх видов деревьев, включая орех чёрный. Это помогает укреплять почвы, улучшать структуру лесных массивов и ускорять восстановление природных зон.",
      uz: "Qo'shimcha ravishda qora yong'oq daraxtining uch turidan 6 kg urug' ekildi. Bu tuproqni mustahkamlash, o'rmon massivlarining tuzilishini yaxshilash va tabiiy hududlarni tiklashni tezlashtirish.",
      en: "Additionally, 6 kg of seeds from three tree species sown, including black walnut. This helps strengthen soils, improve forest structure and accelerate restoration of natural zones.",
      de: "Zusätzlich 6 kg Samen von drei Baumarten gesät, darunter Schwarznuss. Dies hilft, Böden zu stärken, die Waldstruktur zu verbessern und die Wiederherstellung natürlicher Zonen zu beschleunigen."
    },
    tags: {
      ru: ["семена", "ландшафты", "восстановление"],
      uz: ["urug'lar", "landshaftlar", "tiklash"],
      en: ["seeds", "landscapes", "restoration"],
      de: ["samen", "landschaften", "wiederherstellung"]
    }
  }
];

// Helper function to get localized news data
export const getLocalizedNewsData = (language: 'ru' | 'uz' | 'en' | 'de' = 'ru') => {
  return newsDataRaw.map(item => ({
    id: item.id,
    title: item.title[language],
    description: item.description[language],
    image: item.image,
    category: item.category[language],
    date: item.date,
    fullContent: item.fullContent[language],
    tags: item.tags[language]
  }));
};

// Default export for backward compatibility (Russian)
export const newsData = getLocalizedNewsData('ru');

// Navigation Components
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
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0" data-name="Button">
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

function NavItem() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0" data-name="Nav Item">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">О нас</p>
    </div>
  );
}

function NavItem1() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0" data-name="Nav Item">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Виды туризма</p>
    </div>
  );
}

function NavItem2() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0" data-name="Nav Item">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Наши туры</p>
    </div>
  );
}

function NavItem3() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0" data-name="Nav Item">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Новости</p>
    </div>
  );
}

function NavItem4() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0" data-name="Nav Item">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#333333] text-[14px] text-nowrap uppercase whitespace-pre">Контакты</p>
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

function Nav() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-between left-0 pb-0 pt-[20px] px-[50px] right-0 top-0" data-name="Nav">
      <NavContent />
    </div>
  );
}

// Hero Section with Search
interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  newsCount: number;
}

function Hero({ searchQuery, onSearchChange, newsCount }: HeroProps) {
  const { translate } = useLanguage();
  
  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <img alt="" className="absolute object-cover size-full" src={heroImage} />
        <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
      </div>
      


      {/* Title */}
      <div className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[40px] md:leading-[70px] lg:leading-[100px] left-[20px] md:left-[50px] text-[32px] md:text-[60px] lg:text-[90px] text-white top-[100px] md:top-[150px] lg:top-[190px] tracking-[-1.2px] md:tracking-[-2px] lg:tracking-[-2.7px] max-w-[calc(100%-40px)] md:w-[900px] lg:w-[1340px]">
        <p className="mb-0">{translate({ ru: 'Наши интересные', uz: 'Bizning qiziqarli', en: 'Our interesting', de: 'Unsere interessanten' })}</p>
        <p className="md:whitespace-pre-wrap">{translate({ ru: 'и популярные новости', uz: 'va mashhur yangiliklar', en: 'and popular news', de: 'und beliebte Nachrichten' })}</p>
      </div>
      
      {/* Decorative line */}
      <div className="hidden md:block absolute h-0 left-[80px] md:left-[120px] top-[320px] md:top-[357px] w-[60px] md:w-[100px]">
        
      </div>

      {/* Search Container */}
      <div className="absolute left-[20px] md:left-[50px] right-[20px] md:right-auto top-[280px] md:top-[380px] lg:top-[466px] flex flex-col md:flex-row gap-[10px] md:w-auto lg:w-[1340px]">
        <div className="flex-1 bg-white h-[60px] md:h-[80px] rounded-[10px] border-2 border-white">
          <div className="flex items-center h-full px-[15px] md:px-[20px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={translate({ ru: 'Поиск новостей', uz: 'Yangiliklar qidirish', en: 'Search news', de: 'Nachrichten suchen' })}
              className="w-full font-['Montserrat:SemiBold',sans-serif] font-semibold text-[16px] md:text-[22px] text-[#333333] opacity-50 tracking-[-0.32px] md:tracking-[-0.44px] bg-transparent focus:outline-none focus:opacity-100 placeholder:opacity-50"
            />
          </div>
        </div>
        <button className="bg-[#8f7b49] hover:bg-[#7a6839] h-[60px] md:h-[80px] w-full md:w-[180px] rounded-[10px] flex items-center justify-center transition-colors">
          <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[18px] md:text-[20px] text-white tracking-[-0.36px] md:tracking-[-0.4px]">{translate({ ru: 'Поиск', uz: 'Qidiruv', en: 'Search', de: 'Suche' })}</p>
        </button>
      </div>

      {/* News Count */}
      <p className="hidden md:block absolute bottom-[50px] md:bottom-[78px] right-[20px] md:right-[50px] font-['Montserrat:Light',sans-serif] font-light text-[16px] md:text-[20px] text-white tracking-[-0.32px] md:tracking-[-0.4px]">
        <span className="font-['Montserrat:Bold',sans-serif] font-bold">{newsCount} {translate({ ru: 'доступных', uz: 'mavjud', en: 'available', de: 'verfügbar' })}</span>
        <span>{` ${translate({ ru: 'новостей', uz: 'yangiliklar', en: 'news', de: 'Nachrichten' })}`}</span>
      </p>
    </div>
  );
}

// News Card Component
interface NewsCardProps {
  item: typeof newsData[0];
  isLarge?: boolean;
}

function NewsCard({ item, isLarge = false }: NewsCardProps) {
  return (
    <Link 
      to={`/news/${item.id}`}
      className={`group block h-full ${isLarge ? 'md:col-span-2' : ''}`}
    >
      <div className="flex flex-col h-full rounded-[10px] md:rounded-[20px] overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className={`relative ${isLarge ? 'h-[250px] md:h-[350px] lg:h-[400px]' : 'h-[200px] md:h-[250px] lg:h-[280px]'} overflow-hidden`}>
          <img 
            alt={item.title} 
            className="object-cover size-full transition-transform duration-700 group-hover:scale-105" 
            src={item.image.startsWith('/') ? item.image : `/${item.image}`} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          
        </div>
        
        <div className="flex flex-col gap-2 md:gap-3 p-4 md:p-6 flex-1">
          <h3 className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[#333333] text-[18px] md:text-[20px] lg:text-[22px] leading-[1.3] group-hover:text-[#8f7b49] transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[#5c5c5c] text-[14px] md:text-[15px] lg:text-[16px] leading-[1.6] line-clamp-3">
            {item.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
// News Grid Section
interface NewsGridProps {
  searchQuery: string;
  selectedCategory: string;
}

function NewsGrid({ searchQuery, selectedCategory }: NewsGridProps) {
  const { translate, language } = useLanguage();
  
  const filteredNews = useMemo(() => {
    let filtered = getLocalizedNewsData(language);
    
    // Filter by category
    if (selectedCategory !== 'Все') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [searchQuery, selectedCategory, language]);

  return (
    <div className="w-full px-[20px] md:px-[50px] pt-10 md:pt-16 pb-12 md:pb-20">
      <div className="max-w-[1340px] mx-auto">
        {/* Section Header */}
        <h2 className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333] text-[32px] md:text-[48px] lg:text-[60px] tracking-[-1px] md:tracking-[-1.5px] lg:tracking-[-1.8px] mb-8 md:mb-16 leading-tight">
          {translate({ ru: 'Новости', uz: 'Yangiliklar', en: 'News', de: 'Nachrichten' })}
        </h2>

        {/* News Grid - Custom Layout */}
        {filteredNews.length > 0 ? (
          <div className="flex flex-col gap-10">
            {/* First Row: Large featured card + Small card */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6">
              {/* Large Featured Card */}
              {filteredNews[0] && (
                <Link 
                  to={`/news/${filteredNews[0].id}`}
                  className="group block"
                >
                  <div className="relative h-[300px] md:h-[400px] lg:h-[450px] rounded-[10px] md:rounded-[20px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
                    <img 
                      alt={filteredNews[0].title} 
                      className="absolute inset-0 object-cover size-full transition-transform duration-700 group-hover:scale-105" 
                      src={filteredNews[0].image.startsWith('/') ? filteredNews[0].image : `/${filteredNews[0].image}`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Category Badge */}
                    
                    
                    {/* Content at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
                      <h3 className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-white text-[20px] md:text-[26px] lg:text-[32px] leading-[1.3] mb-2 md:mb-4">
                        {filteredNews[0].title}
                      </h3>
                      <p className="font-['Montserrat:Regular',sans-serif] font-normal text-white/95 text-[14px] md:text-[16px] leading-[1.6] line-clamp-2">
                        {filteredNews[0].description}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
              
              {/* Small Card */}
              {filteredNews[1] && (
                <NewsCard item={filteredNews[1]} />
              )}
            </div>

            {/* Second Row: 3 Standard Cards */}
            {filteredNews.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredNews.slice(2, 5).map(item => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Third Row: 1 Card + Large Promotional Card */}
            {filteredNews.length > 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 md:gap-6">
                {/* Small Card */}
                <NewsCard item={filteredNews[5]} />
                
                {/* Large Promotional Card */}
                <div className="relative h-[300px] md:h-[400px] lg:h-[450px] rounded-[10px] md:rounded-[20px] overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300">
                  <img alt="Путешествовать" className="absolute inset-0 object-cover size-full transition-transform duration-700 group-hover:scale-105" src={largeCardBg2} />

                  <div className="relative z-10 p-5 md:p-10 h-full flex flex-col justify-between">
                    <p className="font-['Montserrat:Medium',sans-serif] font-medium text-white/90 text-[14px] md:text-[16px] tracking-[-0.28px] md:tracking-[-0.32px]">
                      {translate({ ru: 'Путешествовать', uz: 'Sayohat qilish', en: 'Travel', de: 'Reisen' })}
                    </p>
                    <div>
                      <p className="font-['Montserrat:Regular',sans-serif] text-white text-[24px] md:text-[36px] lg:text-[48px] leading-[1.25] tracking-[-0.8px] md:tracking-[-1.2px] lg:tracking-[-1.44px]">
                        {translate({ ru: 'Мы поможем вам', uz: 'Biz sizga yordam beramiz', en: 'We will help you', de: 'Wir helfen Ihnen' })}<br />
                        {translate({ ru: 'найти ', uz: 'topishga ', en: 'find ', de: 'finden ' })}<span className="font-['Montserrat:SemiBold',sans-serif] font-semibold">{translate({ ru: 'свою мечту', uz: 'o\'z orzuingizni', en: 'your dream', de: 'Ihren Traum' })}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Cards if any */}
            {filteredNews.length > 6 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-2">
                {filteredNews.slice(6).map(item => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-['Montserrat:Medium',sans-serif] text-[#999] text-[18px]">
              {translate({ ru: 'Новости не найдены. Попробуйте изменить параметры поиска.', uz: 'Yangiliklar topilmadi. Qidiruv parametrlarini o\'zgartirib ko\'ring.', en: 'No news found. Try changing the search parameters.', de: 'Keine Nachrichten gefunden. Versuchen Sie, die Suchparameter zu ändern.' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main NewsPage Component
export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCategory = 'Все';
  const { language } = useLanguage();
  
  const localizedNews = useMemo(() => getLocalizedNewsData(language), [language]);

  return (
    <div className="bg-[#f4f2ed] min-h-screen">
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} newsCount={localizedNews.length} />
      <NewsGrid 
        searchQuery={searchQuery} 
        selectedCategory={selectedCategory}
      />
      <ScrollToTopButton />
    </div>
  );
}