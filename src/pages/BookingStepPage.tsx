import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { getImageUrl, getTourPrimaryImage } from "../utils/imageUtils";
import { format } from "date-fns";
import { ru, uz, de, enUS } from "date-fns/locale";

// Icons as SVG components
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="4"
      width="20"
      height="18"
      rx="2"
      stroke="#CBC2AB"
      strokeWidth="2"
      fill="none"
    />
    <path d="M2 10H22" stroke="#CBC2AB" strokeWidth="2" />
    <path d="M7 2V6" stroke="#CBC2AB" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 2V6" stroke="#CBC2AB" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4" stroke="#CBC2AB" strokeWidth="2" fill="none" />
    <path
      d="M4 23C4 18.5817 7.58172 15 12 15C16.4183 15 20 18.5817 20 23"
      stroke="#CBC2AB"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const AirplaneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
      fill="#CBC2AB"
    />
  </svg>
);

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="4"
      stroke="#333333"
      strokeWidth="2"
      fill={checked ? "#333333" : "none"}
    />
    {checked && (
      <path
        d="M7 12L10.5 15.5L17 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

interface BookingData {
  tourId: string;
  tourTitle: string;
  tourLocation: string;
  tourType: string;
  tourImage: string;
  startDate: Date;
  endDate: Date;
  participants: { adults: number; children: number };
  pricePerPerson: number;
  duration: number;
}

const BookingStepPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  // Form state - Step 1
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form state - Step 2 (Payment)
  const [paymentMethod, setPaymentMethod] = useState<"uzcard" | "click">(
    "uzcard",
  );
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Get booking data from location state or use defaults
  const bookingData: BookingData = location.state?.bookingData || {
    tourId: "1",
    tourTitle: "Дальвер Экспедиция в Чаткальский заповедникзин",
    tourLocation: "Ташкентская область, Бекабадский район, Дальверзин",
    tourType: "Экотуризм",
    tourImage: "/tour-placeholder.jpg",
    startDate: new Date("2025-09-15"),
    endDate: new Date("2025-09-20"),
    participants: { adults: 2, children: 1 },
    pricePerPerson: 350000,
    duration: 3,
  };

  // Calculate prices
  const totalParticipants =
    bookingData.participants.adults + bookingData.participants.children;
  const subtotal = bookingData.pricePerPerson * bookingData.duration;
  const discount = Math.round(subtotal * 0.1); // 10% discount
  const serviceFee = 200000;
  const totalPrice = subtotal - discount + serviceFee;

  // Get locale for date formatting
  const getLocale = () => {
    switch (language) {
      case "ru":
        return ru;
      case "uz":
        return uz;
      case "de":
        return de;
      default:
        return enUS;
    }
  };

  // Format date with locale
  const formatDate = (date: Date) => {
    return format(date, "d MMM, yyyy", { locale: getLocale() });
  };

  // Format date range
  const formatDateRange = () => {
    const start = format(bookingData.startDate, "d", { locale: getLocale() });
    const end = format(bookingData.endDate, "d MMM", { locale: getLocale() });
    return `${start}–${end}`;
  };

  // Format participants text
  const formatParticipants = () => {
    const { adults, children } = bookingData.participants;
    const adultsText = translate({
      ru: `${adults} взр.`,
      uz: `${adults} katta`,
      en: `${adults} adults`,
      de: `${adults} Erw.`,
    });
    if (children > 0) {
      const childrenText = translate({
        ru: `${children} реб.`,
        uz: `${children} bola`,
        en: `${children} child`,
        de: `${children} Kind`,
      });
      return `${adultsText} — ${childrenText}`;
    }
    return adultsText;
  };

  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString("ru-RU") + " UZS";
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  const handleCancel = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigate(-1);
    }
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      // Validate Step 1
      if (!agreeToPolicy) {
        alert(
          translate({
            ru: "Пожалуйста, примите Политику Конфиденциальности",
            uz: "Iltimos, Maxfiylik siyosatini qabul qiling",
            en: "Please accept the Privacy Policy",
            de: "Bitte akzeptieren Sie die Datenschutzrichtlinie",
          }),
        );
        return;
      }
      // Move to Step 2
      setCurrentStep(2);
    } else {
      // Process payment and navigate to complete page
      navigate("/complete", {
        state: {
          bookingData,
          contactInfo: {
            fullName,
            phone,
            email,
            emergencyName,
            emergencyPhone,
            specialRequests,
          },
          paymentInfo: {
            paymentMethod,
            cardholderName,
            cardNumber,
            expiryDate,
          },
        },
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F4F2ED]"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Main Content */}
      <div className="pt-[178px] px-[50px] pb-[100px]">
        {/* Page Title */}
        <h1 className="text-[90px] font-medium text-[#333333] leading-[100px] tracking-[-2.7px] mb-[60px]">
          {translate({
            ru: "Забронируйте тур",
            uz: "Turni bron qiling",
            en: "Book Your Tour",
            de: "Buchen Sie Ihre Tour",
          })}
        </h1>

        {/* Step Indicator */}
        <div className="flex gap-[40px] items-center mb-[62px]">
          {/* Step 1 - Active when step 1, Brown (completed) when step 2 */}
          <div
            className={`flex gap-[12px] items-center pb-[24px] w-[320px] border-b-2 ${
              currentStep === 1 ? "border-[#333333]" : "border-[#8F7B49]"
            }`}
          >
            <div
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center ${
                currentStep === 1 ? "bg-[#333333]" : "bg-[#8F7B49]"
              }`}
            >
              <span className="text-[24px] font-medium text-white leading-[30px] tracking-[-0.48px]">
                1
              </span>
            </div>
            <span
              className={`text-[24px] font-medium leading-[32px] tracking-[-0.72px] ${
                currentStep === 1 ? "text-[#333333]" : "text-[#8F7B49]"
              }`}
            >
              {translate({
                ru: "Выбор даты",
                uz: "Sana tanlash",
                en: "Select Date",
                de: "Datum wählen",
              })}
            </span>
          </div>

          {/* Step 2 - Grey when step 1, Active (dark) when step 2 */}
          <div
            className={`flex gap-[12px] items-center pb-[24px] w-[320px] border-b-2 ${
              currentStep === 2 ? "border-[#333333]" : "border-[#A1A1A1]"
            }`}
          >
            <div
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center ${
                currentStep === 2 ? "bg-[#333333]" : "bg-[#A1A1A1]"
              }`}
            >
              <span className="text-[24px] font-medium text-white leading-[30px] tracking-[-0.48px]">
                2
              </span>
            </div>
            <span
              className={`text-[24px] font-medium leading-[32px] tracking-[-0.72px] ${
                currentStep === 2 ? "text-[#333333]" : "text-[#A1A1A1]"
              }`}
            >
              {translate({
                ru: "Оплата",
                uz: "To'lov",
                en: "Payment",
                de: "Zahlung",
              })}
            </span>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex gap-[30px] max-w-[1340px]">
          {/* Left Column - Form */}
          <div className="w-[655px] bg-white rounded-[20px] p-[20px]">
            {currentStep === 1 ? (
              <>
                {/* STEP 1: Contact Information Form */}
                {/* Price Info Header */}
                <h2 className="text-[32px] font-medium text-[#333333] leading-[40px] tracking-[-0.64px] mb-[40px] px-[20px] pt-[20px]">
                  {translate({
                    ru: "Информация о цене",
                    uz: "Narx haqida ma'lumot",
                    en: "Price Information",
                    de: "Preisinformation",
                  })}
                </h2>

                {/* Date and Participants Row */}
                <div className="flex gap-[15px] px-[0px] mb-[30px]">
                  {/* Date Container */}
                  <div className="flex-1 h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] py-[18px] flex flex-col justify-center">
                    <span className="text-[14px] font-medium text-[#333333] opacity-50 leading-[20px] tracking-[-0.28px]">
                      {translate({
                        ru: "Дата тура",
                        uz: "Tur sanasi",
                        en: "Tour Date",
                        de: "Tourdatum",
                      })}
                    </span>
                    <span className="text-[22px] font-semibold text-[#333333] leading-[24px] tracking-[-0.44px]">
                      {formatDateRange()}
                    </span>
                  </div>

                  {/* Participants Container */}
                  <div className="flex-1 h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] py-[18px] flex flex-col justify-center">
                    <span className="text-[14px] font-medium text-[#333333] opacity-50 leading-[20px] tracking-[-0.28px]">
                      {translate({
                        ru: "Количество участников",
                        uz: "Ishtirokchilar soni",
                        en: "Number of Participants",
                        de: "Anzahl der Teilnehmer",
                      })}
                    </span>
                    <span className="text-[22px] font-semibold text-[#333333] leading-[24px] tracking-[-0.44px]">
                      {formatParticipants()}
                    </span>
                  </div>
                </div>

                {/* Contact Information Section */}
                <h3 className="text-[24px] font-medium text-[#333333] leading-[30px] tracking-[-0.48px] mb-[20px] px-[0px]">
                  {translate({
                    ru: "Контакная информация",
                    uz: "Aloqa ma'lumotlari",
                    en: "Contact Information",
                    de: "Kontaktinformationen",
                  })}
                </h3>

                {/* Full Name Input */}
                <div className="mb-[15px]">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={translate({
                      ru: "Имя и фамилия",
                      uz: "Ism va familiya",
                      en: "Full Name",
                      de: "Vollständiger Name",
                    })}
                    className="w-full h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[22px] font-semibold text-[#333333] placeholder:opacity-50 leading-[24px] tracking-[-0.44px] outline-none focus:border-[#8F7B49] transition-colors"
                  />
                </div>

                {/* Phone Input */}
                <div className="mb-[15px]">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={translate({
                      ru: "Номер телефона",
                      uz: "Telefon raqami",
                      en: "Phone Number",
                      de: "Telefonnummer",
                    })}
                    className="w-full h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[22px] font-semibold text-[#333333] placeholder:opacity-50 leading-[24px] tracking-[-0.44px] outline-none focus:border-[#8F7B49] transition-colors"
                  />
                </div>

                {/* Email Input */}
                <div className="mb-[30px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={translate({
                      ru: "Электронная почта",
                      uz: "Elektron pochta",
                      en: "Email Address",
                      de: "E-Mail-Adresse",
                    })}
                    className="w-full h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[22px] font-semibold text-[#333333] placeholder:opacity-50 leading-[24px] tracking-[-0.44px] outline-none focus:border-[#8F7B49] transition-colors"
                  />
                </div>

                {/* Additional Information Section */}
                <h3 className="text-[24px] font-medium text-[#333333] leading-[30px] tracking-[-0.48px] mb-[20px] px-[0px]">
                  {translate({
                    ru: "Дополнительная информация",
                    uz: "Qo'shimcha ma'lumot",
                    en: "Additional Information",
                    de: "Zusätzliche Informationen",
                  })}
                </h3>

                {/* Emergency Contact Name */}
                <div className="mb-[15px]">
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder={translate({
                      ru: "Контакт для экстренных случаев (Имя)",
                      uz: "Favqulodda aloqa (Ism)",
                      en: "Emergency Contact (Name)",
                      de: "Notfallkontakt (Name)",
                    })}
                    className="w-full h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[22px] font-semibold text-[#333333] placeholder:opacity-50 leading-[24px] tracking-[-0.44px] outline-none focus:border-[#8F7B49] transition-colors"
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div className="mb-[15px]">
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder={translate({
                      ru: "Контактный номер для экстренных случаев",
                      uz: "Favqulodda aloqa raqami",
                      en: "Emergency Contact Number",
                      de: "Notfallkontaktnummer",
                    })}
                    className="w-full h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[22px] font-semibold text-[#333333] placeholder:opacity-50 leading-[24px] tracking-[-0.44px] outline-none focus:border-[#8F7B49] transition-colors"
                  />
                </div>

                {/* Special Requests Textarea */}
                <div className="mb-[30px]">
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder={translate({
                      ru: "Специальные пожелания (например, аллергия, особые условия)",
                      uz: "Maxsus istaklar (masalan, allergiya, maxsus shartlar)",
                      en: "Special Requests (e.g., allergies, special conditions)",
                      de: "Besondere Wünsche (z.B. Allergien, besondere Bedingungen)",
                    })}
                    className="w-full h-[200px] border-2 border-[#333333] rounded-[10px] px-[20px] py-[28px] text-[22px] font-semibold text-[#333333] placeholder:opacity-50 leading-[24px] tracking-[-0.44px] outline-none focus:border-[#8F7B49] transition-colors resize-none"
                  />
                </div>

                {/* Privacy Policy Checkbox */}
                <div className="flex gap-[12px] items-center mb-[30px]">
                  <button
                    type="button"
                    onClick={() => setAgreeToPolicy(!agreeToPolicy)}
                    className="focus:outline-none"
                  >
                    <CheckboxIcon checked={agreeToPolicy} />
                  </button>
                  <span className="text-[20px] font-medium text-[#333333] tracking-[-0.4px]">
                    {translate({
                      ru: "Я соглашаюсь с ",
                      uz: "Men roziman ",
                      en: "I agree to the ",
                      de: "Ich stimme der ",
                    })}
                    <Link to="/privacy-policy" className="underline">
                      {translate({
                        ru: "Политикой Конфиденциальности",
                        uz: "Maxfiylik siyosati",
                        en: "Privacy Policy",
                        de: "Datenschutzrichtlinie",
                      })}
                    </Link>
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* STEP 2: Payment Form */}
                {/* Payment Type Header */}
                <h2 className="text-[32px] font-medium text-[#333333] leading-[40px] tracking-[-0.64px] mb-[40px] px-[0px] pt-[20px]">
                  {translate({
                    ru: "Тип оплаты",
                    uz: "To'lov turi",
                    en: "Payment Type",
                    de: "Zahlungsart",
                  })}
                </h2>

                {/* UZCARD/HUMO Option (Selected) */}
                <button
                  onClick={() => setPaymentMethod("uzcard")}
                  className={`w-full h-[80px] border-2 rounded-[10px] px-[20px] py-[18px] flex items-center gap-[10px] mb-[15px] transition-colors ${
                    paymentMethod === "uzcard"
                      ? "border-[#8F7B49]"
                      : "border-[#333333]"
                  }`}
                >
                  {/* Humo/Uzcard Logos */}
                  <div className="flex items-center gap-[2px]">
                    <img
                      src="/humo-logo.png"
                      alt="Humo"
                      className="h-[46px] w-[44px] object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <img
                      src="/uzcard-logo.png"
                      alt="Uzcard"
                      className="h-[46px] w-[46px] object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <span
                    className={`text-[22px] font-semibold leading-[24px] tracking-[-0.44px] ${
                      paymentMethod === "uzcard"
                        ? "text-[#8F7B49]"
                        : "text-[#333333]"
                    }`}
                  >
                    UZCARD, HUMO
                  </span>
                </button>

                {/* Cardholder Name */}
                <div className="mb-[15px]">
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder={translate({
                      ru: "Имя владельца",
                      uz: "Karta egasining ismi",
                      en: "Cardholder Name",
                      de: "Karteninhaber",
                    })}
                    className="w-full h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[22px] font-semibold text-[#333333] placeholder:opacity-50 leading-[24px] tracking-[-0.44px] outline-none focus:border-[#8F7B49] transition-colors"
                  />
                </div>

                {/* Card Number */}
                <div className="mb-[15px]">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder={translate({
                      ru: "Номер карты",
                      uz: "Karta raqami",
                      en: "Card Number",
                      de: "Kartennummer",
                    })}
                    className="w-full h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[22px] font-semibold text-[#333333] placeholder:opacity-50 leading-[24px] tracking-[-0.44px] outline-none focus:border-[#8F7B49] transition-colors"
                  />
                </div>

                {/* Expiry Date */}
                <div className="mb-[15px]">
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder={translate({
                      ru: "Срок действия",
                      uz: "Amal qilish muddati",
                      en: "Expiry Date",
                      de: "Ablaufdatum",
                    })}
                    className="w-[300px] h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[22px] font-semibold text-[#333333] placeholder:opacity-50 leading-[24px] tracking-[-0.44px] outline-none focus:border-[#8F7B49] transition-colors"
                  />
                </div>

                {/* Click Option */}
                <button
                  onClick={() => setPaymentMethod("click")}
                  className={`w-full h-[80px] border-2 rounded-[10px] px-[20px] py-[18px] flex items-center gap-[10px] mb-[200px] transition-colors ${
                    paymentMethod === "click"
                      ? "border-[#8F7B49]"
                      : "border-[#333333]"
                  }`}
                >
                  {/* Click Logo */}
                  <div className="w-[46px] h-[46px] bg-white rounded flex items-center justify-center">
                    <img
                      src="/click-logo.png"
                      alt="Click"
                      className="h-[46px] w-[46px] object-contain"
                      onError={(e) => {
                        e.currentTarget.parentElement!.innerHTML =
                          '<span class="text-[24px] font-bold text-[#00A3E0]">Click</span>';
                      }}
                    />
                  </div>
                  <span
                    className={`text-[22px] font-semibold leading-[24px] tracking-[-0.44px] ${
                      paymentMethod === "click"
                        ? "text-[#8F7B49]"
                        : "text-[#333333]"
                    }`}
                  >
                    Click
                  </span>
                </button>
              </>
            )}

            {/* Action Buttons - Same for both steps */}
            <div className="flex gap-[15px]">
              {/* Cancel Button */}
              <button
                onClick={handleCancel}
                className="flex-1 h-[80px] bg-[#333333] opacity-80 text-white rounded-[10px] text-[20px] font-bold leading-[20px] tracking-[-0.4px] hover:opacity-100 transition-opacity"
              >
                {translate({
                  ru: "Отменить",
                  uz: "Bekor qilish",
                  en: "Cancel",
                  de: "Abbrechen",
                })}
              </button>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="flex-1 h-[80px] bg-[#8F7B49] text-white rounded-[10px] text-[20px] font-bold leading-[20px] tracking-[-0.4px] hover:bg-[#7A6640] transition-colors"
              >
                {translate({
                  ru: "Продолжить",
                  uz: "Davom etish",
                  en: "Continue",
                  de: "Fortfahren",
                })}
              </button>
            </div>
          </div>

          {/* Right Column - Tour Card */}
          <div className="w-[655px] bg-white rounded-[20px] p-[20px]">
            {/* Tour Image */}
            <div className="relative h-[255px] rounded-[20px] overflow-hidden mb-[20px]">
              <img
                src={bookingData.tourImage}
                alt={bookingData.tourTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 rounded-[20px]" />
              {/* Tour Type Badge */}
              <div className="absolute bottom-[12px] right-[12px] bg-white rounded-[16px] px-[6px] py-[2px]">
                <span className="text-[16px] font-medium text-[#333333] leading-[16px] tracking-[-0.32px]">
                  {bookingData.tourType}
                </span>
              </div>
            </div>

            {/* Tour Title and Location */}
            <div className="px-[20px] mb-[24px]">
              <h3 className="text-[32px] font-medium text-[#333333] leading-[40px] tracking-[-0.64px] mb-[20px]">
                {bookingData.tourTitle}
              </h3>
              <p className="text-[20px] font-normal text-[#333333] leading-[24px] tracking-[-0.4px]">
                {bookingData.tourLocation}
              </p>
            </div>

            {/* Check-in Info Card */}
            <div className="bg-[rgba(235,235,235,0.4)] rounded-[16px] py-[8px] px-[0px] mb-[24px]">
              {/* First Row - Dates */}
              <div className="flex items-center gap-[20px] px-[12px]">
                {/* Start Date */}
                <div className="flex-1 flex gap-[12px] items-start p-[12px]">
                  <div className="p-[4px]">
                    <CalendarIcon />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[14px] font-medium text-[#767676] leading-[16px]">
                      {translate({
                        ru: "Дата начала",
                        uz: "Boshlanish sanasi",
                        en: "Start Date",
                        de: "Startdatum",
                      })}
                    </span>
                    <span className="text-[20px] font-medium text-[#333333] leading-normal tracking-[-0.4px]">
                      {formatDate(bookingData.startDate)}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-[40px] bg-[#DCD6C7]" />

                {/* End Date */}
                <div className="flex-1 flex gap-[12px] items-start p-[12px]">
                  <div className="p-[4px]">
                    <CalendarIcon />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[14px] font-medium text-[#767676] leading-[16px]">
                      {translate({
                        ru: "Дата окончания",
                        uz: "Tugash sanasi",
                        en: "End Date",
                        de: "Enddatum",
                      })}
                    </span>
                    <span className="text-[20px] font-medium text-[#333333] leading-normal tracking-[-0.4px]">
                      {formatDate(bookingData.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Second Row - Guests and Price */}
              <div className="flex items-center gap-[20px] px-[12px]">
                {/* Participants */}
                <div className="flex-1 flex gap-[12px] items-start p-[12px]">
                  <div className="p-[4px]">
                    <UserIcon />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[14px] font-medium text-[#767676] leading-[16px]">
                      {translate({
                        ru: "Участники",
                        uz: "Ishtirokchilar",
                        en: "Participants",
                        de: "Teilnehmer",
                      })}
                    </span>
                    <span className="text-[20px] font-medium text-[#333333] leading-normal tracking-[-0.4px]">
                      {totalParticipants}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-[40px] bg-[#DCD6C7]" />

                {/* Price Per Person */}
                <div className="flex-1 flex gap-[12px] items-start p-[12px]">
                  <div className="p-[4px]">
                    <AirplaneIcon />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[14px] font-medium text-[#767676] leading-[16px]">
                      {translate({
                        ru: "Цена на человека",
                        uz: "Bir kishi uchun narx",
                        en: "Price per person",
                        de: "Preis pro Person",
                      })}
                    </span>
                    <span className="text-[20px] font-medium text-[#333333] leading-normal tracking-[-0.4px]">
                      {formatPrice(bookingData.pricePerPerson)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Section */}
            <div className="px-[20px]">
              <h4 className="text-[24px] font-medium text-[#333333] leading-[30px] tracking-[-0.48px] mb-[20px]">
                {translate({
                  ru: "Стоимость тура",
                  uz: "Tur narxi",
                  en: "Tour Cost",
                  de: "Tourkosten",
                })}
              </h4>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-[16px] mb-[24px]">
                {/* Subtotal */}
                <div className="flex justify-between items-end">
                  <span className="text-[16px] font-medium text-[#767676] leading-[16px] tracking-[-0.32px]">
                    {formatPrice(bookingData.pricePerPerson)} x{" "}
                    {bookingData.duration}{" "}
                    {translate({
                      ru: "ночи",
                      uz: "tun",
                      en: "nights",
                      de: "Nächte",
                    })}
                  </span>
                  <span className="text-[20px] font-medium text-[#333333] leading-normal tracking-[-0.4px]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-end">
                  <span className="text-[16px] font-medium text-[#767676] leading-[16px] tracking-[-0.32px]">
                    {translate({
                      ru: "Скидка 10% по акции",
                      uz: "Aksiya bo'yicha 10% chegirma",
                      en: "10% Promotional Discount",
                      de: "10% Aktionsrabatt",
                    })}
                  </span>
                  <span className="text-[20px] font-medium text-[#333333] leading-normal tracking-[-0.4px]">
                    {formatPrice(discount)}
                  </span>
                </div>

                {/* Service Fee */}
                <div className="flex justify-between items-end">
                  <span className="text-[16px] font-medium text-[#767676] leading-[16px] tracking-[-0.32px]">
                    {translate({
                      ru: "Плата за обслуживание",
                      uz: "Xizmat haqi",
                      en: "Service Fee",
                      de: "Servicegebühr",
                    })}
                  </span>
                  <span className="text-[20px] font-medium text-[#333333] leading-normal tracking-[-0.4px]">
                    {formatPrice(serviceFee)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-end pt-[16px] border-t border-[#EBEBEB]">
                <span className="text-[20px] font-medium text-[#767676] leading-normal tracking-[-0.4px]">
                  {translate({
                    ru: "Итого к оплате",
                    uz: "Jami to'lov",
                    en: "Total Amount",
                    de: "Gesamtbetrag",
                  })}
                </span>
                <span className="text-[28px] font-medium text-[#827042] leading-[38px] tracking-[-0.56px]">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStepPage;
