// Inventory Management Functions

// Format date in German format (DD.MM.YYYY)
function formatDateGerman(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Get inventory data from localStorage
function getInventory() {
  const inventoryData = localStorage.getItem('cableInventory');
  return inventoryData ? JSON.parse(inventoryData) : [];
}

// Save inventory data to localStorage and CSV
function saveInventory(inventory) {
  localStorage.setItem('cableInventory', JSON.stringify(inventory));
  
  // Also save to CSV file
  const csv = convertToCSV(inventory);
  localStorage.setItem('inventoryCSV', csv); // Store in localStorage as backup
  
  // Try to save as a file (if in development environment)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `inventory_${formatDateGerman(new Date().toISOString())}.csv`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
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
  
  const propertiesCell = document.createElement('td');
  if (cable.properties && Object.keys(cable.properties).length > 0) {
    const propsList = document.createElement('ul');
    propsList.style.listStyle = 'none';
    propsList.style.padding = '0';
    propsList.style.margin = '0';
    
    Object.entries(cable.properties).forEach(([key, value]) => {
      const propItem = document.createElement('li');
      
      // Special handling for color properties
      if (key.toLowerCase().includes('color') && typeof value === 'string' && value.startsWith('#')) {
        propItem.innerHTML = `<strong>${key}:</strong> <span style="display:inline-block; width:12px; height:12px; background:${value}; border:1px solid #ccc; margin-right:5px;"></span>${value}`;
      } else if (typeof value === 'boolean') {
        propItem.innerHTML = `<strong>${key}:</strong> ${value ? '✓' : '✗'}`;
      } else {
        propItem.innerHTML = `<strong>${key}:</strong> ${value}`;
      }
      
      propsList.appendChild(propItem);
    });
    
    propertiesCell.appendChild(propsList);
  } else {
    propertiesCell.textContent = '-';
  }
  
  const stockCell = document.createElement('td');
  stockCell.textContent = cable.stock;
  
  // Add class for low stock warning
  if (cable.stock <= parseInt(document.getElementById('low-stock-threshold').value)) {
    stockCell.classList.add(cable.stock === 0 ? 'stock-danger' : 'stock-warning');
  }
  
  const locationCell = document.createElement('td');
  locationCell.textContent = cable.location || '-';
  
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
  row.appendChild(propertiesCell);
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

// Open modal for adding a new cable
function openAddCableModal() {
  document.getElementById('modal-title').textContent = getText('add_new_cable');
  document.getElementById('save-cable-text').textContent = getText('save');
  document.getElementById('edit-mode').value = 'add';
  
  // Reset form fields
  document.getElementById('cable-form').reset();
  
  // Clear properties container
  document.getElementById('cable-properties-container').innerHTML = '';
  
  // Generate a unique ID
  document.getElementById('cable-id').value = generateUniqueId();
  
  // Update type select and associated properties
  updateCableTypeSelects();
  
  // Show modal
  document.getElementById('cable-modal').style.display = 'block';
}

// Open modal for editing a cable
function openEditCableModal(cableId) {
  const inventory = getInventory();
  const cable = inventory.find(item => item.id === cableId);
  
  if (!cable) return;
  
  document.getElementById('modal-title').textContent = getText('edit_cable');
  document.getElementById('save-cable-text').textContent = getText('update');
  document.getElementById('edit-mode').value = 'edit';
  
  // Fill form fields with cable data
  document.getElementById('cable-id').value = cable.id;
  
  // Update type selects
  updateCableTypeSelects();
  
  // Set type and trigger properties update
  const typeSelect = document.getElementById('cable-type');
  if (typeSelect) {
    typeSelect.value = cable.typeId;
    
    // Trigger change event to update properties
    const event = new Event('change');
    typeSelect.dispatchEvent(event);
    
    // Fill in property values
    if (cable.properties) {
      setTimeout(() => {
        const propertyInputs = document.querySelectorAll('.cable-property');
        propertyInputs.forEach(input => {
          const propName = input.dataset.name;
          if (propName && cable.properties[propName] !== undefined) {
            if (input.type === 'checkbox') {
              input.checked = cable.properties[propName];
            } else {
              input.value = cable.properties[propName];
            }
          }
        });
      }, 50);
    }
  }
  
  document.getElementById('cable-stock').value = cable.stock;
  document.getElementById('cable-location').value = cable.location || '';
  
  // Show modal
  document.getElementById('cable-modal').style.display = 'block';
}

// Update cable type selects
function updateCableTypeSelects() {
  const typeSelect = document.getElementById('cable-type');
  const types = getCableTypes();
  
  if (!typeSelect) return;
  
  // Save current value if any
  const currentValue = typeSelect.value;
  
  // Clear options
  typeSelect.innerHTML = '';
  
  // Add empty option
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = getText('select_cable_type');
  typeSelect.appendChild(emptyOption);
  
  // Add type options
  types.forEach(type => {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = type.name;
    option.dataset.category = type.category;
    typeSelect.appendChild(option);
  });
  
  // Restore value if possible
  if (currentValue && typeSelect.querySelector(`option[value="${currentValue}"]`)) {
    typeSelect.value = currentValue;
    
    // Trigger change event
    const event = new Event('change');
    typeSelect.dispatchEvent(event);
  }
  
  // Add change event to update properties when type changes
  typeSelect.addEventListener('change', function() {
    updateCableProperties(this, document.getElementById('cable-properties-container'));
  });
}

// Update cable properties based on selected cable type
function updateCableProperties(typeSelect, propertiesContainer) {
  const typeId = typeSelect.value;
  propertiesContainer.innerHTML = '';
  
  if (!typeId) return;
  
  const types = getCableTypes();
  const selectedType = types.find(type => type.id === typeId);
  
  if (!selectedType || !selectedType.properties || !selectedType.properties.length) {
    return;
  }
  
  const propertiesTitle = document.createElement('h5');
  propertiesTitle.textContent = getText('properties');
  propertiesTitle.style.marginBottom = '1rem';
  propertiesTitle.style.marginTop = '1rem';
  propertiesContainer.appendChild(propertiesTitle);
  
  const propertiesGrid = document.createElement('div');
  propertiesGrid.style.display = 'grid';
  propertiesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
  propertiesGrid.style.gap = '1rem';
  
  selectedType.properties.forEach(prop => {
    const propContainer = document.createElement('div');
    propContainer.className = 'form-group';
    
    const propLabel = document.createElement('label');
    propLabel.textContent = prop.name;
    
    let propInput;
    
    switch (prop.type) {
      case 'boolean':
        propInput = document.createElement('input');
        propInput.type = 'checkbox';
        propInput.className = 'checkbox-input';
        propInput.style.marginLeft = '0.5rem';
        propContainer.style.display = 'flex';
        propContainer.style.alignItems = 'center';
        break;
        
      case 'color':
        propInput = document.createElement('input');
        propInput.type = 'color';
        propInput.className = 'color-input';
        propInput.value = '#000000';
        break;
        
      case 'number':
        propInput = document.createElement('input');
        propInput.type = 'number';
        propInput.className = 'number-input';
        break;
        
      default: // text
        propInput = document.createElement('input');
        propInput.type = 'text';
        propInput.className = 'text-input';
    }
    
    propInput.dataset.name = prop.name;
    propInput.className += ' cable-property';
    
    propContainer.appendChild(propLabel);
    if (prop.type !== 'boolean') {
      propContainer.appendChild(propInput);
    }
    
    propertiesGrid.appendChild(propContainer);
  });
  
  propertiesContainer.appendChild(propertiesGrid);
}

// Save cable data from form
function saveCable(e) {
  e.preventDefault();
  
  const mode = document.getElementById('edit-mode').value;
  const cableId = document.getElementById('cable-id').value;
  const cableTypeSelect = document.getElementById('cable-type');
  const cableTypeId = cableTypeSelect.value;
  const cableType = cableTypeSelect.options[cableTypeSelect.selectedIndex].text;
  const cableStock = parseInt(document.getElementById('cable-stock').value);
  const cableLocation = document.getElementById('cable-location').value;
  
  // Validate type selection
  if (!cableTypeId) {
    showMessage(getText('select_cable_type'), 'error');
    return;
  }
  
  // Collect properties
  const properties = {};
  const propertyInputs = document.querySelectorAll('.cable-property');
  
  propertyInputs.forEach(input => {
    const propName = input.dataset.name;
    let propValue;
    
    if (input.type === 'checkbox') {
      propValue = input.checked;
    } else {
      propValue = input.value;
    }
    
    properties[propName] = propValue;
  });
  
  const cableData = {
    id: cableId,
    typeId: cableTypeId,
    type: cableType,
    properties: properties,
    stock: cableStock,
    location: cableLocation
  };
  
  if (mode === 'add') {
    addCable(cableData);
  } else {
    updateCable(cableData);
  }
  
  closeModal();
}

// Generate a unique ID for new cables
function generateUniqueId() {
  return 'CAB-' + Date.now().toString().slice(-6);
}

// Filter inventory table based on search term
function filterInventoryTable(searchTerm) {
  const rows = document.getElementById('inventory-body').querySelectorAll('tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Initialize with sample data if empty
function initializeSampleData() {
  const inventory = getInventory();
  
  if (inventory.length === 0) {
    const sampleData = [
      {
        id: 'CAB-001',
        typeId: 'TYPE-003',
        type: 'HDMI',
        properties: {
          'Version': '2.1',
          'Length': 2,
          'Color': '#000000'
        },
        stock: 15,
        location: 'Shelf A1'
      },
      {
        id: 'CAB-002',
        typeId: 'TYPE-002',
        type: 'Copper Cable',
        properties: {
          'AWG': 24,
          'Shielded': true,
          'Color': '#808080'
        },
        stock: 8,
        location: 'Shelf B2'
      },
      {
        id: 'CAB-003',
        typeId: 'TYPE-002',
        type: 'Copper Cable',
        properties: {
          'AWG': 22,
          'Shielded': false,
          'Color': '#00ff00'
        },
        stock: 5,
        location: 'Shelf A2'
      },
      {
        id: 'CAB-004',
        typeId: 'TYPE-001',
        type: 'Fiber Optic',
        properties: {
          'OM Standard': 'OM3',
          'Connector Type': 'LC',
          'Color': '#0000ff'
        },
        stock: 3,
        location: 'Shelf C1'
      },
      {
        id: 'CAB-005',
        typeId: 'TYPE-001',
        type: 'Fiber Optic',
        properties: {
          'OM Standard': 'OM4',
          'Connector Type': 'SC',
          'Color': '#ff00ff'
        },
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
