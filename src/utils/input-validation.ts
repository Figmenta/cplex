/**
 * Input validation and sanitization utilities for API routes
 * Prevents XSS, email header injection, and input length attacks
 */

// Input length limits (RFC compliant where applicable)
export const INPUT_LIMITS = {
  NAME: 200,
  EMAIL: 254, // RFC 5321 maximum email length
  COMPANY_NAME: 200,
  COUNTRY: 100,
  PROJECT_MESSAGE: 10000,
  PAGE_NAME: 200,
} as const;

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param text - The text to escape
 * @returns Escaped HTML-safe string
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Sanitizes text for use in email subject lines
 * Prevents email header injection by removing newlines and limiting length
 * @param text - The text to sanitize
 * @param maxLength - Maximum length (default: 100)
 * @returns Sanitized subject-safe string
 */
export function sanitizeEmailSubject(text: string, maxLength: number = 100): string {
  if (typeof text !== 'string') {
    return '';
  }
  
  // Remove all newlines and carriage returns to prevent header injection
  return text.replace(/[\r\n]/g, '').substring(0, maxLength);
}

/**
 * Validates input length and returns error message if invalid
 * @param value - The value to validate
 * @param fieldName - Name of the field for error message
 * @param maxLength - Maximum allowed length
 * @returns Error message if invalid, undefined if valid
 */
export function validateInputLength(
  value: string | undefined,
  fieldName: string,
  maxLength: number
): string | undefined {
  if (!value) {
    return undefined; // Let required validation handle empty values
  }
  
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  
  return undefined;
}

/**
 * Validates and sanitizes all form inputs
 * @param inputs - Object containing form inputs
 * @returns Object with validation errors and sanitized values
 */
export function validateFormInputs(inputs: {
  name?: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  country?: string;
  project?: string;
  message?: string;
  expertisePageName?: string;
  solutionPageName?: string;
}): {
  errors: Record<string, string>;
  sanitized: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  const sanitized: Record<string, string> = {};

  // Validate and sanitize name/fullName
  if (inputs.name !== undefined) {
    const error = validateInputLength(inputs.name, 'Name', INPUT_LIMITS.NAME);
    if (error) errors.name = error;
    sanitized.name = escapeHtml(inputs.name);
  }
  
  if (inputs.fullName !== undefined) {
    const error = validateInputLength(inputs.fullName, 'Full name', INPUT_LIMITS.NAME);
    if (error) errors.fullName = error;
    sanitized.fullName = escapeHtml(inputs.fullName);
  }

  // Validate and sanitize email
  if (inputs.email !== undefined) {
    const error = validateInputLength(inputs.email, 'Email', INPUT_LIMITS.EMAIL);
    if (error) errors.email = error;
    sanitized.email = escapeHtml(inputs.email);
  }

  // Validate and sanitize company name
  if (inputs.companyName !== undefined) {
    const error = validateInputLength(inputs.companyName, 'Company name', INPUT_LIMITS.COMPANY_NAME);
    if (error) errors.companyName = error;
    sanitized.companyName = escapeHtml(inputs.companyName);
  }

  // Validate and sanitize country
  if (inputs.country !== undefined) {
    const error = validateInputLength(inputs.country, 'Country', INPUT_LIMITS.COUNTRY);
    if (error) errors.country = error;
    sanitized.country = escapeHtml(inputs.country);
  }

  // Validate and sanitize project/message
  if (inputs.project !== undefined) {
    const error = validateInputLength(inputs.project, 'Project', INPUT_LIMITS.PROJECT_MESSAGE);
    if (error) errors.project = error;
    sanitized.project = escapeHtml(inputs.project);
  }

  if (inputs.message !== undefined) {
    const error = validateInputLength(inputs.message, 'Message', INPUT_LIMITS.PROJECT_MESSAGE);
    if (error) errors.message = error;
    sanitized.message = escapeHtml(inputs.message);
  }

  // Validate and sanitize page names
  if (inputs.expertisePageName !== undefined) {
    const error = validateInputLength(inputs.expertisePageName, 'Expertise page name', INPUT_LIMITS.PAGE_NAME);
    if (error) errors.expertisePageName = error;
    sanitized.expertisePageName = escapeHtml(inputs.expertisePageName);
  }

  if (inputs.solutionPageName !== undefined) {
    const error = validateInputLength(inputs.solutionPageName, 'Solution page name', INPUT_LIMITS.PAGE_NAME);
    if (error) errors.solutionPageName = error;
    sanitized.solutionPageName = escapeHtml(inputs.solutionPageName);
  }

  return { errors, sanitized };
}

