import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  MapPin, 
  Plus, 
  ShoppingBag, 
  Users,
  Tag
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';
import { djidaliApi } from '../../services/djidaliApi';
import { formatCurrency } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  description?: string;
}

const StatsCard = ({ title, value, icon, trend, description }: StatsCardProps) => (
  <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
          {trend !== undefined && (
            <span className={`ml-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </p>
        {description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <div className="rounded-lg bg-primary/10 p-3 text-primary">
        {icon}
      </div>
    </div>
  </div>
);

interface RecentOrder {
  id: string;
  tourName: string;
  customer: string;
  date: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface PopularTour {
  id: string | number;
  name: string;
  bookings: number;
  revenue: number;
  rating: number;
}

const DashboardPage = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeTours: 0,
    newCustomers: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [popularTours, setPopularTours] = useState<PopularTour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // const response = await djidaliApi.getAdminDashboard();
        
        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            totalRevenue: 12540,
            totalBookings: 342,
            activeTours: 18,
            newCustomers: 24,
          });

          setRecentOrders([
            {
              id: 'ORD-001',
              tourName: 'Uzbekistan Adventure',
              customer: 'John Doe',
              date: '2023-06-15',
              amount: 1250,
              status: 'confirmed',
            },
            // Add more mock orders...
          ]);

          setPopularTours([
            {
              id: 1,
              name: 'Samarkand & Bukhara Tour',
              bookings: 124,
              revenue: 24800,
              rating: 4.8,
            },
            // Add more mock tours...
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8f7b49]"></div>
      </div>
    );
  }

  const error = null; // This would come from your API in a real app
  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">Error loading dashboard</h2>
      </div>
    );
  }

  return (
    <AdminLayout 
      title={t('admin.dashboardOverview')}
      actions={
        <Link
          to="/admin/tours/new"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.addNewTour')}
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('admin.totalRevenue')}
          value={formatCurrency(stats.totalRevenue)}
          icon={<DollarSign className="h-6 w-6" />}
          trend={12.5}
        />
        <StatsCard
          title={t('admin.totalBookings')}
          value={stats.totalBookings}
          icon={<ShoppingBag className="h-6 w-6" />}
          trend={8.2}
        />
        <StatsCard
          title={t('admin.activeTours')}
          value={stats.activeTours}
          icon={<MapPin className="h-6 w-6" />}
          trend={5.7}
        />
        <StatsCard
          title={t('admin.newCustomers')}
          value={stats.newCustomers}
          icon={<Users className="h-6 w-6" />}
          trend={15.3}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">{t('admin.recentOrders')}</h3>
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              {t('admin.viewAll')}
            </Link>
          </div>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                        >
                          {t('admin.order')}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {t('admin.customer')}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {t('admin.date')}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {t('admin.amount')}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {t('admin.status')}
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">{t('admin.view')}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                            <div className="font-medium">{order.id}</div>
                            <div className="text-gray-500">{order.tourName}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {order.customer}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {formatCurrency(order.amount)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-primary hover:text-primary/80"
                            >
                              {t('admin.view')}<span className="sr-only">, {order.id}</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{t('admin.dashboard')}</h2>
            <Link
              to="/admin/tours"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              {t('admin.viewAll')}
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {popularTours.map((tour) => (
              <div
                key={tour.id}
                className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                  {/* Tour image would go here */}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {tour.name}
                    </h4>
                    <div className="flex items-center text-sm text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1">{tour.rating}</span>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{tour.bookings} bookings</span>
                    <span className="mx-2">•</span>
                    <span>{formatCurrency(tour.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/tours/new"
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center hover:border-primary hover:bg-primary/5 dark:border-gray-600 dark:hover:border-primary/50 dark:hover:bg-gray-700/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Plus className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Add New Tour</h4>
            <p className="mt-1 text-xs text-gray-500">Create a new tour package</p>
          </Link>
          <Link
            to="/admin/orders/new"
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center hover:border-primary hover:bg-primary/5 dark:border-gray-600 dark:hover:border-primary/50 dark:hover:bg-gray-700/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Create Booking</h4>
            <p className="mt-1 text-xs text-gray-500">Manually create a new booking</p>
          </Link>
          <Link
            to="/admin/categories/new"
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center hover:border-primary hover:bg-primary/5 dark:border-gray-600 dark:hover:border-primary/50 dark:hover:bg-gray-700/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Tag className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Add Category</h4>
            <p className="mt-1 text-xs text-gray-500">Create a new tour category</p>
          </Link>
          <Link
            to="/admin/analytics"
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center hover:border-primary hover:bg-primary/5 dark:border-gray-600 dark:hover:border-primary/50 dark:hover:bg-gray-700/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-medium text-gray-900 dark:text-white">View Analytics</h4>
            <p className="mt-1 text-xs text-gray-500">View booking and revenue reports</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
