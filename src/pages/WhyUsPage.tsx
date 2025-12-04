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
            <section id="routes" className="mb-[60px]">
              <h2
                className="text-[60px] font-medium leading-[1] text-[#333333] mb-[40px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                {t("whyUs.section1.title")}
              </h2>
              <div
                className="text-[24px] font-normal leading-[1.67] text-[#333333]"
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

            <section className="mb-[60px]">
              <div className="relative h-[500px] w-full rounded-t-[20px] overflow-hidden">
                <img
                  src="/why-us-gallery-top.webp"
                  alt={t("whyUs.gallery.altForestPath")}
                  className="absolute w-full h-full object-cover"
                />
              </div>
              <div className="flex">
                <div className="relative w-1/2 h-[586px] overflow-hidden rounded-bl-[20px]">
                  <img
                    src="/why-us-gallery-bottom-left.webp"
                    alt={t("whyUs.gallery.altRiverValley")}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
                <div className="relative w-1/2 h-[586px] overflow-hidden rounded-br-[20px]">
                  <img
                    src="/why-us-gallery-bottom-right.webp"
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
            <section className="mb-[60px]">
              <h2
                className="text-[60px] font-medium leading-[1] text-[#333333] mb-[40px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                Знакомство с первозданной природой
              </h2>
              <div
                className="text-[24px] font-normal leading-[1.67] text-[#333333]"
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

            <section className="mb-[60px]">
              <div className="flex gap-0">
                <div className="relative w-1/2 h-[586px] overflow-hidden rounded-l-[20px]">
                  <img
                    src="/why-us-gallery-bottom-left.webp"
                    alt={t("whyUs.gallery.altRiverValley")}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
                <div className="relative w-1/2 h-[586px] overflow-hidden rounded-r-[20px]">
                  <img
                    src="/why-us-gallery-bottom-right.webp"
                    alt={t("whyUs.gallery.altMountain")}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>
          </>
        );

      case "comfort":
        return (
          <>
            <section id="comfort" className="mb-[60px]">
              <h2
                className="text-[60px] font-medium leading-[1] text-[#333333] mb-[40px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                Комфортное проживание
              </h2>
              <div
                className="text-[24px] font-normal leading-[1.67] text-[#333333]"
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
          </>
        );

      case "team":
        return (
          <>
            <section id="team" className="mb-[60px]">
              <h2
                className="text-[60px] font-medium leading-[1] text-[#333333] mb-[40px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                Команда специалистов
              </h2>
              <div
                className="text-[24px] font-normal leading-[1.67] text-[#333333]"
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

            <section className="mb-[60px]">
              <div className="relative h-[400px] w-full rounded-[20px] overflow-hidden">
                <img
                  src="/why-us-team.webp"
                  alt="Команда специалистов DJIDALI"
                  className="absolute w-full h-full object-cover object-center"
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
      <header className="relative h-screen overflow-hidden flex flex-col">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/why-us-hero.webp"
            alt=""
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full px-[50px]">
          <div className="max-w-[1340px] mx-auto h-full flex flex-col">
            {/* Title and Description */}
            <div className="mt-[210px] mb-auto">
              <h1
                className="text-[90px] font-medium leading-[100px] mb-[20px] text-white max-w-[1340px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-2.7px",
                }}
              >
                {t("whyUs.hero.title")}
              </h1>
              <p
                className="text-[32px] font-normal leading-[40px] opacity-80 whitespace-pre-wrap text-white max-w-[1340px]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.96px",
                }}
              >
                {t("whyUs.hero.description")}
              </p>
            </div>

            {/* Statistics */}
            <div className="flex flex-col md:flex-row gap-[80px] text-white pb-[clamp(40px,5.56vw,80px)]">
              {heroStats.map((stat, index) => (
                <div key={index} className="w-[304px]">
                  <div
                    className="mb-[10px] whitespace-nowrap"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "-1px",
                    }}
                  >
                    <span className="text-[80px] font-normal leading-[80px]">
                      {stat.value}
                    </span>
                    <span className="text-[50px] font-extralight leading-[80px]">
                      {" "}
                      {stat.suffix}
                    </span>
                  </div>
                  <p
                    className="text-[20px] font-light leading-[28px]"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "-0.4px",
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
        className="bg-[#F5F5F0] mt-[80px] px-[50px]"
      >
        <div className="flex items-center h-[80px] max-w-[1340px] mx-auto">
          {/* Уникальные маршруты */}
          <button
            onClick={() => setActiveCategory("routes")}
            className={`${
              activeCategory === "routes" ? "bg-[#8F7B49]" : "bg-transparent"
            } rounded-[10px] flex items-center justify-center w-[320px] h-full cursor-pointer transition-colors`}
          >
            <p
              className={`font-semibold text-[22px] leading-[24px] text-center ${
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
          {/* Знакомство с первозданной природой */}
          <button
            onClick={() => setActiveCategory("nature")}
            className={`${
              activeCategory === "nature" ? "bg-[#8F7B49]" : "bg-transparent"
            } rounded-[10px] flex items-center justify-center w-[380px] h-full cursor-pointer transition-colors`}
          >
            <p
              className={`font-semibold text-[22px] leading-[24px] text-center ${
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
          {/* Комфортное проживание */}
          <button
            onClick={() => setActiveCategory("comfort")}
            className={`${
              activeCategory === "comfort" ? "bg-[#8F7B49]" : "bg-transparent"
            } rounded-[10px] flex items-center justify-center w-[320px] h-full cursor-pointer transition-colors`}
          >
            <p
              className={`font-semibold text-[22px] leading-[24px] text-center ${
                activeCategory === "comfort" ? "text-white" : "text-[#333333]"
              }`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "-0.44px",
              }}
              dangerouslySetInnerHTML={{
                __html: t("whyUs.categories.comfort").replace(/\n/g, "<br />"),
              }}
            />
          </button>
          {/* Команда специалистов */}
          <button
            onClick={() => setActiveCategory("team")}
            className={`${
              activeCategory === "team" ? "bg-[#8F7B49]" : "bg-transparent"
            } rounded-[10px] flex items-center justify-center w-[320px] h-full cursor-pointer transition-colors`}
          >
            <p
              className={`font-semibold text-[22px] leading-[24px] text-center ${
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
      </section>

      {/* Main Content */}
      <main className="bg-[#F5F5F0] mt-[60px] px-[50px] pb-[60px]">
        <div className="max-w-[1340px] mx-auto">{renderContent()}</div>
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default WhyUsPage;
