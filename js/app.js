
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
    });
  });
}

// Load all data from localStorage
function loadAllData() {
  // Load inventory data
  loadInventoryData();
  
  // Update low stock table
  updateLowStockTable();
  
  // Load checkout history
  loadCheckoutHistory();
  
  // Initialize barcode system
  initBarcodeSystem();
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
  document.getElementById('low-stock-threshold').addEventListener('change', updateLowStockTable);
  
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
    const modal = document.getElementById('cable-modal');
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Open modal for adding a new cable
function openAddCableModal() {
  document.getElementById('modal-title').textContent = getText('add_new_cable');
  document.getElementById('save-cable-text').textContent = getText('save');
  document.getElementById('edit-mode').value = 'add';
  
  // Reset form fields
  document.getElementById('cable-form').reset();
  
  // Generate a unique ID
  document.getElementById('cable-id').value = generateUniqueId();
  
  // Show modal
  document.getElementById('cable-modal').style.display = 'block';
}

// Open modal for editing a cable
function openEditCableModal(cableId) {
  const inventory = getInventory();
  const cable = inventory.find(item => item.id === cableId);
  
  if (!cable) return;
  
  document.getElementById('modal-title').textContent = getText('edit_cable');
  document.getElementById('save-cable-text').textContent = getText('update');
  document.getElementById('edit-mode').value = 'edit';
  
  // Fill form fields with cable data
  document.getElementById('cable-id').value = cable.id;
  document.getElementById('cable-type').value = cable.type;
  document.getElementById('cable-length').value = cable.length;
  document.getElementById('cable-color').value = cable.color;
  document.getElementById('cable-stock').value = cable.stock;
  document.getElementById('cable-location').value = cable.location;
  
  // Show modal
  document.getElementById('cable-modal').style.display = 'block';
}

// Close modal
function closeModal() {
  document.getElementById('cable-modal').style.display = 'none';
}

// Save cable data from form
function saveCable(e) {
  e.preventDefault();
  
  const mode = document.getElementById('edit-mode').value;
  const cableData = {
    id: document.getElementById('cable-id').value,
    type: document.getElementById('cable-type').value,
    length: parseFloat(document.getElementById('cable-length').value),
    color: document.getElementById('cable-color').value,
    stock: parseInt(document.getElementById('cable-stock').value),
    location: document.getElementById('cable-location').value
  };
  
  if (mode === 'add') {
    addCable(cableData);
  } else {
    updateCable(cableData);
  }
  
  closeModal();
}

// Generate a unique ID for new cables
function generateUniqueId() {
  return 'CAB-' + Date.now().toString().slice(-6);
}

// Filter inventory table based on search term
function filterInventoryTable(searchTerm) {
  const rows = document.getElementById('inventory-body').querySelectorAll('tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
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
