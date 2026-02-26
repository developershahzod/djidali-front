import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import ScrollToTopButton from "../components/ScrollToTopButton";

type CategoryType = "routes" | "nature" | "comfort" | "team";

const WhyUsPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryType>("routes");
  const categoryNavRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as CategoryType;
      const validCategories: CategoryType[] = [
        "routes",
        "nature",
        "comfort",
        "team",
      ];

      if (validCategories.includes(hash)) {
        setActiveCategory(hash);
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (categoryNavRef.current) {
      const offset = 80;
      const elementPosition =
        categoryNavRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [activeCategory]);

  const heroStats = useMemo(
    () => [
      {
        value: t("whyUs.hero.stat1Value"),
        suffix: t("whyUs.hero.stat1Suffix"),
        label: t("whyUs.hero.stat1Label"),
      },
      {
        value: t("whyUs.hero.stat2Value"),
        suffix: t("whyUs.hero.stat2Suffix"),
        label: t("whyUs.hero.stat2Label"),
      },
      {
        value: t("whyUs.hero.stat3Value"),
        suffix: t("whyUs.hero.stat3Suffix"),
        label: t("whyUs.hero.stat3Label"),
      },
    ],
    [t],
  );

  const renderContent = () => {
    switch (activeCategory) {
      case "routes":
        return (
          <>
            <section className="mb-10 md:mb-[60px]">
              <h2
                className="text-3xl md:text-5xl lg:text-[60px] font-medium leading-[1.1] text-[#333333] mb-6 md:mb-[40px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                {t("whyUs.section1.title")}
              </h2>
              <div
                className="text-base md:text-xl lg:text-[24px] font-normal leading-[1.67] text-[#333333]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                <p className="mb-4">
                  Мы - не просто локация на карте. Мы - пространство, где
                  природа оживает, отдых наполняется смыслом, а впечатления
                  остаются в сердце навсегда!
                </p>
                <p className="mb-4">
                  Уникальная природа Узбекистана: тысячи гектаров первозданных
                  лесов, степей и водоемов. Здесь каждый сезон по-своему
                  прекрасен, а каждый день наполнен дыханием живого мира.
                </p>
                <p className="mb-4">
                  Разнообразие активностей: от неспешных прогулок и агро туров
                  до стендовой стрельбы и охотничьих маршрутов. Выбирайте отдых
                  под настроение - активный, созерцательный или душевный.
                </p>
                <p className="mb-4">
                  Профессионализм и безопасность: опытные егеря,
                  квалифицированные инструкторы, грамотная организация - мы
                  позаботимся о Вашем комфорте и безопасности на каждом шагу.
                </p>
                <p className="mb-4">
                  Экологичный подход и любовь к земле: мы уважаем природу и
                  помогаем другим прочувствовать ее силу и красоту. Каждый наш
                  маршрут, каждый проект - создан с заботой об окружающей среде.
                </p>
                <p className="mb-4">
                  Атмосфера уюта и искреннего гостеприимства: мы не предлагаем
                  просто услуги - мы приглашаем в атмосферу, где Вам захочется
                  остаться надолго. Здесь вас ждет теплый прием, всестороннее
                  внимание и настоящий душевный отдых.
                </p>
                <p>
                  Идеальное место для всех категорий: семейный уикенд,
                  корпоративный выезд, романтическое приключение или одиночное
                  погружение в тишину — у нас найдётся формат для каждого.
                </p>
              </div>
            </section>

            <section className="mb-10 md:mb-[60px]">
              <div className="relative h-[250px] md:h-[400px] lg:h-[500px] w-full rounded-t-[20px] overflow-hidden">
                <img
                  src="/whyus-routes.webp"
                  alt={t("whyUs.gallery.altForestPath")}
                  className="absolute w-full h-full object-cover"
                />
              </div>
              <div className="flex">
                <div className="relative w-1/2 h-[200px] md:h-[400px] lg:h-[586px] overflow-hidden rounded-bl-[20px]">
                  <img
                    src="/whyus-nature.webp"
                    alt={t("whyUs.gallery.altRiverValley")}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
                <div className="relative w-1/2 h-[200px] md:h-[400px] lg:h-[586px] overflow-hidden rounded-br-[20px]">
                  <img
                    src="/whyus-comfort.webp"
                    alt={t("whyUs.gallery.altMountain")}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>
          </>
        );

      case "nature":
        return (
          <>
            <section className="mb-10 md:mb-[60px]">
              <h2
                className="text-3xl md:text-5xl lg:text-[60px] font-medium leading-[1.1] text-[#333333] mb-6 md:mb-[40px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                Знакомство с первозданной природой
              </h2>
              <div
                className="text-base md:text-xl lg:text-[24px] font-normal leading-[1.67] text-[#333333]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                <p className="mb-4">
                  Знакомство с первозданной природой - это то, что делает наш
                  формат отдыха по-настоящему ценным и незабываемым. На
                  территории лесоохотничьего хозяйства вы не найдете
                  искусственно созданных пейзажей или перегруженной
                  инфраструктуры - только настоящая природа, сохранённая в своем
                  естественном виде.
                </p>
                <p className="mb-4">
                  Наши гости получают редкую возможность наблюдать за жизнью
                  леса без искажений: чистый воздух, живописные ландшафты,
                  нетронутые участки леса и водоемов. Это не просто прогулка -
                  это возвращение к истокам, к тишине, которую может подарить
                  только природа.
                </p>
                <p className="mb-4">
                  Мы тщательно сохраняем экологический баланс, следим за тем,
                  чтобы каждый визит оставлял после себя только впечатления, а
                  не следы вмешательства. Здесь можно увидеть, как функционируют
                  природные процессы, как взаимодействуют виды, как выглядит
                  настоящий лес, живущий по своим законам.
                </p>
                <p>
                  Такое знакомство наполняет особым смыслом и помогает
                  пересмотреть отношение к окружающему миру. Это опыт, который
                  останется с вами надолго!
                </p>
              </div>
            </section>

            <section className="mb-10 md:mb-[60px]">
              <div className="relative h-[250px] md:h-[400px] lg:h-[500px] w-full rounded-[20px] overflow-hidden">
                <img
                  src="/whyus-nature.webp"
                  alt={t("whyUs.gallery.altRiverValley")}
                  className="absolute w-full h-full object-cover"
                />
              </div>
            </section>
          </>
        );

      case "comfort":
        return (
          <>
            <section id="comfort" className="mb-10 md:mb-[60px]">
              <h2
                className="text-3xl md:text-5xl lg:text-[60px] font-medium leading-[1.1] text-[#333333] mb-6 md:mb-[40px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                Комфортное проживание
              </h2>
              <div
                className="text-base md:text-xl lg:text-[24px] font-normal leading-[1.67] text-[#333333]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                <p className="mb-4">
                  Комфортное проживание - важная часть нашего подхода к
                  организации полноценного и качественного отдыха. Мы стремимся
                  создать условия, в которых природа и удобство гармоничны друг
                  с другом, позволяя гостям расслабиться, восстановиться и
                  чувствовать себя максимально уютно.
                </p>
                <p className="mb-4">
                  На территории лесоохотничьего хозяйства предусмотрены варианты
                  размещения, соответствующие различным предпочтениям и
                  стандартам: от уединённых домиков до уютных гостевых помещений
                  для семейных групп. Все объекты оборудованы необходимыми
                  современными удобствами, включая санитарные зоны,
                  электричество, места для отдыха и хранения вещей и т.д.
                </p>
                <p className="mb-4">
                  Каждая деталь в организации проживания продумана с учётом
                  потребностей современного гостя, но без излишней урбанизации.
                  Мы сохраняем атмосферу природного спокойствия, обеспечивая при
                  этом высокий уровень сервиса.
                </p>
                <p>
                  Такой формат размещения позволяет наслаждаться природой без
                  необходимости жертвовать привычным комфортом. Это идеальный
                  баланс между дикой средой и условиями, к которым вы привыкли.
                </p>
              </div>
            </section>

            <section className="mb-10 md:mb-[60px]">
              <div className="relative h-[250px] md:h-[400px] lg:h-[500px] w-full rounded-[20px] overflow-hidden">
                <img
                  src="/whyus-comfort.webp"
                  alt="Комфортное проживание"
                  className="absolute w-full h-full object-cover"
                />
              </div>
            </section>
          </>
        );

      case "team":
        return (
          <>
            <section id="team" className="mb-10 md:mb-[60px]">
              <h2
                className="text-3xl md:text-5xl lg:text-[60px] font-medium leading-[1.1] text-[#333333] mb-6 md:mb-[40px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                Команда специалистов
              </h2>
              <div
                className="text-base md:text-xl lg:text-[24px] font-normal leading-[1.67] text-[#333333]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                <p className="mb-4">
                  Наша команда - это основа доверия и качества, с которыми мы
                  подходим к каждому аспекту работы. Здесь трудятся специалисты
                  с глубокими знаниями, практическим опытом и искренней любовью
                  к природе. Мы не просто организуем досуг - мы создаем
                  содержательные, безопасные и по-настоящему запоминающиеся
                  форматы пребывания на природе.
                </p>
                <p className="mb-4">
                  В составе команды - профессиональные гиды, биологи и
                  орнитологи, лесники и егеря, инструкторы и т.д. Каждый из них
                  - специалист в своей области, который не только сопровождает
                  гостей, но и делится знаниями, раскрывает уникальные
                  особенности ландшафтов, экосистем и поведенческих моделей
                  диких животных.
                </p>
                <p className="mb-4">
                  Благодаря их работе вы можете чувствовать себя уверенно и
                  свободно, погружаясь в атмосферу первозданной природы. Мы
                  умеем находить подход к различной аудитории - от семей с
                  детьми до корпоративных групп, от начинающих туристов до
                  опытных натуралистов.
                </p>
                <p>
                  Слаженность команды и профессионализм - вот что делает ваш
                  отдых с нами особенным!
                </p>
              </div>
            </section>

            <section className="mb-10 md:mb-[60px]">
              <div className="w-full rounded-[20px] overflow-hidden">
                <img
                  src="/whyus-team.webp"
                  alt="Команда специалистов DJIDALI"
                  className="w-full h-auto object-contain"
                />
              </div>
            </section>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1C160D]">
      <header className="relative h-[80vh] md:h-screen overflow-hidden flex flex-col">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/whyus-banner.webp"
            alt=""
            className="absolute w-full h-full object-cover"
          />
          {/* Gradient overlay: darker at top and bottom for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full px-5 md:px-[50px] pt-20 md:pt-24">
          <div className="max-w-[1340px] mx-auto h-full flex flex-col justify-center">
            {/* Title and Description */}
            <div className="mb-6 md:mb-10">
              <h1
                className="text-4xl md:text-[clamp(40px,5.5vw,90px)] font-medium leading-[1.1] mb-4 md:mb-[20px] text-white max-w-[1340px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-2.7px",
                  textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)",
                }}
              >
                {t("whyUs.hero.title")}
              </h1>
              <p
                className="text-lg md:text-[clamp(20px,2.2vw,32px)] font-normal leading-[1.4] opacity-90 whitespace-pre-wrap text-white max-w-[1340px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.96px",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
                }}
              >
                {t("whyUs.hero.description")}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-x-6 md:gap-x-[clamp(40px,5.56vw,80px)] gap-y-4 md:gap-y-[clamp(24px,2.78vw,40px)] text-white max-w-[640px]">
              {heroStats.map((stat, index) => (
                <div key={index}>
                  <div
                    className="mb-1 md:mb-[8px] whitespace-nowrap"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "-1px",
                      textShadow: "0 2px 15px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <span className="text-4xl md:text-[clamp(48px,5.56vw,80px)] font-normal leading-[1]">
                      {stat.value}
                    </span>
                    <span className="text-2xl md:text-[clamp(32px,3.47vw,50px)] font-extralight leading-[1]">
                      {" "}
                      {stat.suffix}
                    </span>
                  </div>
                  <p
                    className="text-xs md:text-[clamp(14px,1.39vw,20px)] font-light leading-[1.4]"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "-0.4px",
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <section
        ref={categoryNavRef}
        className="bg-[#F5F5F0] mt-10 md:mt-[80px] px-4 md:px-[50px]"
      >
        <div className="max-w-[1340px] mx-auto">
          {/* Mobile: 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 md:hidden">
            {(
              [
                {
                  key: "routes" as CategoryType,
                  label: t("whyUs.categories.routes"),
                },
                {
                  key: "nature" as CategoryType,
                  label: t("whyUs.categories.nature"),
                },
                {
                  key: "comfort" as CategoryType,
                  label: t("whyUs.categories.comfort"),
                },
                {
                  key: "team" as CategoryType,
                  label: t("whyUs.categories.team"),
                },
              ] as const
            ).map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`${
                  activeCategory === cat.key
                    ? "bg-[#8F7B49] text-white shadow-md"
                    : "bg-white text-[#333333] border border-gray-200"
                } rounded-xl px-3 py-4 flex items-center justify-center cursor-pointer transition-all`}
              >
                <p
                  className="font-semibold text-[13px] leading-[18px] text-center"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "-0.3px",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: cat.label.replace(/\n/g, "<br />"),
                  }}
                />
              </button>
            ))}
          </div>

          {/* Desktop: horizontal row */}
          <div className="hidden md:flex items-center h-[80px]">
            <button
              onClick={() => setActiveCategory("routes")}
              className={`${
                activeCategory === "routes" ? "bg-[#8F7B49]" : "bg-transparent"
              } rounded-[10px] flex items-center justify-center w-[320px] h-full cursor-pointer transition-colors`}
            >
              <p
                className={`font-semibold text-lg lg:text-[22px] leading-[24px] text-center ${
                  activeCategory === "routes" ? "text-white" : "text-[#333333]"
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.44px",
                }}
                dangerouslySetInnerHTML={{
                  __html: t("whyUs.categories.routes").replace(/\n/g, "<br />"),
                }}
              />
            </button>
            <button
              onClick={() => setActiveCategory("nature")}
              className={`${
                activeCategory === "nature" ? "bg-[#8F7B49]" : "bg-transparent"
              } rounded-[10px] flex items-center justify-center w-[380px] h-full cursor-pointer transition-colors`}
            >
              <p
                className={`font-semibold text-lg lg:text-[22px] leading-[24px] text-center ${
                  activeCategory === "nature" ? "text-white" : "text-[#333333]"
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.44px",
                }}
                dangerouslySetInnerHTML={{
                  __html: t("whyUs.categories.nature").replace(/\n/g, "<br />"),
                }}
              />
            </button>
            <button
              onClick={() => setActiveCategory("comfort")}
              className={`${
                activeCategory === "comfort" ? "bg-[#8F7B49]" : "bg-transparent"
              } rounded-[10px] flex items-center justify-center w-[320px] h-full cursor-pointer transition-colors`}
            >
              <p
                className={`font-semibold text-lg lg:text-[22px] leading-[24px] text-center ${
                  activeCategory === "comfort" ? "text-white" : "text-[#333333]"
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.44px",
                }}
                dangerouslySetInnerHTML={{
                  __html: t("whyUs.categories.comfort").replace(
                    /\n/g,
                    "<br />",
                  ),
                }}
              />
            </button>
            <button
              onClick={() => setActiveCategory("team")}
              className={`${
                activeCategory === "team" ? "bg-[#8F7B49]" : "bg-transparent"
              } rounded-[10px] flex items-center justify-center w-[320px] h-full cursor-pointer transition-colors`}
            >
              <p
                className={`font-semibold text-lg lg:text-[22px] leading-[24px] text-center ${
                  activeCategory === "team" ? "text-white" : "text-[#333333]"
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.44px",
                }}
                dangerouslySetInnerHTML={{
                  __html: t("whyUs.categories.team").replace(/\n/g, "<br />"),
                }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-[#F5F5F0] mt-8 md:mt-[60px] px-5 md:px-[50px] pb-10 md:pb-[60px]">
        <div className="max-w-[1340px] mx-auto">{renderContent()}</div>
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default WhyUsPage;
