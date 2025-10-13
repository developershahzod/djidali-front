import React from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 page-transition">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('page.backButton')}</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t('contact.title')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.contactInfo')}</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-4 shadow-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('contact.phone')}</h3>
                  <p className="text-gray-600">+998 71 123 45 67</p>
                  <p className="text-gray-600">+998 90 987 65 43</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-full p-4 shadow-lg">
                  <Mail className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('contact.email')}</h3>
                  <p className="text-gray-600">info@djidali-eco.uz</p>
                  <p className="text-gray-600">booking@djidali-eco.uz</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-full p-4 shadow-lg">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('contact.address')}</h3>
                  <p className="text-gray-600">
                    {t('footer.addressFull')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full p-4 shadow-lg">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('contact.workingHours')}</h3>
                  <p className="text-gray-600">{t('contact.mondayFriday')}</p>
                  <p className="text-gray-600">{t('contact.saturday')}</p>
                  <p className="text-gray-600">{t('contact.sunday')}</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('contact.socialMedia')}</h3>
              <div className="flex space-x-4">
                <a
                  href="https://t.me/uzbekistan_safari"
                  className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl btn-animate"
                >
                  📱
                </a>
                <a
                  href="https://instagram.com/uzbekistan_safari"
                  className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-4 rounded-full hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl btn-animate"
                >
                  📷
                </a>
                <a
                  href="https://facebook.com/uzbekistan.safari"
                  className="bg-gradient-to-br from-blue-700 to-blue-800 text-white p-4 rounded-full hover:from-blue-800 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl btn-animate"
                >
                  📘
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Map */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.ourLocation')}</h2>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p>{t('contact.mapPlaceholder')}</p>
                <p className="text-sm">{t('contact.addressFull')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;