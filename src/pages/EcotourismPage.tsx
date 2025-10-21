import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

interface EcoData {
  title: string;
  sections: string[];
  subcategories: Array<{ title: string; url: string }>;
}

const EcotourismPage: React.FC = () => {
  const [data, setData] = useState<EcoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://djidali.uz/rest/ekoturizm');
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');
        const textContent = doc.body.textContent || '';
        
        // Split into sections by paragraphs
        const paragraphs = textContent
          .split('\n')
          .map(p => p.trim())
          .filter(p => p.length > 100);

        // Extract subcategory links
        const links = doc.querySelectorAll('a');
        const subcategories: Array<{ title: string; url: string }> = [];
        
        links.forEach(link => {
          const href = link.getAttribute('href') || '';
          const text = link.textContent?.trim() || '';
          if (href.includes('/rest/ekoturizm/') && text && !subcategories.find(s => s.title === text)) {
            subcategories.push({ title: text, url: href });
          }
        });

        setData({
          title: 'Экотуризм',
          sections: paragraphs.slice(0, 6),
          subcategories: subcategories.slice(0, 4)
        });
      } catch (error) {
        console.error('Error fetching ecotourism data:', error);
        // Fallback data
        setData({
          title: 'Экотуризм',
          sections: [
            'Современный мир стремительно развивается, и с каждым годом все больше людей стремятся к знакомству с природой, поиску спокойствия и отдыха в гармонии с природой и наслаждению ее естественной красотой. Экотуризм - это не просто отдых, это осознанное путешествие, которое позволяет наслаждаться природой, не причинив ей вреда.',
            'Экотуризм - это вид туризма, направленный на знакомство с природными территориями, их экосистемами и биоразнообразием. Его главная цель - не только отдых, но и сохранение природы, развитие местных сообществ и экологическое просвещение.',
            'Наше лесоохотничье хозяйство - это уникальное место для организации экотуризма. Мы предлагаем Вам посетить территорию с уникальной природой, живописными пейзажами, естественными ландшафтами лесов и водоемами.',
            'Экотуризм способствует сохранению природных территорий, экологическому образованию и развитию местных сообществ.',
            'Отправляясь в путешествие по природным территориям, важно соблюдать природоохранные нормы, использовать экологичные материалы и придерживаться установленных маршрутов.',
            'Экотуризм - это возможность не только насладиться природой, но и стать частью ее сохранения.'
          ],
          subcategories: [
            { title: 'Бердвотчинг', url: '/rest/ekoturizm/berdvotcing' },
            { title: 'Кемпинг', url: '/rest/ekoturizm/kemping' },
            { title: 'Рекреационная рыбалка', url: '/rest/ekoturizm/rekreacionnaia-rybalka' },
            { title: 'Сезонные экскурсии и прогулки', url: '/rest/ekoturizm/sezonnye-ekskursii-i-progulki' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(
    () => [
      {
        value: '10',
        suffix: '+',
        label: 'лет успешной работы'
      },
      {
        value: '5000',
        suffix: '+',
        label: 'довольных туристов'
      },
      {
        value: '100',
        suffix: '%',
        label: 'экологичный подход'
      }
    ],
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8f7b49] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <p className="text-xl text-red-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Ошибка загрузки данных
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1C160D]">
      <header className="relative h-[clamp(600px,62.5vw,900px)] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/contact-nature-image.webp"
            alt="Экотуризм"
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full">
          {/* Title and Description */}
          <div className="absolute left-[clamp(20px,3.47vw,50px)] top-[clamp(100px,14.58vw,210px)] w-[clamp(90%,93.06vw,1340px)] text-white">
            <h1
              className="text-[clamp(40px,6.25vw,90px)] font-medium leading-[1.11] mb-[clamp(12px,1.39vw,20px)]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.03em'
              }}
            >
              {data.title}
            </h1>
            <p
              className="text-[clamp(18px,2.22vw,32px)] font-normal leading-[1.25] opacity-80 max-w-[800px]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.03em'
              }}
            >
              Осознанное путешествие в гармонии с природой
            </p>
          </div>

          {/* Statistics */}
          <div className="absolute left-[clamp(20px,3.47vw,50px)] top-[clamp(400px,50.14vw,722px)] flex flex-col md:flex-row gap-[clamp(30px,5.56vw,80px)] text-white">
            {stats.map((stat, index) => (
              <div key={index} className="w-[clamp(180px,21.11vw,304px)]">
                <div
                  className="mb-[clamp(6px,0.69vw,10px)] whitespace-nowrap"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    letterSpacing: '-0.0125em'
                  }}
                >
                  <span className="text-[clamp(50px,5.56vw,80px)] font-normal leading-[1]">{stat.value}</span>
                  <span className="text-[clamp(30px,3.47vw,50px)] font-extralight leading-[1]"> {stat.suffix}</span>
                </div>
                <p
                  className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4]"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-[#F5F5F0] px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)]">
        {/* Section 1: What is Ecotourism */}
        <section className="flex flex-col gap-[clamp(20px,2.78vw,40px)] mb-[clamp(40px,5.56vw,80px)]">
          <h2
            className="text-[clamp(32px,4.17vw,60px)] font-medium leading-[1] text-[#333333]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.03em'
            }}
          >
            Что такое экотуризм?
          </h2>
          <div
            className="text-[clamp(16px,1.67vw,24px)] font-normal leading-[1.67] text-[#333333]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            {data.sections.slice(0, 2).map((section, index) => (
              <p key={index} className={index < data.sections.slice(0, 2).length - 1 ? 'mb-6' : ''}>
                {section}
              </p>
            ))}
          </div>
        </section>

        {/* Section 2: Our Territory */}
        <section className="mb-[clamp(40px,5.56vw,80px)]">
          <div
            className="text-[clamp(16px,1.67vw,24px)] font-normal leading-[1.67] text-[#333333]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            {data.sections.slice(2, 4).map((section, index) => (
              <p key={index} className={index < data.sections.slice(2, 4).length - 1 ? 'mb-6' : ''}>
                {section}
              </p>
            ))}
          </div>
        </section>

        {/* Section 3: Subcategories */}
        <section className="mb-[clamp(40px,5.56vw,80px)]">
          <h3
            className="text-[clamp(24px,2.22vw,32px)] font-medium leading-[1.25] text-[#333333] mb-[clamp(20px,2.78vw,40px)]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            Виды экотуризма
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,1.39vw,20px)]">
            {data.subcategories.map((category, index) => (
              <div
                key={index}
                className="bg-white hover:bg-[#8f7b49] group transition-all duration-300 rounded-[16px] p-[clamp(24px,2.08vw,30px)] cursor-pointer"
              >
                <h4
                  className="text-[clamp(18px,1.39vw,20px)] font-medium leading-[1.3] text-[#333333] group-hover:text-white transition-colors"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {category.title}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Importance */}
        <section className="mb-[clamp(40px,5.56vw,80px)]">
          <div
            className="text-[clamp(16px,1.67vw,24px)] font-normal leading-[1.67] text-[#333333]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            {data.sections.slice(4).map((section, index) => (
              <p key={index} className={index < data.sections.slice(4).length - 1 ? 'mb-6' : ''}>
                {section}
              </p>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section>
          {/* Top Image */}
          <div className="relative h-[clamp(300px,34.72vw,500px)] w-full rounded-t-[20px] overflow-hidden">
            <img
              src="/why-us-gallery-top.webp"
              alt="Природа"
              className="absolute w-full h-full object-cover"
            />
          </div>

          {/* Bottom Images */}
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-[clamp(350px,40.69vw,586px)] overflow-hidden md:rounded-bl-[20px] rounded-b-[20px] md:rounded-br-none">
              <img
                src="/why-us-gallery-bottom-left.webp"
                alt="Лес"
                className="absolute w-full h-full object-cover"
              />
            </div>
            <div className="relative w-full md:w-1/2 h-[clamp(350px,40.69vw,586px)] overflow-hidden rounded-b-[20px] md:rounded-bl-none md:rounded-br-[20px]">
              <img
                src="/why-us-gallery-bottom-right.webp"
                alt="Горы"
                className="absolute w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EcotourismPage;
