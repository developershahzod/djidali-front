import React, { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ru, uz, enUS, de } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Popover } from "./Popover";
import { useLanguage } from "../../contexts/LanguageContext";
import "./DateRangePicker.css";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  minDate?: Date;
  numberOfMonths?: number;
}

const localeMap = {
  ru: ru,
  uz: uz,
  en: enUS,
  de: de,
};

/**
 * Modern DateRangePicker with booking.com-style UX
 * Click once for start date, click again for end date
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder,
  label,
  className,
  minDate: _minDate = new Date(),
  numberOfMonths = 2,
}: DateRangePickerProps) {
  const { language, translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(value);

  useEffect(() => {
    setRange(value);
  }, [value]);

  const locale = localeMap[language as keyof typeof localeMap] || ru;

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);

    if (newRange?.from && newRange?.to) {
      onChange?.(newRange);
      setTimeout(() => setIsOpen(false), 200);
    }
  };

  const displayValue = () => {
    if (!range?.from) {
      return (
        placeholder ||
        translate({
          ru: "Выберите даты",
          uz: "Sanalarni tanlang",
          en: "Select dates",
          de: "Daten wählen",
        })
      );
    }

    const fromStr = format(range.from, "dd MMM", { locale });
    if (!range.to) {
      return fromStr;
    }
    const toStr = format(range.to, "dd MMM", { locale });
    return `${fromStr} — ${toStr}`;
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRange(undefined);
    onChange?.(undefined);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      align="start"
      className="date-picker-popover p-0 min-w-max overflow-visible"
      trigger={
        <div className={cn("bg-white rounded-xl cursor-pointer", className)}>
          {label && (
            <label className="block text-[11px] text-gray-500 mb-0.5 ml-1 font-normal uppercase tracking-wide">
              {label}
            </label>
          )}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span
                className={cn(
                  "text-[15px] font-medium whitespace-nowrap",
                  range?.from ? "text-gray-900" : "text-gray-400",
                )}
              >
                {displayValue()}
              </span>
            </div>
            {range?.from && (
              <button
                onClick={clearSelection}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
                aria-label="Clear dates"
              >
                <svg
                  className="w-3.5 h-3.5"
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
            )}
          </div>
        </div>
      }
    >
      <div className="p-5 px-8">
        {/* Instruction header */}
        <div className="mb-4 pb-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">
            {!range?.from
              ? translate({
                  ru: "Выберите дату заезда",
                  uz: "Kelish sanasini tanlang",
                  en: "Select check-in date",
                  de: "Anreisedatum wählen",
                })
              : !range?.to
                ? translate({
                    ru: "Теперь выберите дату выезда",
                    uz: "Endi ketish sanasini tanlang",
                    en: "Now select check-out date",
                    de: "Jetzt Abreisedatum wählen",
                  })
                : translate({
                    ru: "Даты выбраны",
                    uz: "Sanalar tanlandi",
                    en: "Dates selected",
                    de: "Daten ausgewählt",
                  })}
          </p>
          {range?.from && (
            <p className="text-xs text-gray-500 mt-1">
              {range.to
                ? `${format(range.from, "dd MMMM yyyy", { locale })} — ${format(range.to, "dd MMMM yyyy", { locale })}`
                : format(range.from, "dd MMMM yyyy", { locale })}
            </p>
          )}
        </div>

        {/* Calendar with padding for navigation buttons */}
        <div className="date-picker-calendar overflow-visible">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={numberOfMonths}
            locale={locale}
            disabled={{ before: new Date() }}
            showOutsideDays={false}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeft className="w-6 h-6" />
                ) : (
                  <ChevronRight className="w-6 h-6" />
                ),
            }}
          />
        </div>

        {/* Quick selection buttons */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
          <button
            onClick={() => {
              const today = new Date();
              const weekend = new Date(today);
              const dayOfWeek = today.getDay();
              const daysUntilSat = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
              weekend.setDate(today.getDate() + daysUntilSat);
              const sunday = new Date(weekend);
              sunday.setDate(weekend.getDate() + 1);
              handleSelect({ from: weekend, to: sunday });
            }}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-[#8B7355] hover:text-white text-gray-700 transition-all duration-200 font-medium"
          >
            {translate({
              ru: "Выходные",
              uz: "Dam olish",
              en: "Weekend",
              de: "Wochenende",
            })}
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const nextWeek = new Date(today);
              nextWeek.setDate(today.getDate() + 7);
              handleSelect({ from: today, to: nextWeek });
            }}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-[#8B7355] hover:text-white text-gray-700 transition-all duration-200 font-medium"
          >
            {translate({ ru: "Неделя", uz: "Hafta", en: "Week", de: "Woche" })}
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const twoWeeks = new Date(today);
              twoWeeks.setDate(today.getDate() + 14);
              handleSelect({ from: today, to: twoWeeks });
            }}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-[#8B7355] hover:text-white text-gray-700 transition-all duration-200 font-medium"
          >
            {translate({
              ru: "2 недели",
              uz: "2 hafta",
              en: "2 Weeks",
              de: "2 Wochen",
            })}
          </button>
          {range?.from && (
            <button
              onClick={clearSelection}
              className="text-xs px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 font-medium ml-auto"
            >
              {translate({
                ru: "Сбросить",
                uz: "Tozalash",
                en: "Clear",
                de: "Löschen",
              })}
            </button>
          )}
        </div>
      </div>
    </Popover>
  );
}

export default DateRangePicker;
