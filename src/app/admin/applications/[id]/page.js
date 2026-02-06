'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getAdminApplicationDetail, updateAdminNotes, downloadAdminFile, verifyPayment } from '@/lib/api';
import { toast } from 'sonner';

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  const style = styles[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${style}`}>
      {status}
    </span>
  );
}

function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

function InfoSection({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function InfoField({ label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </dt>
      <dd className="text-sm" style={{ color: 'var(--text-primary)' }}>
        {value || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
      </dd>
    </div>
  );
}

function PaymentVerificationModal({ isOpen, onClose, paymentProof, onVerify, token, initialStatus = 'verified' }) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus(initialStatus);
      setNotes('');
    }
  }, [isOpen, initialStatus]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!paymentProof) return;
    
    setSubmitting(true);
    try {
      await verifyPayment(paymentProof.id, status, notes || null, token);
      toast.success(`Payment ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
      onVerify();
      onClose();
      setNotes('');
      setStatus('verified');
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
        
        {paymentProof && (
          <div className="mb-4 space-y-2 text-sm">
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Reference: </span>
              <span style={{ color: 'var(--text-primary)' }}>{paymentProof.reference_number}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Amount: </span>
              <span style={{ color: 'var(--text-primary)' }}>
                KES {parseFloat(paymentProof.amount || 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Type: </span>
              <span style={{ color: 'var(--text-primary)' }}>{paymentProof.payment_type?.toUpperCase()}</span>
            </div>
          </div>
        )}

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

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const applicationId = parseInt(params.id);
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationModalStatus, setVerificationModalStatus] = useState('verified');

  useEffect(() => {
    if (!token || !applicationId) return;
    
    const fetchApplication = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminApplicationDetail(applicationId, token);
        setApplication(data);
        setAdminNotes(data.admin_notes || '');
      } catch (err) {
        setError(err.message || 'Failed to load application');
        toast.error('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, token]);

  const handleSaveNotes = async () => {
    if (!token) return;
    
    setSavingNotes(true);
    try {
      await updateAdminNotes(applicationId, adminNotes, token);
      toast.success('Admin notes saved successfully');
      // Update local state
      setApplication(prev => ({ ...prev, admin_notes: adminNotes }));
    } catch (err) {
      toast.error('Failed to save admin notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDownloadFile = async (fileType) => {
    try {
      await downloadAdminFile(fileType, applicationId, token);
      toast.success('File download started');
    } catch (err) {
      toast.error('Failed to download file');
    }
  };

  const handleVerifyPayment = async () => {
    // Refresh application data after verification
    if (!token || !applicationId) return;
    
    try {
      const data = await getAdminApplicationDetail(applicationId, token);
      setApplication(data);
    } catch (err) {
      toast.error('Failed to refresh application data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
               style={{ borderBottomColor: 'var(--brand-primary)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Application not found'}</p>
          <Link
            href="/admin/applications"
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/applications"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-2 inline-block"
          >
            ← Back to Applications
          </Link>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Application: {application.application_number}
          </h2>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Application Status & Metadata */}
      <InfoSection title="Application Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Application Number" value={application.application_number} />
          <InfoField label="Status" value={<StatusBadge status={application.status} />} />
          <InfoField label="Membership Type" 
                     value={application.membership_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} />
          <InfoField label="Applicant Email" value={application.applicant_email} />
          <InfoField label="Submitted At" value={formatDate(application.submitted_at)} />
          <InfoField label="Created At" value={formatDate(application.created_at)} />
          {application.reviewed_by_name && (
            <>
              <InfoField label="Reviewed By" value={application.reviewed_by_name} />
              <InfoField label="Reviewed At" value={formatDate(application.reviewed_at)} />
            </>
          )}
        </div>
      </InfoSection>

      {/* Organisation Details */}
      <InfoSection title="Organisation Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Organisation Name" value={application.organisation_name} className="md:col-span-2" />
          <InfoField label="Physical Address" value={application.physical_address} className="md:col-span-2" />
          <InfoField label="Postal Address" value={application.postal_address} />
          <InfoField label="County" value={application.county} />
          <InfoField label="Phone Number" value={application.phone_number} />
          <InfoField label="Email Address" value={application.email_address} />
          <InfoField label="Website" value={application.website ? (
            <a href={application.website} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline">{application.website}</a>
          ) : null} />
          <InfoField label="Sectors" 
                     value={application.sectors?.length > 0 ? application.sectors.join(', ') : null} 
                     className="md:col-span-2" />
          <InfoField label="Counties of Operation" 
                     value={application.counties_of_operation?.length > 0 
                       ? application.counties_of_operation.join(', ') 
                       : null} 
                     className="md:col-span-2" />
        </div>
      </InfoSection>

      {/* Eligibility & Registration */}
      {(application.is_association !== null || application.registration_type) && (
        <InfoSection title="Eligibility & Registration">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Is Association" value={application.is_association ? 'Yes' : 'No'} />
            <InfoField label="Is Registered" value={application.is_registered ? 'Yes' : 'No'} />
            <InfoField label="Represents Women in Trade" value={application.represents_women_in_trade ? 'Yes' : 'No'} />
            <InfoField label="Registration Type" value={application.registration_type} />
            {application.registration_type_other && (
              <InfoField label="Registration Type (Other)" value={application.registration_type_other} />
            )}
            <InfoField label="Registration Number" value={application.registration_number} />
            <InfoField label="Registration Date" value={formatDate(application.registration_date)} />
            <InfoField label="Total Members" value={application.total_members} />
            <InfoField label="Organisation Description" 
                       value={application.organisation_description} 
                       className="md:col-span-2" />
          </div>
        </InfoSection>
      )}

      {/* Representative & Leadership */}
      <InfoSection title="Representative & Leadership">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Representative Name" value={application.representative_name} />
          <InfoField label="Representative Designation" value={application.representative_designation} />
          <InfoField label="Representative Email" value={application.representative_email} />
          <InfoField label="Representative Phone" value={application.representative_phone} />
          <InfoField label="Chairperson Name" value={application.chairperson_name} />
          <InfoField label="Vice Chair Name" value={application.vice_chair_name} />
          <InfoField label="CEO Name" value={application.ceo_name} />
        </div>
      </InfoSection>

      {/* File Uploads */}
      {(application.has_registration_certificate || application.has_kra_pin_document) && (
        <InfoSection title="Uploaded Documents">
          <div className="space-y-3">
            {application.has_registration_certificate && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    Registration Certificate
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {application.registration_certificate_path}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadFile('registration_certificate')}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  Download
                </button>
              </div>
            )}
            {application.has_kra_pin_document && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    KRA PIN Document
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {application.kra_pin_document_path}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadFile('kra_pin')}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  Download
                </button>
              </div>
            )}
          </div>
        </InfoSection>
      )}

      {/* Payment Information */}
      {application.payment_proof && (
        <InfoSection title="Payment Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Payment Type" 
                       value={application.payment_proof.payment_type?.toUpperCase()} />
            <InfoField label="Payment Reference" value={application.payment_proof.payment_reference} />
            <InfoField label="Amount" 
                       value={application.payment_proof.amount 
                         ? `KES ${parseFloat(application.payment_proof.amount).toLocaleString()}` 
                         : null} />
            <InfoField label="Payment Purpose" value={application.payment_proof.payment_purpose} />
            <InfoField label="Verification Status" 
                       value={<StatusBadge status={application.payment_proof.verification_status} />} />
            <InfoField label="Payment Date" value={formatDate(application.payment_proof.payment_date)} />
            {application.payment_proof.verification_notes && (
              <InfoField label="Verification Notes" 
                         value={application.payment_proof.verification_notes} 
                         className="md:col-span-2" />
            )}
          </div>
          
          {/* Payment Verification Actions */}
          {application.payment_proof.verification_status === 'pending' && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setVerificationModalStatus('verified');
                    setShowVerificationModal(true);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Verify Payment
                </button>
                <button
                  onClick={() => {
                    setVerificationModalStatus('rejected');
                    setShowVerificationModal(true);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Reject Payment
                </button>
              </div>
            </div>
          )}
        </InfoSection>
      )}

      {/* Payment Verification Modal */}
      <PaymentVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        paymentProof={application?.payment_proof}
        onVerify={handleVerifyPayment}
        token={token}
        initialStatus={verificationModalStatus}
      />

      {/* Addressing Key Issues */}
      {(application.trade_barriers || application.advocacy_messages || application.association_needs || 
        application.expected_benefits || application.contributions?.length > 0) && (
        <InfoSection title="Addressing Key Issues">
          <div className="space-y-4">
            {application.trade_barriers && (
              <InfoField label="Trade Barriers" value={application.trade_barriers} />
            )}
            {application.advocacy_messages && (
              <InfoField label="Advocacy Messages" value={application.advocacy_messages} />
            )}
            {application.association_needs && (
              <InfoField label="Association Needs" value={application.association_needs} />
            )}
            {application.expected_benefits && (
              <InfoField label="Expected Benefits" value={application.expected_benefits} />
            )}
            {application.contributions?.length > 0 && (
              <InfoField label="Contributions" value={application.contributions.join(', ')} />
            )}
            {application.contributions_other && (
              <InfoField label="Contributions (Other)" value={application.contributions_other} />
            )}
          </div>
        </InfoSection>
      )}

      {/* Referral Source */}
      {application.referral_source?.length > 0 && (
        <InfoSection title="How They Heard About OVWTN">
          <InfoField label="Referral Sources" value={application.referral_source.join(', ')} />
          {application.referral_source_other && (
            <InfoField label="Other Source" value={application.referral_source_other} />
          )}
        </InfoSection>
      )}

      {/* Rejection Details */}
      {application.status === 'rejected' && (application.rejection_reason || application.rejection_notes) && (
        <InfoSection title="Rejection Details">
          <InfoField label="Rejection Reason" value={application.rejection_reason} />
          {application.rejection_notes && (
            <InfoField label="Rejection Notes" value={application.rejection_notes} />
          )}
        </InfoSection>
      )}

      {/* Admin Notes */}
      <InfoSection title="Admin Notes">
        <div className="space-y-3">
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add admin notes here..."
            rows={6}
            className="w-full px-4 py-3 border rounded-lg resize-none"
            style={{
              borderColor: 'var(--input-border)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--background)',
            }}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="px-6 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </InfoSection>
    </div>
  );
}
