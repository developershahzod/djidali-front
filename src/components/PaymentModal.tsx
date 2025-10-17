import React, { useState } from 'react';
import { X, CreditCard, Building2, Wallet, CheckCircle, Loader2 } from 'lucide-react';
import { clickPaymentService } from '../services/clickPayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  orderNumber?: string;
  orderId: string;
  onPaymentComplete: () => void;
}

type PaymentMethod = 'card' | 'bank' | 'wallet';

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  currency,
  orderNumber,
  orderId,
  onPaymentComplete,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [walletPhone, setWalletPhone] = useState('');

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const amountInUzs = Math.round(amount);
      const result = await clickPaymentService.createClickOrder(orderId, amountInUzs);

      window.open(result.paymentUrl, '_blank');

      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        onPaymentComplete();
        handleClose();
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      alert('To\'lov yaratishda xatolik: ' + (error instanceof Error ? error.message : 'Noma\'lum xatolik'));
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setBankAccount('');
    setWalletPhone('');
    onClose();
  };

  const isFormValid = () => {
    if (selectedMethod === 'card') {
      return cardNumber.replace(/\s/g, '').length === 16 && cardName && expiryDate.length === 5 && cvv.length === 3;
    } else if (selectedMethod === 'bank') {
      return bankAccount.length >= 10;
    } else {
      return walletPhone.length >= 9;
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">To'lov sahifasi ochildi!</h2>
          <p className="text-gray-600 text-lg mb-2">
            Click orqali to'lov sahifasi yangi oynada ochildi. To'lovni yakunlang.
          </p>
          {orderNumber && (
            <p className="text-sm text-gray-500 mb-8">
              Buyurtma raqami: <span className="font-semibold">{orderNumber}</span>
            </p>
          )}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-4 mb-6">
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(amount).toLocaleString()} UZS
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl px-8 py-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">To'lovni amalga oshirish</h2>
          <p className="text-white/90 text-sm">Xavfsiz to'lov tizimi</p>
        </div>

        <div className="px-8 py-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">To'lov summasi:</span>
              <div className="text-right">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                  {Math.round(amount).toLocaleString()} UZS
                </span>
              </div>
            </div>
            {orderNumber && (
              <p className="text-sm text-gray-500 mt-2">
                Buyurtma: <span className="font-semibold">{orderNumber}</span>
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Click orqali to'lov</h4>
                  <p className="text-sm text-blue-700">Barcha O'zbekiston banklari</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              To'lov uchun tugmani bosing va Click sahifasida karta ma'lumotlarini kiriting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-sky-600 text-white font-bold py-4 rounded-xl hover:from-blue-600 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>To'lov sahifasi ochilmoqda...</span>
                  </div>
                ) : (
                  `${Math.round(amount).toLocaleString()} UZS to'lash`
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Click xavfsiz to'lov tizimi. Barcha ma'lumotlar shifrlangan
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
