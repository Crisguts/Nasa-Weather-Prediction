// app.js - minimal JS to toggle between single date and range inputs
// app.js - minimal JS to toggle between single date and range inputs

document.addEventListener('DOMContentLoaded', function () {
    const data = {
    20000202: -12.49,
    20000203: -14.06,
    20000204: -11.72,
    20000205: -6,
    20000206: -3.75,
    20000207: -3.82,
    20000208: -8.84,
    20000209: 0.76
    };

    calcLinearRegression(data, "2000-02-02");

    console.log("DOM loaded");
    // Elements
    const modeSelect = document.getElementById('modeSelect');
    const singleGroup = document.getElementById('singleDateGroup');
    const rangeGroup = document.getElementById('rangeDateGroup');
    const predictBtn = document.getElementById('predictBtn');
    // Vars
    const startDate = "20000101"; // 2000/01/01
    //const endDate = getCurrentDateYYYYMMDD(); // today
    const endDate = "20251001"; // today

    var latitude = 45.5;
    var longitude = -73.56;
    console.log("Initial coords: ", latitude, longitude);

    // Initialize the map
    const map = L.map('map').setView([latitude, longitude], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);


    let marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);

    // Update lat/lon on map click
    map.on('click', function (e) {
        latitude = e.latlng.lat;
        longitude = e.latlng.lng;
        console.log("Map clicked at: ", latitude, longitude);
        marker.setLatLng([latitude, longitude]);
    });

    // Update lat/lon on marker drag end
    marker.on('dragend', function (e) {
        const pos = marker.getLatLng();
        latitude = pos.lat;
        longitude = pos.lng;
        console.log("Map dragged at: ", latitude, longitude);

    });

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


    /**
     * Handle the predict button click event.
     */
    predictBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        const mode = modeSelect.value;

        //

        if (mode === 'range') {
            const start = document.getElementById('startDate').value;
            const end = document.getElementById('endDate').value;
            console.log('Predict range', { start, end });
            alert(`Predict for range:\nStart: ${start || '(empty)'}\nEnd: ${end || '(empty)'}`);
        } else {
            const date = document.getElementById('singleDate').value;
            console.log('Predict single', { date });
            alert(`Predict for date:\n${date || '(empty)'}`);
        }
        const data = await fetchData(startDate, endDate, latitude, longitude);
        const dailyTemps = data.properties.parameter.T2M_MAX;
        console.log("test");
        ////filter the array so it only includes the dates by the user
        // if (mode === 'range') then filter by start and end
        // if single then we filter by date (for example, we ignore the year, and get all values for that month and day, across all years)


        console.log(dailyTemps);

        console.log(data);
        console.log(dailyTemps["20000101"]); // should log the max temp for Jan 1, 2000

    });
});



/**
 * Fetch weather data from NASA's POWER API.
 * @param {*} startDate 
 * @param {*} endDate 
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns 
 */
async function fetchData(startDate, endDate, latitude, longitude) {
    const request = new Request(`https://power.larc.nasa.gov/api/temporal/daily/point?start=${startDate}&end=${endDate}&latitude=${latitude}&longitude=${longitude}&parameters=T2M_MAX&community=RE&format=JSON`);
    const response = await fetch(request);
    const jsonData = await response.json();
    // console.log(jsonData);
    return jsonData;
}



function calcLinearRegression(data, searchStringDate) {

    const { x, y } = extractXY(data);

    // Convert search date
    const searchDate = new Date(searchStringDate);
    const searchX = searchDate.getTime();
    console.log("Search date (epoch):", searchX);

    // Convert dates to numeric (epoch time)
    //const x = dates.map(d => d.getTime()); // milliseconds since Jan 1, 1970

    // Compute Linear Regression (slope + intercept)
    function linearRegression(x, y) {
    const n = x.length;
    const meanX = x.reduce((a,b) => a+b) / n;
    const meanY = y.reduce((a,b) => a+b) / n;

    let num = 0;
    let den = 0;

    for (let i = 0; i < n; i++) {
        num += (x[i] - meanX) * (y[i] - meanY);
        den += (x[i] - meanX) ** 2;
    }

    const m = num / den;
    const b = meanY - m * meanX;

    return { slope: m, intercept: b };
    }

    const { slope, intercept } = linearRegression(x, y);
    console.log("Slope:", slope);
    console.log("Intercept:", intercept);

    // Predict from search date
    const predictedValue = slope * searchX + intercept;
    console.log(`Predicted value for ${searchStringDate}:`, predictedValue);

    return predictedValue;
}





function extractXY(dataObj) {
  const x = [];
  const y = [];

  for (const [key, value] of Object.entries(dataObj)) {
    // Parse YYYYMMDD string into a Date
    const year = parseInt(key.substring(0, 4), 10);
    const month = parseInt(key.substring(4, 6), 10) - 1; // JS months = 0-11
    const day = parseInt(key.substring(6, 8), 10);

    const date = new Date(year, month, day);

    x.push(date.getTime()); // numeric for regression
    y.push(value);
  }

  return { x, y };
}


function linearRegressionTest() {
    const y = [1.0, 2.0, 3.5, 4.2]; // floats
    const dates = [
    new Date("2020-01-01"),
    new Date("2020-01-10"),
    new Date("2020-01-20"),
    new Date("2020-02-01")
    ];

    //test search values
    const searchDate = new Date("2020-01-15");
    //const searchDate = new Date("2020-03-20");
    const searchX = searchDate.getTime();
    console.log("Search date (epoch):", searchX);


    //1. Convert dates to numeric (epoch time)
    const x = dates.map(d => d.getTime()); // milliseconds since Jan 1, 1970

    //2. Compute Linear Regression (slope + intercept)
    function linearRegression(x, y) {
    const n = x.length;
    const meanX = x.reduce((a,b) => a+b) / n;
    const meanY = y.reduce((a,b) => a+b) / n;

    let num = 0;
    let den = 0;

    for (let i = 0; i < n; i++) {
        num += (x[i] - meanX) * (y[i] - meanY);
        den += (x[i] - meanX) ** 2;
    }

    const m = num / den;
    const b = meanY - m * meanX;

    return { slope: m, intercept: b };
    }

    const { slope, intercept } = linearRegression(x, y);
    console.log("Slope:", slope);
    console.log("Intercept:", intercept);


    //3. Predict & Convert Back to Dates
    function predict(date) {
        const xVal = date.getTime();
        return slope * xVal + intercept;
    }

    // Example: predict for Feb 15, 2020
    const pred = predict(new Date("2020-01-30"));
    console.log("Prediction:", pred);

    // Convert back into date objects for plotting or display
    // const predictedDates = yPred.map(val => new Date(val));
    // console.log(predictedDates);
}






    // //4. Plott with chart js
    // const data = {
    // datasets: [
    //     {
    //     label: "Data",
    //     data: x.map((xi, i) => ({ x: xi, y: dates[i] })),
    //     showLine: false,
    //     pointBackgroundColor: "blue"
    //     },
    //     {
    //     label: "Regression Line",
    //     data: x.map((xi, i) => ({ x: xi, y: predictedDates[i] })),
    //     borderColor: "red",
    //     showLine: true,
    //     fill: false
    //     }
    // ]
    // };





// /**
//  * Get the current date in YYYYMMDD format.
//  * @returns {string} Current date in YYYYMMDD format.
//  */
// function getCurrentDateYYYYMMDD() {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
//     const day = String(now.getDate()).padStart(2, '0');
//     return `${year}${month}${day}`;
// }

