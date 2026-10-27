# 🌱 WattWise Campus

### Making Every Watt Count on Campus

WattWise Campus is a web-based campus energy awareness dashboard that helps users estimate electricity consumption, understand electricity costs, explore potential savings, and identify appliances with high energy usage.

**🚀 Live Demo:** https://watt-wise-campus.vercel.app/

**💻 GitHub Repository:** https://github.com/adityapatel7958-cell/WattWise-Campus

---

## 🎯 Problem Statement

Electricity is used throughout campuses in hostels, classrooms, offices, and other facilities. However, users may not always understand how individual appliances contribute to energy consumption and electricity expenses.

WattWise Campus aims to make appliance-level energy estimates easier to understand and help users explore practical opportunities to reduce electricity usage.

## 💡 Our Solution

WattWise Campus converts appliance specifications and usage information into estimated electricity consumption, costs, and associated carbon emissions.

Users can adjust appliance inputs, compare usage scenarios, and review rule-based alerts for appliances that may deserve attention.

## ✨ Key Features

### 1. Energy Overview
View estimated daily and monthly electricity consumption, electricity costs, and potential savings.

### 2. Appliance Calculator
Enter appliance power ratings, quantities, and daily operating hours to estimate energy consumption.

### 3. Savings Simulator
Explore how changes in electricity usage may affect estimated energy consumption and costs.

### 4. Carbon Footprint
Estimate carbon emissions associated with electricity consumption using an assumed emissions factor.

### 5. Energy Waste Detector
Identify appliances that meet predefined high-usage thresholds and review suggestions for more efficient usage.

### 6. Editable Appliance Inputs
Adjust appliance specifications and usage hours to explore updated estimates.

### 7. CSV Report Export
Export available energy estimate data for further review.

## ⚙️ How It Works

The application uses appliance information supplied by the user to calculate estimated energy consumption.

**Energy consumption formula:**

Energy (kWh) = Power (W) × Quantity × Hours per day ÷ 1000

Estimated electricity cost is calculated using energy consumption and the selected electricity tariff.

Carbon emissions are estimated using an assumed emissions factor.

The Energy Waste Detector uses predefined rules to flag appliances with high estimated daily consumption or long operating hours.

## 🛠️ Technology Stack

- React
- Vite
- JavaScript
- HTML
- CSS
- Git and GitHub
- Vercel for deployment

## 🚀 Getting Started

### Prerequisites

Install the following before running the project locally:

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/adityapatel7958-cell/WattWise-Campus.git
```

Navigate into the project directory:

```bash
cd WattWise-Campus
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to view the application.

### Production Build

To create a production build, run:

```bash
npm run build
```

Vite generates the production files in the `dist` directory.

## 🔍 Approach and Known Limitations

### Approach

- Use appliance power ratings, quantities, and operating hours to estimate electricity consumption.
- Calculate estimated costs using an assumed electricity tariff.
- Estimate associated carbon emissions using an assumed emissions factor.
- Apply rule-based thresholds to flag appliances for review.
- Allow users to adjust inputs and explore alternative usage scenarios.

### Known Limitations

- Results depend on the accuracy of user-provided appliance information.
- Electricity tariffs and carbon emissions factors may vary by location and over time.
- Waste detection is rule-based and does not prove that an appliance is actually wasting energy.
- Potential savings are estimates, not verified reductions in electricity consumption or bills.
- The current application does not connect to real-time campus electricity meters or IoT devices.
- The application should not be interpreted as a substitute for measured energy-consumption data.

## 🔮 Future Improvements

- Integration with real electricity meters or IoT devices where available.
- Historical consumption tracking and visualizations.
- Campus-building comparisons.
- More personalized recommendations based on validated usage data.
- Evaluation of estimates against actual electricity measurements.

## 🌍 Vision

Our goal is to make energy consumption easier to understand and help campuses explore more informed, energy-conscious decisions.

**Measure smarter. Waste less. Build a greener campus.**

---

*WattWise Campus is a prototype for energy awareness and estimation. All calculations and recommendations should be interpreted in light of the limitations described above.*
