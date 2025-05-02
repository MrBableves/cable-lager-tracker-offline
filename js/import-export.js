
// Import/Export Functions

// Import data from CSV
function importData() {
  const importType = document.getElementById('import-type').value;
  const fileInput = document.getElementById('import-file');
  
  if (!fileInput.files || fileInput.files.length === 0) {
    showMessage(getText('please_select_file'), 'error');
    return;
  }
  
  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const csvData = e.target.result;
    
    try {
      switch(importType) {
        case 'inventory':
          importInventoryData(csvData);
          break;
        case 'checkout':
          importCheckoutData(csvData);
          break;
        case 'barcodes':
          importBarcodeData(csvData);
          break;
      }
      
      // Reset file input
      fileInput.value = '';
    } catch (error) {
      showMessage(`${getText('import_error')}: ${error.message}`, 'error');
    }
  };
  
  reader.readAsText(file);
}

// Parse CSV data to array of objects
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  const headers = lines[0].split(',').map(header => header.trim());
  
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(val => val.trim());
    
    if (values.length !== headers.length) continue;
    
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });
    
    result.push(entry);
  }
  
  return result;
}

// Import inventory data from CSV
function importInventoryData(csvData) {
  const data = parseCSV(csvData);
  
  // Validate data structure
  if (data.length === 0 || !data[0].id || !data[0].type || !data[0].stock) {
    showMessage(getText('invalid_inventory_format'), 'error');
    return;
  }
  
  // Convert data types
  const inventory = data.map(item => ({
    id: item.id,
    type: item.type,
    length: parseFloat(item.length) || 0,
    color: item.color || '',
    stock: parseInt(item.stock) || 0,
    location: item.location || ''
  }));
  
  // Save to localStorage
  saveInventory(inventory);
  loadInventoryData();
  updateLowStockTable();
  
  showMessage(`${getText('imported')} ${inventory.length} ${getText('inventory_items')}`, 'success');
}

// Import checkout history data from CSV
function importCheckoutData(csvData) {
  const data = parseCSV(csvData);
  
  // Validate data structure
  if (data.length === 0 || !data[0].id || !data[0].cableId || !data[0].date) {
    showMessage(getText('invalid_checkout_format'), 'error');
    return;
  }
  
  // Convert data types
  const history = data.map(item => ({
    id: item.id,
    date: item.date,
    cableId: item.cableId,
    quantity: parseInt(item.quantity) || 1,
    recipient: item.recipient || '',
    notes: item.notes || ''
  }));
  
  // Save to localStorage
  saveCheckoutHistory(history);
  loadCheckoutHistory();
  
  showMessage(`${getText('imported')} ${history.length} ${getText('checkout_records')}`, 'success');
}

// Import barcode data from CSV
function importBarcodeData(csvData) {
  const data = parseCSV(csvData);
  
  // Validate data structure
  if (data.length === 0 || !data[0].code || !data[0].cableId) {
    showMessage(getText('invalid_barcode_format'), 'error');
    return;
  }
  
  // Convert data types
  const barcodes = data.map(item => ({
    code: item.code,
    cableId: item.cableId,
    dateRegistered: item.dateRegistered || new Date().toISOString()
  }));
  
  // Save to localStorage
  saveBarcodes(barcodes);
  
  showMessage(`${getText('imported')} ${barcodes.length} ${getText('barcodes')}`, 'success');
}

// Export data to CSV
function exportData() {
  const exportType = document.getElementById('export-type').value;
  
  try {
    switch(exportType) {
      case 'inventory':
        exportInventoryData();
        break;
      case 'checkout':
        exportCheckoutData();
        break;
      case 'barcodes':
        exportBarcodeData();
        break;
    }
  } catch (error) {
    showMessage(`${getText('export_error')}: ${error.message}`, 'error');
  }
}

// Convert array of objects to CSV
function convertToCSV(objArray) {
  if (objArray.length === 0) {
    return '';
  }
  
  const headers = Object.keys(objArray[0]);
  const headerRow = headers.join(',');
  
  const rows = objArray.map(obj => {
    return headers.map(key => {
      // Handle values with commas by wrapping in quotes
      const value = obj[key] !== undefined ? obj[key].toString() : '';
      return value.includes(',') ? `"${value}"` : value;
    }).join(',');
  });
  
  return [headerRow, ...rows].join('\n');
}

// Download CSV file
function downloadCSV(csvData, filename) {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export inventory data
function exportInventoryData() {
  const inventory = getInventory();
  
  if (inventory.length === 0) {
    showMessage(getText('no_inventory_data'), 'error');
    return;
  }
  
  const csvData = convertToCSV(inventory);
  downloadCSV(csvData, 'cable_inventory.csv');
  
  showMessage(getText('inventory_exported'), 'success');
}

// Export checkout history data
function exportCheckoutData() {
  const history = getCheckoutHistory();
  
  if (history.length === 0) {
    showMessage(getText('no_checkout_data'), 'error');
    return;
  }
  
  const csvData = convertToCSV(history);
  downloadCSV(csvData, 'checkout_history.csv');
  
  showMessage(getText('checkout_exported'), 'success');
}

// Export barcode data
function exportBarcodeData() {
  const barcodes = getBarcodes();
  
  if (barcodes.length === 0) {
    showMessage(getText('no_barcode_data'), 'error');
    return;
  }
  
  const csvData = convertToCSV(barcodes);
  downloadCSV(csvData, 'cable_barcodes.csv');
  
  showMessage(getText('barcodes_exported'), 'success');
}
