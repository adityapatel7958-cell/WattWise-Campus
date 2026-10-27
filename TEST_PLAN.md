
# WattWise Campus — Test Plan

## 1. Appliance Energy Calculator

| Test | Input | Expected result |
|---|---|---|
| Basic calculation | 100 W, 1 appliance, 5 hours/day | 0.5 kWh/day |
| Multiple appliances | 100 W, 3 appliances, 5 hours/day | 1.5 kWh/day |
| Zero usage | 100 W, 1 appliance, 0 hours/day | 0 kWh/day |
| Invalid wattage | Negative wattage | Validation error |
| Invalid hours | More than 24 hours/day | Validation error |

## 2. Electricity Cost

Assume a sample tariff of ₹8 per kWh.

- Daily cost = daily energy consumption × tariff
- Monthly energy = daily energy consumption × 30
- Monthly cost = monthly energy consumption × tariff

Example:
A 100 W appliance used for 5 hours/day consumes 0.5 kWh/day.
At ₹8/kWh, the estimated daily cost is ₹4 and the 30-day cost is ₹120.

## 3. Savings Simulator

- Reducing appliance usage should reduce estimated consumption.
- Savings must never be negative when comparing a reduction in usage.
- A zero-hour reduction should produce zero savings.
- Results should update when inputs change.

## 4. User Interface

- All inputs have clear labels.
- Invalid inputs display helpful messages.
- Results are readable on desktop and mobile.
- Empty or incomplete inputs do not produce misleading results.
- Navigation and buttons work correctly.

## 5. Verification

Record each test as PASS or FAIL after implementation.
Test actual results against the expected values.
Document any bugs found and how they were fixed.
