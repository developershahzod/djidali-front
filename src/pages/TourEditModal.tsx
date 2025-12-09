import React, { useRef } from "react";
import { XCircle, Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { getImageUrl } from "../utils/imageUtils";

interface ItineraryStep {
  dayNumber: number;
  titleUz: string;
  titleRu: string;
  titleEng: string;
  titleDe: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEng: string;
  descriptionDe: string;
}

interface TourFormState {
  title: string;
  titleUz: string;
  titleRu: string;
  titleEng: string;
  titleDe: string;
  description: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEng: string;
  descriptionDe: string;
  destination: string;
  duration: number;
  price: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  images: string[];
  inclusions: { uz: string; ru: string; eng: string; de: string }[];
  exclusions: { uz: string; ru: string; eng: string; de: string }[];
  itinerary: ItineraryStep[];
  currency: string;
  status: "ACTIVE" | "INACTIVE" | "CANCELLED" | "COMPLETED" | "FULLY_BOOKED";
  categoryId: string;
}

interface ApiCategory {
  id: string;
  name: string | { [key: string]: string };
  [key: string]: any;
}

interface TourEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTour: any | null;
  tourFormData: TourFormState;
  setTourFormData: React.Dispatch<React.SetStateAction<TourFormState>>;
  handleCreateTour: () => void;
  handleUpdateTour: () => void;
  categories: ApiCategory[];
  t: (key: string) => string;
  getTranslated: (
    text: string | { [key: string]: string } | undefined,
  ) => string;
  activeLangTab: "uz" | "ru" | "eng" | "de";
  setActiveLangTab: (lang: "uz" | "ru" | "eng" | "de") => void;
  handleImageUpload: (files: FileList | null) => void;
  isUploading: boolean;
  previewImages: string[];
  removeImage: (index: number) => void;
  addArrayField: (field: "inclusions" | "exclusions") => void;
  updateArrayField: (
    field: "inclusions" | "exclusions",
    index: number,
    lang: "uz" | "ru" | "eng" | "de",
    value: string,
  ) => void;
  removeArrayField: (field: "inclusions" | "exclusions", index: number) => void;
  addItineraryStep: () => void;
  updateItineraryStep: (
    index: number,
    field: keyof ItineraryStep,
    value: string,
  ) => void;
  removeItineraryStep: (index: number) => void;
}

const TourEditModal: React.FC<TourEditModalProps> = ({
  isOpen,
  onClose,
  editingTour,
  tourFormData,
  setTourFormData,
  handleCreateTour,
  handleUpdateTour,
  categories,
  t,
  getTranslated,
  activeLangTab,
  setActiveLangTab,
  handleImageUpload,
  isUploading,
  previewImages,
  removeImage,
  addArrayField,
  updateArrayField,
  removeArrayField,
  addItineraryStep,
  updateItineraryStep,
  removeItineraryStep,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg max-w-4xl w-full max-h-[95vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold">
            {editingTour ? t("admin.modal.editTour") : t("admin.modal.addTour")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Core Information Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
              Core Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.form.name")} *
                </label>
                <input
                  type="text"
                  value={tourFormData.title}
                  onChange={(e) =>
                    setTourFormData({ ...tourFormData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.form.description")} *
                </label>
                <textarea
                  value={tourFormData.description}
                  onChange={(e) =>
                    setTourFormData({
                      ...tourFormData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Translations Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
              Translations
            </h4>

            {/* Language Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {(["uz", "ru", "eng", "de"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLangTab(lang)}
                    className={`${
                      activeLangTab === lang
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm uppercase`}
                  >
                    {lang}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="pt-6">
              {(["uz", "ru", "eng", "de"] as const).map((lang) => (
                <div
                  key={lang}
                  className={activeLangTab === lang ? "block" : "hidden"}
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title ({lang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={
                          tourFormData[
                            `title${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof TourFormState
                          ] as string
                        }
                        onChange={(e) =>
                          setTourFormData({
                            ...tourFormData,
                            [`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`]:
                              e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder={`Title in ${lang.toUpperCase()}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description ({lang.toUpperCase()})
                      </label>
                      <textarea
                        value={
                          tourFormData[
                            `description${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof TourFormState
                          ] as string
                        }
                        onChange={(e) =>
                          setTourFormData({
                            ...tourFormData,
                            [`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`]:
                              e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder={`Description in ${lang.toUpperCase()}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduling & Pricing Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
              Scheduling & Pricing
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.form.destination")} *
                </label>
                <input
                  type="text"
                  value={tourFormData.destination}
                  onChange={(e) =>
                    setTourFormData({
                      ...tourFormData,
                      destination: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.form.category")} *
                </label>
                <select
                  value={tourFormData.categoryId}
                  onChange={(e) =>
                    setTourFormData({
                      ...tourFormData,
                      categoryId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">{t("admin.form.selectCategory")}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {getTranslated(category.name)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.form.duration")} *
                </label>
                <input
                  type="number"
                  value={tourFormData.duration}
                  onChange={(e) =>
                    setTourFormData({
                      ...tourFormData,
                      duration: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.form.maxParticipants")} *
                </label>
                <input
                  type="number"
                  value={tourFormData.maxParticipants}
                  onChange={(e) =>
                    setTourFormData({
                      ...tourFormData,
                      maxParticipants: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("admin.form.price")} *
                  </label>
                  <input
                    type="number"
                    value={tourFormData.price}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setTourFormData({
                        ...tourFormData,
                        price: Math.max(1000, value).toString(),
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    min="1000"
                    step="1000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency *
                  </label>
                  <select
                    value={tourFormData.currency}
                    onChange={(e) =>
                      setTourFormData({
                        ...tourFormData,
                        currency: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="UZS">UZS</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.form.status")}
                </label>
                <select
                  value={tourFormData.status}
                  onChange={(e) =>
                    setTourFormData({
                      ...tourFormData,
                      status: e.target.value as TourFormState["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="FULLY_BOOKED">FULLY_BOOKED</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.form.startDate")} *
                </label>
                <input
                  type="date"
                  value={tourFormData.startDate}
                  onChange={(e) =>
                    setTourFormData({
                      ...tourFormData,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.form.endDate")} *
                </label>
                <input
                  type="date"
                  value={tourFormData.endDate}
                  onChange={(e) =>
                    setTourFormData({
                      ...tourFormData,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
              Media
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("admin.form.images")}
                </label>
                <div
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleImageUpload(e.dataTransfer.files);
                  }}
                >
                  <div className="text-center">
                    <ImageIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={(e) => handleImageUpload(e.target.files)}
                          ref={fileInputRef}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 2MB
                    </p>
                    {isUploading && (
                      <span className="text-xs text-emerald-600 animate-pulse">
                        {t("admin.form.uploading") || "Uploading..."}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {(tourFormData.images.length > 0 || previewImages.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[
                    ...tourFormData.images,
                    ...previewImages.slice(tourFormData.images.length),
                  ].map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative border rounded-lg overflow-hidden group aspect-square"
                    >
                      <img
                        src={getImageUrl(image)}
                        src={image}
                        alt={`tour-image-${index}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://via.placeholder.com/150";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-red-600 hover:text-red-700 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        title={t("admin.form.removeImage") || "Remove image"}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tour Content Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
              Tour Content
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("admin.form.included")}
                </label>
                {tourFormData.inclusions.map((inclusion, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 mb-2 relative"
                  >
                    <input
                      type="text"
                      value={inclusion[activeLangTab]}
                      onChange={(e) =>
                        updateArrayField(
                          "inclusions",
                          index,
                          activeLangTab,
                          e.target.value,
                        )
                      }
                      placeholder={t("admin.form.includedPlaceholder")}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {tourFormData.inclusions.length > 1 && (
                      <button
                        onClick={() => removeArrayField("inclusions", index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("inclusions")}
                  className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center space-x-1 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("admin.form.add")}</span>
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("admin.form.excluded")}
                </label>
                {tourFormData.exclusions.map((exclusion, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 mb-2 relative"
                  >
                    <input
                      type="text"
                      value={exclusion[activeLangTab]}
                      onChange={(e) =>
                        updateArrayField(
                          "exclusions",
                          index,
                          activeLangTab,
                          e.target.value,
                        )
                      }
                      placeholder={t("admin.form.excludedPlaceholder")}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {tourFormData.exclusions.length > 1 && (
                      <button
                        onClick={() => removeArrayField("exclusions", index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("exclusions")}
                  className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center space-x-1 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("admin.form.add")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Itinerary Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
              Itinerary
            </h4>
            <div className="space-y-4">
              {tourFormData.itinerary.map((step, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50/50"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100/60 px-4 py-2">
                    <span className="text-sm font-medium text-gray-700">
                      Day {index + 1}
                    </span>
                    {tourFormData.itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryStep(index)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove Day"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Title ({activeLangTab.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={
                          step[
                            `title${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}` as keyof ItineraryStep
                          ] as string
                        }
                        onChange={(e) =>
                          updateItineraryStep(
                            index,
                            `title${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}` as keyof ItineraryStep,
                            e.target.value,
                          )
                        }
                        placeholder={`Day ${index + 1} title`}
                        className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Description ({activeLangTab.toUpperCase()})
                      </label>
                      <textarea
                        value={
                          step[
                            `description${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}` as keyof ItineraryStep
                          ] as string
                        }
                        onChange={(e) =>
                          updateItineraryStep(
                            index,
                            `description${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}` as keyof ItineraryStep,
                            e.target.value,
                          )
                        }
                        rows={3}
                        placeholder="Describe activities for this day..."
                        className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItineraryStep}
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Day</span>
            </button>
          </div>
        </div>
        <div className="sticky bottom-0 bg-gray-100 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            {t("admin.form.cancel")}
          </button>
          <button
            type="button"
            onClick={editingTour ? handleUpdateTour : handleCreateTour}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            {editingTour ? t("admin.form.update") : t("admin.form.add")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourEditModal;
