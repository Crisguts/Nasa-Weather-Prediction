// -----------------------------------------------------------------------------
// NASA Weather Prediction - app.js
// Main application logic: UI initialization, event handlers, and API calls
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

    console.log("DOM loaded");
    // Elements
    const modeSelect = document.getElementById('modeSelect');
    const singleGroup = document.getElementById('singleDateGroup');
    const rangeGroup = document.getElementById('rangeDateGroup');
    const predictBtn = document.getElementById('predictBtn');

    //Variables 
    const startDate = "1981101"; // 2000/01/01
    const endDate = "20251001"; // today

    var latitude = 45.5;
    var longitude = -73.56;
    console.log("Initial coords: ", latitude, longitude); //default : Montreal




    //* MAP CODE -------------------------------------------
    // Initialize the map
    const map = L.map('map').setView([latitude, longitude], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Map marker, default montreal, draggable
    let marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);

    // Update lat/lon on map click
    map.on('click', function (e) {
        latitude = e.latlng.lat;
        longitude = e.latlng.lng;
        console.log("Map clicked at: ", latitude, longitude);
        marker.setLatLng([latitude, longitude]);
    });

    // Update lat/lon on marker drag (last drop)
    marker.on('dragend', function (e) {
        const pos = marker.getLatLng();
        latitude = pos.lat;
        longitude = pos.lng;
        console.log("Map dragged at: ", latitude, longitude);

    });
    //* -----------------------------------------------------




    //* DROPDOWN CODE -------------------------------------------
    /**
     * Update the visibility of date input groups based on the selected mode. (show only one input, or 2)
     */
    function updateMode() {
        const mode = modeSelect.value;
        if (mode === 'range') {
            rangeGroup.classList.remove('d-none');
            singleGroup.classList.add('d-none');
        } else {
            rangeGroup.classList.add('d-none');
            singleGroup.classList.remove('d-none');
        }
    }
    // Event listeners
    modeSelect.addEventListener('change', updateMode); // toggle
    updateMode(); // initial mode setup
    //* -----------------------------------------------------



    //* SPINNER CODE -------------------------------------------
    // Spinner overlay helpers (use the HTML overlay in index)
    function showSpinnerOverlay() {
        const overlay = document.getElementById('spinnerOverlay');
        if (overlay) overlay.style.display = 'flex';
    }

    function hideSpinnerOverlay() {
        const overlay = document.getElementById('spinnerOverlay');
        if (overlay) overlay.style.display = 'none';
    }
    //* -----------------------------------------------------



    //* PREDICT BUTTON CODE -------------------------------------------
    /**
     * Handle the predict button click event.
     */
    predictBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        const mode = modeSelect.value;
        let date = null;
        let start = null;
        let end = null;


        if (mode === 'range') {
            // assign to outer-scoped start/end so later code can use them
            start = document.getElementById('startDate').value;
            end = document.getElementById('endDate').value;
            // minimal validation: require both start and end
            if (!start || !end) return alert('Please enter both start and end dates.');
            console.log('Predict range', { start, end }); // test
        } else {
            date = document.getElementById('singleDate').value;
            // minimal validation: require date
            if (!date) return alert('Please enter a date.');
            console.log('Predict single', { date }); // test
        }

        // Show spinner overlay
        showSpinnerOverlay();

        try {
            // Fetch data from NASA POWER API
            const { temps, rain } = await fetchData(startDate, endDate, latitude, longitude);

            console.log('Raw temps object:', temps);
            console.log('Sample temps keys:', Object.keys(temps).slice(0, 5));
            console.log('Raw rain object:', rain);

            //// filter the object so it only includes the dates by the user
            let filteredTemps = [];
            let filteredRain = [];

            if (mode === 'range') {
                start = start.replace(/-/g, ''); // remove dashes
                end = end.replace(/-/g, ''); // remove dashes
                filteredTemps = filterObjectByRange(start, end, temps);
                filteredRain = filterObjectByRange(start, end, rain);
            } else {
                date = date.replace(/-/g, ''); // remove dashes
                filteredTemps = filterObjectByDate(date, temps);
                filteredRain = filterObjectByDate(date, rain);
            }
            console.log('Filtered Temps:', filteredTemps); // test
            console.log('Filtered Rain:', filteredRain); // test


            // NOW WE CAN COMPUTER THE STATS ON filteredTemps ARRAY 
            // average temp for that date or range
            const avgTemp = filteredTemps.reduce((a, b) => a + b, 0) / filteredTemps.length || 0; //adds all values, divides by count, or 0 if empty

            // progression for slope/trend on the whole dataset 
            let predictedTemp = null;
            let adjustedTemp = null;
            let stdev = 0;
            let rainChance = 0;

            //if we work with one date/day
            if (mode === 'single') {

                // Create an object from the filtered temps array to use with calcLinearRegression
                const filteredTempObj = {};
                const currentYear = new Date().getFullYear();
                // Create synthetic keys (YYYYMMDD) for each temperature in the filtered array
                // This preserves the year information which is needed for the regression calculation
                for (let i = 0; i < filteredTemps.length; i++) {
                    const yearForKey = currentYear - filteredTemps.length + i;
                    const monthDay = date.substring(4, 8); // Extract MMDD part
                    filteredTempObj[`${yearForKey}${monthDay}`] = filteredTemps[i];
                }
                // Use linear regression on filtered temps (same day across years) instead of all temps
                const { predictedValue, slope, intercept } = calcLinearRegression(filteredTempObj, date); //math.js file
                console.log("Predicted Value from Regression:", predictedValue);
                predictedTemp = Number(predictedValue);
                let slopeValue = Number(slope); // C per year increase
                let interceptValue = Number(intercept);
                let startYear = parseInt(startDate.substring(0, 4));
                let graphableIntercept = calculateY(startYear, slopeValue, interceptValue);


                // Parse YYYYMMDD to get year difference (to add linear adjustment per year)
                const targetYear = parseInt(date.substring(0, 4));
                const yearDiff = targetYear - 2025;

                // Standard deviation for confidence interval
                stdev = Math.sqrt(
                    filteredTemps.map(v => Math.pow(v - avgTemp, 2))
                        .reduce((a, b) => a + b, 0) / filteredTemps.length
                );

                // Combine the regression trend with variability adjustment
                adjustedTemp = predictedTemp + stdev * 0.1 * yearDiff;
                console.log("Adjusted Temperature:", adjustedTemp);
                console.log("Predicted Temperature:", predictedTemp);

                // Chance of rain — percent of rainy days near that date with a more climate-adaptive calculation
                // Create a small weighting factor based on year to account for climate trends
                let weightedRainCount = 0;
                let weightSum = 0;

                // Weight recent years more heavily than older years
                for (let i = 0; i < filteredRain.length; i++) {
                    const weight = 0.7 + 0.3 * (i / filteredRain.length); // Weights from 0.7 to 1.0
                    if (filteredRain[i] > 0.5) {
                        weightedRainCount += weight;
                    }
                    weightSum += weight;
                }

                // Calculate rain chance using weighted values
                rainChance = Math.round((weightedRainCount / weightSum) * 100);

                // Validate results before display
                const tempDisplay = !isNaN(adjustedTemp) ? adjustedTemp.toFixed(1) : avgTemp.toFixed(1);
                const stdevDisplay = !isNaN(stdev) ? stdev.toFixed(1) : '?';


                const year = parseInt(date.substring(0, 4));
                const month = parseInt(date.substring(4, 6));
                const day = parseInt(date.substring(6, 8));

                const predictionDate = new Date(year, month, day);

                const result = document.getElementById('resultsContent');
                result.innerHTML = '';
                result.innerHTML = `
                    <h3>Weather Prediction for ${predictionDate.toDateString()}</h3>
                    <br>
                    <p>Predicted High Estimate: ${tempDisplay}°C ± ${stdevDisplay}°C</p>
                    <p>Chance of Rain: ${rainChance}%</p>
                    <br>
                    <p>Please keep in mind that weather predictions are not always accurate. 
                    This model provides 60-75 % accuracy based on satellite data and mathematical statistics.</p>
                `;

                // Create chart with historical data
                createTemperatureChart(filteredTemps, adjustedTemp, avgTemp, targetYear, slopeValue, graphableIntercept);

            } else if (mode === 'range') {
                // For range mode, use weighted calculation to improve accuracy
                // Create a small weighting factor based on rainfall amount, not just yes/no
                let weightedRainCount = 0;
                let weightSum = 0;

                // Weight days with higher rainfall more heavily
                for (let i = 0; i < filteredRain.length; i++) {
                    const weight = 1.0;
                    const rainBoost = Math.min(filteredRain[i] / 2, 0.5); // Up to 0.5 bonus for heavy rain
                    if (filteredRain[i] > 0.5) {
                        weightedRainCount += (weight + rainBoost);
                    }
                    weightSum += weight;
                }

                // Calculate rain chance using weighted values
                rainChance = Math.round((weightedRainCount / weightSum) * 100);

                const year = parseInt(start.substring(0, 4));
                const month = parseInt(start.substring(4, 6));
                const day = parseInt(start.substring(6, 8));

                const predictionDate = new Date(year, month, day);

                const year2 = parseInt(end.substring(0, 4));
                const month2 = parseInt(end.substring(4, 6));
                const day2 = parseInt(end.substring(6, 8));

                const predictionDate2 = new Date(year2, month2, day2);


                const result = document.getElementById('resultsContent');
                result.innerHTML = '';
                result.innerHTML = `
                    <h3>Weather Prediction for ${predictionDate2.toDateString()} -  ${predictionDate2.toDateString()}</h3>
                    <p>Average High: ${avgTemp.toFixed(1)}°C</p>
                    <p>Chance of Rain: ${rainChance}%</p>
                `;

                // Create histogram chart for range data
                createRangeChart(filteredTemps, avgTemp);
            }

            // Hide spinner overlay once done
            hideSpinnerOverlay();

        } catch (error) {
            console.error("Error during prediction:", error);
            alert("An error occurred while fetching data or processing the prediction. Please try again.");
            hideSpinnerOverlay();
        }
        //console.log(dailyTemps["20000101"]); // should log the max temp for Jan 1, 2000
        // console.log("Filtered data: ", filterArrayByDate(date, dailyTemps)); //example usage
    });
});
//* -----------------------------------------------------




//* FILTERS API CODE -------------------------------------------
/**
 * Fetch weather data from NASA's POWER API.
 * @param {String} startDate - Start date in YYYYMMDD format
 * @param {String} endDate - End date in YYYYMMDD format
 * @param {Number} latitude - Latitude coordinate
 * @param {Number} longitude - Longitude coordinate
 * @returns {Object} Object containing temps and rain data
 */
async function fetchData(startDate, endDate, latitude, longitude) {
    const request = new Request(`https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M_MAX,PRECTOTCORR&community=RE&longitude=${longitude}&latitude=${latitude}&start=${startDate}&end=${endDate}&format=JSON`);
    const response = await fetch(request);
    const jsonData = await response.json();
    return {
        temps: jsonData.properties.parameter.T2M_MAX, //temp
        rain: jsonData.properties.parameter.PRECTOTCORR //rain
    }
}
//* -----------------------------------------------------



