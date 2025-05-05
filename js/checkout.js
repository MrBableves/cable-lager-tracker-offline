
// Checkout System Functions

// Format date in German format (DD.MM.YYYY)
function formatDateGerman(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Format date time in German format (DD.MM.YYYY HH:MM)
function formatDateTimeGerman(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Get checkout history from localStorage
function getCheckoutHistory() {
  const history = localStorage.getItem('checkoutHistory');
  return history ? JSON.parse(history) : [];
}

// Save checkout history to localStorage and CSV
function saveCheckoutHistory(history) {
  localStorage.setItem('checkoutHistory', JSON.stringify(history));
  
  // Save to CSV file
  const csv = convertToCSV(history);
  saveDataToCSV(csv, 'checkout_history.csv');
}

// Save data to CSV file (generic function)
function saveDataToCSV(csvContent, filename) {
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

// Update checkout cable select dropdown with detailed information
function updateCheckoutCableSelect() {
  const inventory = getInventory();
  const select = document.getElementById('checkout-cable');
  
  // Clear current options
  select.innerHTML = '';
  
  // Add default empty option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = getText('select_cable');
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  
  // Add options for each cable with stock > 0 with detailed information
  inventory
    .filter(cable => cable.stock > 0)
    .forEach(cable => {
      const option = document.createElement('option');
      option.value = cable.id;
      
      // Build detailed description with all properties
      let description = `${cable.type}`;
      
      // Add all properties to the description
      if (cable.properties) {
        Object.entries(cable.properties).forEach(([key, value]) => {
          if (typeof value === 'boolean') {
            if (value) {
              description += ` - ${key}`;
            }
          } else if (value) {
            description += ` - ${key}: ${value}`;
          }
        });
      }
      
      description += ` (${cable.stock} ${getText('in_stock')})`;
      
      option.textContent = description;
      select.appendChild(option);
    });
}

// Load checkout history to table with detailed information
function loadCheckoutHistory() {
  const history = getCheckoutHistory();
  const tableBody = document.getElementById('checkout-history-body');
  tableBody.innerHTML = '';
  
  if (history.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6; // Adjusted column count
    cell.textContent = getText('no_checkout_history');
    cell.style.textAlign = 'center';
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }
  
  // Sort history by date, newest first
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sortedHistory.forEach(record => {
    const row = document.createElement('tr');
    
    // Date cell with German format
    const dateCell = document.createElement('td');
    dateCell.textContent = formatDateTimeGerman(record.date);
    
    // Cable cell with detailed information
    const cableCell = document.createElement('td');
    const cableInfo = getCableById(record.cableId);
    
    if (cableInfo) {
      const detailsContainer = document.createElement('div');
      
      // Cable type and ID
      const cableHeader = document.createElement('strong');
      cableHeader.textContent = `${cableInfo.type} (${cableInfo.id})`;
      detailsContainer.appendChild(cableHeader);
      
      // Create properties list
      if (cableInfo.properties && Object.keys(cableInfo.properties).length > 0) {
        const propsList = document.createElement('ul');
        propsList.style.margin = '5px 0 0 0';
        propsList.style.paddingLeft = '15px';
        propsList.style.fontSize = '0.9em';
        
        Object.entries(cableInfo.properties).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const propItem = document.createElement('li');
            
            if (typeof value === 'boolean') {
              propItem.textContent = value ? key : `${key}: ${getText('no')}`;
            } else if (key.toLowerCase().includes('color') && typeof value === 'string' && value.startsWith('#')) {
              propItem.innerHTML = `${key}: <span style="display:inline-block; width:12px; height:12px; background:${value}; border:1px solid #ccc; margin-right:5px;"></span>${value}`;
            } else {
              propItem.textContent = `${key}: ${value}`;
            }
            
            propsList.appendChild(propItem);
          }
        });
        
        if (propsList.children.length > 0) {
          detailsContainer.appendChild(propsList);
        }
      }
      
      // Location information if available
      if (cableInfo.location) {
        const locationInfo = document.createElement('div');
        locationInfo.style.marginTop = '5px';
        locationInfo.style.fontSize = '0.9em';
        locationInfo.textContent = `${getText('location')}: ${cableInfo.location}`;
        detailsContainer.appendChild(locationInfo);
      }
      
      cableCell.appendChild(detailsContainer);
    } else {
      cableCell.textContent = `${record.cableId} (${getText('not_found')})`;
    }
    
    // Quantity cell
    const quantityCell = document.createElement('td');
    quantityCell.textContent = record.quantity;
    
    // Recipient cell
    const recipientCell = document.createElement('td');
    recipientCell.textContent = record.recipient;
    
    // Notes cell
    const notesCell = document.createElement('td');
    notesCell.textContent = record.notes || '-';
    
    // Append cells to row
    row.appendChild(dateCell);
    row.appendChild(cableCell);
    row.appendChild(quantityCell);
    row.appendChild(recipientCell);
    row.appendChild(notesCell);
    
    tableBody.appendChild(row);
  });
}

// Checkout a cable with enhanced information saving
function checkoutCable() {
  const cableId = document.getElementById('checkout-cable').value;
  const quantity = parseInt(document.getElementById('checkout-quantity').value);
  const recipient = document.getElementById('checkout-recipient').value;
  const notes = document.getElementById('checkout-notes').value;
  
  // Validation
  if (!cableId) {
    showMessage(getText('select_cable_to_checkout'), 'error');
    return;
  }
  
  if (isNaN(quantity) || quantity <= 0) {
    showMessage(getText('enter_valid_quantity'), 'error');
    return;
  }
  
  if (!recipient.trim()) {
    showMessage(getText('enter_recipient_name'), 'error');
    return;
  }
  
  // Update stock
  const success = updateCableStock(cableId, quantity);
  
  if (!success) {
    return;
  }
  
  // Get cable information for the record
  const cableInfo = getCableById(cableId);
  let cableDetails = {};
  
  if (cableInfo) {
    cableDetails = {
      type: cableInfo.type,
      properties: cableInfo.properties || {}
    };
  }
  
  // Record the checkout with detailed cable information
  const checkoutRecord = {
    id: 'CO-' + Date.now(),
    date: new Date().toISOString(),
    cableId: cableId,
    cableDetails: cableDetails,
    quantity: quantity,
    recipient: recipient,
    notes: notes
  };
  
  const history = getCheckoutHistory();
  history.push(checkoutRecord);
  saveCheckoutHistory(history);
  
  // Refresh UI
  loadCheckoutHistory();
  updateCheckoutCableSelect();
  loadInventoryData();
  updateLowStockTable();
  
  // Reset form
  document.getElementById('checkout-cable').value = '';
  document.getElementById('checkout-quantity').value = '1';
  document.getElementById('checkout-recipient').value = '';
  document.getElementById('checkout-notes').value = '';
  
  showMessage(getText('checkout_success'), 'success');
}
