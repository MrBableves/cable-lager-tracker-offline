
// Storage System for CSV/localStorage handling

// Check if browser supports localStorage
const storageAvailable = (type) => {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
};

// Check localStorage availability and show warning if not available
document.addEventListener('DOMContentLoaded', function() {
  if (!storageAvailable('localStorage')) {
    alert('Warning: Local storage is not available in your browser. The application will not be able to save data between sessions.');
  }
});

// Export all data to single CSV bundle file for full backup
function exportAllData() {
  // Create a ZIP file containing all CSV exports
  // For simplicity, we'll just combine all data into one CSV file
  // In a real implementation, this might use JSZip or similar
  
  const inventory = getInventory();
  const checkoutHistory = getCheckoutHistory();
  const barcodes = getBarcodes();
  
  // Create CSV sections with headers
  let csvContent = "## CABLE INVENTORY SYSTEM EXPORT ##\n\n";
  
  // Inventory section
  csvContent += "## INVENTORY DATA ##\n";
  csvContent += convertToCSV(inventory) + "\n\n";
  
  // Checkout history section
  csvContent += "## CHECKOUT HISTORY DATA ##\n";
  csvContent += convertToCSV(checkoutHistory) + "\n\n";
  
  // Barcode section
  csvContent += "## BARCODE DATA ##\n";
  csvContent += convertToCSV(barcodes);
  
  // Download the combined file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'cable_inventory_backup.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Clear all stored data (with confirmation)
function clearAllData() {
  if (confirm(getText('confirm_clear_all_data'))) {
    localStorage.removeItem('cableInventory');
    localStorage.removeItem('checkoutHistory');
    localStorage.removeItem('cableBarcodes');
    
    // Reload the page
    window.location.reload();
  }
}
