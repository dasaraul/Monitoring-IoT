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
  
  // Chart objects with global configuration for light/dark mode
  Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-main');
  Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--table-border');
  
  let voltageChart;
  let currentChart;
  let rulesChart;
  
  // Update chart colors based on current theme
  function updateChartColors() {
    // Update Chart.js global defaults with current theme colors
    Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-main');
    Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--table-border');
  }
  
  // Set up voltage chart with smooth animations
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
        animation: {
          duration: 1000, // Longer, smoother animation
          easing: 'easeOutQuart' // Smoother easing function
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
  
  // Set up current chart with smooth animations
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
        animation: {
          duration: 1000, // Longer, smoother animation
          easing: 'easeOutQuart' // Smoother easing function
        },
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
  
  // Set up rules chart with smooth animations
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
        animation: {
          duration: 800, // Smoother animation
          easing: 'easeOutQuart'
        },
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
  

  //chart js ini untuk memvisualisasi grafik 