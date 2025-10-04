// app.js - minimal JS to toggle between single date and range inputs
// app.js - minimal JS to toggle between single date and range inputs

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const modeSelect = document.getElementById('modeSelect');
    const singleGroup = document.getElementById('singleDateGroup');
    const rangeGroup = document.getElementById('rangeDateGroup');
    const predictBtn = document.getElementById('predictBtn');
    // Vars
    const startDate = "20000101";
    const endDate = getCurrentDateYYYYMMDD();
    //var latitude = 0.0;
    //var longitude = 0.0;

    let latitude = 45.5;
    let longitude = -73.56;

    const map = L.map('map').setView([latitude, longitude], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
   
     let marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);

     map.on('click', function (e) {
        latitude = e.latlng.lat;
        longitude = e.latlng.lng;
        marker.setLatLng([latitude, longitude]);
    });

    marker.on('dragend', function (e) {
        const pos = marker.getLatLng();
        latitude = pos.lat;
        longitude = pos.lng;
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
        console.log(data);
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

/**
 * Get the current date in YYYYMMDD format.
 * @returns {string} Current date in YYYYMMDD format.
 */
function getCurrentDateYYYYMMDD() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

