
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

// Format date in German format (DD.MM.YYYY)
function formatDateGerman(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Check localStorage availability and show warning if not available
document.addEventListener('DOMContentLoaded', function() {
  if (!storageAvailable('localStorage')) {
    alert('Warning: Local storage is not available in your browser. The application will not be able to save data between sessions.');
  }
});

// Get file system handle for CSV file storage
async function getFileHandle(filename) {
  try {
    if (window.showSaveFilePicker) {
      const options = {
        suggestedName: filename,
        types: [
          {
            description: 'CSV Files',
            accept: {
              'text/csv': ['.csv'],
            },
          },
        ],
      };
      return await window.showSaveFilePicker(options);
    }
    return null;
  } catch (err) {
    console.error('Error getting file handle:', err);
    return null;
  }
}

// Save CSV data to file
async function saveCSVToFile(csvContent, filename) {
  try {
    const fileHandle = await getFileHandle(filename);
    if (fileHandle) {
      const writable = await fileHandle.createWritable();
      await writable.write(csvContent);
      await writable.close();
      return true;
    } else {
      // Fallback to blob download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    }
  } catch (err) {
    console.error('Error saving CSV file:', err);
    return false;
  }
}

// Export all data to multiple CSV files for full backup
async function exportAllData() {
  const inventory = getInventory();
  const checkoutHistory = getCheckoutHistory();
  const deliveries = getDeliveries();
  const cableTypes = getCableTypes();
  
  // Create and save individual CSV files
  const inventoryCSV = convertToCSV(inventory);
  const checkoutCSV = convertToCSV(checkoutHistory);
  const deliveriesCSV = convertToCSV(deliveries);
  const cableTypesCSV = convertToCSV(cableTypes);
  
  // Save to localStorage as backup
  localStorage.setItem('inventoryCSV', inventoryCSV);
  localStorage.setItem('checkoutHistoryCSV', checkoutCSV);
  localStorage.setItem('deliveriesCSV', deliveriesCSV);
  localStorage.setItem('cableTypesCSV', cableTypesCSV);
  
  // Get current date for filenames in German format (DD.MM.YYYY)
  const currentDate = formatDateGerman(new Date().toISOString());
  
  // Download files
  try {
    await saveCSVToFile(inventoryCSV, `cable_inventory_${currentDate}.csv`);
    await saveCSVToFile(checkoutCSV, `checkout_history_${currentDate}.csv`);
    await saveCSVToFile(deliveriesCSV, `deliveries_${currentDate}.csv`);
    await saveCSVToFile(cableTypesCSV, `cable_types_${currentDate}.csv`);
    
    showMessage(getText('export_all_success'), 'success');
  } catch (error) {
    console.error('Error exporting files:', error);
    showMessage(getText('export_error'), 'error');
  }
}

// Clear all stored data (with confirmation)
function clearAllData() {
  if (confirm(getText('confirm_clear_all_data'))) {
    localStorage.removeItem('cableInventory');
    localStorage.removeItem('checkoutHistory');
    localStorage.removeItem('cableBarcodes'); // Still clear even though UI is removed
    localStorage.removeItem('cableDeliveries');
    localStorage.removeItem('cableTypes');
    
    // Clear CSV backups too
    localStorage.removeItem('inventoryCSV');
    localStorage.removeItem('checkoutHistoryCSV');
    localStorage.removeItem('deliveriesCSV');
    localStorage.removeItem('cableTypesCSV');
    
    // Reload the page
    window.location.reload();
  }
}
