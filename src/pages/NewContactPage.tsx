import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const NewContactPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1F1A12]">
      <div className="max-w-[1250px] mx-auto px-6 lg:px-12 xl:px-0 pt-36 pb-20 space-y-16">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="space-y-4">
            <span className="text-sm tracking-[0.35em] uppercase text-[#A38D66]">{t('contact.title')}</span>
            <h1 className="text-[3.75rem] leading-[1.1] font-light text-[#1E180F]">{t('contact.contactHeadline')}</h1>
          </div>

          <div className="text-right space-y-3">
            <span className="text-xs uppercase tracking-[0.35ем] text-[#B1A288]">{t('contact.phoneLabel')}</span>
            <p className="text-[2rem] font-medium text-[#1E180F]">(+998) 71 200-00-00</p>
          </div>
        </header>

        <section className="grid overflow-hidden rounded-[36px] shadow-[0_40px_90px_-60px_rgba(34,27,18,0.5)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col">
            <div className="bg-[#B69C64] text-white px-10 md:px-14 py-16 md:py-20 flex flex-col gap-10">
              <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v12H5.5L4 17.5V4z" />
                  <path d="M6 8l6 4 6-4" />
                </svg>
              </div>
              <div className="space-y-6">
                <h2 className="text-[2.75rem] leading-[1.15] font-light">{t('contact.connectTitle')}</h2>
                <p className="text-white/85 text-lg leading-[1.7] max-w-md">
                  {t('contact.connectDescription')}
                </p>
              </div>
            </div>

            <div className="bg-[#F1EBE1] px-10 md:px-14 py-14 md:py-16 space-y-12">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.35em] text-[#A38D66]">{t('contact.workingHours')}</span>
                <p className="text-[2.5rem] leading-none font-light text-[#1F1A12]">{t('contact.workingHoursValue')}</p>
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.35em] text-[#A38D66]">Email</span>
                <p className="text-[2.5rem] leading-none font-light text-[#1F1A12]">hello@djidali.uz</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[520px]">
            <img
              src="/photo_5445168424612397991_w.webp"
              alt={t('contact.mapImageAlt')}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-black/10 to-transparent" />
            <div className="absolute top-14 left-10 md:left-14 text-white">
              <h3 className="text-[2.5rem] leading-tight font-light max-w-xs">
                {t('contact.heroHighlightLine1')} <br />
                <span className="text-[#D8CCB3]">{t('contact.heroHighlightLine2')}</span>
              </h3>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-[2.75rem] font-light text-[#1E180F]">{t('contact.ourLocation')}</h2>
          <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_-70px_rgba(34,27,18,0.45)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648750455!2d-73.98784368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="520"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewContactPage;
