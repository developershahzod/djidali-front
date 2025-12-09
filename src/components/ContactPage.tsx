import React from "react";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[200px] bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <h1 className="text-5xl font-bold text-gray-900">Связаться с нами</h1>
        </div>
        <div className="absolute top-4 right-8 text-right">
          <div className="text-sm text-gray-600 mb-1">Phone number</div>
          <div className="text-2xl font-bold text-gray-900">
            (+610) 818-1215
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-[#8B7355] rounded-3xl p-12 text-white">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-8">
              <svg
                className="w-8 h-8 text-[#8B7355]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-6">Свяжитесь с нами</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Мы всегда открыты к сотрудничеству и готовы помочь в планировании
              вашего путешествия
            </p>
          </div>

          <div
            className="rounded-3xl overflow-hidden shadow-xl bg-cover bg-center h-[400px]"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
            }}
          >
            <div className="bg-gradient-to-t from-black/60 to-transparent h-full flex flex-col justify-end p-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                Путешествие
                <br />
                по Дальверзину
              </h3>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Режим работы
            </h3>
            <div className="text-4xl font-bold text-gray-900">9:00 — 18:00</div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Email</h3>
            <div className="text-4xl font-bold text-gray-900">
              Support@balcom.com
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Локация</h2>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-[500px] flex items-center justify-center">
              <div className="text-center text-gray-600">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-lg font-medium">Карта локации</p>
                <p className="text-sm mt-2">Tashkent, Uzbekistan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
