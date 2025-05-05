
// Language data
const langData = {
  en: {
    // Common
    save: "Save",
    update: "Update",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    confirm: "Confirm",
    add: "Add",
    close: "Close",
    search: "Search",
    no_data: "No data available",
    properties: "Properties",
    to: "To",
    
    // Dashboard
    total_stock: "Total Stock",
    unique_types: "Unique Cable Types",
    inventory_value: "Inventory Value",
    low_stock_items: "Low Stock Items",
    category_distribution: "Category Distribution",
    recent_deliveries: "Recent Deliveries",
    recent_checkouts: "Recent Checkouts",
    stock_trend: "Stock Trend",
    type_distribution: "Type Distribution",
    no_data_available: "No data available",
    checkouts: "Checkouts",
    deliveries: "Deliveries",
    
    // Cable Types
    add_new_cable_type: "Add New Cable Type",
    edit_cable_type: "Edit Cable Type",
    cable_type_added: "Cable type added successfully",
    cable_type_updated: "Cable type updated successfully",
    cable_type_deleted: "Cable type deleted successfully",
    confirm_delete_type: "Are you sure you want to delete this cable type?",
    type_in_use: "This cable type is in use by one or more cables and cannot be deleted.",
    no_cable_types: "No cable types found",
    property_name: "Property Name",
    property_type: "Property Type",
    add_property: "Add Property",
    text: "Text",
    number: "Number",
    color: "Color",
    boolean: "Boolean (Yes/No)",
    no_properties: "No properties defined",
    
    // Inventory
    add_new_cable: "Add New Cable",
    edit_cable: "Edit Cable",
    cable_added_success: "Cable added successfully",
    cable_updated_success: "Cable updated successfully",
    cable_deleted_success: "Cable deleted successfully",
    confirm_delete: "Are you sure you want to delete this cable?",
    id_already_exists: "ID already exists",
    cable_not_found: "Cable not found",
    select_cable_type: "Select cable type",
    
    // Deliveries
    add_new_delivery: "Add New Delivery",
    edit_delivery: "Edit Delivery",
    delivery_added_success: "Delivery added successfully",
    delivery_updated_success: "Delivery updated successfully",
    mark_received: "Mark as Received",
    cancel_delivery: "Cancel Delivery",
    confirm_cancel_delivery: "Are you sure you want to cancel this delivery?",
    only_cancel_pending: "Only pending deliveries can be cancelled",
    delivery_cancelled: "Delivery cancelled successfully",
    delivery_marked_received: "Delivery marked as received and inventory updated",
    no_deliveries: "No deliveries found",
    delivery: "Delivery",
    delivery_items: "Delivery Items",
    reference: "Reference",
    notes: "Notes",
    date: "Date",
    supplier: "Supplier",
    status: "Status",
    quantity: "Quantity",
    cable_type: "Cable Type",
    at_least_one_item: "At least one item is required",
    select_type_for_all_items: "Please select a type for all items",
    enter_valid_quantity_for_all: "Please enter a valid quantity for all items",
    select_cable_type: "Select cable type",
    
    // Checkout
    recipient: "Recipient",
    checkout_success: "Checkout completed successfully",
    not_enough_stock: "Not enough stock available",
    checkout_failed: "Checkout failed",
    no_checkout_history: "No checkout history found",
    
    // Low Stock
    no_low_stock_items: "No low stock items found",
    restock: "Restock",
    restock_item: "Restock Item",
    enter_valid_quantity: "Please enter a valid quantity",
    added: "Added",
    items_to_stock_for: "items to stock for",
    
    // Import/Export
    import_success: "Data imported successfully",
    export_success: "Data exported successfully",
    import_failed: "Import failed",
    export_failed: "Export failed",
    confirm_clear_all_data: "Are you sure you want to clear all data? This action cannot be undone.",
    
    // Barcode
    barcode_registered: "Barcode registered successfully",
    barcode_not_found: "Barcode not found",
    select_cable_first: "Please select a cable first",
    scanning: "Scanning..."
  },
  de: {
    // Common
    save: "Speichern",
    update: "Aktualisieren",
    cancel: "Abbrechen",
    delete: "Löschen",
    edit: "Bearbeiten",
    view: "Ansehen",
    confirm: "Bestätigen",
    add: "Hinzufügen",
    close: "Schließen",
    search: "Suchen",
    no_data: "Keine Daten verfügbar",
    properties: "Eigenschaften",
    to: "An",
    
    // Dashboard
    total_stock: "Gesamtbestand",
    unique_types: "Einzigartige Kabeltypen",
    inventory_value: "Inventarwert",
    low_stock_items: "Niedrigbestandsartikel",
    category_distribution: "Kategorieverteilung",
    recent_deliveries: "Kürzliche Lieferungen",
    recent_checkouts: "Kürzliche Entnahmen",
    stock_trend: "Bestandstrend",
    type_distribution: "Typenverteilung",
    no_data_available: "Keine Daten verfügbar",
    checkouts: "Entnahmen",
    deliveries: "Lieferungen",
    
    // Cable Types
    add_new_cable_type: "Neuen Kabeltyp hinzufügen",
    edit_cable_type: "Kabeltyp bearbeiten",
    cable_type_added: "Kabeltyp erfolgreich hinzugefügt",
    cable_type_updated: "Kabeltyp erfolgreich aktualisiert",
    cable_type_deleted: "Kabeltyp erfolgreich gelöscht",
    confirm_delete_type: "Sind Sie sicher, dass Sie diesen Kabeltyp löschen möchten?",
    type_in_use: "Dieser Kabeltyp wird von einem oder mehreren Kabeln verwendet und kann nicht gelöscht werden.",
    no_cable_types: "Keine Kabeltypen gefunden",
    property_name: "Eigenschaftsname",
    property_type: "Eigenschaftstyp",
    add_property: "Eigenschaft hinzufügen",
    text: "Text",
    number: "Zahl",
    color: "Farbe",
    boolean: "Boolesch (Ja/Nein)",
    no_properties: "Keine Eigenschaften definiert",
    
    // Inventory
    add_new_cable: "Neues Kabel hinzufügen",
    edit_cable: "Kabel bearbeiten",
    cable_added_success: "Kabel erfolgreich hinzugefügt",
    cable_updated_success: "Kabel erfolgreich aktualisiert",
    cable_deleted_success: "Kabel erfolgreich gelöscht",
    confirm_delete: "Sind Sie sicher, dass Sie dieses Kabel löschen möchten?",
    id_already_exists: "ID existiert bereits",
    cable_not_found: "Kabel nicht gefunden",
    select_cable_type: "Kabeltyp auswählen",
    
    // Deliveries
    add_new_delivery: "Neue Lieferung hinzufügen",
    edit_delivery: "Lieferung bearbeiten",
    delivery_added_success: "Lieferung erfolgreich hinzugefügt",
    delivery_updated_success: "Lieferung erfolgreich aktualisiert",
    mark_received: "Als erhalten markieren",
    cancel_delivery: "Lieferung stornieren",
    confirm_cancel_delivery: "Sind Sie sicher, dass Sie diese Lieferung stornieren möchten?",
    only_cancel_pending: "Nur ausstehende Lieferungen können storniert werden",
    delivery_cancelled: "Lieferung erfolgreich storniert",
    delivery_marked_received: "Lieferung als erhalten markiert und Inventar aktualisiert",
    no_deliveries: "Keine Lieferungen gefunden",
    delivery: "Lieferung",
    delivery_items: "Lieferungspositionen",
    reference: "Referenz",
    notes: "Notizen",
    date: "Datum",
    supplier: "Lieferant",
    status: "Status",
    quantity: "Menge",
    cable_type: "Kabeltyp",
    at_least_one_item: "Mindestens ein Artikel ist erforderlich",
    select_type_for_all_items: "Bitte wählen Sie einen Typ für alle Artikel",
    enter_valid_quantity_for_all: "Bitte geben Sie eine gültige Menge für alle Artikel ein",
    select_cable_type: "Kabeltyp auswählen",
    
    // Checkout
    recipient: "Empfänger",
    checkout_success: "Entnahme erfolgreich abgeschlossen",
    not_enough_stock: "Nicht genügend Bestand verfügbar",
    checkout_failed: "Entnahme fehlgeschlagen",
    no_checkout_history: "Keine Entnahmehistorie gefunden",
    
    // Low Stock
    no_low_stock_items: "Keine Niedrigbestandsartikel gefunden",
    restock: "Auffüllen",
    restock_item: "Artikel auffüllen",
    enter_valid_quantity: "Bitte geben Sie eine gültige Menge ein",
    added: "Hinzugefügt",
    items_to_stock_for: "Artikel zum Bestand für",
    
    // Import/Export
    import_success: "Daten erfolgreich importiert",
    export_success: "Daten erfolgreich exportiert",
    import_failed: "Import fehlgeschlagen",
    export_failed: "Export fehlgeschlagen",
    confirm_clear_all_data: "Sind Sie sicher, dass Sie alle Daten löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    
    // Barcode
    barcode_registered: "Barcode erfolgreich registriert",
    barcode_not_found: "Barcode nicht gefunden",
    select_cable_first: "Bitte wählen Sie zuerst ein Kabel aus",
    scanning: "Scannen..."
  }
};

// Current language (default to English)
let currentLanguage = 'en';

// Get current language
function getCurrentLanguage() {
  return currentLanguage;
}

// Switch language
function switchLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'de' : 'en';
  updateLanguageUI();
  updateAllText();
}

// Update language UI
function updateLanguageUI() {
  const languageToggle = document.getElementById('language-toggle');
  if (languageToggle) {
    languageToggle.innerHTML = `<span class="lang-icon">${currentLanguage === 'en' ? '🇩🇪' : '🇬🇧'}</span>`;
    languageToggle.title = currentLanguage === 'en' ? 'Switch to German' : 'Switch to English';
  }
}

// Update all text based on current language
function updateAllText() {
  try {
    // Update all text elements with data-text attribute
    const elements = document.querySelectorAll('[data-text]');
    elements.forEach(element => {
      const textKey = element.getAttribute('data-text');
      element.textContent = getText(textKey);
    });
    
    // Manually update specific elements - check if they exist first
    updateElementText('main-title', currentLanguage === 'en' ? 'Cable Inventory System' : 'Kabel-Inventarsystem');
    updateElementText('dashboard-title', currentLanguage === 'en' ? 'Dashboard' : 'Dashboard');
    updateElementText('inventory-title', currentLanguage === 'en' ? 'Cable Inventory' : 'Kabelinventar');
    updateElementText('cable-types-title', currentLanguage === 'en' ? 'Cable Types' : 'Kabeltypen');
    updateElementText('deliveries-title', currentLanguage === 'en' ? 'Cable Deliveries' : 'Kabellieferungen');
    updateElementText('low-stock-title', currentLanguage === 'en' ? 'Low Stock Items' : 'Niedrigbestandsartikel');
    updateElementText('checkout-title', currentLanguage === 'en' ? 'Cable Checkout' : 'Kabelentnahme');
    updateElementText('import-export-title', currentLanguage === 'en' ? 'Import/Export Data' : 'Daten Importieren/Exportieren');
    
    // Update placeholders - check if they exist first
    updateElementPlaceholder('inventory-search', currentLanguage === 'en' ? 'Search cables...' : 'Kabel suchen...');
    
    // Update buttons - check if they exist first
    updateElementText('add-btn-text', currentLanguage === 'en' ? 'Add Cable' : 'Kabel hinzufügen');
    updateElementText('add-type-btn-text', currentLanguage === 'en' ? 'Add Cable Type' : 'Kabeltyp hinzufügen');
    updateElementText('add-delivery-btn-text', currentLanguage === 'en' ? 'New Delivery' : 'Neue Lieferung');
    updateElementText('checkout-btn-text', currentLanguage === 'en' ? 'Checkout' : 'Entnehmen');
    updateElementText('import-btn-text', currentLanguage === 'en' ? 'Import Data' : 'Daten importieren');
    updateElementText('export-btn-text', currentLanguage === 'en' ? 'Export Data' : 'Daten exportieren');
    
    // Force redraw of tables if they're initialized
    if (typeof loadInventoryData === 'function') loadInventoryData();
    if (typeof loadCableTypesData === 'function') loadCableTypesData();
    if (typeof updateLowStockTable === 'function') updateLowStockTable();
    if (typeof loadDeliveriesData === 'function') loadDeliveriesData();
    if (typeof loadCheckoutHistory === 'function') loadCheckoutHistory();
    if (typeof loadDashboardData === 'function') loadDashboardData();
  } catch (error) {
    console.error('Error updating text:', error);
  }
}

// Helper function to update element text safely
function updateElementText(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

// Helper function to update element placeholder safely
function updateElementPlaceholder(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.placeholder = text;
  }
}

// Helper function to access text based on current language
function getText(key) {
  const lang = getCurrentLanguage();
  return langData[lang] && langData[lang][key] ? langData[lang][key] : key;
}

// Setup language switcher
document.addEventListener('DOMContentLoaded', function() {
  const languageToggle = document.getElementById('language-toggle');
  if (languageToggle) {
    languageToggle.addEventListener('click', switchLanguage);
  }
  
  // Initialize UI with current language
  updateLanguageUI();
});
