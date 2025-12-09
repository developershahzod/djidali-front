import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { djidaliApi, ApiCategory } from "../services/djidaliApi";

interface CategoryDropdownProps {
  onCategorySelect?: (categoryId: string, subcategoryId?: string) => void;
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

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  onCategorySelect,
}) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await djidaliApi.getCategoryTree();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleCategoryClick = (
    category: ApiCategory,
    subcategory?: ApiCategory,
  ) => {
    if (onCategorySelect) {
      onCategorySelect(category.id, subcategory?.id);
    } else {
      const targetCategory = subcategory || category;
      navigate(`/category/${targetCategory.slug}`);
    }
    setIsOpen(false);
    setActiveCategory(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-700 hover:text-green-600 cursor-pointer font-medium transition-colors"
      >
        <span>{t("nav.categories")}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="p-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  {t("nav.allCategories")}
                </button>

                {categories.map((category) => (
                  <div key={category.id} className="relative">
                    <button
                      onClick={() => {
                        if (category.children && category.children.length > 0) {
                          setActiveCategory(
                            activeCategory === category.id ? null : category.id,
                          );
                        } else {
                          handleCategoryClick(category);
                        }
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      <span className="flex items-center space-x-2">
                        {category.icon && <span>{category.icon}</span>}
                        <span>{getLocalizedText(category.name, language)}</span>
                      </span>
                      {category.children && category.children.length > 0 && (
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${activeCategory === category.id ? "rotate-90" : ""}`}
                        />
                      )}
                    </button>

                    {category.children &&
                      category.children.length > 0 &&
                      activeCategory === category.id && (
                        <div className="ml-4 mt-1 space-y-1 animate-fade-in">
                          <button
                            onClick={() => handleCategoryClick(category)}
                            className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded-md"
                          >
                            {t("filters.allCategories")}
                          </button>
                          {category.children.map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={() =>
                                handleCategoryClick(category, subcategory)
                              }
                              className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded-md"
                            >
                              {subcategory.icon && (
                                <span className="mr-1">{subcategory.icon}</span>
                              )}
                              {getLocalizedText(subcategory.name, language)}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
