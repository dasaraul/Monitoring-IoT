// Fallback function to simulate data if Firebase is not available
function simulateData() {
    if (serverStatus.dataStatus === 'DINAMIS') {
      // Only simulate if Firebase connection is lost
      if (connectionIndicator.classList.contains('disconnected')) {
        debug("Simulating data (Firebase disconnected)");
        
        // Update sensor data
        firebaseData.sensor_data.Edel = parseFloat((firebaseData.sensor_data.Edel + (Math.random() * 0.1 - 0.05)).toFixed(2));
        firebaseData.sensor_data.Iavg = parseFloat((firebaseData.sensor_data.Iavg + (Math.random() * 0.005 - 0.0025)).toFixed(5));
        firebaseData.sensor_data.Ptot = parseFloat((firebaseData.sensor_data.Ptot + (Math.random() * 0.001 - 0.0005)).toFixed(5));
        firebaseData.sensor_data.V1 = parseFloat((firebaseData.sensor_data.V1 + (Math.random() * 0.2 - 0.1)).toFixed(5));
        firebaseData.sensor_data.V2 = parseFloat((firebaseData.sensor_data.V2 + (Math.random() * 0.2 - 0.1)).toFixed(4));
        firebaseData.sensor_data.V3 = parseFloat((firebaseData.sensor_data.V3 + (Math.random() * 0.2 - 0.1)).toFixed(5));
        firebaseData.sensor_data.Vavg = parseFloat((firebaseData.sensor_data.Vavg + (Math.random() * 0.1 - 0.05)).toFixed(5));
        
        // Update UI
        updateSensorDataTable();
        
        // Update server status
        serverStatus.beban = Math.min(100, Math.max(50, serverStatus.beban + Math.floor(Math.random() * 5 - 2)));
        serverStatus.suhu = Math.min(55, Math.max(35, serverStatus.suhu + Math.floor(Math.random() * 3 - 1)));
        serverStatus.efficiency = Math.min(98, Math.max(85, serverStatus.efficiency + Math.floor(Math.random() * 2 - 1)));
        
        updateServerStatusMetrics();
        
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
        
        // Update charts
        setupVoltageChart();
        setupCurrentChart();
        setupRulesChart();
      }
    }
  }
  
  // Initialize
  function init() {
    debug("Initializing dashboard...");
    
    // Initialize theme
    initializeTheme();
    
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
    
    // Start simulation backup loop
    setInterval(simulateData, 3000);
    
    debug("Dashboard initialized successfully");
  }
  
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', init);