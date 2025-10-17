import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Heart, User, Calendar, DollarSign, MapPin, CreditCard, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { djidaliApi, ApiOrder } from '../services/djidaliApi';
import { clickPaymentService } from '../services/clickPayment';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentStatuses, setPaymentStatuses] = useState<Record<string, 'waiting' | 'confirmed' | 'rejected'>>({});
  const [checkingPayment, setCheckingPayment] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  const fetchOrders = async () => {
    if (!user?.id) {
      console.log('No user ID, skipping fetch');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching orders for user:', user.id);
      const response = await djidaliApi.getOrders({ limit: 50 });
      console.log('Orders response:', response);

      if (Array.isArray(response)) {
        setOrders(response);
      } else if (response && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.warn('Unexpected response format:', response);
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FULLY_PAID':
        return 'bg-green-100 text-green-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'FULLY_PAID':
        return 'To\'liq to\'langan';
      case 'CONFIRMED':
        return 'Tasdiqlangan';
      case 'PENDING':
        return 'Kutilmoqda';
      case 'CANCELLED':
        return 'Bekor qilingan';
      default:
        return status;
    }
  };

  const checkPaymentStatus = async (orderId: string) => {
    setCheckingPayment(prev => ({ ...prev, [orderId]: true }));
    try {
      const status = await clickPaymentService.getPaymentStatus(orderId);
      setPaymentStatuses(prev => ({ ...prev, [orderId]: status }));
    } catch (error) {
      console.error('Payment status check failed:', error);
    } finally {
      setCheckingPayment(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getPaymentStatusColor = (status: 'waiting' | 'confirmed' | 'rejected') => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getPaymentStatusText = (status: 'waiting' | 'confirmed' | 'rejected') => {
    switch (status) {
      case 'confirmed':
        return 'To\'langan';
      case 'waiting':
        return 'Kutilmoqda';
      case 'rejected':
        return 'Rad etilgan';
    }
  };

  if (!isAuthenticated) {
    return null;
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
              <h1 className="text-2xl font-bold text-gray-900">Mening Panelaim</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Xush kelibsiz, {user?.firstName} {user?.lastName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Buyurtmalarim</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Faol turlar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'CONFIRMED' || o.status === 'FULLY_PAID').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Saqlanganlar</p>
                <p className="text-2xl font-bold text-gray-900">
                  <button
                    onClick={() => navigate('/wishlist')}
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    Ko'rish
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Mening buyurtmalarim</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hozircha buyurtmalar yo'q</h3>
              <p className="text-gray-600 mb-4">Ajoyib sayohatni boshlang!</p>
              <button
                onClick={() => navigate('/')}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
              >
                Turlarni ko'rish
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.tour?.title || 'N/A'}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{order.tour?.destination || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{order.participants} kishi</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-emerald-600">
                            {order.totalAmount.toLocaleString()} UZS
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Buyurtma sanasi: {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600">To'lov:</span>
                          {paymentStatuses[order.id] ? (
                            <div className="flex items-center space-x-1">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getPaymentStatusColor(paymentStatuses[order.id])}`}>
                                {getPaymentStatusText(paymentStatuses[order.id])}
                              </span>
                              <button
                                onClick={() => checkPaymentStatus(order.id)}
                                disabled={checkingPayment[order.id]}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Yangilash"
                              >
                                <RefreshCw className={`w-3 h-3 text-gray-500 ${checkingPayment[order.id] ? 'animate-spin' : ''}`} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => checkPaymentStatus(order.id)}
                              disabled={checkingPayment[order.id]}
                              className="text-xs text-blue-600 hover:text-blue-700 underline"
                            >
                              {checkingPayment[order.id] ? 'Tekshirilmoqda...' : 'Tekshirish'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {order.tour?.images?.[0] && (
                        <img
                          src={order.tour.images[0]}
                          alt={order.tour.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
