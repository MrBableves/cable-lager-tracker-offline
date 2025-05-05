
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
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  if (theme === 'dark') {
    themeToggle.innerHTML = `
      <span class="theme-icon">🌙</span>
    `;
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
    themeToggle.title = 'Switch to light mode';
  } else {
    themeToggle.innerHTML = `
      <span class="theme-icon">☀️</span>
    `;
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    themeToggle.title = 'Switch to dark mode';
  }
}

// Get current theme
function getCurrentTheme() {
  return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
}
