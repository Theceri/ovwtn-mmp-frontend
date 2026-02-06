'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUnverifiedPayments, verifyPayment } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  const style = styles[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  );
}

function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

function PaymentVerificationModal({ isOpen, onClose, payment, onVerify, token, initialStatus = 'verified' }) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && payment) {
      setStatus(initialStatus);
      setNotes('');
    }
  }, [isOpen, payment, initialStatus]);

  if (!isOpen || !payment) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await verifyPayment(payment.id, status, notes || null, token);
      toast.success(`Payment ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
      onVerify();
      onClose();
    } catch (err) {
      toast.error(`Failed to ${status === 'verified' ? 'verify' : 'reject'} payment`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6" style={{ backgroundColor: 'var(--background)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {status === 'verified' ? 'Verify Payment' : 'Reject Payment'}
        </h3>
        
        <div className="mb-4 space-y-2 text-sm">
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Reference: </span>
            <span style={{ color: 'var(--text-primary)' }}>{payment.reference_number}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Amount: </span>
            <span style={{ color: 'var(--text-primary)' }}>
              KES {parseFloat(payment.amount || 0).toLocaleString()}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Type: </span>
            <span style={{ color: 'var(--text-primary)' }}>{payment.payment_type?.toUpperCase()}</span>
          </div>
          {payment.application && (
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Application: </span>
              <span style={{ color: 'var(--text-primary)' }}>{payment.application.application_number}</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Action
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            style={{
              borderColor: 'var(--input-border)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--background)',
            }}
          >
            <option value="verified">Verify Payment</option>
            <option value="rejected">Reject Payment</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add verification notes..."
            rows={4}
            className="w-full px-3 py-2 border rounded-lg resize-none text-sm"
            style={{
              borderColor: 'var(--input-border)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--background)',
            }}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
              status === 'verified' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {submitting ? 'Processing...' : (status === 'verified' ? 'Verify' : 'Reject')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentVerificationQueuePage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState('verified');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('verified');
  const [bulkNotes, setBulkNotes] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  const fetchPayments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
      };
      const data = await getUnverifiedPayments(params, token);
      setPayments(data.items);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [token, page, limit]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleVerify = () => {
    fetchPayments();
    setSelectedIds(new Set());
  };

  const handleSelectPayment = (paymentId, initialStatus = 'verified') => {
    setSelectedPayment(payments.find(p => p.id === paymentId));
    setModalInitialStatus(initialStatus);
    setShowModal(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(payments.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (paymentId) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(paymentId)) {
      newSelected.delete(paymentId);
    } else {
      newSelected.add(paymentId);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkVerify = async () => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one payment');
      return;
    }

    setBulkSubmitting(true);
    try {
      const promises = Array.from(selectedIds).map(id =>
        verifyPayment(id, bulkStatus, bulkNotes || null, token)
      );
      await Promise.all(promises);
      toast.success(`Successfully ${bulkStatus === 'verified' ? 'verified' : 'rejected'} ${selectedIds.size} payment(s)`);
      setShowBulkModal(false);
      setBulkNotes('');
      setBulkStatus('verified');
      handleVerify();
    } catch (err) {
      toast.error('Failed to process bulk verification');
    } finally {
      setBulkSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Payment Verification Queue
        </h2>
        {selectedIds.size > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setBulkStatus('verified');
                setShowBulkModal(true);
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Bulk Verify ({selectedIds.size})
            </button>
            <button
              onClick={() => {
                setBulkStatus('rejected');
                setShowBulkModal(true);
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Bulk Reject ({selectedIds.size})
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center" style={{ color: 'var(--text-secondary)' }}>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4" style={{ borderBottomColor: 'var(--brand-primary)' }} />
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center" style={{ color: 'var(--text-secondary)' }}>
            No unverified payments found.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === payments.length && payments.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(payment.id)}
                        onChange={() => handleSelectOne(payment.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{payment.reference_number}</TableCell>
                    <TableCell className="uppercase">{payment.payment_type}</TableCell>
                    <TableCell>KES {parseFloat(payment.amount).toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{payment.payment_purpose?.replace(/_/g, ' ')}</TableCell>
                    <TableCell>
                      {payment.application ? (
                        <a
                          href={`/admin/applications/${payment.application.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {payment.application.application_number}
                        </a>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{payment.submitted_by_name || '—'}</div>
                        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {payment.submitted_by_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(payment.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSelectPayment(payment.id, 'verified')}
                          className="px-3 py-1 rounded text-xs font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleSelectPayment(payment.id, 'rejected')}
                          className="px-3 py-1 rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page >= pages}
                    className="px-3 py-1 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Single Payment Verification Modal */}
      {selectedPayment && (
        <PaymentVerificationModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onVerify={handleVerify}
          token={token}
          initialStatus={modalInitialStatus}
        />
      )}

      {/* Bulk Verification Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6" style={{ backgroundColor: 'var(--background)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Bulk {bulkStatus === 'verified' ? 'Verify' : 'Reject'} Payments
            </h3>
            
            <div className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              You are about to {bulkStatus === 'verified' ? 'verify' : 'reject'} {selectedIds.size} payment(s).
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Notes (Optional)
              </label>
              <textarea
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
                placeholder="Add verification notes for all selected payments..."
                rows={4}
                className="w-full px-3 py-2 border rounded-lg resize-none text-sm"
                style={{
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--background)',
                }}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkNotes('');
                }}
                disabled={bulkSubmitting}
                className="px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkVerify}
                disabled={bulkSubmitting}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                  bulkStatus === 'verified' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {bulkSubmitting ? 'Processing...' : `${bulkStatus === 'verified' ? 'Verify' : 'Reject'} ${selectedIds.size} Payment(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
