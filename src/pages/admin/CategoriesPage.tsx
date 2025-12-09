import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronRight,
  FolderTree,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import AdminLayout from "../../layouts/AdminLayout";
import { djidaliApi, ApiCategory } from "../../services/djidaliApi";
import { useToast } from "../../contexts/ToastContext";
import { useConfirm } from "../../contexts/ConfirmContext";

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  nameUz: string;
  nameRu: string;
  nameEng: string;
  nameDe: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEng: string;
  descriptionDe: string;
  icon: string;
  parentId: string | null;
  sortOrder: number;
}

const initialFormData: CategoryFormData = {
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
  parentId: null,
  sortOrder: 0,
};

const CategoriesPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get("new") === "true";
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [treeCategories, setTreeCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(isNew);
  const [editingId, setEditingId] = useState<string | null>(id || null);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"uz" | "ru" | "en" | "de">("uz");

  // Helper to get localized text
  const getLocalizedName = (category: ApiCategory): string => {
    const langKey = language === "en" ? "eng" : language;
    if (typeof category.name === "object") {
      return (
        category.name[langKey] ||
        category.name.ru ||
        category.name.eng ||
        category.name.uz ||
        ""
      );
    }
    return category.name || "";
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const [flatList, tree] = await Promise.all([
        djidaliApi.getCategories({ lang: language }),
        djidaliApi.getCategoryTree({ lang: language }),
      ]);
      setCategories(flatList);
      setTreeCategories(tree);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [language]);

  // Load category for editing
  useEffect(() => {
    if (editingId && editingId !== "new") {
      loadCategoryForEdit(editingId);
    }
  }, [editingId]);

  const loadCategoryForEdit = async (categoryId: string) => {
    try {
      const category = await djidaliApi.getCategory(categoryId);
      setFormData({
        name: typeof category.name === "string" ? category.name : "",
        slug: category.slug || "",
        description:
          typeof category.description === "string" ? category.description : "",
        nameUz: category.nameUz || "",
        nameRu: category.nameRu || "",
        nameEng: category.nameEng || "",
        nameDe: category.nameDe || "",
        descriptionUz: category.descriptionUz || "",
        descriptionRu: category.descriptionRu || "",
        descriptionEng: category.descriptionEng || "",
        descriptionDe: category.descriptionDe || "",
        icon: category.icon || "",
        parentId: category.parentId || null,
        sortOrder: category.sortOrder || 0,
      });
      setShowForm(true);
    } catch (error) {
      console.error("Error loading category:", error);
      showToast("Failed to load category", "error");
    }
  };

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formData.nameEng || formData.nameUz || formData.name,
        slug: formData.slug,
        description:
          formData.descriptionEng ||
          formData.descriptionUz ||
          formData.description,
        nameUz: formData.nameUz,
        nameRu: formData.nameRu,
        nameEng: formData.nameEng,
        nameDe: formData.nameDe,
        descriptionUz: formData.descriptionUz,
        descriptionRu: formData.descriptionRu,
        descriptionEng: formData.descriptionEng,
        descriptionDe: formData.descriptionDe,
        icon: formData.icon || undefined,
        parentId: formData.parentId || undefined,
        sortOrder: formData.sortOrder,
      };

      if (editingId && editingId !== "new") {
        await djidaliApi.updateCategory(editingId, payload);
        showToast("Category updated successfully", "success");
      } else {
        await djidaliApi.createCategory(payload);
        showToast("Category created successfully", "success");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(initialFormData);
      fetchCategories();
      navigate("/admin/categories");
    } catch (error: any) {
      console.error("Error saving category:", error);
      showToast(error.message || "Failed to save category", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (categoryId: string, categoryName: string) => {
    const confirmed = await confirm({
      title: "Delete Category",
      message: `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      try {
        await djidaliApi.deleteCategory(categoryId);
        showToast("Category deleted successfully", "success");
        fetchCategories();
      } catch (error: any) {
        console.error("Error deleting category:", error);
        showToast(
          error.message ||
            "Failed to delete category. It may have tours or subcategories.",
          "error",
        );
      }
    }
  };

  // Handle toggle active status
  const handleToggleStatus = async (categoryId: string) => {
    try {
      await djidaliApi.toggleCategoryStatus(categoryId);
      showToast("Category status updated", "success");
      fetchCategories();
    } catch (error) {
      console.error("Error toggling status:", error);
      showToast("Failed to update status", "error");
    }
  };

  // Filter categories by search
  const filteredCategories = categories.filter((cat) => {
    const name = getLocalizedName(cat).toLowerCase();
    const slug = cat.slug?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || slug.includes(query);
  });

  // Render category tree item
  const renderTreeItem = (
    category: ApiCategory,
    depth: number = 0,
  ): React.ReactNode => {
    return (
      <div key={category.id}>
        <div
          className={`flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700`}
          style={{ paddingLeft: `${depth * 24 + 12}px` }}
        >
          <div className="flex items-center gap-3">
            {depth > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {getLocalizedName(category)}
              </p>
              <p className="text-sm text-gray-500">{category.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleStatus(category.id)}
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                category.isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {category.isActive ? "Active" : "Inactive"}
            </button>
            <button
              onClick={() => {
                setEditingId(category.id);
                setShowForm(true);
              }}
              className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                handleDelete(category.id, getLocalizedName(category))
              }
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {category.children?.map((child) => renderTreeItem(child, depth + 1))}
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout title="Categories">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={
        showForm
          ? editingId
            ? "Edit Category"
            : "New Category"
          : "Tour Categories"
      }
      actions={
        !showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData(initialFormData);
            }}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </button>
        )
      }
    >
      {showForm ? (
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Language Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {(["uz", "ru", "en", "de"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveTab(lang)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === lang
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </nav>
            </div>

            {/* Name field based on active tab */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name ({activeTab.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required={activeTab === "uz"}
                  value={
                    activeTab === "uz"
                      ? formData.nameUz
                      : activeTab === "ru"
                        ? formData.nameRu
                        : activeTab === "en"
                          ? formData.nameEng
                          : formData.nameDe
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const key =
                      activeTab === "uz"
                        ? "nameUz"
                        : activeTab === "ru"
                          ? "nameRu"
                          : activeTab === "en"
                            ? "nameEng"
                            : "nameDe";
                    setFormData((prev) => ({
                      ...prev,
                      [key]: value,
                      ...(activeTab === "uz" && !editingId
                        ? { slug: generateSlug(value) }
                        : {}),
                    }));
                  }}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder={`Category name in ${activeTab.toUpperCase()}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: generateSlug(e.target.value),
                    }))
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="category-slug"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description ({activeTab.toUpperCase()})
              </label>
              <textarea
                rows={3}
                value={
                  activeTab === "uz"
                    ? formData.descriptionUz
                    : activeTab === "ru"
                      ? formData.descriptionRu
                      : activeTab === "en"
                        ? formData.descriptionEng
                        : formData.descriptionDe
                }
                onChange={(e) => {
                  const key =
                    activeTab === "uz"
                      ? "descriptionUz"
                      : activeTab === "ru"
                        ? "descriptionRu"
                        : activeTab === "en"
                          ? "descriptionEng"
                          : "descriptionDe";
                  setFormData((prev) => ({ ...prev, [key]: e.target.value }));
                }}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder={`Category description in ${activeTab.toUpperCase()}`}
              />
            </div>

            {/* Parent Category & Sort Order */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Parent Category
                </label>
                <select
                  value={formData.parentId || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      parentId: e.target.value || null,
                    }))
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">None (Root Category)</option>
                  {categories
                    .filter((c) => c.id !== editingId)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {getLocalizedName(cat)}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sortOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Icon URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Icon URL
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, icon: e.target.value }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="/icons/category.svg"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData(initialFormData);
                  navigate("/admin/categories");
                }}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {editingId ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Category Tree */}
          <div className="rounded-xl bg-white shadow-sm dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
              <FolderTree className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                Category Hierarchy
              </h3>
              <span className="ml-auto text-sm text-gray-500">
                {categories.length} categories
              </span>
            </div>

            {searchQuery ? (
              // Flat list for search results
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getLocalizedName(category)}
                      </p>
                      <p className="text-sm text-gray-500">{category.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(category.id)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(category.id);
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(category.id, getLocalizedName(category))
                        }
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredCategories.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No categories found matching "{searchQuery}"
                  </div>
                )}
              </div>
            ) : (
              // Tree view
              <div>
                {treeCategories.map((category) => renderTreeItem(category))}
                {treeCategories.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No categories yet. Create your first category!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CategoriesPage;
