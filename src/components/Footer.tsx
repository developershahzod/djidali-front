import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
        <div className="mb-20">
          <p className="text-sm text-gray-500 mb-4 font-light tracking-wider">Связаться с нами</p>
          <h3 className="text-[2.5rem] font-light text-gray-900">hello@djidali.uz</h3>
        </div>

        <div className="mb-20">
          <p className="text-sm text-gray-500 mb-4 font-light tracking-wider">Разделы сайта</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 lg:gap-24 mb-24">
          <div>
            <h4 className="text-base font-normal mb-8 text-gray-900">О нас</h4>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  Галерея
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  Команда
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-normal mb-8 text-gray-900">Виды туризма</h4>
            <ul className="space-y-4">
              <li>
                <button className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Экотуризм
                </button>
              </li>
              <li>
                <button className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Агротуризм
                </button>
              </li>
              <li>
                <button className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Тимбилдинг
                </button>
              </li>
              <li>
                <button className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Спортивная стрельба
                </button>
              </li>
              <li>
                <button className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Охотничий туризм
                </button>
              </li>
              <li>
                <button className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Туры в Узбекистане
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-normal mb-8 text-gray-900">Почему мы</h4>
            <ul className="space-y-4">
              <li>
                <button className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Команда специалистов
                </button>
              </li>
              <li>
                <button className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Знакомство с первозданной природой
                </button>
              </li>
              <li>
                <button className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Комфортное проживание
                </button>
              </li>
              <li>
                <button className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Уникальные маршруты
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-normal mb-8 text-gray-900">Социальные сети</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Linkedin
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-gray-500 text-base font-light">
              © 2025 DjidaliTravel
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-16 h-16 bg-[#8B7355] hover:bg-[#7A6349] rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
