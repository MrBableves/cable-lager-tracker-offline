
// Inventory Management Functions

// Get inventory data from localStorage
function getInventory() {
  const inventoryData = localStorage.getItem('cableInventory');
  return inventoryData ? JSON.parse(inventoryData) : [];
}

// Save inventory data to localStorage
function saveInventory(inventory) {
  localStorage.setItem('cableInventory', JSON.stringify(inventory));
}

// Load inventory data and update the table
function loadInventoryData() {
  const inventory = getInventory();
  const tableBody = document.getElementById('inventory-body');
  tableBody.innerHTML = '';
  
  inventory.forEach(cable => {
    const row = createInventoryRow(cable);
    tableBody.appendChild(row);
  });
  
  // Also update the checkout cable select
  updateCheckoutCableSelect();
}

// Create a table row for inventory item
function createInventoryRow(cable) {
  const row = document.createElement('tr');
  
  // Create cells
  const idCell = document.createElement('td');
  idCell.textContent = cable.id;
  
  const typeCell = document.createElement('td');
  typeCell.textContent = cable.type;
  
  const lengthCell = document.createElement('td');
  lengthCell.textContent = cable.length;
  
  const colorCell = document.createElement('td');
  colorCell.textContent = cable.color;
  
  const stockCell = document.createElement('td');
  stockCell.textContent = cable.stock;
  
  // Add class for low stock warning
  if (cable.stock <= parseInt(document.getElementById('low-stock-threshold').value)) {
    stockCell.classList.add(cable.stock === 0 ? 'stock-danger' : 'stock-warning');
  }
  
  const locationCell = document.createElement('td');
  locationCell.textContent = cable.location;
  
  const actionsCell = document.createElement('td');
  
  // Edit button
  const editButton = document.createElement('button');
  editButton.className = 'btn btn-primary';
  editButton.style.marginRight = '8px';
  editButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  `;
  editButton.addEventListener('click', () => openEditCableModal(cable.id));
  
  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-danger';
  deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
  `;
  deleteButton.addEventListener('click', () => deleteCable(cable.id));
  
  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);
  
  // Append all cells to row
  row.appendChild(idCell);
  row.appendChild(typeCell);
  row.appendChild(lengthCell);
  row.appendChild(colorCell);
  row.appendChild(stockCell);
  row.appendChild(locationCell);
  row.appendChild(actionsCell);
  
  return row;
}

// Add a new cable to inventory
function addCable(cableData) {
  const inventory = getInventory();
  
  // Check if ID already exists
  if (inventory.some(item => item.id === cableData.id)) {
    showMessage(getText('id_already_exists'), 'error');
    return false;
  }
  
  inventory.push(cableData);
  saveInventory(inventory);
  loadInventoryData();
  updateLowStockTable();
  showMessage(getText('cable_added_success'), 'success');
  return true;
}

// Update an existing cable
function updateCable(cableData) {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === cableData.id);
  
  if (index === -1) {
    showMessage(getText('cable_not_found'), 'error');
    return false;
  }
  
  inventory[index] = cableData;
  saveInventory(inventory);
  loadInventoryData();
  updateLowStockTable();
  showMessage(getText('cable_updated_success'), 'success');
  return true;
}

// Delete a cable from inventory
function deleteCable(cableId) {
  if (confirm(getText('confirm_delete'))) {
    const inventory = getInventory();
    const newInventory = inventory.filter(item => item.id !== cableId);
    
    saveInventory(newInventory);
    loadInventoryData();
    updateLowStockTable();
    showMessage(getText('cable_deleted_success'), 'success');
    
    // Also update barcode mappings
    const barcodes = getBarcodes();
    const updatedBarcodes = barcodes.filter(barcode => barcode.cableId !== cableId);
    saveBarcodes(updatedBarcodes);
  }
}

// Update cable stock
function updateCableStock(cableId, quantity) {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === cableId);
  
  if (index === -1) {
    return false;
  }
  
  const newStock = inventory[index].stock - quantity;
  
  // Check if enough stock
  if (newStock < 0) {
    showMessage(getText('not_enough_stock'), 'error');
    return false;
  }
  
  inventory[index].stock = newStock;
  saveInventory(inventory);
  loadInventoryData();
  updateLowStockTable();
  return true;
}

// Add to cable stock (for restocking)
function addCableStock(cableId, quantity) {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === cableId);
  
  if (index === -1) {
    return false;
  }
  
  inventory[index].stock += quantity;
  saveInventory(inventory);
  loadInventoryData();
  updateLowStockTable();
  return true;
}

// Get cable by ID
function getCableById(cableId) {
  const inventory = getInventory();
  return inventory.find(cable => cable.id === cableId);
}

// Initialize with sample data if empty
function initializeSampleData() {
  const inventory = getInventory();
  
  if (inventory.length === 0) {
    const sampleData = [
      {
        id: 'CAB-001',
        type: 'HDMI 2.1',
        length: 2.0,
        color: 'Black',
        stock: 15,
        location: 'Shelf A1'
      },
      {
        id: 'CAB-002',
        type: 'USB-C to USB-A',
        length: 1.0,
        color: 'White',
        stock: 8,
        location: 'Shelf B2'
      },
      {
        id: 'CAB-003',
        type: 'Ethernet Cat6',
        length: 3.0,
        color: 'Blue',
        stock: 5,
        location: 'Shelf A2'
      },
      {
        id: 'CAB-004',
        type: 'DisplayPort 1.4',
        length: 1.5,
        color: 'Black',
        stock: 3,
        location: 'Shelf C1'
      },
      {
        id: 'CAB-005',
        type: 'VGA',
        length: 1.8,
        color: 'Gray',
        stock: 2,
        location: 'Shelf D3'
      }
    ];
    
    saveInventory(sampleData);
    loadInventoryData();
    updateLowStockTable();
  }
}

// Call this once when the application first loads
document.addEventListener('DOMContentLoaded', initializeSampleData);
