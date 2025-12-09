/**
 * Modern Payment Service
 *
 * This service uses the NEW backend payment flow (Phase 2).
 * It calls the backend's /payments/initiate endpoint which handles:
 * - Payment orchestration
 * - Idempotency checks
 * - Click.uz redirect URL generation
 *
 * Backend ENV Requirements:
 * - CLICK_MERCHANT_ID
 * - CLICK_SERVICE_ID
 * - CLICK_SECRET_KEY
 * - CLICK_MERCHANT_USER_ID
 * - FRONTEND_URL (for return redirect)
 */

import { api } from './api';

export interface InitiatePaymentRequest {
  orderId: string;
  method: 'CLICK';
  amount?: number;
}

export interface InitiatePaymentResponse {
  transactionId: string;
  paymentUrl: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  data: {
    paymentId: string;
    isDuplicate?: boolean;
  };
}

export interface PaymentStatusResponse {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  amount: number;
  method: string;
  orderId: string;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

class ModernPaymentService {
  /**
   * Initiate a Click payment via the backend
   *
   * The backend will:
   * 1. Validate the order exists and is payable
   * 2. Create a payment record with idempotency check
   * 3. Generate the Click.uz payment URL
   * 4. Return the URL for frontend redirect
   *
   * @param orderId - UUID of the order to pay
   * @param amount - Optional amount override (uses order total if not provided)
   * @returns Payment initiation response with redirect URL
   */
  async initiate(orderId: string, amount?: number): Promise<InitiatePaymentResponse> {
    try {
      const response = await api.initiateOrderPayment({
        orderId,
        method: 'CLICK',
        amount,
      });

      return response;
    } catch (error) {
      console.error('Modern payment initiation failed:', error);
      throw error;
    }
  }

  /**
   * Redirect user to Click.uz payment page
   *
   * @param paymentUrl - URL returned from initiate()
   */
  redirectToPayment(paymentUrl: string): void {
    window.location.href = paymentUrl;
  }

  /**
   * Initiate payment and immediately redirect
   * Convenience method that combines initiate + redirect
   *
   * @param orderId - UUID of the order to pay
   * @param amount - Optional amount override
   */
  async initiateAndRedirect(orderId: string, amount?: number): Promise<void> {
    const response = await this.initiate(orderId, amount);

    if (response.paymentUrl) {
      this.redirectToPayment(response.paymentUrl);
    } else {
      throw new Error('No payment URL returned from backend');
    }
  }

  /**
   * Get payment status from backend
   *
   * @param paymentId - UUID of the payment
   * @returns Current payment status
   */
  async getStatus(paymentId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await api.getPaymentStatus(paymentId);
      return response;
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  }

  /**
   * Get all payments for an order
   *
   * @param orderId - UUID of the order
   * @returns Array of payment records
   */
  async getOrderPayments(orderId: string): Promise<PaymentStatusResponse[]> {
    try {
      const response = await api.getOrderPayments(orderId);
      return response;
    } catch (error) {
      console.error('Failed to get order payments:', error);
      throw error;
    }
  }

  /**
   * Check if order has a successful payment
   *
   * @param orderId - UUID of the order
   * @returns true if order is fully paid
   */
  async isOrderPaid(orderId: string): Promise<boolean> {
    try {
      const payments = await this.getOrderPayments(orderId);
      return payments.some(p => p.status === 'SUCCESS');
    } catch (error) {
      console.error('Failed to check if order is paid:', error);
      return false;
    }
  }

  /**
   * Map backend status to user-friendly display status
   */
  getDisplayStatus(status: string): 'waiting' | 'confirmed' | 'rejected' | 'error' {
    switch (status) {
      case 'SUCCESS':
        return 'confirmed';
      case 'FAILED':
        return 'rejected';
      case 'PENDING':
      case 'PROCESSING':
        return 'waiting';
      default:
        return 'error';
    }
  }
}

export const modernPaymentService = new ModernPaymentService();
