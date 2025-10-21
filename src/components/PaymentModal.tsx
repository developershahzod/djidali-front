import React, { useState } from 'react';
import { X, CreditCard, Building2, Wallet, CheckCircle, Loader2 } from 'lucide-react';
import { clickPaymentService } from '../services/clickPayment';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPaymentFrame, setShowPaymentFrame] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
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

      setPaymentUrl(result.paymentUrl);
      setShowPaymentFrame(true);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      alert(t('paymentModal.error') + ': ' + (error instanceof Error ? error.message : t('paymentModal.unknownError')));
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    setShowPaymentFrame(false);
    setPaymentUrl('');
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setBankAccount('');
    setWalletPhone('');
    onClose();
  };

  const handlePaymentComplete = () => {
    setIsSuccess(true);
    setShowPaymentFrame(false);
    setTimeout(() => {
      onPaymentComplete();
      handleClose();
    }, 2000);
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

  // Payment iframe view
  if (showPaymentFrame && paymentUrl) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="relative bg-gradient-to-br from-[#8f7b49] via-[#a08957] to-[#7a6839] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t('paymentModal.clickPayment')}</h3>
                <p className="text-white/80 text-xs">{Math.round(amount).toLocaleString()} UZS</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all hover:rotate-90 duration-300"
            >
              <X className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex-1 relative">
            <iframe
              src={paymentUrl}
              className="w-full h-full border-0"
              title="Click Payment"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            />
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p className="text-xs">{t('paymentModal.security')}</p>
            </div>
            <button
              onClick={handlePaymentComplete}
              className="px-6 py-2 bg-gradient-to-r from-[#8f7b49] to-[#a08957] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              ✓ {t('paymentModal.paymentCompleted')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center transform transition-all animate-in">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8f7b49] to-[#a08957] rounded-full animate-pulse opacity-20"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#8f7b49] to-[#a08957] rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8f7b49] to-[#a08957] bg-clip-text text-transparent mb-4">
            {t('paymentModal.success.title')}
          </h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            {t('paymentModal.success.description')}
          </p>
          {orderNumber && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">{t('paymentModal.orderNumber')}</p>
              <p className="text-lg font-bold text-gray-900">{orderNumber}</p>
            </div>
          )}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6">
            <p className="text-sm text-[#8f7b49] font-medium mb-2">{t('paymentModal.paymentAmount')}</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-[#8f7b49] to-[#a08957] bg-clip-text text-transparent">
              {Math.round(amount).toLocaleString()} <span className="text-2xl">UZS</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full my-8 overflow-hidden">
        <div className="relative bg-gradient-to-br from-[#8f7b49] via-[#a08957] to-[#7a6839] px-8 py-8">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all hover:rotate-90 duration-300"
          >
            <X className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{t('paymentModal.title')}</h2>
              <p className="text-white/80 text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                {t('paymentModal.securePayment')}
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium text-sm">{t('paymentModal.paymentAmount')}</span>
              {orderNumber && (
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                  {t('paymentModal.order')}: <span className="font-semibold">{orderNumber}</span>
                </span>
              )}
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold bg-gradient-to-r from-[#8f7b49] via-[#a08957] to-[#7a6839] bg-clip-text text-transparent">
                {Math.round(amount).toLocaleString()}
              </p>
              <p className="text-2xl font-semibold text-gray-600 mt-1">UZS</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gradient-to-br from-[#8f7b49] to-[#a08957] rounded-2xl p-5 mb-4 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg">{t('paymentModal.clickPayment')}</h4>
                  <p className="text-sm text-white/90">{t('paymentModal.allBanks')}</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800 text-center leading-relaxed">
                💳 {t('paymentModal.instruction')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#8f7b49] via-[#a08957] to-[#7a6839] text-white font-bold py-5 rounded-2xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <Loader2 className="w-6 h-6 animate-spin" strokeWidth={2.5} />
                  <span>{t('paymentModal.opening')}</span>
                </div>
              ) : (
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  <CreditCard className="w-5 h-5" strokeWidth={2.5} />
                  <span>{Math.round(amount).toLocaleString()} UZS {t('paymentModal.pay')}</span>
                </div>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-center">
                {t('paymentModal.security')}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
