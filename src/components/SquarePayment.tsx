import React, { useEffect, useState } from 'react';
import { loadSquareSdk } from '../utils/square-utils';

interface SquarePaymentProps {
  amount: number;
  onSuccess: () => Promise<void>;
  onError: (error: Error) => void;
}

interface PaymentData {
  sourceId: string;
  amount: number;
  discountCode?: string;
}

export function SquarePayment({ amount = 19900, onSuccess, onError }: SquarePaymentProps) {
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [discountCode, setDiscountCode] = useState('');
  const [finalAmount, setFinalAmount] = useState(amount);

  useEffect(() => {
    let mounted = true;

    const initializeSquare = async () => {
      try {
        const payments = await loadSquareSdk();
        if (!mounted) return;

        const card = await payments.card();
        await card.attach('#card-container');

        setCard(card);
      } catch (error) {
        console.error('Failed to load Square SDK:', error);
        onError(error instanceof Error ? error : new Error('Failed to load Square SDK'));
      }
    };

    initializeSquare();

    return () => {
      mounted = false;
      if (card) {
        card.destroy();
      }
    };
  }, [onError]);

  useEffect(() => {
    if (card) {
      return () => {
        card.destroy();
      };
    }
  }, [card]);

  const processPayment = async (paymentData: PaymentData) => {
    const response = await fetch('http://localhost:3000/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment processing failed');
    }

    return response.json();
  };

  const handlePayment = async () => {
    if (!card) {
      onError(new Error('Payment form not initialized'));
      return;
    }

    setStatus('processing');
    setLoading(true);

    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        const paymentData: PaymentData = {
          sourceId: result.token,
          amount: finalAmount,
          discountCode: discountCode || undefined,
        };

        try {
          const response = await processPayment(paymentData);
          console.log('Payment successful:', response);
          setStatus('success');
          await onSuccess();
        } catch (error) {
          console.error('Payment processing error:', error);
          setStatus('error');
          onError(error instanceof Error ? error : new Error('Payment processing failed'));
        }
      } else {
        throw new Error('Card tokenization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setStatus('error');
      onError(error instanceof Error ? error : new Error('Payment failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {loading && (
        <div className="mb-4 text-center text-gray-600">
          Loading payment form...
        </div>
      )}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>
      
      {/* Discount Code Section */}
      <div className="mb-6">
        <label htmlFor="discount-code" className="block text-sm font-medium text-gray-700 mb-2">
          Discount Code
        </label>
        <input
          type="text"
          id="discount-code"
          value={discountCode}
          onChange={(e) => {
            const code = e.target.value.toLowerCase();
            setDiscountCode(code);
            // Auto-apply discount code
            if (code === 'launch50') {
              setFinalAmount(amount * 0.5); // 50% off
            } else if (code === 'launch25') {
              setFinalAmount(amount * 0.75); // 25% off
            } else if (code === '100off') {
              setFinalAmount(amount * 0); // 100% off
            } else {
              setFinalAmount(amount); // Reset to original amount if code is invalid
            }
          }}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter discount code"
        />
      </div>

      {/* Price Display */}
      <div className="mb-6">
        <div className="text-lg font-medium text-gray-900">
          Total: ${(finalAmount / 100).toFixed(2)}
          {finalAmount !== amount && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${(amount / 100).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div 
        id="card-container"
        className="mb-4 p-4 border rounded-lg bg-white shadow-sm"
      ></div>
      
      <div className="space-y-4">
        <button
          onClick={handlePayment}
          disabled={loading || !card || status === 'success'}
          className={`w-full px-4 py-3 rounded-md font-medium transition-colors ${
            loading || !card
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : status === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {status === 'processing' ? 'Processing...' : 
           status === 'success' ? 'Payment Successful!' : 
           status === 'error' ? 'Try Again' : 
           `Pay $${(finalAmount / 100).toFixed(2)}`}
        </button>

        {status === 'success' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700">
              Payment successful! Your email confirmation will be sent shortly.
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">
              Payment failed. Please try again or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
