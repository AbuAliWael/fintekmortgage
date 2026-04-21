// GA4 event helpers — G-0TKD4WCGLH
// Import and call these from any component to track key interactions.

const fire = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const ga = {
  // Form events
  formSubmit: (formName, extra = {}) => fire('form_submit', { form_name: formName, ...extra }),
  applySubmit: (loanType) => fire('apply_submit', { loan_type: loanType }),
  qualifyComplete: (result, employmentType) =>
    fire('qualify_complete', { recommended_loan: result, employment_type: employmentType }),

  // Calculator
  calculatorUsed: (loanAmount, termYears, rate) =>
    fire('calculator_used', { loan_amount: loanAmount, term_years: termYears, rate }),

  // CTA interactions
  ctaClick: (button, page) => fire('cta_click', { button_name: button, page_location: page }),
  callClick: (page) => fire('call_click', { page_location: page }),
  bookingClick: (page) => fire('booking_click', { page_location: page }),

  // Language
  languageToggle: (toLang) => fire('language_toggle', { language: toLang }),

  // Loan page views
  loanPageView: (loanType) => fire('loan_page_view', { loan_type: loanType }),

  // Lead events
  leadQualified: (loanType) => fire('lead_qualified', { loan_type: loanType }),
  leadUnqualified: (reason) => fire('lead_unqualified', { reason }),
};

export default ga;
