
// Language System

// Default language (English)
let currentLanguage = 'en';

// Language data
const langData = {
  en: {
    // Global
    main_title: 'Cable Inventory System',
    save: 'Save',
    update: 'Update',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    search: 'Search',
    
    // Tab Names
    tab_inventory: 'Inventory',
    tab_low_stock: 'Low Stock',
    tab_checkout: 'Cable Checkout',
    tab_scan: 'Barcode Scan',
    tab_import_export: 'Import/Export',
    
    // Inventory
    inventory_title: 'Cable Inventory',
    add_new_cable: 'Add New Cable',
    edit_cable: 'Edit Cable',
    id: 'ID',
    type: 'Type',
    length: 'Length',
    color: 'Color',
    stock: 'Stock',
    location: 'Location',
    actions: 'Actions',
    add_cable: 'Add Cable',
    cable_id: 'Cable ID',
    cable_type: 'Cable Type',
    cable_length: 'Length (m)',
    cable_color: 'Color',
    cable_stock: 'Stock',
    cable_location: 'Storage Location',
    id_already_exists: 'A cable with this ID already exists',
    cable_added_success: 'Cable added successfully',
    cable_updated_success: 'Cable updated successfully',
    cable_not_found: 'Cable not found',
    confirm_delete: 'Are you sure you want to delete this cable?',
    cable_deleted_success: 'Cable deleted successfully',
    
    // Low Stock
    low_stock_title: 'Low Stock Items',
    threshold: 'Threshold',
    no_low_stock_items: 'No low stock items found',
    restock: 'Restock',
    restock_quantity_for: 'Restock quantity for',
    enter_valid_quantity: 'Please enter a valid quantity',
    added: 'Added',
    items_to_stock_for: 'items to stock for',
    
    // Checkout
    checkout_title: 'Cable Checkout',
    checkout_cable_label: 'Select Cable:',
    checkout_quantity_label: 'Quantity:',
    checkout_recipient_label: 'Recipient Name:',
    checkout_notes_label: 'Notes:',
    checkout_btn_text: 'Checkout',
    checkout_history_title: 'Checkout History',
    select_cable: 'Select a cable...',
    in_stock: 'in stock',
    no_checkout_history: 'No checkout history found',
    date: 'Date',
    cable: 'Cable',
    quantity: 'Quantity',
    recipient: 'Recipient',
    notes: 'Notes',
    select_cable_to_checkout: 'Please select a cable to checkout',
    enter_recipient_name: 'Please enter a recipient name',
    not_enough_stock: 'Not enough stock available',
    checkout_success: 'Checkout completed successfully',
    
    // Barcode
    scan_title: 'Barcode Scanner',
    scan_button_text: 'Scan',
    please_scan_barcode: 'Please scan or type a barcode',
    barcode_recognized: 'Barcode recognized! Cable details:',
    barcode_found_cable_missing: 'Barcode found but cable is no longer in inventory',
    barcode_not_found: 'Barcode not recognized. Register this barcode?',
    register_barcode_title: 'Register New Barcode',
    barcode_cable_select_label: 'Cable Type:',
    barcode_value_label: 'Barcode Value:',
    register_barcode_btn_text: 'Register Barcode',
    select_cable_type: 'Select a cable type...',
    invalid_barcode: 'Invalid barcode',
    barcode_already_registered: 'This barcode is already registered',
    barcode_registered_success: 'Barcode registered successfully',
    checkout: 'Checkout',
    
    // Import/Export
    import_export_title: 'Import/Export Data',
    import_title: 'Import CSV',
    export_title: 'Export CSV',
    import_type_label: 'Select data to import:',
    import_file_label: 'Choose CSV file:',
    export_type_label: 'Select data to export:',
    import_btn_text: 'Import Data',
    export_btn_text: 'Export Data',
    please_select_file: 'Please select a file to import',
    import_error: 'Import error',
    invalid_inventory_format: 'Invalid inventory data format',
    invalid_checkout_format: 'Invalid checkout data format',
    invalid_barcode_format: 'Invalid barcode data format',
    imported: 'Imported',
    inventory_items: 'inventory items',
    checkout_records: 'checkout records',
    barcodes: 'barcodes',
    export_error: 'Export error',
    no_inventory_data: 'No inventory data to export',
    no_checkout_data: 'No checkout data to export',
    no_barcode_data: 'No barcode data to export',
    inventory_exported: 'Inventory data exported successfully',
    checkout_exported: 'Checkout data exported successfully',
    barcodes_exported: 'Barcode data exported successfully'
  },
  
  de: {
    // Global
    main_title: 'Kabel-Inventarsystem',
    save: 'Speichern',
    update: 'Aktualisieren',
    delete: 'Löschen',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    search: 'Suchen',
    
    // Tab Names
    tab_inventory: 'Inventar',
    tab_low_stock: 'Geringer Bestand',
    tab_checkout: 'Kabelausgabe',
    tab_scan: 'Barcode-Scan',
    tab_import_export: 'Import/Export',
    
    // Inventory
    inventory_title: 'Kabelinventar',
    add_new_cable: 'Neues Kabel hinzufügen',
    edit_cable: 'Kabel bearbeiten',
    id: 'ID',
    type: 'Typ',
    length: 'Länge',
    color: 'Farbe',
    stock: 'Bestand',
    location: 'Lagerort',
    actions: 'Aktionen',
    add_cable: 'Kabel hinzufügen',
    cable_id: 'Kabel-ID',
    cable_type: 'Kabeltyp',
    cable_length: 'Länge (m)',
    cable_color: 'Farbe',
    cable_stock: 'Bestand',
    cable_location: 'Lagerort',
    id_already_exists: 'Ein Kabel mit dieser ID existiert bereits',
    cable_added_success: 'Kabel erfolgreich hinzugefügt',
    cable_updated_success: 'Kabel erfolgreich aktualisiert',
    cable_not_found: 'Kabel nicht gefunden',
    confirm_delete: 'Sind Sie sicher, dass Sie dieses Kabel löschen möchten?',
    cable_deleted_success: 'Kabel erfolgreich gelöscht',
    
    // Low Stock
    low_stock_title: 'Artikel mit geringem Bestand',
    threshold: 'Schwellenwert',
    no_low_stock_items: 'Keine Artikel mit geringem Bestand gefunden',
    restock: 'Auffüllen',
    restock_quantity_for: 'Nachbestellmenge für',
    enter_valid_quantity: 'Bitte geben Sie eine gültige Menge ein',
    added: 'Hinzugefügt',
    items_to_stock_for: 'Artikel zum Bestand für',
    
    // Checkout
    checkout_title: 'Kabelausgabe',
    checkout_cable_label: 'Kabel auswählen:',
    checkout_quantity_label: 'Menge:',
    checkout_recipient_label: 'Empfängername:',
    checkout_notes_label: 'Notizen:',
    checkout_btn_text: 'Ausgeben',
    checkout_history_title: 'Ausgabeverlauf',
    select_cable: 'Kabel auswählen...',
    in_stock: 'auf Lager',
    no_checkout_history: 'Kein Ausgabeverlauf gefunden',
    date: 'Datum',
    cable: 'Kabel',
    quantity: 'Menge',
    recipient: 'Empfänger',
    notes: 'Notizen',
    select_cable_to_checkout: 'Bitte wählen Sie ein Kabel zur Ausgabe',
    enter_recipient_name: 'Bitte geben Sie einen Empfängernamen ein',
    not_enough_stock: 'Nicht genügend Bestand verfügbar',
    checkout_success: 'Ausgabe erfolgreich abgeschlossen',
    
    // Barcode
    scan_title: 'Barcode-Scanner',
    scan_button_text: 'Scannen',
    please_scan_barcode: 'Bitte scannen oder geben Sie einen Barcode ein',
    barcode_recognized: 'Barcode erkannt! Kabeldetails:',
    barcode_found_cable_missing: 'Barcode gefunden, aber Kabel ist nicht mehr im Inventar',
    barcode_not_found: 'Barcode nicht erkannt. Diesen Barcode registrieren?',
    register_barcode_title: 'Neuen Barcode registrieren',
    barcode_cable_select_label: 'Kabeltyp:',
    barcode_value_label: 'Barcode-Wert:',
    register_barcode_btn_text: 'Barcode registrieren',
    select_cable_type: 'Kabeltyp auswählen...',
    invalid_barcode: 'Ungültiger Barcode',
    barcode_already_registered: 'Dieser Barcode ist bereits registriert',
    barcode_registered_success: 'Barcode erfolgreich registriert',
    checkout: 'Ausgeben',
    
    // Import/Export
    import_export_title: 'Daten importieren/exportieren',
    import_title: 'CSV importieren',
    export_title: 'CSV exportieren',
    import_type_label: 'Daten zum Importieren auswählen:',
    import_file_label: 'CSV-Datei auswählen:',
    export_type_label: 'Daten zum Exportieren auswählen:',
    import_btn_text: 'Daten importieren',
    export_btn_text: 'Daten exportieren',
    please_select_file: 'Bitte wählen Sie eine Datei zum Importieren',
    import_error: 'Importfehler',
    invalid_inventory_format: 'Ungültiges Inventardatenformat',
    invalid_checkout_format: 'Ungültiges Ausgabedatenformat',
    invalid_barcode_format: 'Ungültiges Barcode-Datenformat',
    imported: 'Importiert',
    inventory_items: 'Inventarelemente',
    checkout_records: 'Ausgabedatensätze',
    barcodes: 'Barcodes',
    export_error: 'Exportfehler',
    no_inventory_data: 'Keine Inventardaten zum Exportieren',
    no_checkout_data: 'Keine Ausgabedaten zum Exportieren',
    no_barcode_data: 'Keine Barcode-Daten zum Exportieren',
    inventory_exported: 'Inventardaten erfolgreich exportiert',
    checkout_exported: 'Ausgabedaten erfolgreich exportiert',
    barcodes_exported: 'Barcode-Daten erfolgreich exportiert'
  }
};

// Initialize language system
document.addEventListener('DOMContentLoaded', function() {
  // Set initial language
  const savedLanguage = localStorage.getItem('cableTrackerLanguage');
  if (savedLanguage) {
    currentLanguage = savedLanguage;
  }
  
  // Set language toggle button text
  updateLanguageToggle();
  
  // Set initial texts
  updateAllTexts();
  
  // Add event listener for language toggle
  document.getElementById('language-toggle').addEventListener('click', toggleLanguage);
});

// Get current language
function getCurrentLanguage() {
  return currentLanguage;
}

// Toggle between languages
function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'de' : 'en';
  localStorage.setItem('cableTrackerLanguage', currentLanguage);
  
  // Update toggle button text
  updateLanguageToggle();
  
  // Update all text elements
  updateAllTexts();
}

// Update language toggle button text
function updateLanguageToggle() {
  const toggleBtn = document.getElementById('language-toggle');
  if (toggleBtn) {
    const langText = currentLanguage === 'en' ? 'DE' : 'EN';
    toggleBtn.querySelector('#language-text').textContent = langText;
  }
}

// Update all text elements based on current language
function updateAllTexts() {
  // Main title
  document.getElementById('main-title').textContent = getText('main_title');
  
  // Tab names
  document.getElementById('tab-inventory').textContent = getText('tab_inventory');
  document.getElementById('tab-low-stock').textContent = getText('tab_low_stock');
  document.getElementById('tab-checkout').textContent = getText('tab_checkout');
  document.getElementById('tab-scan').textContent = getText('tab_scan');
  document.getElementById('tab-import-export').textContent = getText('tab_import_export');
  
  // Inventory section
  document.getElementById('inventory-title').textContent = getText('inventory_title');
  document.getElementById('inventory-search').placeholder = getText('search');
  document.getElementById('add-btn-text').textContent = getText('add_cable');
  document.getElementById('th-id').textContent = getText('id');
  document.getElementById('th-type').textContent = getText('type');
  document.getElementById('th-length').textContent = getText('length');
  document.getElementById('th-color').textContent = getText('color');
  document.getElementById('th-stock').textContent = getText('stock');
  document.getElementById('th-location').textContent = getText('location');
  document.getElementById('th-actions').textContent = getText('actions');
  
  // Low stock section
  document.getElementById('low-stock-title').textContent = getText('low_stock_title');
  document.getElementById('threshold-label').textContent = getText('threshold');
  document.getElementById('ls-th-id').textContent = getText('id');
  document.getElementById('ls-th-type').textContent = getText('type');
  document.getElementById('ls-th-stock').textContent = getText('stock');
  document.getElementById('ls-th-threshold').textContent = getText('threshold');
  document.getElementById('ls-th-action').textContent = getText('actions');
  
  // Checkout section
  document.getElementById('checkout-title').textContent = getText('checkout_title');
  document.getElementById('checkout-cable-label').textContent = getText('checkout_cable_label');
  document.getElementById('checkout-quantity-label').textContent = getText('checkout_quantity_label');
  document.getElementById('checkout-recipient-label').textContent = getText('checkout_recipient_label');
  document.getElementById('checkout-notes-label').textContent = getText('checkout_notes_label');
  document.getElementById('checkout-btn-text').textContent = getText('checkout_btn_text');
  document.getElementById('checkout-history-title').textContent = getText('checkout_history_title');
  document.getElementById('ch-th-date').textContent = getText('date');
  document.getElementById('ch-th-cable').textContent = getText('cable');
  document.getElementById('ch-th-quantity').textContent = getText('quantity');
  document.getElementById('ch-th-recipient').textContent = getText('recipient');
  document.getElementById('ch-th-notes').textContent = getText('notes');
  
  // Barcode section
  document.getElementById('scan-title').textContent = getText('scan_title');
  document.getElementById('scan-button-text').textContent = getText('scan_button_text');
  document.getElementById('register-barcode-title').textContent = getText('register_barcode_title');
  document.getElementById('barcode-cable-select-label').textContent = getText('barcode_cable_select_label');
  document.getElementById('barcode-value-label').textContent = getText('barcode_value_label');
  document.getElementById('register-barcode-btn-text').textContent = getText('register_barcode_btn_text');
  
  // Import/Export section
  document.getElementById('import-export-title').textContent = getText('import_export_title');
  document.getElementById('import-title').textContent = getText('import_title');
  document.getElementById('export-title').textContent = getText('export_title');
  document.getElementById('import-type-label').textContent = getText('import_type_label');
  document.getElementById('import-file-label').textContent = getText('import_file_label');
  document.getElementById('export-type-label').textContent = getText('export_type_label');
  document.getElementById('import-btn-text').textContent = getText('import_btn_text');
  document.getElementById('export-btn-text').textContent = getText('export_btn_text');
  
  // Modal
  const modalTitle = document.getElementById('modal-title');
  if (modalTitle.textContent.includes('Add')) {
    modalTitle.textContent = getText('add_new_cable');
  } else {
    modalTitle.textContent = getText('edit_cable');
  }
  
  document.getElementById('cable-id-label').textContent = getText('cable_id');
  document.getElementById('cable-type-label').textContent = getText('cable_type');
  document.getElementById('cable-length-label').textContent = getText('cable_length');
  document.getElementById('cable-color-label').textContent = getText('cable_color');
  document.getElementById('cable-stock-label').textContent = getText('cable_stock');
  document.getElementById('cable-location-label').textContent = getText('cable_location');
  document.getElementById('save-cable-text').textContent = 
    document.getElementById('edit-mode').value === 'add' ? getText('save') : getText('update');
  
  // Refresh data display
  loadInventoryData();
  updateLowStockTable();
  loadCheckoutHistory();
  updateBarcodeCableSelect();
  updateCheckoutCableSelect();
}
