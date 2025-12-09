import axios from 'axios';

const CLICK_API_BASE = 'https://tourpayment.academytable.ru/api/v1';
const CLICK_SERVICE_ID = '84234';
const CLICK_MERCHANT_ID = '46890';

export interface ClickOrderData {
  variant: 'click';
  status: 'waiting' | 'confirmed' | 'preauth' | 'rejected' | 'error' | 'input' | 'refunded';
  fraud_status: 'unknown' | 'safe' | 'fraud';
  transaction_id: string;
  currency: 'uzs';
  total: number;
  delivery: number;
  tax: number;
}

export interface ClickPaymentStatus {
  status: 'waiting' | 'confirmed' | 'preauth' | 'rejected' | 'error' | 'input' | 'refunded';
  transaction_id: string;
  total: number;
  currency: string;
}

export interface ClickPaymentResult {
  paymentUrl: string;
  orderId: string;
  amount: number;
}

const deviceId = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

class ClickPaymentService {
  async createClickOrder(orderId: string, amount: number): Promise<ClickPaymentResult> {
    try {
      const orderData: ClickOrderData = {
        variant: 'click',
        status: 'waiting',
        fraud_status: 'unknown',
        transaction_id: orderId,
        currency: 'uzs',
        total: amount,
        delivery: 0,
        tax: 0,
      };

      await axios.post(
        `${CLICK_API_BASE}/click_add_order/`,
        orderData,
        {
          headers: {
            'device-id': deviceId,
            'Content-Type': 'application/json',
          },
        }
      );

      const paymentUrl = `https://my.click.uz/services/pay?service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_MERCHANT_ID}&amount=${amount}&transaction_param=${orderId}`;

      return {
        paymentUrl,
        orderId,
        amount,
      };
    } catch (error) {
      console.error('Click order creation failed:', error);
      throw new Error('Click payment yaratishda xatolik yuz berdi');
    }
  }

  async getPaymentStatus(orderId: string): Promise<'waiting' | 'confirmed' | 'rejected' | 'error'> {
    try {
      const response = await axios.get<ClickPaymentStatus[]>(
        `${CLICK_API_BASE}/click_order/${orderId}/`,
        {
          headers: {
            'device-id': deviceId,
          },
        }
      );

      if (!response.data || response.data.length === 0) {
        return 'waiting';
      }

      const data = response.data[0];

      switch (data.status) {
        case 'waiting':
        case 'preauth':
        case 'input':
          return 'waiting';
        case 'confirmed':
          return 'confirmed';
        case 'rejected':
        case 'error':
        case 'refunded':
          return 'rejected';
        default:
          return 'waiting';
      }
    } catch (error) {
      console.error('Failed to get Click payment status:', error);
      return 'error'; // Signal error to UI - don't silently return 'waiting'
    }
  }

  getPaymentUrl(orderId: string, amount: number): string {
    return `https://my.click.uz/services/pay?service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_MERCHANT_ID}&amount=${amount}&transaction_param=${orderId}`;
  }
}

export const clickPaymentService = new ClickPaymentService();
export default clickPaymentService;
