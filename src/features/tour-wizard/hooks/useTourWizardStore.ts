import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  TourWizardData,
  WizardStep,
  defaultTourWizardData,
  validateStep,
  Language,
  MultilingualText,
  ItineraryStep,
  defaultMultilingualText,
  defaultItineraryStep,
} from "../types";

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface TourWizardState {
  // Wizard navigation state
  currentStep: WizardStep;
  completedSteps: Set<WizardStep>;
  isSubmitting: boolean;
  isDirty: boolean;

  // Form data
  formData: TourWizardData;

  // Active language for multilingual inputs
  activeLanguage: Language;

  // Edit mode (for editing existing tours)
  editingTourId: string | null;

  // Validation errors per step
  stepErrors: Record<WizardStep, string[]>;
}

interface TourWizardActions {
  // Navigation
  setStep: (step: WizardStep) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  canNavigateToStep: (step: WizardStep) => boolean;

  // Form data management
  updateFormData: <K extends keyof TourWizardData>(
    field: K,
    value: TourWizardData[K],
  ) => void;
  updateMultilingualField: (
    field: "title" | "description",
    lang: Language,
    value: string,
  ) => void;
  setFormData: (data: Partial<TourWizardData>) => void;

  // Itinerary management
  addItineraryDay: () => void;
  updateItineraryDay: (index: number, updates: Partial<ItineraryStep>) => void;
  removeItineraryDay: (index: number) => void;
  updateItineraryText: (
    dayIndex: number,
    field: "title" | "description",
    lang: Language,
    value: string,
  ) => void;

  // Inclusions/Exclusions management
  addListItem: (listType: "inclusions" | "exclusions") => void;
  updateListItem: (
    listType: "inclusions" | "exclusions",
    index: number,
    lang: Language,
    value: string,
  ) => void;
  removeListItem: (
    listType: "inclusions" | "exclusions",
    index: number,
  ) => void;

  // Images management
  addImages: (urls: string[]) => void;
  removeImage: (index: number) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;

  // Language
  setActiveLanguage: (lang: Language) => void;

  // Validation
  validateCurrentStep: () => boolean;
  getStepErrors: (step: WizardStep) => string[];

  // Submission
  setSubmitting: (submitting: boolean) => void;

  // Edit mode
  loadTourForEditing: (tourId: string, data: TourWizardData) => void;

  // Reset
  resetWizard: () => void;
  saveDraft: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: TourWizardState = {
  currentStep: 1,
  completedSteps: new Set(),
  isSubmitting: false,
  isDirty: false,
  formData: { ...defaultTourWizardData },
  activeLanguage: "ru",
  editingTourId: null,
  stepErrors: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  },
};

// ============================================================================
// STORE
// ============================================================================

export const useTourWizardStore = create<TourWizardState & TourWizardActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========== NAVIGATION ==========

      setStep: (step) => {
        const { canNavigateToStep, validateCurrentStep } = get();
        if (canNavigateToStep(step)) {
          // Validate current step before leaving
          validateCurrentStep();
          set({ currentStep: step });
        }
      },

      nextStep: () => {
        const { currentStep, validateCurrentStep, completedSteps } = get();
        const isValid = validateCurrentStep();

        if (isValid && currentStep < 5) {
          const newCompletedSteps = new Set(completedSteps);
          newCompletedSteps.add(currentStep);
          set({
            currentStep: (currentStep + 1) as WizardStep,
            completedSteps: newCompletedSteps,
          });
          return true;
        }
        return false;
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: (currentStep - 1) as WizardStep });
        }
      },

      canNavigateToStep: (step) => {
        const { currentStep, completedSteps } = get();
        // Can always go back
        if (step < currentStep) return true;
        // Can go to current step
        if (step === currentStep) return true;
        // Can only go forward if previous steps are completed
        for (let i = 1; i < step; i++) {
          if (!completedSteps.has(i as WizardStep)) return false;
        }
        return true;
      },

      // ========== FORM DATA ==========

      updateFormData: (field, value) => {
        set((state) => ({
          formData: { ...state.formData, [field]: value },
          isDirty: true,
        }));
      },

      updateMultilingualField: (field, lang, value) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: { ...state.formData[field], [lang]: value },
          },
          isDirty: true,
        }));
      },

      setFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
          isDirty: true,
        }));
      },

      // ========== ITINERARY ==========

      addItineraryDay: () => {
        set((state) => ({
          formData: {
            ...state.formData,
            itinerary: [
              ...state.formData.itinerary,
              {
                ...defaultItineraryStep,
                dayNumber: state.formData.itinerary.length + 1,
              },
            ],
          },
          isDirty: true,
        }));
      },

      updateItineraryDay: (index, updates) => {
        set((state) => ({
          formData: {
            ...state.formData,
            itinerary: state.formData.itinerary.map((day, i) =>
              i === index ? { ...day, ...updates } : day,
            ),
          },
          isDirty: true,
        }));
      },

      removeItineraryDay: (index) => {
        set((state) => {
          const newItinerary = state.formData.itinerary
            .filter((_, i) => i !== index)
            .map((day, i) => ({ ...day, dayNumber: i + 1 }));

          return {
            formData: {
              ...state.formData,
              itinerary:
                newItinerary.length > 0 ? newItinerary : [defaultItineraryStep],
            },
            isDirty: true,
          };
        });
      },

      updateItineraryText: (dayIndex, field, lang, value) => {
        set((state) => ({
          formData: {
            ...state.formData,
            itinerary: state.formData.itinerary.map((day, i) =>
              i === dayIndex
                ? {
                    ...day,
                    [field]: { ...day[field], [lang]: value },
                  }
                : day,
            ),
          },
          isDirty: true,
        }));
      },

      // ========== INCLUSIONS/EXCLUSIONS ==========

      addListItem: (listType) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [listType]: [
              ...state.formData[listType],
              { ...defaultMultilingualText },
            ],
          },
          isDirty: true,
        }));
      },

      updateListItem: (listType, index, lang, value) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [listType]: state.formData[listType].map(
              (item: MultilingualText, i: number) =>
                i === index ? { ...item, [lang]: value } : item,
            ),
          },
          isDirty: true,
        }));
      },

      removeListItem: (listType, index) => {
        set((state) => {
          const newList = state.formData[listType].filter(
            (_: MultilingualText, i: number) => i !== index,
          );
          return {
            formData: {
              ...state.formData,
              [listType]:
                newList.length > 0 ? newList : [{ ...defaultMultilingualText }],
            },
            isDirty: true,
          };
        });
      },

      // ========== IMAGES ==========

      addImages: (urls) => {
        set((state) => ({
          formData: {
            ...state.formData,
            images: [...state.formData.images, ...urls],
          },
          isDirty: true,
        }));
      },

      removeImage: (index) => {
        set((state) => ({
          formData: {
            ...state.formData,
            images: state.formData.images.filter((_, i) => i !== index),
          },
          isDirty: true,
        }));
      },

      reorderImages: (fromIndex, toIndex) => {
        set((state) => {
          const images = [...state.formData.images];
          const [removed] = images.splice(fromIndex, 1);
          images.splice(toIndex, 0, removed);
          return {
            formData: { ...state.formData, images },
            isDirty: true,
          };
        });
      },

      // ========== LANGUAGE ==========

      setActiveLanguage: (lang) => set({ activeLanguage: lang }),

      // ========== VALIDATION ==========

      validateCurrentStep: () => {
        const { currentStep, formData } = get();
        const result = validateStep(currentStep, formData);
        set((state) => ({
          stepErrors: { ...state.stepErrors, [currentStep]: result.errors },
        }));
        return result.success;
      },

      getStepErrors: (step) => get().stepErrors[step],

      // ========== SUBMISSION ==========

      setSubmitting: (submitting) => set({ isSubmitting: submitting }),

      // ========== EDIT MODE ==========

      loadTourForEditing: (tourId, data) => {
        set({
          editingTourId: tourId,
          formData: data,
          currentStep: 1,
          completedSteps: new Set([1, 2, 3, 4] as WizardStep[]),
          isDirty: false,
        });
      },

      // ========== RESET ==========

      resetWizard: () => {
        set({
          ...initialState,
          completedSteps: new Set(),
        });
      },

      saveDraft: () => {
        // Persist is handled automatically by zustand persist middleware
        // This is just a manual trigger if needed
        set({ isDirty: false });
      },
    }),
    {
      name: "tour_draft_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
        completedSteps: Array.from(state.completedSteps),
        editingTourId: state.editingTourId,
        activeLanguage: state.activeLanguage,
      }),
      onRehydrateStorage: () => (state) => {
        // Convert completedSteps array back to Set after rehydration
        if (state && Array.isArray(state.completedSteps)) {
          state.completedSteps = new Set(state.completedSteps as WizardStep[]);
        }
      },
    },
  ),
);

// ============================================================================
// SELECTORS (for optimized re-renders)
// ============================================================================

export const useWizardStep = () =>
  useTourWizardStore((state) => state.currentStep);

export const useWizardFormData = () =>
  useTourWizardStore((state) => state.formData);

export const useActiveLanguage = () =>
  useTourWizardStore((state) => state.activeLanguage);

export const useIsSubmitting = () =>
  useTourWizardStore((state) => state.isSubmitting);

export const useCompletedSteps = () =>
  useTourWizardStore((state) => state.completedSteps);
