import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getImageUrl, getTourPrimaryImage } from "../utils/imageUtils";
import { useTour } from "../hooks/useTours";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { djidaliApi, ApiOrder } from "../services/djidaliApi";
import PaymentModal from "../components/PaymentModal";
import ScrollToTopButton from "../components/ScrollToTopButton";

interface ItineraryItem {
  dayNumber: number;
  title: string;
  description: string;
}

const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, translate } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { tour, loading, error } = useTour(id ?? null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [participants, setParticipants] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<ApiOrder | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");

    if (!isAuthenticated) {
      setBookingError("Buyurtma berish uchun tizimga kirish talab qilinadi");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const tourId = tour?.id;
      if (!tourId) {
        throw new Error("Tur ma'lumotlari noto'g'ri");
      }

      const order = await djidaliApi.createOrder({
        tourId: tourId.toString(),
        participants: participants,
        notes: notes || undefined,
      });

      setCreatedOrder(order);
      setShowPayment(true);
    } catch (error) {
      console.error("Order creation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Nomalum xatolik";
      setBookingError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = () => {
    setBookingSuccess(true);
    setShowPayment(false);
    setParticipants(1);
    setNotes("");
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  useEffect(() => {
    if (itineraryItems.length > 0 && activeDay === null) {
      setActiveDay(itineraryItems[0].dayNumber);
    }
  }, [itineraryItems, activeDay]);

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
  const totalAmount = tourPrice * participants;

  return (
    <>
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={totalAmount}
        currency="UZS"
        orderNumber={createdOrder?.orderNumber || createdOrder?.id}
        orderId={createdOrder?.id || ""}
        onPaymentComplete={handlePaymentComplete}
      />

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
                alt={tour.title}
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
                {tour.title}
              </h1>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-[40px] mt-auto">
              {/* Location Link */}
              <div className="flex justify-end">
                <Link
                  to="#location"
                  className="text-white underline text-[20px]"
                  style={{ letterSpacing: "-0.4px" }}
                >
                  {tour.destination ||
                    tour.location ||
                    t("tourDetail.location")}
                </Link>
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
        <section className="relative bg-white md:h-[394px] px-[clamp(20px,3.47vw,50px)] py-[clamp(30px,4.17vw,60px)]">
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
                {t("tourDetail.maxPrefix")} {(tour as any).max_participants ?? tour.maxParticipants ?? 10}
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
            <div className="hidden md:block w-[62px] h-[1px] bg-gray-300 rotate-90" />
           
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleSubmit}
            className="md:absolute md:top-[234px] md:left-[50px] md:right-[50px] mt-[30px] md:mt-0"
          >
            {bookingSuccess && (
              <div
                className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-[10px] text-[18px]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                ✓ {t("tourDetail.bookingSuccess")}
              </div>
            )}
            {bookingError && (
              <div
                className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-[10px] text-[18px]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                ✗ {bookingError}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-[16px] md:gap-[20px] items-stretch md:items-end">
              {/* Участники */}
              <div className="flex-1">
                <label
                  className="block text-[16px] font-medium text-[#333333] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t("tourDetail.participantsCount")}
                </label>
                <select
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                  required
                  className="w-full h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[22px] font-semibold cursor-pointer"
                  style={{
                    letterSpacing: "-0.44px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {Array.from({ length: (tour as any).max_participants ?? tour.maxParticipants ?? 10 }, (_, i) => i + 1).map(
                    (num) => (
                      <option key={num} value={num}>
                        {num} {t("tourDetail.person")}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Примечания */}
              <div className="flex-1">
                <label
                  className="block text-[16px] font-medium text-[#333333] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t("tourDetail.additionalInfo")}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-[80px] border-2 border-[#333333] rounded-[10px] px-[20px] text-[22px] font-semibold"
                  style={{
                    letterSpacing: "-0.44px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                  placeholder={t("tourDetail.specialRequests")}
                />
              </div>

              {/* Кнопка */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-[250px] h-[60px] md:h-[80px] bg-[#8f7b49] text-white rounded-[10px] text-[20px] font-bold hover:bg-[#7a6839] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{
                  letterSpacing: "-0.4px",
                  lineHeight: "20px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {isSubmitting
                  ? t("tourDetail.submitting")
                  : t("tourDetail.makeOrder")}
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
                  alt={`${tour.title} - Lahza 1`}
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
                        alt={`${tour.title} - Lahza ${index + 2}`}
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
                        alt={`${tour.title} - Lahza 2`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full md:w-1/2 h-[clamp(240px,40.69vw,586px)] overflow-hidden rounded-br-[20px]">
                      <img
                        src={galleryImages[0]}
                        alt={`${tour.title} - Lahza 3`}
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
