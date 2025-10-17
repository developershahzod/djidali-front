import React from 'react';

const NewAboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <section className="relative h-[420px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"
          alt="Nature"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-center">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-16 w-full">
            <h1 className="text-[3.5rem] leading-[1.15] font-light text-white mb-0">
              Мы — там, где природа<br />говорит первой
            </h1>
            <p className="text-white/90 text-lg font-light mt-6 max-w-2xl">
              DJIDALI объединяет природу, комфорт и опыт;<br />создаем путешествия, которые запоминаются
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-8 lg:px-16 py-20">
        <div className="bg-white rounded-none p-16 mb-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[2.5rem] font-light text-gray-900 leading-tight">
              Команда<br />специалистов
            </h2>
            <div className="grid grid-cols-3 gap-16 text-center">
              <div>
                <div className="text-[3.5rem] font-light text-gray-900 mb-2">180<span className="text-xl text-gray-500"> тыс</span></div>
                <p className="text-sm text-gray-600 font-light">Счастливых путешественников</p>
              </div>
              <div>
                <div className="text-[3.5rem] font-light text-gray-900 mb-2">64+</div>
                <p className="text-sm text-gray-600 font-light">Туристических парков</p>
              </div>
              <div>
                <div className="text-[3.5rem] font-light text-gray-900 mb-2">10+</div>
                <p className="text-sm text-gray-600 font-light">Лет опыта</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-20">
          <div className="grid lg:grid-cols-4 gap-0">
            <div className="bg-[#A89563] rounded-none p-12 flex flex-col justify-between">
              <div>
                <h3 className="text-[2rem] font-light text-white mb-6 leading-tight">
                  Уникальные<br />маршруты
                </h3>
              </div>
            </div>
            <div className="bg-[#8B7355] rounded-none p-12 flex flex-col justify-between">
              <div>
                <h3 className="text-[2rem] font-light text-white mb-6 leading-tight">
                  Знакомство с первозданной природой
                </h3>
              </div>
            </div>
            <div className="bg-[#9B8A6D] rounded-none p-12 flex flex-col justify-between">
              <div>
                <h3 className="text-[2rem] font-light text-white mb-6 leading-tight">
                  Комфортное<br />проживание
                </h3>
              </div>
            </div>
            <div className="bg-[#7A6349] rounded-none p-12 flex flex-col justify-between">
              <div>
                <h3 className="text-[2rem] font-light text-white mb-6 leading-tight">
                  Команда<br />специалистов
                </h3>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-[2.5rem] font-light text-gray-900 mb-10">Откройте для себя уникальные маршруты</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-16 font-light max-w-4xl">
            Наши маршруты созданы для тех, кто ищет соединение с природой без лишней суеты. Каждый тур — это тщательно продуманное путешествие, где комфорт и экологичный подход сочетаются с возможностью увидеть мир глазами тех, кто его действительно чувствует.<br /><br />
            Вы сможете пройти по тропам, по которым ходят местные егеря, и увидеть мир глазами тех, кто его действительно чувствует.
          </p>

          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <div className="relative h-[380px] rounded-none overflow-hidden">
              <img
                src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"
                alt="Forest"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="relative h-full rounded-none overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg"
                  alt="Lake"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-full rounded-none overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg"
                  alt="Field"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-16 font-light max-w-4xl">
            Мы обеспечиваем безопасность сопровождение и максимальный комфорт на каждом этапе.<br /><br />
            Маршруты DJIDALI подходят как для индивидуальных прогулок, так и для групповых туров. Вы можете выбрать легкие маршруты для спокойного отдыха или более насыщенные программы с элементами приключений.
          </p>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="relative h-[340px] rounded-none overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg"
                alt="Landscape"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative h-[340px] rounded-none overflow-hidden">
              <img
                src="https://images.pexels.com/photos/462024/pexels-photo-462024.jpeg"
                alt="Mountains"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="bg-[#8B7355] rounded-none p-20 text-white">
            <h2 className="text-[3rem] font-light mb-6 leading-tight">
              DJIDALI — это не просто маршруты, а встречи с живой природой
            </h2>
            <p className="text-white/90 text-lg leading-relaxed font-light max-w-3xl">
              Каждое путешествие — возможность почувствовать ритм Узбекистана, вдохнуть свежий воздух и оставить в сердце ощущение свободы
            </p>
          </div>
        </section>
      </section>
    </div>
  );
};

export default NewAboutPage;
