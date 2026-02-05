'use client';

import { useApplicationStore } from '@/store/useApplicationStore';

/**
 * Progress indicator showing current step in the multi-step form
 */
export default function FormProgress() {
  const { currentStep, getStepMap } = useApplicationStore();
  const steps = getStepMap();
  
  return (
    <div className="w-full py-4">
      {/* Desktop progress bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    index < currentStep
                      ? 'bg-[var(--brand-accent)] text-white'
                      : index === currentStep
                      ? 'bg-[var(--brand-primary)] text-white ring-4 ring-[var(--brand-primary)]/20'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {/* Step label */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className={`text-xs font-medium ${
                    index <= currentStep ? 'text-[var(--text-primary)]' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand-accent)] transition-all duration-300"
                      style={{ width: index < currentStep ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {steps[currentStep]?.title}
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-[var(--brand-primary)] transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
