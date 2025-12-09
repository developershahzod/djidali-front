import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getImageUrl, getTourPrimaryImage } from "../utils/imageUtils";
import { useTour } from "../hooks/useTours";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import ScrollToTopButton from "../components/ScrollToTopButton";

interface ItineraryItem {
  dayNumber: number;
  title: string;
  description: string;
}

// Helper function to safely extract localized text from multilingual objects
const getLocalizedText = (
  value: string | { [key: string]: string } | undefined | null,
  language: string,
): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const langKey = language === "en" ? "eng" : language;
    return value[langKey] || value.ru || value.eng || value.uz || "";
  }
  return "";
};

const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, translate, language } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { tour, loading, error } = useTour(id ?? null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showParticipantsDropdown, setShowParticipantsDropdown] =
    useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingError, setBookingError] = useState("");

  const primaryImage = useMemo(
    () => (tour ? getTourPrimaryImage(tour) : ""),
    [tour],
  );

  const galleryImages = useMemo(() => {
    if (!tour) return [];
    const images =
      tour.images
        ?.map((image) => {
          if (typeof image === "string") {
            return getImageUrl(image);
          }
          if (image && typeof image === "object") {
            if (
              "image_url" in image &&
              (image as { image_url?: string }).image_url
            ) {
              return getImageUrl((image as { image_url: string }).image_url);
            }
            if ("url" in image && (image as { url?: string }).url) {
              return getImageUrl((image as { url: string }).url);
            }
          }
          return "";
        })
        .filter(Boolean) ?? [];

    if (!images.length && primaryImage) {
      return [primaryImage];
    }

    return images;
  }, [tour, primaryImage]);

  const itineraryItems = useMemo<ItineraryItem[]>(() => {
    if (!tour) return [];
    const program = (tour as any).program || (tour as any).programDays || [];
    if (Array.isArray(program) && program.length > 0) {
      return program
        .map((item: any) => ({
          dayNumber: item.dayNumber,
          title: item.title, // useTour hook should provide translated title
          description: item.description, // useTour hook should provide translated description
        }))
        .sort((a, b) => a.dayNumber - b.dayNumber);
    }
    // Fallback for old itinerary object
    if (
      tour.itinerary &&
      typeof tour.itinerary === "object" &&
      !Array.isArray(tour.itinerary)
    ) {
      return Object.entries(tour.itinerary).map(
        ([title, description], index) => ({
          dayNumber: index + 1,
          title: title,
          description:
            description === "{}" ? "Description not available." : description,
        }),
      );
    }
    return [];
  }, [tour]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");

    if (!isAuthenticated) {
      setBookingError(t("tourDetail.booking.errorUnauthorized"));
      navigate("/login");
      return;
    }

    if (!tour?.id) {
      setBookingError(t("tourDetail.booking.errorTourNotFound"));
      return;
    }

    // Navigate to 2-step booking page with all necessary data
    // Handle price as either number or object with amount
    const pricePerPerson =
      typeof tour.price === "number" ? tour.price : tour.price?.amount || 0;

    const bookingData = {
      tourId: tour.id.toString(),
      tourTitle: getLocalizedText(tour.title, language),
      tourLocation:
        getLocalizedText(tour.location, language) ||
        getLocalizedText(tour.destination, language) ||
        "",
      tourType: tour.category?.name
        ? getLocalizedText(tour.category.name, language)
        : "",
      tourImage: primaryImage,
      startDate: tour.startDate ? new Date(tour.startDate) : new Date(),
      endDate: tour.endDate ? new Date(tour.endDate) : new Date(),
      participants: { adults, children },
      pricePerPerson,
      duration: tour.duration || 1,
      customerName,
      customerPhone,
      notes,
    };

    navigate(`/booking/${tour.id}`, { state: { bookingData } });
  };

  // Only set first day as active on initial load, not on every activeDay change
  useEffect(() => {
    if (itineraryItems.length > 0) {
      setActiveDay(itineraryItems[0].dayNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itineraryItems.length]); // Only run when itinerary items are loaded

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8f7b49]"></div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center px-6">
        <div className="max-w-xl text-center space-y-6">
          <h2 className="text-[2rem] font-light text-[#333333]">
            {t("tourDetail.error.title")}
          </h2>
          <p className="text-base text-[#666]">
            {error || t("tourDetail.error.refresh")}
          </p>
        </div>
      </div>
    );
  }

  const tourPrice =
    (typeof tour.price === "object" && (tour.price as any)?.amount) ||
    (typeof tour.price === "number" ? tour.price : 0);
  const _totalAmount = tourPrice * (adults + children);
  const _totalParticipants = adults + children + infants;

  return (
    <>
      <div
        className="min-h-screen bg-[#f4f2ed] text-[#333333]"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex flex-col">
          <div className="absolute inset-0">
            {primaryImage && (
              <img
                src={primaryImage}
                alt={getLocalizedText(tour.title, language)}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex-1 flex flex-col justify-between px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)]">
            {/* Title */}
            <div className="pt-[clamp(60px,8.33vw,120px)]">
              <h1
                className="text-white font-medium max-w-[1340px] text-[clamp(40px,6.25vw,90px)] leading-[1.11]"
                style={{ letterSpacing: "-2.7px" }}
              >
                {getLocalizedText(tour.title, language)}
              </h1>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-[40px] mt-auto">
              {/* Location Link */}
              <div className="flex justify-end">
                <a
                  href="#location"
                  className="text-white underline text-[20px]"
                  style={{ letterSpacing: "-0.4px" }}
                >
                  {getLocalizedText(tour.destination, language) ||
                    tour.location ||
                    t("tourDetail.location")}
                </a>
              </div>

              <div className="flex flex-wrap gap-[30px]">
                {/* Price */}
                <div className="flex flex-col gap-[clamp(20px,2.78vw,40px)] w-full md:w-[426px]">
                  <div className="w-[clamp(60px,5.56vw,80px)] h-[clamp(60px,5.56vw,80px)] bg-white rounded-full flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path
                        d="M20 2V38M26 10H17C15.6739 10 14.4021 10.5268 13.4645 11.4645C12.5268 12.4021 12 13.6739 12 15C12 16.3261 12.5268 17.5979 13.4645 18.5355C14.4021 19.4732 15.6739 20 17 20H23C24.3261 20 25.5979 20.5268 26.5355 21.4645C27.4732 22.4021 28 23.6739 28 25C28 26.3261 27.4732 27.5979 26.5355 28.5355C25.5979 29.4732 24.3261 30 23 30H12"
                        stroke="#333333"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-[10px] text-white">
                    <div
                      className="text-[clamp(32px,3.47vw,50px)] font-medium leading-[1]"
                      style={{ letterSpacing: "-1px" }}
                    >
                      {Number(tourPrice).toLocaleString("ru-RU")}{" "}
                      <span className="text-[clamp(24px,2.78vw,40px)] font-extralight">
                        UZS
                      </span>
                    </div>
                    <div
                      className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4]"
                      style={{ letterSpacing: "-0.4px" }}
                    >
                      {translate("tourDetail.programCost")}
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-[clamp(20px,2.78vw,40px)] w-full md:w-[426px]">
                  <div className="w-[clamp(60px,5.56vw,80px)] h-[clamp(60px,5.56vw,80px)] bg-white rounded-full flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle
                        cx="20"
                        cy="20"
                        r="18"
                        stroke="#333333"
                        strokeWidth="2"
                      />
                      <path
                        d="M20 10V20L26 26"
                        stroke="#333333"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-[10px] text-white">
                    <div
                      className="text-[clamp(32px,3.47vw,50px)] font-medium leading-[1]"
                      style={{ letterSpacing: "-1px" }}
                    >
                      {tour.duration}{" "}
                      <span className="text-[clamp(24px,2.78vw,40px)] font-extralight">
                        {translate("tourDetail.days")}
                      </span>
                    </div>
                    <div
                      className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4]"
                      style={{ letterSpacing: "-0.4px" }}
                    >
                      {translate("tourDetail.tourDuration")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Container Section */}
        <section
          id="booking"
          className="relative bg-white md:h-[394px] px-[clamp(20px,3.47vw,50px)] py-[clamp(30px,4.17vw,60px)]"
        >
          {/* Tour Details */}
          <div className="md:absolute md:top-[80px] md:left-[50px] md:right-[50px] flex flex-col md:flex-row justify-between items-start md:items-center max-w-full gap-[20px]">
            <div className="flex flex-col gap-[10px] w-full md:w-[234px]">
              <div
                className="text-[20px] leading-[24px]"
                style={{ letterSpacing: "-0.4px" }}
              >
                {translate("tourDetail.people")}
              </div>
              <div
                className="text-[32px] font-medium leading-[40px]"
                style={{ letterSpacing: "-0.64px" }}
              >
                {t("tourDetail.maxPrefix")}{" "}
                {(tour as any).max_participants ?? tour.maxParticipants ?? 10}
              </div>
            </div>
            <div className="hidden md:block w-[62px] h-[1px] bg-gray-300 rotate-90" />
            <div className="flex flex-col gap-[10px] w-full md:w-[234px]">
              <div
                className="text-[20px] leading-[24px]"
                style={{ letterSpacing: "-0.4px" }}
              >
                {translate("tourDetail.minAge")}
              </div>
              <div
                className="text-[32px] font-medium leading-[40px]"
                style={{ letterSpacing: "-0.64px" }}
              >
                {(tour as any).minAge
                  ? `${(tour as any).minAge} yoshdan`
                  : t("tourDetail.minAgeValue")}
              </div>
            </div>
            <div className="hidden md:block w-[62px] h-[1px] bg-gray-300 rotate-90" />
            <div className="flex flex-col gap-[10px] w-full md:w-[234px]">
              <div
                className="text-[20px] leading-[24px]"
                style={{ letterSpacing: "-0.4px" }}
              >
                {translate("tourDetail.tourType")}
              </div>
              <div
                className="text-[32px] font-medium leading-[40px] capitalize"
                style={{ letterSpacing: "-0.64px" }}
              >
                {(tour.category as any)?.name || t("tourDetail.ecotourism")}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleSubmit}
            className="md:absolute md:top-[234px] md:left-[50px] md:right-[50px] mt-[30px] md:mt-0"
          >
            {bookingError && (
              <div
                className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-[10px] text-[18px]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                ✗ {bookingError}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-[16px] md:gap-[20px] items-stretch md:items-end flex-wrap">
              {/* Имя */}
              <div className="flex-1 min-w-[200px]">
                <label
                  className="block text-[16px] font-medium text-[#333333] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t("tourDetail.customerName")}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full h-[60px] md:h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[18px] md:text-[22px] font-semibold"
                  style={{
                    letterSpacing: "-0.44px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                  placeholder={t("tourDetail.enterName")}
                />
              </div>

              {/* Телефон */}
              <div className="flex-1 min-w-[200px]">
                <label
                  className="block text-[16px] font-medium text-[#333333] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t("tourDetail.customerPhone")}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 12) {
                      let formatted = "+998";
                      if (value.length > 3) {
                        formatted += " " + value.slice(3, 5);
                      }
                      if (value.length > 5) {
                        formatted += " " + value.slice(5, 8);
                      }
                      if (value.length > 8) {
                        formatted += "-" + value.slice(8, 10);
                      }
                      if (value.length > 10) {
                        formatted += "-" + value.slice(10, 12);
                      }
                      setCustomerPhone(formatted);
                    }
                  }}
                  required
                  className="w-full h-[60px] md:h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[18px] md:text-[22px] font-semibold"
                  style={{
                    letterSpacing: "-0.44px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                  placeholder="+998 XX XXX-XX-XX"
                />
              </div>

              {/* Даты */}
              <div className="flex-1 min-w-[180px]">
                <label
                  className="block text-[16px] font-medium text-[#333333] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t("tourDetail.dates")}
                </label>
                <div
                  className="w-full h-[60px] md:h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[18px] md:text-[22px] font-semibold flex items-center bg-white"
                  style={{
                    letterSpacing: "-0.44px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {tour.startDate && tour.endDate ? (
                    <>
                      {new Date(tour.startDate).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                      })}
                      {" – "}
                      {new Date(tour.endDate).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                      })}
                    </>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>

              {/* Участники */}
              <div className="flex-1 min-w-[280px] relative">
                <label
                  className="block text-[16px] font-medium text-[#333333] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t("tourDetail.participantsCount")}
                </label>
                <div
                  onClick={() =>
                    setShowParticipantsDropdown(!showParticipantsDropdown)
                  }
                  className="w-full h-[60px] md:h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[18px] md:text-[22px] font-semibold flex items-center justify-between bg-white cursor-pointer"
                  style={{
                    letterSpacing: "-0.44px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  <span>
                    {adults} {t("tourDetail.adults")}
                    {children > 0 &&
                      ` — ${children} ${t("tourDetail.children")}`}
                    {infants > 0 && ` — ${infants} ${t("tourDetail.infants")}`}
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-transform ${showParticipantsDropdown ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="#333"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Dropdown */}
                {showParticipantsDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#333333] rounded-[10px] p-4 z-50 shadow-lg">
                    {/* Adults */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <div className="font-semibold text-[16px]">
                          {t("tourDetail.adultsLabel")}
                        </div>
                        <div className="text-[14px] text-gray-500">
                          {t("tourDetail.adultsAge")}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-10 h-10 rounded-full border-2 border-[#333] flex items-center justify-center text-[20px] hover:bg-gray-100 disabled:opacity-30"
                          disabled={adults <= 1}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-[18px]">
                          {adults}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAdults(Math.min(10, adults + 1))}
                          className="w-10 h-10 rounded-full border-2 border-[#333] flex items-center justify-center text-[20px] hover:bg-gray-100 disabled:opacity-30"
                          disabled={adults >= 10}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <div className="font-semibold text-[16px]">
                          {t("tourDetail.childrenLabel")}
                        </div>
                        <div className="text-[14px] text-gray-500">
                          {t("tourDetail.childrenAge")}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-10 h-10 rounded-full border-2 border-[#333] flex items-center justify-center text-[20px] hover:bg-gray-100 disabled:opacity-30"
                          disabled={children <= 0}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-[18px]">
                          {children}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setChildren(Math.min(10, children + 1))
                          }
                          className="w-10 h-10 rounded-full border-2 border-[#333] flex items-center justify-center text-[20px] hover:bg-gray-100 disabled:opacity-30"
                          disabled={children >= 10}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-semibold text-[16px]">
                          {t("tourDetail.infantsLabel")}
                        </div>
                        <div className="text-[14px] text-gray-500">
                          {t("tourDetail.infantsAge")}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setInfants(Math.max(0, infants - 1))}
                          className="w-10 h-10 rounded-full border-2 border-[#333] flex items-center justify-center text-[20px] hover:bg-gray-100 disabled:opacity-30"
                          disabled={infants <= 0}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-[18px]">
                          {infants}
                        </span>
                        <button
                          type="button"
                          onClick={() => setInfants(Math.min(5, infants + 1))}
                          className="w-10 h-10 rounded-full border-2 border-[#333] flex items-center justify-center text-[20px] hover:bg-gray-100 disabled:opacity-30"
                          disabled={infants >= 5}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Done button */}
                    <button
                      type="button"
                      onClick={() => setShowParticipantsDropdown(false)}
                      className="w-full mt-4 h-[50px] bg-[#8f7b49] text-white rounded-[10px] text-[16px] font-bold hover:bg-[#7a6839] transition-all"
                    >
                      {t("tourDetail.done")}
                    </button>
                  </div>
                )}
              </div>

              {/* Кнопка */}
              <button
                type="submit"
                disabled={!customerName || !customerPhone}
                className="w-full md:w-[180px] h-[60px] md:h-[80px] bg-[#8f7b49] text-white rounded-[10px] text-[18px] md:text-[20px] font-bold hover:bg-[#7a6839] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0"
                style={{
                  letterSpacing: "-0.4px",
                  lineHeight: "20px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {t("tourDetail.book")}
              </button>
            </div>
          </form>
        </section>

        {/* About Section */}
        <section className="px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)] max-w-[1440px] mx-auto">
          <h2
            className="text-[60px] font-medium text-[#333333] leading-[60px] mb-[40px]"
            style={{ letterSpacing: "-1.8px" }}
          >
            {t("tourDetail.aboutTour")}
          </h2>
          <div
            className="text-[clamp(18px,2.43vw,35px)] text-black leading-[clamp(28px,4.17vw,60px)] mb-[40px]"
            style={{ letterSpacing: "-0.7px" }}
          >
            <p>{tour.description || t("tourDetail.defaultDescription")}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-[31px]">
            <div className="w-full md:w-[426px]">
              <h3
                className="text-[32px] font-medium text-[#333333] leading-[40px] mb-[20px]"
                style={{ letterSpacing: "-0.64px" }}
              >
                {t("tourDetail.included")}
              </h3>
              {(tour.inclusions && tour.inclusions.length > 0
                ? tour.inclusions
                : [
                    t("tourDetail.accommodation"),
                    t("tourDetail.meals"),
                    t("tourDetail.guideServices"),
                    t("tourDetail.transfer"),
                    t("tourDetail.excursions"),
                  ]
              ).map((item, i) => {
                // Safely convert to string (handles multilingual objects)
                const itemText =
                  typeof item === "string"
                    ? item
                    : item?.uz || item?.ru || item?.eng || item?.de || "";
                return (
                  <div
                    key={i}
                    className="text-[20px] text-[#333333] leading-[24px] mb-[16px] pl-[30px] relative"
                    style={{ letterSpacing: "-0.4px" }}
                  >
                    <span className="absolute left-[10px]">•</span>
                    {itemText}
                  </div>
                );
              })}
            </div>
            <div className="w-full md:w-[426px] md:pl-8 md:border-l md:border-gray-200">
              <h3
                className="text-[32px] font-medium text-[#333333] leading-[40px] mb-[20px]"
                style={{ letterSpacing: "-0.64px" }}
              >
                {t("tourDetail.excluded")}
              </h3>
              {(tour.exclusions && tour.exclusions.length > 0
                ? tour.exclusions
                : [
                    t("tourDetail.personalExpenses"),
                    t("tourDetail.alcohol"),
                    t("tourDetail.insurance"),
                    t("tourDetail.huntingEquipment"),
                  ]
              ).map((item, i) => {
                // Safely convert to string (handles multilingual objects)
                const itemText =
                  typeof item === "string"
                    ? item
                    : item?.uz || item?.ru || item?.eng || item?.de || "";
                return (
                  <div
                    key={i}
                    className="text-[20px] text-[#333333] leading-[24px] mb-[16px] pl-[30px] relative"
                    style={{ letterSpacing: "-0.4px" }}
                  >
                    <span className="absolute left-[10px]">•</span>
                    {itemText}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)] max-w-[1440px] mx-auto">
          <h2
            className="text-[60px] font-medium text-[#333333] leading-[60px] mb-[40px]"
            style={{ letterSpacing: "-1.8px" }}
          >
            {t("tourDetail.momentsFromTour")}
          </h2>
          {galleryImages.length > 0 ? (
            <div className="flex flex-col gap-0">
              {/* Top Image */}
              <div className="w-full h-[clamp(240px,34.72vw,500px)] rounded-t-[20px] overflow-hidden">
                <img
                  src={galleryImages[0]}
                  alt={`${getLocalizedText(tour.title, language)} - Lahza 1`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom Images */}
              <div className="flex flex-col md:flex-row gap-0">
                {galleryImages.slice(1, 3).length > 0 ? (
                  galleryImages.slice(1, 3).map((image, index) => (
                    <div
                      key={index}
                      className={`w-full md:w-1/2 h-[clamp(240px,40.69vw,586px)] overflow-hidden ${index === 0 ? "rounded-bl-[20px]" : "rounded-br-[20px]"}`}
                    >
                      <img
                        src={image}
                        alt={`${getLocalizedText(tour.title, language)} - Lahza ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  // If only 1 image, duplicate it for layout
                  <>
                    <div className="w-full md:w-1/2 h-[clamp(240px,40.69vw,586px)] overflow-hidden rounded-bl-[20px]">
                      <img
                        src={galleryImages[0]}
                        alt={`${getLocalizedText(tour.title, language)} - Lahza 2`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full md:w-1/2 h-[clamp(240px,40.69vw,586px)] overflow-hidden rounded-br-[20px]">
                      <img
                        src={galleryImages[0]}
                        alt={`${getLocalizedText(tour.title, language)} - Lahza 3`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-[20px]">{t("tourDetail.imagesLoading")}</p>
            </div>
          )}
        </section>

        {/* Program Section */}
        {itineraryItems.length > 0 && (
          <section className="px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)] max-w-[1440px] mx-auto">
            <h2
              className="text-[60px] font-medium text-[#333333] leading-[60px] mb-[40px]"
              style={{ letterSpacing: "-1.8px" }}
            >
              {t("tourDetail.tourProgram")}
            </h2>
            <div className="flex flex-col gap-[20px]">
              {itineraryItems.map((item) => {
                const isOpen = activeDay === item.dayNumber;
                return (
                  <div
                    key={item.dayNumber}
                    className="border-2 border-silver rounded-[20px] px-[40px] py-[38px] cursor-pointer hover:border-[#8f7b49] transition-colors"
                    onClick={() => setActiveDay(isOpen ? null : item.dayNumber)}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px]">
                      <div className="flex gap-[30px] items-center flex-1 w-full">
                        <div
                          className="text-[35px] font-medium text-black w-full md:w-[273px]"
                          style={{ letterSpacing: "-0.7px" }}
                        >
                          {t("tourDetail.day")} {item.dayNumber}
                        </div>
                        <div
                          className="text-[20px] text-black flex-1"
                          style={{ letterSpacing: "-0.4px" }}
                        >
                          {item.title.replace(/^День\s*\d+\s*/i, "").trim() ||
                            item.title}
                        </div>
                      </div>
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M19.9992 21.9531L28.2492 13.7031L30.6059 16.0598L19.9992 26.6665L9.39258 16.0598L11.7492 13.7031L19.9992 21.9531Z"
                          fill="#151412"
                        />
                      </svg>
                    </div>
                    {isOpen && (
                      <div
                        className="mt-4 text-[20px] text-black pl-0 md:pl-[303px]"
                        style={{ letterSpacing: "-0.4px" }}
                      >
                        {item.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Ready to Book CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#2d2622] to-[#1a1a1a]">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8f7b49] rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#8f7b49] rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 px-[clamp(20px,3.47vw,50px)] py-[clamp(60px,8.33vw,120px)] max-w-[1440px] mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-[60px]">
              {/* Left: Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8f7b49]/20 rounded-full mb-6">
                  <span className="w-2 h-2 bg-[#8f7b49] rounded-full animate-pulse" />
                  <span className="text-[#8f7b49] text-sm font-medium tracking-wide uppercase">
                    {t("tourDetail.cta.limitedSpots")}
                  </span>
                </div>

                <h2
                  className="text-white text-[clamp(36px,4.17vw,60px)] font-medium leading-[1.1] mb-6"
                  style={{ letterSpacing: "-1.8px" }}
                >
                  {t("tourDetail.cta.readyTitle")}
                </h2>

                <p
                  className="text-white/70 text-[clamp(16px,1.39vw,20px)] leading-[1.6] mb-8 max-w-[500px] mx-auto lg:mx-0"
                  style={{ letterSpacing: "-0.4px" }}
                >
                  {t("tourDetail.cta.description")}
                </p>
              </div>

              {/* Right: Price Card & CTA */}
              <div className="w-full lg:w-auto">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[24px] p-8 min-w-[320px]">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="text-white/50 text-sm uppercase tracking-wider mb-2">
                      {t("tourDetail.cta.startingFrom")}
                    </div>
                    <div className="flex items-baseline justify-center gap-2">
                      <span
                        className="text-white text-[clamp(40px,3.47vw,50px)] font-semibold"
                        style={{ letterSpacing: "-1px" }}
                      >
                        {Number(tourPrice).toLocaleString("ru-RU")}
                      </span>
                      <span className="text-white/70 text-[20px]">UZS</span>
                    </div>
                    <div className="text-white/50 text-sm mt-1">
                      {t("tourDetail.cta.perPerson")}
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="flex items-center justify-center gap-2 mb-6 text-white/70">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {tour.duration} {t("tourDetail.days")}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      const bookingSection = document.getElementById("booking");
                      if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full h-[60px] bg-[#8f7b49] hover:bg-[#a08b59] text-white rounded-[12px] text-[18px] font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#8f7b49]/30 flex items-center justify-center gap-3"
                    style={{
                      letterSpacing: "-0.36px",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {t("tourDetail.cta.bookNow")}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section
          id="location"
          className="px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)] max-w-[1440px] mx-auto"
        >
          <h2
            className="text-[60px] font-medium text-[#333333] leading-[60px] mb-[40px]"
            style={{ letterSpacing: "-1.8px" }}
          >
            {t("tourDetail.locationTitle")}
          </h2>
          <div className="relative w-full h-[clamp(300px,34.72vw,500px)] rounded-[20px] overflow-hidden border border-white">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(tour.destination || tour.location || t("tourDetail.defaultLocation"))}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tour Location Map"
            />
          </div>
        </section>
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default TourDetailPage;
