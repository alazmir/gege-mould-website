/**
 * Server-side validation for quote/contact form submissions.
 * Validates: required fields, email format, length limits.
 * Returns { valid, errors[], data } — never trust client-side validation alone.
 */

const MAX_FIELD_LENGTHS = {
  name: 120,
  company: 150,
  email: 254,
  phone: 40,
  inquiry: 60,
  message: 8000,
};

const VALID_INQUIRY_TYPES = [
  'new-mold',
  'molding',
  'design',
  'technical',
  'partnership',
  'other',
  '',
];

function validateQuote(body) {
  const errors = [];
  const data = {};

  // Name — required
  const name = (body.name || '').trim();
  if (!name) {
    errors.push({ field: 'name', message: 'Please enter your full name.' });
  } else if (name.length > MAX_FIELD_LENGTHS.name) {
    errors.push({ field: 'name', message: `Name must be under ${MAX_FIELD_LENGTHS.name} characters.` });
  }
  data.name = name.slice(0, MAX_FIELD_LENGTHS.name);

  // Company — optional
  const company = (body.company || '').trim();
  data.company = company.slice(0, MAX_FIELD_LENGTHS.company);

  // Email — required, valid format
  const email = (body.email || '').trim().toLowerCase();
  if (!email) {
    errors.push({ field: 'email', message: 'Please enter your email address.' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  } else if (email.length > MAX_FIELD_LENGTHS.email) {
    errors.push({ field: 'email', message: 'Email address is too long.' });
  }
  data.email = email.slice(0, MAX_FIELD_LENGTHS.email);

  // Phone — optional
  const phone = (body.phone || '').trim();
  data.phone = phone.slice(0, MAX_FIELD_LENGTHS.phone);

  // Inquiry type — optional but must be valid if provided
  const inquiry = (body.inquiry || '').trim();
  if (inquiry && !VALID_INQUIRY_TYPES.includes(inquiry)) {
    errors.push({ field: 'inquiry', message: 'Invalid inquiry type selected.' });
  }
  data.inquiry = inquiry.slice(0, MAX_FIELD_LENGTHS.inquiry);

  // Message — required
  const message = (body.message || '').trim();
  if (!message) {
    errors.push({ field: 'message', message: 'Please describe your project so we can prepare an accurate response.' });
  } else if (message.length < 10) {
    errors.push({ field: 'message', message: 'Please provide a bit more detail about your project (at least 10 characters).' });
  } else if (message.length > MAX_FIELD_LENGTHS.message) {
    errors.push({ field: 'message', message: `Message must be under ${MAX_FIELD_LENGTHS.message} characters.` });
  }
  data.message = message.slice(0, MAX_FIELD_LENGTHS.message);

  // Spam: check for excessive URLs in message
  const urlCount = (data.message.match(/https?:\/\//gi) || []).length;
  if (urlCount > 3) {
    errors.push({ field: 'message', message: 'Please remove some links from your message.' });
  }

  return {
    valid: errors.length === 0,
    errors,
    data,
  };
}

function isValidEmail(email) {
  // RFC 5322 simplified — good enough for production
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/**
 * Server-side validation for RFQ form submissions.
 * Handles the 3-step RFQ form fields.
 */
function validateRfq(body) {
  const errors = [];
  const data = {};

  // Step 1 fields
  const partName = (body.part_name || '').trim();
  if (!partName) errors.push({ field: 'part_name', message: 'Please enter a part or project name.' });
  data.part_name = partName.slice(0, 200);

  const industry = (body.industry || '').trim();
  if (!industry) errors.push({ field: 'industry', message: 'Please select an industry.' });
  data.industry = industry.slice(0, 60);

  const annualVolume = (body.annual_volume || '').trim();
  if (!annualVolume) errors.push({ field: 'annual_volume', message: 'Please select estimated annual volume.' });
  data.annual_volume = annualVolume.slice(0, 60);

  const targetBudget = (body.target_budget || '').trim();
  data.target_budget = targetBudget.slice(0, 60);

  // Step 2 fields
  data.material = (body.material || '').trim().slice(0, 120);
  data.cavities = (body.cavities || '').trim().slice(0, 60);
  data.surface_finish = (body.surface_finish || '').trim().slice(0, 120);
  data.mold_base = (body.mold_base || '').trim().slice(0, 60);
  data.part_dimensions = (body.part_dimensions || '').trim().slice(0, 300);
  data.additional_specs = (body.additional_specs || '').trim().slice(0, 4000);

  // Step 3 fields
  const name = (body.name || '').trim();
  if (!name) errors.push({ field: 'name', message: 'Please enter your full name.' });
  data.name = name.slice(0, 120);

  const company = (body.company || '').trim();
  data.company = company.slice(0, 150);

  const email = (body.email || '').trim().toLowerCase();
  if (!email) errors.push({ field: 'email', message: 'Please enter your email address.' });
  else if (!isValidEmail(email)) errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  data.email = email.slice(0, 254);

  const phone = (body.phone || '').trim();
  data.phone = phone.slice(0, 40);

  const message = (body.message || '').trim();
  data.message = message.slice(0, 8000);

  // Spam check
  const urlCount = (data.message.match(/https?:\/\//gi) || []).length;
  if (urlCount > 3) errors.push({ field: 'message', message: 'Please remove some links from your message.' });

  return { valid: errors.length === 0, errors, data };
}

module.exports = { validateQuote, validateRfq };
