import React from 'react';
import { Download, Tag, Calendar, MapPin, Camera, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FeatureCards: React.FC = () => {
  const { t } = useLanguage();

  const handleFeatureClick = (featureId: string) => {
    switch (featureId) {
      case 'download':
        // Open app store or download link
        window.open('https://play.google.com/store', '_blank');
        break;
      case 'discounts':
        // Navigate to discounted tours
        window.location.href = '/?discount=true';
        break;
      case 'newYear':
        // Navigate to New Year tours
        window.location.href = '/?category=new-year';
        break;
      case 'monthly':
        // Navigate to monthly tours
        window.location.href = '/?featured=monthly';
        break;
      case 'november':
        // Navigate to November tours
        window.location.href = '/?month=november';
        break;
      default:
        break;
    }
  };

  const features = [
    
    {
      id: 'discounts',
      icon: Tag,
      title: t('feature.discounts'),
      bgColor: 'bg-red-500',
      iconColor: 'text-white',
      description: t('feature.upTo50')
    },
    {
      id: 'newYear',
      icon: Calendar,
      title: t('feature.newYear'),
      bgColor: 'bg-blue-500',
      iconColor: 'text-white',
      description: t('feature.tours2026')
    },
    {
      id: 'monthly',
      icon: MapPin,
      title: t('feature.monthlyTours'),
      bgColor: 'bg-emerald-500',
      iconColor: 'text-white',
      description: t('feature.special')
    },
    {
      id: 'november',
      icon: Camera,
      title: t('feature.november'),
      bgColor: 'bg-orange-500',
      iconColor: 'text-white',
      description: t('feature.autumn')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => handleFeatureClick(feature.id)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg cursor-pointer group"
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={`p-3 rounded-xl ${feature.bgColor}`}>
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;