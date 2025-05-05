
// Dashboard for Cable Inventory System

// Load dashboard data
function loadDashboardData() {
  updateStockSummary();
  updateRecentDeliveries();
  updateRecentCheckouts();
  updateLowStockSummary();
  initCharts();
}

// Update stock summary stats
function updateStockSummary() {
  const inventory = getInventory();
  const types = getCableTypes();
  
  // Calculate total stock
  const totalStock = inventory.reduce((sum, cable) => sum + cable.stock, 0);
  document.getElementById('total-stock-value').textContent = totalStock;
  
  // Calculate unique cable types
  const uniqueTypeIds = [...new Set(inventory.map(cable => cable.typeId))];
  document.getElementById('unique-types-value').textContent = uniqueTypeIds.length;
  
  // Calculate total value (if we had price data, for now use count)
  document.getElementById('total-value-value').textContent = totalStock;
  
  // Calculate stock distribution by category
  const categoryData = {};
  
  inventory.forEach(cable => {
    const type = types.find(t => t.id === cable.typeId);
    if (type) {
      const category = type.category;
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += cable.stock;
    }
  });
  
  // Update category distribution list
  const categoryList = document.getElementById('category-distribution');
  categoryList.innerHTML = '';
  
  Object.entries(categoryData)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      const percentage = totalStock > 0 ? ((count / totalStock) * 100).toFixed(1) : 0;
      const item = document.createElement('div');
      item.className = 'category-item';
      
      item.innerHTML = `
        <div class="category-name">${category}</div>
        <div class="category-bar-container">
          <div class="category-bar" style="width: ${percentage}%;"></div>
          <div class="category-value">${count} (${percentage}%)</div>
        </div>
      `;
      
      categoryList.appendChild(item);
    });
}

// Update recent deliveries
function updateRecentDeliveries() {
  const deliveries = getDeliveries();
  const recentList = document.getElementById('recent-deliveries');
  recentList.innerHTML = '';
  
  if (deliveries.length === 0) {
    recentList.innerHTML = `<div class="empty-state">${getText('no_deliveries')}</div>`;
    return;
  }
  
  // Get the 5 most recent deliveries
  deliveries
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .forEach(delivery => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      
      const statusClass = delivery.status === 'received' ? 'status-success' : 
                        delivery.status === 'cancelled' ? 'status-danger' : 'status-pending';
      
      item.innerHTML = `
        <div class="activity-date">${new Date(delivery.date).toLocaleDateString()}</div>
        <div class="activity-content">
          <div>
            <strong>${delivery.id}</strong> - ${delivery.supplier}
          </div>
          <div>
            ${delivery.items.reduce((sum, item) => sum + item.quantity, 0)} items 
            <span class="status-badge ${statusClass}">${delivery.status}</span>
          </div>
        </div>
        <div class="activity-action">
          <button class="btn btn-sm" onclick="viewDeliveryDetails('${delivery.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
      `;
      
      recentList.appendChild(item);
    });
}

// Update recent checkouts
function updateRecentCheckouts() {
  const checkoutHistory = getCheckoutHistory();
  const recentList = document.getElementById('recent-checkouts');
  recentList.innerHTML = '';
  
  if (checkoutHistory.length === 0) {
    recentList.innerHTML = `<div class="empty-state">${getText('no_checkout_history')}</div>`;
    return;
  }
  
  // Get the 5 most recent checkouts
  checkoutHistory
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .forEach(checkout => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      
      // Try to get the type name
      const inventory = getInventory();
      const cable = inventory.find(c => c.id === checkout.cableId);
      const cableName = cable ? cable.type : checkout.cableId;
      
      item.innerHTML = `
        <div class="activity-date">${new Date(checkout.date).toLocaleDateString()}</div>
        <div class="activity-content">
          <div><strong>${cableName}</strong> - ${checkout.quantity} units</div>
          <div>${getText('to')}: ${checkout.recipient}</div>
        </div>
        <div class="activity-action">
          <span class="checkout-time">${new Date(checkout.date).toLocaleTimeString()}</span>
        </div>
      `;
      
      recentList.appendChild(item);
    });
}

// Update low stock summary
function updateLowStockSummary() {
  const threshold = parseInt(document.getElementById('low-stock-threshold').value || 5);
  const inventory = getInventory();
  const lowStockItems = inventory.filter(item => item.stock <= threshold);
  
  const lowStockList = document.getElementById('low-stock-summary');
  lowStockList.innerHTML = '';
  
  if (lowStockItems.length === 0) {
    lowStockList.innerHTML = `<div class="empty-state success-state">${getText('no_low_stock_items')}</div>`;
    return;
  }
  
  // Sort by stock level (ascending)
  lowStockItems
    .sort((a, b) => a.stock - b.stock)
    .forEach(item => {
      const listItem = document.createElement('div');
      listItem.className = 'low-stock-item';
      
      // Create stock indicator
      const stockClass = item.stock === 0 ? 'stock-critical' : 'stock-warning';
      
      listItem.innerHTML = `
        <div class="low-stock-info">
          <div class="low-stock-name">${item.type}</div>
          <div class="low-stock-id">${item.id}</div>
        </div>
        <div class="low-stock-count ${stockClass}">
          ${item.stock}/${threshold}
        </div>
        <div class="low-stock-action">
          <button class="btn btn-primary btn-sm" onclick="showRestockDialog({id: '${item.id}', type: '${item.type}'})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          </button>
        </div>
      `;
      
      lowStockList.appendChild(listItem);
    });
  
  // Update count badge
  const lowStockCount = document.getElementById('low-stock-count');
  if (lowStockCount) {
    lowStockCount.textContent = lowStockItems.length;
    
    if (lowStockItems.length > 0) {
      lowStockCount.style.display = 'inline-flex';
    } else {
      lowStockCount.style.display = 'none';
    }
  }
}

// Initialize charts
function initCharts() {
  drawStockTrendChart();
  drawTypeDistributionChart();
}

// Draw stock trend chart
function drawStockTrendChart() {
  const canvas = document.getElementById('stock-trend-chart');
  
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Clear previous chart
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Get checkout history and organize by month
  const checkoutHistory = getCheckoutHistory();
  const currentYear = new Date().getFullYear();
  const monthlyData = Array(12).fill(0);
  
  // Count checkouts by month for current year
  checkoutHistory.forEach(checkout => {
    const date = new Date(checkout.date);
    if (date.getFullYear() === currentYear) {
      const month = date.getMonth();
      monthlyData[month] += checkout.quantity;
    }
  });
  
  // Sample data for deliveries (if we had historical data)
  // For now, let's generate some sample data
  const monthlyDeliveries = Array(12).fill(0);
  for (let i = 0; i < 12; i++) {
    monthlyDeliveries[i] = Math.floor(Math.random() * 20) + 10;
  }
  
  // Chart dimensions
  const chartWidth = canvas.width;
  const chartHeight = canvas.height;
  const padding = 40;
  const graphWidth = chartWidth - (padding * 2);
  const graphHeight = chartHeight - (padding * 2);
  
  // Find max value for scaling
  const maxValue = Math.max(...monthlyData, ...monthlyDeliveries);
  
  // Draw axis
  ctx.beginPath();
  ctx.strokeStyle = '#c0c0c0';
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, chartHeight - padding);
  ctx.lineTo(chartWidth - padding, chartHeight - padding);
  ctx.stroke();
  
  // Draw month labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  
  const barWidth = graphWidth / months.length / 3;
  
  months.forEach((month, i) => {
    const x = padding + (i * (graphWidth / months.length)) + (graphWidth / months.length / 2);
    const y = chartHeight - padding + 20;
    ctx.fillText(month, x, y);
  });
  
  // Draw value labels
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const value = Math.floor(maxValue * (i / 5));
    const y = chartHeight - padding - (i * (graphHeight / 5));
    ctx.fillText(value.toString(), padding - 5, y + 4);
    
    // Draw horizontal grid lines
    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.moveTo(padding, y);
    ctx.lineTo(chartWidth - padding, y);
    ctx.stroke();
  }
  
  // Draw checkout bars
  ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
  monthlyData.forEach((value, i) => {
    const barHeight = (value / maxValue) * graphHeight;
    const x = padding + (i * (graphWidth / months.length)) + (graphWidth / months.length / 3) - (barWidth / 2);
    const y = chartHeight - padding - barHeight;
    ctx.fillRect(x, y, barWidth, barHeight);
  });
  
  // Draw delivery bars
  ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
  monthlyDeliveries.forEach((value, i) => {
    const barHeight = (value / maxValue) * graphHeight;
    const x = padding + (i * (graphWidth / months.length)) + (graphWidth / months.length * 2/3) - (barWidth / 2);
    const y = chartHeight - padding - barHeight;
    ctx.fillRect(x, y, barWidth, barHeight);
  });
  
  // Draw legend
  const legendX = padding;
  const legendY = padding - 15;
  
  // Checkout legend
  ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
  ctx.fillRect(legendX, legendY, 15, 10);
  ctx.fillStyle = '#333';
  ctx.textAlign = 'left';
  ctx.fillText(getText('checkouts'), legendX + 20, legendY + 8);
  
  // Delivery legend
  ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
  ctx.fillRect(legendX + 100, legendY, 15, 10);
  ctx.fillStyle = '#333';
  ctx.fillText(getText('deliveries'), legendX + 120, legendY + 8);
}

// Draw type distribution chart (pie chart)
function drawTypeDistributionChart() {
  const canvas = document.getElementById('type-distribution-chart');
  
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Clear previous chart
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Get inventory and count by type
  const inventory = getInventory();
  const typeData = {};
  
  inventory.forEach(cable => {
    if (!typeData[cable.type]) {
      typeData[cable.type] = 0;
    }
    typeData[cable.type] += cable.stock;
  });
  
  // Convert to array and sort
  const typeArray = Object.entries(typeData);
  
  if (typeArray.length === 0) {
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(getText('no_data_available'), canvas.width / 2, canvas.height / 2);
    return;
  }
  
  // Chart dimensions
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  
  // Colors for pie segments
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#84cc16'
  ];
  
  // Calculate total
  const total = typeArray.reduce((sum, [_, value]) => sum + value, 0);
  
  // Draw pie chart
  let startAngle = 0;
  
  typeArray.forEach(([type, value], index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    
    // Draw slice
    ctx.beginPath();
    ctx.fillStyle = colors[index % colors.length];
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();
    
    // Draw label line and text
    const midAngle = startAngle + (sliceAngle / 2);
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos(midAngle);
    const labelY = centerY + labelRadius * Math.sin(midAngle);
    
    // Only show label if slice is big enough
    if (sliceAngle > 0.2) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const percentage = ((value / total) * 100).toFixed(1);
      ctx.fillText(percentage + '%', labelX, labelY);
    }
    
    startAngle += sliceAngle;
  });
  
  // Draw legend
  const legendSize = 15;
  const legendSpacing = 5;
  const legendX = 10;
  let legendY = 20;
  const legendTextWidth = 120;
  
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  
  typeArray.forEach(([type, value], index) => {
    // Draw color box
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(legendX, legendY - legendSize + 4, legendSize, legendSize);
    
    // Draw label
    ctx.fillStyle = '#333';
    
    // Truncate long labels
    let displayType = type;
    if (displayType.length > 15) {
      displayType = displayType.substring(0, 12) + '...';
    }
    
    ctx.fillText(displayType, legendX + legendSize + legendSpacing, legendY);
    
    // Draw value and percentage
    const percentage = ((value / total) * 100).toFixed(1);
    ctx.textAlign = 'right';
    ctx.fillText(`${value} (${percentage}%)`, canvas.width - 10, legendY);
    ctx.textAlign = 'left';
    
    // Move to next line
    legendY += legendSize + legendSpacing;
    
    // Check if we need to move to right side
    if (legendY > canvas.height - 20 && index < typeArray.length - 1) {
      legendY = 20;
      legendX = canvas.width / 2;
    }
  });
}
