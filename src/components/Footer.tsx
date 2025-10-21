import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
        <div className="mb-20">
          <p className="text-sm text-gray-500 mb-4 font-light tracking-wider">{t('footer.contactPrompt')}</p>
          <h3 className="text-[2.5rem] font-light text-gray-900">hello@djidali.uz</h3>
        </div>

        <div className="mb-20">
          <p className="text-sm text-gray-500 mb-4 font-light tracking-wider">{t('footer.siteSections')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 lg:gap-24 mb-24">
          <div>
            <h4 className="text-base font-normal mb-8 text-gray-900">{t('footer.section.about')}</h4>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  {t('footer.link.gallery')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  {t('footer.link.team')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-normal mb-8 text-gray-900">{t('footer.section.tourTypes')}</h4>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => navigate('/ecotourism')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  Экотуризм
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tours?type=agro')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  {t('footer.tourType.agro')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tours?type=team')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  {t('footer.tourType.teamBuilding')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tours?type=sport')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  {t('footer.tourType.sportShooting')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tours?type=hunting')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  {t('footer.tourType.hunting')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tours?type=uzbekistan')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  {t('footer.tourType.uzbekistan')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-normal mb-8 text-gray-900">{t('footer.section.whyUs')}</h4>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => navigate('/why-us#team')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  {t('home.experience.team')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/why-us#comfort')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  {t('home.experience.comfort')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/why-us#routes')}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  {t('home.experience.routes')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-normal mb-8 text-gray-900">{t('footer.section.social')}</h4>
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
            <div className="text-gray-500 text-base font-light whitespace-pre-line">
              {t('footer.addressFull')}
            </div>
            <div className="flex flex-col md:items-end gap-3 text-sm text-gray-500">
              <span className="whitespace-pre-line">{t('footer.workingHours')}</span>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-gray-900 transition-colors font-light"
                >
                  {t('footer.home')}
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-gray-900 transition-colors font-light"
                >
                  {t('footer.aboutUs')}
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-gray-900 transition-colors font-light"
                >
                  {t('footer.contact')}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
            <span>{t('footer.companyDesc')}</span>
            <div className="flex flex-wrap items-center gap-4">
              <button className="hover:text-gray-900 transition-colors font-light">
                {t('footer.privacyPolicy')}
              </button>
              <button className="hover:text-gray-900 transition-colors font-light">
                {t('footer.termsOfService')}
              </button>
              <button className="hover:text-gray-900 transition-colors font-light">
                {t('footer.help')}
              </button>
            </div>
            <span className="text-gray-600 font-light">{t('footer.connectWithUs')}</span>
          </div>
          <div className="mt-6 text-center text-gray-400 text-xs">
            {t('footer.copyright')}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
