
// Cable Types Management

// Get cable types from localStorage
function getCableTypes() {
  const cableTypesData = localStorage.getItem('cableTypes');
  return cableTypesData ? JSON.parse(cableTypesData) : [];
}

// Save cable types to localStorage
function saveCableTypes(types) {
  localStorage.setItem('cableTypes', JSON.stringify(types));
}

// Load cable types data and update the table
function loadCableTypesData() {
  const cableTypes = getCableTypes();
  const tableBody = document.getElementById('cable-types-body');
  tableBody.innerHTML = '';
  
  if (cableTypes.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = getText('no_cable_types');
    cell.style.textAlign = 'center';
    cell.style.padding = '2rem 1rem';
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }
  
  cableTypes.forEach(type => {
    const row = createCableTypeRow(type);
    tableBody.appendChild(row);
  });
}

// Create a table row for a cable type
function createCableTypeRow(type) {
  const row = document.createElement('tr');
  
  const idCell = document.createElement('td');
  idCell.textContent = type.id;
  
  const nameCell = document.createElement('td');
  nameCell.textContent = type.name;
  
  const categoryCell = document.createElement('td');
  categoryCell.textContent = type.category;
  
  const actionsCell = document.createElement('td');
  
  // Edit button
  const editButton = document.createElement('button');
  editButton.className = 'btn btn-primary';
  editButton.style.marginRight = '8px';
  editButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  `;
  editButton.addEventListener('click', () => openEditCableTypeModal(type.id));
  
  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-danger';
  deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
  `;
  deleteButton.addEventListener('click', () => deleteCableType(type.id));
  
  // View properties button
  const propertiesButton = document.createElement('button');
  propertiesButton.className = 'btn';
  propertiesButton.style.marginRight = '8px';
  propertiesButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>
    <span>Properties</span>
  `;
  propertiesButton.addEventListener('click', () => viewCableProperties(type.id));
  
  actionsCell.appendChild(editButton);
  actionsCell.appendChild(propertiesButton);
  actionsCell.appendChild(deleteButton);
  
  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(categoryCell);
  row.appendChild(actionsCell);
  
  return row;
}

// Open modal for adding a new cable type
function openAddCableTypeModal() {
  document.getElementById('type-modal-title').textContent = getText('add_new_cable_type');
  document.getElementById('save-type-text').textContent = getText('save');
  document.getElementById('type-edit-mode').value = 'add';
  
  // Reset form fields
  document.getElementById('type-form').reset();
  document.getElementById('properties-container').innerHTML = '';
  
  // Generate a unique ID
  document.getElementById('type-id').value = 'TYPE-' + Date.now().toString().slice(-6);
  
  // Add one initial property field
  addPropertyField();
  
  // Show modal
  document.getElementById('type-modal').style.display = 'block';
}

// Open modal for editing a cable type
function openEditCableTypeModal(typeId) {
  const cableTypes = getCableTypes();
  const type = cableTypes.find(t => t.id === typeId);
  
  if (!type) return;
  
  document.getElementById('type-modal-title').textContent = getText('edit_cable_type');
  document.getElementById('save-type-text').textContent = getText('update');
  document.getElementById('type-edit-mode').value = 'edit';
  
  // Fill form fields with type data
  document.getElementById('type-id').value = type.id;
  document.getElementById('type-name').value = type.name;
  document.getElementById('type-category').value = type.category;
  
  // Load properties
  const propertiesContainer = document.getElementById('properties-container');
  propertiesContainer.innerHTML = '';
  
  if (type.properties && type.properties.length) {
    type.properties.forEach(prop => {
      addPropertyField(prop.name, prop.type);
    });
  } else {
    addPropertyField();
  }
  
  // Show modal
  document.getElementById('type-modal').style.display = 'block';
}

// Add a property field to the form
function addPropertyField(name = '', type = 'text') {
  const container = document.getElementById('properties-container');
  const fieldId = Date.now();
  
  const fieldContainer = document.createElement('div');
  fieldContainer.className = 'property-field';
  fieldContainer.id = `property-${fieldId}`;
  
  fieldContainer.innerHTML = `
    <div class="form-group" style="display: flex; gap: 10px;">
      <div style="flex: 2;">
        <input type="text" class="text-input property-name" value="${name}" placeholder="${getText('property_name')}">
      </div>
      <div style="flex: 1;">
        <select class="select-input property-type">
          <option value="text" ${type === 'text' ? 'selected' : ''}>${getText('text')}</option>
          <option value="number" ${type === 'number' ? 'selected' : ''}>${getText('number')}</option>
          <option value="color" ${type === 'color' ? 'selected' : ''}>${getText('color')}</option>
          <option value="boolean" ${type === 'boolean' ? 'selected' : ''}>${getText('boolean')}</option>
        </select>
      </div>
      <div>
        <button type="button" class="btn btn-danger remove-property" onclick="removePropertyField(${fieldId})">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  `;
  
  container.appendChild(fieldContainer);
}

// Remove a property field from the form
function removePropertyField(fieldId) {
  const field = document.getElementById(`property-${fieldId}`);
  if (field) {
    field.parentNode.removeChild(field);
  }
}

// Save cable type data from form
function saveCableType(e) {
  e.preventDefault();
  
  const mode = document.getElementById('type-edit-mode').value;
  const typeId = document.getElementById('type-id').value;
  const typeName = document.getElementById('type-name').value;
  const typeCategory = document.getElementById('type-category').value;
  
  // Collect properties
  const properties = [];
  const propertyFields = document.querySelectorAll('.property-field');
  
  propertyFields.forEach(field => {
    const nameInput = field.querySelector('.property-name');
    const typeInput = field.querySelector('.property-type');
    
    if (nameInput && nameInput.value.trim() !== '') {
      properties.push({
        name: nameInput.value.trim(),
        type: typeInput.value
      });
    }
  });
  
  const typeData = {
    id: typeId,
    name: typeName,
    category: typeCategory,
    properties: properties
  };
  
  const cableTypes = getCableTypes();
  
  if (mode === 'add') {
    // Check if ID already exists
    if (cableTypes.some(t => t.id === typeId)) {
      showMessage(getText('id_already_exists'), 'error');
      return;
    }
    cableTypes.push(typeData);
    showMessage(getText('cable_type_added'), 'success');
  } else {
    const index = cableTypes.findIndex(t => t.id === typeId);
    if (index === -1) {
      showMessage(getText('cable_type_not_found'), 'error');
      return;
    }
    cableTypes[index] = typeData;
    showMessage(getText('cable_type_updated'), 'success');
  }
  
  saveCableTypes(cableTypes);
  loadCableTypesData();
  closeTypeModal();
  
  // Update cable form with new types
  if (typeof updateCableTypeSelects === 'function') {
    updateCableTypeSelects();
  }
}

// Delete a cable type
function deleteCableType(typeId) {
  if (confirm(getText('confirm_delete_type'))) {
    const cableTypes = getCableTypes();
    
    // Check if any cables use this type
    const inventory = getInventory();
    if (inventory.some(cable => cable.typeId === typeId)) {
      showMessage(getText('type_in_use'), 'error');
      return;
    }
    
    const updatedTypes = cableTypes.filter(type => type.id !== typeId);
    saveCableTypes(updatedTypes);
    loadCableTypesData();
    showMessage(getText('cable_type_deleted'), 'success');
    
    // Update cable form with new types
    if (typeof updateCableTypeSelects === 'function') {
      updateCableTypeSelects();
    }
  }
}

// View cable properties
function viewCableProperties(typeId) {
  const cableTypes = getCableTypes();
  const type = cableTypes.find(t => t.id === typeId);
  
  if (!type) return;
  
  // Create a modal dialog for viewing properties
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  
  const title = document.createElement('h3');
  title.textContent = `${type.name} ${getText('properties')}`;
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modalHeader.appendChild(title);
  modalHeader.appendChild(closeBtn);
  
  const modalBody = document.createElement('div');
  
  if (!type.properties || type.properties.length === 0) {
    const noPropMsg = document.createElement('p');
    noPropMsg.textContent = getText('no_properties');
    noPropMsg.style.textAlign = 'center';
    noPropMsg.style.padding = '1rem';
    modalBody.appendChild(noPropMsg);
  } else {
    const table = document.createElement('table');
    table.style.width = '100%';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const nameHeader = document.createElement('th');
    nameHeader.textContent = getText('property_name');
    
    const typeHeader = document.createElement('th');
    typeHeader.textContent = getText('property_type');
    
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(typeHeader);
    thead.appendChild(headerRow);
    
    const tbody = document.createElement('tbody');
    
    type.properties.forEach(prop => {
      const row = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = prop.name;
      
      const typeCell = document.createElement('td');
      typeCell.textContent = prop.type;
      
      row.appendChild(nameCell);
      row.appendChild(typeCell);
      tbody.appendChild(row);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    modalBody.appendChild(table);
  }
  
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// Close the type modal
function closeTypeModal() {
  document.getElementById('type-modal').style.display = 'none';
}

// Initialize with sample data if empty
function initializeCableTypesData() {
  const types = getCableTypes();
  
  if (types.length === 0) {
    const sampleData = [
      {
        id: 'TYPE-001',
        name: 'Fiber Optic',
        category: 'Network',
        properties: [
          { name: 'OM Standard', type: 'text' },
          { name: 'Connector Type', type: 'text' },
          { name: 'Color', type: 'color' }
        ]
      },
      {
        id: 'TYPE-002',
        name: 'Copper Cable',
        category: 'Network',
        properties: [
          { name: 'AWG', type: 'number' },
          { name: 'Shielded', type: 'boolean' },
          { name: 'Color', type: 'color' }
        ]
      },
      {
        id: 'TYPE-003',
        name: 'HDMI',
        category: 'AV',
        properties: [
          { name: 'Version', type: 'text' },
          { name: 'Length', type: 'number' },
          { name: 'Color', type: 'color' }
        ]
      }
    ];
    
    saveCableTypes(sampleData);
  }
}

// Call this once when the application is first loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize sample data
  initializeCableTypesData();
});
