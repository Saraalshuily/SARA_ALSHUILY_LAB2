# Lab 2: Interactive Portfolio Enhancements

**Target grade: 3**

## Implemented features
- Feedback form with fields: Full Name, Email, Topic of Interest, Comments and Website (optional)
- Validation for every field, with error messages shown next to the field
- Normal, focus, error and valid visual states
- Live character counter for the comments field (minimum 15 characters)
- Success message "Thanks for your feedback, [name]!" that disappears after 4 seconds
- Clear button that restores the complete initial state
- Responsive layout for mobile and desktop

## How to run
1. Download or clone the repository.
2. Open `index.html` in a web browser (or use the Live Server extension in VS Code).

No server or installation is needed. The form data is not sent anywhere.

## Files
- `index.html`: page structure and form
- `css/style.css`: styling and visual states
- `js/index.js`: validation, live counter and form behavior
- `screenshots/`: screenshots of the form in different states

## Testing
- Submitted an empty form: all required fields show a red border and an error message
- Typed an invalid email (`nora@`): error message shown
- Live counter turns from red to green at 15 characters
- Valid submit shows "Thanks for your feedback, [name]!" and resets the form after 4 seconds
- Clear button restores the initial state
- Checked the layout at mobile width (iPhone 16 in Chrome DevTools) and on desktop
- Browser console shows no errors