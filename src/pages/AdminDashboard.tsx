import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, ArrowLeft, CreditCard as Edit, Trash2, Plus, Eye, CheckCircle, XCircle, Clock, Users, Package, AlertCircle, FolderTree, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { djidaliApi, ApiTour, ApiOrder, ApiCategory } from '../services/djidaliApi';
import AdminStats from '../components/AdminStats';
import CategoryModal from '../components/CategoryModal';
import OrderDetailModal from '../components/OrderDetailModal';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

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
        alert('Iltimos, to\'g\'ri narx kiriting (0 dan katta son)');
        return;
      }

      if (!tourFormData.startDate || !tourFormData.endDate) {
        alert('Iltimos, boshlanish va tugash sanalarini kiriting');
        return;
      }

      const startDate = new Date(tourFormData.startDate);
      const endDate = new Date(tourFormData.endDate);

      if (endDate <= startDate) {
        alert('Tugash sanasi boshlanish sanasidan keyin bo\'lishi kerak');
        return;
      }

      if (!tourFormData.categoryId) {
        alert('Iltimos, kategoriya tanlang');
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
      alert('Tur muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      alert('Turni qo\'shishda xatolik: ' + (error instanceof Error ? error.message : 'Noma\'lum xatolik'));
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
    if (!window.confirm('Are you sure you want to delete this tour?')) return;
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kirish ta'qiqlangan</h1>
          <p className="text-gray-600 mb-4">Ushbu sahifaga kirish uchun ruxsatingiz yo'q</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Asosiy sahifaga</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Xush kelibsiz, {user?.firstName} {user?.lastName}</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tours')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tours'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Turlar ({tours.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Buyurtmalar ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Kategoriyalar ({categories.length})</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminStats
          toursCount={tours.length}
          ordersCount={orders.length}
          categoriesCount={categories.length}
          totalRevenue={orders.reduce((sum, order) => sum + order.totalAmount, 0)}
        />

        {activeTab !== 'tours' && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={activeTab === 'orders' ? 'Buyurtmalarni qidirish...' : 'Kategoriyalarni qidirish...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {activeTab === 'tours' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Turlar ro'yxati</h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center space-x-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Ma'lumotlar API orqali yuklanmoqda</span>
                </p>
              </div>
              <button
                onClick={() => {
                  resetTourForm();
                  setEditingTour(null);
                  setShowTourModal(true);
                }}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi tur qo'shish</span>
              </button>
            </div>

            {toursLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Hozircha turlar yo'q</h3>
                <p className="text-gray-600">Yangi tur qo'shish uchun yuqoridagi tugmani bosing</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manzil</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Narxi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Davomiyligi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyurtmalar</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tours.map((tour) => {
                      const priceValue = extractPrice(tour.price);

                      return (
                        <tr key={tour.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {tour.images[0] && (
                                <img
                                  src={tour.images[0]}
                                  alt={tour.title}
                                  className="w-12 h-12 rounded object-cover"
                                />
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{tour.destination}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{priceValue.toLocaleString()} UZS</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{tour.duration} kun</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              tour.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tour.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {tour._count?.orders || 0}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => openEditModal(tour)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Tahrirlash"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTour(tour.id)}
                                className="text-red-600 hover:text-red-900"
                                title="O'chirish"
                              >
                                <Trash2 className="w-4 h-4" />
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
              <h2 className="text-xl font-bold text-gray-900">Kategoriyalar ro'yxati</h2>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi kategoriya qo'shish</span>
              </button>
            </div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Hozircha kategoriyalar yo'q</h3>
                <p className="text-gray-600">Kategoriyalar avtomatik API orqali yuklanadi</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nomi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daraja</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
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
                        <td className="px-6 py-4 text-sm text-gray-900">Daraja {category.depth}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            category.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? 'Faol' : 'Nofaol'}
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
              <h2 className="text-xl font-bold text-gray-900">Buyurtmalar ro'yxati</h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center space-x-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Mijoz narxlari API dan yuklanmoqda</span>
              </p>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Hozircha buyurtmalar yo'q</h3>
                <p className="text-gray-600">Yangi buyurtmalar bu yerda ko'rinadi</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ishtirokchilar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
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
                            title="Ko'rish"
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
              <h3 className="text-xl font-bold">{editingTour ? 'Turni tahrirlash' : 'Yangi tur qo\'shish'}</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomi *</label>
                <input
                  type="text"
                  value={tourFormData.title}
                  onChange={(e) => setTourFormData({ ...tourFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manzil *</label>
                  <input
                    type="text"
                    value={tourFormData.destination}
                    onChange={(e) => setTourFormData({ ...tourFormData, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Narxi (UZS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={tourFormData.price}
                    onChange={(e) => setTourFormData({ ...tourFormData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                    placeholder="Masalan: 3000000"
                  />
                  <p className="text-xs text-gray-500 mt-1">O'zbek so'mida kiriting</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Davomiyligi (kun) *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max ishtirokchilar *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Boshlanish sanasi *</label>
                  <input
                    type="date"
                    value={tourFormData.startDate}
                    onChange={(e) => setTourFormData({ ...tourFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tugash sanasi *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya *</label>
                  <select
                    value={tourFormData.categoryId}
                    onChange={(e) => setTourFormData({ ...tourFormData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Kategoriya tanlang</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={tourFormData.status}
                    onChange={(e) => setTourFormData({ ...tourFormData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="ACTIVE">Faol</option>
                    <option value="INACTIVE">Nofaol</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rasmlar URL</label>
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
                  <span>Rasm qo'shish</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kiritilgan</label>
                {tourFormData.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => updateArrayField('inclusions', index, e.target.value)}
                      placeholder="Nima kiritilgan"
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
                  <span>Qo'shish</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kiritilmagan</label>
                {tourFormData.exclusions.map((exclusion, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={exclusion}
                      onChange={(e) => updateArrayField('exclusions', index, e.target.value)}
                      placeholder="Nima kiritilmagan"
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
                  <span>Qo'shish</span>
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
                Bekor qilish
              </button>
              <button
                onClick={editingTour ? handleUpdateTour : handleCreateTour}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                {editingTour ? 'Yangilash' : 'Qo\'shish'}
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
