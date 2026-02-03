import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Keyboard,
  Zoom,
  EffectFade,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import "swiper/css/effect-fade";

interface TourGallerySliderProps {
  images: string[];
  tourTitle: string;
}

const TourGallerySlider: React.FC<TourGallerySliderProps> = ({
  images,
  tourTitle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  if (!images.length) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      {/* Main Gallery Slider */}
      <div className="relative group">
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          keyboard={{ enabled: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper: SwiperType) =>
            setActiveIndex(swiper.activeIndex)
          }
          className="rounded-[20px] overflow-hidden"
          style={{
            // @ts-ignore - CSS custom properties
            "--swiper-pagination-color": "#8f7b49",
            "--swiper-pagination-bullet-inactive-color": "#ffffff",
            "--swiper-pagination-bullet-inactive-opacity": "0.5",
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative w-full h-[clamp(300px,50vw,700px)] cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image}
                  alt={`${tourTitle} - ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-12 h-12 text-white drop-shadow-lg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6 text-[#333]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6 text-[#333]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip (for 4+ images) */}
      {images.length >= 4 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#8f7b49] scrollbar-track-gray-200">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                swiperRef.current?.slideTo(index);
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === index
                  ? "border-[#8f7b49] scale-105"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Lightbox Swiper */}
          <div
            className="w-full max-w-7xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Swiper
              modules={[Navigation, Pagination, Keyboard, Zoom, EffectFade]}
              initialSlide={lightboxIndex}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              zoom={{ maxRatio: 3 }}
              effect="fade"
              className="lightbox-swiper"
              style={{
                // @ts-ignore
                "--swiper-navigation-color": "#ffffff",
                "--swiper-pagination-color": "#8f7b49",
              }}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="swiper-zoom-container flex items-center justify-center h-[80vh]">
                    <img
                      src={image}
                      alt={`${tourTitle} - ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Image counter in lightbox */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default TourGallerySlider;
