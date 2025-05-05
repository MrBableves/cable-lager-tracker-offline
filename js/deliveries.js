// Deliveries Management

// Format date in German format (DD.MM.YYYY)
function formatDateGerman(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Get deliveries from localStorage
function getDeliveries() {
  const deliveriesData = localStorage.getItem('cableDeliveries');
  return deliveriesData ? JSON.parse(deliveriesData) : [];
}

// Save deliveries to localStorage and CSV
function saveDeliveries(deliveries) {
  localStorage.setItem('cableDeliveries', JSON.stringify(deliveries));
  
  // Save to CSV
  const csv = convertToCSV(deliveries);
  saveDataToCSV(csv, 'cable_deliveries.csv');
}

// Save data to CSV file (this function should also be defined in checkout.js)
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

// Load deliveries data and update the table
function loadDeliveriesData() {
  const deliveries = getDeliveries();
  const tableBody = document.getElementById('deliveries-body');
  tableBody.innerHTML = '';
  
  if (deliveries.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = getText('no_deliveries');
    cell.style.textAlign = 'center';
    cell.style.padding = '2rem 1rem';
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }
  
  // Sort by date (newest first)
  deliveries.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  deliveries.forEach(delivery => {
    const row = createDeliveryRow(delivery);
    tableBody.appendChild(row);
  });
}

// Create a table row for a delivery
function createDeliveryRow(delivery) {
  const row = document.createElement('tr');
  
  const idCell = document.createElement('td');
  idCell.textContent = delivery.id;
  
  const dateCell = document.createElement('td');
  dateCell.textContent = formatDateGerman(delivery.date);
  
  const statusCell = document.createElement('td');
  
  // Create status badge
  const statusBadge = document.createElement('span');
  statusBadge.textContent = delivery.status;
  statusBadge.style.padding = '0.25rem 0.75rem';
  statusBadge.style.borderRadius = '9999px';
  statusBadge.style.fontSize = '0.875rem';
  statusBadge.style.fontWeight = 'bold';
  statusBadge.style.display = 'inline-block';
  
  switch (delivery.status) {
    case 'pending':
      statusBadge.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
      statusBadge.style.color = 'var(--warning-color)';
      break;
    case 'received':
      statusBadge.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
      statusBadge.style.color = 'var(--success-color)';
      break;
    case 'cancelled':
      statusBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
      statusBadge.style.color = 'var(--danger-color)';
      break;
    default:
      statusBadge.style.backgroundColor = 'rgba(107, 114, 128, 0.2)';
      statusBadge.style.color = 'var(--text-light)';
  }
  
  statusCell.appendChild(statusBadge);
  
  const itemsCell = document.createElement('td');
  itemsCell.textContent = delivery.items.length;
  
  const actionsCell = document.createElement('td');
  
  // View button
  const viewButton = document.createElement('button');
  viewButton.className = 'btn btn-primary';
  viewButton.style.marginRight = '8px';
  viewButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
    <span>${getText('view')}</span>
  `;
  viewButton.addEventListener('click', () => viewDeliveryDetails(delivery.id));
  
  // Set received button (only for pending deliveries)
  if (delivery.status === 'pending') {
    const receiveButton = document.createElement('button');
    receiveButton.className = 'btn btn-success';
    receiveButton.style.marginRight = '8px';
    receiveButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
      <span>${getText('mark_received')}</span>
    `;
    receiveButton.addEventListener('click', () => markDeliveryReceived(delivery.id));
    actionsCell.appendChild(receiveButton);
  }
  
  actionsCell.appendChild(viewButton);
  
  // Delete button (only for pending deliveries)
  if (delivery.status === 'pending') {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger';
    deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
    `;
    deleteButton.addEventListener('click', () => cancelDelivery(delivery.id));
    actionsCell.appendChild(deleteButton);
  }
  
  row.appendChild(idCell);
  row.appendChild(dateCell);
  row.appendChild(statusCell);
  row.appendChild(itemsCell);
  row.appendChild(actionsCell);
  
  return row;
}

// View delivery details with enhanced cable information display
function viewDeliveryDetails(deliveryId) {
  const deliveries = getDeliveries();
  const delivery = deliveries.find(d => d.id === deliveryId);
  
  if (!delivery) return;
  
  // Create a modal dialog for viewing delivery details
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.width = '90%'; // Wider to show more information
  modalContent.style.maxWidth = '1200px';
  
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  
  const title = document.createElement('h3');
  title.textContent = `${getText('delivery')} ${delivery.id}`;
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-modal';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modalHeader.appendChild(title);
  modalHeader.appendChild(closeBtn);
  
  const modalBody = document.createElement('div');
  
  // Delivery info
  const infoSection = document.createElement('div');
  infoSection.className = 'delivery-info';
  infoSection.style.marginBottom = '1.5rem';
  infoSection.style.padding = '1rem';
  infoSection.style.backgroundColor = 'var(--bg-secondary)';
  infoSection.style.borderRadius = 'var(--radius)';
  
  infoSection.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
      <div>
        <strong>${getText('date')}:</strong> ${formatDateGerman(delivery.date)}
      </div>
      <div>
        <strong>${getText('status')}:</strong> ${delivery.status}
      </div>
      <div>
        <strong>${getText('reference')}:</strong> ${delivery.reference || '-'}
      </div>
    </div>
    <div style="margin-top: 1rem;">
      <strong>${getText('notes')}:</strong>
      <p>${delivery.notes || '-'}</p>
    </div>
  `;
  
  // Items table with enhanced details
  const itemsSection = document.createElement('div');
  itemsSection.className = 'delivery-items';
  
  const itemsTitle = document.createElement('h4');
  itemsTitle.textContent = getText('delivery_items');
  itemsTitle.style.marginBottom = '1rem';
  
  const itemsTable = document.createElement('table');
  itemsTable.className = 'data-table';
  itemsTable.style.width = '100%';
  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  ['cable_type', 'quantity', 'properties'].forEach(key => {
    const th = document.createElement('th');
    th.textContent = getText(key);
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  
  const tbody = document.createElement('tbody');
  
  delivery.items.forEach(item => {
    const row = document.createElement('tr');
    
    const typeCell = document.createElement('td');
    const cableType = getCableTypeById(item.typeId);
    typeCell.textContent = cableType ? cableType.name : item.typeId;
    
    const quantityCell = document.createElement('td');
    quantityCell.textContent = item.quantity;
    
    const propsCell = document.createElement('td');
    
    if (item.properties && Object.keys(item.properties).length > 0) {
      const propsList = document.createElement('ul');
      propsList.style.listStyle = 'none';
      propsList.style.padding = '0';
      propsList.style.margin = '0';
      
      Object.entries(item.properties).forEach(([key, value]) => {
        const propItem = document.createElement('li');
        
        if (typeof value === 'boolean') {
          propItem.innerHTML = value ? `<strong>${key}</strong>` : `<strong>${key}:</strong> ${getText('no')}`;
        } else if (key.toLowerCase().includes('color') && typeof value === 'string' && value.startsWith('#')) {
          propItem.innerHTML = `<strong>${key}:</strong> <span style="display:inline-block; width:12px; height:12px; background:${value}; border:1px solid #ccc; margin-right:5px;"></span>${value}`;
        } else {
          propItem.innerHTML = `<strong>${key}:</strong> ${value}`;
        }
        
        propsList.appendChild(propItem);
      });
      
      propsCell.appendChild(propsList);
    } else {
      propsCell.textContent = '-';
    }
    
    row.appendChild(typeCell);
    row.appendChild(quantityCell);
    row.appendChild(propsCell);
    
    tbody.appendChild(row);
  });
  
  itemsTable.appendChild(thead);
  itemsTable.appendChild(tbody);
  
  itemsSection.appendChild(itemsTitle);
  itemsSection.appendChild(itemsTable);
  
  modalBody.appendChild(infoSection);
  modalBody.appendChild(itemsSection);
  
  // Footer with buttons
  const modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';
  
  // Only show buttons for pending deliveries
  if (delivery.status === 'pending') {
    const receiveBtn = document.createElement('button');
    receiveBtn.className = 'btn btn-success';
    receiveBtn.textContent = getText('mark_received');
    receiveBtn.addEventListener('click', () => {
      markDeliveryReceived(deliveryId);
      document.body.removeChild(modal);
    });
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-danger';
    cancelBtn.textContent = getText('cancel_delivery');
    cancelBtn.style.marginRight = '0.5rem';
    cancelBtn.addEventListener('click', () => {
      if (confirm(getText('confirm_cancel_delivery'))) {
        cancelDelivery(deliveryId);
        document.body.removeChild(modal);
      }
    });
    
    modalFooter.appendChild(cancelBtn);
    modalFooter.appendChild(receiveBtn);
  }
  
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// Open modal for adding a new delivery
function openAddDeliveryModal() {
  const titleElement = document.getElementById('delivery-modal-title');
  if (titleElement) {
    titleElement.textContent = getText('add_new_delivery');
  }
  
  const saveTextElement = document.getElementById('save-delivery-text');
  if (saveTextElement) {
    saveTextElement.textContent = getText('save');
  }
  
  // Reset form fields
  const form = document.getElementById('delivery-form');
  if (form) {
    form.reset();
  }
  
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  const dateElement = document.getElementById('delivery-date');
  if (dateElement) {
    dateElement.value = today;
  }
  
  // Generate a unique ID
  const idElement = document.getElementById('delivery-id');
  if (idElement) {
    idElement.value = 'DEL-' + Date.now().toString().slice(-6);
  }
  
  // Clear items container
  const itemsContainer = document.getElementById('delivery-items-container');
  if (itemsContainer) {
    itemsContainer.innerHTML = '';
    
    // Add one initial item
    addDeliveryItem();
    
    // Update type selects in the form
    updateDeliveryTypeSelects();
  }
  
  // Show modal
  const modal = document.getElementById('delivery-modal');
  if (modal) {
    modal.style.display = 'block';
  }
}

// Add an item to the delivery form with detailed cable information
function addDeliveryItem() {
  const container = document.getElementById('delivery-items-container');
  const itemId = Date.now();
  
  const itemContainer = document.createElement('div');
  itemContainer.className = 'delivery-item';
  itemContainer.id = `delivery-item-${itemId}`;
  itemContainer.style.border = '1px solid var(--border-color)';
  itemContainer.style.borderRadius = 'var(--radius)';
  itemContainer.style.padding = '1rem';
  itemContainer.style.marginBottom = '1rem';
  
  // Type and quantity
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.gap = '10px';
  header.style.alignItems = 'flex-start';
  header.style.marginBottom = '1rem';
  
  // Cable Type select
  const typeContainer = document.createElement('div');
  typeContainer.style.flex = '3';
  
  const typeLabel = document.createElement('label');
  typeLabel.textContent = getText('cable_type');
  
  const typeSelect = document.createElement('select');
  typeSelect.className = 'select-input item-type';
  typeSelect.setAttribute('required', 'true');
  
  // Will be populated by updateDeliveryTypeSelects()
  
  typeContainer.appendChild(typeLabel);
  typeContainer.appendChild(typeSelect);
  
  // Quantity input
  const quantityContainer = document.createElement('div');
  quantityContainer.style.flex = '1';
  
  const quantityLabel = document.createElement('label');
  quantityLabel.textContent = getText('quantity');
  
  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.className = 'number-input item-quantity';
  quantityInput.min = '1';
  quantityInput.value = '1';
  quantityInput.setAttribute('required', 'true');
  
  quantityContainer.appendChild(quantityLabel);
  quantityContainer.appendChild(quantityInput);
  
  // Remove button
  const removeContainer = document.createElement('div');
  removeContainer.style.paddingTop = '1.5rem';
  
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'btn btn-danger';
  removeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
  `;
  removeButton.addEventListener('click', () => {
    if (document.querySelectorAll('.delivery-item').length > 1) {
      container.removeChild(itemContainer);
    } else {
      showMessage(getText('at_least_one_item'), 'error');
    }
  });
  
  removeContainer.appendChild(removeButton);
  
  header.appendChild(typeContainer);
  header.appendChild(quantityContainer);
  header.appendChild(removeContainer);
  
  // Properties container (will be populated based on selected type)
  const propertiesContainer = document.createElement('div');
  propertiesContainer.className = 'item-properties';
  
  // Preview container to show what the cable will look like in inventory
  const previewContainer = document.createElement('div');
  previewContainer.className = 'cable-preview';
  previewContainer.style.marginTop = '1rem';
  previewContainer.style.padding = '1rem';
  previewContainer.style.backgroundColor = 'var(--bg-accent)';
  previewContainer.style.borderRadius = 'var(--radius)';
  previewContainer.style.display = 'none';
  
  const previewTitle = document.createElement('h6');
  previewTitle.textContent = getText('preview');
  previewTitle.style.marginBottom = '0.5rem';
  previewContainer.appendChild(previewTitle);
  
  const previewContent = document.createElement('div');
  previewContent.className = 'preview-content';
  previewContainer.appendChild(previewContent);
  
  itemContainer.appendChild(header);
  itemContainer.appendChild(propertiesContainer);
  itemContainer.appendChild(previewContainer);
  
  container.appendChild(itemContainer);
  
  // Add change event to update properties when type changes
  typeSelect.addEventListener('change', function() {
    updateItemProperties(this, propertiesContainer);
    updateItemPreview(typeSelect, propertiesContainer, previewContent);
    previewContainer.style.display = 'block';
  });
  
  return itemContainer;
}

// Update all cable type selects in the delivery modal
function updateDeliveryTypeSelects() {
  const typeSelects = document.querySelectorAll('.item-type');
  const types = getCableTypes();
  
  typeSelects.forEach(select => {
    // Save current value if any
    const currentValue = select.value;
    
    // Clear options
    select.innerHTML = '';
    
    // Add empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = getText('select_cable_type');
    select.appendChild(emptyOption);
    
    // Add type options
    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.name;
      select.appendChild(option);
    });
    
    // Restore value if possible
    if (currentValue && select.querySelector(`option[value="${currentValue}"]`)) {
      select.value = currentValue;
      
      // Trigger change event to update properties
      const event = new Event('change');
      select.dispatchEvent(event);
    }
  });
}

// Update item properties based on selected cable type with detailed inputs
function updateItemProperties(typeSelect, propertiesContainer) {
  const typeId = typeSelect.value;
  if (!propertiesContainer) return;
  propertiesContainer.innerHTML = '';
  
  if (!typeId) return;
  
  const types = getCableTypes();
  const selectedType = types.find(type => type.id === typeId);
  
  if (!selectedType || !selectedType.properties || !selectedType.properties.length) {
    return;
  }
  
  const propertiesTitle = document.createElement('h5');
  propertiesTitle.textContent = getText('properties');
  propertiesTitle.style.marginBottom = '0.5rem';
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
        propInput.type = 'hidden'; // Changed from color to hidden as per requirement
        propInput.className = 'hidden-input';
        propInput.value = "#000000"; // Default color
        
        // Add text display instead
        const colorText = document.createElement('span');
        colorText.textContent = "Color information (hidden)";
        colorText.className = 'color-info-text';
        propContainer.appendChild(colorText);
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
    propInput.className += ' item-property';
    
    // Add event listener to update preview in real-time
    propInput.addEventListener('input', function() {
      const previewContent = propContainer.closest('.delivery-item').querySelector('.preview-content');
      if (previewContent) {
        const typeSelect = propContainer.closest('.delivery-item').querySelector('.item-type');
        const propsContainer = propContainer.closest('.item-properties');
        updateItemPreview(typeSelect, propsContainer, previewContent);
      }
    });
    
    propContainer.appendChild(propLabel);
    if (prop.type !== 'boolean' && prop.type !== 'color') {
      propContainer.appendChild(propInput);
    } else if (prop.type === 'boolean') {
      propContainer.appendChild(propInput);
    }
    
    propertiesGrid.appendChild(propContainer);
  });
  
  propertiesContainer.appendChild(propertiesGrid);
}

// Update item preview based on selected type and properties
function updateItemPreview(typeSelect, propertiesContainer, previewContent) {
  const typeId = typeSelect.value;
  if (!typeId || !previewContent) {
    if (previewContent) previewContent.innerHTML = '';
    return;
  }
  
  const types = getCableTypes();
  const selectedType = types.find(type => type.id === typeId);
  if (!selectedType) {
    previewContent.innerHTML = '';
    return;
  }
  
  // Collect properties
  const properties = {};
  const propertyInputs = propertiesContainer.querySelectorAll('.item-property');
  
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
  
  // Build preview
  previewContent.innerHTML = '';
  
  const cableHeader = document.createElement('div');
  cableHeader.className = 'cable-header';
  cableHeader.style.fontWeight = 'bold';
  cableHeader.textContent = selectedType.name;
  previewContent.appendChild(cableHeader);
  
  const propsList = document.createElement('ul');
  propsList.style.listStyle = 'none';
  propsList.style.padding = '0';
  propsList.style.margin = '0.5rem 0 0 0';
  propsList.style.fontSize = '0.9em';
  
  Object.entries(properties).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const propItem = document.createElement('li');
      
      if (typeof value === 'boolean') {
        if (value) {
          propItem.textContent = key;
          propsList.appendChild(propItem);
        }
      } else if (key.toLowerCase().includes('color')) {
        // Skip color display in preview as per requirement
        propItem.textContent = `${key}: [Color information hidden]`;
        propsList.appendChild(propItem);
      } else {
        propItem.textContent = `${key}: ${value}`;
        propsList.appendChild(propItem);
      }
    }
  });
  
  if (propsList.children.length > 0) {
    previewContent.appendChild(propsList);
  }
}

// Save delivery data from form and store in CSV
function saveDelivery(e) {
  e.preventDefault();
  
  const deliveryId = document.getElementById('delivery-id').value;
  const deliveryDate = document.getElementById('delivery-date').value;
  const deliverySupplier = document.getElementById('delivery-supplier')?.value || '';
  const deliveryReference = document.getElementById('delivery-reference')?.value || '';
  const deliveryNotes = document.getElementById('delivery-notes')?.value || '';
  
  // Collect items
  const items = [];
  const itemContainers = document.querySelectorAll('.delivery-item');
  
  for (const container of itemContainers) {
    const typeSelect = container.querySelector('.item-type');
    const quantityInput = container.querySelector('.item-quantity');
    
    if (!typeSelect.value) {
      showMessage(getText('select_type_for_all_items'), 'error');
      return;
    }
    
    const quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity <= 0) {
      showMessage(getText('enter_valid_quantity_for_all'), 'error');
      return;
    }
    
    // Collect properties
    const properties = {};
    const propertyInputs = container.querySelectorAll('.item-property');
    
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
    
    items.push({
      typeId: typeSelect.value,
      quantity: quantity,
      properties: properties
    });
  }
  
  const deliveryData = {
    id: deliveryId,
    date: deliveryDate ? new Date(deliveryDate).toISOString() : new Date().toISOString(),
    supplier: deliverySupplier,
    reference: deliveryReference,
    notes: deliveryNotes,
    status: 'pending',
    items: items
  };
  
  const deliveries = getDeliveries();
  
  // Check if ID already exists
  if (deliveries.some(d => d.id === deliveryId)) {
    showMessage(getText('id_already_exists'), 'error');
    return;
  }
  
  deliveries.push(deliveryData);
  saveDeliveries(deliveries);
  loadDeliveriesData();
  
  closeDeliveryModal();
  showMessage(getText('delivery_added_success'), 'success');
}

// Mark delivery as received
function markDeliveryReceived(deliveryId) {
  const deliveries = getDeliveries();
  const deliveryIndex = deliveries.findIndex(d => d.id === deliveryId);
  
  if (deliveryIndex === -1) return;
  
  const delivery = deliveries[deliveryIndex];
  
  // Only process pending deliveries
  if (delivery.status !== 'pending') return;
  
  // Update delivery status
  delivery.status = 'received';
  delivery.receivedDate = new Date().toISOString();
  
  // Add items to inventory
  for (const item of delivery.items) {
    const cableType = getCableTypeById(item.typeId);
    if (!cableType) continue;
    
    // Check if this cable with these properties exists
    const inventory = getInventory();
    const propertyKeys = Object.keys(item.properties);
    
    let existingCable = inventory.find(cable => 
      cable.typeId === item.typeId && 
      propertyKeys.every(key => cable.properties[key] === item.properties[key])
    );
    
    if (existingCable) {
      // Update stock for existing cable
      existingCable.stock += item.quantity;
      saveInventory(inventory);
    } else {
      // Create new cable entry
      const newCable = {
        id: 'CAB-' + Date.now().toString().slice(-6),
        typeId: item.typeId,
        type: cableType.name,
        properties: item.properties,
        stock: item.quantity,
        location: ''
      };
      
      addCable(newCable);
    }
  }
  
  saveDeliveries(deliveries);
  loadDeliveriesData();
  loadInventoryData();
  updateLowStockTable();
  
  showMessage(getText('delivery_marked_received'), 'success');
}

// Cancel a delivery
function cancelDelivery(deliveryId) {
  if (confirm(getText('confirm_cancel_delivery'))) {
    const deliveries = getDeliveries();
    const deliveryIndex = deliveries.findIndex(d => d.id === deliveryId);
    
    if (deliveryIndex === -1) return;
    
    // Only allow cancelling pending deliveries
    if (deliveries[deliveryIndex].status !== 'pending') {
      showMessage(getText('only_cancel_pending'), 'error');
      return;
    }
    
    deliveries[deliveryIndex].status = 'cancelled';
    deliveries[deliveryIndex].cancelledDate = new Date().toISOString();
    
    saveDeliveries(deliveries);
    loadDeliveriesData();
    
    showMessage(getText('delivery_cancelled'), 'success');
  }
}

// Close the delivery modal
function closeDeliveryModal() {
  document.getElementById('delivery-modal').style.display = 'none';
}

// Helper function to get cable type by ID
function getCableTypeById(typeId) {
  const types = getCableTypes();
  return types.find(type => type.id === typeId);
}
