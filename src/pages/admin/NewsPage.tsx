import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Globe,
  ImageIcon,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { djidaliApi } from "../../services/djidaliApi";
import { useToast } from "../../contexts/ToastContext";
import { useConfirm } from "../../contexts/ConfirmContext";
import { cn } from "../../lib/utils";
import { getImageUrl } from "../../utils/imageUtils";

interface NewsArticle {
  id: string;
  titleRu: string;
  titleUz: string;
  titleEn: string;
  titleDe: string;
  summaryRu: string;
  summaryUz: string;
  summaryEn: string;
  summaryDe: string;
  contentRu: string;
  contentUz: string;
  contentEn: string;
  contentDe: string;
  slug: string;
  imageUrl: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NewsFormData {
  titleRu: string;
  titleUz: string;
  titleEn: string;
  titleDe: string;
  summaryRu: string;
  summaryUz: string;
  summaryEn: string;
  summaryDe: string;
  contentRu: string;
  contentUz: string;
  contentEn: string;
  contentDe: string;
  slug: string;
  imageUrl: string;
  isPublished: boolean;
}

const initialFormData: NewsFormData = {
  titleRu: "",
  titleUz: "",
  titleEn: "",
  titleDe: "",
  summaryRu: "",
  summaryUz: "",
  summaryEn: "",
  summaryDe: "",
  contentRu: "",
  contentUz: "",
  contentEn: "",
  contentDe: "",
  slug: "",
  imageUrl: "",
  isPublished: false,
};

const AdminNewsPage = () => {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(
    null,
  );
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<"ru" | "uz" | "en" | "de">("ru");
  const [saving, setSaving] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await djidaliApi.getNews();
      setNews(response.data || []);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s-]/gi, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from Russian title if slug is empty
      if (name === "titleRu" && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const openEditModal = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      titleRu: article.titleRu || "",
      titleUz: article.titleUz || "",
      titleEn: article.titleEn || "",
      titleDe: article.titleDe || "",
      summaryRu: article.summaryRu || "",
      summaryUz: article.summaryUz || "",
      summaryEn: article.summaryEn || "",
      summaryDe: article.summaryDe || "",
      contentRu: article.contentRu || "",
      contentUz: article.contentUz || "",
      contentEn: article.contentEn || "",
      contentDe: article.contentDe || "",
      slug: article.slug || "",
      imageUrl: article.imageUrl || "",
      isPublished: article.isPublished || false,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editingArticle) {
        await djidaliApi.updateNews(editingArticle.id, formData);
      } else {
        await djidaliApi.createNews(formData);
      }
      setShowModal(false);
      setEditingArticle(null);
      setFormData(initialFormData);
      fetchNews();
      toast.success(editingArticle ? "Новость обновлена" : "Новость создана");
    } catch (error) {
      console.error("Failed to save news:", error);
      toast.error({
        title: "Ошибка сохранения",
        message: error instanceof Error ? error.message : "Неизвестная ошибка",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Удалить новость",
      message: "Вы уверены, что хотите удалить эту новость?",
      confirmText: "Удалить",
      cancelText: "Отмена",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await djidaliApi.deleteNews(id);
      toast.success("Новость удалена");
    } catch (error) {
      console.error("Failed to delete news:", error);
      // If 404, the item doesn't exist - still refresh to clean up stale data
      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage.includes("not found") || errorMessage.includes("404")) {
        toast.info("Новость уже была удалена");
      } else {
        toast.error("Ошибка удаления");
      }
    } finally {
      // Always refresh to sync with backend
      fetchNews();
    }
  };

  // Safe date formatting
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("ru-RU");
  };

  const filteredNews = news.filter(
    (article) =>
      article.titleRu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.titleEn?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tabs = [
    { key: "ru" as const, label: "Русский" },
    { key: "uz" as const, label: "O'zbek" },
    { key: "en" as const, label: "English" },
    { key: "de" as const, label: "Deutsch" },
  ];

  return (
    <AdminLayout
      title="Управление новостями"
      subtitle="Контент-менеджмент"
      actions={
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8F6E47] to-[#BFA480] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Добавить новость
        </button>
      }
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E7A5E]" />
          <input
            type="text"
            placeholder="Поиск новостей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/50 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-[#2F2A24] placeholder:text-[#B0A398] backdrop-blur focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
          />
        </div>
      </div>

      {/* News Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#BFA480]/40 border-t-[#8F6E47]" />
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#BFA480]/50 bg-white/70 px-6 py-16 text-center">
          <ImageIcon className="mx-auto h-14 w-14 text-[#BFA480]" />
          <h3 className="mt-6 text-xl font-semibold text-[#2F2A24]">
            Нет новостей
          </h3>
          <p className="mt-2 text-sm text-[#6B5B4C]">
            Создайте первую новость для отображения на сайте
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-lg">
          <table className="min-w-full divide-y divide-white/60">
            <thead className="bg-[#F7F1E6]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8E7A5E]">
                  Новость
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8E7A5E]">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8E7A5E]">
                  Дата
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#8E7A5E]">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 bg-white">
              {filteredNews.map((article) => (
                <tr key={article.id} className="hover:bg-[#F7F1E6]/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {article.imageUrl ? (
                        <img
                          src={getImageUrl(article.imageUrl)}
                          alt={article.titleRu}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F2E5D3]">
                          <ImageIcon className="h-6 w-6 text-[#BFA480]" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#2F2A24]">
                          {article.titleRu || "Без названия"}
                        </p>
                        <p className="text-xs text-[#8E7A5E]">{article.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                        article.isPublished
                          ? "bg-[#E5F4EC] text-[#2F4A3A]"
                          : "bg-[#FEF3C7] text-[#92400E]",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          article.isPublished ? "bg-[#2F4A3A]" : "bg-[#92400E]",
                        )}
                      />
                      {article.isPublished ? "Опубликовано" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B5B4C]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(article.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/news/${article.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 text-[#8E7A5E] transition-colors hover:bg-[#F2E5D3] hover:text-[#2F2A24]"
                        title="Просмотр"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(article)}
                        className="rounded-lg p-2 text-[#8E7A5E] transition-colors hover:bg-[#F2E5D3] hover:text-[#2F2A24]"
                        title="Редактировать"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="rounded-lg p-2 text-[#8E7A5E] transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Удалить"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="mb-6 text-2xl font-semibold text-[#2F2A24]">
              {editingArticle ? "Редактировать новость" : "Новая новость"}
            </h2>

            {/* Language Tabs */}
            <div className="mb-6 flex gap-2 border-b border-[#E2D5C1] pb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.key
                      ? "bg-[#2F2A24] text-white"
                      : "bg-[#F7F1E6] text-[#6B5B4C] hover:bg-[#E2D5C1]",
                  )}
                >
                  <Globe className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                  Заголовок ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  name={`title${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                  value={
                    formData[
                      `title${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof NewsFormData
                    ] as string
                  }
                  onChange={
                    activeTab === "ru" ? handleTitleChange : handleInputChange
                  }
                  className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                  placeholder="Введите заголовок..."
                />
              </div>

              {/* Summary */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                  Краткое описание ({activeTab.toUpperCase()})
                </label>
                <textarea
                  name={`summary${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                  value={
                    formData[
                      `summary${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof NewsFormData
                    ] as string
                  }
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                  placeholder="Краткое описание для превью..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                  Содержание ({activeTab.toUpperCase()})
                </label>
                <textarea
                  name={`content${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                  value={
                    formData[
                      `content${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof NewsFormData
                    ] as string
                  }
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                  placeholder="Полный текст новости..."
                />
              </div>

              {/* Slug & Image (only shown once) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                    URL-путь (slug)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                    placeholder="my-news-article"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                    URL изображения
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Published checkbox */}
              <label className="flex items-center gap-3 rounded-xl border border-[#E2D5C1] bg-[#F7F1E6]/50 px-4 py-3">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-[#BFA480] text-[#8F6E47] focus:ring-[#BFA480]"
                />
                <span className="text-sm font-medium text-[#2F2A24]">
                  Опубликовать сразу
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingArticle(null);
                  setFormData(initialFormData);
                }}
                className="rounded-xl border border-[#E2D5C1] bg-white px-6 py-2.5 text-sm font-medium text-[#6B5B4C] transition-colors hover:bg-[#F7F1E6]"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-[#8F6E47] to-[#BFA480] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {saving
                  ? "Сохранение..."
                  : editingArticle
                    ? "Сохранить"
                    : "Создать"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminNewsPage;
