
// Main App JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize tab functionality
  initializeTabs();
  
  // Load data from localStorage
  loadAllData();
  
  // Set up event listeners
  setupEventListeners();
  
  // Make the navigation menu fixed
  makeMenuFixed();
});

// Make the navigation menu fixed
function makeMenuFixed() {
  const navMenu = document.querySelector('.tab-navigation');
  if (navMenu) {
    navMenu.classList.add('fixed-nav');
    
    // Add padding to the content to prevent it from jumping when the menu becomes fixed
    const mainContent = document.querySelector('.tab-contents');
    if (mainContent) {
      const navHeight = navMenu.offsetHeight;
      mainContent.style.paddingTop = navHeight + 'px';
    }
  }
}

// Initialize tab functionality
function initializeTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to current tab and corresponding content
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      const contentElement = document.getElementById(tabId);
      if (contentElement) {
        contentElement.classList.add('active');
      }
      
      // Scroll to top when changing tabs
      window.scrollTo(0, 0);
    });
  });
}

// Load all data from localStorage
function loadAllData() {
  try {
    // Load cable types data
    if (typeof loadCableTypesData === 'function') {
      loadCableTypesData();
    }
    
    // Load inventory data
    if (typeof loadInventoryData === 'function') {
      loadInventoryData();
    }
    
    // Update low stock table
    if (typeof updateLowStockTable === 'function') {
      updateLowStockTable();
    }
    
    // Load checkout history
    if (typeof loadCheckoutHistory === 'function') {
      loadCheckoutHistory();
    }
    
    // Load deliveries data
    if (typeof loadDeliveriesData === 'function') {
      loadDeliveriesData();
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Set up global event listeners
function setupEventListeners() {
  // Add Cable button click
  const addCableBtn = document.getElementById('add-cable-btn');
  if (addCableBtn) {
    addCableBtn.addEventListener('click', openAddCableModal);
  }
  
  // Close modal buttons click
  document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', function() {
      const modalId = this.closest('.modal').id;
      document.getElementById(modalId).style.display = 'none';
    });
  });
  
  // Save cable form submit
  const cableForm = document.getElementById('cable-form');
  if (cableForm) {
    cableForm.addEventListener('submit', saveCable);
  }
  
  // Checkout button click
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkoutCable);
  }
  
  // Low stock threshold change
  const lowStockThreshold = document.getElementById('low-stock-threshold');
  if (lowStockThreshold) {
    lowStockThreshold.addEventListener('change', function() {
      updateLowStockTable();
    });
  }
  
  // Import button click
  const importBtn = document.getElementById('import-btn');
  if (importBtn) {
    importBtn.addEventListener('click', importData);
  }
  
  // Export button click
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportData);
  }
  
  // Search functionality
  const inventorySearch = document.getElementById('inventory-search');
  if (inventorySearch) {
    inventorySearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      filterInventoryTable(searchTerm);
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Set up language toggle
  const languageToggle = document.getElementById('language-toggle');
  if (languageToggle) {
    languageToggle.addEventListener('click', toggleLanguage);
  }
}

// Show alert message using tooltip or simple alert for now
function showMessage(message, type = 'info') {
  // Simple alert for now, could be enhanced with a custom toast notification
  alert(message);
}

// Helper function to access text based on current language
function getText(key) {
  const lang = getCurrentLanguage();
  return langData[lang][key] || key;
}
