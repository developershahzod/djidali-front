import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import ScrollToTopButton from "../components/ScrollToTopButton";
import RequestProgramModal from "../components/RequestProgramModal";

const NewAboutPage: React.FC = () => {
  const { translate, t } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [showAllTeam, setShowAllTeam] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [stats] = useState({
    yearsOfExperience: 6,
    tourPackages: 100,
    happyTravelers: 250,
    regularClients: 100,
  });

  // Statistics are now static values, no need to fetch from API
  // Values: 100+ постоянных клиентов, 5+ лет опыта, 250+ счастливых посетителей

  const whyUsFeatures = [
    {
      title: translate({
        ru: "Первозданная красота природы",
        uz: "Tabiatning dastlabki go'zalligi",
        en: "Pristine Natural Beauty",
        de: "Unberührte natürliche Schönheit",
      }),
      description: [
        translate({
          ru: "Здесь вы познакомитесь с природой в её настоящем, нетронутом виде.",
          uz: "Bu yerda siz tabiatni haqiqiy, tegilmagan ko'rinishida tanib olasiz.",
          en: "Here you will discover nature in its true, untouched form.",
          de: "Hier entdecken Sie die Natur in ihrer wahren, unberührten Form.",
        }),
        translate({
          ru: "На территории нет искусственно созданных пейзажей или перегруженной инфраструктуры — только тишина, чистый воздух и живая экосистема, сохранённая в своей первозданной красоте.",
          uz: "Hududda sun'iy yaratilgan manzaralar yoki haddan tashqari infratuzilma yo'q - faqat sukunat, toza havo va o'zining dastlabki go'zalligida saqlanib qolgan tirik ekotizim.",
          en: "There are no artificially created landscapes or overloaded infrastructure - only silence, clean air, and a living ecosystem preserved in its pristine beauty.",
          de: "Es gibt keine künstlich geschaffenen Landschaften oder überlastete Infrastruktur - nur Stille, saubere Luft und ein lebendiges Ökosystem in seiner ursprünglichen Schönheit.",
        }),
      ],
      image: "/why-us-comfort.webp",
      highlight: translate({
        ru: "Знакомство с первозданной природой",
        uz: "Dastlabki tabiat bilan tanishuv",
        en: "Discovering Pristine Nature",
        de: "Entdeckung unberührter Natur",
      }),
    },
    {
      title: translate({
        ru: "Команда специалистов",
        uz: "Mutaxassislar jamoasi",
        en: "Team of Specialists",
        de: "Team von Spezialisten",
      }),
      description: [
        translate({
          ru: "В Dalverzin вас сопровождает команда гидов и координаторов, для которых важны детали: тайминг, безопасность, комфорт и уважение к природе.",
          uz: "Dalverzinda sizni gidlar va koordinatorlar jamoasi kuzatib boradi, ular uchun tafsilotlar muhim: vaqt, xavfsizlik, qulaylik va tabiatga hurmat.",
          en: "At Dalverzin, you're accompanied by a team of guides and coordinators who care about the details: timing, safety, comfort, and respect for nature.",
          de: "In Dalverzin begleitet Sie ein Team von Guides und Koordinatoren, denen Details wichtig sind: Timing, Sicherheit, Komfort und Respekt vor der Natur.",
        }),
      ],
      image: "/10.webp",
      highlight: translate({
        ru: "Профессиональное сопровождение",
        uz: "Professional hamrohlik",
        en: "Professional Guidance",
        de: "Professionelle Begleitung",
      }),
    },
    {
      title: translate({
        ru: "Комфортные условия",
        uz: "Qulay sharoitlar",
        en: "Comfortable Conditions",
        de: "Komfortable Bedingungen",
      }),
      description: [
        translate({
          ru: "Мы продумали индивидуальный комфорт на территории: зоны отдыха, питание по программе и понятный тайминг.",
          uz: "Biz hududda individual qulaylikni o'ylab chiqdik: dam olish zonalari, dastur bo'yicha ovqatlanish va aniq vaqt jadvali.",
          en: "We've designed individual comfort throughout the territory: relaxation zones, scheduled dining, and clear timing.",
          de: "Wir haben individuellen Komfort auf dem Gelände durchdacht: Ruhezonen, Verpflegung nach Programm und klares Timing.",
        }),
      ],
      image: "/why-us-comfort.webp",
      highlight: translate({
        ru: "Комфорт в гармонии с природой",
        uz: "Tabiat bilan uyg'unlikdagi qulaylik",
        en: "Comfort in Harmony with Nature",
        de: "Komfort im Einklang mit der Natur",
      }),
    },
    {
      title: translate({
        ru: "Уникальные маршруты",
        uz: "Noyob marshrutlar",
        en: "Unique Routes",
        de: "Einzigartige Routen",
      }),
      description: [
        translate({
          ru: "Мы составили природные маршруты разного темпа и сложности — от лёгких прогулок до более активных сценариев. Каждый маршрут подбираем под сезон, погоду и вашу группу.",
          uz: "Biz turli sur'at va murakkablikdagi tabiiy marshrutlarni tuzdik — engil sayrlardan faolroq stsenariylargacha. Har bir marshrutni mavsumga, ob-havoga va guruhingizga moslashtiramiz.",
          en: "We've designed nature trails of varying pace and difficulty — from easy walks to more active scenarios. Each route is tailored to the season, weather, and your group.",
          de: "Wir haben Naturrouten unterschiedlichen Tempos und Schwierigkeitsgrads zusammengestellt — von leichten Spaziergängen bis zu aktiveren Szenarien. Jede Route wird an Saison, Wetter und Ihre Gruppe angepasst.",
        }),
        translate({
          ru: "Маршруты проходят через видовые участки и места, где природу легче почувствовать и наблюдать. Мы не гарантируем встречи с животными — но выбираем треки так, чтобы шанс был выше.",
          uz: "Marshrutlar manzarali joylar va tabiatni his qilish va kuzatish osonroq bo'lgan joylardan o'tadi. Biz hayvonlar bilan uchrashuvni kafolatlamaymiz — lekin imkoniyat yuqoriroq bo'lishi uchun treklarni tanlaymiz.",
          en: "Routes pass through scenic areas and places where nature is easier to feel and observe. We don't guarantee wildlife encounters — but we choose tracks to maximize your chances.",
          de: "Die Routen führen durch landschaftlich reizvolle Gebiete und Orte, wo die Natur leichter zu spüren und zu beobachten ist. Wir garantieren keine Tierbegegnungen — aber wir wählen die Wege so, dass die Chance höher ist.",
        }),
      ],
      image: "/why-us-routes.webp",
      highlight: translate({
        ru: "Эксклюзивные маршруты",
        uz: "Eksklyuziv marshrutlar",
        en: "Exclusive Routes",
        de: "Exklusive Routen",
      }),
    },
  ];

  const currentFeature = whyUsFeatures[currentSlide];



  return (
    <div className="bg-[#f4f2ed]">
      {/* Hero Section */}
      <header className="relative h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            alt=""
            className="w-full h-full object-cover"
            src="/about-banner.webp"
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full">
          <div className="absolute bottom-[clamp(100px,11.11vw,160px)] left-1/2 -translate-x-1/2 w-full max-w-[min(1440px,90vw)] px-[clamp(30px,3.47vw,50px)]">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
              {/* Title */}
              <div className="flex-1 md:max-w-[69.3%]">
                <h1
                  className="text-[clamp(40px,5.56vw,80px)] font-medium leading-[1.2] text-white tracking-[-0.03em]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t("aboutPage.hero.title")}
                </h1>
              </div>

              {/* Stats Card */}
              <div className="flex flex-col gap-[clamp(24px,2.78vw,40px)] w-[clamp(200px,21.67vw,312px)] md:w-auto">
                <div className="relative w-[clamp(60px,5.56vw,80px)] h-[clamp(60px,5.56vw,80px)]">
                  <img
                    alt=""
                    className="w-full h-full"
                    src="/about-icon-airplane-bg.svg"
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%]">
                    <img
                      alt=""
                      className="w-full h-full"
                      src="/about-icon-airplane.svg"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[4px] text-white">
                  <p
                    className="font-normal leading-[1] tracking-[-1px]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <span className="text-[clamp(36px,3.47vw,50px)]">
                      {stats.regularClients}
                    </span>
                    <span className="text-[clamp(28px,2.78vw,40px)] font-extralight">
                      +
                    </span>
                  </p>
                  <p
                    className="font-light text-[clamp(16px,1.39vw,20px)] leading-[1.4] tracking-[-0.02em] whitespace-nowrap"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <span>
                      {t("aboutPage.hero.statsClients")
                        .split(" ")
                        .slice(0, -1)
                        .join(" ")}{" "}
                    </span>
                    <span className="font-semibold">
                      {t("aboutPage.hero.statsClients").split(" ").slice(-1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Help Section */}
      <section className="bg-white">
        <div className="flex flex-col md:flex-row max-w-[100vw]">
          {/* Left Content */}
          <div className="flex-1 py-[clamp(50px,5.56vw,80px)] px-[clamp(30px,3.47vw,50px)] md:max-w-[min(720px,50vw)]">
            <div className="flex flex-col gap-[clamp(16px,1.39vw,20px)] mb-[clamp(30px,2.78vw,40px)] text-[#333333]">
              <h2
                className="text-[clamp(24px,2.78vw,40px)] font-medium leading-[1.2] tracking-[-0.03em]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {t("aboutPage.help.title")}
              </h2>
              <p
                className="text-[clamp(16px,1.39vw,20px)] font-normal leading-[1.5] tracking-[-0.02em]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {t("aboutPage.help.description")}
              </p>
            </div>
            <button
              onClick={() => navigate("/tours")}
              className="bg-[#8f7b49] hover:bg-[#7a6939] transition-colors rounded-[10px] px-[clamp(40px,3.89vw,56px)] py-[clamp(20px,2.08vw,30px)] h-[clamp(60px,5.56vw,80px)] flex items-center justify-center cursor-pointer"
            >
              <p
                className="text-white text-[clamp(16px,1.39vw,20px)] font-bold leading-[1] tracking-[-0.02em] whitespace-pre"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {t("aboutPage.help.cta")}
              </p>
            </button>

            {/* Mission and Guide Sections */}
            <div className="mt-[clamp(60px,7.22vw,104px)] flex flex-col md:flex-row gap-[clamp(40px,5.56vw,80px)]">
              {/* Mission Section */}
              <div className="flex flex-col gap-[clamp(16px,1.39vw,20px)] flex-1">
                <div className="w-[clamp(70px,6.25vw,90px)] h-[clamp(70px,6.25vw,90px)]">
                  <img
                    src="/about-icon-stewardess.svg"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col gap-[clamp(12px,1.11vw,16px)] tracking-[-0.02em]">
                  <p
                    className="text-[#0f2825] text-[clamp(18px,1.67vw,24px)] font-medium leading-[1.25]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {t("aboutPage.mission.title")}
                  </p>
                  <p
                    className="text-[#333333] text-[clamp(14px,1.11vw,16px)] font-normal leading-[1.75]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {t("aboutPage.mission.description")}
                  </p>
                </div>
              </div>

              {/* Guide Section */}
              <div className="flex flex-col gap-[clamp(16px,1.39vw,20px)] flex-1">
                <div className="w-[clamp(70px,6.25vw,90px)] h-[clamp(70px,6.25vw,90px)]">
                  <img
                    src="/about-icon-map.svg"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col gap-[clamp(12px,1.11vw,16px)] tracking-[-0.02em]">
                  <p
                    className="text-[#0f2825] text-[clamp(18px,1.67vw,24px)] font-medium leading-[1.25]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {t("aboutPage.guide.title")}
                  </p>
                  <p
                    className="text-[#333333] text-[clamp(14px,1.11vw,16px)] font-normal leading-[1.75]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {t("aboutPage.guide.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 min-h-[clamp(400px,62.5vw,900px)] hidden md:block">
            <img
              alt=""
              className="w-full h-full object-cover"
              src="/about-info-1.webp"
            />
          </div>
        </div>
      </section>

      {/* Why Us Section */}

      {/* Video Section */}
      <section className="bg-[#f4f2ed] py-[clamp(30px,3.47vw,50px)]">
        <div className="max-w-[min(1440px,90vw)] mx-auto px-[clamp(30px,3.47vw,50px)]">
          <div className="relative aspect-[2.06/1] rounded-[clamp(12px,1.39vw,20px)] overflow-hidden">
            {isVideoPlaying ? (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/ihmbZn81aX0?autoplay=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0"
              />
            ) : (
              <div
                className="relative w-full h-full cursor-pointer group"
                onClick={() => setIsVideoPlaying(true)}
              >
                <img
                  alt=""
                  className="w-full h-full object-cover"
                  src="/dc3d98eef0e770b0733e6c1cac8c4f9c3f97c42e.webp"
                />
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)] group-hover:bg-[rgba(0,0,0,0.3)] transition-colors duration-300" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[clamp(60px,6.94vw,100px)] h-[clamp(60px,6.94vw,100px)] bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-opacity-100 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                    <svg
                      className="w-[clamp(24px,2.78vw,40px)] h-[clamp(24px,2.78vw,40px)] ml-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" fill="#333333" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="bg-[#b4a785]">
        <div className="flex flex-col md:flex-row max-w-[100vw]">
          {/* Left Image */}
          <div className="flex-1 min-h-[clamp(300px,45.14vw,650px)] hidden md:block">
            <img
              alt=""
              className="w-full h-full object-cover"
              src="/about-info-2.webp"
            />
          </div>

          {/* Right Content */}
          <div className="flex-1 py-[clamp(30px,3.47vw,50px)] px-[clamp(20px,1.81vw,26px)] relative">
            <div className="flex flex-col gap-[clamp(30px,2.78vw,40px)] md:max-w-[89.4%]">
              <div
                className="flex flex-col gap-[clamp(16px,1.39vw,20px)] text-white font-medium"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <h2 className="text-[clamp(28px,3.33vw,48px)] leading-[1.15] tracking-[-0.02em] font-semibold">
                  {t("aboutPage.professionals.title")}
                </h2>
                <p className="text-[clamp(14px,1.25vw,18px)] leading-[1.6] tracking-[-0.01em] opacity-90 md:max-w-[65%]">
                  {t("aboutPage.professionals.description")}
                </p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-[#333333] hover:bg-[#1a1a1a] transition-colors rounded-[10px] px-[clamp(40px,3.89vw,56px)] py-[clamp(20px,2.08vw,30px)] h-[clamp(60px,5.56vw,80px)] flex items-center justify-center cursor-pointer"
              >
                <p
                  className="text-white text-[clamp(16px,1.39vw,20px)] font-bold leading-[1] tracking-[-0.02em] whitespace-pre"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t("aboutPage.professionals.cta")}
                </p>
              </button>
            </div>

            <div className="mt-[clamp(50px,5.83vw,84px)] flex flex-col gap-[clamp(30px,2.78vw,40px)] max-w-[62.8%]">
              <div className="flex gap-[clamp(20px,1.88vw,27px)]">
                <div className="flex flex-col gap-[clamp(8px,0.69vw,10px)] text-white flex-1">
                  <p
                    className="font-normal leading-[1] tracking-[-1px]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <span className="text-[clamp(36px,3.47vw,50px)]">
                      {stats.yearsOfExperience}{" "}
                    </span>
                    <span className="font-extralight text-[clamp(28px,2.78vw,40px)]">
                      +
                    </span>
                  </p>
                  <p
                    className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4] tracking-[-0.02em]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {t("aboutPage.professionals.statsYears")}
                  </p>
                </div>
                <div className="flex flex-col gap-[clamp(8px,0.69vw,10px)] text-white flex-1">
                  <p
                    className="font-normal leading-[1] tracking-[-1px]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <span className="text-[clamp(36px,3.47vw,50px)]">
                      {stats.regularClients}{" "}
                    </span>
                    <span className="text-[clamp(28px,2.78vw,40px)]">+</span>
                  </p>
                  <p
                    className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4] tracking-[-0.02em]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {t("aboutPage.professionals.statsCustomers")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-[clamp(8px,0.69vw,10px)] text-white">
                <p
                  className="font-normal leading-[1] tracking-[-1px]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <span className="text-[clamp(36px,3.47vw,50px)]">
                    {stats.happyTravelers}{" "}
                  </span>
                  <span className="font-extralight text-[clamp(28px,2.78vw,40px)]">
                    +
                  </span>
                </p>
                <p
                  className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4] tracking-[-0.02em]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t("aboutPage.professionals.statsTravelers")}
                </p>
              </div>
            </div>

            {/* Earth Icon */}
            <div className="absolute bottom-0 right-0 w-[clamp(200px,19.44vw,280px)] h-[clamp(200px,19.44vw,280px)] flex items-center justify-center">
              <div className="rotate-180 scale-y-[-100%]">
                <div className="relative w-full h-full overflow-hidden">
                  <div className="absolute left-[-100%] w-[200%] h-[200%] top-0">
                    <div
                      className="absolute"
                      style={{ inset: "10% 2.3% 10% 6.67%" }}
                    >
                      <img
                        alt=""
                        className="w-full h-full"
                        src="/about-icon-earth.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-[clamp(60px,6.25vw,90px)]">
        <div className="max-w-[min(1440px,90vw)] mx-auto px-[clamp(30px,3.47vw,50px)]">
          <h2
            className="text-[clamp(40px,4.17vw,60px)] font-medium leading-[1] text-[#333333] tracking-[-0.03em] mb-[clamp(16px,1.39vw,20px)]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {translate({
              ru: "Мы - не просто локация на карте",
              uz: "Biz - xaritadagi oddiy joy emas",
              en: "We're Not Just a Location on the Map",
              de: "Wir sind nicht nur ein Ort auf der Karte",
            })}
          </h2>
          <p
            className="text-[clamp(16px,1.39vw,20px)] font-normal leading-[1.4] text-[#333333] tracking-[-0.02em] mb-[clamp(40px,4.17vw,60px)] max-w-[clamp(500px,45.4vw,655px)]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {translate({
              ru: "Dalverzin — природный ретрит, где важны пространство, тишина и хорошо поставленный сервис. Мы создаём впечатления, которые остаются с вами",
              uz: "Dalverzin — tabiiy dam olish maskani, bu yerda makon, sukunat va yuqori darajadagi xizmat muhim. Biz siz bilan qoladigan taassurotlar yaratamiz",
              en: "Dalverzin — a natural retreat where space, tranquility, and exceptional service matter. We create impressions that stay with you",
              de: "Dalverzin — ein Naturretreat, wo Raum, Stille und erstklassiger Service zählen. Wir schaffen Eindrücke, die bei Ihnen bleiben",
            })}
          </p>

          <div className="flex flex-col lg:flex-row gap-[clamp(30px,3.47vw,50px)]">
            {/* Why Us Container - Left Side */}
            <div className="flex-1 bg-[#E8E4D9] rounded-[20px] transition-all duration-500 overflow-hidden">
              <div className="flex flex-col md:flex-row h-full">
                {/* Text Content - 50% width */}
                <div className="w-full md:w-1/2 flex flex-col justify-start p-[clamp(24px,2.22vw,32px)]">
                  <h3
                    className="text-[clamp(18px,1.53vw,22px)] font-semibold leading-[1.2] text-[#333333] tracking-[-0.02em] mb-[clamp(16px,1.39vw,20px)]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {currentFeature.title}
                  </h3>
                  <div
                    className="text-[clamp(13px,1.04vw,15px)] font-normal leading-[1.6] text-[#333333] tracking-[-0.01em]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {currentFeature.description.map((paragraph, index) => (
                      <p
                        key={index}
                        className={
                          index === 0 ? "mb-[clamp(10px,0.83vw,12px)]" : ""
                        }
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Image on the right - 50% width without padding */}
                <div className="w-full md:w-1/2 min-h-[clamp(280px,23.61vw,340px)]">
                  <img
                    alt={currentFeature.title}
                    className="w-full h-full object-cover transition-opacity duration-500"
                    src={currentFeature.image}
                  />
                </div>
              </div>
            </div>

            {/* Features List - Right Side */}
            <div className="flex-1 flex flex-col gap-[clamp(20px,1.67vw,24px)]">
              <div className="flex flex-col gap-[clamp(8px,0.69vw,10px)] items-end">
                <div className="h-[3px] w-full bg-[silver] rounded-[8px] relative overflow-hidden">
                  <div
                    className="absolute bg-[#333333] h-[3px] rounded-[8px] transition-all duration-300"
                    style={{
                      left: `${currentSlide * 25}%`,
                      width: "25%",
                    }}
                  />
                </div>
                <p
                  className="text-[clamp(14px,1.11vw,16px)] font-medium leading-[1] text-[#333333] tracking-[-0.02em]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {String(currentSlide + 1).padStart(2, "0")}/04
                </p>
              </div>

              <div className="flex flex-col gap-[clamp(16px,1.39vw,20px)]">
                {/* All features list */}
                {whyUsFeatures.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className="text-left transition-all duration-300"
                  >
                    <p
                      className={`text-[clamp(16px,1.39vw,20px)] font-medium leading-[normal] tracking-[-0.02em] ${
                        index === currentSlide
                          ? "text-[#8f7b49]"
                          : "text-[#333333]"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {index === currentSlide && "▸ "}
                      {feature.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="bg-[#f4f2ed] py-[clamp(60px,6.25vw,90px)]">
        <div className="max-w-[min(1440px,90vw)] mx-auto px-[clamp(30px,3.47vw,50px)] mb-[clamp(60px,6.94vw,100px)]">
          <h2
            className="text-[clamp(40px,4.17vw,60px)] font-medium leading-[1] text-[#333333] tracking-[-0.03em]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {t("aboutPage.team.title")}
          </h2>
        </div>

        {(() => {
          const allFrames = Array.from({ length: 18 }, (_, i) => i + 7);
          const visibleFrames = showAllTeam ? allFrames : allFrames.slice(0, 6);
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(16px,1.67vw,24px)] w-full max-w-[min(1440px,90vw)] mx-auto px-[clamp(30px,3.47vw,50px)]">
                {visibleFrames.map((frameNum) => (
                  <div
                    key={frameNum}
                    className="rounded-[16px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] bg-white"
                  >
                    <div className="w-full aspect-[3/4] overflow-hidden">
                      <img
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        src={`/frame-${frameNum}.webp`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {!showAllTeam && (
                <div className="flex justify-center mt-[clamp(40px,4.17vw,60px)]">
                  <button
                    onClick={() => setShowAllTeam(true)}
                    className="bg-[#8f7b49] hover:bg-[#7a6939] transition-colors rounded-[10px] px-[clamp(40px,3.89vw,56px)] py-[clamp(20px,2.08vw,30px)] h-[clamp(60px,5.56vw,80px)] flex items-center justify-center cursor-pointer"
                  >
                    <p
                      className="text-white text-[clamp(16px,1.39vw,20px)] font-bold leading-[1] tracking-[-0.02em]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {t("aboutPage.team.showMore")}
                    </p>
                  </button>
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* Gallery Section */}
      <section className="bg-[#f4f2ed] pb-[clamp(60px,6.94vw,100px)]">
        <div className="flex items-end justify-between px-[clamp(30px,3.47vw,50px)] mb-[clamp(60px,6.94vw,100px)] max-w-[min(1440px,90vw)] mx-auto">
          <h2
            className="text-[clamp(40px,4.17vw,60px)] font-medium leading-[1] text-[#333333] tracking-[-0.03em] whitespace-pre"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {t("aboutPage.gallery.title")}
          </h2>
          <p
            className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4] text-[#333333] text-left md:text-right tracking-[-0.02em]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <span className="font-bold">14</span>
            <span> {t("aboutPage.gallery.available")}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[48.96%_51.04%] md:grid-rows-[clamp(300px,31.25vw,450px)_clamp(300px,31.25vw,450px)_clamp(450px,48.61vw,700px)] gap-0 w-full">
          {/* Dalverzin - LEFT COLUMN, spans rows 1-2 */}
          <div className="relative md:row-span-2 overflow-hidden min-h-[300px] md:min-h-0">
            <div className="absolute inset-0">
              <img
                alt=""
                className="w-full h-full object-cover"
                src="/about-gallery-1.webp"
              />
            </div>
          </div>

          {/* Kyzylkum - RIGHT COLUMN, row 1 */}
          <div className="relative overflow-hidden min-h-[300px] md:min-h-0">
            <div className="absolute inset-0">
              <img
                alt=""
                className="w-full h-full object-cover"
                src="/about-gallery-2.webp"
              />
            </div>
          </div>

          {/* Heart Container - LEFT COLUMN, row 3 */}
          <div className="relative bg-[#8f7b49] min-h-[300px] md:min-h-0">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(180px,17.36vw,250px)] h-[clamp(180px,17.36vw,250px)] overflow-hidden">
              <div
                className="absolute"
                style={{ inset: "19.23% 16.06% 19.24% 16.06%" }}
              >
                <img
                  alt=""
                  className="w-full h-full"
                  src="/about-icon-heart.svg"
                />
              </div>
            </div>
          </div>

          {/* Video Section - RIGHT COLUMN, row 2 */}
          <div className="relative bg-[#cbc2ab] min-h-[300px] md:min-h-0">
            <button
              onClick={() => navigate("/tours")}
              className="absolute bottom-[clamp(30px,2.78vw,40px)] left-[clamp(30px,3.47vw,50px)] flex items-center gap-[clamp(20px,2.08vw,30px)] cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="relative w-[clamp(70px,6.25vw,90px)] h-[clamp(70px,6.25vw,90px)]">
                <img
                  alt=""
                  className="w-full h-full"
                  src="/gallery-play-bg.svg"
                />
                <div className="absolute top-[22.2%] left-[22.2%] w-[55.6%] h-[55.6%]">
                  <img
                    alt=""
                    className="w-full h-full"
                    src="/gallery-play-icon.svg"
                  />
                  <div
                    className="absolute"
                    style={{ inset: "18.48% 18.34% 18.48% 33.33%" }}
                  >
                    <img
                      alt=""
                      className="w-full h-full"
                      src="/gallery-play-arrow.svg"
                    />
                  </div>
                </div>
              </div>
              <p className="text-[#333333] text-[clamp(18px,1.67vw,24px)] leading-[1.33] tracking-[-0.02em] whitespace-pre font-normal">
                {t("aboutPage.gallery.learnMore")}
              </p>
            </button>
          </div>

          {/* Charvak - RIGHT COLUMN, row 3 */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                alt=""
                className="w-full h-full object-cover"
                src="/about-gallery-3.webp"
              />
            </div>
          </div>
        </div>
      </section>
      <ScrollToTopButton />

      {/* Request Program Modal */}
      <RequestProgramModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
};

export default NewAboutPage;
