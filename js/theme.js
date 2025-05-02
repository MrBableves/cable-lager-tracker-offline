
// Theme Management (Dark/Light Mode)

// Initialize theme system
document.addEventListener('DOMContentLoaded', function() {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('cableTrackerTheme');
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Check for system dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
  
  // Add event listener for theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

// Toggle between light and dark mode
function toggleTheme() {
  const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  setTheme(newTheme);
  localStorage.setItem('cableTrackerTheme', newTheme);
}

// Apply theme to document
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    updateThemeIcon('dark');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    updateThemeIcon('light');
  }
}

// Update theme toggle icon
function updateThemeIcon(theme) {
  const iconElement = document.getElementById('theme-icon');
  
  if (theme === 'dark') {
    iconElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    `;
    iconElement.parentElement.setAttribute('aria-label', 'Switch to light mode');
    iconElement.parentElement.title = 'Switch to light mode';
  } else {
    iconElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    `;
    iconElement.parentElement.setAttribute('aria-label', 'Switch to dark mode');
    iconElement.parentElement.title = 'Switch to dark mode';
  }
}

// Get current theme
function getCurrentTheme() {
  return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
}
