import { useState, useEffect, useCallback } from "react";
import { apiService, Payment, PaginatedResponse } from "../services/api";
import {
  modernPaymentService,
  InitiatePaymentResponse,
} from "../services/modernPayment";
import { clickPaymentService } from "../services/legacyClickPayment";

/**
 * Feature Flag: Use Backend Payment Flow
 *
 * When TRUE: Uses the new backend /payments/initiate endpoint (Phase 2)
 * When FALSE: Uses the legacy direct Click API integration
 *
 * Set to TRUE for production with the new backend payment system.
 * Set to FALSE to fall back to the legacy Click integration.
 *
 * NOTE: Set to FALSE until Click merchant dashboard is configured with
 * the correct webhook URLs for the new backend payment system.
 */
const USE_BACKEND_PAYMENT = false;

interface UsePaymentsParams {
  booking_id?: number;
  status?: string;
  page?: number;
  per_page?: number;
  autoFetch?: boolean;
}

interface UsePaymentsReturn {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  } | null;
  fetchPayments: () => Promise<void>;
  refetch: () => Promise<void>;
  createPayment: (paymentData: {
    booking_id: number;
    amount: number;
    payment_method: string;
  }) => Promise<Payment>;
  processPayment: (
    id: number,
    paymentData: {
      transaction_id?: string;
      payment_details?: any;
    },
  ) => Promise<Payment>;

  // Modern Payment Methods (Click via Backend)
  initiateClickPayment: (
    orderId: string,
    amount?: number,
  ) => Promise<InitiatePaymentResponse>;
  initiateAndRedirect: (orderId: string, amount?: number) => Promise<void>;
  getPaymentStatus: (
    paymentIdOrOrderId: string,
  ) => Promise<"waiting" | "confirmed" | "rejected" | "error">;
  isOrderPaid: (orderId: string) => Promise<boolean>;

  // Feature flag indicator
  isUsingBackendPayment: boolean;
}

export const usePayments = (
  params: UsePaymentsParams = {},
): UsePaymentsReturn => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] =
    useState<UsePaymentsReturn["pagination"]>(null);

  const { autoFetch = true, ...apiParams } = params;

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: PaginatedResponse<Payment> =
        await apiService.getPayments(apiParams);

      setPayments(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch payments";
      setError(errorMessage);
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: {
    booking_id: number;
    amount: number;
    payment_method: string;
  }): Promise<Payment> => {
    try {
      setError(null);
      const payment = await apiService.createPayment(paymentData);

      // Refresh payments list
      await fetchPayments();

      return payment;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create payment";
      setError(errorMessage);
      throw err;
    }
  };

  const processPayment = async (
    id: number,
    paymentData: {
      transaction_id?: string;
      payment_details?: any;
    },
  ): Promise<Payment> => {
    try {
      setError(null);
      const payment = await apiService.processPayment(id, paymentData);

      // Update local state
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...payment } : p)),
      );

      return payment;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process payment";
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Initiate a Click payment
   * Uses backend or legacy service based on feature flag
   */
  const initiateClickPayment = useCallback(
    async (
      orderId: string,
      amount?: number,
    ): Promise<InitiatePaymentResponse> => {
      if (USE_BACKEND_PAYMENT) {
        // Modern: Backend handles Click integration
        return modernPaymentService.initiate(orderId, amount);
      } else {
        // Legacy: Direct Click API integration
        const response = await clickPaymentService.createClickOrder(
          orderId,
          amount || 0,
        );

        // Map legacy response to modern format
        return {
          transactionId: response.orderId,
          paymentUrl: response.paymentUrl,
          status: "PENDING",
          data: { paymentId: response.orderId },
        };
      }
    },
    [],
  );

  /**
   * Initiate payment and redirect to Click.uz
   */
  const initiateAndRedirect = useCallback(
    async (orderId: string, amount?: number): Promise<void> => {
      if (USE_BACKEND_PAYMENT) {
        await modernPaymentService.initiateAndRedirect(orderId, amount);
      } else {
        const response = await clickPaymentService.createClickOrder(
          orderId,
          amount || 0,
        );
        window.location.href = response.paymentUrl;
      }
    },
    [],
  );

  /**
   * Get payment status
   * Returns normalized status: 'waiting' | 'confirmed' | 'rejected' | 'error'
   */
  const getPaymentStatus = useCallback(
    async (
      paymentIdOrOrderId: string,
    ): Promise<"waiting" | "confirmed" | "rejected" | "error"> => {
      try {
        if (USE_BACKEND_PAYMENT) {
          const status =
            await modernPaymentService.getStatus(paymentIdOrOrderId);
          return modernPaymentService.getDisplayStatus(status.status);
        } else {
          return clickPaymentService.getPaymentStatus(paymentIdOrOrderId);
        }
      } catch (error) {
        console.error("Failed to get payment status:", error);
        return "error";
      }
    },
    [],
  );

  /**
   * Check if order has been paid
   */
  const isOrderPaid = useCallback(async (orderId: string): Promise<boolean> => {
    if (USE_BACKEND_PAYMENT) {
      return modernPaymentService.isOrderPaid(orderId);
    } else {
      const status = await clickPaymentService.getPaymentStatus(orderId);
      return status === "confirmed";
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchPayments();
    }
  }, [
    params.booking_id,
    params.status,
    params.page,
    params.per_page,
    autoFetch,
  ]);

  return {
    payments,
    loading,
    error,
    pagination,
    fetchPayments,
    refetch: fetchPayments,
    createPayment,
    processPayment,

    // Modern Payment Methods
    initiateClickPayment,
    initiateAndRedirect,
    getPaymentStatus,
    isOrderPaid,

    // Feature flag indicator
    isUsingBackendPayment: USE_BACKEND_PAYMENT,
  };
};

/**
 * Standalone hook for just Click payment operations
 * Useful when you only need payment initiation without full hook state
 */
export const useClickPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(
    async (
      orderId: string,
      amount?: number,
    ): Promise<InitiatePaymentResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        if (USE_BACKEND_PAYMENT) {
          return await modernPaymentService.initiate(orderId, amount);
        } else {
          const response = await clickPaymentService.createClickOrder(
            orderId,
            amount || 0,
          );
          return {
            transactionId: response.orderId,
            paymentUrl: response.paymentUrl,
            status: "PENDING",
            data: { paymentId: response.orderId },
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Payment initiation failed";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const initiateAndRedirect = useCallback(
    async (orderId: string, amount?: number): Promise<boolean> => {
      const response = await initiatePayment(orderId, amount);
      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
        return true;
      }
      return false;
    },
    [initiatePayment],
  );

  return {
    initiatePayment,
    initiateAndRedirect,
    loading,
    error,
    isUsingBackendPayment: USE_BACKEND_PAYMENT,
  };
};
