import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, Grid2x2 as Grid, List } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCategoryBySlug } from "../hooks/useCategories";
import { useTours } from "../hooks/useTours";
import TourCard from "./TourCard";
import FilterSidebar from "./FilterSidebar";
import { FilterState } from "../types";

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

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const { category, loading: categoryLoading } = useCategoryBySlug(
    categorySlug || null,
  );

  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    subcategory: "all",
    priceRange: [0, 1000],
    duration: [1, 30],
    rating: 0,
    language: ["russian"],
    discountOnly: false,
    guaranteedOnly: false,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { tours, loading: toursLoading } = useTours({
    category_id: category?.id ? parseInt(category.id) : undefined,
    min_price: filters.priceRange[0],
    max_price: filters.priceRange[1],
    duration: filters.duration[0],
    per_page: 50,
  });

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Kategoriya topilmadi
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Orqaga</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getLocalizedText(category.name, language)}
              </h1>
              {category.description && (
                <p className="text-gray-600 mt-2">
                  {getLocalizedText(category.description, language)}
                </p>
              )}
              <p className="text-gray-600 mt-2">
                {tours.length} ta tur topildi
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg"
              >
                <Filter className="w-4 h-4" />
                <span>Filtrlar</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <FilterSidebar
            filters={filters}
            onFiltersChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
          />
        </div>

        <div className="flex-1 p-6">
          {toursLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>

              {tours.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">
                    Turlar topilmadi
                  </div>
                  <div className="text-gray-400 text-sm">
                    Boshqa kategoriyani sinab ko'ring
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
