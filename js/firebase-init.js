//firebase-init ini untuk keperluan configurasi database dari firebase itu sendiri


// Debug function untuk membantu troubleshooting
const debugConsole = document.getElementById('debug-console');
    
function debug(message) {
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
  
  debugConsole.innerHTML += `<div>[${timeString}] ${message}</div>`;
  // Scroll to bottom
  debugConsole.scrollTop = debugConsole.scrollHeight;
  
  // Log to browser console as well
  console.log(`[${timeString}] ${message}`);
}

// Toggle debug console with Ctrl+Shift+D
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    debugConsole.classList.toggle('active');
  }
});

// Konfigurasi Firebase
const firebaseConfig = {
  databaseURL: "https://monitoringiotdashboard-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

//keperluan kodingan pada line 25 untuk data dinamis (auto update)

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

debug("Firebase initialized with URL: " + firebaseConfig.databaseURL);

//kalau line 38 ini lebih ke dummy, jadi misal server mati/down maka akan ada data statis nya

// Objek untuk menyimpan data
let firebaseData = {
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

// Event listener untuk status koneksi Firebase
database.ref('.info/connected').on('value', (snap) => {
  if (snap.val() === true) {
    connectionIndicator.classList.remove('connecting');
    connectionIndicator.classList.remove('disconnected');
    connectionIndicator.classList.add('connected');
    connectionText.textContent = 'Terhubung';
    debug("Connected to Firebase Realtime Database");
  } else {
    connectionIndicator.classList.remove('connected');
    connectionIndicator.classList.add('disconnected');
    connectionIndicator.classList.remove('connecting');
    connectionText.textContent = 'Terputus';
    debug("Disconnected from Firebase");
  }
});

// Listener untuk sensor_data dari Firebase
database.ref('sensor_data').on('value', (snapshot) => {
  const data = snapshot.val();
  debug("Received sensor data update from Firebase");
  
  if (data) {
    // Update local data
    firebaseData.sensor_data = data;
    
    // Update UI if data status is DINAMIS
    if (serverStatus.dataStatus === 'DINAMIS') {
      updateSensorDataTable();
      
      // Update metrics simulation based on sensor data
      serverStatus.beban = Math.min(100, Math.max(50, 60 + Math.floor(data.Ptot * 1000)));
      serverStatus.suhu = Math.min(55, Math.max(35, 40 + Math.floor(data.Iavg * 100)));
      serverStatus.efficiency = Math.min(98, Math.max(85, 95 - Math.floor(data.Ptot * 100)));
      
      updateServerStatusMetrics();
      
      // Get current time for history data
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      // Update voltage history
      voltageHistory.push({
        time: timeStr,
        V1: data.V1,
        V2: data.V2,
        V3: data.V3
      });
      
      if (voltageHistory.length > 10) {
        voltageHistory.shift();
      }
      
      // Update current history
      currentHistory.push({
        time: timeStr,
        Iavg: data.Iavg,
        Power: data.Ptot * 1000
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
});

// Listener untuk perubahan pada seluruh data dari Firebase
database.ref('/').on('value', (snapshot) => {
  const data = snapshot.val();
  debug("Received full data update from Firebase");
  
  if (data) {
    // Preserve sensor_data from the dedicated listener for more responsive updates
    const currentSensorData = firebaseData.sensor_data;
    
    // Update local data object, merging with sensor data that might be more recent
    if (data.sensor_data) {
      firebaseData = {
        ...data,
        sensor_data: currentSensorData
      };
    } else {
      // If sensor_data missing in full update, use current
      firebaseData = {
        ...data,
        sensor_data: currentSensorData
      };
    }
    
    // Only update non-critical UI components to avoid too many refreshes
    if (analyticsContent.style.display !== 'none') {
      initServerInfo();
      initAlertsTable();
      initPowerHourTable();
      setPowerMetrics();
      setAllData();
    }
  }
});