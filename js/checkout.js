
// Checkout System Functions

// Get checkout history from localStorage
function getCheckoutHistory() {
  const history = localStorage.getItem('checkoutHistory');
  return history ? JSON.parse(history) : [];
}

// Save checkout history to localStorage
function saveCheckoutHistory(history) {
  localStorage.setItem('checkoutHistory', JSON.stringify(history));
}

// Update checkout cable select dropdown
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
  
  // Add options for each cable with stock > 0
  inventory
    .filter(cable => cable.stock > 0)
    .forEach(cable => {
      const option = document.createElement('option');
      option.value = cable.id;
      option.textContent = `${cable.type} - ${cable.length}m - ${cable.color} (${cable.stock} ${getText('in_stock')})`;
      select.appendChild(option);
    });
}

// Load checkout history to table
function loadCheckoutHistory() {
  const history = getCheckoutHistory();
  const tableBody = document.getElementById('checkout-history-body');
  tableBody.innerHTML = '';
  
  if (history.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
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
    
    // Date cell
    const dateCell = document.createElement('td');
    dateCell.textContent = new Date(record.date).toLocaleString();
    
    // Cable cell
    const cableCell = document.createElement('td');
    const cableInfo = getCableById(record.cableId);
    cableCell.textContent = cableInfo ? `${cableInfo.type} (${cableInfo.id})` : record.cableId;
    
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

// Checkout a cable
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
  
  // Record the checkout
  const checkoutRecord = {
    id: 'CO-' + Date.now(),
    date: new Date().toISOString(),
    cableId: cableId,
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
  
  // Reset form
  document.getElementById('checkout-cable').value = '';
  document.getElementById('checkout-quantity').value = '1';
  document.getElementById('checkout-recipient').value = '';
  document.getElementById('checkout-notes').value = '';
  
  showMessage(getText('checkout_success'), 'success');
}
