// -----------------------------------------------------------------------------
// NASA Weather Prediction - charts.js
// Chart visualization functions using Chart.js
// -----------------------------------------------------------------------------

// Store chart instance globally to destroy old chart before creating new one
let temperatureChart = null;

/**
 * Create a chart visualization of historical temperatures
 * @param {Array} historicalTemps - Array of temperature values
 * @param {Number} predictedTemp - Predicted temperature from regression
 * @param {Number} avgTemp - Average of historical temps
 */
function createTemperatureChart(historicalTemps, predictedTemp, avgTemp) {
    const canvas = document.getElementById('resultsChart');
    const ctx = canvas.getContext('2d');

    // Destroy previous chart if it exists
    if (temperatureChart) {
        temperatureChart.destroy();
    }

    // Create year labels (e.g., 2000-2024 for 25 data points)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = historicalTemps.length - 1; i >= 0; i--) {
        years.push(currentYear - i);
    }

    // Sort temps by year
    const sortedTemps = [...historicalTemps];

    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Historical Temps',
                    data: sortedTemps,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                },
                {
                    label: 'Average',
                    data: Array(years.length).fill(avgTemp),
                    borderColor: 'rgba(255, 206, 86, 0.8)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Predicted (2025)',
                    data: [...Array(years.length - 1).fill(null), predictedTemp],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    borderWidth: 0,
                    pointRadius: 8,
                    pointStyle: 'star'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 11 }
                    }
                },
                title: {
                    display: true,
                    text: 'Temperature Trend',
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: { size: 14 }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

/**
 * Create a histogram chart for date range temperature distribution
 * @param {Array} temps - Array of temperature values
 * @param {Number} avgTemp - Average temperature
 */
function createRangeChart(temps, avgTemp) {
    const canvas = document.getElementById('resultsChart');
    const ctx = canvas.getContext('2d');

    // Destroy previous chart if it exists
    if (temperatureChart) {
        temperatureChart.destroy();
    }

    // Create histogram bins
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const binCount = 10;
    const binSize = (max - min) / binCount;
    const bins = Array(binCount).fill(0);
    const binLabels = [];

    // Create bin labels
    for (let i = 0; i < binCount; i++) {
        const binStart = min + i * binSize;
        const binEnd = binStart + binSize;
        binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
    }

    // Count temps in each bin
    temps.forEach(temp => {
        const binIndex = Math.min(Math.floor((temp - min) / binSize), binCount - 1);
        bins[binIndex]++;
    });

    temperatureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: 'Frequency',
                data: bins,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: `Temperature Distribution (Avg: ${avgTemp.toFixed(1)}°C)`,
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: { size: 14 }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Temperature Range (°C)',
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Count',
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}
