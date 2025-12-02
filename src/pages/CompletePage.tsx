import { useNavigate, useLocation, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { format } from "date-fns";
import { ru, de, enUS } from "date-fns/locale";

// Icons
const CalendarIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z"
      fill="#CBC2AB"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
      fill="#CBC2AB"
    />
  </svg>
);

const PriceIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z"
      fill="#CBC2AB"
    />
  </svg>
);

interface BookingData {
  tourId: string;
  tourName: string;
  tourNameUz?: string;
  tourNameEn?: string;
  tourNameDe?: string;
  tourLocation: string;
  tourLocationUz?: string;
  tourLocationEn?: string;
  tourLocationDe?: string;
  tourCategory: string;
  tourCategoryUz?: string;
  tourCategoryEn?: string;
  tourCategoryDe?: string;
  tourImage: string;
  startDate: string;
  endDate: string;
  participants: number;
  pricePerPerson: number;
  nights: number;
  subtotal: number;
  discount: number;
  serviceFee: number;
  total: number;
}

interface ContactInfo {
  fullName: string;
  phone: string;
  email: string;
  emergencyName?: string;
  emergencyPhone?: string;
  specialRequests?: string;
}

interface LocationState {
  bookingData: BookingData;
  contactInfo: ContactInfo;
  paymentInfo?: {
    method: string;
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
  };
}

export default function CompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, translate } = useLanguage();

  // Get booking data from location state or use defaults
  const state = location.state as LocationState | null;

  const bookingData = state?.bookingData || {
    tourId: "1",
    tourName: "Дальвер Экспедиция в Чаткальский заповедник",
    tourNameUz: "Dalver Chatkal qo'riqxonasiga ekspeditsiya",
    tourNameEn: "Dalver Expedition to Chatkal Reserve",
    tourNameDe: "Dalver Expedition zum Chatkal-Reservat",
    tourLocation: "Ташкентская область, Бекабадский район, Дальверзин",
    tourLocationUz: "Toshkent viloyati, Bekobod tumani, Dalverzin",
    tourLocationEn: "Tashkent region, Bekabad district, Dalverzin",
    tourLocationDe: "Gebiet Taschkent, Bezirk Bekabad, Dalverzin",
    tourCategory: "Экотуризм",
    tourCategoryUz: "Ekoturizm",
    tourCategoryEn: "Ecotourism",
    tourCategoryDe: "Ökotourismus",
    tourImage: "/images/tour-complete.jpg",
    startDate: new Date("2025-09-15").toISOString(),
    endDate: new Date("2025-09-20").toISOString(),
    participants: 5,
    pricePerPerson: 350000,
    nights: 3,
    subtotal: 1050000,
    discount: 150000,
    serviceFee: 200000,
    total: 1100000,
  };

  // Get locale for date formatting
  const getLocale = () => {
    switch (language) {
      case "ru":
        return ru;
      case "de":
        return de;
      case "uz":
        return ru; // Using ru locale for uz as date-fns doesn't have uz
      default:
        return enUS;
    }
  };

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMM, yyyy", { locale: getLocale() });
  };

  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString("ru-RU").replace(/,/g, " ");
  };

  // Get translated tour name
  const getTourName = () => {
    switch (language) {
      case "uz":
        return bookingData.tourNameUz || bookingData.tourName;
      case "en":
        return bookingData.tourNameEn || bookingData.tourName;
      case "de":
        return bookingData.tourNameDe || bookingData.tourName;
      default:
        return bookingData.tourName;
    }
  };

  // Get translated location
  const getLocation = () => {
    switch (language) {
      case "uz":
        return bookingData.tourLocationUz || bookingData.tourLocation;
      case "en":
        return bookingData.tourLocationEn || bookingData.tourLocation;
      case "de":
        return bookingData.tourLocationDe || bookingData.tourLocation;
      default:
        return bookingData.tourLocation;
    }
  };

  // Get translated category
  const getCategory = () => {
    switch (language) {
      case "uz":
        return bookingData.tourCategoryUz || bookingData.tourCategory;
      case "en":
        return bookingData.tourCategoryEn || bookingData.tourCategory;
      case "de":
        return bookingData.tourCategoryDe || bookingData.tourCategory;
      default:
        return bookingData.tourCategory;
    }
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-[#f4f2ed] min-h-screen">
      {/* Header Navigation */}
      <div className="pt-[20px] px-[50px]">
        <div className="backdrop-blur-sm bg-[rgba(51,51,51,0.1)] rounded-[16px] px-[32px] py-[12px] max-w-[1680px] mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <img
              src="/logo.webp"
              alt="DJIDALI"
              className="h-[54px] w-[54px] cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
            <Link
              to="/about"
              className="text-[#333333] hover:bg-black/5 transition-all text-[14px] font-medium px-[16px] py-[12px] rounded-[100px] uppercase"
            >
              {translate({
                ru: "О нас",
                uz: "Biz haqimizda",
                en: "About",
                de: "Über uns",
              })}
            </Link>
            <Link
              to="/tourism-types"
              className="text-[#333333] hover:bg-black/5 transition-all text-[14px] font-medium px-[16px] py-[12px] rounded-[100px] uppercase"
            >
              {translate({
                ru: "Виды туризма",
                uz: "Turizm turlari",
                en: "Tourism Types",
                de: "Tourismusarten",
              })}
            </Link>
            <Link
              to="/tours"
              className="text-[#333333] hover:bg-black/5 transition-all text-[14px] font-medium px-[16px] py-[12px] rounded-[100px] uppercase"
            >
              {translate({
                ru: "Наши туры",
                uz: "Bizning turlarimiz",
                en: "Our Tours",
                de: "Unsere Touren",
              })}
            </Link>
            <Link
              to="/news"
              className="text-[#333333] hover:bg-black/5 transition-all text-[14px] font-medium px-[16px] py-[12px] rounded-[100px] uppercase"
            >
              {translate({
                ru: "Новости",
                uz: "Yangiliklar",
                en: "News",
                de: "Nachrichten",
              })}
            </Link>
            <Link
              to="/contact"
              className="text-[#333333] hover:bg-black/5 transition-all text-[14px] font-medium px-[16px] py-[12px] rounded-[100px] uppercase"
            >
              {translate({
                ru: "Контакты",
                uz: "Aloqa",
                en: "Contact",
                de: "Kontakt",
              })}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-[32px]">
            <div className="flex items-center gap-[4px] text-[#333333]">
              <span className="text-[14px] font-medium uppercase">
                {language.toUpperCase()}
              </span>
              <svg
                className="w-[20px] h-[20px]"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#333333"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Link
              to="/login"
              className="text-[#333333] border border-[#333333] hover:bg-black/5 rounded-[100px] px-[16px] py-[12px] transition-all text-[14px] font-semibold uppercase"
            >
              {translate({
                ru: "Забронировать",
                uz: "Bron qilish",
                en: "Book",
                de: "Buchen",
              })}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="mx-[50px] mt-[84px] mb-[50px]">
        <div className="bg-white rounded-[20px] p-[40px] max-w-[1340px] mx-auto flex gap-[110px]">
          {/* Left Content */}
          <div className="w-[575px] flex-shrink-0">
            {/* Success Message */}
            <div className="border-b-2 border-[#ebebeb] pb-[20px] mb-[40px]">
              <p className="text-[60px] leading-[60px] mb-[16px]">🎉</p>
              <p className="text-[24px] font-medium text-[#c0c0c0] leading-[30px] tracking-[-0.48px] mb-[16px]">
                {translate({
                  ru: "Спасибо!",
                  uz: "Rahmat!",
                  en: "Thank you!",
                  de: "Danke!",
                })}
              </p>
              <p className="text-[32px] font-semibold text-[#333333] leading-[40px] tracking-[-0.64px]">
                {translate({
                  ru: "Ваша заявка принята, и мы уже готовим для вас путешествие.",
                  uz: "Sizning arizangiz qabul qilindi va biz sizning sayohatingizni tayyorlamoqdamiz.",
                  en: "Your request has been accepted, and we are already preparing your trip.",
                  de: "Ihre Anfrage wurde angenommen, und wir bereiten bereits Ihre Reise vor.",
                })}
              </p>
            </div>

            {/* Tour Title */}
            <div className="mb-[24px]">
              <h2 className="text-[32px] font-medium text-[#333333] leading-[40px] tracking-[-0.64px] mb-[20px]">
                {getTourName()}
              </h2>
              <p className="text-[20px] font-normal text-[#333333] leading-[24px] tracking-[-0.4px]">
                {getLocation()}
              </p>
            </div>

            {/* Check-in Info Box */}
            <div className="bg-[rgba(235,235,235,0.4)] rounded-[16px] py-[8px] mb-[32px]">
              {/* Row 1: Dates */}
              <div className="flex items-center gap-[20px] px-0">
                {/* Start Date */}
                <div className="flex-1 flex gap-[12px] items-start p-[12px]">
                  <div className="p-[4px]">
                    <CalendarIcon />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <p className="text-[14px] font-medium text-[#767676] leading-[16px]">
                      {translate({
                        ru: "Дата начала",
                        uz: "Boshlanish sanasi",
                        en: "Start date",
                        de: "Startdatum",
                      })}
                    </p>
                    <p className="text-[20px] font-medium text-[#333333] tracking-[-0.4px]">
                      {formatDate(bookingData.startDate)}
                    </p>
                  </div>
                </div>
                <div className="w-px h-[40px] bg-[#dcd6c7]"></div>
                {/* End Date */}
                <div className="flex-1 flex gap-[12px] items-start p-[12px]">
                  <div className="p-[4px]">
                    <CalendarIcon />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <p className="text-[14px] font-medium text-[#767676] leading-[16px]">
                      {translate({
                        ru: "Дата окончания",
                        uz: "Tugash sanasi",
                        en: "End date",
                        de: "Enddatum",
                      })}
                    </p>
                    <p className="text-[20px] font-medium text-[#333333] tracking-[-0.4px]">
                      {formatDate(bookingData.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2: Participants & Price */}
              <div className="flex items-center gap-[20px] px-0">
                {/* Participants */}
                <div className="flex-1 flex gap-[12px] items-start p-[12px]">
                  <div className="p-[4px]">
                    <UserIcon />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <p className="text-[14px] font-medium text-[#767676] leading-[16px]">
                      {translate({
                        ru: "Участники",
                        uz: "Ishtirokchilar",
                        en: "Participants",
                        de: "Teilnehmer",
                      })}
                    </p>
                    <p className="text-[20px] font-medium text-[#333333] tracking-[-0.4px]">
                      {bookingData.participants}
                    </p>
                  </div>
                </div>
                <div className="w-px h-[40px] bg-[#dcd6c7]"></div>
                {/* Price per person */}
                <div className="flex-1 flex gap-[12px] items-start p-[12px]">
                  <div className="p-[4px]">
                    <PriceIcon />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <p className="text-[14px] font-medium text-[#767676] leading-[16px]">
                      {translate({
                        ru: "Цена на человека",
                        uz: "Bir kishi uchun narx",
                        en: "Price per person",
                        de: "Preis pro Person",
                      })}
                    </p>
                    <p className="text-[20px] font-medium text-[#333333] tracking-[-0.4px]">
                      {formatPrice(bookingData.pricePerPerson)} UZS
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-[16px]">
              <h3 className="text-[24px] font-medium text-[#333333] leading-[30px] tracking-[-0.48px] mb-[20px]">
                {translate({
                  ru: "Стоимость тура",
                  uz: "Tur narxi",
                  en: "Tour cost",
                  de: "Tourkosten",
                })}
              </h3>

              <div className="flex flex-col gap-[16px]">
                {/* Subtotal */}
                <div className="flex items-end justify-between font-medium">
                  <div className="flex gap-[4px] text-[16px] text-[#767676] tracking-[-0.32px] leading-[16px]">
                    <span>{formatPrice(bookingData.pricePerPerson)}</span>
                    <span>x</span>
                    <span>
                      {bookingData.nights}{" "}
                      {translate({
                        ru: bookingData.nights === 1 ? "ночь" : "ночи",
                        uz: "kecha",
                        en: bookingData.nights === 1 ? "night" : "nights",
                        de: bookingData.nights === 1 ? "Nacht" : "Nächte",
                      })}
                    </span>
                  </div>
                  <p className="text-[20px] text-[#333333] tracking-[-0.4px] text-right">
                    {formatPrice(bookingData.subtotal)} UZS
                  </p>
                </div>

                {/* Discount */}
                <div className="flex items-end justify-between font-medium">
                  <p className="text-[16px] text-[#767676] tracking-[-0.32px] leading-[16px]">
                    {translate({
                      ru: "Скидка 10% по акции",
                      uz: "Aksiya bo'yicha 10% chegirma",
                      en: "10% promotional discount",
                      de: "10% Aktionsrabatt",
                    })}
                  </p>
                  <p className="text-[20px] text-[#333333] tracking-[-0.4px] text-right">
                    {formatPrice(bookingData.discount)} UZS
                  </p>
                </div>

                {/* Service Fee */}
                <div className="flex items-end justify-between font-medium">
                  <p className="text-[16px] text-[#767676] tracking-[-0.32px] leading-[16px]">
                    {translate({
                      ru: "Плата за обслуживание",
                      uz: "Xizmat to'lovi",
                      en: "Service fee",
                      de: "Servicegebühr",
                    })}
                  </p>
                  <p className="text-[20px] text-[#333333] tracking-[-0.4px] text-right">
                    {formatPrice(bookingData.serviceFee)} UZS
                  </p>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-end justify-between font-medium mb-[40px]">
              <p className="text-[20px] text-[#767676] tracking-[-0.4px]">
                {translate({
                  ru: "Итого",
                  uz: "Jami",
                  en: "Total",
                  de: "Gesamt",
                })}
              </p>
              <p className="text-[28px] text-[#827042] tracking-[-0.56px] leading-[38px] text-right">
                {formatPrice(bookingData.total)} UZS
              </p>
            </div>

            {/* Return Button */}
            <button
              onClick={handleReturnHome}
              className="w-full h-[80px] bg-[#8f7b49] hover:bg-[#7a6839] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="text-[20px] font-bold text-white tracking-[-0.4px] leading-[20px]">
                {translate({
                  ru: "Вернутся на главное меню",
                  uz: "Bosh menyuga qaytish",
                  en: "Return to main menu",
                  de: "Zurück zum Hauptmenü",
                })}
              </span>
            </button>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative">
            <div className="h-full min-h-[974px] rounded-[20px] relative overflow-hidden">
              <img
                src={bookingData.tourImage}
                alt={getTourName()}
                className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
              />
              <div className="absolute inset-0 bg-black/20 rounded-[20px]" />

              {/* Category Badge */}
              <div className="absolute bottom-[60px] right-[60px] bg-white rounded-[16px] px-[6px] py-[2px]">
                <span className="text-[16px] font-medium text-[#333333] tracking-[-0.32px] leading-[16px]">
                  {getCategory()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
