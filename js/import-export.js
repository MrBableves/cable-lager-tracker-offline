// Import/Export functionality

// Convert object array to CSV string
function convertToCSV(objArray) {
  if (!objArray || objArray.length === 0) {
    return '';
  }
  
  // Get headers from first object
  const headers = Object.keys(objArray[0]);
  
  // Create CSV header row
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  objArray.forEach(obj => {
    const row = headers.map(header => {
      let value = obj[header];
      
      // Handle special cases
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'object') {
        // Convert objects (including arrays) to JSON string
        return '"' + JSON.stringify(value).replace(/"/g, '""') + '"';
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes
        return '"' + value.replace(/"/g, '""') + '"';
      } else {
        return value;
      }
    }).join(',');
    
    csvContent += row + '\n';
  });
  
  return csvContent;
}

// Parse CSV string to object array
function parseCSV(csvString) {
  if (!csvString || csvString.trim() === '') {
    return [];
  }
  
  // Split into rows
  const rows = csvString.trim().split('\n');
  if (rows.length < 2) return []; // Need at least headers and one row
  
  // Parse headers
  const headers = parseCSVRow(rows[0]);
  
  // Parse data rows
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    const rowData = parseCSVRow(rows[i]);
    if (rowData.length === headers.length) {
      const rowObj = {};
      headers.forEach((header, index) => {
        let value = rowData[index];
        
        // Try to parse JSON for object values
        if (value && value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1); // Remove outer quotes
          
          try {
            value = JSON.parse(value);
          } catch (e) {
            // If parsing fails, keep as string
          }
        }
        
        rowObj[header] = value;
      });
      result.push(rowObj);
    }
  }
  
  return result;
}

// Parse a single CSV row, handling quoted values
function parseCSVRow(row) {
  const result = [];
  let insideQuotes = false;
  let currentValue = '';
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];
    
    if (char === '"' && !insideQuotes) {
      insideQuotes = true;
    } else if (char === '"' && nextChar === '"') {
      currentValue += '"';
      i++; // Skip next quote
    } else if (char === '"' && insideQuotes) {
      insideQuotes = false;
    } else if (char === ',' && !insideQuotes) {
      result.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add the last value
  result.push(currentValue);
  
  return result;
}

// Export data to CSV
function exportData() {
  const exportType = document.getElementById('export-type').value;
  let data = [];
  let filename = '';
  
  switch (exportType) {
    case 'inventory':
      data = getInventory();
      filename = 'cable_inventory.csv';
      break;
    case 'cable-types':
      data = getCableTypes();
      filename = 'cable_types.csv';
      break;
    case 'checkout':
      data = getCheckoutHistory();
      filename = 'checkout_history.csv';
      break;
    case 'deliveries':
      data = getDeliveries();
      filename = 'deliveries.csv';
      break;
    case 'all':
      exportAllData();
      return;
  }
  
  if (data.length === 0) {
    showMessage(getText('no_data'), 'warning');
    return;
  }
  
  const csvContent = convertToCSV(data);
  saveDataToCSV(csvContent, filename);
  showMessage(getText('export_success'), 'success');
}

// Import data from CSV
function importData() {
  const importType = document.getElementById('import-type').value;
  const fileInput = document.getElementById('import-file');
  
  if (!fileInput.files || !fileInput.files[0]) {
    showMessage(getText('select_csv_file'), 'error');
    return;
  }
  
  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const csvContent = e.target.result;
    const importedData = parseCSV(csvContent);
    
    if (!importedData || importedData.length === 0) {
      showMessage(getText('invalid_csv'), 'error');
      return;
    }
    
    switch (importType) {
      case 'inventory':
        localStorage.setItem('cableInventory', JSON.stringify(importedData));
        loadInventoryData();
        break;
      case 'cable-types':
        localStorage.setItem('cableTypes', JSON.stringify(importedData));
        loadCableTypesData();
        break;
      case 'checkout':
        localStorage.setItem('checkoutHistory', JSON.stringify(importedData));
        loadCheckoutHistory();
        break;
      case 'deliveries':
        localStorage.setItem('cableDeliveries', JSON.stringify(importedData));
        loadDeliveriesData();
        break;
    }
    
    showMessage(getText('import_success'), 'success');
    
    // Reset file input
    fileInput.value = '';
  };
  
  reader.onerror = function() {
    showMessage(getText('import_failed'), 'error');
  };
  
  reader.readAsText(file);
}

// Get inventory data
function getInventory() {
  const inventoryData = localStorage.getItem('cableInventory');
  return inventoryData ? JSON.parse(inventoryData) : [];
}

// Get cable types data
function getCableTypes() {
  const typesData = localStorage.getItem('cableTypes');
  return typesData ? JSON.parse(typesData) : [];
}

// Get checkout history
function getCheckoutHistory() {
  const historyData = localStorage.getItem('checkoutHistory');
  return historyData ? JSON.parse(historyData) : [];
}

// Find cable type by ID
function getCableTypeById(typeId) {
  const types = getCableTypes();
  return types.find(type => type.id === typeId);
}

// Save data to CSV file
function saveDataToCSV(csvContent, filename) {
  if (typeof csvContent !== 'string' || csvContent.length === 0) return;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a link to download the file
  const link = document.createElement('a');
  
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // For IE
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // For modern browsers
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}
