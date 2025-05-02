
// Barcode System Functions

// Get barcode data from localStorage
function getBarcodes() {
  const barcodes = localStorage.getItem('cableBarcodes');
  return barcodes ? JSON.parse(barcodes) : [];
}

// Save barcode data to localStorage
function saveBarcodes(barcodes) {
  localStorage.setItem('cableBarcodes', JSON.stringify(barcodes));
}

// Initialize barcode system
function initBarcodeSystem() {
  updateBarcodeCableSelect();
}

// Update barcode cable select dropdown
function updateBarcodeCableSelect() {
  const inventory = getInventory();
  const select = document.getElementById('barcode-cable-select');
  
  // Clear current options
  select.innerHTML = '';
  
  // Add default empty option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = getText('select_cable_type');
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  
  // Add options for each cable
  inventory.forEach(cable => {
    const option = document.createElement('option');
    option.value = cable.id;
    option.textContent = `${cable.type} - ${cable.id}`;
    select.appendChild(option);
  });
}

// Handle barcode scan
function handleBarcodeScan() {
  const barcodeValue = document.getElementById('barcode-input').value.trim();
  const resultMessage = document.getElementById('barcode-result-message');
  const scannedItem = document.getElementById('barcode-scanned-item');
  
  if (!barcodeValue) {
    resultMessage.textContent = getText('please_scan_barcode');
    scannedItem.classList.add('hidden');
    return;
  }
  
  // Look up the barcode
  const barcodes = getBarcodes();
  const matchedBarcode = barcodes.find(barcode => barcode.code === barcodeValue);
  
  if (matchedBarcode) {
    // Found a match
    const cable = getCableById(matchedBarcode.cableId);
    
    if (cable) {
      resultMessage.textContent = getText('barcode_recognized');
      scannedItem.innerHTML = `
        <div class="mt-3 p-4 border rounded bg-secondary">
          <h4>${cable.type}</h4>
          <p>${getText('id')}: ${cable.id}</p>
          <p>${getText('length')}: ${cable.length}m</p>
          <p>${getText('color')}: ${cable.color}</p>
          <p>${getText('stock')}: ${cable.stock}</p>
          <p>${getText('location')}: ${cable.location}</p>
          <div class="mt-3">
            <button class="btn btn-primary scan-checkout" data-id="${cable.id}">
              ${getText('checkout')}
            </button>
          </div>
        </div>
      `;
      scannedItem.classList.remove('hidden');
      
      // Add event listener for checkout button
      const checkoutBtn = scannedItem.querySelector('.scan-checkout');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
          // Switch to checkout tab and pre-select the cable
          document.querySelector('[data-tab="checkout"]').click();
          document.getElementById('checkout-cable').value = cable.id;
          document.getElementById('checkout-recipient').focus();
        });
      }
    } else {
      resultMessage.textContent = getText('barcode_found_cable_missing');
      scannedItem.classList.add('hidden');
    }
  } else {
    // No match found, show registration form
    resultMessage.textContent = getText('barcode_not_found');
    document.getElementById('barcode-value').value = barcodeValue;
    document.getElementById('barcode-registration').style.display = 'block';
    scannedItem.classList.add('hidden');
  }
}

// Register a new barcode
function registerBarcode() {
  const cableId = document.getElementById('barcode-cable-select').value;
  const barcodeValue = document.getElementById('barcode-value').value.trim();
  
  if (!cableId) {
    showMessage(getText('select_cable_type'), 'error');
    return;
  }
  
  if (!barcodeValue) {
    showMessage(getText('invalid_barcode'), 'error');
    return;
  }
  
  // Check if barcode already exists
  const barcodes = getBarcodes();
  if (barcodes.some(barcode => barcode.code === barcodeValue)) {
    showMessage(getText('barcode_already_registered'), 'error');
    return;
  }
  
  // Add new barcode
  const newBarcode = {
    code: barcodeValue,
    cableId: cableId,
    dateRegistered: new Date().toISOString()
  };
  
  barcodes.push(newBarcode);
  saveBarcodes(barcodes);
  
  // Update UI
  document.getElementById('barcode-result-message').textContent = getText('barcode_registered_success');
  document.getElementById('barcode-registration').style.display = 'none';
  document.getElementById('barcode-input').value = '';
  document.getElementById('barcode-cable-select').selectedIndex = 0;
  
  showMessage(getText('barcode_registered_success'), 'success');
}

// Handle keypress in barcode input to simulate scanner
document.addEventListener('DOMContentLoaded', function() {
  const barcodeInput = document.getElementById('barcode-input');
  
  if (barcodeInput) {
    barcodeInput.addEventListener('focus', function() {
      this.value = '';
    });
  }
});
