// Import/Export Functions

// Export data to CSV
function exportData() {
  const exportType = document.getElementById('export-type').value;
  let data = [];
  let filename = '';
  
  switch(exportType) {
    case 'inventory':
      data = getInventory();
      filename = 'cable_inventory';
      break;
    case 'cable-types':
      data = getCableTypes();
      filename = 'cable_types';
      break;
    case 'deliveries':
      data = getDeliveries();
      filename = 'cable_deliveries';
      break;
    case 'checkout':
      data = getCheckoutHistory();
      filename = 'checkout_history';
      break;
    case 'all':
      exportAllData();
      return;
    default:
      showMessage(getText('export_failed'), 'error');
      return;
  }
  
  if (data.length === 0) {
    showMessage(getText('no_data'), 'info');
    return;
  }
  
  const csv = convertToCSV(data);
  downloadCSV(csv, filename);
  
  showMessage(getText('export_success'), 'success');
}

// Convert data to CSV format
function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(item => {
    return Object.values(item).map(value => {
      // Handle complex objects by converting to JSON
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // Handle strings with commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  }).join('\n');
  
  return `${header}\n${rows}`;
}

// Download CSV file
function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Format date in German format DD.MM.YYYY
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();
  const dateStr = `${day}.${month}.${year}`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${dateStr}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Also save CSV to localStorage for backup
  localStorage.setItem(`${filename}_csv`, csv);
}

// Import data from CSV file
function importData() {
  const importType = document.getElementById('import-type').value;
  const fileInput = document.getElementById('import-file');
  
  if (!fileInput.files || fileInput.files.length === 0) {
    showMessage(getText('select_file'), 'error');
    return;
  }
  
  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const contents = e.target.result;
    const data = parseCSV(contents);
    
    if (!data || data.length === 0) {
      showMessage(getText('import_failed'), 'error');
      return;
    }
    
    switch(importType) {
      case 'inventory':
        saveInventory(data);
        loadInventoryData();
        break;
      case 'cable-types':
        saveCableTypes(data);
        loadCableTypesData();
        break;
      case 'deliveries':
        saveDeliveries(data);
        loadDeliveriesData();
        break;
      case 'checkout':
        saveCheckoutHistory(data);
        loadCheckoutHistory();
        break;
      default:
        showMessage(getText('import_failed'), 'error');
        return;
    }
    
    showMessage(getText('import_success'), 'success');
    fileInput.value = '';
    
    // Update related UI components
    updateLowStockTable();
    loadDashboardData();
    if (typeof updateCableTypeSelects === 'function') {
      updateCableTypeSelects();
    }
  };
  
  reader.onerror = function() {
    showMessage(getText('import_failed'), 'error');
  };
  
  reader.readAsText(file);
}

// Parse CSV to array of objects
function parseCSV(csv) {
  // Basic CSV parsing - could be improved for handling quoted fields, etc.
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    if (values.length !== headers.length) {
      console.error(`Mismatch in CSV line ${i}:`, line);
      continue;
    }
    
    const obj = {};
    headers.forEach((header, index) => {
      let value = values[index];
      
      // Try to detect and parse JSON objects
      if (value && 
          ((value.startsWith('{') && value.endsWith('}')) || 
           (value.startsWith('[') && value.endsWith(']')))) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Not valid JSON, keep as string
        }
      } 
      // Try to convert numbers
      else if (value && !isNaN(value) && value.trim() !== '') {
        if (value.includes('.')) {
          value = parseFloat(value);
        } else {
          value = parseInt(value);
        }
      }
      
      obj[header] = value;
    });
    
    result.push(obj);
  }
  
  return result;
}

// Parse a CSV line, handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // Check if it's an escaped quote
      if (i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // Skip the next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}
