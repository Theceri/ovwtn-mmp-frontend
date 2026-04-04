'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getApplicationStatus, submitApplicationPayment } from '@/lib/api';
import { toast } from 'sonner';

export default function PaymentSubmissionPage() {
  const params = useParams();
  const applicationNumber = params.applicationNumber;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [paymentMode, setPaymentMode] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!applicationNumber) return;

    const fetchStatus = async () => {
      setLoading(true);
      try {
        const data = await getApplicationStatus(applicationNumber);
        setApplication(data);
      } catch (err) {
        setError(err.message || 'Application not found');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [applicationNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMode || !paymentReference.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await submitApplicationPayment(applicationNumber, {
        payment_mode: paymentMode,
        payment_reference: paymentReference.trim(),
        amount: amount ? parseFloat(amount) : null,
      });
      setSubmitted(true);
      toast.success('Payment proof submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderBottomColor: 'var(--brand-primary, #962021)' }}
          />
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Application Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  if (application && application.status !== 'approved_awaiting_payment') {
    const statusMessages = {
      pending_ceo_approval: 'Your application is still under review. Payment is not required at this time.',
      fully_approved: 'Your membership is already fully activated. No further payment is needed.',
      rejected: 'This application has been declined.',
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Not Required</h1>
          <p className="text-gray-600 mb-4">
            {statusMessages[application.status] || `Current status: ${application.status?.replace(/_/g, ' ')}`}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Application: <strong>{application.application_number}</strong>
          </p>
          <Link href="/" className="text-blue-600 hover:underline">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Proof Submitted</h1>
          <p className="text-gray-600 mb-6">
            Thank you! An administrator will verify your payment shortly. You will receive
            an email with your login credentials once your membership is fully activated.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
            style={{ backgroundColor: '#962021' }}
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Payment</h1>
          <p className="text-gray-600">
            Application <strong>{application?.application_number}</strong> for{' '}
            <strong>{application?.organisation_name}</strong>
          </p>
        </div>

        {/* Payment Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-amber-900 mb-3">Payment Methods</h2>
          <div className="space-y-3 text-sm text-amber-800">
            <div>
              <p className="font-medium">M-Pesa Paybill</p>
              <p>Paybill Number: <strong>303030</strong></p>
              <p>Account: <strong>DEZB#{application?.organisation_name}</strong></p>
            </div>
            <div className="border-t border-amber-200 pt-3">
              <p className="font-medium">Bank Cheque</p>
              <p>Made out to: <strong>ONE VOICE WOMEN TRADE NETWORK CLG LTD</strong></p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                  paymentMode === 'mpesa'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value="mpesa"
                  checked={paymentMode === 'mpesa'}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="sr-only"
                />
                M-Pesa
              </label>
              <label
                className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                  paymentMode === 'cheque'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value="cheque"
                  checked={paymentMode === 'cheque'}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="sr-only"
                />
                Cheque
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {paymentMode === 'mpesa' ? 'M-Pesa Confirmation Code' : 'Payment Reference'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value.toUpperCase())}
              placeholder={paymentMode === 'mpesa' ? 'e.g., QK123ABC456' : 'e.g., CHQ-001234'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount Paid (KES)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 20000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !paymentMode || !paymentReference.trim()}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#962021' }}
          >
            {submitting ? 'Submitting...' : 'Submit Payment Confirmation'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Questions? Contact the CEO at{' '}
            <a href="mailto:info@onevoice.ke" className="text-blue-600 hover:underline">info@onevoice.ke</a>
          </p>
        </div>
      </div>
    </div>
  );
}
