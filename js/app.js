// Simulasi data dari Firebase
const firebaseData = {
    sensor_data: {
      Edel: 1.88,
      Iavg: 0.06249,
      Ptot: 0.01056,
      V1: 99.98767,
      V2: 101.4014,
      V3: 99.57052,
      Vavg: 57.92268,
    },
    server_info: {
      name: "Server-DB-01",
      location: "Rack 3, Data Center Jakarta",
      ip: "192.168.1.105",
      os: "Ubuntu Server 24.04 LTS",
      uptime: "23d 14h 35m",
      lastReboot: "2025-04-18 10:23:45"
    },
    power_metrics: {
      lastHour: [
        { time: "04:00", power: 1.02 },
        { time: "04:10", power: 1.05 },
        { time: "04:20", power: 1.08 },
        { time: "04:30", power: 1.06 },
        { time: "04:40", power: 1.12 },
        { time: "04:50", power: 1.15 },
      ],
      dailyAvg: 1.08,
      weeklyAvg: 1.10,
      monthlyAvg: 1.07
    },
    alerts: [
      { id: 1, timestamp: "2025-05-11 03:45:22", type: "WARNING", message: "Suhu server melebihi 50°C" },
      { id: 2, timestamp: "2025-05-10 22:12:04", type: "INFO", message: "Voltase fase 2 fluktuatif" },
      { id: 3, timestamp: "2025-05-09 14:30:16", type: "ERROR", message: "Connection timeout pada database endpoint" },
    ]
  };
  
  // Status server
  let serverStatus = {
    status: "AKTIF",
    uptime: 23,
    beban: 68,
    suhu: 45,
    efficiency: 92,
    dataStatus: "DINAMIS"
  };
  
  // Data untuk grafik
  let voltageHistory = [
    { time: "10:30", V1: 99.5, V2: 101.2, V3: 99.8 },
    { time: "10:31", V1: 99.6, V2: 101.3, V3: 99.7 },
    { time: "10:32", V1: 99.8, V2: 101.4, V3: 99.6 },
    { time: "10:33", V1: 99.9, V2: 101.5, V3: 99.5 },
    { time: "10:34", V1: 100.0, V2: 101.3, V3: 99.6 }
  ];
  
  let currentHistory = [
    { time: "10:30", Iavg: 0.061, Power: 10.5 },
    { time: "10:31", Iavg: 0.062, Power: 10.6 },
    { time: "10:32", Iavg: 0.063, Power: 10.7 },
    { time: "10:33", Iavg: 0.062, Power: 10.6 },
    { time: "10:34", Iavg: 0.061, Power: 10.5 }
  ];
  
  let rulesData = [
    { time: "10:30", value: 1 },
    { time: "10:31", value: 0 },
    { time: "10:32", value: 0 },
    { time: "10:33", value: 1 },
    { time: "10:34", value: 0 }
  ];
  
  // Chart objects
  let voltageChart;
  let currentChart;
  let rulesChart;
  
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
  });
  
  // Toggle data status
  toggleStatusBtn.addEventListener('click', () => {
    if (serverStatus.dataStatus === 'DINAMIS') {
      serverStatus.dataStatus = 'STATIS';
      dataStatusBadge.textContent = 'Status Data: STATIS';
      dataStatusBadge.classList.remove('status-dinamis');
      dataStatusBadge.classList.add('status-statis');
    } else {
      serverStatus.dataStatus = 'DINAMIS';
      dataStatusBadge.textContent = 'Status Data: DINAMIS';
      dataStatusBadge.classList.remove('status-statis');
      dataStatusBadge.classList.add('status-dinamis');
    }
  });
  
  // Initialize sensor data table
  function initSensorDataTable() {
    sensorDataTable.innerHTML = '';
    for (const [key, value] of Object.entries(firebaseData.sensor_data)) {
      const row = document.createElement('tr');
      
      const keyCell = document.createElement('td');
      keyCell.textContent = key;
      
      const valueCell = document.createElement('td');
      valueCell.textContent = value;
      
      row.appendChild(keyCell);
      row.appendChild(valueCell);
      sensorDataTable.appendChild(row);
    }
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
  
  // Update server status metrics
  function updateServerStatusMetrics() {
    serverStatusElement.textContent = serverStatus.status;
    uptimeElement.textContent = serverStatus.uptime;
    
    bebanValueElement.textContent = `${serverStatus.beban}%`;
    bebanProgressElement.style.width = `${serverStatus.beban}%`;
    
    suhuValueElement.textContent = `${serverStatus.suhu}°C`;
    const suhuPercentage = (serverStatus.suhu / 60) * 100;
    suhuProgressElement.style.width = `${suhuPercentage}%`;
    
    if (serverStatus.suhu > 50) {
      suhuProgressElement.classList.remove('progress-orange');
      suhuProgressElement.classList.add('progress-red');
    } else {
      suhuProgressElement.classList.remove('progress-red');
      suhuProgressElement.classList.add('progress-orange');
    }
    
    efficiencyValueElement.textContent = `${serverStatus.efficiency}%`;
    efficiencyProgressElement.style.width = `${serverStatus.efficiency}%`;
  }
  
  // Set up voltage chart
  function setupVoltageChart() {
    const ctx = document.getElementById('voltage-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (voltageChart) {
      voltageChart.destroy();
    }
    
    // Extract data
    const labels = voltageHistory.map(item => item.time);
    const dataV1 = voltageHistory.map(item => item.V1);
    const dataV2 = voltageHistory.map(item => item.V2);
    const dataV3 = voltageHistory.map(item => item.V3);
    
    // Create chart
    voltageChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Fase 1',
            data: dataV1,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Fase 2',
            data: dataV2,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Fase 3',
            data: dataV3,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            min: 95,
            max: 105,
            title: {
              display: true,
              text: 'Voltase (V)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Waktu'
            }
          }
        }
      }
    });
  }
  
  // Set up current chart
  function setupCurrentChart() {
    const ctx = document.getElementById('current-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (currentChart) {
      currentChart.destroy();
    }
    
    // Extract data
    const labels = currentHistory.map(item => item.time);
    const dataIavg = currentHistory.map(item => item.Iavg);
    const dataPower = currentHistory.map(item => item.Power);
    
    // Create chart with dual Y axes
    currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Arus Rata-rata (A)',
            data: dataIavg,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y'
          },
          {
            label: 'Daya (W)',
            data: dataPower,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Arus (A)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: 'Daya (W)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Waktu'
            }
          }
        }
      }
    });
  }
  
  // Set up rules chart
  function setupRulesChart() {
    const ctx = document.getElementById('rules-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (rulesChart) {
      rulesChart.destroy();
    }
    
    // Extract data
    const labels = rulesData.map(item => item.time);
    const dataValues = rulesData.map(item => item.value);
    
    // Create chart
    rulesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Evaluasi Aturan',
            data: dataValues,
            backgroundColor: '#3b82f6',
            barPercentage: 0.6,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            min: 0,
            max: 1,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return value === 0 ? 'No' : 'Yes';
              }
            },
            title: {
              display: true,
              text: 'Status'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Waktu'
            }
          }
        }
      }
    });
  }


  //appjs ini untuk keperluan update data secara otomatis(auto update)
  
  // Update data in realtime
  function updateData() {
    if (serverStatus.dataStatus === 'DINAMIS') {
      // Update sensor data
      firebaseData.sensor_data.Edel = parseFloat((firebaseData.sensor_data.Edel + (Math.random() * 0.1 - 0.05)).toFixed(2));
      firebaseData.sensor_data.Iavg = parseFloat((firebaseData.sensor_data.Iavg + (Math.random() * 0.005 - 0.0025)).toFixed(5));
      firebaseData.sensor_data.Ptot = parseFloat((firebaseData.sensor_data.Ptot + (Math.random() * 0.001 - 0.0005)).toFixed(5));
      firebaseData.sensor_data.V1 = parseFloat((firebaseData.sensor_data.V1 + (Math.random() * 0.2 - 0.1)).toFixed(5));
      firebaseData.sensor_data.V2 = parseFloat((firebaseData.sensor_data.V2 + (Math.random() * 0.2 - 0.1)).toFixed(4));
      firebaseData.sensor_data.V3 = parseFloat((firebaseData.sensor_data.V3 + (Math.random() * 0.2 - 0.1)).toFixed(5));
      firebaseData.sensor_data.Vavg = parseFloat((firebaseData.sensor_data.Vavg + (Math.random() * 0.1 - 0.05)).toFixed(5));
      
      // Update server status
      serverStatus.beban = Math.min(100, Math.max(50, serverStatus.beban + Math.floor(Math.random() * 5 - 2)));
      serverStatus.suhu = Math.min(55, Math.max(35, serverStatus.suhu + Math.floor(Math.random() * 3 - 1)));
      serverStatus.efficiency = Math.min(98, Math.max(85, serverStatus.efficiency + Math.floor(Math.random() * 2 - 1)));
      
      // Get current time
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      // Update voltage history
      voltageHistory.push({
        time: timeStr,
        V1: firebaseData.sensor_data.V1,
        V2: firebaseData.sensor_data.V2,
        V3: firebaseData.sensor_data.V3
      });
      
      if (voltageHistory.length > 10) {
        voltageHistory.shift();
      }
      
// Update current history
currentHistory.push({
    time: timeStr,
    Iavg: firebaseData.sensor_data.Iavg,
    Power: firebaseData.sensor_data.Ptot * 1000
  });
  
  if (currentHistory.length > 10) {
    currentHistory.shift();
  }
  
  // Occasionally update rules data
  if (Math.random() > 0.7) {
    rulesData.push({
      time: timeStr,
      value: Math.random() > 0.7 ? 1 : 0
    });
    
    if (rulesData.length > 10) {
      rulesData.shift();
    }
  }
  
  // Update UI
  initSensorDataTable();
  updateServerStatusMetrics();
  setAllData();
  
  // Update charts
  setupVoltageChart();
  setupCurrentChart();
  setupRulesChart();
}
}

// Initialize
function init() {
// Set initial data
initSensorDataTable();
initServerInfo();
initAlertsTable();
initPowerHourTable();
setPowerMetrics();
setAllData();
updateServerStatusMetrics();

// Set up charts
setupVoltageChart();
setupCurrentChart();
setupRulesChart();

// Start update loop
setInterval(updateData, 3000);
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init);