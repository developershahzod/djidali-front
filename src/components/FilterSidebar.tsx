import React, { useState } from "react";
import { ChevronDown, HelpCircle, Filter } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCategories } from "../hooks/useCategories";
import { FilterState } from "../types";

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
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

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
}) => {
  const { t, language } = useLanguage();
  const { categories, loading: categoriesLoading } = useCategories();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "duration",
    "price",
  ]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const FilterSection: React.FC<{
    id: string;
    title: string;
    children: React.ReactNode;
    helpIcon?: boolean;
  }> = ({ id, title, children, helpIcon = false }) => {
    const isExpanded = expandedSections.includes(id);

    return (
      <div className="border-b border-gray-100 mb-5 pb-5 last:border-0">
        <button
          onClick={() => toggleSection(id)}
          className="flex items-center justify-between w-full text-left mb-4 group hover:bg-emerald-50/50 p-2.5 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors text-sm">
              {title}
            </span>
            {helpIcon && <HelpCircle className="w-4 h-4 text-gray-400" />}
          </div>
          <div
            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          >
            <ChevronDown className="w-4 h-4 text-emerald-600" />
          </div>
        </button>
        {isExpanded && <div className="animate-fade-in">{children}</div>}
      </div>
    );
  };

  // Wishlist state removed - feature moved to separate WishlistPage

  return (
    <div className="w-full lg:w-80 bg-white lg:border-r border-gray-100 lg:min-h-screen overflow-y-auto p-4 lg:p-6 shadow-sm lg:sticky lg:top-0 rounded-xl lg:rounded-none mb-6 lg:mb-0">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {t("common.filter")}
          </h2>
        </div>
        <button
          onClick={() =>
            onFiltersChange({
              category: "all",
              priceRange: [0, 1000000],
              duration: [1, 30],
              rating: 0,
            })
          }
          className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
        >
          Tozalash
        </button>
      </div>

      {/* Category Filter */}
      <FilterSection id="category" title={t("filters.category")}>
        <div className="space-y-3">
          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({ category: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            disabled={categoriesLoading}
          >
            <option value="all">{t("filters.allCategories")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {getLocalizedText(category.name, language)}
              </option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* Duration Filter */}
      <FilterSection id="duration" title={t("filters.durationFilter")}>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="bg-emerald-50 px-3 py-1 rounded-full font-medium text-emerald-700">
              {filters.duration[0]} {t("filters.days")}
            </span>
            <span className="text-gray-400">—</span>
            <span className="bg-emerald-50 px-3 py-1 rounded-full font-medium text-emerald-700">
              {filters.duration[1]} {t("filters.days")}
            </span>
          </div>
          <div className="relative px-3 py-2">
            <input
              type="range"
              min="1"
              max="30"
              value={filters.duration[0]}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                onFiltersChange({
                  duration: [
                    parseInt(target.value),
                    Math.max(parseInt(target.value), filters.duration[1]),
                  ],
                });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
              style={{
                background: `linear-gradient(to right, rgb(143, 123, 73) 0%, rgb(143, 123, 73) ${((filters.duration[0] - 1) / 29) * 100}%, rgb(229, 231, 235) ${((filters.duration[0] - 1) / 29) * 100}%, rgb(229, 231, 235) 100%)`,
              }}
            />
          </div>
          <div className="relative px-3 py-2">
            <label className="block text-xs text-gray-500 mb-1">
              {t("filters.maxDuration")}
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={filters.duration[1]}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                onFiltersChange({
                  duration: [
                    Math.min(filters.duration[0], parseInt(target.value)),
                    parseInt(target.value),
                  ],
                });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
              style={{
                background: `linear-gradient(to right, rgb(229, 231, 235) 0%, rgb(229, 231, 235) ${((filters.duration[1] - 1) / 29) * 100}%, rgb(143, 123, 73) ${((filters.duration[1] - 1) / 29) * 100}%, rgb(143, 123, 73) 100%)`,
              }}
            />
          </div>
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection id="price" title={t("filters.priceFilter")}>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="bg-emerald-50 px-3 py-1 rounded-full font-medium text-emerald-700">
              {filters.priceRange[0].toLocaleString()} {t("filters.som")}
            </span>
            <span className="text-gray-400">—</span>
            <span className="bg-emerald-50 px-3 py-1 rounded-full font-medium text-emerald-700">
              {filters.priceRange[1].toLocaleString()} {t("filters.som")}
            </span>
          </div>
          <div className="relative px-3 py-2">
            <input
              type="range"
              min="8000"
              max="90000"
              step="1000"
              value={filters.priceRange[0]}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                onFiltersChange({
                  priceRange: [
                    parseInt(target.value),
                    Math.max(parseInt(target.value), filters.priceRange[1]),
                  ],
                });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
              style={{
                background: `linear-gradient(to right, rgb(143, 123, 73) 0%, rgb(143, 123, 73) ${((filters.priceRange[0] - 8000) / 82000) * 100}%, rgb(229, 231, 235) ${((filters.priceRange[0] - 8000) / 82000) * 100}%, rgb(229, 231, 235) 100%)`,
              }}
            />
          </div>
          <div className="relative px-3 py-2">
            <label className="block text-xs text-gray-500 mb-1">
              {t("filters.maxPrice")}
            </label>
            <input
              type="range"
              min="8000"
              max="90000"
              step="1000"
              value={filters.priceRange[1]}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                onFiltersChange({
                  priceRange: [
                    Math.min(filters.priceRange[0], parseInt(target.value)),
                    parseInt(target.value),
                  ],
                });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
              style={{
                background: `linear-gradient(to right, rgb(229, 231, 235) 0%, rgb(229, 231, 235) ${((filters.priceRange[1] - 8000) / 82000) * 100}%, rgb(143, 123, 73) ${((filters.priceRange[1] - 8000) / 82000) * 100}%, rgb(143, 123, 73) 100%)`,
              }}
            />
          </div>
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection id="rating" title={t("filters.ratingFilter")}>
        <div className="space-y-4">
          <div className="text-center">
            <span className="bg-amber-50 px-4 py-2 rounded-full font-medium text-amber-700">
              {filters.rating === 0
                ? t("filters.allRatings")
                : `${filters.rating}+ ${t("filters.stars")}`}
            </span>
          </div>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.rating}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                onFiltersChange({ rating: parseFloat(target.value) });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>2.5</span>
            <span>5</span>
          </div>
        </div>
      </FilterSection>

      {/* Special Offers */}
      <FilterSection id="offers" title={t("filters.specialOffers")}>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={filters.discountOnly}
              onChange={(e) =>
                onFiltersChange({ discountOnly: e.target.checked })
              }
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-medium text-red-700">
              {t("filters.discountOnly")}
            </span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={filters.guaranteedOnly}
              onChange={(e) =>
                onFiltersChange({ guaranteedOnly: e.target.checked })
              }
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm font-medium text-green-700">
              {t("filters.guaranteedOnly")}
            </span>
          </label>
        </div>
      </FilterSection>

      {/* Language Filter */}
      <FilterSection id="language" title={t("filters.language")}>
        <div className="space-y-2">
          {[
            { id: "uzbek", name: t("filters.uzbek") },
            { id: "russian", name: t("filters.russian") },
            { id: "english", name: t("filters.english") },
            { id: "turkish", name: t("filters.turkish") },
          ].map((lang) => (
            <label
              key={lang.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.language.includes(lang.id)}
                onChange={(e) => {
                  const newLanguages = e.target.checked
                    ? [...filters.language, lang.id]
                    : filters.language.filter((l) => l !== lang.id);
                  onFiltersChange({ language: newLanguages });
                }}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">{lang.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Clear Filters */}
      <button
        onClick={() =>
          onFiltersChange({
            category: "all",
            subcategory: "all",
            priceRange: [0, 1000000],
            duration: [1, 30],
            rating: 0,
            language: ["russian"],
            discountOnly: false,
            guaranteedOnly: false,
          })
        }
        className="w-full mt-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow"
      >
        {t("filters.clearFilters")}
      </button>
    </div>
  );
};

export default FilterSidebar;
