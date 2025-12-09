import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Image,
  Upload,
  X,
  Loader2,
  Star,
  GripVertical,
  AlertCircle,
} from "lucide-react";
import { useTourWizardStore } from "../hooks/useTourWizardStore";
import { djidaliApi } from "../../../services/djidaliApi";
import { getImageUrl } from "../../../utils/imageUtils";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const MediaStep: React.FC = () => {
  const { formData, addImages, removeImage, reorderImages } =
    useTourWizardStore();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploadError(null);
      const selectedFiles = Array.from(files);

      // Check file sizes
      const oversizedFiles = selectedFiles.filter(
        (file) => file.size > MAX_FILE_SIZE_BYTES,
      );
      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map((f) => f.name).join(", ");
        setUploadError(
          t("wizard.media.fileSizeError")
            .replace("{size}", String(MAX_FILE_SIZE_MB))
            .replace("{files}", fileNames),
        );
        return;
      }

      // Check file types
      const invalidFiles = selectedFiles.filter(
        (file) => !file.type.startsWith("image/"),
      );
      if (invalidFiles.length > 0) {
        setUploadError(t("wizard.media.onlyImagesError"));
        return;
      }

      setIsUploading(true);
      try {
        const response = await djidaliApi.uploadImages(selectedFiles);
        if (response.urls && response.urls.length > 0) {
          addImages(response.urls);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError(t("wizard.media.uploadFailed"));
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [addImages],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderImages(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-4">
          <Image className="w-8 h-8 text-pink-600" />
        </div>
        <h2
          className="text-2xl font-semibold text-slate-900 mb-2"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {t("wizard.media.heroTitle")}
        </h2>
        <p className="text-slate-500 max-w-md mx-auto">
          {t("wizard.media.heroDescription")}
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        variants={itemVariants}
        className={cn(
          "relative bg-white rounded-xl border-2 border-dashed p-8 transition-colors",
          isDragOver
            ? "border-emerald-400 bg-emerald-50"
            : "border-stone-300 hover:border-stone-400",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-stone-400" />
            )}
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">
            {isUploading
              ? t("wizard.media.uploading")
              : t("wizard.media.dropImages")}
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {t("wizard.media.orClickBrowse")}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-4 h-4" />
            {t("wizard.media.chooseFiles")}
          </button>
          <p className="mt-4 text-xs text-slate-400">
            {t("wizard.media.fileTypes").replace(
              "{size}",
              String(MAX_FILE_SIZE_MB),
            )}
          </p>
        </div>
      </motion.div>

      {/* Error Display */}
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{uploadError}</p>
          <button
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Image Gallery */}
      {formData.images.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              {t("wizard.media.gallery")} ({formData.images.length}{" "}
              {formData.images.length === 1
                ? t("wizard.media.image")
                : t("wizard.media.images")}
              )
            </h3>
            <p className="text-sm text-slate-500">
              {t("wizard.media.dragToReorder")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <motion.div
                key={`${image}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "relative group aspect-square rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing",
                  index === 0 ? "border-emerald-400" : "border-transparent",
                  draggedIndex === index && "opacity-50",
                )}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Tour image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://via.placeholder.com/400x300?text=Image";
                  }}
                />

                {/* Cover badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                    <Star className="w-3 h-3" />
                    {t("wizard.media.cover")}
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30">
                    <GripVertical className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {formData.images.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 bg-stone-50 rounded-xl border border-stone-200"
        >
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-stone-400" />
          </div>
          <h4 className="font-medium text-slate-700 mb-2">
            {t("wizard.media.noImagesYet")}
          </h4>
          <p className="text-sm text-slate-500">
            {t("wizard.media.uploadAtLeastOne")}
          </p>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100"
      >
        <h4 className="font-semibold text-pink-900 mb-4">
          {t("wizard.media.photoTips")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 text-xs font-bold">
              1
            </span>
            <div>
              <p className="font-medium text-slate-800">
                {t("wizard.media.tip1Title")}
              </p>
              <p className="text-slate-600">{t("wizard.media.tip1Desc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 text-xs font-bold">
              2
            </span>
            <div>
              <p className="font-medium text-slate-800">
                {t("wizard.media.tip2Title")}
              </p>
              <p className="text-slate-600">{t("wizard.media.tip2Desc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 text-xs font-bold">
              3
            </span>
            <div>
              <p className="font-medium text-slate-800">
                {t("wizard.media.tip3Title")}
              </p>
              <p className="text-slate-600">{t("wizard.media.tip3Desc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 text-xs font-bold">
              4
            </span>
            <div>
              <p className="font-medium text-slate-800">
                {t("wizard.media.tip4Title")}
              </p>
              <p className="text-slate-600">{t("wizard.media.tip4Desc")}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MediaStep;
