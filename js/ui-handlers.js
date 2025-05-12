// Status server
let serverStatus = {
    status: "AKTIF",
    uptime: 23,
    beban: 68,
    suhu: 45,
    efficiency: 92,
    dataStatus: "DINAMIS"
  };
  
  // DOM Elements
  const statusTab = document.getElementById('status-tab');
  const analyticsTab = document.getElementById('analytics-tab');
  const statusContent = document.getElementById('status-content');
  const analyticsContent = document.getElementById('analytics-content');
  const toggleStatusBtn = document.getElementById('toggle-status');
  const dataStatusBadge = document.getElementById('data-status');
  const sensorDataTable = document.getElementById('sensor-data');
  const serverInfoGrid = document.getElementById('server-info');
  const alertsTable = document.getElementById('alerts-data');
  const allDataPre = document.getElementById('all-data');
  const dailyAvgElement = document.getElementById('daily-avg');
  const weeklyAvgElement = document.getElementById('weekly-avg');
  const monthlyAvgElement = document.getElementById('monthly-avg');
  const powerHourTable = document.getElementById('power-hour-table');
  const connectionIndicator = document.getElementById('connection-indicator');
  const connectionText = document.getElementById('connection-text');
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  
  // Elements untuk update dinamis
  const serverStatusElement = document.getElementById('server-status');
  const uptimeElement = document.getElementById('uptime');
  const bebanValueElement = document.getElementById('beban-value');
  const bebanProgressElement = document.getElementById('beban-progress');
  const suhuValueElement = document.getElementById('suhu-value');
  const suhuProgressElement = document.getElementById('suhu-progress');
  const efficiencyValueElement = document.getElementById('efficiency-value');
  const efficiencyProgressElement = document.getElementById('efficiency-progress');
  
  // Tab switching
  statusTab.addEventListener('click', () => {
    statusTab.classList.add('active');
    analyticsTab.classList.remove('active');
    statusContent.style.display = 'block';
    analyticsContent.style.display = 'none';
  });
  
  analyticsTab.addEventListener('click', () => {
    analyticsTab.classList.add('active');
    statusTab.classList.remove('active');
    analyticsContent.style.display = 'block';
    statusContent.style.display = 'none';
    
    // Perbarui tampilan analitik
    initServerInfo();
    initAlertsTable();
    initPowerHourTable();
    setPowerMetrics();
    setAllData();
  });
  
  // Toggle data status
  toggleStatusBtn.addEventListener('click', () => {
    if (serverStatus.dataStatus === 'DINAMIS') {
      serverStatus.dataStatus = 'STATIS';
      dataStatusBadge.textContent = 'Status Data: STATIS';
      dataStatusBadge.classList.remove('status-dinamis');
      dataStatusBadge.classList.add('status-statis');
      debug("Data status changed to STATIS");
    } else {
      serverStatus.dataStatus = 'DINAMIS';
      dataStatusBadge.textContent = 'Status Data: DINAMIS';
      dataStatusBadge.classList.remove('status-statis');
      dataStatusBadge.classList.add('status-dinamis');
      debug("Data status changed to DINAMIS");
    }
  });
  
  // Toggle theme (light/dark mode)
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    
    // Toggle icon visibility
    sunIcon.style.display = isDarkMode ? 'none' : 'block';
    moonIcon.style.display = isDarkMode ? 'block' : 'none';
    
    // Save preference to localStorage
    localStorage.setItem('dark-mode', isDarkMode ? 'enabled' : 'disabled');
    
    // Update chart colors
    updateChartColors();
    
    // Redraw charts with new theme colors
    setupVoltageChart();
    setupCurrentChart();
    setupRulesChart();
    
    debug("Theme changed to " + (isDarkMode ? "dark mode" : "light mode"));
  });
  
  // Initialize theme based on saved preference
  function initializeTheme() {
    const savedTheme = localStorage.getItem('dark-mode');
    
    if (savedTheme === 'enabled') {
      document.documentElement.classList.add('dark-mode');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      document.documentElement.classList.remove('dark-mode');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }
  
  // Initialize sensor data table
  function initSensorDataTable() {
    sensorDataTable.innerHTML = '';
    for (const [key, value] of Object.entries(firebaseData.sensor_data)) {
      const row = document.createElement('tr');
      
      const keyCell = document.createElement('td');
      keyCell.textContent = key;
      
      const valueCell = document.createElement('td');
      valueCell.textContent = value;
      valueCell.setAttribute('data-value', value); // Store original value for comparison
      
      row.appendChild(keyCell);
      row.appendChild(valueCell);
      sensorDataTable.appendChild(row);
    }
  }
  
  // Update sensor data table with animation for changed values
  function updateSensorDataTable() {
    const rows = sensorDataTable.querySelectorAll('tr');
    
    rows.forEach(row => {
      const key = row.querySelector('td:first-child').textContent;
      const valueCell = row.querySelector('td:last-child');
      const oldValue = parseFloat(valueCell.getAttribute('data-value'));
      const newValue = firebaseData.sensor_data[key];
      
      if (oldValue !== newValue) {
        valueCell.textContent = newValue;
        valueCell.setAttribute('data-value', newValue);
        
        // Add animation class
        valueCell.classList.remove('animate-update'); // Remove if exists
        setTimeout(() => {
          valueCell.classList.add('animate-update');
        }, 10); // Small delay to ensure removal happened
      }
    });
  }
  
  // Initialize server info grid
  function initServerInfo() {
    serverInfoGrid.innerHTML = '';
    for (const [key, value] of Object.entries(firebaseData.server_info)) {
      const infoItem = document.createElement('div');
      infoItem.className = 'info-item';
      
      const infoLabel = document.createElement('div');
      infoLabel.className = 'info-label';
      infoLabel.textContent = key.replace(/([A-Z])/g, ' $1').trim();
      
      const infoValue = document.createElement('div');
      infoValue.className = 'info-value';
      infoValue.textContent = value;
      
      infoItem.appendChild(infoLabel);
      infoItem.appendChild(infoValue);
      serverInfoGrid.appendChild(infoItem);
    }
  }
  
  // Initialize alerts table
  function initAlertsTable() {
    alertsTable.innerHTML = '';
    for (const alert of firebaseData.alerts) {
      const row = document.createElement('tr');
      
      const timestampCell = document.createElement('td');
      timestampCell.textContent = alert.timestamp;
      
      const typeCell = document.createElement('td');
      const typeSpan = document.createElement('span');
      typeSpan.className = `alert-badge alert-${alert.type.toLowerCase()}`;
      typeSpan.textContent = alert.type;
      typeCell.appendChild(typeSpan);
      
      const messageCell = document.createElement('td');
      messageCell.textContent = alert.message;
      
      row.appendChild(timestampCell);
      row.appendChild(typeCell);
      row.appendChild(messageCell);
      alertsTable.appendChild(row);
    }
  }
  
  // Initialize power hourly data
  function initPowerHourTable() {
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    firebaseData.power_metrics.lastHour.forEach(entry => {
      const th = document.createElement('th');
      th.textContent = entry.time;
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    
    // Create table body
    const tbody = document.createElement('tbody');
    const dataRow = document.createElement('tr');
    
    firebaseData.power_metrics.lastHour.forEach(entry => {
      const td = document.createElement('td');
      td.textContent = `${entry.power} kW`;
      dataRow.appendChild(td);
    });
    
    tbody.appendChild(dataRow);
    
    // Clear and append
    powerHourTable.innerHTML = '';
    powerHourTable.appendChild(thead);
    powerHourTable.appendChild(tbody);
  }
  
  // Set power metrics averages
  function setPowerMetrics() {
    dailyAvgElement.textContent = `${firebaseData.power_metrics.dailyAvg} kW`;
    weeklyAvgElement.textContent = `${firebaseData.power_metrics.weeklyAvg} kW`;
    monthlyAvgElement.textContent = `${firebaseData.power_metrics.monthlyAvg} kW`;
  }
  
  // Set all data JSON
  function setAllData() {
    allDataPre.textContent = JSON.stringify(firebaseData, null, 2);
  }
  
  // Update server status metrics with animation
  function updateServerStatusMetrics() {
    const animateIfChanged = (element, newValue, suffix = '') => {
      const currentValue = element.textContent.replace(/[^0-9.-]/g, ''); // Remove non-numeric parts
      
      if (parseFloat(currentValue) !== newValue) {
        element.textContent = `${newValue}${suffix}`;
        
        // Add animation
        element.classList.remove('animate-update');
        setTimeout(() => {
          element.classList.add('animate-update');
        }, 10);
      }
    };
    
    serverStatusElement.textContent = serverStatus.status;
    uptimeElement.textContent = serverStatus.uptime;
    
    animateIfChanged(bebanValueElement, serverStatus.beban, '%');
    bebanProgressElement.style.width = `${serverStatus.beban}%`;
    
    animateIfChanged(suhuValueElement, serverStatus.suhu, '°C');
    const suhuPercentage = (serverStatus.suhu / 60) * 100;
    suhuProgressElement.style.width = `${suhuPercentage}%`;
    
    if (serverStatus.suhu > 50) {
      suhuProgressElement.classList.remove('progress-orange');
      suhuProgressElement.classList.add('progress-red');
    } else {
      suhuProgressElement.classList.remove('progress-red');
      suhuProgressElement.classList.add('progress-orange');
    }
    
    animateIfChanged(efficiencyValueElement, serverStatus.efficiency, '%');
    efficiencyProgressElement.style.width = `${serverStatus.efficiency}%`;
  }


  //see? dia auto update barusan per 10-20 detik asal server on 