import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

type CategorySlug =
  | "ecotourism"
  | "agrotourism"
  | "teambuilding"
  | "sport-shooting";

interface CategoryContent {
  title: {
    ru: string;
    uz: string;
    en: string;
    de: string;
  };
  subtitle: {
    ru: string;
    uz: string;
    en: string;
    de: string;
  };
  heroImage: string;
  sections: Array<{
    title?: {
      ru: string;
      uz: string;
      en: string;
      de: string;
    };
    content: {
      ru: string[];
      uz: string[];
      en: string[];
      de: string[];
    };
  }>;
  features: {
    title: {
      ru: string;
      uz: string;
      en: string;
      de: string;
    };
    items: Array<{
      ru: string;
      uz: string;
      en: string;
      de: string;
    }>;
  };
  gallery: {
    top: string;
    bottomLeft: string;
    bottomRight: string;
  };
}

const categoryContent: Record<CategorySlug, CategoryContent> = {
  ecotourism: {
    title: {
      ru: "Экотуризм",
      uz: "Ekoturizm",
      en: "Ecotourism",
      de: "Okotourismus",
    },
    subtitle: {
      ru: "Осознанное путешествие в гармонии с природой",
      uz: "Tabiat bilan uyg'unlikda ongli sayohat",
      en: "Mindful travel in harmony with nature",
      de: "Bewusstes Reisen im Einklang mit der Natur",
    },
    heroImage: "/contact-nature-image.webp",
    sections: [
      {
        title: {
          ru: "Что такое экотуризм?",
          uz: "Ekoturizm nima?",
          en: "What is ecotourism?",
          de: "Was ist Okotourismus?",
        },
        content: {
          ru: [
            "Современный мир стремительно развивается, и с каждым годом все больше людей стремятся к знакомству с природой, поиску спокойствия и отдыха в гармонии с природой и наслаждению ее естественной красотой. Экотуризм - это не просто отдых, это осознанное путешествие, которое позволяет наслаждаться природой, не причинив ей вреда.",
            "Экотуризм - это вид туризма, направленный на знакомство с природными территориями, их экосистемами и биоразнообразием. Его главная цель - не только отдых, но и сохранение природы, развитие местных сообществ и экологическое просвещение.",
          ],
          uz: [
            "Zamonaviy dunyo jadal rivojlanmoqda va har yili ko'proq odamlar tabiat bilan tanishishga, tinchlik izlashga va tabiat go'zalligi bilan bahramand bo'lishga intilmoqda. Ekoturizm - bu oddiy dam olish emas, bu tabiatga zarar yetkazmasdan undan zavqlanish imkonini beruvchi ongli sayohatdir.",
            "Ekoturizm - bu tabiiy hududlar, ularning ekotizimlari va biohilma-hilligi bilan tanishishga qaratilgan turizm turi. Uning asosiy maqsadi nafaqat dam olish, balki tabiatni asrash, mahalliy jamoalarni rivojlantirish va ekologik ma'rifatdir.",
          ],
          en: [
            "The modern world is rapidly developing, and every year more and more people seek to connect with nature, find peace, and enjoy its natural beauty in harmony. Ecotourism is not just recreation, it is a mindful journey that allows you to enjoy nature without harming it.",
            "Ecotourism is a type of tourism aimed at exploring natural areas, their ecosystems, and biodiversity. Its main goal is not only recreation but also nature conservation, local community development, and environmental education.",
          ],
          de: [
            "Die moderne Welt entwickelt sich rasant, und jedes Jahr suchen mehr Menschen den Kontakt zur Natur, finden Ruhe und geniessen ihre naturliche Schonheit in Harmonie. Okotourismus ist nicht nur Erholung, sondern eine bewusste Reise, die es ermoglicht, die Natur zu geniessen, ohne ihr zu schaden.",
            "Okotourismus ist eine Tourismusart, die darauf abzielt, Naturgebiete, ihre Okosysteme und Biodiversitat zu erkunden. Sein Hauptziel ist nicht nur Erholung, sondern auch Naturschutz, Entwicklung lokaler Gemeinschaften und Umweltbildung.",
          ],
        },
      },
      {
        content: {
          ru: [
            "Наше лесоохотничье хозяйство - это уникальное место для организации экотуризма. Мы предлагаем Вам посетить территорию с уникальной природой, живописными пейзажами, естественными ландшафтами лесов и водоемами.",
            "Экотуризм способствует сохранению природных территорий, экологическому образованию и развитию местных сообществ. Отправляясь в путешествие по природным территориям, важно соблюдать природоохранные нормы, использовать экологичные материалы и придерживаться установленных маршрутов.",
          ],
          uz: [
            "Bizning o'rmon-ov xo'jaligimiz ekoturizmni tashkil qilish uchun noyob joydir. Sizni noyob tabiat, go'zal manzaralar, tabiiy o'rmon landshaftlari va suv havzalari bilan ajoyib hududga tashrif buyurishga taklif qilamiz.",
            "Ekoturizm tabiiy hududlarni saqlash, ekologik ta'lim va mahalliy jamoalarni rivojlantirishga yordam beradi. Tabiiy hududlarga sayohat qilayotganda, tabiatni muhofaza qilish qoidalariga rioya qilish, ekologik materiallardan foydalanish va belgilangan yo'nalishlarga rioya qilish muhimdir.",
          ],
          en: [
            "Our forestry and hunting farm is a unique place for organizing ecotourism. We invite you to visit an area with unique nature, picturesque landscapes, natural forest landscapes, and water bodies.",
            "Ecotourism contributes to the preservation of natural areas, environmental education, and the development of local communities. When traveling to natural areas, it is important to follow environmental regulations, use eco-friendly materials, and stick to established routes.",
          ],
          de: [
            "Unser Forst- und Jagdbetrieb ist ein einzigartiger Ort fur die Organisation von Okotourismus. Wir laden Sie ein, ein Gebiet mit einzigartiger Natur, malerischen Landschaften, naturlichen Waldlandschaften und Gewassern zu besuchen.",
            "Okotourismus tragt zur Erhaltung von Naturgebieten, Umweltbildung und der Entwicklung lokaler Gemeinschaften bei. Bei Reisen in Naturgebiete ist es wichtig, Umweltvorschriften zu befolgen, umweltfreundliche Materialien zu verwenden und sich an festgelegte Routen zu halten.",
          ],
        },
      },
    ],
    features: {
      title: {
        ru: "Виды экотуризма",
        uz: "Ekoturizm turlari",
        en: "Types of ecotourism",
        de: "Arten des Okotourismus",
      },
      items: [
        {
          ru: "Бердвотчинг",
          uz: "Qushlarni kuzatish",
          en: "Birdwatching",
          de: "Vogelbeobachtung",
        },
        { ru: "Кемпинг", uz: "Kemping", en: "Camping", de: "Camping" },
        {
          ru: "Рекреационная рыбалка",
          uz: "Rekreatsion baliq ovi",
          en: "Recreational fishing",
          de: "Freizeitangeln",
        },
        {
          ru: "Сезонные экскурсии и прогулки",
          uz: "Mavsumiy ekskursiyalar",
          en: "Seasonal excursions",
          de: "Saisonale Ausfuge",
        },
      ],
    },
    gallery: {
      top: "/why-us-gallery-top.webp",
      bottomLeft: "/why-us-gallery-bottom-left.webp",
      bottomRight: "/why-us-gallery-bottom-right.webp",
    },
  },
  agrotourism: {
    title: {
      ru: "Агротуризм",
      uz: "Agroturizm",
      en: "Agrotourism",
      de: "Agrotourismus",
    },
    subtitle: {
      ru: "Погружение в сельскую жизнь и традиции",
      uz: "Qishloq hayoti va an'analarga sho'ng'ish",
      en: "Immersion in rural life and traditions",
      de: "Eintauchen in das Landleben und Traditionen",
    },
    heroImage: "/about-hero.webp",
    sections: [
      {
        title: {
          ru: "Что такое агротуризм?",
          uz: "Agroturizm nima?",
          en: "What is agrotourism?",
          de: "Was ist Agrotourismus?",
        },
        content: {
          ru: [
            "Агротуризм - это уникальная возможность познакомиться с сельским хозяйством, традиционным укладом жизни и культурой местного населения. Это путешествие, которое позволяет отвлечься от городской суеты и погрузиться в атмосферу деревенского уюта.",
            "На территории нашего хозяйства вы сможете познакомиться с традиционными методами земледелия, попробовать свежие продукты прямо с грядки и узнать секреты приготовления национальных блюд.",
          ],
          uz: [
            "Agroturizm - bu qishloq xo'jaligi, an'anaviy turmush tarzi va mahalliy aholi madaniyati bilan tanishish uchun noyob imkoniyatdir. Bu sayohat shahar qovushig'idan uzoqlashib, qishloq qulayligiga cho'mish imkonini beradi.",
            "Bizning xo'jaligimiz hududida siz an'anaviy dehqonchilik usullari bilan tanishishingiz, yangi mahsulotlarni to'g'ridan-to'g'ri yerdan tatib ko'rishingiz va milliy taomlar tayyorlash sirlarini o'rganishingiz mumkin.",
          ],
          en: [
            "Agrotourism is a unique opportunity to learn about agriculture, traditional lifestyle, and local culture. It is a journey that allows you to escape the hustle and bustle of the city and immerse yourself in the cozy atmosphere of the countryside.",
            "On the territory of our farm, you can learn about traditional farming methods, taste fresh products straight from the garden, and discover the secrets of preparing national dishes.",
          ],
          de: [
            "Agrotourismus ist eine einzigartige Moglichkeit, die Landwirtschaft, die traditionelle Lebensweise und die lokale Kultur kennenzulernen. Es ist eine Reise, die es Ihnen ermoglicht, dem Trubel der Stadt zu entfliehen und in die gemutliche Atmosphare des Landlebens einzutauchen.",
            "Auf dem Gelande unseres Bauernhofs konnen Sie traditionelle Anbaumethoden kennenlernen, frische Produkte direkt aus dem Garten probieren und die Geheimnisse der Zubereitung nationaler Gerichte entdecken.",
          ],
        },
      },
      {
        content: {
          ru: [
            "Агротуризм идеально подходит для семейного отдыха с детьми. Здесь каждый найдет занятие по душе: от сбора урожая и ухода за животными до мастер-классов по традиционным ремеслам.",
            "Мы предлагаем комфортное размещение в уютных гостевых домах, окруженных садами и виноградниками. Каждый день начинается со свежего деревенского завтрака и заканчивается звездным небом над головой.",
          ],
          uz: [
            "Agroturizm bolalar bilan oilaviy dam olish uchun ideal. Bu yerda har kim o'ziga yoqadigan mashg'ulot topadi: hosilni yig'ishdan va hayvonlarga g'amxo'rlik qilishdan tortib an'anaviy hunarmandchilik bo'yicha master-klasslargacha.",
            "Biz bog'lar va uzumzorlar bilan o'ralgan qulay mehmon uylarida qulay joylashuvni taklif etamiz. Har bir kun yangi qishloq nonushtasi bilan boshlanadi va boshingiz ustidagi yulduzli osmon bilan tugaydi.",
          ],
          en: [
            "Agrotourism is ideal for family vacations with children. Here everyone will find something to their liking: from harvesting and caring for animals to workshops on traditional crafts.",
            "We offer comfortable accommodation in cozy guest houses surrounded by gardens and vineyards. Each day begins with a fresh village breakfast and ends with a starry sky overhead.",
          ],
          de: [
            "Agrotourismus ist ideal fur Familienurlaub mit Kindern. Hier findet jeder etwas nach seinem Geschmack: vom Ernten und der Tierpflege bis hin zu Workshops uber traditionelles Handwerk.",
            "Wir bieten komfortable Unterkunft in gemutlichen Gastehausern, umgeben von Garten und Weinbergen. Jeder Tag beginnt mit einem frischen Dorffruhstuck und endet mit einem Sternenhimmel uber Ihnen.",
          ],
        },
      },
    ],
    features: {
      title: {
        ru: "Возможности агротуризма",
        uz: "Agroturizm imkoniyatlari",
        en: "Agrotourism opportunities",
        de: "Agrotourismus-Moglichkeiten",
      },
      items: [
        {
          ru: "Сбор урожая",
          uz: "Hosil yig'ish",
          en: "Harvesting",
          de: "Ernte",
        },
        {
          ru: "Дегустация вин",
          uz: "Vino degustatsiyasi",
          en: "Wine tasting",
          de: "Weinprobe",
        },
        {
          ru: "Мастер-классы",
          uz: "Master-klasslar",
          en: "Workshops",
          de: "Workshops",
        },
        {
          ru: "Верховая езда",
          uz: "Ot minish",
          en: "Horseback riding",
          de: "Reiten",
        },
      ],
    },
    gallery: {
      top: "/why-us-gallery-top.webp",
      bottomLeft: "/gallery-charvak.webp",
      bottomRight: "/gallery-dalverzin.webp",
    },
  },
  teambuilding: {
    title: {
      ru: "Тимбилдинг",
      uz: "Jamoa qurish",
      en: "Team Building",
      de: "Teambuilding",
    },
    subtitle: {
      ru: "Укрепление команды через совместные приключения",
      uz: "Birgalikdagi sarguzashtlar orqali jamoani mustahkamlash",
      en: "Strengthening teams through shared adventures",
      de: "Teams durch gemeinsame Abenteuer starken",
    },
    heroImage: "/why-us-hero.webp",
    sections: [
      {
        title: {
          ru: "Корпоративный отдых на природе",
          uz: "Tabiatda korporativ dam olish",
          en: "Corporate retreat in nature",
          de: "Firmenausflug in der Natur",
        },
        content: {
          ru: [
            "Тимбилдинг на природе - это эффективный способ укрепить командный дух, наладить коммуникацию между сотрудниками и создать незабываемые совместные впечатления. Наша территория предоставляет идеальные условия для организации корпоративных мероприятий любого масштаба.",
            "Мы разрабатываем индивидуальные программы, учитывающие особенности вашей команды и поставленные цели. От активных соревнований на свежем воздухе до стратегических игр - каждое мероприятие направлено на развитие навыков командной работы.",
          ],
          uz: [
            "Tabiatda jamoa qurish - bu jamoa ruhini mustahkamlash, xodimlar o'rtasida muloqotni yo'lga qo'yish va unutilmas birgalikdagi taassurotlar yaratishning samarali usuli. Bizning hududimiz har qanday miqyosdagi korporativ tadbirlarni tashkil qilish uchun ideal shart-sharoitlarni taqdim etadi.",
            "Biz jamoangizning xususiyatlarini va qo'yilgan maqsadlarni hisobga olgan holda individual dasturlar ishlab chiqamiz. Ochiq havoda faol musobaqalardan strategik o'yinlargacha - har bir tadbir jamoa ishini rivojlantirishga qaratilgan.",
          ],
          en: [
            "Team building in nature is an effective way to strengthen team spirit, improve communication between employees, and create unforgettable shared experiences. Our territory provides ideal conditions for organizing corporate events of any scale.",
            "We develop individual programs that take into account the characteristics of your team and the goals set. From active outdoor competitions to strategic games - each event is aimed at developing teamwork skills.",
          ],
          de: [
            "Teambuilding in der Natur ist ein effektiver Weg, den Teamgeist zu starken, die Kommunikation zwischen Mitarbeitern zu verbessern und unvergessliche gemeinsame Erlebnisse zu schaffen. Unser Gelande bietet ideale Bedingungen fur die Organisation von Firmenveranstaltungen jeder Gro.e.",
            "Wir entwickeln individuelle Programme, die die Besonderheiten Ihres Teams und die gesetzten Ziele berucksichtigen. Von aktiven Wettkampfen im Freien bis hin zu strategischen Spielen - jede Veranstaltung zielt auf die Entwicklung von Teamfahigkeiten ab.",
          ],
        },
      },
      {
        content: {
          ru: [
            "Наши опытные инструкторы проведут увлекательные активности: веревочные курсы, квесты, спортивные эстафеты, стрельба из лука и многое другое. Все мероприятия проводятся с соблюдением норм безопасности.",
            "После активной программы гости могут расслабиться в комфортабельных зонах отдыха, насладиться барбекю на свежем воздухе и провести вечер у костра под звездным небом.",
          ],
          uz: [
            "Bizning tajribali instruktorlarimiz qiziqarli faoliyatlarni o'tkazadilar: arqon kurslari, kvestlar, sport estafetlari, kamondan otish va boshqalar. Barcha tadbirlar xavfsizlik me'yorlariga rioya qilgan holda o'tkaziladi.",
            "Faol dasturdan so'ng mehmonlar qulay dam olish zonalarida dam olishlari, ochiq havoda barbekyu bilan bahramand bo'lishlari va yulduzli osmon ostida gulxan yonida kechani o'tkazishlari mumkin.",
          ],
          en: [
            "Our experienced instructors will lead exciting activities: rope courses, quests, sports relays, archery, and much more. All events are conducted in compliance with safety standards.",
            "After an active program, guests can relax in comfortable recreation areas, enjoy a barbecue in the fresh air, and spend the evening by the fire under the starry sky.",
          ],
          de: [
            "Unsere erfahrenen Instruktoren leiten spannende Aktivitaten: Seilkurse, Quests, Sportstaffeln, Bogenschie.en und vieles mehr. Alle Veranstaltungen werden unter Einhaltung der Sicherheitsstandards durchgefuhrt.",
            "Nach einem aktiven Programm konnen die Gaste sich in komfortablen Erholungsbereichen entspannen, ein Barbecue an der frischen Luft geniessen und den Abend am Lagerfeuer unter dem Sternenhimmel verbringen.",
          ],
        },
      },
    ],
    features: {
      title: {
        ru: "Виды активностей",
        uz: "Faoliyat turlari",
        en: "Types of activities",
        de: "Arten von Aktivitaten",
      },
      items: [
        {
          ru: "Веревочные курсы",
          uz: "Arqon kurslari",
          en: "Rope courses",
          de: "Seilkurse",
        },
        {
          ru: "Командные квесты",
          uz: "Jamoa kvestlari",
          en: "Team quests",
          de: "Team-Quests",
        },
        {
          ru: "Спортивные эстафеты",
          uz: "Sport estafetlari",
          en: "Sports relays",
          de: "Sportstaffeln",
        },
        {
          ru: "Стрельба из лука",
          uz: "Kamondan otish",
          en: "Archery",
          de: "Bogenschiessen",
        },
      ],
    },
    gallery: {
      top: "/why-us-gallery-top.webp",
      bottomLeft: "/why-us-gallery-bottom-left.webp",
      bottomRight: "/why-us-comfort.webp",
    },
  },
  "sport-shooting": {
    title: {
      ru: "Спортивная стрельба",
      uz: "Sport otish",
      en: "Sport Shooting",
      de: "Sportschiessen",
    },
    subtitle: {
      ru: "Профессиональные тренировки и соревнования",
      uz: "Professional mashqlar va musobaqalar",
      en: "Professional training and competitions",
      de: "Professionelles Training und Wettkampfe",
    },
    heroImage: "/why-us-hero.webp",
    sections: [
      {
        title: {
          ru: "Стендовая и спортивная стрельба",
          uz: "Stend va sport otish",
          en: "Clay and sport shooting",
          de: "Tontauben- und Sportschiessen",
        },
        content: {
          ru: [
            "Наш стрелковый комплекс оборудован по последним международным стандартам и предоставляет возможности для занятий различными видами спортивной стрельбы. Здесь проводят тренировки как начинающие стрелки, так и профессиональные спортсмены.",
            "Стендовая стрельба - это захватывающий вид спорта, который развивает концентрацию, координацию и выдержку. Под руководством опытных инструкторов вы освоите технику стрельбы и сможете участвовать в соревнованиях.",
          ],
          uz: [
            "Bizning otish kompleksimiz so'nggi xalqaro standartlarga muvofiq jihozlangan va sport otishning turli xil turlari bilan shug'ullanish imkoniyatlarini taqdim etadi. Bu yerda yangi boshlanuvchilar ham, professional sportchilar ham mashq qiladilar.",
            "Stend otish - bu konsentratsiya, koordinatsiya va chidamlilikni rivojlantiradigan hayajonli sport. Tajribali instruktorlar rahbarligida siz otish texnikasini o'zlashtirasiz va musobaqalarda qatnashishingiz mumkin.",
          ],
          en: [
            "Our shooting complex is equipped according to the latest international standards and provides opportunities for various types of sport shooting. Both beginners and professional athletes train here.",
            "Clay shooting is an exciting sport that develops concentration, coordination, and endurance. Under the guidance of experienced instructors, you will master the shooting technique and be able to participate in competitions.",
          ],
          de: [
            "Unser Schie.komplex ist nach den neuesten internationalen Standards ausgestattet und bietet Moglichkeiten fur verschiedene Arten des Sportschiessens. Sowohl Anfanger als auch Profisportler trainieren hier.",
            "Tontaubenschiessen ist ein aufregender Sport, der Konzentration, Koordination und Ausdauer entwickelt. Unter Anleitung erfahrener Instruktoren werden Sie die Schiesstechnik beherrschen und an Wettkampfen teilnehmen konnen.",
          ],
        },
      },
      {
        content: {
          ru: [
            "Мы предоставляем всё необходимое оборудование: ружья, патроны, защитные наушники и очки. Для опытных стрелков предусмотрена возможность использования собственного оружия при наличии необходимых документов.",
            "На территории комплекса работает профессиональный оружейный магазин, где можно приобрести качественное оборудование и аксессуары для спортивной стрельбы.",
          ],
          uz: [
            "Biz barcha zarur jihozlarni taqdim etamiz: miltiqlar, o'qlar, himoya eshitish qurilmalari va ko'zoynaklar. Tajribali otuvchilar uchun zarur hujjatlar mavjud bo'lganda o'z qurollaridan foydalanish imkoniyati mavjud.",
            "Kompleks hududida professional qurol do'koni ishlaydi, u yerda sport otish uchun sifatli jihozlar va aksessuarlar sotib olish mumkin.",
          ],
          en: [
            "We provide all necessary equipment: shotguns, cartridges, protective headphones, and glasses. For experienced shooters, there is an option to use their own weapons with the necessary documents.",
            "A professional gun shop operates on the territory of the complex, where you can purchase quality equipment and accessories for sport shooting.",
          ],
          de: [
            "Wir stellen alle notwendigen Gerate zur Verfugung: Flinten, Patronen, Gehörschutz und Brillen. Fur erfahrene Schutzen besteht die Moglichkeit, eigene Waffen mit den erforderlichen Dokumenten zu verwenden.",
            "Auf dem Gelande des Komplexes befindet sich ein professionelles Waffengeschaft, in dem Sie hochwertige Ausrustung und Zubehor fur das Sportschiessen erwerben konnen.",
          ],
        },
      },
    ],
    features: {
      title: {
        ru: "Виды стрельбы",
        uz: "Otish turlari",
        en: "Types of shooting",
        de: "Arten des Schiessens",
      },
      items: [
        {
          ru: "Стендовая стрельба (траншея)",
          uz: "Stend otish (transhey)",
          en: "Trap shooting",
          de: "Trapschiessen",
        },
        {
          ru: "Круглый стенд (скит)",
          uz: "Dumaloq stend (skit)",
          en: "Skeet shooting",
          de: "Skeetschiessen",
        },
        {
          ru: "Спортинг",
          uz: "Sporting",
          en: "Sporting clays",
          de: "Sporting",
        },
        {
          ru: "Индивидуальные тренировки",
          uz: "Individual mashqlar",
          en: "Individual training",
          de: "Einzeltraining",
        },
      ],
    },
    gallery: {
      top: "/why-us-gallery-top.webp",
      bottomLeft: "/why-us-gallery-bottom-right.webp",
      bottomRight: "/why-us-gallery-bottom-left.webp",
    },
  },
};

// All category slugs for "Other Types" navigation
const allCategories: Array<{ slug: CategorySlug; icon: string }> = [
  { slug: "ecotourism", icon: "🌿" },
  { slug: "agrotourism", icon: "🌾" },
  { slug: "teambuilding", icon: "👥" },
  { slug: "sport-shooting", icon: "🎯" },
];

const TourismTypeInfoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { translate, language } = useLanguage();

  const categorySlug = slug as CategorySlug;
  const content = categoryContent[categorySlug];

  // Get other categories (exclude current one)
  const otherCategories = allCategories.filter(
    (cat) => cat.slug !== categorySlug,
  );

  if (!content) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center pt-[100px]">
        <div className="text-center">
          <h1
            className="text-[32px] font-medium text-[#333333] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {translate({
              ru: "Страница не найдена",
              uz: "Sahifa topilmadi",
              en: "Page not found",
              de: "Seite nicht gefunden",
            })}
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-[#8f7b49] hover:underline text-[18px]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {translate({
              ru: "Вернуться на главную",
              uz: "Bosh sahifaga qaytish",
              en: "Return to home",
              de: "Zur Startseite zuruckkehren",
            })}
          </button>
        </div>
      </div>
    );
  }

  const getLocalizedText = (textObj: {
    ru: string;
    uz: string;
    en: string;
    de: string;
  }) => {
    return textObj[language as keyof typeof textObj] || textObj.en;
  };

  const getLocalizedArray = (arrObj: {
    ru: string[];
    uz: string[];
    en: string[];
    de: string[];
  }) => {
    return arrObj[language as keyof typeof arrObj] || arrObj.en;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1C160D]">
      {/* Hero Section */}
      <header className="relative h-[clamp(500px,62.5vw,800px)] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={content.heroImage}
            alt={getLocalizedText(content.title)}
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full">
          {/* Back Button */}
          <button
            onClick={() => navigate("/tourism-types")}
            className="absolute left-[clamp(20px,3.47vw,50px)] top-[clamp(120px,12vw,180px)] flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-[clamp(14px,1.25vw,18px)] font-medium">
              {translate({
                ru: "Все виды туризма",
                uz: "Barcha turizm turlari",
                en: "All tourism types",
                de: "Alle Tourismusarten",
              })}
            </span>
          </button>

          {/* Title and Description */}
          <div className="absolute left-[clamp(20px,3.47vw,50px)] top-[clamp(180px,22vw,320px)] w-[clamp(90%,93.06vw,1340px)] text-white">
            <h1
              className="text-[clamp(40px,6.25vw,90px)] font-medium leading-[1.11] mb-[clamp(12px,1.39vw,20px)]"
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              {getLocalizedText(content.title)}
            </h1>
            <p
              className="text-[clamp(18px,2.22vw,32px)] font-normal leading-[1.25] opacity-80 max-w-[800px]"
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              {getLocalizedText(content.subtitle)}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-[#F5F5F0] px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)]">
        <div className="max-w-[1340px] mx-auto">
          {/* Content Sections */}
          {content.sections.map((section, sectionIndex) => (
            <section
              key={sectionIndex}
              className="flex flex-col gap-[clamp(20px,2.78vw,40px)] mb-[clamp(40px,5.56vw,80px)]"
            >
              {section.title && (
                <h2
                  className="text-[clamp(32px,4.17vw,60px)] font-medium leading-[1] text-[#333333]"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {getLocalizedText(section.title)}
                </h2>
              )}
              <div
                className="text-[clamp(16px,1.67vw,24px)] font-normal leading-[1.67] text-[#333333]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {getLocalizedArray(section.content).map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={
                      idx < getLocalizedArray(section.content).length - 1
                        ? "mb-6"
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* Features Section */}
          <section className="mb-[clamp(40px,5.56vw,80px)]">
            <h3
              className="text-[clamp(24px,2.22vw,32px)] font-medium leading-[1.25] text-[#333333] mb-[clamp(20px,2.78vw,40px)]"
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {getLocalizedText(content.features.title)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,1.39vw,20px)]">
              {content.features.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white hover:bg-[#8f7b49] group transition-all duration-300 rounded-[16px] p-[clamp(24px,2.08vw,30px)] cursor-pointer"
                >
                  <h4
                    className="text-[clamp(16px,1.39vw,20px)] font-medium leading-[1.3] text-[#333333] group-hover:text-white transition-colors"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {getLocalizedText(item)}
                  </h4>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery Section */}
          <section className="mb-[clamp(40px,5.56vw,80px)]">
            {/* Top Image */}
            <div className="relative h-[clamp(250px,34.72vw,500px)] w-full rounded-t-[20px] overflow-hidden">
              <img
                src={content.gallery.top}
                alt={`${getLocalizedText(content.title)} - gallery`}
                className="absolute w-full h-full object-cover"
              />
            </div>

            {/* Bottom Images */}
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/2 h-[clamp(250px,40.69vw,586px)] overflow-hidden md:rounded-bl-[20px] rounded-b-[20px] md:rounded-br-none">
                <img
                  src={content.gallery.bottomLeft}
                  alt={`${getLocalizedText(content.title)} - gallery`}
                  className="absolute w-full h-full object-cover"
                />
              </div>
              <div className="relative w-full md:w-1/2 h-[clamp(250px,40.69vw,586px)] overflow-hidden rounded-b-[20px] md:rounded-bl-none md:rounded-br-[20px]">
                <img
                  src={content.gallery.bottomRight}
                  alt={`${getLocalizedText(content.title)} - gallery`}
                  className="absolute w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Other Tourism Types Section */}
          <section className="mb-[clamp(40px,5.56vw,80px)]">
            <h3
              className="text-[clamp(24px,2.22vw,32px)] font-medium leading-[1.25] text-[#333333] mb-[clamp(20px,2.78vw,40px)]"
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {translate({
                ru: "Другие виды туризма",
                uz: "Boshqa turizm turlari",
                en: "Other tourism types",
                de: "Andere Tourismusarten",
              })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(16px,1.39vw,20px)]">
              {otherCategories.map((cat) => {
                const catContent = categoryContent[cat.slug];
                return (
                  <button
                    key={cat.slug}
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    className="bg-white hover:bg-[#8f7b49] group transition-all duration-300 rounded-[16px] p-[clamp(24px,2.08vw,30px)] text-left flex items-center gap-4"
                  >
                    <span className="text-[32px]">{cat.icon}</span>
                    <div>
                      <h4
                        className="text-[clamp(18px,1.53vw,22px)] font-medium leading-[1.3] text-[#333333] group-hover:text-white transition-colors"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {getLocalizedText(catContent.title)}
                      </h4>
                      <p
                        className="text-[clamp(14px,1.11vw,16px)] text-[#666666] group-hover:text-white/80 transition-colors mt-1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {translate({
                          ru: "Подробнее →",
                          uz: "Batafsil →",
                          en: "Learn more →",
                          de: "Mehr erfahren →",
                        })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-[#8f7b49] rounded-[20px] p-[clamp(30px,4.17vw,60px)] text-center">
            <h3
              className="text-[clamp(28px,3.47vw,50px)] font-medium leading-[1.2] text-white mb-[clamp(16px,2.08vw,30px)]"
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              {translate({
                ru: "Готовы к приключению?",
                uz: "Sarguzashtga tayyormisiz?",
                en: "Ready for an adventure?",
                de: "Bereit fur ein Abenteuer?",
              })}
            </h3>
            <p
              className="text-[clamp(16px,1.39vw,20px)] font-normal leading-[1.5] text-white/80 mb-[clamp(24px,2.78vw,40px)] max-w-[600px] mx-auto"
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {translate({
                ru: "Выберите тур и забронируйте незабываемое путешествие уже сегодня",
                uz: "Turni tanlang va bugun unutilmas sayohatni bron qiling",
                en: "Choose a tour and book an unforgettable journey today",
                de: "Wahlen Sie eine Tour und buchen Sie noch heute eine unvergessliche Reise",
              })}
            </p>
            <button
              onClick={() => navigate("/tours")}
              className="bg-white text-[#8f7b49] hover:bg-white/90 transition-all rounded-[100px] px-[clamp(24px,2.78vw,40px)] py-[clamp(12px,1.39vw,20px)] text-[clamp(14px,1.25vw,18px)] font-semibold uppercase"
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {translate({
                ru: "Смотреть туры",
                uz: "Turlarni ko'rish",
                en: "View Tours",
                de: "Touren ansehen",
              })}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TourismTypeInfoPage;
