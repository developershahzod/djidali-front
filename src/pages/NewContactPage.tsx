import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type ButtonState = 'idle' | 'loading' | 'success';

const NewContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [country, setCountry] = useState('Узбекистан');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [buttonState, setButtonState] = useState<ButtonState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setButtonState('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setButtonState('success');
    
    // Reset after 3 seconds
    setTimeout(() => {
      setButtonState('idle');
      setPhone('');
      setSubject('');
      setMessage('');
      setAgreed(false);
    }, 3000);
  };

  return (
    <div className="bg-[#f4f2ed]">
      {/* Hero Section - 1340x100px */}
      <header className="px-[clamp(20px,3.47vw,50px)] pt-[clamp(60px,8.33vw,120px)] pb-[40px]">
        <div className="max-w-[1340px] mx-auto h-[100px] flex flex-col md:flex-row md:items-end md:justify-between">
          <h1
            className="text-[clamp(32px,4.17vw,60px)] font-medium leading-[100%] tracking-[-1.8px] text-[#333333]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('contactPage.hero.title')}
          </h1>
          <div className="flex flex-col gap-[clamp(4px,0.42vw,6px)]">
            <p
              className="text-[clamp(12px,1.11vw,16px)] font-medium leading-[28px] tracking-[-0.48px] text-[#333333]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contact.phoneLabel')}
            </p>
            <p
              className="text-[clamp(20px,2.43vw,35px)] font-medium leading-[100%] tracking-[-0.7px] text-[#333333]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.hero.phone')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content - Form + Image */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - 705x1256px total */}
        <div className="w-full lg:w-[705px] h-[1256px]">
          {/* Contact Info Block - 705x450px */}
          <div className="relative w-[705px] h-[450px] bg-[#8f7b49]">
            {/* Icon Container */}
            <div className="absolute top-[60px] left-[50px] w-[80px] h-[80px] bg-[#333333] rounded-[45px] flex items-center justify-center p-[25px]">
              <img 
                src="/contact-icon-correct.svg" 
                alt="Contact Icon" 
                className="w-[40px] h-[40px]"
              />
            </div>
            
            {/* Text Container */}
            <div className="absolute top-[220px] left-[50px] w-[615px] text-white">
              <h2
                className="text-[60px] font-medium leading-[60px] tracking-[-1.8px] mb-[20px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('contactPage.form.title')}
              </h2>
              <p
                className="text-[16px] font-medium leading-[28px] tracking-[-0.48px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('contactPage.form.description')}
              </p>
            </div>
          </div>
          
          {/* Form Container - 705x806px */}
          <div className="w-[705px] h-[806px] bg-[#cbc2ab] px-[50px] py-[80px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
            {/* Country Dropdown - 605x80px */}
            <div className="w-[605px] h-[80px] border-2 border-[rgba(51,51,51,0.2)] rounded-[10px] px-[20px] py-[18px] bg-transparent flex flex-col justify-center">
              <label
                className="block text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-[#333333] opacity-50 mb-[3px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('contactPage.form.country')}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-transparent text-[22px] font-semibold leading-[24px] tracking-[-0.44px] text-[#333333] outline-none"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <option>Узбекистан</option>
                <option>Россия</option>
                <option>Казахстан</option>
                <option>Кыргызстан</option>
                <option>Таджикистан</option>
                <option>Туркменистан</option>
                <option>США</option>
                <option>Великобритания</option>
                <option>Германия</option>
                <option>Франция</option>
              </select>
            </div>

            {/* Phone Input - 605x80px */}
            <div className="w-[605px] h-[80px] border-2 border-[rgba(51,51,51,0.4)] rounded-[10px] px-[20px] py-[18px] flex items-center">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('contactPage.form.phonePlaceholder')}
                className="w-full bg-transparent text-[22px] font-semibold leading-[24px] tracking-[-0.44px] text-[#333333] placeholder:opacity-70 outline-none"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
            </div>

            {/* Subject Input - 605x80px */}
            <div className="w-[605px] h-[80px] border-2 border-[rgba(51,51,51,0.4)] rounded-[10px] px-[20px] py-[18px] flex items-center">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('contactPage.form.subjectPlaceholder')}
                className="w-full bg-transparent text-[22px] font-semibold leading-[24px] tracking-[-0.44px] text-[#333333] placeholder:opacity-70 outline-none"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
            </div>

            {/* Message Textarea - 605x200px */}
            <div className="w-[605px] h-[200px] border-2 border-[rgba(51,51,51,0.2)] rounded-[10px] px-[20px] py-[28px]">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('contactPage.form.messagePlaceholder')}
                className="w-full h-full bg-transparent text-[22px] font-semibold leading-[24px] tracking-[-0.44px] text-[#333333] placeholder:opacity-70 outline-none resize-none"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
            </div>

            {/* Checkbox - 24px */}
            <div className="flex items-center gap-[12px]">
              <input
                type="checkbox"
                id="privacy"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-[24px] h-[24px] rounded cursor-pointer"
              />
              <label
                htmlFor="privacy"
                className="text-[20px] font-medium leading-[100%] tracking-[-0.4px] text-[#333333] cursor-pointer"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('contactPage.form.privacy')}{' '}
                <span className="underline text-white">{t('contactPage.form.privacyLink')}</span>
              </label>
            </div>

            {/* Submit Button - 352x80px */}
            <button
              type="submit"
              disabled={!agreed || buttonState !== 'idle'}
              className="w-[352px] h-[80px] bg-[#333333] hover:bg-[#4a4a4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-[10px] px-[56px] py-[30px] flex items-center justify-center"
            >
              {buttonState === 'idle' && (
                <span
                  className="text-white text-[20px] font-bold leading-[20px] tracking-[-0.4px]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {t('contactPage.form.submit')}
                </span>
              )}
              {buttonState === 'loading' && (
                <div className="w-[24px] h-[24px] border-3 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {buttonState === 'success' && (
                <svg
                  className="w-[28px] h-[28px] text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </form>
          </div>
        </div>

        {/* Image Container - Right - 735x1256px */}
        <div className="relative w-full lg:w-[735px] h-[1256px]">
          <img
            src="/contact-nature-image.webp"
            alt={t('contactPage.image.title')}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.45)] from-[23%] to-transparent" />
          <div className="absolute top-[60px] left-[50px] text-white max-w-[635px]">
            <h2
              className="text-[50px] font-medium leading-[60px] tracking-[-1.5px]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.image.title')}
            </h2>
            <p
              className="text-[50px] font-medium leading-[60px] tracking-[-1.5px] text-[#D8CCB3]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.image.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Second Row - Working Hours + Suitcase Icon */}
      <div className="flex flex-col lg:flex-row">
        {/* Info Section - Working Hours & Email - 705x408px */}
        <div className="w-full lg:w-[705px] h-[408px] bg-white px-[50px] py-[80px]">
        <div className="w-[605px] flex flex-col gap-[70px]">
          <div className="flex flex-col gap-[6px]">
            <p
              className="text-[16px] font-medium leading-[28px] tracking-[-0.48px] text-[#333333]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.info.workingHours')}
            </p>
            <p
              className="text-[45px] font-medium leading-[55px] tracking-[-1.35px] text-[#333333]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.info.workingHoursValue')}
            </p>
          </div>
          <div className="flex flex-col gap-[6px]">
            <p
              className="text-[16px] font-medium leading-[28px] tracking-[-0.48px] text-[#333333]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.info.email')}
            </p>
            <p
              className="text-[45px] font-medium leading-[55px] tracking-[-1.35px] text-[#333333]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.info.emailValue')}
            </p>
          </div>
        </div>
        </div>

        {/* Suitcase Icon Section - 735x408px */}
        <div className="w-full lg:w-[735px] h-[408px] bg-[#CBC2AB] flex items-center justify-center">
          <img 
            src="/suitcase-icon.svg" 
            alt="Suitcase" 
            className="w-[250px] h-[250px]"
          />
        </div>
      </div>

      {/* Location Section - 1340x600px */}
      <div className="px-[50px] py-[80px]">
        <div className="max-w-[1340px] mx-auto flex flex-col gap-[40px]">
          <h2
            className="text-[60px] font-medium leading-[60px] tracking-[-1.8px] text-[#333333]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('contactPage.location.title')}
          </h2>
          <div className="relative w-[1340px] h-[500px] rounded-[20px] overflow-hidden border border-white">
            <img 
              src="/contact-map.webp" 
              alt="Map" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Map Pin */}
            <div className="absolute top-[240px] left-[655px] w-[20px] h-[20px]">
              <div className="absolute inset-[-80%_-110%_-140%_-110%] bg-[#8F7B49] rounded-full opacity-30" />
              <div className="absolute inset-0 bg-[#8F7B49] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContactPage;
