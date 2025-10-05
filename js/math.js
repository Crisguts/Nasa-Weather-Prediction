// -----------------------------------------------------------------------------
// NASA Weather Prediction - math.js
// Mathematical and statistical functions for climate predictions
// -----------------------------------------------------------------------------



/**
 * Calculate linear regression for the given data and search date.
 * Example: If the trend is +0.08°C/year and historical average is 15°C, by 2026 it predicts 15.08°C
 * 
 * @param {Object} data - Object with YYYYMMDD keys and temperature values
 * @param {String} searchStringDate - Target date in YYYYMMDD format
 * @returns {Number} Predicted temperature value
 */
function calcLinearRegression(data, searchStringDate) { //data being all temps from 2000-2025
    const { x, y } = extractXY(data); //x years and y temps arrays

    // Extract year from YYYYMMDD search date
    const searchYear = parseInt(searchStringDate.substring(0, 4));
    console.log("Search year:", searchYear);


    // Compute Linear Regression (slope + intercept)
    const { slope, intercept } = linearRegression(x, y);
    console.log("Slope (°C/year):", slope);
    console.log("Intercept:", intercept);
    console.log("Search year:", searchYear);

    // Predict from search year
    const predictedValue = slope * searchYear + intercept;
    console.log(`Predicted value for ${searchStringDate} (year ${searchYear}):`, predictedValue);

    return { predictedValue, slope, intercept };
}

function linearRegression(x, y) {
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b) / n;
    const meanY = y.reduce((a, b) => a + b) / n;

    let num = 0;
    let den = 0;

    for (let i = 0; i < n; i++) {
        num += (x[i] - meanX) * (y[i] - meanY);
        den += (x[i] - meanX) ** 2;
    }

    const m = num / den;
    const b = meanY - m * meanX;

    return { slope: m, intercept: b }; // slope is how steep the trend is, C per year, intercept is where it crosses Y axis
}

/**
 * Calculate the y value for a given x value using the linear equation y = mx + b.
 * @param {Number} x - The x coordinate.
 * @param {Number} slope - The slope of the line.
 * @param {Number} intercept - The y-intercept of the line.
 * @returns {Number} The calculated y value.
 */
function calculateY(x, slope, intercept) {
    return slope * x + intercept;
}

/**
 * Extract X and Y values from the data object for linear regression.
 * @param {Object} dataObj - Object with YYYYMMDD keys and values
 * @returns {Object} Object containing x (years) and y (values) arrays
 */
function extractXY(dataObj) {
    const x = [];
    const y = [];

    for (const [key, value] of Object.entries(dataObj)) {
        // Parse YYYYMMDD string - use year as X value for slope in °C/year
        const year = parseInt(key.substring(0, 4), 10);

        x.push(year); // year for regression (slope will be °C/year)
        y.push(value);
    }

    return { x, y };
}
