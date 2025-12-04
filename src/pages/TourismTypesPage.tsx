import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollToTopButton from '../components/ScrollToTopButton';

const TourismTypesPage: React.FC = () => {
  const { translate } = useLanguage();
  const [selectedType, setSelectedType] = useState("ecotourism");

  const tourismTypes = [
    { 
      id: "ecotourism", 
      label: translate({
        ru: "Экотуризм",
        uz: "Ekoturizm",
        en: "Ecotourism",
        de: "Ökotourismus"
      })
    },
    { 
      id: "agrotourism", 
      label: translate({
        ru: "Агротуризм",
        uz: "Agroturizm",
        en: "Agrotourism",
        de: "Agrotourismus"
      })
    },
    { 
      id: "teambuilding", 
      label: translate({
        ru: "Тимбилдинг",
        uz: "Jamoa qurish",
        en: "Team Building",
        de: "Teambildung"
      })
    },
    { 
      id: "sport-shooting", 
      label: translate({
        ru: "Спортивная\nстрельба",
        uz: "Sport\notish",
        en: "Sport\nShooting",
        de: "Sport\nSchießen"
      })
    },
  ];

  const getTourismContent = () => ({
    ecotourism: {
      title: translate({
        ru: "Экотуризм",
        uz: "Ekoturizm",
        en: "Ecotourism",
        de: "Ökotourismus"
      }),
      subtitle: translate({
        ru: "Откройте природные территории в их первозданном виде, наслаждаясь отдыхом, который сохраняет экологию и поддерживает местные сообщества",
        uz: "Tabiatni asl ko'rinishida kashf eting, ekologiyani saqlaydigan va mahalliy jamoalarni qo'llab-quvvatlaydigan dam olishdan bahramand bo'ling",
        en: "Discover natural territories in their pristine form, enjoying a vacation that preserves ecology and supports local communities",
        de: "Entdecken Sie Naturgebiete in ihrer ursprünglichen Form und genießen Sie einen Urlaub, der die Ökologie bewahrt und lokale Gemeinschaften unterstützt"
      }),
      mainTitle: translate({
        ru: "Путешествия, создающие ценность для природы",
        uz: "Tabiat uchun qiymat yaratadigan sayohatlar",
        en: "Travel that Creates Value for Nature",
        de: "Reisen, die Wert für die Natur schaffen"
      }),
      mainDescription: translate({
        ru: "Экотуризм — это вид путешествий, направленный на знакомство с природными территориями, их экосистемами и биоразнообразием. Его цель — не только отдых, но и сохранение окружающей среды, развитие местных сообществ и экологическое просвещение.",
        uz: "Ekoturizm — bu tabiat hududlari, ularning ekotizimlari va bioturliligini o'rganishga qaratilgan sayohat turi. Uning maqsadi nafaqat dam olish, balki atrof-muhitni asrash, mahalliy jamoalarni rivojlantirish va ekologik ma'rifatdir.",
        en: "Ecotourism is a type of travel focused on exploring natural areas, their ecosystems, and biodiversity. Its goal is not only recreation but also environmental conservation, local community development, and ecological education.",
        de: "Ökotourismus ist eine Art des Reisens, die sich auf die Erkundung von Naturgebieten, deren Ökosystemen und der Biodiversität konzentriert. Sein Ziel ist nicht nur Erholung, sondern auch Umweltschutz, Entwicklung lokaler Gemeinschaften und ökologische Bildung."
      }),
      section1Title: translate({
        ru: "Мы создаём экологичные маршруты с заботой о природе",
        uz: "Biz tabiatni asrab-avaylash bilan ekologik yo'nalishlarni yaratamiz",
        en: "We Create Eco-Friendly Routes with Care for Nature",
        de: "Wir schaffen umweltfreundliche Routen mit Rücksicht auf die Natur"
      }),
      section1Description: translate({
        ru: "Каждый наш маршрут разработан таким образом, чтобы минимизировать влияние человека на окружающую среду. Мы выбираем только экологичные тропы, избегаем мест обитания редких видов и придерживаемся принципов «не оставляй следов».",
        uz: "Har bir yo'nalishimiz inson ta'sirini atrof-muhitga minimallashtirishga qaratilgan. Biz faqat ekologik yo'llarni tanlaymiz, noyob turlar yashash joylaridan qochamiz va 'iz qoldirma' tamoyillariga amal qilamiz.",
        en: "Each of our routes is designed to minimize human impact on the environment. We choose only eco-friendly trails, avoid habitats of rare species, and follow 'leave no trace' principles.",
        de: "Jede unserer Routen ist so konzipiert, dass sie die menschlichen Auswirkungen auf die Umwelt minimiert. Wir wählen nur umweltfreundliche Pfade, meiden Lebensräume seltener Arten und folgen den Prinzipien von 'leave no trace'."
      }),
      section2Title: translate({
        ru: "Наши гиды — специалисты в области природоохранных территорий",
        uz: "Bizning gidlarimiz — tabiatni muhofaza qilish hududlari bo'yicha mutaxassislar",
        en: "Our Guides are Specialists in Protected Natural Areas",
        de: "Unsere Guides sind Spezialisten für Naturschutzgebiete"
      }),
      section2Description: translate({
        ru: "Они помогут вам лучше понять экосистему, её уязвимость и ценность, чтобы ваше путешествие стало не только комфортным, но и осознанным",
        uz: "Ular sizga ekotizimni, uning zaifligini va qiymatini yaxshiroq tushunishga yordam beradi, shunda sayohatingiz nafaqat qulay, balki ongli bo'ladi",
        en: "They will help you better understand the ecosystem, its vulnerability, and value, so your journey becomes not only comfortable but also conscious",
        de: "Sie helfen Ihnen, das Ökosystem, seine Verletzlichkeit und seinen Wert besser zu verstehen, damit Ihre Reise nicht nur komfortabel, sondern auch bewusst wird"
      })
    },
    agrotourism: {
      title: translate({
        ru: "Агротуризм",
        uz: "Agroturizm",
        en: "Agrotourism",
        de: "Agrotourismus"
      }),
      subtitle: translate({
        ru: "Погрузитесь в сельскую жизнь, познакомьтесь с традиционным укладом и попробуйте экологически чистые продукты из первых рук",
        uz: "Qishloq hayotiga sho'ng'ing, an'anaviy turmush tarzini o'rganing va ekologik toza mahsulotlarni to'g'ridan-to'g'ri tatib ko'ring",
        en: "Immerse yourself in rural life, discover traditional lifestyle, and taste organic products firsthand",
        de: "Tauchen Sie ein in das ländliche Leben, entdecken Sie traditionelle Lebensweisen und probieren Sie Bio-Produkte aus erster Hand"
      }),
      mainTitle: translate({
        ru: "Знакомство с сельским хозяйством и традициями",
        uz: "Qishloq xo'jaligi va an'analar bilan tanishuv",
        en: "Introduction to Agriculture and Traditions",
        de: "Einführung in Landwirtschaft und Traditionen"
      }),
      mainDescription: translate({
        ru: "Агротуризм — это уникальная возможность познакомиться с сельским укладом жизни, традиционными методами ведения хозяйства и насладиться экологически чистыми продуктами.",
        uz: "Agroturizm — bu qishloq turmush tarzini, an'anaviy xo'jalik yuritish usullarini o'rganish va ekologik toza mahsulotlardan bahramand bo'lishning noyob imkoniyatidir.",
        en: "Agrotourism is a unique opportunity to experience rural lifestyle, traditional farming methods, and enjoy organic products.",
        de: "Agrotourismus ist eine einzigartige Gelegenheit, das ländliche Leben, traditionelle Landwirtschaftsmethoden kennenzulernen und Bio-Produkte zu genießen."
      }),
      section1Title: translate({
        ru: "Традиционные фермы и органические хозяйства",
        uz: "An'anaviy fermerlar va organik xo'jaliklar",
        en: "Traditional Farms and Organic Estates",
        de: "Traditionelle Bauernhöfe und Bio-Betriebe"
      }),
      section1Description: translate({
        ru: "Посетите настоящие фермерские хозяйства, где выращивают экологически чистые продукты. Узнайте секреты традиционного земледелия и животноводства от местных фермеров.",
        uz: "Ekologik toza mahsulotlar yetishtiriladigan haqiqiy fermer xo'jaliklarini ziyorat qiling. Mahalliy fermerlardan an'anaviy dehqonchilik va chorvachilik sirlarini bilib oling.",
        en: "Visit authentic farms where organic products are grown. Learn the secrets of traditional agriculture and animal husbandry from local farmers.",
        de: "Besuchen Sie authentische Bauernhöfe, auf denen Bio-Produkte angebaut werden. Erfahren Sie die Geheimnisse traditioneller Landwirtschaft und Tierhaltung von lokalen Bauern."
      }),
      section2Title: translate({
        ru: "Мастер-классы и дегустации",
        uz: "Master-klasslar va degustatsiyalar",
        en: "Workshops and Tastings",
        de: "Workshops und Verkostungen"
      }),
      section2Description: translate({
        ru: "Примите участие в приготовлении национальных блюд, научитесь делать сыр, хлеб и другие продукты традиционными методами",
        uz: "Milliy taomlarni tayyorlashda ishtirok eting, pishloq, non va boshqa mahsulotlarni an'anaviy usullar bilan tayyorlashni o'rganing",
        en: "Participate in preparing national dishes, learn to make cheese, bread, and other products using traditional methods",
        de: "Nehmen Sie an der Zubereitung nationaler Gerichte teil, lernen Sie, Käse, Brot und andere Produkte nach traditionellen Methoden herzustellen"
      })
    },
    teambuilding: {
      title: translate({
        ru: "Тимбилдинг",
        uz: "Jamoa qurish",
        en: "Team Building",
        de: "Teambildung"
      }),
      subtitle: translate({
        ru: "Укрепите командный дух на природе через совместные активности, квесты и приключения в живописных локациях",
        uz: "Tabiatda birgalikdagi faoliyat, kvestlar va go'zal joylardagi sarguzashtlar orqali jamoa ruhini mustahkamlang",
        en: "Strengthen team spirit in nature through joint activities, quests, and adventures in scenic locations",
        de: "Stärken Sie den Teamgeist in der Natur durch gemeinsame Aktivitäten, Quests und Abenteuer an malerischen Orten"
      }),
      mainTitle: translate({
        ru: "Корпоративные программы для укрепления команды",
        uz: "Jamoani mustahkamlash uchun korporativ dasturlar",
        en: "Corporate Programs for Team Building",
        de: "Firmenprogramme für Teambildung"
      }),
      mainDescription: translate({
        ru: "Тимбилдинг на природе — это эффективный способ улучшить взаимодействие в команде, развить лидерские качества и создать прочные связи между сотрудниками в неформальной обстановке.",
        uz: "Tabiatda jamoa qurish — bu jamoada o'zaro hamkorlikni yaxshilash, yetakchilik fazilatlarini rivojlantirish va xodimlar o'rtasida norasmiy muhitda mustahkam aloqalar o'rnatishning samarali usuli.",
        en: "Team building in nature is an effective way to improve team interaction, develop leadership qualities, and create strong bonds between employees in an informal setting.",
        de: "Teambildung in der Natur ist ein effektiver Weg, um die Teaminteraktion zu verbessern, Führungsqualitäten zu entwickeln und starke Bindungen zwischen Mitarbeitern in einem informellen Rahmen zu schaffen."
      }),
      section1Title: translate({
        ru: "Программы для команд любого размера",
        uz: "Har qanday o'lchamdagi jamoalar uchun dasturlar",
        en: "Programs for Teams of Any Size",
        de: "Programme für Teams jeder Größe"
      }),
      section1Description: translate({
        ru: "Разрабатываем индивидуальные программы под ваши цели: от небольших команд до крупных корпоративных мероприятий. Квесты, веревочные курсы, командные челленджи.",
        uz: "Sizning maqsadlaringizga moslashtirilgan individual dasturlarni ishlab chiqamiz: kichik jamoalardan tortib, yirik korporativ tadbirlargacha. Kvestlar, arqonli kurslar, jamoaviy musobaqalar.",
        en: "We develop customized programs for your goals: from small teams to large corporate events. Quests, rope courses, team challenges.",
        de: "Wir entwickeln individuelle Programme für Ihre Ziele: von kleinen Teams bis zu großen Firmenveranstaltungen. Quests, Seilparcours, Team-Challenges."
      }),
      section2Title: translate({
        ru: "Профессиональная организация",
        uz: "Professional tashkilot",
        en: "Professional Organization",
        de: "Professionelle Organisation"
      }),
      section2Description: translate({
        ru: "Опытные инструкторы, безопасное оборудование и продуманная логистика. Мы позаботимся обо всем, чтобы ваше мероприятие прошло идеально",
        uz: "Tajribali instruktorlar, xavfsiz uskunalar va puxta o'ylangan logistika. Tadbiringiz mukammal o'tishi uchun biz hamma narsaga g'amxo'rlik qilamiz",
        en: "Experienced instructors, safe equipment, and well-planned logistics. We'll take care of everything to make your event perfect",
        de: "Erfahrene Instruktoren, sichere Ausrüstung und durchdachte Logistik. Wir kümmern uns um alles, damit Ihre Veranstaltung perfekt wird"
      })
    },
    "sport-shooting": {
      title: translate({
        ru: "Спортивная стрельба",
        uz: "Sport otish",
        en: "Sport Shooting",
        de: "Sportschießen"
      }),
      subtitle: translate({
        ru: "Освойте стрельбу под руководством профессиональных инструкторов на современном стрельбище с соблюдением всех норм безопасности",
        uz: "Professional instruktorlar rahbarligida zamonaviy otish maydonida barcha xavfsizlik me'yorlariga rioya qilgan holda otishni o'rganing",
        en: "Master shooting under the guidance of professional instructors at a modern shooting range with full safety compliance",
        de: "Erlernen Sie das Schießen unter Anleitung professioneller Instruktoren auf einem modernen Schießstand unter Einhaltung aller Sicherheitsstandards"
      }),
      mainTitle: translate({
        ru: "Профессиональная стендовая стрельба",
        uz: "Professional stend otish",
        en: "Professional Trap Shooting",
        de: "Professionelles Tontaubenschießen"
      }),
      mainDescription: translate({
        ru: "Стендовая стрельба — это увлекательный вид спорта, который требует концентрации, координации и хладнокровия. Подходит как для новичков, так и для опытных стрелков.",
        uz: "Stend otish — bu diqqatni jamlash, muvofiqlashtirish va sovuqqonlikni talab qiladigan qiziqarli sport turi. Yangi boshlovchilar va tajribali otuvchilar uchun mos keladi.",
        en: "Trap shooting is an exciting sport that requires concentration, coordination, and composure. Suitable for both beginners and experienced shooters.",
        de: "Tontaubenschießen ist eine spannende Sportart, die Konzentration, Koordination und Gelassenheit erfordert. Geeignet für Anfänger und erfahrene Schützen."
      }),
      section1Title: translate({
        ru: "Обучение от профессионалов",
        uz: "Professionallardan ta'lim",
        en: "Training from Professionals",
        de: "Training von Profis"
      }),
      section1Description: translate({
        ru: "Наши инструкторы — мастера спорта и опытные тренеры. Они научат вас правильной технике, стойке и прицеливанию, обеспечивая безопасность на каждом этапе.",
        uz: "Bizning instruktorlarimiz — sport ustalarі va tajribali murabbiylar. Ular sizga to'g'ri texnika, pozitsiya va nishonga olishni o'rgatadi, har bir bosqichda xavfsizlikni ta'minlaydi.",
        en: "Our instructors are sports masters and experienced coaches. They will teach you proper technique, stance, and aiming, ensuring safety at every stage.",
        de: "Unsere Instruktoren sind Sportmeister und erfahrene Trainer. Sie bringen Ihnen die richtige Technik, Haltung und Zielerfassung bei und gewährleisten Sicherheit in jeder Phase."
      }),
      section2Title: translate({
        ru: "Современное оборудование и полигон",
        uz: "Zamonaviy uskunalar va poligon",
        en: "Modern Equipment and Range",
        de: "Moderne Ausrüstung und Schießstand"
      }),
      section2Description: translate({
        ru: "Используем сертифицированное оборудование и боеприпасы. Стрельбище оборудовано по всем стандартам безопасности для комфортных тренировок",
        uz: "Sertifikatlangan jihozlar va o'q-dorilardan foydalanamiz. Otish maydoni qulay mashg'ulotlar uchun barcha xavfsizlik standartlariga muvofiq jihozlangan",
        en: "We use certified equipment and ammunition. The shooting range is equipped to all safety standards for comfortable training",
        de: "Wir verwenden zertifizierte Ausrüstung und Munition. Der Schießstand ist nach allen Sicherheitsstandards für komfortables Training ausgestattet"
      })
    }
  });

  const tourismContent = getTourismContent();
  const currentContent = tourismContent[selectedType as keyof typeof tourismContent];

  return (
    <div className="bg-[#f4f2ed]">
      {/* Hero Section */}
      <div className="relative h-[clamp(500px,48.61vw,700px)] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover" 
            src="/why-us-hero.png" 
          />
          <img 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" 
            src="/e7c111a130051f0f0f7c2bd0a2b6ae7f7c164f8d.png" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end pb-[clamp(40px,6.94vw,100px)] px-[clamp(20px,3.47vw,50px)] max-w-[1440px] mx-auto">
          <h1 
            className="text-white text-[clamp(40px,6.25vw,90px)] font-medium leading-[1.1] tracking-[-0.03em] mb-[clamp(12px,1.39vw,20px)]" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {currentContent.title}
          </h1>
          <p 
            className="text-white opacity-80 text-[clamp(18px,2.22vw,32px)] font-normal leading-[1.25] tracking-[-0.03em] max-w-[clamp(600px,87.36vw,1256px)]" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {currentContent.subtitle}
          </p>
        </div>
      </div>

      {/* Tourism Type Selector */}
      <div className="relative mt-[60px] z-20 px-[clamp(20px,3.47vw,50px)] max-w-[1440px] mx-auto mb-[clamp(40px,4.17vw,60px)]">
        <div className="bg-white border-2 border-silver rounded-[10px] p-[clamp(8px,1.25vw,18px)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(8px,0.69vw,10px)]">
            {tourismTypes.map((type) => {
              const isSelected = selectedType === type.id;
              
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-[clamp(16px,4.17vw,60px)] py-[clamp(12px,1.11vw,16px)] rounded-[10px] transition-all duration-300 min-h-[clamp(60px,5.56vw,80px)] flex items-center justify-center ${
                    isSelected ? 'bg-[#8f7b49]' : 'hover:bg-[#f0f0f0]'
                  }`}
                >
                  <p 
                    className={`font-semibold text-[clamp(14px,1.53vw,22px)] leading-[1.2] tracking-[-0.02em] text-center whitespace-pre-line ${
                      isSelected ? 'text-white' : 'text-[#333333]'
                    }`}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {type.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-[clamp(20px,3.47vw,50px)] max-w-[1440px] mx-auto pb-[clamp(60px,6.94vw,100px)]">
        <div className="flex flex-col gap-[clamp(30px,2.78vw,40px)] mb-[clamp(40px,4.17vw,60px)]">
          <h2 
            className="text-[#333333] text-[clamp(32px,4.17vw,60px)] font-medium leading-[1] tracking-[-0.03em]" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {currentContent.mainTitle}
          </h2>
          <p 
            className="text-[#333333] text-[clamp(16px,1.67vw,24px)] font-normal leading-[1.67] tracking-[-0.02em]" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {currentContent.mainDescription}
          </p>
        </div>

        {/* Images Grid - Top */}
        <div className="mb-[clamp(40px,4.17vw,60px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[20px] overflow-hidden">
            <div className="col-span-full h-[clamp(300px,34.72vw,500px)]">
              <img 
                alt="" 
                className="w-full h-full object-cover" 
                src="/ac5bf1e47e292f5b7f1042422f23e28abae08055.png" 
              />
            </div>
            <div className="h-[clamp(350px,40.69vw,586px)]">
              <img 
                alt="" 
                className="w-full h-full object-cover" 
                src="/94eadad3f522e8bdfb19c56bb585ddeaf0e637a3.png" 
              />
            </div>
            <div className="h-[clamp(350px,40.69vw,586px)]">
              <img 
                alt="" 
                className="w-full h-full object-cover" 
                src="/why-us-hero.png" 
              />
            </div>
          </div>
        </div>

        {/* Text Section 1 */}
        <div className="flex flex-col gap-[clamp(10px,0.83vw,12px)] mb-[clamp(40px,4.17vw,60px)]">
          <h3 
            className="text-[#333333] text-[clamp(24px,2.22vw,32px)] font-medium leading-[1.25] tracking-[-0.02em]" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {currentContent.section1Title}
          </h3>
          <p 
            className="text-[#333333] text-[clamp(16px,1.67vw,24px)] font-normal leading-[1.67] tracking-[-0.02em]" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {currentContent.section1Description}
          </p>
        </div>

        {/* Images Grid - Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[20px] overflow-hidden mb-[clamp(40px,4.17vw,60px)]">
          <div className="h-[clamp(350px,40.69vw,586px)]">
            <img 
              alt="" 
              className="w-full h-full object-cover" 
              src="/why-us-gallery-bottom-right.png" 
            />
          </div>
          <div className="h-[clamp(350px,40.69vw,586px)]">
            <img 
              alt="" 
              className="w-full h-full object-cover" 
              src="/8d906978fc716fe472c5b52bc4524b8e62b9bf38.png" 
            />
          </div>
        </div>

        {/* Text Section 2 */}
        <div className="flex flex-col gap-[clamp(10px,0.83vw,12px)]">
          <h3 
            className="text-[#333333] text-[clamp(24px,2.22vw,32px)] font-medium leading-[1.25] tracking-[-0.02em]" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {currentContent.section2Title}
          </h3>
          <p 
            className="text-[#333333] text-[clamp(16px,1.67vw,24px)] font-normal leading-[1.67] tracking-[-0.02em]" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {currentContent.section2Description}
          </p>
        </div>
      </div>

      <ScrollToTopButton />
    </div>

  );
};

export default TourismTypesPage;
