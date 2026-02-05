'use client';

import { useRef, useState } from 'react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { toast } from 'sonner';

const REGISTRATION_TYPES = [
  { value: 'LLC', label: 'LLC (Limited Liability Company)' },
  { value: 'CLG', label: 'CLG (Company Limited by Guarantee)' },
  { value: 'LLP', label: 'LLP (Limited Liability Partnership)' },
  { value: 'SACCO', label: 'SACCO' },
  { value: 'NGO', label: 'NGO / Non-Profit' },
  { value: 'Other', label: 'Other' },
];

/**
 * Step 6 (Full/Basic): Association Details
 * Detailed organisation info + file uploads
 */
export default function AssociationDetailsStep() {
  const { formData, updateField, uploadingCertificate, uploadingKraPin, setUploadingCertificate, setUploadingKraPin } = useApplicationStore();
  const certificateInputRef = useRef(null);
  const kraPinInputRef = useRef(null);
  
  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size must be less than 100MB');
      return;
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or image file (JPG, PNG)');
      return;
    }
    
    if (type === 'certificate') {
      setUploadingCertificate(true);
      updateField('registrationCertificateFile', file);
      // In real implementation, upload to server here
      setTimeout(() => {
        setUploadingCertificate(false);
        toast.success('Registration certificate uploaded');
      }, 1000);
    } else {
      setUploadingKraPin(true);
      updateField('kraPinFile', file);
      setTimeout(() => {
        setUploadingKraPin(false);
        toast.success('KRA PIN document uploaded');
      }, 1000);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div 
          className="inline-flex items-center px-4 py-2 rounded-full mb-4"
          style={{ backgroundColor: 'rgba(145, 162, 123, 0.2)' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--brand-accent)' }}>
            Association Details
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Tell us about your association
        </h2>
        <p className="text-sm max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Thank you for filling out the eligibility questionnaire. Your association meets the minimum 
          requirements for registration! As a Company Limited by Guarantee, we are required to collect 
          certain types of information from members.
        </p>
      </div>
      
      {/* Registration Type */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Registration Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Type of Registration */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Type of Registration <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.registrationType}
              onChange={(e) => updateField('registrationType', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all bg-white"
              required
            >
              <option value="">Select registration type</option>
              {REGISTRATION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          {/* Other Registration Type */}
          {formData.registrationType === 'Other' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Please specify <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.registrationTypeOther}
                onChange={(e) => updateField('registrationTypeOther', e.target.value)}
                placeholder="Specify your registration type"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
              />
            </div>
          )}
          
          {/* Total Members */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Total Number of Members
            </label>
            <input
              type="number"
              value={formData.totalMembers}
              onChange={(e) => updateField('totalMembers', e.target.value)}
              placeholder="e.g., 50"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            />
          </div>
          
          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Certificate of Registration Number
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => updateField('registrationNumber', e.target.value)}
              placeholder="Required by registrar of companies"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            />
          </div>
          
          {/* Registration Date */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Date of Registration
            </label>
            <input
              type="date"
              value={formData.registrationDate}
              onChange={(e) => updateField('registrationDate', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              As per your Certificate of Registration
            </p>
          </div>
        </div>
        
        {/* Organisation Description */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Brief description of the Association / Company / Group <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.organisationDescription}
            onChange={(e) => updateField('organisationDescription', e.target.value)}
            placeholder="Describe your organisation, its mission, and activities..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all resize-none"
            required
          />
        </div>
      </div>
      
      {/* File Uploads */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Document Uploads
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Registration Certificate Upload */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Association Registration Certificate
            </label>
            <input
              type="file"
              ref={certificateInputRef}
              onChange={(e) => handleFileUpload(e.target.files[0], 'certificate')}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            <div
              onClick={() => certificateInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                formData.registrationCertificateFile
                  ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {uploadingCertificate ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Uploading...</span>
                </div>
              ) : formData.registrationCertificateFile ? (
                <div className="space-y-2">
                  <svg className="w-8 h-8 mx-auto text-[var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {formData.registrationCertificateFile.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Click to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg className="w-8 h-8 mx-auto" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    PDF, JPG, PNG (max 100MB)
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* KRA PIN Upload */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Association KRA PIN <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>(if available)</span>
            </label>
            <input
              type="file"
              ref={kraPinInputRef}
              onChange={(e) => handleFileUpload(e.target.files[0], 'krapin')}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            <div
              onClick={() => kraPinInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                formData.kraPinFile
                  ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {uploadingKraPin ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Uploading...</span>
                </div>
              ) : formData.kraPinFile ? (
                <div className="space-y-2">
                  <svg className="w-8 h-8 mx-auto text-[var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {formData.kraPinFile.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Click to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg className="w-8 h-8 mx-auto" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    PDF, JPG, PNG (max 100MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Representative Details */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Association Representative
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Please select one member of leadership to represent your association within the Network - 
            we recommend the Board Chair or CEO.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Representative Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.representativeName}
              onChange={(e) => updateField('representativeName', e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Designation
            </label>
            <input
              type="text"
              value={formData.representativeDesignation}
              onChange={(e) => updateField('representativeDesignation', e.target.value)}
              placeholder="e.g., CEO, Board Chair"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.representativeEmail}
              onChange={(e) => updateField('representativeEmail', e.target.value)}
              placeholder="representative@organisation.co.ke"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.representativePhone}
              onChange={(e) => updateField('representativePhone', e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            />
          </div>
        </div>
      </div>
      
      {/* Board/Leadership */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Leadership <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>(where applicable)</span>
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Chairperson of the Board
            </label>
            <input
              type="text"
              value={formData.chairpersonName}
              onChange={(e) => updateField('chairpersonName', e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Vice Chair of the Board
            </label>
            <input
              type="text"
              value={formData.viceChairName}
              onChange={(e) => updateField('viceChairName', e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Chief Executive Officer
            </label>
            <input
              type="text"
              value={formData.ceoName}
              onChange={(e) => updateField('ceoName', e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
