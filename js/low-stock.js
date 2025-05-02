
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
    stockCell.textContent = item.stock;
    stockCell.className = item.stock === 0 ? 'stock-danger' : 'stock-warning';
    
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
  const quantity = prompt(`${getText('restock_quantity_for')} ${item.type}:`, '5');
  
  if (quantity === null) return; // Cancelled
  
  const quantityNum = parseInt(quantity);
  
  if (isNaN(quantityNum) || quantityNum <= 0) {
    alert(getText('enter_valid_quantity'));
    return;
  }
  
  addCableStock(item.id, quantityNum);
  showMessage(
    `${getText('added')} ${quantityNum} ${getText('items_to_stock_for')} ${item.type}`,
    'success'
  );
}
