import React, { useMemo, useState } from "react";
import { X, Send, Loader2, CheckCircle, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useLanguage } from "../contexts/LanguageContext";
import { DateRangePicker } from "./ui/DateRangePicker";

export interface RequestProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  telegram: string;
  dateFrom: string;
  dateTo: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  telegram?: string;
  message?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://demo-api.djidali.uz/api";

const RequestProgramModal: React.FC<RequestProgramModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    telegram: "",
    dateFrom: "",
    dateTo: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t("requestModal.errors.nameRequired");
    } else if (formData.name.length < 2) {
      newErrors.name = t("requestModal.errors.nameMinLength");
    } else if (formData.name.length > 100) {
      newErrors.name = t("requestModal.errors.nameMaxLength");
    }

    // Phone validation
    const phoneRegex = /^\+?[0-9\s\-\(\)]{7,20}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = t("requestModal.errors.phoneRequired");
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = t("requestModal.errors.phoneInvalid");
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = t("requestModal.errors.emailRequired");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("requestModal.errors.emailInvalid");
    }

    // Telegram validation (optional)
    if (formData.telegram && formData.telegram.length > 50) {
      newErrors.telegram = t("requestModal.errors.telegramMaxLength");
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t("requestModal.errors.messageRequired");
    } else if (formData.message.length < 10) {
      newErrors.message = t("requestModal.errors.messageMinLength");
    } else if (formData.message.length > 1000) {
      newErrors.message = t("requestModal.errors.messageMaxLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // The form keeps dates as ISO strings; the picker works with Date objects.
  const dateRange = useMemo<DateRange | undefined>(() => {
    const from = formData.dateFrom ? parseISO(formData.dateFrom) : undefined;
    const to = formData.dateTo ? parseISO(formData.dateTo) : undefined;
    return from || to ? { from, to } : undefined;
  }, [formData.dateFrom, formData.dateTo]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFormData((prev) => ({
      ...prev,
      dateFrom: range?.from ? format(range.from, "yyyy-MM-dd") : "",
      dateTo: range?.to ? format(range.to, "yyyy-MM-dd") : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/contact-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim().toLowerCase(),
          telegram: formData.telegram.trim() || undefined,
          dateFrom: formData.dateFrom || undefined,
          dateTo: formData.dateTo || undefined,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setStatus("success");
      setServerMessage(data.message || t("requestModal.successMessage"));

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          email: "",
          telegram: "",
          dateFrom: "",
          dateTo: "",
          message: "",
        });
        setStatus("idle");
        onClose();
      }, 3000);
    } catch (error) {
      setStatus("error");
      setServerMessage(
        error instanceof Error ? error.message : t("requestModal.errorMessage"),
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && status !== "submitting") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10001] overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-lg animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={status === "submitting"}
            className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h3
                className="text-xl font-semibold text-gray-900"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {t("requestModal.title")}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {t("requestModal.subtitle")}
              </p>
            </div>

            {/* Success State */}
            {status === "success" ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-center text-gray-700 font-medium">
                  {serverMessage}
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("requestModal.fields.name")} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={status === "submitting"}
                    placeholder={t("requestModal.placeholders.name")}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.name
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-[#8f7b49]/30 focus:border-[#8f7b49]"
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("requestModal.fields.phone")} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={status === "submitting"}
                    placeholder={t("requestModal.placeholders.phone")}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-[#8f7b49]/30 focus:border-[#8f7b49]"
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("requestModal.fields.email")} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={status === "submitting"}
                    placeholder={t("requestModal.placeholders.email")}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.email
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-[#8f7b49]/30 focus:border-[#8f7b49]"
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Telegram */}
                <div>
                  <label
                    htmlFor="telegram"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("requestModal.fields.telegram")}
                  </label>
                  <input
                    type="text"
                    id="telegram"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                    disabled={status === "submitting"}
                    placeholder={t("requestModal.placeholders.telegram")}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                      errors.telegram
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-[#8f7b49]/30 focus:border-[#8f7b49]"
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  />
                  {errors.telegram && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.telegram}
                    </p>
                  )}
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline-block mr-1 -mt-0.5" />
                    {t("requestModal.fields.dates")}
                  </label>
                  <div
                    className={
                      status === "submitting"
                        ? "pointer-events-none opacity-60"
                        : undefined
                    }
                  >
                    <DateRangePicker
                      value={dateRange}
                      onChange={handleDateRangeChange}
                      numberOfMonths={1}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl transition-colors hover:border-[#8f7b49]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("requestModal.fields.message")} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={status === "submitting"}
                    placeholder={t("requestModal.placeholders.message")}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-colors resize-none ${
                      errors.message
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-[#8f7b49]/30 focus:border-[#8f7b49]"
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {status === "error" && serverMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{serverMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-[#8f7b49] hover:bg-[#7a6939] transition-colors rounded-xl px-6 py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                  <span
                    className="text-white text-base font-semibold"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {status === "submitting"
                      ? t("requestModal.submitting")
                      : t("requestModal.submit")}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestProgramModal;
