
// Main App JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize tab functionality
  initializeTabs();
  
  // Load data from localStorage
  loadAllData();
  
  // Set up event listeners
  setupEventListeners();
});

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
      document.getElementById(tabId).classList.add('active');
      
      // Scroll to top when changing tabs
      window.scrollTo(0, 0);
    });
  });
}

// Load all data from localStorage
function loadAllData() {
  // Load cable types data
  loadCableTypesData();
  
  // Load inventory data
  loadInventoryData();
  
  // Update low stock table
  updateLowStockTable();
  
  // Load checkout history
  loadCheckoutHistory();
  
  // Initialize barcode system
  initBarcodeSystem();
  
  // Load deliveries data
  loadDeliveriesData();
  
  // Load dashboard data
  loadDashboardData();
}

// Set up global event listeners
function setupEventListeners() {
  // Add Cable button click
  document.getElementById('add-cable-btn').addEventListener('click', openAddCableModal);
  
  // Close modal button click
  document.getElementById('close-modal').addEventListener('click', closeModal);
  
  // Save cable form submit
  document.getElementById('cable-form').addEventListener('submit', saveCable);
  
  // Checkout button click
  document.getElementById('checkout-btn').addEventListener('click', checkoutCable);
  
  // Low stock threshold change
  document.getElementById('low-stock-threshold').addEventListener('change', function() {
    updateLowStockTable();
    updateLowStockSummary(); // Update dashboard low stock summary
  });
  
  // Import button click
  document.getElementById('import-btn').addEventListener('click', importData);
  
  // Export button click
  document.getElementById('export-btn').addEventListener('click', exportData);
  
  // Scan button click
  document.getElementById('scan-button').addEventListener('click', handleBarcodeScan);
  
  // Register barcode button click
  document.getElementById('register-barcode-btn').addEventListener('click', registerBarcode);
  
  // Handle barcode input key press for scanner simulation
  document.getElementById('barcode-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleBarcodeScan();
    }
  });
  
  // Search functionality
  document.getElementById('inventory-search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    filterInventoryTable(searchTerm);
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Window resize event for charts
  window.addEventListener('resize', function() {
    // Redraw charts when window is resized
    if (document.getElementById('dashboard').classList.contains('active')) {
      initCharts();
    }
  });
  
  // Tab change events for chart rendering
  document.getElementById('tab-dashboard').addEventListener('click', function() {
    // Delay to ensure DOM is ready
    setTimeout(initCharts, 100);
  });
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
