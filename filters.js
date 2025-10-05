// -----------------------------------------------------------------------------
// NASA Weather Prediction - filters.js
// Data filtering functions for date ranges and historical data
// -----------------------------------------------------------------------------

/**
 * Filter the dailyTemps object to return an array of temps matching the month and day of the given date, across all years.
 * @param {String} date - Date in YYYYMMDD format
 * @param {Object} dailyTemps - Object with YYYYMMDD keys and temperature values
 * @returns {Array} Array of temperature values matching the target month/day
 */
function filterObjectByDate(date, dailyTemps) {
    const filteredTemps = [];
    // Parse YYYYMMDD string - we only care about month and day, not year
    const targetMonth = parseInt(date.substring(4, 6)) - 1; // JS months 0-11
    const targetDay = parseInt(date.substring(6, 8));

    console.log(`filterObjectByDate: target=${date}, month=${targetMonth + 1}, day=${targetDay}`);

    let matchCount = 0;
    for (const key in dailyTemps) {
        const month = parseInt(key.substring(4, 6)) - 1;
        const day = parseInt(key.substring(6, 8));

        // Match same month and day across all years
        if (month === targetMonth && day === targetDay) {
            matchCount++;
            filteredTemps.push(dailyTemps[key]);
        }
    }
    console.log(`filterObjectByDate: found ${matchCount} matches out of ${Object.keys(dailyTemps).length} total entries`);
    return filteredTemps;
}

/**
 * Filter temps for a given month/day range (e.g. Aug 1–Aug 10) across all years of the dataset.
 * @param {String} start - Start date in YYYYMMDD format
 * @param {String} end - End date in YYYYMMDD format
 * @param {Object} dailyTemps - Object with YYYYMMDD keys and temperature values
 * @returns {Array} Array of temperature values within the date range
 */
function filterObjectByRange(start, end, dailyTemps) {
    const filtered = [];

    // Parse YYYYMMDD strings into Date components
    const startMonth = parseInt(start.substring(4, 6)) - 1;
    const startDay = parseInt(start.substring(6, 8));
    const endMonth = parseInt(end.substring(4, 6)) - 1;
    const endDay = parseInt(end.substring(6, 8));

    for (const key in dailyTemps) {
        const year = parseInt(key.substring(0, 4));
        const month = parseInt(key.substring(4, 6)) - 1;
        const day = parseInt(key.substring(6, 8));

        // compare only month/day ignoring year
        const current = new Date(2000, month, day);
        const startMD = new Date(2000, startMonth, startDay);
        const endMD = new Date(2000, endMonth, endDay);

        if (current >= startMD && current <= endMD) {
            filtered.push(dailyTemps[key]);
        }
    }

    return filtered;
}
