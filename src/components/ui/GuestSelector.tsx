import React, { useState } from "react";
import { Users, Minus, Plus, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Popover } from "./Popover";
import { useLanguage } from "../../contexts/LanguageContext";

interface GuestSelectorProps {
  adults: number;
  childrenAges: number[];
  onAdultsChange: (count: number) => void;
  onChildrenChange: (ages: number[]) => void;
  label?: string;
  className?: string;
  maxGuests?: number;
  minAdults?: number;
  maxChildren?: number;
}

/**
 * GuestSelector Component
 *
 * Features:
 * - Adults counter (min 1, max dynamic based on total)
 * - Children stored as array of ages
 * - Dynamic age selectors for each child
 * - Max 9 total guests enforced
 * - High-elevation popover styling
 */
export function GuestSelector({
  adults,
  childrenAges,
  onAdultsChange,
  onChildrenChange,
  label,
  className,
  maxGuests = 9,
  minAdults = 1,
  maxChildren = 6,
}: GuestSelectorProps) {
  const { translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const totalGuests = adults + childrenAges.length;
  const canAddGuest = totalGuests < maxGuests;
  const canAddAdult = adults < maxGuests - childrenAges.length;
  const canRemoveAdult = adults > minAdults;
  const canAddChild = childrenAges.length < maxChildren && canAddGuest;
  const canRemoveChild = childrenAges.length > 0;

  // Handle adult count change
  const handleAdultChange = (delta: number) => {
    const newCount = adults + delta;
    if (newCount >= minAdults && newCount + childrenAges.length <= maxGuests) {
      onAdultsChange(newCount);
    }
  };

  // Handle child count change - manages the array
  const handleChildCountChange = (delta: number) => {
    if (delta > 0 && canAddChild) {
      // Add a new child with default age 0
      onChildrenChange([...childrenAges, 0]);
    } else if (delta < 0 && canRemoveChild) {
      // Remove the last child
      onChildrenChange(childrenAges.slice(0, -1));
    }
  };

  // Handle individual child age change
  const handleChildAgeChange = (index: number, age: number) => {
    const newAges = [...childrenAges];
    newAges[index] = age;
    onChildrenChange(newAges);
  };

  // Generate summary text
  const getSummaryText = () => {
    const parts = [];

    if (adults > 0) {
      const adultLabel =
        adults === 1
          ? translate({
              ru: "взрослый",
              uz: "katta",
              en: "adult",
              de: "Erwachsener",
            })
          : translate({ ru: "взр.", uz: "katta", en: "adults", de: "Erw." });
      parts.push(`${adults} ${adultLabel}`);
    }

    if (childrenAges.length > 0) {
      const childLabel =
        childrenAges.length === 1
          ? translate({ ru: "ребёнок", uz: "bola", en: "child", de: "Kind" })
          : translate({ ru: "дет.", uz: "bola", en: "children", de: "Kind." });
      parts.push(`${childrenAges.length} ${childLabel}`);
    }

    return (
      parts.join(" — ") ||
      translate({
        ru: "Выберите",
        uz: "Tanlang",
        en: "Select",
        de: "Wählen",
      })
    );
  };

  // Age options for children (0-17)
  const ageOptions = Array.from({ length: 18 }, (_, i) => i);

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      align="start"
      className="guest-selector-popover p-0 min-w-[320px]"
      trigger={
        <div className={cn("bg-white rounded-xl cursor-pointer", className)}>
          {label && (
            <label className="block text-[11px] text-gray-500 mb-0.5 ml-1 font-normal uppercase tracking-wide">
              {label}
            </label>
          )}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-[15px] font-medium text-gray-900 whitespace-nowrap">
                {getSummaryText()}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </div>
        </div>
      }
    >
      <div className="p-5">
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">
            {translate({
              ru: "Количество гостей",
              uz: "Mehmonlar soni",
              en: "Number of guests",
              de: "Anzahl der Gäste",
            })}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {translate({
              ru: `Максимум ${maxGuests} гостей`,
              uz: `Maksimum ${maxGuests} mehmon`,
              en: `Maximum ${maxGuests} guests`,
              de: `Maximal ${maxGuests} Gäste`,
            })}
          </p>
        </div>

        {/* Adults Row */}
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-[15px] font-medium text-gray-800">
              {translate({
                ru: "Взрослые",
                uz: "Kattalar",
                en: "Adults",
                de: "Erwachsene",
              })}
            </span>
            <p className="text-xs text-gray-500">
              {translate({
                ru: "18+ лет",
                uz: "18+ yosh",
                en: "18+ years",
                de: "18+ Jahre",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAdultChange(-1)}
              disabled={!canRemoveAdult}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                "border border-gray-200",
                canRemoveAdult
                  ? "bg-gray-50 hover:bg-[#8B7355] hover:text-white hover:border-[#8B7355] text-gray-700"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50",
              )}
              aria-label="Decrease adults"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-[17px] font-semibold w-8 text-center tabular-nums">
              {adults}
            </span>
            <button
              onClick={() => handleAdultChange(1)}
              disabled={!canAddAdult}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                "border border-gray-200",
                canAddAdult
                  ? "bg-gray-50 hover:bg-[#8B7355] hover:text-white hover:border-[#8B7355] text-gray-700"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50",
              )}
              aria-label="Increase adults"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children Row */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div>
            <span className="text-[15px] font-medium text-gray-800">
              {translate({
                ru: "Дети",
                uz: "Bolalar",
                en: "Children",
                de: "Kinder",
              })}
            </span>
            <p className="text-xs text-gray-500">
              {translate({
                ru: "0–17 лет",
                uz: "0–17 yosh",
                en: "0–17 years",
                de: "0–17 Jahre",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleChildCountChange(-1)}
              disabled={!canRemoveChild}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                "border border-gray-200",
                canRemoveChild
                  ? "bg-gray-50 hover:bg-[#8B7355] hover:text-white hover:border-[#8B7355] text-gray-700"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50",
              )}
              aria-label="Decrease children"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-[17px] font-semibold w-8 text-center tabular-nums">
              {childrenAges.length}
            </span>
            <button
              onClick={() => handleChildCountChange(1)}
              disabled={!canAddChild}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                "border border-gray-200",
                canAddChild
                  ? "bg-gray-50 hover:bg-[#8B7355] hover:text-white hover:border-[#8B7355] text-gray-700"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50",
              )}
              aria-label="Increase children"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children Age Selectors - Dynamic based on array length */}
        {childrenAges.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {translate({
                ru: "Возраст детей",
                uz: "Bolalar yoshi",
                en: "Children's ages",
                de: "Alter der Kinder",
              })}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {childrenAges.map((age, index) => (
                <div key={index} className="relative">
                  <label className="block text-xs text-gray-500 mb-1">
                    {translate({
                      ru: `Ребёнок ${index + 1}`,
                      uz: `Bola ${index + 1}`,
                      en: `Child ${index + 1}`,
                      de: `Kind ${index + 1}`,
                    })}
                  </label>
                  <select
                    value={age}
                    onChange={(e) =>
                      handleChildAgeChange(index, parseInt(e.target.value))
                    }
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border border-gray-200",
                      "text-sm font-medium text-gray-800",
                      "bg-white hover:border-[#8B7355] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355]",
                      "outline-none transition-all duration-200",
                      "appearance-none cursor-pointer",
                    )}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 8px center",
                      backgroundSize: "16px",
                      paddingRight: "32px",
                    }}
                  >
                    {ageOptions.map((ageOption) => (
                      <option key={ageOption} value={ageOption}>
                        {ageOption === 0
                          ? translate({
                              ru: "До 1 года",
                              uz: "1 yoshgacha",
                              en: "Under 1",
                              de: "Unter 1",
                            })
                          : `${ageOption} ${translate({ ru: "лет", uz: "yosh", en: "years", de: "Jahre" })}`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total summary */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {translate({
              ru: "Всего гостей:",
              uz: "Jami mehmonlar:",
              en: "Total guests:",
              de: "Gesamtgäste:",
            })}
          </span>
          <span className="text-lg font-bold text-[#8B7355]">
            {totalGuests}
          </span>
        </div>

        {/* Done button */}
        <button
          onClick={() => setIsOpen(false)}
          className="w-full mt-4 py-2.5 bg-[#8B7355] hover:bg-[#7A6349] text-white font-medium rounded-lg transition-colors duration-200"
        >
          {translate({ ru: "Готово", uz: "Tayyor", en: "Done", de: "Fertig" })}
        </button>
      </div>
    </Popover>
  );
}

export default GuestSelector;
