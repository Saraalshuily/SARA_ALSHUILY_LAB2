// ===== Feedback form (Lab 2, Grade 3) =====

// --- Select every element once and store the reference ---
const form = document.getElementById('feedback-form');
const fullNameInput = document.getElementById('full-name');
const emailInput = document.getElementById('email');
const topicSelect = document.getElementById('topic');
const commentsInput = document.getElementById('comments');
const websiteInput = document.getElementById('website');

const fullNameError = document.getElementById('full-name-error');
const emailError = document.getElementById('email-error');
const topicError = document.getElementById('topic-error');
const commentsError = document.getElementById('comments-error');
const websiteError = document.getElementById('website-error');

const commentsCounter = document.getElementById('comments-counter');
const clearButton = document.getElementById('clear-button');
const statusArea = document.getElementById('form-status');

// --- Constants ---
const MIN_NAME_LENGTH = 2;
const MIN_COMMENT_LENGTH = 15;
const SUCCESS_MESSAGE_DURATION = 4000; // 4 seconds

// Letters from any language (\p{L}), spaces, apostrophes and hyphens
const NAME_PATTERN = /^[\p{L}][\p{L}\s'’-]*$/u;
// Something@something.tld (simple but plausible check)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Holds the timer id so an old timer can be cancelled
let statusTimeoutId = null;

// ===== DOM helpers: show / clear feedback =====

function showFieldError(input, errorElement, message) {
  input.classList.remove('is-valid');
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
  errorElement.textContent = message;
}

// markValid = true adds the green border (field has been checked and passed)
function clearFieldError(input, errorElement, markValid = false) {
  input.classList.remove('is-invalid');
  input.classList.toggle('is-valid', markValid);
  input.removeAttribute('aria-invalid');
  errorElement.textContent = '';
}

// ===== Validation functions (return true if valid) =====

function validateFullName() {
  const value = fullNameInput.value.trim();

  if (value.length < MIN_NAME_LENGTH) {
    showFieldError(fullNameInput, fullNameError, 'Please enter your full name (at least 2 characters).');
    return false;
  }
  if (!NAME_PATTERN.test(value)) {
    showFieldError(fullNameInput, fullNameError, 'Use only letters, spaces, apostrophes and hyphens.');
    return false;
  }

  clearFieldError(fullNameInput, fullNameError, true);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();

  if (value === '') {
    showFieldError(emailInput, emailError, 'Please enter your email address.');
    return false;
  }
  if (!EMAIL_PATTERN.test(value)) {
    showFieldError(emailInput, emailError, 'Please enter a valid email address, e.g. name@example.com.');
    return false;
  }

  clearFieldError(emailInput, emailError, true);
  return true;
}

function validateTopic() {
  if (topicSelect.value === '') {
    showFieldError(topicSelect, topicError, 'Please choose a topic of interest.');
    return false;
  }

  clearFieldError(topicSelect, topicError, true);
  return true;
}

function validateComments() {
  const length = commentsInput.value.trim().length;

  if (length < MIN_COMMENT_LENGTH) {
    showFieldError(
      commentsInput,
      commentsError,
      `Please write at least ${MIN_COMMENT_LENGTH} characters (you have ${length}).`
    );
    return false;
  }

  clearFieldError(commentsInput, commentsError, true);
  return true;
}

// Optional field: only validated when something has been typed.
// Uses the browser's built-in URL validation (type="url").
function validateWebsite() {
  const value = websiteInput.value.trim();

  if (value === '') {
    clearFieldError(websiteInput, websiteError, false);
    return true;
  }
  if (!websiteInput.checkValidity()) {
    showFieldError(websiteInput, websiteError, 'Please enter a valid URL, e.g. https://www.example.com.');
    return false;
  }

  clearFieldError(websiteInput, websiteError, true);
  return true;
}

// ===== Live character counter =====

function updateCommentsCounter() {
  const length = commentsInput.value.length;
  const remaining = MIN_COMMENT_LENGTH - length;

  if (remaining > 0) {
    commentsCounter.textContent = `${length} characters (minimum ${MIN_COMMENT_LENGTH}, ${remaining} more needed)`;
    commentsCounter.classList.add('too-short');
    commentsCounter.classList.remove('long-enough');
  } else {
    commentsCounter.textContent = `${length} characters (minimum ${MIN_COMMENT_LENGTH} reached)`;
    commentsCounter.classList.add('long-enough');
    commentsCounter.classList.remove('too-short');
  }
}

// ===== Success message =====

function showSuccessMessage(name) {
  clearTimeout(statusTimeoutId); // avoid an old timer hiding a new message

  statusArea.textContent = `Thanks for your feedback, ${name}!`;
  statusArea.classList.add('success');

  statusTimeoutId = setTimeout(hideSuccessMessage, SUCCESS_MESSAGE_DURATION);
}

function hideSuccessMessage() {
  clearTimeout(statusTimeoutId);
  statusArea.textContent = '';
  statusArea.classList.remove('success');
}

// ===== Reset =====

// Restores the complete initial state. keepStatus = true is used after a
// successful submit so the thank-you message stays visible for 4 seconds.
function resetForm(keepStatus = false) {
  form.reset();

  const fields = [
    [fullNameInput, fullNameError],
    [emailInput, emailError],
    [topicSelect, topicError],
    [commentsInput, commentsError],
    [websiteInput, websiteError]
  ];
  fields.forEach(([input, errorElement]) => clearFieldError(input, errorElement, false));

  commentsCounter.classList.remove('too-short', 'long-enough');
  commentsCounter.textContent = `0 characters (minimum ${MIN_COMMENT_LENGTH})`;

  if (!keepStatus) {
    hideSuccessMessage();
  }
}

// ===== Event listeners =====

form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading

  // Run every validation (no early exit) so all errors show at once
  const results = [
    validateFullName(),
    validateEmail(),
    validateTopic(),
    validateComments(),
    validateWebsite()
  ];

  if (results.includes(false)) {
    hideSuccessMessage();
    // Move focus to the first field with an error
    const firstInvalid = form.querySelector('.is-invalid');
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

  const name = fullNameInput.value.trim();
  resetForm(true);
  showSuccessMessage(name);
});

clearButton.addEventListener('click', () => resetForm());

// Live counter on every keystroke
commentsInput.addEventListener('input', updateCommentsCounter);

// Validate a field when the user leaves it
fullNameInput.addEventListener('blur', validateFullName);
emailInput.addEventListener('blur', validateEmail);
topicSelect.addEventListener('blur', validateTopic);
commentsInput.addEventListener('blur', validateComments);
websiteInput.addEventListener('blur', validateWebsite);

// After a field has been checked once, re-validate while typing so
// errors disappear as soon as the value becomes valid
function revalidateOnInput(input, validateFn) {
  input.addEventListener('input', () => {
    if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
      validateFn();
    }
  });
}

revalidateOnInput(fullNameInput, validateFullName);
revalidateOnInput(emailInput, validateEmail);
revalidateOnInput(commentsInput, validateComments);
revalidateOnInput(websiteInput, validateWebsite);
topicSelect.addEventListener('change', validateTopic);