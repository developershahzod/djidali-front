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
  Upload,
  X,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { djidaliApi, ApiNewsArticle } from "../../services/djidaliApi";
import { useToast } from "../../contexts/ToastContext";
import { useConfirm } from "../../contexts/ConfirmContext";
import { cn } from "../../lib/utils";
import { getImageUrl } from "../../utils/imageUtils";
import { RichTextEditor } from "../../components/admin/RichTextEditor";

// Use ApiNewsArticle from djidaliApi for type consistency

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
  const [news, setNews] = useState<ApiNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ApiNewsArticle | null>(
    null,
  );
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<"ru" | "uz" | "en" | "de">("ru");
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error({
        title: "Ошибка",
        message: "Максимальный размер файла 10MB",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error({
        title: "Ошибка",
        message: "Разрешены только PNG, JPG, WEBP, GIF",
      });
      return;
    }

    setIsUploading(true);
    try {
      const response = await djidaliApi.uploadImages([file]);
      if (response.urls && response.urls.length > 0) {
        setFormData((prev) => ({ ...prev, imageUrl: response.urls[0] }));
        toast.success("Изображение загружено");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error({
        title: "Ошибка загрузки",
        message: "Не удалось загрузить изображение",
      });
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  // Upload image for rich text editor (returns URL)
  const handleEditorImageUpload = async (file: File): Promise<string> => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 10MB");
      throw new Error("File too large");
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Допустимы только изображения (PNG, JPEG, WEBP, GIF)");
      throw new Error("Invalid file type");
    }

    const result = await djidaliApi.uploadImages([file]);
    if (result.urls && result.urls.length > 0) {
      return getImageUrl(result.urls[0]);
    }
    throw new Error("Upload failed");
  };

  // Handle content change from RichTextEditor
  const handleContentChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

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

  const openEditModal = async (article: ApiNewsArticle) => {
    // Fetch full article data since list may not include all content fields
    setIsLoadingEdit(true);
    try {
      const fullArticle = await djidaliApi.getNewsById(article.id);
      setEditingArticle(fullArticle);
      setFormData({
        titleRu: fullArticle.titleRu || "",
        titleUz: fullArticle.titleUz || "",
        titleEn: fullArticle.titleEn || "",
        titleDe: fullArticle.titleDe || "",
        summaryRu: fullArticle.summaryRu || "",
        summaryUz: fullArticle.summaryUz || "",
        summaryEn: fullArticle.summaryEn || "",
        summaryDe: fullArticle.summaryDe || "",
        contentRu: fullArticle.contentRu || "",
        contentUz: fullArticle.contentUz || "",
        contentEn: fullArticle.contentEn || "",
        contentDe: fullArticle.contentDe || "",
        slug: fullArticle.slug || "",
        imageUrl: fullArticle.imageUrl || "",
        isPublished: fullArticle.isPublished || false,
      });
      setActiveTab("ru"); // Reset to Russian tab when opening
      setShowModal(true);
    } catch (error) {
      console.error("Failed to load article:", error);
      toast.error("Не удалось загрузить статью для редактирования");
    } finally {
      setIsLoadingEdit(false);
    }
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

  // Check if a language has content filled (title and content are required)
  const hasLanguageContent = (lang: "ru" | "uz" | "en" | "de"): boolean => {
    const langSuffix = lang.charAt(0).toUpperCase() + lang.slice(1);
    const title = formData[
      `title${langSuffix}` as keyof NewsFormData
    ] as string;
    const content = formData[
      `content${langSuffix}` as keyof NewsFormData
    ] as string;
    // Consider content filled if both title and content have meaningful content
    return (
      Boolean(title?.trim()) &&
      Boolean(content?.trim() && content !== "<p></p>")
    );
  };

  return (
    <AdminLayout
      title="Управление новостями"
      subtitle="Контент-менеджмент"
      actions={
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8F6E47] to-[#BFA480] px-3 py-2 text-xs sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Добавить новость</span>
          <span className="sm:hidden">Новость</span>
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

      {/* News List */}
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
        <>
          {/* Mobile Card Layout */}
          <div className="space-y-3 md:hidden">
            {filteredNews.map((article) => (
              <div
                key={article.id}
                className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {article.imageUrl ? (
                    <img
                      src={getImageUrl(article.imageUrl)}
                      alt={article.titleRu}
                      className="h-14 w-14 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F2E5D3] flex-shrink-0">
                      <ImageIcon className="h-6 w-6 text-[#BFA480]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#2F2A24] text-sm line-clamp-2">
                      {article.titleRu || "Без названия"}
                    </p>
                    <p className="text-xs text-[#8E7A5E] mt-0.5 truncate">
                      {article.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F2E5D3]">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
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
                    <span className="text-xs text-[#8E7A5E]">
                      {article.isPublished && article.publishedAt
                        ? formatDate(article.publishedAt)
                        : formatDate(article.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={`/news/${article.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-[#8E7A5E] hover:bg-[#F2E5D3]"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => openEditModal(article)}
                      disabled={isLoadingEdit}
                      className="rounded-lg p-2 text-[#8E7A5E] hover:bg-[#F2E5D3] disabled:opacity-50"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="rounded-lg p-2 text-[#8E7A5E] hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-lg">
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
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {article.isPublished && article.publishedAt
                              ? formatDate(article.publishedAt)
                              : formatDate(article.createdAt)}
                          </span>
                        </div>
                        {article.isPublished && article.publishedAt && (
                          <span className="text-xs text-[#8E7A5E]">
                            Опубликовано
                          </span>
                        )}
                        {!article.isPublished && (
                          <span className="text-xs text-[#8E7A5E]">Создано</span>
                        )}
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
                          disabled={isLoadingEdit}
                          className="rounded-lg p-2 text-[#8E7A5E] transition-colors hover:bg-[#F2E5D3] hover:text-[#2F2A24] disabled:opacity-50"
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
        </>
      )}

      {/* Loading overlay for edit */}
      {isLoadingEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#BFA480]/40 border-t-[#8F6E47]" />
            <span className="text-sm text-[#6B5B4C]">Загрузка статьи...</span>
          </div>
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
              {tabs.map((tab) => {
                const hasFilled = hasLanguageContent(tab.key);
                return (
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
                    {/* Content filled indicator */}
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        hasFilled
                          ? "bg-green-500"
                          : activeTab === tab.key
                            ? "bg-white/30"
                            : "bg-gray-300",
                      )}
                      title={
                        hasFilled ? "Контент заполнен" : "Контент не заполнен"
                      }
                    />
                  </button>
                );
              })}
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

              {/* Content - Rich Text Editor */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                  Содержание ({activeTab.toUpperCase()})
                </label>
                <RichTextEditor
                  key={activeTab}
                  content={
                    formData[
                      `content${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof NewsFormData
                    ] as string
                  }
                  onChange={(value) =>
                    handleContentChange(
                      `content${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`,
                      value,
                    )
                  }
                  onImageUpload={handleEditorImageUpload}
                  placeholder="Напишите содержание новости... Вы можете добавлять изображения, видео, форматирование."
                  minHeight="300px"
                  className="rounded-xl border-[#E2D5C1]"
                />
              </div>

              {/* Slug */}
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

              {/* Image Upload */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                  Изображение
                </label>
                {formData.imageUrl ? (
                  <div className="relative rounded-xl border border-[#E2D5C1] overflow-hidden">
                    <img
                      src={getImageUrl(formData.imageUrl)}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-[#E2D5C1] bg-[#F7F1E6]/50 cursor-pointer hover:bg-[#F7F1E6] transition-colors">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#BFA480]/40 border-t-[#8F6E47]" />
                        <span className="text-sm text-[#6B5B4C]">
                          Загрузка...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-[#BFA480]" />
                        <span className="text-sm text-[#6B5B4C]">
                          Нажмите для загрузки
                        </span>
                        <span className="text-xs text-[#8E7A5E]">
                          PNG, JPG, WEBP, GIF (макс. 10MB)
                        </span>
                      </div>
                    )}
                  </label>
                )}
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
