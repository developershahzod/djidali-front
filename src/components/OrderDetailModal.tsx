import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  User,
  Mail,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { ApiOrder } from "../services/djidaliApi";
import { clickPaymentService } from "../services/legacyClickPayment";
import { getImageUrl } from "../utils/imageUtils";
import { useLanguage } from "../contexts/LanguageContext";

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

interface OrderDetailModalProps {
  order: ApiOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const [paymentStatus, setPaymentStatus] = useState<
    "waiting" | "confirmed" | "rejected" | "error" | "no_record" | null
  >(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const skipPaymentCheck = order?.status === "CANCELLED" || (order?.status as string) === "EXPIRED";

  useEffect(() => {
    if (isOpen && order && !skipPaymentCheck) {
      checkPaymentStatus();
    }
  }, [isOpen, order]);

  const checkPaymentStatus = async () => {
    if (!order) return;
    setIsCheckingPayment(true);
    try {
      const status = await clickPaymentService.getPaymentStatus(order.id);
      setPaymentStatus(status);
    } catch (error) {
      console.error("Payment status check failed:", error);
      setPaymentStatus("no_record");
    } finally {
      setIsCheckingPayment(false);
    }
  };

  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FULLY_PAID":
        return "bg-green-100 text-green-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "FULLY_PAID":
        return "Полностью оплачен";
      case "CONFIRMED":
        return "Подтверждён";
      case "PENDING":
        return "Ожидание";
      case "CANCELLED":
        return "Отменён";
      case "PARTIALLY_PAID":
        return "Частично оплачен";
      case "COMPLETED":
        return "Завершён";
      case "REFUNDED":
        return "Возвращён";
      case "EXPIRED":
        return "Истёк";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (
    status: "waiting" | "confirmed" | "rejected" | "error" | "no_record",
  ) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "error":
        return "bg-red-100 text-red-800 border-red-300";
      case "no_record":
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const getPaymentStatusText = (
    status: "waiting" | "confirmed" | "rejected" | "error" | "no_record",
  ) => {
    switch (status) {
      case "confirmed":
        return "Оплачено";
      case "waiting":
        return "Ожидание оплаты";
      case "rejected":
        return "Отклонено";
      case "error":
        return "Ошибка";
      case "no_record":
        return "Нет данных оплаты";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Детали заказа</h3>
            <p className="text-sm text-gray-500">
              #{order.id.substring(0, 8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Статус</h4>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>
            <div className="text-right">
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Дата создания
              </h4>
              <p className="text-sm text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {order.tour && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3">
                Информация о туре
              </h4>
              <div className="flex items-start space-x-4">
                {order.tour.images && order.tour.images[0] && (
                  <img
                    src={getImageUrl(order.tour.images[0])}
                    alt={getLocalizedText(order.tour.title, language)}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {getLocalizedText(order.tour.title, language)}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {getLocalizedText(order.tour.destination, language)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{order.tour.duration} дн.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {order.user && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3">
                Данные клиента
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {order.user.firstName} {order.user.lastName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{order.user.email}</span>
                </div>
              </div>
            </div>
          )}

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Платёжная информация
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Кол-во участников:</span>
                </div>
                <span className="font-medium text-gray-900">
                  {order.participants} чел.
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Общая сумма:</span>
                </div>
                <span className="text-lg font-bold text-emerald-600">
                  {order.totalAmount.toLocaleString()} UZS
                </span>
              </div>
              {!skipPaymentCheck && paymentStatus && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>Статус оплаты:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(paymentStatus)}`}
                    >
                      {getPaymentStatusText(paymentStatus)}
                    </span>
                    <button
                      onClick={checkPaymentStatus}
                      disabled={isCheckingPayment}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Обновить"
                    >
                      <RefreshCw
                        className={`w-4 h-4 text-gray-500 ${isCheckingPayment ? "animate-spin" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-700 mb-1">ID заказа</h5>
                <p className="text-gray-600 font-mono">
                  #{order.id.substring(0, 16)}
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-1">Обновлено</h5>
                <p className="text-gray-600">
                  {new Date(order.updatedAt).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
