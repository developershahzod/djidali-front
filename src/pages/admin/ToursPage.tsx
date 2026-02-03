import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { djidaliApi } from "../../services/djidaliApi";
import { useConfirm } from "../../contexts/ConfirmContext";
import { useToast } from "../../contexts/ToastContext";
import {
  formatCurrency,
  formatDate,
  getStatusBadge,
  cn,
} from "../../lib/utils";
import { ApiTour } from "../../services/djidaliApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { getImageUrl } from "../../utils/imageUtils";

// Helper to extract localized string from multilingual object
const getLocalizedText = (
  value: string | { [key: string]: string } | undefined | null,
  language: string,
): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const langKey = language === "en" ? "eng" : language;
    return value[langKey] || value.ru || value.eng || value.uz || "";
  }
  return "";
};

// Helper to extract price value (handles both number and {amount, currency} formats)
const getPriceValue = (
  price: number | { amount: number; currency: string } | undefined | null,
): number => {
  if (price === null || price === undefined) return 0;
  if (typeof price === "number") return price;
  if (typeof price === "object" && "amount" in price) return price.amount;
  return 0;
};

// Helper to extract currency from price
const getPriceCurrency = (
  price: number | { amount: number; currency: string } | undefined | null,
  defaultCurrency: string = "UZS",
): string => {
  if (typeof price === "object" && price !== null && "currency" in price) {
    return price.currency;
  }
  return defaultCurrency;
};

// Helper to extract short location name (first part of address or region)
const getShortLocation = (
  destination: string | { [key: string]: string } | undefined | null,
  regions: string[] | undefined,
  language: string,
): string => {
  // Prefer regions if available
  if (regions && regions.length > 0) {
    return regions[0];
  }

  // Handle plain string destination
  if (typeof destination === "string" && destination) {
    // Extract just the first part (before first comma)
    return destination.split(",")[0].trim();
  }

  // Handle multilingual object destination
  if (typeof destination === "object" && destination) {
    const fullLocation = getLocalizedText(destination, language);
    if (fullLocation) {
      return fullLocation.split(",")[0].trim();
    }
  }

  return "";
};

const statuses = [
  { name: "All", value: "all" },
  { name: "Draft", value: "draft" },
  { name: "Published", value: "published" },
  { name: "Upcoming", value: "upcoming" },
  { name: "Ongoing", value: "ongoing" },
  { name: "Completed", value: "completed" },
  { name: "Cancelled", value: "cancelled" },
];

const sortOptions = [
  { name: "Newest", value: "newest" },
  { name: "Oldest", value: "oldest" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
  { name: "Most Booked", value: "popular" },
];

const ToursPage = () => {
  const { language } = useLanguage();
  const { confirm } = useConfirm();
  const { showToast } = useToast();
  const [tours, setTours] = useState<ApiTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTours, setSelectedTours] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await djidaliApi.getTours({
          page: currentPage,
          limit: itemsPerPage,
          status:
            statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
          search: searchQuery || undefined,
          includeHidden: true, // Admin should see all tours including hidden
        });
        setTours(response.data || []);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [statusFilter, sortBy, currentPage, searchQuery, itemsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTours(new Set(tours.map((tour) => tour.id)));
    } else {
      setSelectedTours(new Set());
    }
  };

  const handleSelectTour = (tourId: string) => {
    const newSelected = new Set(selectedTours);
    if (newSelected.has(tourId)) {
      newSelected.delete(tourId);
    } else {
      newSelected.add(tourId);
    }
    setSelectedTours(newSelected);
  };

  const handleDeleteSelected = async () => {
    const tourCount = selectedTours.size;
    const confirmed = await confirm({
      title: tourCount === 1 ? "Delete Tour" : `Delete ${tourCount} Tours`,
      message:
        tourCount === 1
          ? "Are you sure you want to delete this tour? This action cannot be undone."
          : `Are you sure you want to delete ${tourCount} tours? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    setDeleting(true);
    try {
      // Delete all selected tours
      const deletePromises = Array.from(selectedTours).map((id) =>
        djidaliApi.deleteTour(id),
      );
      await Promise.all(deletePromises);

      // Remove deleted tours from local state
      setTours(tours.filter((tour) => !selectedTours.has(tour.id)));
      setSelectedTours(new Set());

      showToast(
        "success",
        tourCount === 1
          ? "Tour deleted successfully"
          : `${tourCount} tours deleted successfully`,
      );
    } catch (error) {
      console.error("Error deleting tours:", error);
      showToast("error", "Failed to delete tours. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleVisibility = async (
    tourId: string,
    isCurrentlyHidden: boolean,
  ) => {
    try {
      await djidaliApi.toggleTourVisibility(tourId);
      // Update local state
      setTours(
        tours.map((tour) =>
          tour.id === tourId ? { ...tour, isHidden: !isCurrentlyHidden } : tour,
        ),
      );
      showToast(
        "success",
        isCurrentlyHidden ? "Tour is now visible" : "Tour is now hidden",
      );
    } catch (error) {
      console.error("Error toggling visibility:", error);
      showToast("error", "Failed to update tour visibility");
    }
  };

  const filteredAndSortedTours = React.useMemo(() => {
    let result = [...tours];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((tour) => {
        const title = getLocalizedText(tour.title, language).toLowerCase();
        const destination = getLocalizedText(
          tour.destination,
          language,
        ).toLowerCase();
        const description = getLocalizedText(
          tour.description,
          language,
        ).toLowerCase();
        return (
          title.includes(query) ||
          destination.includes(query) ||
          description.includes(query)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((tour) => tour.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "price_asc":
        result.sort((a, b) => getPriceValue(a.price) - getPriceValue(b.price));
        break;
      case "price_desc":
        result.sort((a, b) => getPriceValue(b.price) - getPriceValue(a.price));
        break;
      case "popular":
        result.sort(
          (a, b) => (b._count?.orders || 0) - (a._count?.orders || 0),
        );
        break;
      default:
        break;
    }

    return result;
  }, [tours, searchQuery, statusFilter, sortBy]);

  const paginatedTours = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTours.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTours, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTours.length / itemsPerPage);

  return (
    <AdminLayout
      title="Manage Tours"
      actions={
        <div className="flex space-x-2">
          {selectedTours.size > 0 && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {deleting ? "Deleting..." : `Delete (${selectedTours.size})`}
            </button>
          )}
          <Link
            to="/admin/tours/new"
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Tour
          </Link>
        </div>
      }
    >
      <div className="mb-6 space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {showFilters ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="sort"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Sort By
                </label>
                <select
                  id="sort"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow dark:bg-gray-800 sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="relative w-12 px-6 sm:w-16 sm:px-8"
                  >
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-500 sm:left-6 dark:border-gray-600 dark:bg-gray-800"
                      checked={
                        selectedTours.size === tours.length && tours.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    Tour
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    Destination
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    Bookings
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {paginatedTours.length > 0 ? (
                  paginatedTours.map((tour) => (
                    <tr
                      key={tour.id}
                      className={cn(
                        selectedTours.has(tour.id)
                          ? "bg-gray-50 dark:bg-gray-700/50"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                        "cursor-pointer",
                      )}
                    >
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-primary"></div>
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-500 sm:left-6 dark:border-gray-600 dark:bg-gray-800"
                          checked={selectedTours.has(tour.id)}
                          onChange={() => handleSelectTour(tour.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                            <img
                              className="h-full w-full object-cover"
                              src={
                                tour.images?.[0]
                                  ? getImageUrl(tour.images[0])
                                  : "https://via.placeholder.com/40"
                              }
                              alt={getLocalizedText(tour.title, language)}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {getLocalizedText(tour.title, language) ||
                                "Untitled Tour"}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>
                                {tour.startDate && tour.endDate ? (
                                  <>
                                    {formatDate(tour.startDate, "MMM d")} -{" "}
                                    {formatDate(tour.endDate, "MMM d, yyyy")}
                                  </>
                                ) : tour.dates && tour.dates.length > 0 ? (
                                  <>
                                    {formatDate(
                                      tour.dates[0].start_date,
                                      "MMM d",
                                    )}{" "}
                                    -{" "}
                                    {formatDate(
                                      tour.dates[0].end_date,
                                      "MMM d, yyyy",
                                    )}
                                  </>
                                ) : (
                                  <span className="text-gray-400">
                                    No dates
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {getShortLocation(
                              tour.destination,
                              tour.regions,
                              language,
                            ) || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(
                            getPriceValue(tour.price),
                            getPriceCurrency(tour.price, tour.currency),
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {tour.duration} days • {tour.maxParticipants} people
                          max
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getStatusBadge(tour.status || "draft")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {tour._count?.orders || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          total bookings
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleVisibility(
                                tour.id,
                                tour.isHidden || false,
                              );
                            }}
                            className={cn(
                              "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                              tour.isHidden ? "text-red-500" : "text-green-500",
                            )}
                            title={tour.isHidden ? "Show tour" : "Hide tour"}
                          >
                            {tour.isHidden ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <Link
                            to={`/admin/tours/edit/${tour.id}`}
                            className="text-primary hover:text-primary/80"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                          <Link
                            to={`/tours/${tour.id}`}
                            target="_blank"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No tours found. Try adjusting your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredAndSortedTours.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredAndSortedTours.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronUp
                        className="h-5 w-5 -rotate-90"
                        aria-hidden="true"
                      />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20",
                            currentPage === pageNum
                              ? "z-10 border-primary-500 bg-primary-50 text-primary-600 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-400"
                              : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
                            pageNum > totalPages ? "hidden" : "",
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown
                        className="h-5 w-5 -rotate-90"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default ToursPage;
