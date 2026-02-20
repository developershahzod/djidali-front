import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Trash2,
  Plus,
  Eye,
  Package,
  AlertCircle,
  Search,
  MapPin,
  FolderTree,
  Edit,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ExcelJS from "exceljs";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";
import { useConfirm } from "../contexts/ConfirmContext";
import AdminLayout from "../layouts/AdminLayout";
import { djidaliApi, ApiOrder, ApiCategory } from "../services/djidaliApi";
import AdminStats from "../components/AdminStats";
import CategoryModal from "../components/CategoryModal";
import OrderDetailModal from "../components/OrderDetailModal";
import { getImageUrl } from "../utils/imageUtils";

// Extended tour type with additional properties
export interface ExtendedApiTour {
  id: string;
  title: string | { [key: string]: string };
  description?: string | { [key: string]: string };
  destination?: string;
  duration?: number;
  price?: number | { amount: number; currency: string };
  currency?: string;
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
  status: "ACTIVE" | "INACTIVE";
  categoryId: string;
}

// Helper to get tab from URL path
const getTabFromPath = (
  pathname: string,
): "tours" | "orders" | "categories" => {
  if (pathname.includes("/admin/orders")) return "orders";
  if (pathname.includes("/admin/categories")) return "categories";
  return "tours"; // default to tours for /admin and /admin/tours
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      if (user && user.role !== "ADMIN" && user.role !== "SALES_MANAGER") {
        navigate("/");
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Tour creation state
  // Category creation state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    nameUz: "",
    nameRu: "",
    nameEng: "",
    nameDe: "",
    descriptionUz: "",
    descriptionRu: "",
    descriptionEng: "",
    descriptionDe: "",
    icon: "",
    parentId: "",
    sortOrder: 0,
    isActive: true,
  });
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(
    null,
  );

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
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error({
        title: "Failed to create category",
        message: error instanceof Error ? error.message : "Unknown error",
      });
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
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error({
        title: "Failed to update category",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleEditCategory = (category: ApiCategory) => {
    setEditingCategory(category);
    const categoryName = category.name as Record<string, string> | string;
    const categoryDesc = category.description as
      | Record<string, string>
      | string
      | undefined;
    const categoryExtended = category as ApiCategory & {
      icon?: string;
      parentId?: string;
      sortOrder?: number;
      isActive?: boolean;
    };

    setNewCategory({
      name:
        typeof categoryName === "object" ? categoryName.ru || "" : categoryName,
      slug: category.slug || "",
      description:
        typeof categoryDesc === "object"
          ? categoryDesc.ru || ""
          : categoryDesc || "",
      nameUz: typeof categoryName === "object" ? categoryName.uz || "" : "",
      nameRu:
        typeof categoryName === "object" ? categoryName.ru || "" : categoryName,
      nameEng: typeof categoryName === "object" ? categoryName.eng || "" : "",
      nameDe: typeof categoryName === "object" ? categoryName.de || "" : "",
      descriptionUz:
        typeof categoryDesc === "object" ? categoryDesc.uz || "" : "",
      descriptionRu:
        typeof categoryDesc === "object"
          ? categoryDesc.ru || ""
          : categoryDesc || "",
      descriptionEng:
        typeof categoryDesc === "object" ? categoryDesc.eng || "" : "",
      descriptionDe:
        typeof categoryDesc === "object" ? categoryDesc.de || "" : "",
      icon: categoryExtended.icon || "",
      parentId: categoryExtended.parentId || "",
      sortOrder: categoryExtended.sortOrder || 0,
      isActive: categoryExtended.isActive ?? true,
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete Category",
      message:
        "Are you sure you want to delete this category? This will also delete any subcategories.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      console.log("Attempting to delete category:", id);
      await djidaliApi.deleteCategory(id);
      console.log("Delete successful, fetching categories...");
      await fetchCategories();
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Failed to delete category:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error({
        title: "Error deleting category",
        message: errorMessage,
      });
    }
  };
  const resetCategoryForm = () => {
    setNewCategory({
      name: "",
      slug: "",
      description: "",
      nameUz: "",
      nameRu: "",
      nameEng: "",
      nameDe: "",
      descriptionUz: "",
      descriptionRu: "",
      descriptionEng: "",
      descriptionDe: "",
      icon: "",
      parentId: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setNewCategory((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
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
  const getTranslated = (
    text: string | { [key: string]: string } | undefined,
  ): string => {
    if (!text) return "";
    if (typeof text === "string") return text;
    return text[language] || text.en || text.uz || text.ru || text.de || "";
  };

  const _extractPrice = (
    price: number | { amount: number; currency: string } | undefined,
  ): number => {
    if (typeof price === "object" && price?.amount) {
      return Number(price.amount);
    }
    if (typeof price === "number") {
      return price;
    }
    return 0;
  };

  const [tours, setTours] = useState<ExtendedApiTour[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [allOrdersForStats, setAllOrdersForStats] = useState<ApiOrder[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [toursLoading, setToursLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Orders pagination & filter
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersStatusFilter, setOrdersStatusFilter] = useState<string>("");
  const ORDERS_PER_PAGE = 15;

  const [activeTab, setActiveTab] = useState<"tours" | "orders" | "categories">(
    () => getTabFromPath(location.pathname),
  );

  // Sync activeTab with URL path changes
  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      (user?.role !== "ADMIN" && user?.role !== "SALES_MANAGER")
    ) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const fetchTours = useCallback(async () => {
    try {
      setToursLoading(true);
      const response = await djidaliApi.getTours({ limit: 100 });
      console.log("✅ Tours fetched from API:", response.data.length, "tours");
      if (response.data.length > 0) {
        console.log("📊 Sample tour price structure:", {
          id: response.data[0].id,
          title: response.data[0].title,
          price: response.data[0].price,
          priceType: typeof response.data[0].price,
        });
      }
      setTours(
        response.data.map((tour) => ({
          ...tour,
          price:
            typeof tour.price === "object"
              ? tour.price
              : { amount: tour.price, currency: tour.currency || "UZS" },
        })),
      );
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    } finally {
      setToursLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const params: { page?: number; limit?: number; status?: string } = {
        page: ordersPage,
        limit: ORDERS_PER_PAGE,
      };
      if (ordersStatusFilter) {
        params.status = ordersStatusFilter;
      }
      const response =
        user?.role === "ADMIN" || user?.role === "SALES_MANAGER"
          ? await djidaliApi.getAdminOrders(params)
          : await djidaliApi.getOrders(params);
      setOrders(response.data || []);
      setOrdersTotal(response.total || response.data?.length || 0);
      setOrdersTotalPages(
        response.totalPages ||
          Math.ceil(
            (response.total || response.data?.length || 1) / ORDERS_PER_PAGE,
          ),
      );
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  }, [user?.role, ordersPage, ordersStatusFilter]);

  const fetchAllOrdersForStats = useCallback(async () => {
    try {
      const response =
        user?.role === "ADMIN" || user?.role === "SALES_MANAGER"
          ? await djidaliApi.getAdminOrders({ limit: 10000 })
          : await djidaliApi.getOrders({ limit: 10000 });
      setAllOrdersForStats(response.data || []);
    } catch (error) {
      console.error("Failed to fetch all orders for stats:", error);
    }
  }, [user?.role]);

  // Excel export
  const handleExportExcel = useCallback(async () => {
    try {
      // Fetch all orders matching current filter for export
      const params: { limit?: number; status?: string } = { limit: 10000 };
      if (ordersStatusFilter) params.status = ordersStatusFilter;
      const response =
        user?.role === "ADMIN" || user?.role === "SALES_MANAGER"
          ? await djidaliApi.getAdminOrders(params)
          : await djidaliApi.getOrders(params);
      const allOrders = response.data || [];

      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Orders");
      ws.columns = [
        { header: "Order #", key: "orderNum", width: 15 },
        { header: "Tour", key: "tour", width: 30 },
        { header: "Participants", key: "participants", width: 12 },
        { header: "Amount", key: "amount", width: 12 },
        { header: "Currency", key: "currency", width: 8 },
        { header: "Status", key: "status", width: 14 },
        { header: "Date", key: "date", width: 12 },
        { header: "Client Name", key: "clientName", width: 20 },
        { header: "Client Email", key: "clientEmail", width: 25 },
        { header: "Client Phone", key: "clientPhone", width: 18 },
      ];
      allOrders.forEach((order: any) => {
        ws.addRow({
          orderNum: order.orderNumber || order.id?.substring(0, 12),
          tour:
            typeof order.tour?.title === "object"
              ? order.tour.title.ru ||
                order.tour.title.uz ||
                Object.values(order.tour.title)[0]
              : order.tour?.title || "N/A",
          participants: order.participants,
          amount: order.totalAmount,
          currency: order.tour?.currency || order.currency || "UZS",
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString("ru-RU"),
          clientName: order.client
            ? `${order.client.firstName || ""} ${order.client.lastName || ""}`.trim()
            : "N/A",
          clientEmail: order.client?.email || "N/A",
          clientPhone: order.client?.phoneNumber || "N/A",
        });
      });

      const filterLabel = ordersStatusFilter || "all";
      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_${filterLabel}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export orders:", error);
    }
  }, [user?.role, ordersStatusFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = searchQuery
        ? await djidaliApi.searchCategories(searchQuery)
        : await djidaliApi.getCategories({ lang: language });
      setCategories(response);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }, [searchQuery, language]);

  // Load all data on mount for stats
  useEffect(() => {
    fetchTours();
    fetchOrders();
    fetchAllOrdersForStats();
    fetchCategories();
  }, [fetchTours, fetchCategories, fetchOrders, fetchAllOrdersForStats]);

  useEffect(() => {
    if (activeTab === "tours") {
      fetchTours();
      fetchCategories();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "categories") {
      fetchCategories();
    }
  }, [activeTab, fetchTours, fetchCategories, fetchOrders]);

  const handleDeleteTour = async (id: string) => {
    const confirmed = await confirm({
      title: t("admin.alerts.confirmDeleteTitle") || "Delete Tour",
      message: t("admin.alerts.confirmDelete"),
      confirmText: t("admin.form.delete") || "Delete",
      cancelText: t("admin.form.cancel") || "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await djidaliApi.deleteTour(id);
      fetchTours();
      toast.success("Tour deleted successfully");
    } catch (error) {
      toast.error({
        title: "Failed to delete tour",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
  ) => {
    try {
      await djidaliApi.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      toast.success("Order status updated");
    } catch (error) {
      toast.error({
        title: "Failed to update order",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  if (
    !isAuthenticated ||
    (user?.role !== "ADMIN" && user?.role !== "SALES_MANAGER")
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("admin.accessDenied.title")}
          </h1>
          <p className="text-gray-600 mb-4">
            {t("admin.accessDenied.message")}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            {t("admin.accessDenied.login")}
          </button>
        </div>
      </div>
    );
  }

  // Get title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case "orders":
        return t("admin.orders.title");
      case "categories":
        return t("admin.categories.title");
      default:
        return t("admin.tours.title");
    }
  };

  return (
    <AdminLayout title={getPageTitle()} subtitle="Управление контентом">
      <div className="space-y-8">
        <AdminStats
          toursCount={tours.length}
          ordersCount={allOrdersForStats.length}
          categoriesCount={categories.length}
          ordersByStatus={allOrdersForStats.reduce(
            (acc, order) => {
              const s = order.status?.toUpperCase() ?? "PENDING";
              acc[s] = (acc[s] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          )}
          revenueByCurrency={allOrdersForStats
            .filter(
              (order) =>
                order.status === "FULLY_PAID" ||
                order.status === "CONFIRMED" ||
                order.status === "COMPLETED",
            )
            .reduce(
              (acc, order) => {
                const currency =
                  order.tour?.currency ||
                  order.currency ||
                  (typeof order.tour?.price === "object" &&
                    order.tour.price?.currency) ||
                  "UZS";
                acc[currency] = (acc[currency] || 0) + order.totalAmount;
                return acc;
              },
              {} as Record<string, number>,
            )}
        />

        {activeTab !== "tours" && (
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder={
                  activeTab === "orders"
                    ? t("admin.search.orders")
                    : t("admin.search.categories")
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-sm rounded-md border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {activeTab === "tours" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {t("admin.tours.title")}
                </h2>
                <p className="text-sm text-slate-500">
                  {t("admin.tours.dataLoading")}
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/tours/new")}
                className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                <span>{t("admin.tours.addNew")}</span>
              </button>
            </div>

            {toursLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600" />
              </div>
            ) : tours.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <MapPin className="mx-auto h-10 w-10 text-slate-400" />
                <h3 className="mt-4 text-sm font-medium text-slate-900">
                  {t("admin.tours.empty")}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {t("admin.tours.emptyDesc")}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                {/* Mobile Card Layout */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {tours.map((tour) => (
                    <div key={tour.id} className="p-4">
                      <div className="flex items-start gap-3">
                        {tour.images?.[0] && (
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <img
                              src={getImageUrl(tour.images[0])}
                              alt={getTranslated(tour.title)}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">
                            {getTranslated(tour.title)}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {tour.category?.name
                              ? getTranslated(tour.category.name)
                              : t("admin.table.noCategory")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-slate-900 tabular-nums">
                            {(() => {
                              const currency =
                                tour.currency ||
                                (typeof tour.price === "object"
                                  ? tour.price.currency
                                  : null) ||
                                "UZS";
                              const amount =
                                typeof tour.price === "object"
                                  ? tour.price.amount
                                  : tour.price;
                              const formatted = amount?.toLocaleString() || "0";
                              if (currency === "USD") return `$${formatted}`;
                              if (currency === "EUR") return `€${formatted}`;
                              return `${formatted} UZS`;
                            })()}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                              tour.status === "ACTIVE"
                                ? "bg-success-50 text-success-700"
                                : "bg-destructive-50 text-destructive-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${tour.status === "ACTIVE" ? "bg-success-500" : "bg-destructive-500"}`}
                            />
                            {tour.status === "ACTIVE"
                              ? t("admin.table.active")
                              : t("admin.table.inactive")}
                          </span>
                          <span className="text-xs text-slate-500">
                            {tour._count?.orders || 0} {t("admin.table.orders")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              navigate(`/admin/tours/edit/${tour.id}`)
                            }
                            className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTour(tour.id)}
                            className="rounded-md p-2 text-destructive-600 hover:bg-destructive-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <table className="hidden md:table min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.tour")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.location")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.price")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.duration")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.status")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.orders")}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {tours.map((tour, idx) => (
                      <tr
                        key={tour.id}
                        className={
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {tour.images?.[0] && (
                              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                                <img
                                  src={getImageUrl(tour.images[0])}
                                  alt={getTranslated(tour.title)}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {getTranslated(tour.title)}
                              </div>
                              <p className="text-xs text-slate-500">
                                {tour.category?.name
                                  ? getTranslated(tour.category.name)
                                  : t("admin.table.noCategory")}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {getTranslated(tour.destination)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 tabular-nums">
                          {(() => {
                            const currency =
                              tour.currency ||
                              (typeof tour.price === "object"
                                ? tour.price.currency
                                : null) ||
                              "UZS";
                            const amount =
                              typeof tour.price === "object"
                                ? tour.price.amount
                                : tour.price;
                            const formatted = amount?.toLocaleString() || "0";
                            if (currency === "USD") return `$${formatted}`;
                            if (currency === "EUR") return `€${formatted}`;
                            return `${formatted} UZS`;
                          })()}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {tour.duration} {t("admin.table.days")}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${
                              tour.status === "ACTIVE"
                                ? "bg-success-50 text-success-700"
                                : "bg-destructive-50 text-destructive-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${tour.status === "ACTIVE" ? "bg-success-500" : "bg-destructive-500"}`}
                            />
                            {tour.status === "ACTIVE"
                              ? t("admin.table.active")
                              : t("admin.table.inactive")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 tabular-nums">
                          {tour._count?.orders || 0}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() =>
                                navigate(`/admin/tours/edit/${tour.id}`)
                              }
                              className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100"
                              title={t("admin.table.edit")}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTour(tour.id)}
                              className="rounded-md p-2 text-destructive-600 transition-colors hover:bg-destructive-50"
                              title={t("admin.table.delete")}
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

        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                  <FolderTree className="h-4 w-4 text-slate-400" />
                  {t("admin.categories.title")}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                  {t("admin.categories.title")}
                </h2>
              </div>
              <button
                onClick={() => {
                  resetCategoryForm();
                  setEditingCategory(null);
                  setShowCategoryModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                <span>{t("admin.categories.addCategory")}</span>
              </button>
            </div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600" />
              </div>
            ) : categories.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <FolderTree className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-medium text-slate-900">
                  {t("admin.categories.empty")}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {t("admin.categories.emptyDesc")}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                {/* Mobile Card Layout */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {categories.map((category) => (
                    <div key={category.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          {category.icon && (
                            <span className="text-lg">{category.icon}</span>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 line-clamp-1">
                              {typeof category.name === "string"
                                ? category.name
                                : getTranslated(category.name)}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                              {category.slug}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="rounded-md p-1.5 text-destructive-600 hover:bg-destructive-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                            category.isActive
                              ? "bg-success-50 text-success-700"
                              : "bg-destructive-50 text-destructive-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${category.isActive ? "bg-success-500" : "bg-destructive-500"}`}
                          />
                          {category.isActive
                            ? t("admin.table.active")
                            : t("admin.table.inactive")}
                        </span>
                        <span className="text-xs text-slate-400">
                          {t("admin.table.level")} {category.depth}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <table className="hidden md:table min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.name")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.slug")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.level")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.status")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.date")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        {t("admin.table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            {category.icon && (
                              <span className="text-lg">{category.icon}</span>
                            )}
                            <div className="text-sm font-medium text-slate-900">
                              {typeof category.name === "string"
                                ? category.name
                                : getTranslated(category.name)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {category.slug}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {t("admin.table.level")} {category.depth}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${
                              category.isActive
                                ? "bg-success-50 text-success-700"
                                : "bg-destructive-50 text-destructive-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${category.isActive ? "bg-success-500" : "bg-destructive-500"}`}
                            />
                            {category.isActive
                              ? t("admin.table.active")
                              : t("admin.table.inactive")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {(() => {
                            const dateValue =
                              typeof category.createdAt === "string"
                                ? category.createdAt
                                : null;
                            if (!dateValue) return "Invalid Date";
                            try {
                              return new Date(dateValue).toLocaleDateString(
                                "ru-RU",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              );
                            } catch {
                              return "Invalid Date";
                            }
                          })()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100"
                              title={t("admin.table.edit")}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="rounded-md p-2 text-destructive-600 transition-colors hover:bg-destructive-50"
                              title={t("admin.table.delete")}
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

        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {t("admin.orders.title")}
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    ({ordersTotal})
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={ordersStatusFilter}
                    onChange={(e) => {
                      setOrdersStatusFilter(e.target.value);
                      setOrdersPage(1);
                    }}
                    className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer"
                  >
                    <option value="">
                      {language === "ru" ? "Все статусы" : "All statuses"}
                    </option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="FULLY_PAID">Fully Paid</option>
                    <option value="PARTIALLY_PAID">Partially Paid</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
                {/* Export Button */}
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  {t("admin.orders.empty")}
                </h3>
                <p className="text-slate-500">{t("admin.orders.emptyDesc")}</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                {/* Mobile Card Layout */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {orders.map((order) => {
                    const currency =
                      order.tour?.currency ||
                      order.currency ||
                      (typeof order.tour?.price === "object" &&
                        order.tour.price?.currency) ||
                      "UZS";
                    const formatted = order.totalAmount.toLocaleString();
                    const priceDisplay =
                      currency === "USD"
                        ? `$${formatted}`
                        : currency === "EUR"
                          ? `€${formatted}`
                          : `${formatted} UZS`;

                    return (
                      <div key={order.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              #{order.orderNumber || order.id.substring(0, 12)}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                              {order.tour?.title || "N/A"}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                            {priceDisplay}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  order.id,
                                  e.target.value,
                                )
                              }
                              className={`text-xs font-medium rounded-md px-2 py-1 border-0 cursor-pointer ${
                                order.status === "FULLY_PAID"
                                  ? "bg-success-50 text-success-700"
                                  : order.status === "CONFIRMED"
                                    ? "bg-primary-50 text-primary-700"
                                    : order.status === "PENDING"
                                      ? "bg-warning-50 text-warning-700"
                                      : "bg-destructive-50 text-destructive-700"
                              }`}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="FULLY_PAID">FULLY_PAID</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                            <span className="text-xs text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString(
                                "ru-RU",
                                { day: "numeric", month: "short" },
                              )}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetail(true);
                            }}
                            className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table Layout */}
                <table className="hidden md:table min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {t("admin.table.id")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {t("admin.table.tour")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {t("admin.table.participants")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {t("admin.table.amount")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {t("admin.table.status")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {t("admin.table.date")}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {t("admin.table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {orders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }
                      >
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 tabular-nums">
                          #{order.orderNumber || order.id.substring(0, 8)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {order.tour?.title || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700 tabular-nums">
                          {order.participants}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 tabular-nums">
                          {(() => {
                            const currency =
                              order.tour?.currency ||
                              order.currency ||
                              (typeof order.tour?.price === "object" &&
                                order.tour.price?.currency) ||
                              "UZS";
                            const formatted =
                              order.totalAmount.toLocaleString();
                            if (currency === "USD") return `$${formatted}`;
                            if (currency === "EUR") return `€${formatted}`;
                            return `${formatted} UZS`;
                          })()}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value)
                            }
                            className={`text-xs font-medium rounded-md px-2 py-1 border-0 cursor-pointer ${
                              order.status === "FULLY_PAID"
                                ? "bg-success-50 text-success-700"
                                : order.status === "CONFIRMED"
                                  ? "bg-primary-50 text-primary-700"
                                  : order.status === "PENDING"
                                    ? "bg-warning-50 text-warning-700"
                                    : "bg-destructive-50 text-destructive-700"
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="FULLY_PAID">FULLY_PAID</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 tabular-nums">
                          {new Date(order.createdAt).toLocaleDateString(
                            "ru-RU",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetail(true);
                            }}
                            className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100"
                            title={t("admin.table.view")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {ordersTotalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50">
                    <p className="text-sm text-slate-600">
                      {language === "ru"
                        ? `Стр. ${ordersPage} из ${ordersTotalPages} (${ordersTotal} заказов)`
                        : `Page ${ordersPage} of ${ordersTotalPages} (${ordersTotal} orders)`}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                        disabled={ordersPage <= 1}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from(
                        { length: Math.min(5, ordersTotalPages) },
                        (_, i) => {
                          let pageNum: number;
                          if (ordersTotalPages <= 5) {
                            pageNum = i + 1;
                          } else if (ordersPage <= 3) {
                            pageNum = i + 1;
                          } else if (ordersPage >= ordersTotalPages - 2) {
                            pageNum = ordersTotalPages - 4 + i;
                          } else {
                            pageNum = ordersPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setOrdersPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                ordersPage === pageNum
                                  ? "bg-primary-600 text-white shadow-sm"
                                  : "text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                      <button
                        onClick={() =>
                          setOrdersPage((p) =>
                            Math.min(ordersTotalPages, p + 1),
                          )
                        }
                        disabled={ordersPage >= ordersTotalPages}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

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
    </AdminLayout>
  );
};

export default AdminDashboard;
