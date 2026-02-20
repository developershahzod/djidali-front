import { z } from "zod";

// ============================================================================
// MULTILINGUAL FIELD SCHEMAS
// ============================================================================

export const multilingualTextSchema = z.object({
  uz: z.string().default(""),
  ru: z.string().default(""),
  eng: z.string().default(""),
  de: z.string().default(""),
});

export type MultilingualText = z.infer<typeof multilingualTextSchema>;

// ============================================================================
// ITINERARY STEP SCHEMA
// ============================================================================

export const itineraryStepSchema = z.object({
  dayNumber: z.number().min(1),
  title: multilingualTextSchema,
  description: multilingualTextSchema,
});

export type ItineraryStep = z.infer<typeof itineraryStepSchema>;

// ============================================================================
// STEP-SPECIFIC SCHEMAS (for per-step validation)
// ============================================================================

// Step 1: Essentials
export const essentialsStepSchema = z.object({
  title: multilingualTextSchema.refine(
    (data) =>
      data.uz.trim() || data.ru.trim() || data.eng.trim() || data.de.trim(),
    { message: "At least one language title is required" },
  ),
  categoryId: z.string().min(1, "Category is required"),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  price: z.number().min(0, "Price must be positive"),
  currency: z.enum(["UZS", "USD", "EUR"]),
  status: z.enum([
    "ACTIVE",
    "INACTIVE",
    "CANCELLED",
    "COMPLETED",
    "FULLY_BOOKED",
  ]),
});

export type EssentialsStepData = z.infer<typeof essentialsStepSchema>;

// Step 2: Experience
export const experienceStepSchema = z.object({
  description: multilingualTextSchema.refine(
    (data) =>
      data.uz.trim() || data.ru.trim() || data.eng.trim() || data.de.trim(),
    { message: "At least one language description is required" },
  ),
  itinerary: z
    .array(itineraryStepSchema)
    .min(1, "At least one day is required"),
  inclusions: z.array(multilingualTextSchema),
  exclusions: z.array(multilingualTextSchema),
});

export type ExperienceStepData = z.infer<typeof experienceStepSchema>;

// Predefined regions for search/filtering
export const TOUR_REGIONS = [
  {
    value: "Dalverzin",
    labelRu: "Дальверзин",
    labelUz: "Dalverzin",
    labelEn: "Dalverzin",
  },
  {
    value: "Tashkent",
    labelRu: "Ташкент",
    labelUz: "Toshkent",
    labelEn: "Tashkent",
  },
  {
    value: "Samarkand",
    labelRu: "Самарканд",
    labelUz: "Samarqand",
    labelEn: "Samarkand",
  },
  {
    value: "Bukhara",
    labelRu: "Бухара",
    labelUz: "Buxoro",
    labelEn: "Bukhara",
  },
  { value: "Khiva", labelRu: "Хива", labelUz: "Xiva", labelEn: "Khiva" },
  {
    value: "Fergana",
    labelRu: "Фергана",
    labelUz: "Farg'ona",
    labelEn: "Fergana",
  },
  { value: "Nukus", labelRu: "Нукус", labelUz: "Nukus", labelEn: "Nukus" },
  { value: "Termez", labelRu: "Термез", labelUz: "Termiz", labelEn: "Termez" },
] as const;

// Step 3: Logistics
export const logisticsStepSchema = z
  .object({
    destination: z.string().min(1, "Destination is required"),
    regions: z.array(z.string()).default([]),
    maxParticipants: z.number().min(1, "Must have at least 1 participant"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) > new Date(data.startDate);
    },
    { message: "End date must be after start date", path: ["endDate"] },
  );

export type LogisticsStepData = z.infer<typeof logisticsStepSchema>;

// Step 4: Media
export const mediaStepSchema = z.object({
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export type MediaStepData = z.infer<typeof mediaStepSchema>;

// ============================================================================
// COMPLETE TOUR SCHEMA
// ============================================================================

export const tourWizardSchema = z.object({
  // Step 1: Essentials
  title: multilingualTextSchema,
  categoryId: z.string(),
  duration: z.number(),
  price: z.number(),
  currency: z.enum(["UZS", "USD", "EUR"]),
  status: z.enum([
    "ACTIVE",
    "INACTIVE",
    "CANCELLED",
    "COMPLETED",
    "FULLY_BOOKED",
  ]),

  // Step 2: Experience
  description: multilingualTextSchema,
  itinerary: z.array(itineraryStepSchema),
  inclusions: z.array(multilingualTextSchema),
  exclusions: z.array(multilingualTextSchema),

  // Step 3: Logistics
  destination: z.string(),
  regions: z.array(z.string()).default([]),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  maxParticipants: z.number(),
  startDate: z.string(),
  endDate: z.string(),

  // Step 4: Media
  images: z.array(z.string()),
});

export type TourWizardData = z.infer<typeof tourWizardSchema>;

// ============================================================================
// WIZARD STATE
// ============================================================================

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export const WIZARD_STEPS = [
  {
    id: 1,
    titleKey: "wizard.steps.essentials",
    descKey: "wizard.steps.essentialsDesc",
  },
  {
    id: 2,
    titleKey: "wizard.steps.experience",
    descKey: "wizard.steps.experienceDesc",
  },
  {
    id: 3,
    titleKey: "wizard.steps.logistics",
    descKey: "wizard.steps.logisticsDesc",
  },
  { id: 4, titleKey: "wizard.steps.media", descKey: "wizard.steps.mediaDesc" },
  {
    id: 5,
    titleKey: "wizard.steps.review",
    descKey: "wizard.steps.reviewDesc",
  },
] as const;

export type Language = "uz" | "ru" | "eng" | "de";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "eng", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const defaultMultilingualText: MultilingualText = {
  uz: "",
  ru: "",
  eng: "",
  de: "",
};

export const defaultItineraryStep: ItineraryStep = {
  dayNumber: 1,
  title: { ...defaultMultilingualText },
  description: { ...defaultMultilingualText },
};

export const defaultTourWizardData: TourWizardData = {
  title: { ...defaultMultilingualText },
  categoryId: "",
  duration: 1,
  price: 0,
  currency: "UZS",
  status: "ACTIVE",
  description: { ...defaultMultilingualText },
  itinerary: [{ ...defaultItineraryStep }],
  inclusions: [{ ...defaultMultilingualText }],
  exclusions: [{ ...defaultMultilingualText }],
  destination: "",
  regions: [],
  latitude: null,
  longitude: null,
  maxParticipants: 10,
  startDate: "",
  endDate: "",
  images: [],
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export const stepValidationSchemas = {
  1: essentialsStepSchema,
  2: experienceStepSchema,
  3: logisticsStepSchema,
  4: mediaStepSchema,
  5: z.object({}), // Review step has no validation
} as const;

export function validateStep(
  step: WizardStep,
  data: TourWizardData,
): { success: boolean; errors: string[] } {
  const schema = stepValidationSchemas[step];

  // Map full data to step-specific data
  const stepData = {
    1: {
      title: data.title,
      categoryId: data.categoryId,
      duration: data.duration,
      price: data.price,
      currency: data.currency,
      status: data.status,
    },
    2: {
      description: data.description,
      itinerary: data.itinerary,
      inclusions: data.inclusions,
      exclusions: data.exclusions,
    },
    3: {
      destination: data.destination,
      regions: data.regions,
      maxParticipants: data.maxParticipants,
      startDate: data.startDate,
      endDate: data.endDate,
    },
    4: { images: data.images },
    5: {},
  }[step];

  const result = schema.safeParse(stepData);

  if (result.success) {
    return { success: true, errors: [] };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => issue.message),
  };
}
