import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img
                src="/svgviewer-png-output.png"
                alt="DJIDALI ECOLOGICAL TOURISM"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://t.me/uzbekistan_safari"
                className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-colors btn-animate text-white"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/uzbekistan_safari"
                className="bg-pink-600 hover:bg-pink-700 p-3 rounded-full transition-colors btn-animate text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/uzbekistan.safari"
                className="bg-blue-800 hover:bg-blue-900 p-3 rounded-full transition-colors btn-animate text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-900">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('footer.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('footer.aboutUs')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('footer.contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/ekoturizm')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('footer.ecoTours')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/tours')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('footer.uzbekistanTours')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-900">{t('footer.contactInfo')}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">
                    {t('footer.addressFull')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">+998 71 123 45 67</p>
                  <p className="text-gray-700">+998 90 987 65 43</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">info@djidali-eco.uz</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">{t('footer.workingHours')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              {t('footer.copyright')}
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('footer.privacyPolicy')}
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('footer.termsOfService')}
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('footer.help')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;