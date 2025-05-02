
// Low Stock Functions

// Update the low stock table based on threshold
function updateLowStockTable() {
  const threshold = parseInt(document.getElementById('low-stock-threshold').value);
  const inventory = getInventory();
  const lowStockItems = inventory.filter(item => item.stock <= threshold);
  
  const tableBody = document.getElementById('low-stock-body');
  tableBody.innerHTML = '';
  
  if (lowStockItems.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.textContent = getText('no_low_stock_items');
    cell.style.textAlign = 'center';
    cell.style.padding = '2rem 1rem';
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }
  
  lowStockItems.forEach(item => {
    const row = document.createElement('tr');
    
    // ID cell
    const idCell = document.createElement('td');
    idCell.textContent = item.id;
    
    // Type cell
    const typeCell = document.createElement('td');
    typeCell.textContent = item.type;
    
    // Stock cell
    const stockCell = document.createElement('td');
    
    // Create a stock badge with appropriate styling
    const stockBadge = document.createElement('span');
    stockBadge.textContent = item.stock;
    stockBadge.style.padding = '0.25rem 0.75rem';
    stockBadge.style.borderRadius = '9999px';
    stockBadge.style.fontSize = '0.875rem';
    stockBadge.style.fontWeight = 'bold';
    stockBadge.style.display = 'inline-block';
    
    if (item.stock === 0) {
      stockBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
      stockBadge.style.color = 'var(--danger-color)';
    } else {
      stockBadge.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
      stockBadge.style.color = 'var(--warning-color)';
    }
    
    stockCell.appendChild(stockBadge);
    
    // Threshold cell
    const thresholdCell = document.createElement('td');
    thresholdCell.textContent = threshold;
    
    // Action cell with restock button
    const actionCell = document.createElement('td');
    const restockBtn = document.createElement('button');
    restockBtn.className = 'btn btn-primary';
    restockBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
      <span>${getText('restock')}</span>
    `;
    restockBtn.addEventListener('click', () => showRestockDialog(item));
    actionCell.appendChild(restockBtn);
    
    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(typeCell);
    row.appendChild(stockCell);
    row.appendChild(thresholdCell);
    row.appendChild(actionCell);
    
    tableBody.appendChild(row);
  });
}

// Show restock dialog
function showRestockDialog(item) {
  // Create a modal dialog for restock rather than using prompt
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.maxWidth = '400px';
  
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  
  const title = document.createElement('h3');
  title.textContent = `${getText('restock_item')} ${item.type}`;
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modalHeader.appendChild(title);
  modalHeader.appendChild(closeBtn);
  
  const modalBody = document.createElement('div');
  
  const formGroup = document.createElement('div');
  formGroup.className = 'form-group';
  
  const label = document.createElement('label');
  label.textContent = getText('quantity');
  label.setAttribute('for', 'restock-quantity');
  
  const input = document.createElement('input');
  input.type = 'number';
  input.id = 'restock-quantity';
  input.className = 'number-input';
  input.min = '1';
  input.value = '5';
  
  formGroup.appendChild(label);
  formGroup.appendChild(input);
  
  const modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn';
  cancelBtn.style.marginRight = '0.5rem';
  cancelBtn.textContent = getText('cancel');
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn btn-primary';
  confirmBtn.textContent = getText('confirm');
  confirmBtn.addEventListener('click', () => {
    const quantityNum = parseInt(input.value);
    
    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert(getText('enter_valid_quantity'));
      return;
    }
    
    addCableStock(item.id, quantityNum);
    showMessage(
      `${getText('added')} ${quantityNum} ${getText('items_to_stock_for')} ${item.type}`,
      'success'
    );
    document.body.removeChild(modal);
    updateLowStockTable();
  });
  
  modalFooter.appendChild(cancelBtn);
  modalFooter.appendChild(confirmBtn);
  
  modalBody.appendChild(formGroup);
  
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  
  modal.appendChild(modalContent);
  
  document.body.appendChild(modal);
  
  // Focus the input field
  setTimeout(() => {
    input.focus();
    input.select();
  }, 100);
}
