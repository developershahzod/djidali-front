import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

interface TourismType {
  id: string;
  title: { ru: string; uz: string; en: string; de: string };
  description: { ru: string; uz: string; en: string; de: string };
  image: string;
  route: string;
}

const TourismTypesPage: React.FC = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const tourismTypes: TourismType[] = [
    {
      id: "ecotourism",
      title: {
        ru: "Экотуризм",
        uz: "Ekoturizm",
        en: "Ecotourism",
        de: "Okotourismus",
      },
      description: {
        ru: "Погружение в первозданную природу с заботой об окружающей среде",
        uz: "Atrof-muhitga g'amxo'rlik bilan tabiatga sho'ng'ish",
        en: "Immersion in pristine nature with environmental care",
        de: "Eintauchen in unberuhrte Natur mit Umweltbewusstsein",
      },
      image: "/gallery-dalverzin.webp",
      route: "/category/ecotourism",
    },
    {
      id: "agrotourism",
      title: {
        ru: "Агротуризм",
        uz: "Agroturizm",
        en: "Agrotourism",
        de: "Agrotourismus",
      },
      description: {
        ru: "Знакомство с сельским хозяйством и традиционным укладом жизни",
        uz: "Qishloq xo'jaligi va an'anaviy turmush tarzi bilan tanishish",
        en: "Exploring agriculture and traditional way of life",
        de: "Erkundung der Landwirtschaft und traditionellen Lebensweise",
      },
      image: "/gallery-kyzylkum.webp",
      route: "/category/agrotourism",
    },
    {
      id: "teambuilding",
      title: {
        ru: "Тимбилдинг",
        uz: "Jamoa qurish",
        en: "Team Building",
        de: "Teambildung",
      },
      description: {
        ru: "Корпоративные мероприятия для укрепления командного духа",
        uz: "Jamoa ruhini mustahkamlash uchun korporativ tadbirlar",
        en: "Corporate events to strengthen team spirit",
        de: "Firmenveranstaltungen zur Starkung des Teamgeistes",
      },
      image: "/why-us-gallery-top.webp",
      route: "/category/teambuilding",
    },
    {
      id: "sport-shooting",
      title: {
        ru: "Спортивная стрельба",
        uz: "Sport otish",
        en: "Sport Shooting",
        de: "Sportschie\u00dfen",
      },
      description: {
        ru: "Профессиональная стендовая стрельба под руководством инструкторов",
        uz: "Instruktorlar rahbarligida professional stend otish",
        en: "Professional target shooting under instructor guidance",
        de: "Professionelles Schie\u00dfen unter Anleitung von Ausbildern",
      },
      image: "/why-us-gallery-bottom-left.webp",
      route: "/category/sport-shooting",
    },
  ];

  const tourismHighlights = [
    {
      title: {
        ru: "Уникальная природа",
        uz: "Noyob tabiat",
        en: "Unique Nature",
        de: "Einzigartige Natur",
      },
      description: {
        ru: "Горы, пустыни, озера и леса - все в одном регионе. Узбекистан предлагает невероятное разнообразие ландшафтов для любителей природы.",
        uz: "Tog'lar, cho'llar, ko'llar va o'rmonlar - barchasi bir mintaqada. O'zbekiston tabiat ixlosmandalari uchun ajoyib landshaft xilma-xilligini taklif etadi.",
        en: "Mountains, deserts, lakes and forests - all in one region. Uzbekistan offers incredible landscape diversity for nature lovers.",
        de: "Berge, Wusten, Seen und Walder - alles in einer Region. Usbekistan bietet unglaubliche Landschaftsvielfalt fur Naturliebhaber.",
      },
    },
    {
      title: {
        ru: "Богатые традиции",
        uz: "Boy an'analar",
        en: "Rich Traditions",
        de: "Reiche Traditionen",
      },
      description: {
        ru: "Тысячелетняя история, самобытная культура и гостеприимство местных жителей делают каждое путешествие незабываемым.",
        uz: "Ming yillik tarix, o'ziga xos madaniyat va mahalliy aholi mehmondo'stligi har bir sayohatni unutilmas qiladi.",
        en: "Thousands of years of history, unique culture and hospitality of locals make every journey unforgettable.",
        de: "Tausende Jahre Geschichte, einzigartige Kultur und Gastfreundschaft der Einheimischen machen jede Reise unvergesslich.",
      },
    },
    {
      title: {
        ru: "Активный отдых",
        uz: "Faol dam olish",
        en: "Active Recreation",
        de: "Aktive Erholung",
      },
      description: {
        ru: "От спокойных прогулок до экстремальных видов спорта - мы предлагаем активности для любого уровня подготовки.",
        uz: "Tinch sayrlardan ekstremal sport turlarigacha - biz har qanday tayyorgarlik darajasi uchun faoliyatlarni taklif etamiz.",
        en: "From peaceful walks to extreme sports - we offer activities for any skill level.",
        de: "Von ruhigen Spaziergangen bis hin zu Extremsportarten - wir bieten Aktivitaten fur jedes Niveau.",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1C160D]">
      {/* Hero Section */}
      <header className="relative h-screen overflow-hidden flex flex-col">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/contact-nature-image.webp"
            alt=""
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full px-[clamp(20px,3.47vw,50px)]">
          <div className="max-w-[1340px] mx-auto h-full flex flex-col">
            {/* Title and Description */}
            <div className="mt-[clamp(160px,14.58vw,210px)] mb-auto">
              <h1
                className="text-[clamp(48px,6.25vw,90px)] font-medium leading-[1.11] mb-[clamp(12px,1.39vw,20px)] text-white max-w-[1340px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                {translate({
                  ru: "Виды туризма",
                  uz: "Turizm turlari",
                  en: "Tourism Types",
                  de: "Tourismusarten",
                })}
              </h1>
              <p
                className="text-[clamp(18px,2.22vw,32px)] font-normal leading-[1.25] opacity-80 whitespace-pre-wrap text-white max-w-[800px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                {translate({
                  ru: "Откройте для себя разнообразие туристических\nнаправлений и найдите идеальный отдых",
                  uz: "Turistik yo'nalishlar xilma-xilligini kashf eting\nva ideal dam olishni toping",
                  en: "Discover the variety of tourist\ndestinations and find the perfect getaway",
                  de: "Entdecken Sie die Vielfalt der touristischen\nReiseziele und finden Sie den perfekten Urlaub",
                })}
              </p>
            </div>

            {/* Statistics */}
            <div className="flex flex-col md:flex-row gap-[clamp(40px,5.56vw,80px)] text-white pb-[clamp(40px,5.56vw,80px)]">
              <div className="w-[clamp(200px,21.11vw,304px)]">
                <div
                  className="mb-[10px] whitespace-nowrap"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "-1px",
                  }}
                >
                  <span className="text-[clamp(48px,5.56vw,80px)] font-normal leading-[1]">
                    4
                  </span>
                  <span className="text-[clamp(32px,3.47vw,50px)] font-extralight leading-[1]">
                    {" "}
                    {translate({
                      ru: "вида",
                      uz: "turi",
                      en: "types",
                      de: "Arten",
                    })}
                  </span>
                </div>
                <p
                  className="text-[clamp(14px,1.39vw,20px)] font-light leading-[1.4]"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "-0.4px",
                  }}
                >
                  {translate({
                    ru: "туризма на выбор",
                    uz: "turizm tanlash uchun",
                    en: "of tourism to choose",
                    de: "des Tourismus zur Auswahl",
                  })}
                </p>
              </div>
              <div className="w-[clamp(200px,21.11vw,304px)]">
                <div
                  className="mb-[10px] whitespace-nowrap"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "-1px",
                  }}
                >
                  <span className="text-[clamp(48px,5.56vw,80px)] font-normal leading-[1]">
                    50+
                  </span>
                </div>
                <p
                  className="text-[clamp(14px,1.39vw,20px)] font-light leading-[1.4]"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "-0.4px",
                  }}
                >
                  {translate({
                    ru: "уникальных маршрутов",
                    uz: "noyob marshrutlar",
                    en: "unique routes",
                    de: "einzigartige Routen",
                  })}
                </p>
              </div>
              <div className="w-[clamp(200px,21.11vw,304px)]">
                <div
                  className="mb-[10px] whitespace-nowrap"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "-1px",
                  }}
                >
                  <span className="text-[clamp(48px,5.56vw,80px)] font-normal leading-[1]">
                    10
                  </span>
                  <span className="text-[clamp(32px,3.47vw,50px)] font-extralight leading-[1]">
                    {" "}
                    {translate({
                      ru: "тыс.",
                      uz: "ming",
                      en: "K",
                      de: "Tsd.",
                    })}
                  </span>
                </div>
                <p
                  className="text-[clamp(14px,1.39vw,20px)] font-light leading-[1.4]"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "-0.4px",
                  }}
                >
                  {translate({
                    ru: "довольных клиентов",
                    uz: "mamnun mijozlar",
                    en: "satisfied clients",
                    de: "zufriedene Kunden",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tourism Types Section */}
      <section className="bg-[#F5F5F0] py-[clamp(60px,6.94vw,100px)] px-[clamp(20px,3.47vw,50px)]">
        <div className="max-w-[1340px] mx-auto">
          <h2
            className="text-[clamp(32px,4.17vw,60px)] font-medium leading-[1] text-[#333333] mb-[clamp(30px,3.47vw,50px)]"
            style={{
              fontFamily: "Montserrat, sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            {translate({
              ru: "Выберите свой тип туризма",
              uz: "O'zingizning turizm turingizni tanlang",
              en: "Choose your tourism type",
              de: "Wahlen Sie Ihren Tourismustyp",
            })}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(16px,1.39vw,20px)]">
            {tourismTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => navigate(type.route)}
                className="group relative h-[clamp(280px,27.78vw,400px)] rounded-[clamp(12px,1.39vw,20px)] overflow-hidden cursor-pointer"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={type.image}
                    alt={translate(type.title)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-[clamp(24px,2.08vw,30px)]">
                  <h3
                    className="text-[clamp(24px,2.22vw,32px)] font-medium leading-[1.2] text-white mb-[clamp(8px,0.69vw,10px)]"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {translate(type.title)}
                  </h3>
                  <p
                    className="text-[clamp(14px,1.11vw,16px)] font-normal leading-[1.5] text-white/80"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {translate(type.description)}
                  </p>

                  {/* Arrow Icon */}
                  <div className="mt-[clamp(16px,1.39vw,20px)] flex items-center gap-[8px] text-white group-hover:gap-[12px] transition-all">
                    <span
                      className="text-[clamp(14px,1.11vw,16px)] font-medium"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {translate({
                        ru: "Подробнее",
                        uz: "Batafsil",
                        en: "Learn more",
                        de: "Mehr erfahren",
                      })}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path
                        d="M4.16669 10H15.8334"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 4.16669L15.8333 10L10 15.8334"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section - About Tourism in Uzbekistan */}
      <section className="bg-white py-[clamp(60px,6.94vw,100px)]">
        <div className="max-w-[1340px] mx-auto px-[clamp(20px,3.47vw,50px)]">
          <div className="flex flex-col gap-[clamp(40px,4.17vw,60px)]">
            {/* Section Header */}
            <div className="max-w-[900px]">
              <h2
                className="text-[clamp(32px,4.17vw,60px)] font-medium leading-[1] text-[#333333] mb-[clamp(20px,2.08vw,30px)]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                {translate({
                  ru: "Туризм в Узбекистане",
                  uz: "O'zbekistonda turizm",
                  en: "Tourism in Uzbekistan",
                  de: "Tourismus in Usbekistan",
                })}
              </h2>
              <p
                className="text-[clamp(16px,1.39vw,20px)] font-normal leading-[1.67] text-[#333333]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {translate({
                  ru: "Узбекистан - это страна с богатейшим культурным наследием и разнообразными природными ландшафтами. Мы разработали различные направления туризма, чтобы каждый гость мог найти свой идеальный отдых.",
                  uz: "O'zbekiston - boy madaniy meros va xilma-xil tabiiy landshaftlarga ega mamlakat. Biz har bir mehmon o'zining ideal dam olishini topishi uchun turli turizm yo'nalishlarini ishlab chiqdik.",
                  en: "Uzbekistan is a country with rich cultural heritage and diverse natural landscapes. We have developed various tourism directions so that every guest can find their ideal vacation.",
                  de: "Usbekistan ist ein Land mit reichem kulturellem Erbe und vielfaltigen Naturlandschaften. Wir haben verschiedene Tourismusrichtungen entwickelt, damit jeder Gast seinen idealen Urlaub finden kann.",
                })}
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(20px,2.08vw,30px)]">
              {tourismHighlights.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-[#F5F5F0] rounded-[16px] p-[clamp(24px,2.08vw,30px)] hover:bg-[#8f7b49] group transition-all duration-300"
                >
                  <h3
                    className="text-[clamp(20px,1.67vw,24px)] font-medium leading-[1.25] text-[#333333] group-hover:text-white mb-[clamp(12px,1.11vw,16px)] transition-colors"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {translate(highlight.title)}
                  </h3>
                  <p
                    className="text-[clamp(14px,1.11vw,16px)] font-normal leading-[1.75] text-[#666666] group-hover:text-white/80 transition-colors"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {translate(highlight.description)}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/tours")}
                className="bg-[#8f7b49] hover:bg-[#7a6939] transition-colors rounded-[10px] px-[clamp(32px,3.89vw,56px)] py-[clamp(16px,2.08vw,30px)] h-[clamp(52px,5.56vw,80px)] flex items-center justify-center cursor-pointer"
              >
                <p
                  className="text-white text-[clamp(14px,1.39vw,20px)] font-bold leading-[1] tracking-[-0.02em] whitespace-pre"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {translate({
                    ru: "Смотреть все туры",
                    uz: "Barcha turlarni ko'rish",
                    en: "View all tours",
                    de: "Alle Touren ansehen",
                  })}
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-[#F5F5F0] pb-[clamp(60px,6.94vw,100px)] px-[clamp(20px,3.47vw,50px)]">
        <div className="max-w-[1340px] mx-auto">
          {/* Top Image */}
          <div className="relative h-[clamp(300px,34.72vw,500px)] w-full rounded-t-[20px] overflow-hidden">
            <img
              src="/why-us-gallery-top.webp"
              alt=""
              className="absolute w-full h-full object-cover"
            />
          </div>

          {/* Bottom Images */}
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-[clamp(250px,27.78vw,400px)] overflow-hidden md:rounded-bl-[20px] rounded-b-[20px] md:rounded-br-none">
              <img
                src="/why-us-gallery-bottom-left.webp"
                alt=""
                className="absolute w-full h-full object-cover"
              />
            </div>
            <div className="relative w-full md:w-1/2 h-[clamp(250px,27.78vw,400px)] overflow-hidden rounded-b-[20px] md:rounded-bl-none md:rounded-br-[20px]">
              <img
                src="/why-us-gallery-bottom-right.webp"
                alt=""
                className="absolute w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#8f7b49] py-[clamp(60px,6.94vw,100px)] px-[clamp(20px,3.47vw,50px)]">
        <div className="max-w-[1340px] mx-auto text-center">
          <h2
            className="text-[clamp(32px,4.17vw,60px)] font-medium leading-[1.11] text-white mb-[clamp(16px,1.39vw,20px)]"
            style={{
              fontFamily: "Montserrat, sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            {translate({
              ru: "Готовы к приключениям?",
              uz: "Sarguzashtlarga tayyormisiz?",
              en: "Ready for adventures?",
              de: "Bereit fur Abenteuer?",
            })}
          </h2>
          <p
            className="text-[clamp(16px,1.39vw,20px)] font-normal leading-[1.5] text-white/80 mb-[clamp(30px,2.78vw,40px)] max-w-[600px] mx-auto"
            style={{
              fontFamily: "Montserrat, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {translate({
              ru: "Свяжитесь с нами и мы поможем подобрать идеальный тур для вас",
              uz: "Biz bilan bog'laning va biz sizga ideal turni tanlashda yordam beramiz",
              en: "Contact us and we will help you choose the perfect tour for you",
              de: "Kontaktieren Sie uns und wir helfen Ihnen, die perfekte Tour fur Sie zu finden",
            })}
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-[#333333] hover:bg-[#1a1a1a] transition-colors rounded-[10px] px-[clamp(32px,3.89vw,56px)] py-[clamp(16px,2.08vw,30px)] h-[clamp(52px,5.56vw,80px)] flex items-center justify-center cursor-pointer mx-auto"
          >
            <p
              className="text-white text-[clamp(14px,1.39vw,20px)] font-bold leading-[1] tracking-[-0.02em] whitespace-pre"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {translate({
                ru: "Связаться с нами",
                uz: "Biz bilan bog'lanish",
                en: "Contact us",
                de: "Kontaktieren Sie uns",
              })}
            </p>
          </button>
        </div>
      </section>
    </div>
  );
};

export default TourismTypesPage;
