import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewContactPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="relative bg-[#E8E3DA] pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="flex items-start justify-between">
            <h1 className="text-[56px] leading-none font-normal text-gray-900">Связаться с нами</h1>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Phone number</div>
              <div className="text-[28px] font-normal text-gray-900">(+610) 818-1215</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-20">
        <div className="grid lg:grid-cols-2 gap-0 mb-20">
          <div className="bg-[#8B7355] rounded-none p-16 text-white flex flex-col justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-10">
              <svg className="w-8 h-8 text-[#8B7355]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h2 className="text-[2.5rem] leading-[1.2] font-light mb-6">Свяжитесь с нами</h2>
            <p className="text-white/90 text-base leading-[1.7] font-light">
              Мы всегда открыты к сотрудничеству и готовы помочь в планировании вашего путешествия
            </p>
          </div>

          <div className="relative h-[500px]">
            <img
              src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"
              alt="Путешествие по Дальверзину"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-[2rem] leading-[1.2] font-light text-white">
                Путешествие<br />по Дальверзину
              </h3>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-20 mb-20">
          <div>
            <h3 className="text-base font-light text-gray-600 mb-3 tracking-wide">Режимы работы</h3>
            <div className="text-[3rem] leading-none font-light text-gray-900">9:00 — 18:00</div>
          </div>

          <div>
            <h3 className="text-base font-light text-gray-600 mb-3 tracking-wide">Email</h3>
            <div className="text-[3rem] leading-none font-light text-gray-900">Support@balcom.com</div>
          </div>
        </div>

        <div>
          <h2 className="text-[2.5rem] font-light text-gray-900 mb-10">Локация</h2>
          <div className="bg-white rounded-none overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648750455!2d-73.98784368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContactPage;
