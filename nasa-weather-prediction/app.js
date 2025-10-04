// app.js - minimal JS to toggle between single date and range inputs
// app.js - minimal JS to toggle between single date and range inputs

document.addEventListener('DOMContentLoaded', function () {
    const modeSelect = document.getElementById('modeSelect');
    const singleGroup = document.getElementById('singleDateGroup');
    const rangeGroup = document.getElementById('rangeDateGroup');
    const predictBtn = document.getElementById('predictBtn');

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



    predictBtn.addEventListener('click', function (e) {
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
    });
});
