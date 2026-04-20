import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { ru, uz, de, enUS } from "date-fns/locale";
import { djidaliApi } from "../services/djidaliApi";
import apiService from "../services/api";

// Back Arrow Icon
const BackArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icons as SVG components
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke="#8F7B49"
      strokeWidth="2"
      fill="none"
    />
    <path d="M3 10H21" stroke="#8F7B49" strokeWidth="2" />
    <path d="M8 2V6" stroke="#8F7B49" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 2V6" stroke="#8F7B49" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4" stroke="#8F7B49" strokeWidth="2" fill="none" />
    <path
      d="M5.5 21C5.5 17.134 8.41 14 12 14C15.59 14 18.5 17.134 18.5 21"
      stroke="#8F7B49"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const PriceTagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="#8F7B49"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="#8F7B49"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12L12 17L22 12"
      stroke="#8F7B49"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      stroke={checked ? "#8F7B49" : "#333333"}
      strokeWidth="2"
      fill={checked ? "#8F7B49" : "none"}
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
  startDate: Date | null;
  endDate: Date | null;
  participants: { adults: number; children: number };
  pricePerPerson: number;
  duration: number;
}

const BookingStepPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tourId } = useParams<{ tourId: string }>();
  const { translate, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  // Form state - Step 1
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form state - Step 2 (Payment) - Click only
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // API integration state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [tour, setTour] = useState<any>(null);
  const [tourLoading, setTourLoading] = useState(true);
  const [tourCurrency, setTourCurrency] = useState<string>("UZS");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Parse booking data from location state with proper null handling
  const rawBookingData = location.state?.bookingData;

  // Helper to safely parse date
  const safeParseDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === "string") {
      const parsed = new Date(dateValue);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };

  const bookingData: BookingData = rawBookingData
    ? {
        ...rawBookingData,
        startDate: safeParseDate(rawBookingData.startDate),
        endDate: safeParseDate(rawBookingData.endDate),
        participants: rawBookingData.participants || { adults: 1, children: 0 },
        pricePerPerson: Number(rawBookingData.pricePerPerson) || 0,
        duration: Number(rawBookingData.duration) || 1,
      }
    : {
        tourId: tourId || "",
        tourTitle: "",
        tourLocation: "",
        tourType: "",
        tourImage: "/tour-placeholder.jpg",
        startDate: null,
        endDate: null,
        participants: { adults: 1, children: 0 },
        pricePerPerson: 0,
        duration: 1,
      };

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

  // Format date safely
  const formatDateSafe = (date: Date | null): string => {
    if (!date) {
      return translate({
        ru: "Дата не указана",
        uz: "Sana ko'rsatilmagan",
        en: "Date not specified",
        de: "Datum nicht angegeben",
      });
    }
    return format(date, "d MMM, yyyy", { locale: getLocale() });
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
      return `${adultsText}, ${childrenText}`;
    }
    return adultsText;
  };

  // Format price with currency
  const formatPrice = (price: number) => {
    if (!price || price === 0) {
      return translate({
        ru: "Цена по запросу",
        uz: "Narx so'rov bo'yicha",
        en: "Price on request",
        de: "Preis auf Anfrage",
      });
    }
    if (tourCurrency === "USD") {
      return `$${new Intl.NumberFormat("en-US").format(price)}`;
    }
    if (tourCurrency === "EUR") {
      return `€${new Intl.NumberFormat("de-DE").format(price)}`;
    }
    return new Intl.NumberFormat("ru-RU").format(price) + " UZS";
  };

  const isForeignCurrency = tourCurrency === "USD" || tourCurrency === "EUR";

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  // Fetch tour data from API if not provided via location state
  useEffect(() => {
    const fetchTour = async () => {
      if (location.state?.bookingData) {
        setTourLoading(false);
        return;
      }

      if (!tourId) {
        setTourLoading(false);
        return;
      }

      try {
        setTourLoading(true);
        const tourData = await djidaliApi.getTour(tourId);
        setTour(tourData);
        if (tourData.currency) {
          setTourCurrency(tourData.currency);
        }
      } catch (err) {
        console.error("Failed to fetch tour:", err);
        setError(
          translate({
            ru: "Не удалось загрузить информацию о туре",
            uz: "Tur ma'lumotlarini yuklab bo'lmadi",
            en: "Failed to load tour information",
            de: "Tour-Informationen konnten nicht geladen werden",
          }),
        );
      } finally {
        setTourLoading(false);
      }
    };

    fetchTour();
  }, [tourId, location.state]);

  // Pre-fill form data from bookingData (TourDetailPage) or user profile
  useEffect(() => {
    // First try to use data from TourDetailPage form
    if (rawBookingData?.customerName && !fullName) {
      setFullName(rawBookingData.customerName);
    }
    if (rawBookingData?.customerPhone && !phone) {
      setPhone(rawBookingData.customerPhone);
    }
    // Fallback to user profile data
    if (user) {
      if (user.email && !email) setEmail(user.email);
      if (!fullName && user.firstName) {
        setFullName(`${user.firstName} ${user.lastName || ""}`.trim());
      }
    }
  }, [user, rawBookingData]);

  // Build display data from tour API or booking data
  const displayData: BookingData = tour
    ? {
        tourId: tour.id?.toString() || tourId || "",
        tourTitle:
          tour.titleRu ||
          tour.title ||
          tour.name ||
          bookingData.tourTitle ||
          "Тур",
        tourLocation:
          tour.locationRu ||
          tour.location ||
          tour.destination ||
          bookingData.tourLocation ||
          "",
        tourType:
          tour.category?.name ||
          tour.tourType?.name ||
          bookingData.tourType ||
          "",
        tourImage:
          tour.images?.[0]?.image_url ||
          tour.images?.[0] ||
          tour.coverImage ||
          bookingData.tourImage,
        startDate: safeParseDate(tour.startDate) || bookingData.startDate,
        endDate: safeParseDate(tour.endDate) || bookingData.endDate,
        participants: bookingData.participants,
        pricePerPerson: (() => {
          // Try multiple price formats
          if (typeof tour.price === "number" && tour.price > 0)
            return tour.price;
          if (tour.price?.amount) return Number(tour.price.amount);
          if (tour.price?.uzs) return Number(tour.price.uzs);
          if (tour.price?.UZS) return Number(tour.price.UZS);
          if (tour.pricePerPerson) return Number(tour.pricePerPerson);
          return bookingData.pricePerPerson;
        })(),
        duration: tour.duration || bookingData.duration || 1,
      }
    : bookingData;

  // Set currency from rawBookingData or tour
  React.useEffect(() => {
    if (rawBookingData?.currency) {
      setTourCurrency(rawBookingData.currency);
    } else if (tour?.currency) {
      setTourCurrency(tour.currency);
    }
  }, [rawBookingData, tour]);

  // Calculate totals - no hardcoded fees (backend will handle discounts/fees)
  const totalParticipants =
    displayData.participants.adults + displayData.participants.children;
  const totalPrice = displayData.pricePerPerson * totalParticipants;

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigate(-1);
    }
  };

  const handleContinue = async () => {
    setError(null);

    if (currentStep === 1) {
      if (!agreeToPolicy) {
        setError(
          translate({
            ru: "Пожалуйста, примите Политику Конфиденциальности",
            uz: "Iltimos, Maxfiylik siyosatini qabul qiling",
            en: "Please accept the Privacy Policy",
            de: "Bitte akzeptieren Sie die Datenschutzrichtlinie",
          }),
        );
        return;
      }

      if (!fullName || !phone || !email) {
        setError(
          translate({
            ru: "Пожалуйста, заполните все обязательные поля",
            uz: "Iltimos, barcha majburiy maydonlarni to'ldiring",
            en: "Please fill in all required fields",
            de: "Bitte füllen Sie alle Pflichtfelder aus",
          }),
        );
        return;
      }

      setIsLoading(true);
      try {
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || firstName;

        // Ensure tourId is a valid UUID - the backend requires UUID format
        let resolvedTourId = tourId || displayData.tourId;
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!uuidRegex.test(resolvedTourId)) {
          // tourId is not a UUID (might be numeric) - fetch tour to get UUID
          try {
            const tourData = await djidaliApi.getTour(resolvedTourId);
            resolvedTourId =
              tourData.id?.toString() || tourData.uuid || resolvedTourId;
          } catch {
            console.warn("Could not resolve tour UUID, using original tourId");
          }
        }

        const response = await apiService.createPublicBooking({
          tourId: resolvedTourId,
          participants: totalParticipants,
          notes: specialRequests || undefined,
          clientInfo: {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
          },
        });

        setOrderId(response.order.id);

        // For foreign currency orders, show confirmation immediately
        if (isForeignCurrency) {
          setBookingSubmitted(true);
          setCurrentStep(2);
        } else {
          setCurrentStep(2);
        }
      } catch (err: any) {
        console.error("Failed to create booking:", err);
        setError(
          err.message ||
            translate({
              ru: "Не удалось создать бронирование. Попробуйте еще раз.",
              uz: "Bron yaratib bo'lmadi. Qaytadan urinib ko'ring.",
              en: "Failed to create booking. Please try again.",
              de: "Buchung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
            }),
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // Step 2: For foreign currency, just navigate home
      if (isForeignCurrency) {
        navigate("/");
        return;
      }

      // Step 2: Payment via Click (UZS only)
      if (!orderId) {
        setError(
          translate({
            ru: "Ошибка: ID заказа отсутствует",
            uz: "Xato: Buyurtma ID topilmadi",
            en: "Error: Order ID is missing",
            de: "Fehler: Bestell-ID fehlt",
          }),
        );
        return;
      }

      setIsLoading(true);
      try {
        const paymentResponse = await apiService.initiateOrderPayment({
          orderId: orderId,
          method: "CLICK",
          amount: totalPrice,
        });

        if (paymentResponse.paymentUrl) {
          window.location.href = paymentResponse.paymentUrl;
        } else {
          throw new Error("Payment URL not received");
        }
      } catch (err: any) {
        console.error("Failed to initiate payment:", err);
        setError(
          err.message ||
            translate({
              ru: "Не удалось инициировать оплату.",
              uz: "To'lovni boshlab bo'lmadi.",
              en: "Failed to initiate payment.",
              de: "Zahlung konnte nicht eingeleitet werden.",
            }),
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (tourLoading) {
    return (
      <div className="min-h-screen bg-[#F4F2ED] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8F7B49] mx-auto mb-4"></div>
          <p className="text-[#333333] text-lg font-medium">
            {translate({
              ru: "Загрузка...",
              uz: "Yuklanmoqda...",
              en: "Loading...",
              de: "Laden...",
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F4F2ED]"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Simple Back Button Header */}
      <header className="sticky top-8 z-50 bg-[#F4F2ED]/95 backdrop-blur-sm border-b border-[#E5E0D5]">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-3 text-[#333333] hover:text-[#8F7B49] transition-colors group"
          >
            <span className="w-10 h-10 rounded-full bg-white border border-[#E5E0D5] flex items-center justify-center group-hover:border-[#8F7B49] transition-colors">
              <BackArrowIcon />
            </span>
            <span className="text-base font-medium">
              {translate({
                ru: "Назад",
                uz: "Orqaga",
                en: "Back",
                de: "Zurück",
              })}
            </span>
          </button>

          <Link to="/" className="flex items-center">
            <img
              src="/loho_white_png.webp"
              alt="DJIDALI"
              className="h-10 invert opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex justify-between items-center">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold text-xl leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#333333] tracking-tight mb-8">
          {translate({
            ru: "Забронируйте тур",
            uz: "Turni bron qiling",
            en: "Book Your Tour",
            de: "Buchen Sie Ihre Tour",
          })}
        </h1>

        {/* Step Indicator */}
        <div className="flex gap-4 md:gap-8 mb-10">
          <div
            className={`flex items-center gap-3 pb-4 border-b-2 ${currentStep === 1 ? "border-[#333333]" : "border-[#8F7B49]"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${currentStep === 1 ? "bg-[#333333]" : "bg-[#8F7B49]"}`}
            >
              1
            </div>
            <span
              className={`text-base md:text-lg font-medium ${currentStep === 1 ? "text-[#333333]" : "text-[#8F7B49]"}`}
            >
              {translate({
                ru: "Данные",
                uz: "Ma'lumotlar",
                en: "Details",
                de: "Details",
              })}
            </span>
          </div>
          <div
            className={`flex items-center gap-3 pb-4 border-b-2 ${currentStep === 2 ? "border-[#333333]" : "border-[#C4C4C4]"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${currentStep === 2 ? "bg-[#333333]" : "bg-[#C4C4C4]"}`}
            >
              2
            </div>
            <span
              className={`text-base md:text-lg font-medium ${currentStep === 2 ? "text-[#333333]" : "text-[#C4C4C4]"}`}
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            {currentStep === 1 ? (
              <>
                {/* Tour Summary Card */}
                <div className="bg-[#F9F8F5] rounded-xl p-4 mb-6 flex gap-4">
                  <img
                    src={displayData.tourImage}
                    alt={displayData.tourTitle}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = "/tour-placeholder.jpg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#333333] text-lg mb-1 truncate">
                      {displayData.tourTitle || "Тур"}
                    </h3>
                    <p className="text-sm text-[#666666] mb-2">
                      {displayData.tourLocation || "Узбекистан"}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-[#8F7B49]">
                      <span className="flex items-center gap-1">
                        <CalendarIcon />
                        {displayData.duration}{" "}
                        {translate({
                          ru: "дн.",
                          uz: "kun",
                          en: "days",
                          de: "Tage",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserIcon />
                        {totalParticipants}{" "}
                        {translate({
                          ru: "чел.",
                          uz: "kishi",
                          en: "ppl",
                          de: "Pers.",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <h2 className="text-xl font-semibold text-[#333333] mb-4">
                  {translate({
                    ru: "Контактная информация",
                    uz: "Aloqa ma'lumotlari",
                    en: "Contact Information",
                    de: "Kontaktinformationen",
                  })}
                </h2>

                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={translate({
                      ru: "Имя и фамилия *",
                      uz: "Ism va familiya *",
                      en: "Full Name *",
                      de: "Vollständiger Name *",
                    })}
                    className="w-full h-14 border-2 border-[#E5E0D5] rounded-xl px-4 text-base text-[#333333] placeholder:text-[#999] focus:border-[#8F7B49] focus:outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={translate({
                      ru: "Телефон *",
                      uz: "Telefon *",
                      en: "Phone *",
                      de: "Telefon *",
                    })}
                    className="w-full h-14 border-2 border-[#E5E0D5] rounded-xl px-4 text-base text-[#333333] placeholder:text-[#999] focus:border-[#8F7B49] focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={translate({
                      ru: "Email *",
                      uz: "Email *",
                      en: "Email *",
                      de: "E-Mail *",
                    })}
                    className="w-full h-14 border-2 border-[#E5E0D5] rounded-xl px-4 text-base text-[#333333] placeholder:text-[#999] focus:border-[#8F7B49] focus:outline-none transition-colors"
                  />
                </div>

                {/* Additional Information */}
                <h3 className="text-lg font-semibold text-[#333333] mb-4">
                  {translate({
                    ru: "Дополнительно",
                    uz: "Qo'shimcha",
                    en: "Additional",
                    de: "Zusätzlich",
                  })}
                </h3>

                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder={translate({
                      ru: "Экстренный контакт (имя)",
                      uz: "Favqulodda aloqa (ism)",
                      en: "Emergency Contact (name)",
                      de: "Notfallkontakt (Name)",
                    })}
                    className="w-full h-14 border-2 border-[#E5E0D5] rounded-xl px-4 text-base text-[#333333] placeholder:text-[#999] focus:border-[#8F7B49] focus:outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder={translate({
                      ru: "Экстренный контакт (телефон)",
                      uz: "Favqulodda aloqa (telefon)",
                      en: "Emergency Contact (phone)",
                      de: "Notfallkontakt (Telefon)",
                    })}
                    className="w-full h-14 border-2 border-[#E5E0D5] rounded-xl px-4 text-base text-[#333333] placeholder:text-[#999] focus:border-[#8F7B49] focus:outline-none transition-colors"
                  />
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder={translate({
                      ru: "Особые пожелания...",
                      uz: "Maxsus istaklar...",
                      en: "Special requests...",
                      de: "Besondere Wünsche...",
                    })}
                    rows={3}
                    className="w-full border-2 border-[#E5E0D5] rounded-xl px-4 py-3 text-base text-[#333333] placeholder:text-[#999] focus:border-[#8F7B49] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Privacy Policy */}
                <button
                  type="button"
                  onClick={() => setAgreeToPolicy(!agreeToPolicy)}
                  className="flex items-center gap-3 mb-6 group"
                >
                  <CheckboxIcon checked={agreeToPolicy} />
                  <span className="text-sm text-[#333333] group-hover:text-[#8F7B49] transition-colors">
                    {translate({
                      ru: "Я согласен с ",
                      uz: "Men roziman ",
                      en: "I agree to the ",
                      de: "Ich stimme der ",
                    })}
                    <Link to="/privacy" className="underline text-[#8F7B49]">
                      {translate({
                        ru: "Политикой Конфиденциальности",
                        uz: "Maxfiylik siyosati",
                        en: "Privacy Policy",
                        de: "Datenschutzrichtlinie",
                      })}
                    </Link>
                  </span>
                </button>
              </>
            ) : isForeignCurrency ? (
              <>
                {/* Foreign Currency Confirmation */}
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 12L11 14L15 10"
                        stroke="#22C55E"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#22C55E"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#333333] mb-3">
                    {translate({
                      ru: "Заявка принята!",
                      uz: "Ariza qabul qilindi!",
                      en: "Request Submitted!",
                      de: "Anfrage eingereicht!",
                    })}
                  </h2>
                  <p className="text-[#666666] mb-8 max-w-md mx-auto">
                    {translate({
                      ru: "Наш менеджер свяжется с вами в течение 24 часов для оформления оплаты и подтверждения бронирования.",
                      uz: "Menejerimiz 24 soat ichida siz bilan bog'lanib, to'lovni rasmiylashtiradi.",
                      en: "Our manager will contact you within 24 hours to arrange payment and confirm your booking.",
                      de: "Unser Manager wird sich innerhalb von 24 Stunden mit Ihnen in Verbindung setzen.",
                    })}
                  </p>

                  {/* Contact Cards */}
                  <div className="space-y-3 mb-6">
                    <a
                      href="tel:+998944708844"
                      className="flex items-center gap-4 p-4 bg-[#F9F8F5] rounded-xl hover:bg-[#F0EDE5] transition-colors"
                    >
                      <div className="w-12 h-12 bg-[#8F7B49]/10 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📞</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-[#666666]">
                          {translate({
                            ru: "Телефон",
                            uz: "Telefon",
                            en: "Phone",
                            de: "Telefon",
                          })}
                        </p>
                        <p className="font-semibold text-[#333333]">
                          +998 94 470 88 44
                        </p>
                      </div>
                    </a>
                    <a
                      href="https://t.me/djidali_travel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-[#F9F8F5] rounded-xl hover:bg-[#F0EDE5] transition-colors"
                    >
                      <div className="w-12 h-12 bg-[#229ED9]/10 rounded-lg flex items-center justify-center">
                        <span className="text-xl">✈️</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-[#666666]">Telegram</p>
                        <p className="font-semibold text-[#333333]">
                          @djidali_travel
                        </p>
                      </div>
                    </a>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-800">
                      {translate({
                        ru: '💡 Ваш заказ уже создан и виден в личном кабинете со статусом "В ожидании"',
                        uz: '💡 Buyurtmangiz yaratildi va shaxsiy kabinetda "Kutilmoqda" holati bilan ko\'rinadi',
                        en: '💡 Your order has been created and is visible in your account with "Pending" status',
                        de: '💡 Ihre Bestellung wurde erstellt und ist in Ihrem Konto mit dem Status "Ausstehend" sichtbar',
                      })}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Payment Step - Click (UZS only) */}
                <h2 className="text-xl font-semibold text-[#333333] mb-6">
                  {translate({
                    ru: "Способ оплаты",
                    uz: "To'lov usuli",
                    en: "Payment Method",
                    de: "Zahlungsmethode",
                  })}
                </h2>

                {/* Click Payment - Only available for UZS */}
                <div className="mb-6">
                  <div className="w-full h-16 border-2 border-[#8F7B49] bg-[#8F7B49]/5 rounded-xl px-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#00A3E0] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        Click
                      </span>
                    </div>
                    <span className="font-semibold text-[#8F7B49]">Click</span>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleBack}
                className="flex-1 h-14 bg-[#333333]/10 text-[#333333] rounded-xl font-semibold hover:bg-[#333333]/20 transition-colors"
              >
                {translate({
                  ru: "Отмена",
                  uz: "Bekor",
                  en: "Cancel",
                  de: "Abbrechen",
                })}
              </button>
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className={`flex-1 h-14 bg-[#8F7B49] text-white rounded-xl font-semibold transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#7A6A3E]"}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {translate({
                      ru: "Обработка...",
                      uz: "Jarayon...",
                      en: "Processing...",
                      de: "Verarbeitung...",
                    })}
                  </span>
                ) : currentStep === 2 && isForeignCurrency ? (
                  translate({
                    ru: "На главную",
                    uz: "Bosh sahifaga",
                    en: "Go to Home",
                    de: "Zur Startseite",
                  })
                ) : currentStep === 2 ? (
                  translate({
                    ru: "Оплатить через Click",
                    uz: "Click orqali to'lash",
                    en: "Pay with Click",
                    de: "Mit Click bezahlen",
                  })
                ) : (
                  translate({
                    ru: "Продолжить",
                    uz: "Davom etish",
                    en: "Continue",
                    de: "Fortfahren",
                  })
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm h-fit lg:sticky lg:top-24">
            {/* Tour Image */}
            <div className="relative rounded-xl overflow-hidden mb-6 aspect-[16/10]">
              <img
                src={displayData.tourImage}
                alt={displayData.tourTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/tour-placeholder.jpg";
                }}
              />
              {displayData.tourType && (
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-[#333333]">
                  {displayData.tourType}
                </span>
              )}
            </div>

            {/* Tour Info */}
            <h3 className="text-xl font-semibold text-[#333333] mb-2">
              {displayData.tourTitle || "Тур"}
            </h3>
            <p className="text-[#666666] mb-6">
              {displayData.tourLocation || "Узбекистан"}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F9F8F5] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#8F7B49] mb-1">
                  <CalendarIcon />
                  <span className="text-xs font-medium uppercase">
                    {translate({
                      ru: "Начало",
                      uz: "Boshlanishi",
                      en: "Start",
                      de: "Start",
                    })}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#333333]">
                  {formatDateSafe(displayData.startDate)}
                </p>
              </div>
              <div className="bg-[#F9F8F5] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#8F7B49] mb-1">
                  <CalendarIcon />
                  <span className="text-xs font-medium uppercase">
                    {translate({
                      ru: "Конец",
                      uz: "Tugashi",
                      en: "End",
                      de: "Ende",
                    })}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#333333]">
                  {formatDateSafe(displayData.endDate)}
                </p>
              </div>
              <div className="bg-[#F9F8F5] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#8F7B49] mb-1">
                  <UserIcon />
                  <span className="text-xs font-medium uppercase">
                    {translate({
                      ru: "Участники",
                      uz: "Ishtirokchilar",
                      en: "Guests",
                      de: "Gäste",
                    })}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#333333]">
                  {formatParticipants()}
                </p>
              </div>
              <div className="bg-[#F9F8F5] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#8F7B49] mb-1">
                  <PriceTagIcon />
                  <span className="text-xs font-medium uppercase">
                    {translate({
                      ru: "За чел.",
                      uz: "Kishiga",
                      en: "Per person",
                      de: "Pro Person",
                    })}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#333333]">
                  {formatPrice(displayData.pricePerPerson)}
                </p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-[#E5E0D5] pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">
                  {formatPrice(displayData.pricePerPerson)} ×{" "}
                  {totalParticipants}{" "}
                  {translate({
                    ru: "чел.",
                    uz: "kishi",
                    en: "guests",
                    de: "Gäste",
                  })}
                </span>
                <span className="text-[#333333] font-medium">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#E5E0D5]">
                <span className="text-lg font-semibold text-[#333333]">
                  {translate({
                    ru: "Итого",
                    uz: "Jami",
                    en: "Total",
                    de: "Gesamt",
                  })}
                </span>
                <span className="text-xl font-bold text-[#8F7B49]">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingStepPage;
