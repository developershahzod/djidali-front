import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Eye, Package, AlertCircle, Search, MapPin, FolderTree, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { djidaliApi, ApiOrder, ApiCategory, ApiTour } from '../services/djidaliApi';
import AdminStats from '../components/AdminStats'; 
import TourEditModal from '../components/TourEditModal';
import CategoryModal from '../components/CategoryModal';
import OrderDetailModal from '../components/OrderDetailModal';
import { getImageUrl } from '../utils/imageUtils';

// Extended tour type with additional properties
export interface ExtendedApiTour {
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

export type ItineraryStep = {
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

export interface TourFormState {
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
  status: 'ACTIVE' | 'INACTIVE';
  categoryId: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t, language } = useLanguage();

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      if (user && user.role !== 'ADMIN' && user.role !== 'SALES_MANAGER') {
        navigate('/');
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Tour creation state
  // Category creation state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    nameUz: '',
    nameRu: '',
    nameEng: '',
    nameDe: '',
    descriptionUz: '',
    descriptionRu: '',
    descriptionEng: '',
    descriptionDe: '',
    icon: '',
    parentId: '',
    sortOrder: 0,
    isActive: true
  });
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);

  const handleCreateCategory = async () => {
    try {
      const createPayload = {
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        nameUz: newCategory.nameUz,
        nameRu: newCategory.nameRu,
        nameEng: newCategory.nameEng,
        nameDe: newCategory.nameDe,
        descriptionUz: newCategory.descriptionUz,
        descriptionRu: newCategory.descriptionRu,
        descriptionEng: newCategory.descriptionEng,
        descriptionDe: newCategory.descriptionDe,
        icon: newCategory.icon,
        parentId: newCategory.parentId || undefined,
        sortOrder: Number(newCategory.sortOrder) || 0,
      };

      await djidaliApi.createCategory(createPayload);
      setShowCategoryModal(false);
      resetCategoryForm();
      fetchCategories();
      alert('Category created successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const updatePayload = {
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        nameUz: newCategory.nameUz,
        nameRu: newCategory.nameRu,
        nameEng: newCategory.nameEng,
        nameDe: newCategory.nameDe,
        descriptionUz: newCategory.descriptionUz,
        descriptionRu: newCategory.descriptionRu,
        descriptionEng: newCategory.descriptionEng,
        descriptionDe: newCategory.descriptionDe,
        icon: newCategory.icon,
        parentId: newCategory.parentId || undefined,
        sortOrder: Number(newCategory.sortOrder) || 0,
      };

      await djidaliApi.updateCategory(editingCategory.id, updatePayload);

      setShowCategoryModal(false);
      setEditingCategory(null);
      resetCategoryForm();
      fetchCategories();
      alert('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEditCategory = (category: ApiCategory) => {
    setEditingCategory(category);
    const categoryName = category.name as Record<string, string> | string;
    const categoryDesc = category.description as Record<string, string> | string | undefined;
    const categoryExtended = category as ApiCategory & { icon?: string; parentId?: string; sortOrder?: number; isActive?: boolean };

    setNewCategory({
      name: typeof categoryName === 'object' ? categoryName.ru || '' : categoryName,
      slug: category.slug || '',
      description: typeof categoryDesc === 'object' ? categoryDesc.ru || '' : categoryDesc || '',
      nameUz: typeof categoryName === 'object' ? categoryName.uz || '' : '',
      nameRu: typeof categoryName === 'object' ? categoryName.ru || '' : categoryName,
      nameEng: typeof categoryName === 'object' ? categoryName.eng || '' : '',
      nameDe: typeof categoryName === 'object' ? categoryName.de || '' : '',
      descriptionUz: typeof categoryDesc === 'object' ? categoryDesc.uz || '' : '',
      descriptionRu: typeof categoryDesc === 'object' ? categoryDesc.ru || '' : categoryDesc || '',
      descriptionEng: typeof categoryDesc === 'object' ? categoryDesc.eng || '' : '',
      descriptionDe: typeof categoryDesc === 'object' ? categoryDesc.de || '' : '',
      icon: categoryExtended.icon || '',
      parentId: categoryExtended.parentId || '',
      sortOrder: categoryExtended.sortOrder || 0,
      isActive: categoryExtended.isActive ?? true
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete any subcategories.')) {
      try {
        await djidaliApi.deleteCategory(id);
        fetchCategories();
        alert('Category deleted successfully.');
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Error deleting category: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };
  const resetCategoryForm = () => {
    setNewCategory({
      name: '',
      slug: '',
      description: '',
      nameUz: '',
      nameRu: '',
      nameEng: '',
      nameDe: '',
      descriptionUz: '',
      descriptionRu: '',
      descriptionEng: '',
      descriptionDe: '',
      icon: '',
      parentId: '',
      sortOrder: 0,
      isActive: true
    });
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setNewCategory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      handleUpdateCategory();
    } else {
      handleCreateCategory();
    }
  };

  // Helper function to safely get translated text
  const getTranslated = (text: string | { [key: string]: string } | undefined): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[language] || text.en || text.uz || text.ru || text.de || '';
  };

  const extractPrice = (price: number | { amount: number; currency: string } | undefined): number => {
    if (typeof price === 'object' && price?.amount) {
      return Number(price.amount);
    }
    if (typeof price === 'number') {
      return price;
    }
    return 0;
  };

  const [tours, setTours] = useState<ExtendedApiTour[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [toursLoading, setToursLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  const [activeTab, setActiveTab] = useState<'tours' | 'orders' | 'categories'>('tours');
  const [showTourModal, setShowTourModal] = useState(false);
  const [editingTour, setEditingTour] = useState<ExtendedApiTour | null>(null);

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SALES_MANAGER')) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const fetchTours = useCallback(async () => {
    try {
      setToursLoading(true);
      const response = await djidaliApi.getTours({ limit: 100 });
      console.log('✅ Tours fetched from API:', response.data.length, 'tours');
      if (response.data.length > 0) {
        console.log('📊 Sample tour price structure:', {
          id: response.data[0].id,
          title: response.data[0].title,
          price: response.data[0].price,
          priceType: typeof response.data[0].price
        });
      }
      setTours(response.data.map(tour => ({
        ...tour,
        price: typeof tour.price === 'object' ? tour.price : { amount: tour.price, currency: 'UZS' }
      })));
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setToursLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const response = user?.role === 'ADMIN' || user?.role === 'SALES_MANAGER'
        ? await djidaliApi.getAdminOrders({ limit: 100 })
        : await djidaliApi.getOrders({ limit: 100 });
      console.log('✅ Orders fetched from API:', response.data?.length || 0, 'orders');
      if (response.data.length > 0) {
        console.log('💰 Sample order pricing:', {
          orderId: response.data[0].id,
          participants: response.data[0].participants,
          totalAmount: response.data[0].totalAmount,
          paidAmount: response.data[0].paidAmount
        });
      }
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  }, [user?.role]);

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = searchQuery
        ? await djidaliApi.searchCategories(searchQuery)
        : await djidaliApi.getCategories({ lang: language });
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  }, [searchQuery, language]);

  // Load all data on mount for stats
  useEffect(() => {
    fetchTours();
    fetchOrders();
    fetchCategories();
  }, [fetchTours, fetchCategories, fetchOrders]);

  useEffect(() => {
    if (activeTab === 'tours') {
      fetchTours();
      fetchCategories();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab, fetchTours, fetchCategories, fetchOrders]);

  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  interface TourSaveData {
    title: string;
    titleUz?: string;
    titleRu?: string;
    titleEng?: string;
    titleDe?: string;
    description: string;
    descriptionUz?: string;
    descriptionRu?: string;
    descriptionEng?: string;
    descriptionDe?: string;
    destination: string;
    duration: number;
    price: number;
    currency?: string;
    maxParticipants?: number;
    startDate?: string;
    endDate?: string;
    images?: string[];
    inclusions?: Array<{ uz: string; ru: string; eng: string; de: string }>;
    exclusions?: Array<{ uz: string; ru: string; eng: string; de: string }>;
    status?: string;
    categoryId?: string;
    itinerary?: Record<string, string>;
    program?: Array<{
      dayNumber: number;
      titleUz: string;
      titleRu: string;
      titleEng: string;
      titleDe: string;
      descriptionUz: string;
      descriptionRu: string;
      descriptionEng: string;
      descriptionDe: string;
    }>;
  }

  const handleSaveTour = async (data: TourSaveData, tourId?: string) => {
    try {
      if (tourId) {
        await djidaliApi.updateTour(tourId, data);
        alert('Tour updated successfully');
      } else {
        await djidaliApi.createTour(data);
        alert(t('admin.alerts.tourAdded'));
      }
      setShowTourModal(false);
      fetchTours();
    } catch (error) {
      const action = tourId ? 'updating' : 'creating';
      alert(`Failed to ${action} tour: ` + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (!window.confirm(t('admin.alerts.confirmDelete'))) return;
    try {
      await djidaliApi.deleteTour(id);
      fetchTours();
    } catch (error) {
      alert('Failed to delete tour: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await djidaliApi.updateOrder(orderId, { status: newStatus as 'PENDING' | 'CONFIRMED' | 'FULLY_PAID' | 'CANCELLED' });
      fetchOrders();
    } catch (error) {
      alert('Failed to update order: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  interface MultilingualObject {
    [key: string]: string | Record<string, string> | number | boolean | undefined | null;
  }

  const getTranslatedField = (obj: MultilingualObject | undefined | null, fieldName: string, lang: 'uz' | 'ru' | 'eng' | 'de'): string => {
    if (!obj) return '';

    const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
    const directFieldKey = `${fieldName}${capitalizedLang}`;
    const directValue = obj[directFieldKey];
    if (directValue !== undefined && directValue !== null && typeof directValue !== 'object') {
      return String(directValue);
    }

    const fieldValue = obj[fieldName];
    if (typeof fieldValue === 'object' && fieldValue !== null && !Array.isArray(fieldValue)) {
      const langValue = fieldValue[lang];
      if (langValue !== undefined && langValue !== null) {
        return String(langValue);
      }
    }

    if (fieldName === '' && typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      const langValue = obj[lang];
      if (langValue !== undefined && langValue !== null) {
        return String(langValue);
      }
    }

    if ((fieldName === 'title' || fieldName === 'description') && typeof fieldValue === 'string') {
        return fieldValue;
    }

    return '';
  };

  const openEditModal = async (tourSummary: ExtendedApiTour) => {
    setEditingTour(tourSummary);
    setShowTourModal(true);

    let tour: ApiTour;
    try {
      tour = await djidaliApi.getTour(tourSummary.id);
    } catch (error) {
      console.error("Failed to fetch full tour details for editing:", error);
      alert("Could not load tour details for editing. Please try again.");
      setShowTourModal(false);
      return;
    }

    const formatDateForInput = (dateString?: string) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };

    interface ProgramItem {
      dayNumber?: number;
      title?: string | Record<string, string>;
      description?: string | Record<string, string>;
      titleRu?: string;
      titleUz?: string;
      titleEng?: string;
      titleDe?: string;
      descriptionRu?: string;
      descriptionUz?: string;
      descriptionEng?: string;
      descriptionDe?: string;
    }

    const tourExtended = tour as ApiTour & { program?: ProgramItem[]; programDays?: ProgramItem[] };
    const program: ProgramItem[] = tourExtended.program || tourExtended.programDays || [];
    const itinerarySteps: ItineraryStep[] = [];

    if (Array.isArray(program) && program.length > 0) {
      program.forEach((item: ProgramItem, index: number) => {
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

    interface MultilingualArrayItem {
      uz?: string;
      ru?: string;
      eng?: string;
      de?: string;
      name_uz?: string;
      name_ru?: string;
      name_en?: string;
      name_de?: string;
      name?: string;
    }

    const parseMultilingualArray = (arr: (string | MultilingualArrayItem)[] | undefined) => {
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

    interface CategoryData {
      id?: string;
    }

    const tourWithCategory = tour as ApiTour & { category?: CategoryData; categoryId?: string; currency?: string };
    const categoryData = tourWithCategory.category;

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

    // Tour data is now managed by TourEditModal component
    setPreviewImages([]);
  };

  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SALES_MANAGER')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('admin.accessDenied.title')}</h1>
          <p className="text-gray-600 mb-4">{t('admin.accessDenied.message')}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            {t('admin.accessDenied.login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F1E6] via-[#F2E5D3] to-[#E2D5C1]">
      <div className="relative overflow-hidden border-b border-white/30 bg-gradient-to-r from-[#2F2A24] via-[#40372C] to-[#5B4938] py-8 text-white shadow-[0_25px_80px_-50px_rgba(28,20,10,0.65)]">
        <div className="absolute inset-0 opacity-35">
          <div className="absolute -top-32 -left-16 h-64 w-64 rounded-full bg-[#BFA480]/40 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-72 w-72 rounded-full bg-[#8F6E47]/40 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 lg:px-10">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition-all hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('admin.header.backToHome')}</span>
            </button>
            <div className="hidden h-10 w-px bg-white/20 sm:block" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Djidali management</p>
              <h1 className="mt-2 text-3xl font-light tracking-tight">Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">{t('admin.header.welcome')}</p>
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <span className="rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em]">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-white/40 bg-white/60 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-10">
          <nav className="flex w-full flex-wrap items-center gap-3 py-3">
            {[
              {
                key: 'tours' as const,
                label: `${t('admin.tabs.tours')} (${tours.length})`,
                icon: <MapPin className="h-4 w-4" />
              },
              {
                key: 'orders' as const,
                label: `${t('admin.tabs.orders')} (${orders.length})`,
                icon: <Package className="h-4 w-4" />
              },
              {
                key: 'categories' as const,
                label: `${t('admin.tabs.categories')} (${categories.length})`,
                icon: <FolderTree className="h-4 w-4" />
              }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#2F2A24] text-white shadow-[0_15px_45px_-30px_rgba(32,24,18,0.75)]'
                    : 'text-[#5A4A3A] hover:bg-white/80 hover:text-[#2F2A24]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <AdminStats
          toursCount={tours.length}
          ordersCount={orders.length}
          categoriesCount={categories.length}
          totalRevenue={orders.reduce((sum, order) => sum + order.totalAmount, 0)}
        />

        {activeTab !== 'tours' && (
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_22px_75px_-50px_rgba(28,20,12,0.55)] backdrop-blur">
              <div className="absolute inset-y-3 left-3 flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2E5D3] text-[#6B5134]">
                  <Search className="h-4 w-4" />
                </div>
              </div>
              <input
                type="text"
                placeholder={activeTab === 'orders' ? t('admin.search.orders') : t('admin.search.categories')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[18px] border border-transparent bg-white/70 pl-16 pr-5 py-3 text-[#2F2A24] placeholder:text-[#B0A398] focus:border-[#BFA480] focus:ring-2 focus:ring-[#BFA480]/40"
              />
            </div>
          </div>
        )}

        {activeTab === 'tours' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#8E7A5E]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#8F6E47] animate-pulse" />
                  {t('admin.tours.dataLoading')}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#2F2A24]">{t('admin.tours.title')}</h2>
              </div>
              <button
                onClick={() => {
                  setEditingTour(null);
                  setShowTourModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8F6E47] to-[#BFA480] px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-[0_20px_55px_-35px_rgba(45,32,18,0.75)] transition-transform hover:-translate-y-[2px]"
              >
                <Plus className="h-4 w-4" />
                <span>{t('admin.tours.addNew')}</span>
              </button>
            </div>

            {toursLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#BFA480]/40 border-t-[#8F6E47]" />
              </div>
            ) : tours.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-[#BFA480]/50 bg-white/70 px-6 py-16 text-center shadow-[0_25px_75px_-55px_rgba(32,24,18,0.55)]">
                <MapPin className="mx-auto h-14 w-14 text-[#BFA480]" />
                <h3 className="mt-6 text-xl font-semibold text-[#2F2A24]">{t('admin.tours.empty')}</h3>
                <p className="mt-2 text-sm text-[#6B5B4C]">{t('admin.tours.emptyDesc')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-[32px] border border-white/70 bg-white/80 shadow-[0_28px_88px_-55px_rgba(30,22,14,0.55)] lg:overflow-visible">
                <table className="min-w-full divide-y divide-white/60">
                  <thead className="bg-[#F7F1E6]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.tour')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.location')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.price')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.duration')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.status')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.orders')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E] lg:w-56">{t('admin.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/60 bg-white">
                    {tours.map((tour) => (
                      <tr key={tour.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            {tour.images?.[0] && (
                              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                                <img
                                  src={getImageUrl(tour.images[0])}
                                  alt={getTranslated(tour.title)}
                                  className="absolute inset-0 h-full w-full object-cover scale-110"
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-[#2F2A24]">
                                {getTranslated(tour.title)}
                              </div>
                                <p className="text-xs uppercase tracking-[0.3em] text-[#A38D72]">
                                  {tour.category?.name ? getTranslated(tour.category.name) : t('admin.table.noCategory')}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#4F4336]">{tour.destination}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#8F6E47]">
                            {typeof tour.price === 'object'
                              ? tour.price.amount?.toLocaleString()
                              : tour.price?.toLocaleString() || '0'} UZS
                          </td>
                          <td className="px-6 py-4 text-sm text-[#4F4336]">{tour.duration} {t('admin.table.days')}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                                tour.status === 'ACTIVE'
                                  ? 'bg-[#E5F4EC] text-[#2F4A3A]'
                                  : 'bg-[#FCE4E4] text-[#6B2F2F]'
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${tour.status === 'ACTIVE' ? 'bg-[#2F4A3A]' : 'bg-[#6B2F2F]'}`} />
                              {tour.status === 'ACTIVE' ? t('admin.table.active') : t('admin.table.inactive')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#4F4336]">
                            {tour._count?.orders || 0}
                          </td>
                          <td className="px-6 py-4 lg:w-56">
                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(tour)}
                                className="inline-flex items-center gap-2 rounded-full border border-[#2F4A3A]/15 bg-[#2F4A3A]/10 px-4 py-1.5 text-xs font-medium text-[#2F4A3A] transition-colors hover:bg-[#2F4A3A]/15"
                                title={t('admin.table.edit')}
                              >
                                <Edit className="h-4 w-4" />
                                <span>{t('admin.table.edit')}</span>
                              </button>
                              <button
                                onClick={() => handleDeleteTour(tour.id)}
                                className="inline-flex items-center gap-2 rounded-full border border-[#6B2F2F]/15 bg-[#6B2F2F]/10 px-4 py-1.5 text-xs font-medium text-[#6B2F2F] transition-colors hover:bg-[#6B2F2F]/15"
                                title={t('admin.table.delete')}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>{t('admin.table.delete')}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#8E7A5E]">
                  <FolderTree className="h-4 w-4 text-[#8F6E47]" />
                  {t('admin.categories.title')}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#2F2A24]">{t('admin.categories.title')}</h2>
              </div>
              <button
                onClick={() => {
                  resetCategoryForm();
                  setEditingCategory(null);
                  setShowCategoryModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8F6E47] to-[#BFA480] px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-[0_20px_55px_-35px_rgba(45,32,18,0.75)] transition-transform hover:-translate-y-[2px]"
              >
                <Plus className="h-4 w-4" />
                <span>{t('admin.categories.addCategory')}</span>
              </button>
            </div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#BFA480]/40 border-t-[#8F6E47]" />
              </div>
            ) : categories.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-[#BFA480]/50 bg-white/70 px-6 py-16 text-center shadow-[0_25px_75px_-55px_rgba(32,24,18,0.55)]">
                <FolderTree className="mx-auto h-14 w-14 text-[#BFA480]" />
                <h3 className="mt-6 text-xl font-semibold text-[#2F2A24]">{t('admin.categories.empty')}</h3>
                <p className="mt-2 text-sm text-[#6B5B4C]">{t('admin.categories.emptyDesc')}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_28px_88px_-55px_rgba(30,22,14,0.55)]">
                <table className="min-w-full divide-y divide-white/60">
                  <thead className="bg-[#F7F1E6]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.name')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.slug')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.level')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.status')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.date')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]">{t('admin.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/60 bg-white">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {category.icon && (
                              <span className="text-lg">{category.icon}</span>
                            )}
                            <div className="text-sm font-semibold text-[#2F2A24]">
                              {typeof category.name === 'string' ? category.name : getTranslated(category.name)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#4F4336]">{category.slug}</td>
                        <td className="px-6 py-4 text-sm text-[#4F4336]">{t('admin.table.level')} {category.depth}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                            category.isActive
                              ? 'bg-[#E5F4EC] text-[#2F4A3A]'
                              : 'bg-[#FCE4E4] text-[#6B2F2F]'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${category.isActive ? 'bg-[#2F4A3A]' : 'bg-[#6B2F2F]'}`} />
                            {category.isActive ? t('admin.table.active') : t('admin.table.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#4F4336]">
                          {(() => {
                            const dateValue = typeof category.createdAt === 'string' ? category.createdAt : null;
                            if (!dateValue) return 'Invalid Date';
                            try {
                              return new Date(dateValue).toLocaleDateString('uz-UZ', {
                                year: 'numeric', month: 'short', day: 'numeric'
                              });
                            } catch {
                              return 'Invalid Date';
                            }
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="inline-flex items-center gap-2 rounded-full border border-[#2F4A3A]/15 bg-[#2F4A3A]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F4A3A] transition-colors hover:bg-[#2F4A3A]/15"
                              title={t('admin.table.edit')}
                            >
                              <Edit className="h-4 w-4" />
                              <span>{t('admin.table.edit')}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-[#6B2F2F]/15 bg-[#6B2F2F]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B2F2F] transition-colors hover:bg-[#6B2F2F]/15"
                              title={t('admin.table.delete')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('admin.orders.title')}</h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center space-x-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{t('admin.orders.dataLoading')}</span>
              </p>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.orders.empty')}</h3>
                <p className="text-gray-600">{t('admin.orders.emptyDesc')}</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.id')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.tour')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.participants')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.amount')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.status')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.date')}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('admin.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">#{order.orderNumber || order.id.substring(0, 8)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {order.tour?.title || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{order.participants}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{order.totalAmount.toLocaleString()} UZS</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${
                              order.status === 'FULLY_PAID'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'CONFIRMED'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="FULLY_PAID">FULLY_PAID</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetail(true);
                            }}
                            className="text-emerald-600 hover:text-emerald-900"
                            title={t('admin.table.view')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <TourEditModal
        isOpen={showTourModal}
        onClose={() => {
          setShowTourModal(false);
          setEditingTour(null);
        }}
        editingTour={editingTour}
        categories={categories}
        onSave={handleSaveTour}
        t={t}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
          resetCategoryForm();
        }}
        categories={categories}
        editingCategory={editingCategory}
        newCategory={newCategory}
        handleCategoryInputChange={handleCategoryInputChange}
        handleSubmitCategory={handleSubmitCategory}
      />

      <OrderDetailModal
        order={selectedOrder}
        isOpen={showOrderDetail}
        onClose={() => {
          setShowOrderDetail(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default AdminDashboard;
