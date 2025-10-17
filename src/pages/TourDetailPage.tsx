import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { djidaliApi } from '../services/djidaliApi';
import { Tour } from '../services/api';
import { getTourPrimaryImage } from '../utils/imageUtils';

const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  useEffect(() => {
    const loadTour = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const tourData = await djidaliApi.getTour(id);
        setTour(tourData as any);
      } catch (error) {
        console.error('Failed to load tour:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTour();
  }, [id]);

  if (loading || !tour) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8B7355]"></div>
      </div>
    );
  }

  const primaryImage = getTourPrimaryImage(tour);

  const itinerary = [];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="relative h-[350px] overflow-hidden">
        <img
          src={primaryImage}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-16 w-full pb-12">
            <h1 className="text-white text-[3rem] font-light leading-tight">
              {tour.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-none p-12 mb-8">
              <div className="flex items-center gap-12 mb-10">
                <div className="flex items-center gap-4">
                  
                  <div>
                    <div className="text-[2.5rem] font-light text-gray-900">
                      {Number(tour.price || 0).toLocaleString()} <span className="text-xl text-gray-500 font-light">UZS</span>
                    </div>
                    <div className="text-sm text-gray-500 font-light">Стоимость от тура</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  
                  <div>
                    <div className="text-[2.5rem] font-light text-gray-900">
                      {tour.duration} <span className="text-xl text-gray-500 font-light">дней</span>
                    </div>
                    <div className="text-sm text-gray-500 font-light">Длительность от тура</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-4 font-light tracking-wider uppercase">Место</div>
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="text-sm text-gray-500 mb-2 font-light">Минимальный возраст</div>
                    <div className="text-lg text-gray-900 font-normal">от 12 лет</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2 font-light">Тип тура</div>
                    <div className="text-lg text-gray-900 font-normal">{tour.category?.name || 'Экотуризм'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2 font-light">Сложность</div>
                    <div className="text-lg text-gray-900 font-normal">Легкое</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-none p-12 mb-8">
              <h2 className="text-[2rem] font-light text-gray-900 mb-8">О туре</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-6 font-light">
                Этот тур создан для тех, кто хочет почувствовать атмосферу настоящей дикой природы.
              </p>
              <p className="text-gray-700 text-base leading-relaxed mb-6 font-light">
                Вы посетите живописные горные долины, пройдете по тропам Чаткальского заповедника и познакомитесь с флорой и фауной региона. Проживание организовано в уютных эко-домиках, питание — национальная кухня.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-10">
                <div>
                  <h3 className="text-lg font-normal text-gray-900 mb-4">Что включено</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700 text-base font-light">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Проживание (2ве дневной)</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 text-base font-light">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Трехразовое питание</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 text-base font-light">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Услуги гида</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 text-base font-light">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Трансфер от Ташкента</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 text-base font-light">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Экскурсия по заповеднику</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-normal text-gray-900 mb-4">Что не входит в тур</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700 text-base font-light">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Личные расходы</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 text-base font-light">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Алкогольные напитки</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 text-base font-light">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Сувениры (одежда и прочее)</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 text-base font-light">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Медицинская страховка</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 text-base font-light">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Дополнительные экскурсии (за рамки)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-none p-12 mb-8">
              <h2 className="text-[2rem] font-light text-gray-900 mb-8">Моменты из тура</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-80 rounded-none overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg"
                    alt="Tour moment 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-rows-2 gap-3">
                  <div className="h-full rounded-none overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"
                      alt="Tour moment 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-full rounded-none overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg"
                      alt="Tour moment 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-none p-12">
              <h2 className="text-[2rem] font-light text-gray-900 mb-8">Программа тура</h2>
              <div className="space-y-2">
                {itinerary.map((item) => (
                  <div
                    key={item.day}
                    className="border border-gray-200 rounded-none overflow-hidden hover:border-gray-300 transition-colors"
                  >
                    <button
                      onClick={() => setActiveDay(activeDay === item.day ? null : item.day)}
                      className="w-full px-8 py-6 flex items-center justify-between text-left"
                    >
                      <span className="text-lg font-normal text-gray-900">{item.title}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          activeDay === item.day ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDay === item.day && (
                      <div className="px-8 pb-6 text-gray-600 text-base font-light border-t border-gray-100 pt-6">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <div className="bg-white rounded-none p-10 mb-6 border border-gray-200">
                <h3 className="text-xl font-light text-gray-900 mb-8">Забронировать тур</h3>

                <div className="space-y-5 mb-8">
                  <div>
                    <label className="block text-sm text-gray-500 mb-2 font-light">Введите ваше имя</label>
                    <input
                      type="text"
                      placeholder="Имя"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-[#8B7355] text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2 font-light">+998 00 000 00 00</label>
                    <input
                      type="tel"
                      placeholder="+998 00 000 00 00"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-[#8B7355] text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2 font-light">12-20 сен</label>
                    <input
                      type="text"
                      placeholder="12-20 сен"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-[#8B7355] text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2 font-light">2 взр. — 3 реб.</label>
                    <input
                      type="text"
                      placeholder="2 взр. — 3 реб."
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-[#8B7355] text-base"
                    />
                  </div>
                </div>

                <button className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white py-4 rounded-xl text-base font-light transition-colors">
                  Забронировать сейчас
                </button>

                <p className="text-xs text-gray-500 text-center mt-5 font-light">
                  План бронирует трансфер выбранная дата
                </p>
              </div>

              <div className="bg-white rounded-none p-10 border border-gray-200">
                <h3 className="text-xl font-light text-gray-900 mb-6">Локация</h3>
                <div className="w-full h-64 bg-gray-200 rounded-none overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648750455!2d-73.98784368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;
