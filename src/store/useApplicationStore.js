import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Application form state management
 * Manages the multi-step membership application form with conditional routing
 * 
 * Form flows based on membership type. The membership selection comes first so
 * applicants understand their options before committing, and for Full/Basic the
 * eligibility pre-screen runs before any personal/organisation details are
 * collected (so applicants can confirm they qualify before sharing data):
 *
 * FULL/BASIC: MembershipSelect → Eligibility(3 steps) → Email → BasicInfo →
 *             AssociationDetails → MembershipContribution → RegisterInterest(optional) →
 *             KeyIssues → Submit
 *
 * ASSOCIATE: MembershipSelect → Email → BasicInfo → Submit
 *
 * REGISTERING_INTEREST: MembershipSelect → Email → BasicInfo → RegisterInterest → KeyIssues → Submit
 */

const initialFormData = {
  // Step 1: Email
  email: '',
  
  // Step 2: Basic Information
  organisationName: '',
  physicalAddress: '',
  postalAddress: '',
  county: '',
  telephone: '',
  emailAddress: '',
  website: '',
  sectors: '',
  countiesOfOperation: '',
  
  // Step 2: Membership Type Selection
  membershipType: '', // 'full', 'basic', 'associate', 'registering_interest'
  
  // Steps 3-5: Eligibility (Full/Basic only)
  isAssociation: null, // true/false
  isRegistered: null,
  representsWomenInTrade: null,
  
  // Step 6: Association Details (Full/Basic only)
  registrationType: '', // LLC, CLG, LLP, SACCO, NGO, Other
  registrationTypeOther: '',
  organisationDescription: '',
  totalMembers: '',
  registrationNumber: '',
  registrationDate: '',
  registrationCertificateFile: null, // File object
  registrationCertificatePath: '', // Server path after upload
  kraPinFile: null,
  kraPinPath: '',
  
  // Representative details
  representativeName: '',
  representativeDesignation: '',
  representativeEmail: '',
  representativePhone: '',
  
  // Board/Leadership
  chairpersonName: '',
  viceChairName: '',
  ceoName: '',
  
  // Register Interest / Payment
  registerInterest: null, // true/false - whether they want to register interest
  paymentMode: '', // 'mpesa', 'cheque'
  paymentReference: '', // M-Pesa code or cheque reference
  
  // Addressing Key Issues
  tradeBarriers: '',
  advocacyMessages: '',
  associationNeeds: '',
  expectedBenefits: '',
  contributions: [], // Array: Technical Expertise, Training/Mentorship, etc.
  contributionsOther: '',
  
  // Submit Form
  referralSource: [], // How they heard about OVWTN
  referralSourceOther: '',
  dataConsent: false,
};

export const useApplicationStore = create(
  persist(
    (set, get) => ({
      // Form data
      formData: { ...initialFormData },
      
      // Current step index
      currentStep: 0,
      
      // Track if form was started (for showing resume option)
      formStarted: false,
      
      // Track submission state
      isSubmitting: false,
      isSubmitted: false,
      applicationNumber: null,
      submissionError: null,
      
      // File upload states
      uploadingCertificate: false,
      uploadingKraPin: false,
      
      // Update a single field
      updateField: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value },
        formStarted: true,
      })),
      
      // Update multiple fields at once
      updateFields: (fields) => set((state) => ({
        formData: { ...state.formData, ...fields },
        formStarted: true,
      })),
      
      // Set current step
      setCurrentStep: (step) => set({ currentStep: step }),
      
      // Go to next step
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      
      // Go to previous step
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(0, state.currentStep - 1) 
      })),
      
      // Go to a specific step by name (for conditional navigation)
      goToStep: (stepName) => {
        const stepMap = get().getStepMap();
        const stepIndex = stepMap.findIndex(s => s.id === stepName);
        if (stepIndex !== -1) {
          set({ currentStep: stepIndex });
        }
      },
      
      // Get the step map based on membership type
      getStepMap: () => {
        const { membershipType, isAssociation, isRegistered, representsWomenInTrade } = get().formData;

        // Step 1 for everyone: choose a membership so options are understood before committing
        const steps = [
          { id: 'membership-select', title: 'Membership', description: 'Choose your membership' },
        ];

        // Until a membership type is selected, only show the selection step
        if (!membershipType) {
          return steps;
        }

        // Data-collection steps, shared across flows
        const dataSteps = [
          { id: 'email', title: 'Email', description: 'Enter your email address' },
          { id: 'basic-info', title: 'Basic Information', description: 'Organisation details' },
        ];

        // Steps shown when an applicant is directed to register their interest
        const registerInterestSteps = [
          { id: 'register-interest', title: 'Register Interest', description: 'Payment details' },
          { id: 'key-issues', title: 'Key Issues', description: 'Share your priorities' },
          { id: 'submit', title: 'Submit', description: 'Review and submit' },
        ];

        // Associate has simplified flow (no eligibility pre-screen)
        if (membershipType === 'associate') {
          steps.push(
            ...dataSteps,
            { id: 'submit', title: 'Submit', description: 'Review and submit' }
          );
          return steps;
        }

        // Registering Interest flow (no eligibility pre-screen)
        if (membershipType === 'registering_interest') {
          steps.push(...dataSteps, ...registerInterestSteps);
          return steps;
        }

        // Full/Basic flow: eligibility pre-screen runs BEFORE collecting any details
        if (membershipType === 'full' || membershipType === 'basic') {
          steps.push(
            { id: 'eligibility-1', title: 'Eligibility', description: 'Association check' },
          );

          // If they said No to association, collect details then register interest
          if (isAssociation === false) {
            steps.push(...dataSteps, ...registerInterestSteps);
            return steps;
          }

          if (isAssociation === true) {
            steps.push(
              { id: 'eligibility-2', title: 'Registration', description: 'Registration check' },
            );

            // If they said No to registered, collect details then register interest
            if (isRegistered === false) {
              steps.push(...dataSteps, ...registerInterestSteps);
              return steps;
            }

            if (isRegistered === true) {
              steps.push(
                { id: 'eligibility-3', title: 'Membership', description: 'Membership check' },
              );

              // If they said No to women in trade, collect details then register interest
              if (representsWomenInTrade === false) {
                steps.push(...dataSteps, ...registerInterestSteps);
                return steps;
              }

              // All eligibility passed - full flow
              if (representsWomenInTrade === true) {
                steps.push(
                  ...dataSteps,
                  { id: 'association-details', title: 'Association Details', description: 'Your organisation' },
                  { id: 'membership-contribution', title: 'Contribution', description: 'Payment info' },
                  { id: 'register-interest', title: 'Register Interest', description: 'Payment details' },
                  { id: 'key-issues', title: 'Key Issues', description: 'Share your priorities' },
                  { id: 'submit', title: 'Submit', description: 'Review and submit' }
                );
                return steps;
              }
            }
          }
        }

        return steps;
      },
      
      // Get current step info
      getCurrentStepInfo: () => {
        const steps = get().getStepMap();
        const currentStep = get().currentStep;
        return steps[currentStep] || steps[0];
      },
      
      // Check if can go next (basic validation)
      canGoNext: () => {
        const { formData, currentStep } = get();
        const currentStepInfo = get().getCurrentStepInfo();
        
        switch (currentStepInfo.id) {
          case 'membership-select':
            return !!formData.membershipType;
          case 'email':
            return formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
          case 'basic-info':
            return formData.organisationName &&
                   formData.county &&
                   formData.telephone &&
                   formData.emailAddress;
          case 'eligibility-1':
            return formData.isAssociation !== null;
          case 'eligibility-2':
            return formData.isRegistered !== null;
          case 'eligibility-3':
            return formData.representsWomenInTrade !== null;
          case 'association-details':
            return formData.registrationType && 
                   formData.organisationDescription && 
                   formData.representativeName && 
                   formData.representativeEmail;
          case 'membership-contribution':
            return true; // Info page, always can continue
          case 'register-interest':
            return formData.registerInterest !== null;
          case 'key-issues':
            return true; // All fields optional
          case 'submit':
            return formData.dataConsent === true;
          default:
            return true;
        }
      },
      
      // Set submission state
      setSubmitting: (isSubmitting) => set({ isSubmitting }),
      setSubmitted: (isSubmitted, applicationNumber = null) => set({ 
        isSubmitted, 
        applicationNumber 
      }),
      setSubmissionError: (error) => set({ submissionError: error }),
      
      // Set upload states
      setUploadingCertificate: (uploading) => set({ uploadingCertificate: uploading }),
      setUploadingKraPin: (uploading) => set({ uploadingKraPin: uploading }),
      
      // Reset form
      resetForm: () => set({
        formData: { ...initialFormData },
        currentStep: 0,
        formStarted: false,
        isSubmitting: false,
        isSubmitted: false,
        applicationNumber: null,
        submissionError: null,
      }),
      
      // Clear persisted data
      clearSavedData: () => {
        set({
          formData: { ...initialFormData },
          currentStep: 0,
          formStarted: false,
        });
      },
    }),
    {
      name: 'ovwtn-application-storage',
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
        formStarted: state.formStarted,
      }),
    }
  )
);
