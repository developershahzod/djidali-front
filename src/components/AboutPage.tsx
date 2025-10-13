import React from 'react';
import { ArrowLeft, Award, Users, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">{t('about.title')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <img 
            src="/svgviewer-png-output.png" 
            alt="DJIDALI ECOLOGICAL TOURISM" 
            className="h-24 w-auto mx-auto mb-6"
          />
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-6">{t('about.companyName')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('about.description')}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Award className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.professionalService')}</h3>
            <p className="text-gray-600">{t('about.professionalDesc')}</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.experiencedTeam')}</h3>
            <p className="text-gray-600">{t('about.experiencedDesc')}</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Globe className="w-10 h-10 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.wideGeography')}</h3>
            <p className="text-gray-600">{t('about.wideDesc')}</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.safetyGuarantee')}</h3>
            <p className="text-gray-600">{t('about.safetyDesc')}</p>
          </div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('about.ourStory')}</h3>
          <div className="prose prose-lg text-gray-700">
            <p className="mb-4">
              {t('about.storyText1')}
            </p>
            <p className="mb-4">
              {t('about.storyText2')}
            </p>
            <p>
              {t('about.storyText3')}
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('about.ourMission')}</h3>
            <p className="text-gray-700">
              {t('about.missionText')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('about.ourVision')}</h3>
            <p className="text-gray-700">
              {t('about.visionText')}
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 rounded-2xl p-10 text-white text-center shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">{t('about.contactUs')}</h3>
          <p className="text-lg mb-6">
            {t('about.contactDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+998901234567" 
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors btn-animate"
            >
              📞 +998 90 123 45 67
            </a>
            <a 
              href="https://t.me/uzbekistan_safari" 
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors btn-animate"
            >
              📱 {t('login.telegram')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;