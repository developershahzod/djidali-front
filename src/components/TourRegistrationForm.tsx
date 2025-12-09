import React, { useState, useEffect } from "react";
import { X, CheckCircle, Users, MessageSquare, LogIn } from "lucide-react";
import { ApiTour, djidaliApi, ApiOrder } from "../services/djidaliApi";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import PaymentModal from "./PaymentModal";
import { useNavigate } from "react-router-dom";
import { sanitize } from "../utils/validation";

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

interface TourRegistrationFormProps {
  tour: ApiTour;
  isOpen: boolean;
  onClose: () => void;
}

const TourRegistrationForm: React.FC<TourRegistrationFormProps> = ({
  tour,
  isOpen,
  onClose,
}) => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<ApiOrder | null>(null);

  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      setError("Buyurtma berish uchun tizimga kirish talab qilinadi");
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  if (isOpen && !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Tizimga kirish talab qilinadi
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Buyurtma berish uchun avval tizimga kirishingiz yoki ro'yxatdan
            o'tishingiz kerak.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                navigate("/login");
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Tizimga kirish
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tourPrice =
    (typeof tour.price === "object" && tour.price?.amount) ||
    (typeof tour.price === "number" ? tour.price : 0);
  const totalAmount = tourPrice * participants;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (participants < 1 || participants > 15) {
      setError("Ishtirokchilar soni 1 dan 15 gacha bo'lishi kerak");
      return;
    }

    setIsSubmitting(true);

    try {
      const tourId = tour.uuid || tour.id;
      if (!tourId) {
        throw new Error("Tur ma'lumotlari noto'g'ri");
      }

      const sanitizedNotes = notes ? sanitize.text(notes) : undefined;

      const order = await djidaliApi.createOrder({
        tourId: tourId.toString(),
        participants: participants,
        notes: sanitizedNotes,
      });

      setCreatedOrder(order);
      setShowPayment(true);
    } catch (error) {
      console.error("Order creation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Nomalum xatolik";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = () => {
    setIsSuccess(true);
    setShowPayment(false);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setShowPayment(false);
    setCreatedOrder(null);
    setError("");
    setParticipants(1);
    setNotes("");
    onClose();
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Muvaffaqiyatli!
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Sizning buyurtmangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.
          </p>
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Yopish
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={totalAmount}
        currency="UZS"
        orderNumber={createdOrder?.orderNumber || createdOrder?.id}
        orderId={createdOrder?.id || ""}
        onPaymentComplete={handlePaymentComplete}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 rounded-t-2xl px-8 py-6">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">
              Ro'yxatdan o'tish
            </h2>
            <p className="text-white/90 text-sm">
              Quyidagi ma'lumotlarni to'ldiring
            </p>
          </div>

          {/* Tour Info Card */}
          <div className="px-8 py-6 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {getLocalizedText(tour.title, language)}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {getLocalizedText(tour.destination, language)} •{" "}
                  {tour.duration} kun
                </p>
                <div className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
                  {tourPrice.toLocaleString()} UZS
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Participants */}
            <div>
              <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                <Users className="w-5 h-5 text-emerald-600 mr-2" />
                Ishtirokchilar soni
              </label>
              <select
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                  (num) => (
                    <option key={num} value={num}>
                      {num} kishi
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                <MessageSquare className="w-5 h-5 text-emerald-600 mr-2" />
                Qo'shimcha ma'lumotlar (ixtiyoriy)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                placeholder="Maxsus talablar, savollar yoki izohlar..."
              />
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">Tur narxi:</span>
                <span className="font-semibold text-gray-900">
                  {tourPrice.toLocaleString()} UZS
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">
                  Ishtirokchilar:
                </span>
                <span className="font-semibold text-gray-900">
                  {participants} kishi
                </span>
              </div>
              <div className="border-t-2 border-emerald-300 pt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Jami:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {totalAmount.toLocaleString()} UZS
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Yuborilmoqda...</span>
                </div>
              ) : !isAuthenticated ? (
                "Tizimga kiring"
              ) : (
                "Buyurtma berish"
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Buyurtmangizni yuborish orqali siz{" "}
              <a href="#" className="text-emerald-600 hover:underline">
                shartlar va qoidalar
              </a>{" "}
              bilan rozisiz
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default TourRegistrationForm;
