
// Date Utilities for consistent date handling

// Format date in German format (DD.MM.YYYY)
function formatDateGerman(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Format date time in German format (DD.MM.YYYY HH:MM)
function formatDateTimeGerman(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Parse German format date (DD.MM.YYYY) to ISO string
function parseGermanDate(germanDate) {
  const [day, month, year] = germanDate.split('.');
  return new Date(year, month - 1, day).toISOString();
}

// Get current date in ISO format
function getCurrentDateISO() {
  return new Date().toISOString();
}

// Get current date in German format
function getCurrentDateGerman() {
  return formatDateGerman(new Date().toISOString());
}

// Get current date-time in German format
function getCurrentDateTimeGerman() {
  return formatDateTimeGerman(new Date().toISOString());
}

// Format date for input fields (YYYY-MM-DD)
function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
