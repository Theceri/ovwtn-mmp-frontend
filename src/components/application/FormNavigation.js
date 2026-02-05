'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

/**
 * Navigation buttons for the multi-step form
 */
export default function FormNavigation({ 
  onNext, 
  onPrev, 
  onSubmit,
  isLastStep = false,
  isFirstStep = false,
  nextLabel = 'Continue',
  prevLabel = 'Back',
  submitLabel = 'Submit Application',
  loading = false,
}) {
  const { canGoNext, isSubmitting } = useApplicationStore();
  const canProceed = canGoNext();
  
  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
      {/* Back button */}
      <div>
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrev}
            disabled={loading || isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{prevLabel}</span>
          </button>
        )}
      </div>
      
      {/* Next/Submit button */}
      <div>
        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canProceed || loading || isSubmitting}
            className="flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>{submitLabel}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed || loading}
            className="flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <span>{nextLabel}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
