import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Heart, User, Calendar, MapPin, CreditCard, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { djidaliApi, ApiOrder } from '../services/djidaliApi';
import { clickPaymentService } from '../services/clickPayment';
import { getImageUrl } from '../utils/imageUtils';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
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
        return t('userDashboard.status.fullyPaid');
      case 'CONFIRMED':
        return t('userDashboard.status.confirmed');
      case 'PENDING':
        return t('userDashboard.status.pending');
      case 'CANCELLED':
        return t('userDashboard.status.cancelled');
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
        return t('userDashboard.payment.paid');
      case 'waiting':
        return t('userDashboard.payment.waiting');
      case 'rejected':
        return t('userDashboard.payment.rejected');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4f2ed]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8f7b49] to-[#a08957] shadow-lg">
        <div className="max-w-[1340px] mx-auto px-[50px] py-[40px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[16px] font-medium">{t('userDashboard.header.backToHome')}</span>
              </button>
              <div className="h-8 w-px bg-white/30"></div>
              <h1 className="text-[40px] font-bold text-white leading-none tracking-tight">
                {t('userDashboard.header.title')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-[12px] text-white/70 uppercase tracking-wide">{t('userDashboard.header.welcome')}</p>
                <p className="text-[18px] font-semibold text-white">{user?.firstName} {user?.lastName}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-[1340px] mx-auto px-[50px] py-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] mb-[60px]">
          {/* Orders Card */}
          <div className="bg-white rounded-[20px] shadow-lg border-2 border-[#e8e4db] p-[40px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-[20px]">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-[15px] flex items-center justify-center shadow-md">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-[14px] text-[#666] font-medium uppercase tracking-wide mb-1">{t('userDashboard.stats.myOrders')}</p>
                <p className="text-[48px] font-bold text-[#333] leading-none">{orders.length}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"></div>
          </div>

          {/* Active Tours Card */}
          <div className="bg-white rounded-[20px] shadow-lg border-2 border-[#e8e4db] p-[40px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-[20px]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-600 rounded-[15px] flex items-center justify-center shadow-md">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-[14px] text-[#666] font-medium uppercase tracking-wide mb-1">{t('userDashboard.stats.activeTours')}</p>
                <p className="text-[48px] font-bold text-[#333] leading-none">
                  {orders.filter(o => o.status === 'CONFIRMED' || o.status === 'FULLY_PAID').length}
                </p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-sky-600 rounded-full"></div>
          </div>

          {/* Wishlist Card */}
          <div className="bg-white rounded-[20px] shadow-lg border-2 border-[#e8e4db] p-[40px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
               onClick={() => navigate('/wishlist')}>
            <div className="flex items-center justify-between mb-[20px]">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[15px] flex items-center justify-center shadow-md">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-[14px] text-[#666] font-medium uppercase tracking-wide mb-1">{t('userDashboard.stats.saved')}</p>
                <p className="text-[24px] font-bold text-amber-600 underline hover:text-amber-700 leading-none">
                  {t('userDashboard.stats.view')} →
                </p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"></div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-[20px] shadow-lg border-2 border-[#e8e4db] overflow-hidden">
          <div className="bg-gradient-to-r from-[#8f7b49] to-[#a08957] px-[40px] py-[30px]">
            <h2 className="text-[32px] font-bold text-white tracking-tight">{t('userDashboard.orders.title')}</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-[80px]">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8f7b49] border-t-transparent"></div>
              <p className="text-[18px] text-[#666] mt-6">{t('userDashboard.orders.loading')}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-[80px] px-[40px]">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-[28px] font-bold text-[#333] mb-3">{t('userDashboard.orders.empty')}</h3>
              <p className="text-[18px] text-[#666] mb-8 max-w-md mx-auto">
                {t('userDashboard.orders.emptyDesc')}
              </p>
              <button
                onClick={() => navigate('/tours')}
                className="bg-gradient-to-r from-[#8f7b49] to-[#a08957] text-white px-8 py-4 rounded-[12px] text-[18px] font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {t('userDashboard.orders.viewTours')} →
              </button>
            </div>
          ) : (
            <div className="p-[20px] space-y-[20px]">
              {orders.map((order) => (
                <div key={order.id} className="bg-gradient-to-br from-white to-gray-50 rounded-[16px] border-2 border-[#e8e4db] p-[30px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-[30px]">
                    {/* Tour Image */}
                    <div className="flex-shrink-0">
                      {order.tour?.images?.[0] ? (
                        <img
                          src={getImageUrl(order.tour.images[0])}
                          alt={order.tour.title}
                          className="w-[180px] h-[180px] object-cover rounded-[12px] shadow-md"
                        />
                      ) : (
                        <div className="w-[180px] h-[180px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-[12px] flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-[24px] font-bold text-[#333] leading-tight">
                          {order.tour?.title || 'N/A'}
                        </h3>
                        <span className={`inline-flex px-4 py-2 text-[14px] font-bold rounded-full ${getStatusColor(order.status)} shadow-sm`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-[12px] text-[#999] uppercase">{t('userDashboard.orders.destination')}</p>
                            <p className="text-[16px] font-semibold text-[#333]">{order.tour?.destination || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-[12px] text-[#999] uppercase">{t('userDashboard.orders.participants')}</p>
                            <p className="text-[16px] font-semibold text-[#333]">{order.participants} {t('userDashboard.orders.people')}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-[12px] text-[#999] uppercase">{t('userDashboard.orders.price')}</p>
                            <p className="text-[18px] font-bold text-emerald-600">
                              {order.totalAmount.toLocaleString()} UZS
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t-2 border-[#e8e4db]">
                        <div className="flex items-center gap-2 text-[14px] text-[#666]">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-[#999]" />
                          <span className="text-[14px] font-medium text-[#666]">{t('userDashboard.orders.payment')}:</span>
                          {paymentStatuses[order.id] ? (
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex px-3 py-1.5 text-[13px] font-bold rounded-full border-2 ${getPaymentStatusColor(paymentStatuses[order.id])}`}>
                                {getPaymentStatusText(paymentStatuses[order.id])}
                              </span>
                              <button
                                onClick={() => checkPaymentStatus(order.id)}
                                disabled={checkingPayment[order.id]}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title={t('userDashboard.orders.refresh')}
                              >
                                <RefreshCw className={`w-4 h-4 text-[#666] ${checkingPayment[order.id] ? 'animate-spin' : ''}`} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => checkPaymentStatus(order.id)}
                              disabled={checkingPayment[order.id]}
                              className="px-4 py-2 bg-blue-600 text-white text-[14px] font-semibold rounded-[8px] hover:bg-blue-700 transition-colors"
                            >
                              {checkingPayment[order.id] ? t('userDashboard.orders.checking') : t('userDashboard.orders.check')}
                            </button>
                          )}
                        </div>
                      </div>
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
