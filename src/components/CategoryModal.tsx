import React, { useState } from "react";
import { X, FolderTree } from "lucide-react";
import { ApiCategory } from "../services/djidaliApi";
import { getTranslatedText } from "../utils/translation";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ApiCategory[];
  editingCategory: ApiCategory | null;
  newCategory: {
    name: string;
    slug: string;
    description: string;
    nameUz: string;
    nameRu: string;
    nameEng: string;
    nameDe: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEng: string;
    descriptionDe: string;
    icon: string;
    parentId: string;
    sortOrder: number;
    isActive: boolean;
  };
  handleCategoryInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmitCategory: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  editingCategory,
  newCategory,
  handleCategoryInputChange,
  handleSubmitCategory,
}) => {
  // Hooks must be called before any early returns
  const [activeLangTab, setActiveLangTab] = useState<
    "uz" | "ru" | "eng" | "de"
  >("uz");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg max-w-3xl w-full max-h-[95vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FolderTree className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-bold">
              {editingCategory
                ? "Kategoriyani tahrirlash"
                : "Yangi kategoriya qo'shish"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Yopish"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmitCategory} className="overflow-y-auto">
          <div className="p-6 space-y-6 bg-gray-50/50">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
                Asosiy ma'lumot
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomi (Asosiy) *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleCategoryInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Kategoriya nomi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={newCategory.slug}
                    onChange={handleCategoryInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="kategoriya-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Bo'sh qoldirilsa, avtomatik yaratiladi
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tavsif (Asosiy)
                  </label>
                  <textarea
                    name="description"
                    value={newCategory.description}
                    onChange={handleCategoryInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Kategoriya haqida qisqacha ma'lumot"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
                Tarjimalar
              </h4>
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  {(["uz", "ru", "eng", "de"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLangTab(lang)}
                      className={`${activeLangTab === lang ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm uppercase`}
                    >
                      {lang}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="pt-6">
                {(["uz", "ru", "eng", "de"] as const).map((lang) => (
                  <div
                    key={lang}
                    className={activeLangTab === lang ? "block" : "hidden"}
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nomi ({lang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          name={`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`}
                          value={
                            newCategory[
                              `name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof typeof newCategory
                            ]
                          }
                          onChange={handleCategoryInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder={`Nomi (${lang.toUpperCase()})`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tavsif ({lang.toUpperCase()})
                        </label>
                        <textarea
                          name={`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`}
                          value={
                            newCategory[
                              `description${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof typeof newCategory
                            ]
                          }
                          onChange={handleCategoryInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder={`Tavsif (${lang.toUpperCase()})`}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
                Qo'shimcha sozlamalar
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ota kategoriya
                  </label>
                  <select
                    name="parentId"
                    value={newCategory.parentId}
                    onChange={handleCategoryInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Asosiy kategoriya</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon ? `${cat.icon} ` : ""}
                        {typeof cat.name === "string"
                          ? cat.name
                          : getTranslatedText(cat.name as any)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={newCategory.icon}
                    onChange={handleCategoryInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="🏔️"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tartib raqami
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={newCategory.sortOrder}
                    onChange={handleCategoryInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="inline-flex items-center space-x-3 text-sm font-medium text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={newCategory.isActive}
                      onChange={handleCategoryInputChange}
                      className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Faol kategoriya</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-100 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {editingCategory ? "Yangilash" : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
