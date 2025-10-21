import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, ArrowLeft, CreditCard as Edit, Trash2, Plus, Eye, CheckCircle, XCircle, Clock, Users, Package, AlertCircle, FolderTree, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { djidaliApi, ApiTour, ApiOrder, ApiCategory } from '../services/djidaliApi';
import AdminStats from '../components/AdminStats';
import CategoryModal from '../components/CategoryModal';
import OrderDetailModal from '../components/OrderDetailModal';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const extractPrice = (price: any): number => {
    if (typeof price === 'object' && price?.amount) {
      return Number(price.amount);
    }
    if (typeof price === 'number') {
      return price;
    }
    return 0;
  };

  const [tours, setTours] = useState<ApiTour[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [toursLoading, setToursLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  const [activeTab, setActiveTab] = useState<'tours' | 'orders' | 'categories'>('tours');
  const [showTourModal, setShowTourModal] = useState(false);
  const [editingTour, setEditingTour] = useState<ApiTour | null>(null);
  const [tourFormData, setTourFormData] = useState({
    title: '',
    description: '',
    destination: '',
    duration: 1,
    price: '250',
    maxParticipants: 10,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    images: [''],
    inclusions: [''],
    exclusions: [''],
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    categoryId: '',
  });

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SALES_MANAGER')) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (activeTab === 'tours') {
      fetchTours();
      fetchCategories();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTours = async () => {
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
      setTours(response.data);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setToursLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = user?.role === 'ADMIN' || user?.role === 'SALES_MANAGER'
        ? await djidaliApi.getAdminOrders({ limit: 100 })
        : await djidaliApi.getOrders({ limit: 100 });
      console.log('✅ Orders fetched from API:', response.data.length, 'orders');
      if (response.data.length > 0) {
        console.log('💰 Sample order pricing:', {
          orderId: response.data[0].id,
          participants: response.data[0].participants,
          totalAmount: response.data[0].totalAmount,
          paidAmount: response.data[0].paidAmount
        });
      }
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = searchQuery
        ? await djidaliApi.searchCategories(searchQuery)
        : await djidaliApi.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCreateTour = async () => {
    try {
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

      await djidaliApi.createTour({
        title: tourFormData.title,
        description: tourFormData.description,
        destination: tourFormData.destination,
        duration: tourFormData.duration,
        price: priceValue,
        currency: 'UZS',
        maxParticipants: tourFormData.maxParticipants,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        images: tourFormData.images.filter(img => img.trim()),
        inclusions: tourFormData.inclusions.filter(inc => inc.trim()),
        exclusions: tourFormData.exclusions.filter(exc => exc.trim()),
        itinerary: {},
        status: tourFormData.status,
        categoryId: tourFormData.categoryId,
      });

      setShowTourModal(false);
      resetTourForm();
      fetchTours();
      alert(t('admin.alerts.tourAdded'));
    } catch (error) {
      alert(t('admin.alerts.tourAddError') + ': ' + (error instanceof Error ? error.message : t('admin.alerts.unknownError')));
    }
  };

  const handleUpdateTour = async () => {
    if (!editingTour) return;
    try {
      const priceValue = parseFloat(tourFormData.price) || 0;

      await djidaliApi.updateTour(editingTour.id, {
        ...tourFormData,
        price: { amount: priceValue } as any,
        currency: 'UZS',
        images: tourFormData.images.filter(img => img.trim()),
        inclusions: tourFormData.inclusions.filter(inc => inc.trim()),
        exclusions: tourFormData.exclusions.filter(exc => exc.trim()),
      });

      setShowTourModal(false);
      setEditingTour(null);
      resetTourForm();
      fetchTours();
    } catch (error) {
      alert('Failed to update tour: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
      await djidaliApi.updateOrder(orderId, { status: newStatus as any });
      fetchOrders();
    } catch (error) {
      alert('Failed to update order: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const resetTourForm = () => {
    setTourFormData({
      title: '',
      description: '',
      destination: '',
      duration: 1,
      price: '250',
      maxParticipants: 10,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      images: [''],
      inclusions: [''],
      exclusions: [''],
      status: 'ACTIVE',
      categoryId: '',
    });
  };

  const openEditModal = (tour: ApiTour) => {
    setEditingTour(tour);
    const priceValue = extractPrice(tour.price).toString();

    setTourFormData({
      title: tour.title,
      description: tour.description,
      destination: tour.destination,
      duration: tour.duration,
      price: priceValue,
      maxParticipants: tour.maxParticipants,
      startDate: tour.startDate || '',
      endDate: tour.endDate || '',
      images: tour.images.length > 0 ? tour.images : [''],
      inclusions: tour.inclusions.length > 0 ? tour.inclusions : [''],
      exclusions: tour.exclusions.length > 0 ? tour.exclusions : [''],
      status: tour.status || 'ACTIVE',
      categoryId: (tour as any).categoryId || '',
    });
    setShowTourModal(true);
  };

  const addArrayField = (field: 'images' | 'inclusions' | 'exclusions') => {
    setTourFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayField = (field: 'images' | 'inclusions' | 'exclusions', index: number, value: string) => {
    setTourFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field: 'images' | 'inclusions' | 'exclusions', index: number) => {
    setTourFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
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
                  resetTourForm();
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
              <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_28px_88px_-55px_rgba(30,22,14,0.55)]">
                <table className="min-w-full divide-y divide-white/60">
                  <thead className="bg-[#F7F1E6]">
                    <tr>
                      {[t('admin.table.tour'), t('admin.table.location'), t('admin.table.price'), t('admin.table.duration'), t('admin.table.status'), t('admin.table.orders'), t('admin.table.actions')].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] text-[#8E7A5E]"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E4D0]">
                    {tours.map((tour) => {
                      const priceValue = extractPrice(tour.price);

                      return (
                        <tr key={tour.id} className="transition-colors hover:bg-[#FDF8F1]">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {tour.images[0] && (
                                <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#EAE1D2]">
                                  <img
                                    src={tour.images[0]}
                                    alt={tour.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-semibold text-[#2F2A24]">{tour.title}</div>
                                <p className="text-xs uppercase tracking-[0.3em] text-[#A38D72]">
                                  {tour.category?.name || t('admin.table.noCategory')}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#4F4336]">{tour.destination}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#8F6E47]">
                            {priceValue.toLocaleString()} UZS
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
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(tour)}
                                className="inline-flex items-center gap-2 rounded-full border border-[#2F4A3A]/15 bg-[#2F4A3A]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F4A3A] transition-colors hover:bg-[#2F4A3A]/15"
                                title={t('admin.table.edit')}
                              >
                                <Edit className="h-4 w-4" />
                                <span>{t('admin.table.edit')}</span>
                              </button>
                              <button
                                onClick={() => handleDeleteTour(tour.id)}
                                className="inline-flex items-center gap-2 rounded-full border border-[#6B2F2F]/15 bg-[#6B2F2F]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B2F2F] transition-colors hover:bg-[#6B2F2F]/15"
                                title={t('admin.table.delete')}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>{t('admin.table.delete')}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{t('admin.categories.title')}</h2>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin.categories.addNew')}</span>
              </button>
            </div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.categories.empty')}</h3>
                <p className="text-gray-600">{t('admin.categories.emptyDesc')}</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.name')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.slug')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.level')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.status')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.table.date')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {category.icon && (
                              <span className="mr-2 text-lg">{category.icon}</span>
                            )}
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{t('admin.table.level')} {category.depth}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            category.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? t('admin.table.active') : t('admin.table.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString('uz-UZ', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
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

      {showTourModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingTour ? t('admin.modal.editTour') : t('admin.modal.addTour')}</h3>
              <button
                onClick={() => {
                  setShowTourModal(false);
                  setEditingTour(null);
                  resetTourForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.name')} *</label>
                <input
                  type="text"
                  value={tourFormData.title}
                  onChange={(e) => setTourFormData({ ...tourFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.description')} *</label>
                <textarea
                  value={tourFormData.description}
                  onChange={(e) => setTourFormData({ ...tourFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.price')} *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={tourFormData.price}
                    onChange={(e) => setTourFormData({ ...tourFormData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                    placeholder={t('admin.form.pricePlaceholder')}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('admin.form.priceHint')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.duration')} *</label>
                  <input
                    type="number"
                    min="1"
                    value={tourFormData.duration}
                    onChange={(e) => setTourFormData({ ...tourFormData, duration: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.maxParticipants')} *</label>
                  <input
                    type="number"
                    min="1"
                    value={tourFormData.maxParticipants}
                    onChange={(e) => setTourFormData({ ...tourFormData, maxParticipants: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.form.status')}</label>
                  <select
                    value={tourFormData.status}
                    onChange={(e) => setTourFormData({ ...tourFormData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="ACTIVE">{t('admin.table.active')}</option>
                    <option value="INACTIVE">{t('admin.table.inactive')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.form.images')}</label>
                {tourFormData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => updateArrayField('images', index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {tourFormData.images.length > 1 && (
                      <button
                        onClick={() => removeArrayField('images', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayField('images')}
                  className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.form.addImage')}</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.form.included')}</label>
                {tourFormData.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => updateArrayField('inclusions', index, e.target.value)}
                      placeholder={t('admin.form.includedPlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {tourFormData.inclusions.length > 1 && (
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
                  onClick={() => addArrayField('inclusions')}
                  className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.form.add')}</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.form.excluded')}</label>
                {tourFormData.exclusions.map((exclusion, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={exclusion}
                      onChange={(e) => updateArrayField('exclusions', index, e.target.value)}
                      placeholder={t('admin.form.excludedPlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {tourFormData.exclusions.length > 1 && (
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
                  onClick={() => addArrayField('exclusions')}
                  className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.form.add')}</span>
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowTourModal(false);
                  setEditingTour(null);
                  resetTourForm();
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                {t('admin.form.cancel')}
              </button>
              <button
                onClick={editingTour ? handleUpdateTour : handleCreateTour}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                {editingTour ? t('admin.form.update') : t('admin.form.add')}
              </button>
            </div>
          </div>
        </div>
      )}

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSuccess={fetchCategories}
        categories={categories}
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
