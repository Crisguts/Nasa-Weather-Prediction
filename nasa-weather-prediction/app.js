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
    var latitude = 0.0;
    var longitude = 0.0;

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

    modeSelect.addEventListener('change', updateMode);
    updateMode(); // initial



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



async function fetchData(startDate, endDate, latitude, longitude) {
  const request = new Request(`https://power.larc.nasa.gov/api/temporal/daily/point?start=${startDate}&end=${endDate}&latitude=${latitude}&longitude=${longitude}&parameters=T2M_MAX&community=RE&format=JSON`);
  const response = await fetch(request);
  const jsonData = await response.json();
  // console.log(jsonData);
  return jsonData;

}

function getCurrentDateYYYYMMDD() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}