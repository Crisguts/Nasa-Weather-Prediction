# 🌍 NASA Weather Prediction Tool

> **2025 NASA Space Apps Challenge: "Will It Rain On My Parade?"**

A web-based climate prediction tool that forecasts temperatures and precipitation for any future date and location on Earth using 25 years of NASA satellite data.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://crisguts.github.io/Nasa-Weather-Prediction/) 
[![NASA POWER API](https://img.shields.io/badge/NASA-POWER%20API-blue)](https://power.larc.nasa.gov/)

---

## 🎯 The Problem

Traditional weather forecasts are limited to 10-14 days. But what if you're planning a wedding in 6 months, a hiking trip next summer, or need to schedule an outdoor event? You need long-range climate insights that go beyond standard forecasts.

## 💡 Our Solution

We built a statistical climate prediction tool that combines **historical data analysis** with **climate trend detection** to provide temperature and precipitation estimates for any future date and location. All math!

### Key Features

- 🗺️ **Interactive Map** - Click anywhere on Earth to select your location
- 📅 **Flexible Date Selection** - Single date or date range predictions
- 📊 **Visual Analytics** - Historical data charts with trend lines
- 🌡️ **Climate-Aware Predictions** - Accounts for warming/cooling trends
- ⚡ **Fast & Responsive** - Runs entirely in your browser
- 🌧️ **Rain Probability** - Historical precipitation likelihood

---

## 🔬 How It Works

### The Statistical Approach

When we started, we thought we'd just calculate historical averages. But the mentors at the hackathon told us that wouldn't account for climate change trends. We needed machine learning... but we less than a day and no ML experience. Normally we would attempt anyways, but we wanted to have a working project without having to worry about lacking knowledge.

**Our solution:** Use **linear regression** - a statistical method we already understood from CS coursework.

### The Process

1. **Fetch NASA Data** 🛰️
   - Pull 25 years (2000-2025) of daily temperature and precipitation data
   - Uses NASA's POWER API (Prediction Of Worldwide Energy Resources)
   - ~9,400 data points per location

2. **Filter Historical Data** 📆
   - For single dates: Extract the same calendar day across all years
   - Example: Get every October 12th from 2000-2024 (25 values)
   - For date ranges: Extract all matching days across all years

3. **Calculate Statistics** 📈
   - Compute mean and standard deviation from filtered data
   - Shows historical variability and typical range

4. **Detect Climate Trends** 🌡️
   - Run linear regression on the entire 25-year dataset
   - Calculate slope (°C per year) to detect warming/cooling
   - Formula: `y = mx + b` where m = trend, b = baseline

5. **Generate Prediction** 🎯
   - Combine historical average with trend projection
   - Adjust for time distance from present
   - Formula: `prediction = trend(targetYear) + variability`

6. **Visualize Results** 📊
   - Plot historical data points with trend line
   - Show predicted value for target date
   - Display temperature distribution histogram for ranges

---

## 🛠️ Technical Stack

### Frontend
- **Vanilla JavaScript** - No frameworks, kept it simple and fast
- **HTML5 & CSS3** - Responsive glassmorphism design
- **Bootstrap 5.3** - Layout and responsive grid

### APIs & Libraries
- **NASA POWER API** - 25 years of satellite climate data
- **Leaflet.js** - Interactive map with OpenStreetMap tiles
- **Chart.js** - Data visualization (line & histogram charts)


### Key Algorithms

**Linear Regression (OLS)**
```javascript
slope = Σ[(x - x̄)(y - ȳ)] / Σ[(x - x̄)²]
intercept = ȳ - slope × x̄
prediction = slope × targetYear + intercept
```

**Standard Deviation**
```javascript
stdev = √(Σ(value - mean)² / n)
```

---


## 📖 Usage

### Single Date Prediction

1. **Select a location** by clicking on the map or dragging the marker
2. **Choose "Single date"** mode from the dropdown
3. **Pick a date** (any future date)
4. **Click "Predict"** to see:
   - Predicted temperature with confidence interval
   - Rain probability based on historical data
   - Chart showing historical temps and trend line

### Date Range Prediction

1. **Select a location** on the map
2. **Choose "Date range"** mode
3. **Pick start and end dates** (e.g., Oct 22 - Oct 31)
4. **Click "Predict"** to see:
   - Average temperature for that period
   - Rain probability
   - Temperature distribution histogram

---

## 📊 Example Results

**Single Date: October 12, 2026 in Montreal**
```
Predicted High: 15.8°C ± 3.6°C
Chance of Rain: 32%
Trend: +0.08°C per year (warming)
```

**Date Range: October 22-31, 2026 in Montreal**
```
Average High: 10.2°C
Chance of Rain: 35%
Data points: 250 (10 days × 25 years)
```

---

### !!! Limitations
- **Not a weather forecast** - Predicts climate patterns, not specific weather
- **Linear assumptions** - Assumes trends continue linearly (climate is complex)
- **No seasonal cycles** - Doesn't model El Niño, La Niña, etc.
- **Limited to 25 years** - Dataset starts in 2000
- **Data gaps** - Some remote locations may have sparse data

---

## 🏆 Hackathon Journey

### The Pivot

**Initial Idea:** Just calculate historical averages
→ **Problem:** Mentors told us this ignores climate change
→ **Suggested:** Use machine learning models
→ **Reality Check:** We had 48 hours and no ML experience
→ **Solution:** Statistical approach with OLS regression

---

## 👥 Team


- GitHub: [@Crisguts](https://github.com/Crisguts)
**Cristian** - 
- GitHub: [@florencekn](https://github.com/florencekn)
**Florence** -
- GitHub: [@Nicho-Roy](https://github.com/Nicho-Roy)
**Nick** -
- GitHub: [@The842](https://github.com/The84)
**Mahima** -

Built for the **2025 NASA Space Apps Challenge**

---

## 📚 Data Sources

- **NASA POWER API** - [https://power.larc.nasa.gov/](https://power.larc.nasa.gov/)
  - Parameters: T2M_MAX (daily max temperature), PRECTOTCORR (precipitation)
  - Coverage: Global, 2000-present
  - Resolution: Daily, 0.5° × 0.625°

---

## 🙏 Acknowledgments

- **NASA POWER Team** - For providing free, high-quality climate data
- **Space Apps Challenge** - For the inspiration and platform
- **Mentors & Experts** - For guiding our statistical approach
- **OpenStreetMap** - For map tiles
- **Chart.js & Leaflet.js** - For excellent open-source libraries

---


<div align="center">

**Made with ❤️ for the 2025 NASA Space Apps Challenge**

⭐ Star this repo if you found it useful!

• [View Demo](https://crisguts.github.io/Nasa-Weather-Prediction/) • 

<sub><sup>This README was autogenerated.</sup></sub>
</div>
