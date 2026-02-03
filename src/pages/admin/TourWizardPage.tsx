import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TourWizardLayout } from "../../features/tour-wizard/components/TourWizardLayout";
import { useTourWizardStore } from "../../features/tour-wizard/hooks/useTourWizardStore";
import { djidaliApi, ApiTour } from "../../services/djidaliApi";
import { useToast } from "../../contexts/ToastContext";
import {
  TourWizardData,
  defaultTourWizardData,
} from "../../features/tour-wizard/types";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";

// User-friendly field name mappings
const fieldLabels: Record<string, string> = {
  title: "Tour title",
  titleUz: "Tour title (Uzbek)",
  titleRu: "Tour title (Russian)",
  titleEng: "Tour title (English)",
  titleDe: "Tour title (German)",
  description: "Description",
  descriptionUz: "Description (Uzbek)",
  descriptionRu: "Description (Russian)",
  descriptionEng: "Description (English)",
  descriptionDe: "Description (German)",
  destination: "Destination",
  duration: "Duration",
  price: "Price",
  currency: "Currency",
  maxParticipants: "Max participants",
  startDate: "Start date",
  endDate: "End date",
  categoryId: "Category",
  inclusions: "Included in price",
  exclusions: "Not included",
  itinerary: "Tour program",
  program: "Day-by-day program",
  images: "Tour images",
  uz: "Uzbek text",
  ru: "Russian text",
  eng: "English text",
  de: "German text",
};

// Parse validation errors from API response into user-friendly messages
const parseValidationErrors = (error: unknown): string[] => {
  if (!(error instanceof AxiosError)) return [];

  const response = error.response?.data;
  if (!response) return [];

  // Handle NestJS validation error format: { message: string[] }
  const messages = response.message;
  if (!Array.isArray(messages)) return [];

  return messages.map((msg: string) => {
    // Parse messages like "inclusions.0.uz must be longer than or equal to 1 characters"
    // or "title must be a string"

    // Extract field path (e.g., "inclusions.0.uz" or "title")
    const fieldMatch = msg.match(/^([a-zA-Z0-9_.]+)\s/);
    if (!fieldMatch) return msg;

    const fieldPath = fieldMatch[1];
    const pathParts = fieldPath.split(".");

    // Build user-friendly field name
    let friendlyField = "";
    for (const part of pathParts) {
      // Skip array indices (numbers)
      if (/^\d+$/.test(part)) continue;

      const label = fieldLabels[part];
      if (label) {
        friendlyField = friendlyField ? `${friendlyField} - ${label}` : label;
      }
    }

    if (!friendlyField) {
      friendlyField = fieldPath;
    }

    // Simplify the error message
    if (
      msg.includes("must be longer than or equal to") ||
      msg.includes("should not be empty")
    ) {
      return `Please fill in the "${friendlyField}" field`;
    }
    if (msg.includes("must be a string")) {
      return `"${friendlyField}" must be text`;
    }
    if (msg.includes("must be a number")) {
      return `"${friendlyField}" must be a number`;
    }
    if (msg.includes("must be a valid")) {
      return `Please enter a valid ${friendlyField.toLowerCase()}`;
    }

    // Default: show original message with friendly field name
    return `${friendlyField}: ${msg.replace(fieldPath, "").trim()}`;
  });
};

const TourWizardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { formData, editingTourId, loadTourForEditing, resetWizard } =
    useTourWizardStore();
  const [isLoading, setIsLoading] = useState(false);

  // Load tour data when editing
  useEffect(() => {
    const loadTourData = async () => {
      if (!id) {
        // If no ID, reset wizard for new tour creation
        if (editingTourId) {
          resetWizard();
        }
        return;
      }

      // Skip if already editing this tour
      if (editingTourId === id) return;

      setIsLoading(true);
      try {
        const tour = await djidaliApi.getTour(id);
        const wizardData = transformApiTourToWizardData(tour);
        loadTourForEditing(id, wizardData);
      } catch (error) {
        console.error("Failed to load tour for editing:", error);
        toast.error({
          title: "Error",
          message: "Failed to load tour data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTourData();
  }, [id, editingTourId, loadTourForEditing, resetWizard, toast]);

  // Transform API tour data to wizard format
  const transformApiTourToWizardData = (tour: ApiTour): TourWizardData => {
    const tourExt = tour as ApiTour & {
      titleUz?: string;
      titleRu?: string;
      titleEng?: string;
      titleDe?: string;
      descriptionUz?: string;
      descriptionRu?: string;
      descriptionEng?: string;
      descriptionDe?: string;
      program?: Array<{
        dayNumber?: number;
        titleUz?: string;
        titleRu?: string;
        titleEng?: string;
        titleDe?: string;
        descriptionUz?: string;
        descriptionRu?: string;
        descriptionEng?: string;
        descriptionDe?: string;
      }>;
      inclusions?: Array<{
        uz?: string;
        ru?: string;
        eng?: string;
        de?: string;
      }>;
      exclusions?: Array<{
        uz?: string;
        ru?: string;
        eng?: string;
        de?: string;
      }>;
      currency?: string;
      categoryId?: string;
      category?: { id: string };
      latitude?: number | null;
      longitude?: number | null;
    };

    // Extract multilingual title
    const title = {
      uz:
        tourExt.titleUz ||
        (typeof tour.title === "object"
          ? (tour.title as Record<string, string>).uz
          : "") ||
        "",
      ru:
        tourExt.titleRu ||
        (typeof tour.title === "object"
          ? (tour.title as Record<string, string>).ru
          : (tour.title as string)) ||
        "",
      eng:
        tourExt.titleEng ||
        (typeof tour.title === "object"
          ? (tour.title as Record<string, string>).eng
          : "") ||
        "",
      de:
        tourExt.titleDe ||
        (typeof tour.title === "object"
          ? (tour.title as Record<string, string>).de
          : "") ||
        "",
    };

    // Extract multilingual description
    const description = {
      uz:
        tourExt.descriptionUz ||
        (typeof tour.description === "object"
          ? (tour.description as Record<string, string>).uz
          : "") ||
        "",
      ru:
        tourExt.descriptionRu ||
        (typeof tour.description === "object"
          ? (tour.description as Record<string, string>).ru
          : (tour.description as string)) ||
        "",
      eng:
        tourExt.descriptionEng ||
        (typeof tour.description === "object"
          ? (tour.description as Record<string, string>).eng
          : "") ||
        "",
      de:
        tourExt.descriptionDe ||
        (typeof tour.description === "object"
          ? (tour.description as Record<string, string>).de
          : "") ||
        "",
    };

    // Transform itinerary/program (check both program and programDays)
    // Handle both flat format (titleRu) and nested format (title.ru)
    const programData = tourExt.program || (tour as any).programDays || [];
    const itinerary = programData.map((day: any, index: number) => ({
      dayNumber: day.dayNumber || day.day_number || index + 1,
      title: {
        uz: day.titleUz || day.title_uz || day.title?.uz || "",
        ru: day.titleRu || day.title_ru || day.title?.ru || "",
        eng: day.titleEng || day.title_eng || day.title?.eng || "",
        de: day.titleDe || day.title_de || day.title?.de || "",
      },
      description: {
        uz:
          day.descriptionUz || day.description_uz || day.description?.uz || "",
        ru:
          day.descriptionRu || day.description_ru || day.description?.ru || "",
        eng:
          day.descriptionEng ||
          day.description_eng ||
          day.description?.eng ||
          "",
        de:
          day.descriptionDe || day.description_de || day.description?.de || "",
      },
    }));

    // Transform inclusions
    const inclusions = (tourExt.inclusions || []).map((item) => ({
      uz: item.uz || "",
      ru: item.ru || "",
      eng: item.eng || "",
      de: item.de || "",
    }));

    // Transform exclusions
    const exclusions = (tourExt.exclusions || []).map((item) => ({
      uz: item.uz || "",
      ru: item.ru || "",
      eng: item.eng || "",
      de: item.de || "",
    }));

    // Format dates
    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "";
      try {
        return new Date(dateStr).toISOString().split("T")[0];
      } catch {
        return "";
      }
    };

    return {
      ...defaultTourWizardData,
      title,
      description,
      destination: tour.destination || "",
      regions: (tour as any).regions || [],
      latitude: tourExt.latitude ?? null,
      longitude: tourExt.longitude ?? null,
      duration: tour.duration || 1,
      price: typeof tour.price === "number" ? tour.price : 0,
      currency: tourExt.currency || "UZS",
      maxParticipants: tour.maxParticipants || 10,
      startDate: formatDate(tour.startDate),
      endDate: formatDate(tour.endDate),
      status: (tour.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
      categoryId: tourExt.categoryId || tourExt.category?.id || "",
      images: tour.images || [],
      itinerary:
        itinerary.length > 0 ? itinerary : defaultTourWizardData.itinerary,
      inclusions:
        inclusions.length > 0 ? inclusions : defaultTourWizardData.inclusions,
      exclusions:
        exclusions.length > 0 ? exclusions : defaultTourWizardData.exclusions,
    };
  };

  // Show loading state while fetching tour data
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-stone-50 z-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading tour data...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    // Transform wizard data to API format
    const programPayload = formData.itinerary.map((step, index) => ({
      dayNumber: index + 1,
      titleUz: step.title.uz,
      titleRu: step.title.ru,
      titleEng: step.title.eng,
      titleDe: step.title.de,
      descriptionUz: step.description.uz,
      descriptionRu: step.description.ru,
      descriptionEng: step.description.eng,
      descriptionDe: step.description.de,
    }));

    const itineraryPayload = formData.itinerary.reduce(
      (acc, step, index) => {
        const dayKey = `day${index + 1}`;
        acc[dayKey] =
          step.description.ru ||
          step.description.eng ||
          step.description.uz ||
          "No description";
        return acc;
      },
      {} as Record<string, string>,
    );

    // Transform multilingual inclusions/exclusions
    const inclusionsPayload = formData.inclusions
      .filter((inc) => inc.ru || inc.eng || inc.uz || inc.de)
      .map((inc) => ({
        uz: inc.uz,
        ru: inc.ru,
        eng: inc.eng,
        de: inc.de,
      }));

    const exclusionsPayload = formData.exclusions
      .filter((exc) => exc.ru || exc.eng || exc.uz || exc.de)
      .map((exc) => ({
        uz: exc.uz,
        ru: exc.ru,
        eng: exc.eng,
        de: exc.de,
      }));

    const saveData = {
      // Multilingual title
      title: formData.title.ru || formData.title.eng || formData.title.uz || "",
      titleUz: formData.title.uz,
      titleRu: formData.title.ru,
      titleEng: formData.title.eng,
      titleDe: formData.title.de,

      // Multilingual description
      description:
        formData.description.ru ||
        formData.description.eng ||
        formData.description.uz ||
        "",
      descriptionUz: formData.description.uz,
      descriptionRu: formData.description.ru,
      descriptionEng: formData.description.eng,
      descriptionDe: formData.description.de,

      // Basic fields
      destination: formData.destination,
      regions: formData.regions || [],
      latitude: formData.latitude,
      longitude: formData.longitude,
      duration: formData.duration,
      price: formData.price,
      currency: formData.currency,
      maxParticipants: formData.maxParticipants,
      // Dates are required - send ISO string or empty for validation error
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : "",
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : "",
      status: formData.status,
      categoryId: formData.categoryId,

      // Arrays
      images: formData.images.filter((img) => img.trim()),
      inclusions: inclusionsPayload,
      exclusions: exclusionsPayload,
      itinerary: itineraryPayload,
      program: programPayload,
    };

    try {
      if (editingTourId) {
        await djidaliApi.updateTour(editingTourId, saveData);
        toast.success({
          title: "Tour Updated",
          message: "Your tour has been updated successfully.",
        });
      } else {
        await djidaliApi.createTour(saveData);
        toast.success({
          title: "Tour Published",
          message: "Your new tour has been published successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to save tour:", error);

      // Parse validation errors for user-friendly messages
      const validationErrors = parseValidationErrors(error);

      if (validationErrors.length > 0) {
        // Show first 3 errors max to avoid overwhelming the user
        const displayErrors = validationErrors.slice(0, 3);
        const remainingCount = validationErrors.length - 3;

        toast.error({
          title: "Please check the following fields",
          message:
            displayErrors.join("\n") +
            (remainingCount > 0 ? `\n...and ${remainingCount} more` : ""),
        });
      } else {
        toast.error({
          title: "Error",
          message: "Failed to save tour. Please try again.",
        });
      }
      throw error;
    }
  };

  return <TourWizardLayout onSubmit={handleSubmit} />;
};

export default TourWizardPage;
