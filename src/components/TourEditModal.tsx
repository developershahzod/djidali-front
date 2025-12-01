
import React, { useEffect, useState, useRef } from 'react';
import { XCircle, Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import { djidaliApi, ApiCategory, ApiTour } from '../services/djidaliApi';
import { getImageUrl } from '../utils/imageUtils';

// Type definitions copied from AdminDashboard
interface ExtendedApiTour {
  id: string;
  title: string | { [key: string]: string };
  description?: string | { [key: string]: string };
  destination?: string;
  duration?: number;
  price?: number | { amount: number; currency: string };
  status?: string;
  images?: string[];
  category?: {
    id: string;
    name: string | { [key: string]: string };
  };
  _count?: {
    orders: number;
  };
}

type ItineraryStep = {
  dayNumber: number;
  titleUz: string;
  titleRu: string;
  titleEng: string;
  titleDe: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEng: string;
  descriptionDe: string;
};

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
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'COMPLETED' | 'FULLY_BOOKED';
  categoryId: string;
}

interface TourEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTour: ExtendedApiTour | null;
  categories: ApiCategory[];
  onSave: (data: any, tourId?: string) => void;
  t: (key: string) => string;
}

const TourEditModal: React.FC<TourEditModalProps> = ({
  isOpen,
  onClose,
  editingTour,
  categories,
  onSave,
  t,
}) => {
  const [tourFormData, setTourFormData] = useState<TourFormState>({
    title: '',
    titleUz: '',
    titleRu: '',
    titleEng: '',
    titleDe: '',
    description: '',
    descriptionUz: '',
    descriptionRu: '',
    descriptionEng: '',
    descriptionDe: '',
    destination: '',
    duration: 1,
    price: '250',
    maxParticipants: 10,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    images: [],
    inclusions: [{ uz: '', ru: '', eng: '', de: '' }],
    exclusions: [{ uz: '', ru: '', eng: '', de: '' }],
    itinerary: [{ dayNumber: 1, titleUz: '', titleRu: '', titleEng: '', titleDe: '', descriptionUz: '', descriptionRu: '', descriptionEng: '', descriptionDe: '' }],
    currency: 'UZS',
    status: 'ACTIVE',
    categoryId: '',
  });

  const [activeLangTab, setActiveLangTab] = useState<'uz' | 'ru' | 'eng' | 'de'>('uz');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const MAX_FILE_SIZE_MB = 2;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const getTranslatedField = (obj: any, fieldName: string, lang: 'uz' | 'ru' | 'eng' | 'de'): string => {
    if (!obj) return '';
    const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
    const directFieldKey = `${fieldName}${capitalizedLang}`;
    if (obj[directFieldKey] !== undefined && obj[directFieldKey] !== null) {
      return String(obj[directFieldKey]);
    }
    if (typeof obj[fieldName] === 'object' && obj[fieldName] !== null && !Array.isArray(obj[fieldName])) {
      if (obj[fieldName][lang] !== undefined && obj[fieldName][lang] !== null) {
        return String(obj[fieldName][lang]);
      }
    }
    if (fieldName === '' && typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      if (obj[lang] !== undefined && obj[lang] !== null) {
        return String(obj[lang]);
      }
    }
    if ((fieldName === 'title' || fieldName === 'description') && typeof obj[fieldName] === 'string') {
        return obj[fieldName];
    }
    return '';
  };

  const extractPrice = (price: any): number => {
    if (typeof price === 'object' && price?.amount) {
      return Number(price.amount);
    }
    if (typeof price === 'number') {
      return price;
    }
    return 0;
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    try {
      // Handles both ISO strings and other parsable date formats
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    const openEditModal = async (tourSummary: ExtendedApiTour) => {
        let tour: ApiTour;
        try {
          tour = await djidaliApi.getTour(tourSummary.id);
        } catch (error) {
          console.error("Failed to fetch full tour details for editing:", error);
          alert("Could not load tour details for editing. Please try again.");
          onClose();
          return;
        }

        const program = (tour as any).program || (tour as any).programDays || [];
        const itinerarySteps: ItineraryStep[] = [];

        if (Array.isArray(program) && program.length > 0) {
          program.forEach((item: any, index: number) => {
            const stepTitleUz = getTranslatedField(item, 'title', 'uz');
            const stepTitleRu = getTranslatedField(item, 'title', 'ru');
            const stepTitleEng = getTranslatedField(item, 'title', 'eng');
            const stepTitleDe = getTranslatedField(item, 'title', 'de');
            const anyStepTitle = stepTitleRu || stepTitleEng || stepTitleUz || stepTitleDe;

            const stepDescUz = getTranslatedField(item, 'description', 'uz');
            const stepDescRu = getTranslatedField(item, 'description', 'ru');
            const stepDescEng = getTranslatedField(item, 'description', 'eng');
            const stepDescDe = getTranslatedField(item, 'description', 'de');
            const anyStepDesc = stepDescRu || stepDescEng || stepDescUz || stepDescDe;

            itinerarySteps.push({
              dayNumber: item.dayNumber ?? index + 1,
              titleUz: stepTitleUz || anyStepTitle,
              titleRu: stepTitleRu || anyStepTitle,
              titleEng: stepTitleEng || anyStepTitle,
              titleDe: stepTitleDe || anyStepTitle,
              descriptionUz: stepDescUz || anyStepDesc,
              descriptionRu: stepDescRu || anyStepDesc,
              descriptionEng: stepDescEng || anyStepDesc,
              descriptionDe: stepDescDe || anyStepDesc,
            });
          });
        }

        const parseMultilingualArray = (arr: any[] | undefined) => {
          if (!Array.isArray(arr) || arr.length === 0) {
            return [{ uz: '', ru: '', eng: '', de: '' }];
          }
          return arr.map(item => {
            if (typeof item === 'string') return { uz: item, ru: item, eng: item, de: item };
            return {
              uz: item.uz || item.name_uz || '',
              ru: item.ru || item.name_ru || item.name || '',
              eng: item.eng || item.name_en || '',
              de: item.de || item.name_de || '',
            };
          });
        }

        if (itinerarySteps.length === 0) {
          itinerarySteps.push({ dayNumber: 1, titleUz: '', titleRu: '', titleEng: '', titleDe: '', descriptionUz: '', descriptionRu: '', descriptionEng: '', descriptionDe: '' });
        }

        const categoryData = (tour as any).category;

        const titleUz = getTranslatedField(tour, 'title', 'uz');
        const titleRu = getTranslatedField(tour, 'title', 'ru');
        const titleEng = getTranslatedField(tour, 'title', 'eng');
        const titleDe = getTranslatedField(tour, 'title', 'de');
        const anyTitle = titleRu || titleEng || titleUz || titleDe;

        const descriptionUz = getTranslatedField(tour, 'description', 'uz');
        const descriptionRu = getTranslatedField(tour, 'description', 'ru');
        const descriptionEng = getTranslatedField(tour, 'description', 'eng');
        const descriptionDe = getTranslatedField(tour, 'description', 'de');
        const anyDescription = descriptionRu || descriptionEng || descriptionUz || descriptionDe;

        setTourFormData({
          title: anyTitle,
          titleUz: titleUz || anyTitle,
          titleRu: titleRu || anyTitle,
          titleEng: titleEng || anyTitle,
          titleDe: titleDe || anyTitle,
          description: anyDescription,
          descriptionUz: descriptionUz || anyDescription,
          descriptionRu: descriptionRu || anyDescription,
          descriptionEng: descriptionEng || anyDescription,
          descriptionDe: descriptionDe || anyDescription,
          destination: tour.destination || '',
          duration: tour.duration || 1,
          price: extractPrice(tour.price).toString(),
          maxParticipants: tour.maxParticipants || (tour as any).max_participants || 10,
          startDate: formatDateForInput(tour.startDate),
          endDate: formatDateForInput(tour.endDate),
          images: tour.images?.filter(Boolean) ?? [],
          inclusions: parseMultilingualArray(tour.inclusions),
          exclusions: parseMultilingualArray(tour.exclusions),
          itinerary: itinerarySteps,
          currency: (tour as any).currency || 'UZS',
          status: tour.status || 'ACTIVE',
          categoryId: (tour as any).categoryId || (categoryData && categoryData.id ? String(categoryData.id) : ''),
        });

        setUploadedImages([]);
        setPreviewImages([]);
    }

    if (editingTour) {
      openEditModal(editingTour);
    } else {
      resetTourForm();
    }
  }, [editingTour, onClose]);

  const resetTourForm = () => {
    setTourFormData({
        title: '',
        titleUz: '',
        titleRu: '',
        titleEng: '',
        titleDe: '',
        description: '',
        descriptionUz: '',
        descriptionRu: '',
        descriptionEng: '',
        descriptionDe: '',
        destination: '',
        duration: 1,
        price: '250',
        maxParticipants: 10,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        images: [],
        inclusions: [{ uz: '', ru: '', eng: '', de: '' }],
        exclusions: [{ uz: '', ru: '', eng: '', de: '' }],
        itinerary: [
          {
            dayNumber: 1,
            titleUz: '',
            titleRu: '',
            titleEng: '',
            titleDe: '',
            descriptionUz: '',
            descriptionRu: '',
            descriptionEng: '',
            descriptionDe: '',
          },
        ],
        currency: 'UZS',
        status: 'ACTIVE',
        categoryId: '',
      });
      setUploadedImages([]);
      setPreviewImages([]);
      setActiveLangTab('uz');
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE_BYTES);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      alert(`The following files exceed the maximum size of ${MAX_FILE_SIZE_MB}MB: ${fileNames}. Please choose smaller files.`);
      return;
    }

    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));

    setUploadedImages(prev => [...prev, ...selectedFiles]);
    setPreviewImages(prev => [...prev, ...previewUrls]);

    try {
      setIsUploading(true);
      const response = await djidaliApi.uploadImages(selectedFiles);
      const { urls } = response;

      if (urls.length > 0) {
        setTourFormData(prev => ({
          ...prev,
          images: [...prev.images, ...urls]
        }));
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Error: Failed to upload images.`);
      setUploadedImages(prev => prev.slice(0, -selectedFiles.length));
      setPreviewImages(prev => prev.slice(0, -selectedFiles.length));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = tourFormData.images[index];
    setTourFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    // Also remove from preview if it's there
    setPreviewImages(prev => prev.filter((p) => p !== imageToRemove));
  };

  const addArrayField = (field: 'inclusions' | 'exclusions') => {
    setTourFormData(prev => ({
      ...prev,
      [field]: [...prev[field], { uz: '', ru: '', eng: '', de: '' }]
    }));
  };

  const updateArrayField = (field: 'inclusions' | 'exclusions', index: number, lang: 'uz' | 'ru' | 'eng' | 'de', value: string) => {
    setTourFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? { ...item, [lang]: value } : item)
    }));
  };

  const removeArrayField = (field: 'inclusions' | 'exclusions', index: number) => {
    setTourFormData(prev => ({
      ...prev,
      [field]: prev[field].length > 1 ? prev[field].filter((_, i) => i !== index) : [{ uz: '', ru: '', eng: '', de: '' }]
    }));
  };

  const addItineraryStep = () => {
    setTourFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { dayNumber: prev.itinerary.length + 1, titleUz: '', titleRu: '', titleEng: '', titleDe: '', descriptionUz: '', descriptionRu: '', descriptionEng: '', descriptionDe: '' }]
    }));
  };

  const updateItineraryStep = (index: number, field: keyof ItineraryStep, value: string | number) => {
    setTourFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((step, i) => i === index ? { ...step, [field]: value } : step) as ItineraryStep[]
    }));
  };

  const removeItineraryStep = (index: number) => {
    setTourFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).length > 0
        ? prev.itinerary.filter((_, i) => i !== index)
        : [{ dayNumber: 1, titleUz: '', titleRu: '', titleEng: '', titleDe: '', descriptionUz: '', descriptionRu: '', descriptionEng: '', descriptionDe: '' }]
    }));
  };

  const handleSave = async () => {
    // Validation
    const priceValue = parseFloat(tourFormData.price);
    if (isNaN(priceValue) || priceValue < 0) {
      alert(t('admin.alerts.invalidPrice'));
      return;
    }
    if (!tourFormData.startDate || !tourFormData.endDate) {
      alert(t('admin.alerts.enterDates'));
      return;
    }
    const startDate = new Date(tourFormData.startDate);
    const endDate = new Date(tourFormData.endDate);
    if (endDate <= startDate) {
      alert(t('admin.alerts.endAfterStart'));
      return;
    }
    if (!tourFormData.categoryId) {
      alert(t('admin.alerts.selectCategory'));
      return;
    }

    const programPayload = tourFormData.itinerary.map((step, index) => ({
        dayNumber: index + 1,
        titleUz: step.titleUz,
        titleRu: step.titleRu,
        titleEng: step.titleEng,
        titleDe: step.titleDe,
        descriptionUz: step.descriptionUz,
        descriptionRu: step.descriptionRu,
        descriptionEng: step.descriptionEng,
        descriptionDe: step.descriptionDe,
      }));

    const itineraryPayload = tourFormData.itinerary.reduce((acc, step, index) => {
      const dayKey = `day${index + 1}`;
      acc[dayKey] = step.descriptionRu || step.descriptionEng || step.descriptionUz || 'No description';
      return acc;
    }, {} as Record<string, string>);

    const saveData = {
        ...tourFormData,
        price: priceValue,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        images: tourFormData.images.filter(img => img.trim()),
        inclusions: tourFormData.inclusions.filter(inc => inc.ru.trim()),
        exclusions: tourFormData.exclusions.filter(exc => exc.ru.trim()),
        itinerary: itineraryPayload,
        program: programPayload,
    };

    await onSave(saveData, editingTour?.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg max-w-4xl w-full max-h-[95vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold">{editingTour ? t('admin.modal.editTour') : t('admin.modal.addTour')}</h3>
          <button
            onClick={() => {
              resetTourForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Core Information Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Core Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.name')} *</label>
                <input
                  type="text"
                  value={tourFormData.title}
                  onChange={(e) => setTourFormData({ ...tourFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.description')} *</label>
                <textarea
                  value={tourFormData.description}
                  onChange={(e) => setTourFormData({ ...tourFormData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Translations Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Translations</h4>

            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {(['uz', 'ru', 'eng', 'de'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLangTab(lang)}
                    className={`${
                      activeLangTab === lang
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm uppercase`}
                  >
                    {lang}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-6">
              {(['uz', 'ru', 'eng', 'de'] as const).map((lang) => (
                <div key={lang} className={activeLangTab === lang ? 'block' : 'hidden'}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title ({lang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={tourFormData[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof TourFormState] as string}
                        onChange={(e) => setTourFormData({ ...tourFormData, [`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder={`Title in ${lang.toUpperCase()}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description ({lang.toUpperCase()})
                      </label>
                      <textarea
                        value={tourFormData[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof TourFormState] as string}
                        onChange={(e) => setTourFormData({ ...tourFormData, [`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: e.target.value })}
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

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Scheduling & Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.destination')} *</label>
                <input
                  type="text"
                  value={tourFormData.destination}
                  onChange={(e) => setTourFormData({ ...tourFormData, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.category')} *</label>
                <select
                  value={tourFormData.categoryId}
                  onChange={(e) => setTourFormData({ ...tourFormData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">{t('admin.form.selectCategory')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {typeof category.name === 'string' ? category.name : (category.name as any)[activeLangTab] || (category.name as any).ru}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.duration')} *</label>
                <input
                  type="number"
                  value={tourFormData.duration}
                  onChange={(e) => setTourFormData({ ...tourFormData, duration: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.maxParticipants')} *</label>
                <input
                  type="number"
                  value={tourFormData.maxParticipants}
                  onChange={(e) => setTourFormData({ ...tourFormData, maxParticipants: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.price')} *</label>
                  <input
                    type="number"
                    value={tourFormData.price}
                    onChange={(e) => setTourFormData({ ...tourFormData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
                  <select
                    value={tourFormData.currency}
                    onChange={(e) => setTourFormData({ ...tourFormData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="UZS">UZS</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.status')}</label>
                <select
                  value={tourFormData.status}
                  onChange={(e) => setTourFormData({ ...tourFormData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.startDate')} *</label>
                <input
                  type="date"
                  value={tourFormData.startDate}
                  onChange={(e) => setTourFormData({ ...tourFormData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.endDate')} *</label>
                <input
                  type="date"
                  value={tourFormData.endDate}
                  onChange={(e) => setTourFormData({ ...tourFormData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Media</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.form.images')}</label>
                <div
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleImageUpload(e.dataTransfer.files);
                  }}
                >
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={(e) => handleImageUpload(e.target.files)} ref={fileInputRef} accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 2MB</p>
                    {isUploading && (
                      <span className="text-xs text-emerald-600 animate-pulse">{t('admin.form.uploading') || 'Uploading...'}</span>
                    )}
                  </div>
                </div>
              </div>

              {(tourFormData.images.length > 0 || previewImages.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[...new Set([...tourFormData.images, ...previewImages])].map((image, index) => (
                    <div key={`${image}-${index}`} className="relative border rounded-lg overflow-hidden group aspect-square">
                      <img
                        src={getImageUrl(image)}
                        alt={`tour-image-${index}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/150';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-red-600 hover:text-red-700 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        title={t('admin.form.removeImage') || 'Remove image'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Tour Content</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.form.included')}</label>
                {tourFormData.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2 relative">
                    <input
                      type="text"
                      value={inclusion[activeLangTab]}
                      onChange={(e) => updateArrayField('inclusions', index, activeLangTab, e.target.value)}
                      placeholder={t('admin.form.includedPlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {tourFormData.inclusions.length > 0 && (
                      <button
                        onClick={() => removeArrayField('inclusions', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('inclusions')}
                  className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center space-x-1 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.form.add')}</span>
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.form.excluded')}</label>
                {tourFormData.exclusions.map((exclusion, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2 relative">
                    <input
                      type="text"
                      value={exclusion[activeLangTab]}
                      onChange={(e) => updateArrayField('exclusions', index, activeLangTab, e.target.value)}
                      placeholder={t('admin.form.excludedPlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {tourFormData.exclusions.length > 0 && (
                      <button
                        onClick={() => removeArrayField('exclusions', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('exclusions')}
                  className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center space-x-1 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.form.add')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Itinerary Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Itinerary</h4>
            <div className="space-y-4">
              {tourFormData.itinerary.map((step, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-gray-50/50">
                  <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100/60 px-4 py-2">
                    <span className="text-sm font-medium text-gray-700">Day {index + 1}</span>
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
                      <label className="block text-xs font-medium text-gray-600 mb-1">Title ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={step[`title${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}` as keyof ItineraryStep] as string}
                        onChange={(e) => updateItineraryStep(index, `title${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}` as keyof ItineraryStep, e.target.value as string)}
                        placeholder={`Day ${index + 1} title`}
                        className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description ({activeLangTab.toUpperCase()})</label>
                    <textarea
                      value={step[`description${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}` as keyof ItineraryStep] as string}
                      onChange={(e) => updateItineraryStep(index, `description${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}` as keyof ItineraryStep, e.target.value as string)}
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
            {t('admin.form.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            {editingTour ? t('admin.form.update') : t('admin.form.add')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourEditModal;
