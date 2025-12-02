import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type ButtonState = 'idle' | 'loading' | 'success';

const NewContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [country, setCountry] = useState('');
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
            className="pt-[100px] md:pt-0 text-[clamp(32px,4.17vw,60px)] font-medium leading-[100%] tracking-[-1.8px] text-[#333333]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('contactPage.hero.title')}
          </h1>
          <div className="flex flex-col gap-[clamp(4px,0.42vw,6px)]">
            <p
              className="text-[clamp(12px,1.11vw,16px)] font-medium leading-[28px] tracking-[-0.48px] text-[#333333]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.form.phone')}
            </p>
            <p
              className="text-[clamp(20px,2.43vw,35px)] font-medium leading-[100%] tracking-[-0.7px] text-[#333333]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              +998 90 123 45 67
            </p>
          </div>
        </div>
      </header>

      {/* Main Content - Form + Image */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - 705x1256px total */}
        <div className="w-full lg:w-[50%] min-h-[1256px]">
          {/* Contact Info Block - 705x450px */}
          <div className="relative h-[450px] bg-[#8f7b49]">
            {/* Icon Container */}
            <div className="absolute top-[clamp(40px,4.17vw,60px)] left-[clamp(20px,3.47vw,50px)] w-[clamp(60px,5.56vw,80px)] h-[clamp(60px,5.56vw,80px)] bg-[#333333] rounded-[45px] flex items-center justify-center p-[25px]">
              <img 
                src="/contact-icon-correct.svg" 
                alt="Contact Icon" 
                className="w-[40px] h-[40px]"
              />
            </div>
            
            {/* Text Container */}
            <div className="absolute top-[clamp(160px,15.28vw,220px)] left-[clamp(20px,3.47vw,50px)] right-[clamp(20px,3.47vw,50px)] max-w-[615px] text-white">
              <h2
                className="text-[clamp(32px,4.17vw,60px)] font-medium leading-[1] tracking-[-1.8px] mb-[20px]"
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
          <div className="min-h-[806px] bg-[#cbc2ab] px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] max-w-[605px]">
            {/* Country Dropdown - 605x80px */}
            <div className="w-full h-[80px] border-2 border-[rgba(51,51,51,0.2)] rounded-[10px] px-[20px] py-[18px] bg-transparent flex flex-col justify-center">
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
                <option value="">{t('contactPage.form.countryPlaceholder')}</option>
                <option value="uz">O'zbekiston</option>
                <option value="ru">Rossiya</option>
                <option value="kz">Qozog'iston</option>
                <option value="kg">Qirg'iziston</option>
                <option value="tj">Tojikiston</option>
                <option value="tm">Turkmaniston</option>
                <option value="us">AQSh</option>
                <option value="gb">Buyuk Britaniya</option>
                <option value="de">Germaniya</option>
                <option value="fr">Fransiya</option>
              </select>
            </div>

            {/* Phone Input - 605x80px */}
            <div className="w-full h-[80px] border-2 border-[rgba(51,51,51,0.4)] rounded-[10px] px-[20px] py-[18px] flex items-center">
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
            <div className="w-full h-[80px] border-2 border-[rgba(51,51,51,0.4)] rounded-[10px] px-[20px] py-[18px] flex items-center">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('contactPage.form.subject')}
                className="w-full bg-transparent text-[22px] font-semibold leading-[24px] tracking-[-0.44px] text-[#333333] placeholder:opacity-70 outline-none"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
            </div>

            {/* Message Textarea - 605x200px */}
            <div className="w-full h-[200px] border-2 border-[rgba(51,51,51,0.2)] rounded-[10px] px-[20px] py-[28px]">
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
                {t('contactPage.form.privacy')} <span className="underline text-white">{t('contactPage.form.privacyLink')}</span>
              </label>
            </div>

            {/* Submit Button - 352x80px */}
            <button
              type="submit"
              disabled={!agreed || buttonState !== 'idle'}
              className="w-full md:w-[352px] h-[80px] bg-[#333333] hover:bg-[#4a4a4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-[10px] px-[56px] py-[30px] flex items-center justify-center"
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
        <div className="relative w-full lg:w-[50%] h-[clamp(400px,87.22vw,1256px)] lg:h-[1256px] hidden lg:block">
          <img
            src="/fcd4ea8bf176e4851a46f14de3020f62faed656d.jpg"
            alt={t('contactPage.image.title')}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.45)] from-[23%] to-transparent" />
          <div className="absolute top-[clamp(40px,4.17vw,60px)] left-[clamp(20px,3.47vw,50px)] text-white max-w-[635px]">
            <h2
              className="text-[clamp(32px,3.47vw,50px)] font-medium leading-[1.2] tracking-[-1.5px]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.image.title')}
            </h2>
            <p
              className="text-[clamp(32px,3.47vw,50px)] font-medium leading-[1.2] tracking-[-1.5px] text-[#D8CCB3]"
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
        <div className="w-full lg:w-[50%] min-h-[408px] bg-white px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)]">
        <div className="w-full max-w-[605px] flex flex-col gap-[clamp(40px,4.86vw,70px)]">
          <div className="flex flex-col gap-[6px]">
            <p
              className="text-[16px] font-medium leading-[28px] tracking-[-0.48px] text-[#333333]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.info.workingHours')}
            </p>
            <p
              className="text-[clamp(28px,3.13vw,45px)] font-medium leading-[1.2] tracking-[-1.35px] text-[#333333]"
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
              className="text-[clamp(28px,3.13vw,45px)] font-medium leading-[1.2] tracking-[-1.35px] text-[#333333]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('contactPage.info.emailValue')}
            </p>
          </div>
        </div>
        </div>
        {/* Suitcase Icon Section - 735x408px */}
        <div className="w-full lg:w-[50%] h-[clamp(300px,28.33vw,408px)] bg-[#CBC2AB] flex items-center justify-center">
          <img 
            src="/suitcase-icon.svg" 
            alt="Suitcase" 
            className="w-[clamp(150px,17.36vw,250px)] h-[clamp(150px,17.36vw,250px)]"
          />
        </div>
      </div>
      {/* Location Section - 1340x600px */}
      <div className="px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)]">
        <div className="max-w-[1340px] mx-auto flex flex-col gap-[40px]">
          <h2
            className="text-[clamp(32px,4.17vw,60px)] font-medium leading-[1] tracking-[-1.8px] text-[#333333]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('contactPage.location.title')}
          </h2>
          <div className="relative w-full h-[clamp(300px,34.72vw,500px)] rounded-[20px] overflow-hidden border border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.5346818847944!2d69.2401!3d41.3111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sAmir%20Temur%20Avenue%2C%20Tashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DJIDALI Office Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContactPage;
