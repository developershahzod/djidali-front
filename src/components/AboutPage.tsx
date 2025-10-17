import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=1920')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Мы — там, где природа<br />говорит первой
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            DJIDALI объединяет природу, комфорт и опыт — создаём путешествия, которые запоминаются
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12 mb-20 text-center">
          <div>
            <div className="text-6xl font-bold text-gray-900 mb-3">180<span className="text-4xl">тыс.</span></div>
            <p className="text-gray-600 text-lg">Счастливых путешественников</p>
          </div>
          <div>
            <div className="text-6xl font-bold text-gray-900 mb-3">64+</div>
            <p className="text-gray-600 text-lg">Туристических парков</p>
          </div>
          <div>
            <div className="text-6xl font-bold text-gray-900 mb-3">10+</div>
            <p className="text-gray-600 text-lg">Баз отдыха</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <button className="px-6 py-4 bg-[#8B7355] text-white rounded-xl font-semibold shadow-md">
            Уникальные маршруты
          </button>
          <button className="px-6 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200">
            Знакомство с первозданной природой
          </button>
          <button className="px-6 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200">
            Комфортное проживание
          </button>
          <button className="px-6 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200">
            Команда специалистов
          </button>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Откройте для себя уникальные маршруты
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-8">
            Наши маршруты созданы для тех, кто ищет соединение с природой без лишней суеты.
            Каждый тур — это тщательно продуманное путешествие, где комфорт и экологический подход сочетаются с
            возможностью увидеть дикую природу в её непревзойдённой красе.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Вы сможете пройти по тропам, по которым ходят местные егеря, и увидеть мир глазами тех, кто его действительно чувствует.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg"
              alt="Nature"
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg"
              alt="Wildlife"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-12 mb-20">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            DJIDALI — это не просто маршруты, а встречи с живой природой
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            Каждое путешествие — возможность почувствовать ритм Узбекистана, вдохнуть свежий воздух и оставить в
            сердце ощущение свободы
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;