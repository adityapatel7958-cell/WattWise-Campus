import { useMemo, useState } from "react";

const initialAppliances = [
  { id: 1, name: "Ceiling Fan", icon: "🌀", watts: 75, quantity: 2, hours: 10 },
  { id: 2, name: "LED Bulb", icon: "💡", watts: 9, quantity: 4, hours: 6 },
  { id: 3, name: "Laptop", icon: "💻", watts: 65, quantity: 1, hours: 7 },
  {
    id: 4,
    name: "Air Conditioner",
    icon: "❄️",
    watts: 1200,
    quantity: 1,
    hours: 4,
  },
];

const navigation = [
  { id: "overview", icon: "▦", label: "Energy Overview" },
  { id: "appliances", icon: "⚡", label: "Appliance Calculator" },
  { id: "savings", icon: "↗", label: "Savings Simulator" },
  { id: "carbon", icon: "♧", label: "Carbon Footprint" },
  { id: "waste", icon: "⌕", label: "Energy Waste Detector" },
];

const tips = [
  {
    icon: "💡",
    title: "Switch to LED lighting",
    description: "Use energy-efficient LEDs in rooms and common areas.",
    tag: "Lighting",
  },
  {
    icon: "🌀",
    title: "Use fans efficiently",
    description:
      "Switch fans off when leaving rooms and use natural ventilation.",
    tag: "Appliances",
  },
  {
    icon: "❄️",
    title: "Optimize AC usage",
    description: "Keep doors closed and use a moderate cooling temperature.",
    tag: "Cooling",
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const number = (value, digits = 1) =>
  Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: digits,
  });

export default function App() {
  const [activePage, setActivePage] = useState("overview");
  const [appliances, setAppliances] = useState(initialAppliances);
  const [tariff, setTariff] = useState(8);
  const [days, setDays] = useState(30);
  const [reduction, setReduction] = useState(20);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newAppliance, setNewAppliance] = useState({
    name: "",
    watts: 60,
    quantity: 1,
    hours: 5,
  });

  const stats = useMemo(() => {
    const dailyKwh = appliances.reduce(
      (total, item) => total + (item.watts * item.quantity * item.hours) / 1000,
      0,
    );

    const monthlyKwh = dailyKwh * days;
    const monthlyCost = monthlyKwh * tariff;
    const savedKwh = monthlyKwh * (reduction / 100);

    return {
      dailyKwh,
      monthlyKwh,
      monthlyCost,
      savedKwh,
      savedMoney: savedKwh * tariff,
      monthlyCarbon: monthlyKwh * 0.716,
    };
  }, [appliances, days, tariff, reduction]);

  const filteredAppliances = appliances.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const wasteAnalysis = useMemo(() => {
  return appliances
    .map((item) => {
      const dailyKwh =
        (item.watts * item.quantity * item.hours) / 1000;

      // Flag high consumption or long daily usage for review.
      const needsReview = dailyKwh >= 2 || item.hours >= 8;

      // Model a possible reduction of up to one hour per day.
      const suggestedHours = needsReview
        ? Math.min(1, item.hours)
        : 0;

      const savedKwh =
        (item.watts * item.quantity * suggestedHours) / 1000;

      let recommendation =
        "Review this appliance's usage and switch it off when not needed.";

      const name = item.name.toLowerCase();

      if (name.includes("air conditioner") || name.includes("ac")) {
        recommendation =
          "Close doors and windows while cooling. Consider reducing runtime by one hour when comfortable.";
      } else if (name.includes("fan")) {
        recommendation =
          "Switch the fan off when leaving the room and use it only when needed.";
      } else if (
        name.includes("bulb") ||
        name.includes("light") ||
        name.includes("lamp")
      ) {
        recommendation =
          "Turn lights off in empty rooms and consider energy-efficient LED lighting.";
      } else if (name.includes("laptop") || name.includes("computer")) {
        recommendation =
          "Use power-saving settings and shut down the device when it will not be used.";
      }

      return {
        ...item,
        dailyKwh,
        needsReview,
        suggestedHours,
        savedKwh,
        savedMoney: savedKwh * tariff * days,
        recommendation,
      };
    })
    .filter((item) => item.needsReview)
    .sort((a, b) => b.dailyKwh - a.dailyKwh);
}, [appliances, tariff, days]);

  function updateAppliance(id, field, value) {
    setAppliances((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "name" ? value : Math.max(0, Number(value) || 0),
            }
          : item,
      ),
    );
  }

  function addAppliance(event) {
    event.preventDefault();

    if (!newAppliance.name.trim()) return;

    setAppliances((current) => [
      ...current,
      {
        ...newAppliance,
        id: Date.now(),
        icon: "🔌",
        watts: Math.max(0, Number(newAppliance.watts) || 0),
        quantity: Math.max(1, Number(newAppliance.quantity) || 1),
        hours: Math.min(24, Math.max(0, Number(newAppliance.hours) || 0)),
      },
    ]);

    setNewAppliance({
      name: "",
      watts: 60,
      quantity: 1,
      hours: 5,
    });
    setShowForm(false);
    setActivePage("appliances");
  }

  function removeAppliance(id) {
    setAppliances((current) => current.filter((item) => item.id !== id));
  }

  function downloadReport() {
    const rows = [
      ["WattWise Campus Energy Report"],
      ["Metric", "Estimated value"],
      ["Daily consumption (kWh)", stats.dailyKwh.toFixed(2)],
      ["Monthly consumption (kWh)", stats.monthlyKwh.toFixed(2)],
      ["Estimated monthly cost (INR)", stats.monthlyCost.toFixed(2)],
      ["Potential monthly savings (INR)", stats.savedMoney.toFixed(2)],
      [],
      ["Appliance", "Power (W)", "Quantity", "Hours/day", "Daily kWh"],
      ...appliances.map((item) => [
        item.name,
        item.watts,
        item.quantity,
        item.hours,
        ((item.watts * item.quantity * item.hours) / 1000).toFixed(2),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "wattwise-campus-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const pageTitles = {
    overview: ["Energy Overview", "Your campus energy at a glance."],
    appliances: [
      "Appliance Calculator",
      "Calculate energy use appliance by appliance.",
    ],
    savings: [
      "Savings Simulator",
      "Explore how small changes can reduce your bill.",
    ],
    carbon: [
      "Carbon Footprint",
      "Understand the estimated impact of your electricity use.",
    ],
    waste: [
      "Energy Waste Detector",
      "Identify high usage and explore practical ways to save energy.",
    ],
  };

  const [title, subtitle] = pageTitles[activePage];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#overview"
          onClick={() => setActivePage("overview")}
        >
          <span className="brand-mark">W</span>
          <span>
            <strong>WattWise</strong>
            <small> CAMPUS ENERGY</small>
          </span>
        </a>

        <div className="side-label">WORKSPACE</div>

        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {activePage === item.id && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="leaf-illustration">🌱</div>
          <strong>
            Small changes.
            <br />
            Big impact.
          </strong>
          <p>Build a more energy-conscious campus, one room at a time.</p>
          <div className="sidebar-mini-label">YOUR SAVINGS GOAL</div>
          <div className="mini-progress">
            <span style={{ width: `${reduction}%` }} />
          </div>
          <div className="mini-progress-caption">
            {reduction}% reduction target
          </div>
        </div>

        <div className="sidebar-footer">
          <span className="footer-status-dot" />
          WattWise Campus · Demo
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{title}</strong>
          </div>

          <div className="topbar-right">
            <span className="demo-badge">
              <span /> Demo data
            </span>
            <div className="avatar">WC</div>
          </div>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">WATTWISE CAMPUS / ENERGY MANAGEMENT</div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            <button className="button button-dark" onClick={downloadReport}>
              <span>↓</span> Export report
            </button>
          </div>

          <div className="notice">
            <span className="notice-icon">ⓘ</span>
            <span>
              <strong>Estimated figures:</strong> These calculations use your
              appliance inputs and assumed electricity tariff. They are not live
              meter readings.
            </span>
          </div>

          <div className="settings-strip">
            <label className="setting-control">
              <span>Electricity tariff</span>
              <span className="setting-input">
                ₹{" "}
                <input
                  aria-label="Electricity tariff per kWh"
                  type="number"
                  min="0"
                  step="0.5"
                  value={tariff}
                  onChange={(e) =>
                    setTariff(Math.max(0, Number(e.target.value) || 0))
                  }
                />{" "}
                <small>/ kWh</small>
              </span>
            </label>
            <div className="setting-divider" />
            <label className="setting-control">
              <span>Billing period</span>
              <span className="setting-input">
                <input
                  aria-label="Billing period in days"
                  type="number"
                  min="1"
                  max="366"
                  value={days}
                  onChange={(e) =>
                    setDays(
                      Math.min(366, Math.max(1, Number(e.target.value) || 1)),
                    )
                  }
                />{" "}
                <small>days</small>
              </span>
            </label>
            <div className="settings-note">
              <span>↗</span> Updates automatically
            </div>
          </div>

          {activePage === "overview" && (
            <>
              <div className="stats-grid">
                <StatCard
                  icon="⚡"
                  label="Daily consumption"
                  value={`${number(stats.dailyKwh)} kWh`}
                  note="Estimated per day"
                  color="green"
                />
                <StatCard
                  icon="▥"
                  label="Monthly consumption"
                  value={`${number(stats.monthlyKwh)} kWh`}
                  note={`${days}-day billing period`}
                  color="blue"
                />
                <StatCard
                  icon="₹"
                  label="Estimated monthly bill"
                  value={money(stats.monthlyCost)}
                  note={`At ₹${number(tariff, 2)} per kWh`}
                  color="orange"
                />
                <StatCard
                  icon="↘"
                  label="Potential savings"
                  value={money(stats.savedMoney)}
                  note={`${reduction}% usage reduction`}
                  color="purple"
                />
              </div>

              <div className="content-grid">
                <section className="panel consumption-panel">
                  <PanelHeading
                    title="Daily energy breakdown"
                    subtitle="Estimated consumption by appliance"
                    badge="LIVE CALCULATION"
                  />
                  {appliances.length === 0 ? (
                    <EmptyState text="Add an appliance to see your energy breakdown." />
                  ) : (
                    <div className="bar-chart">
                      {appliances
                        .map((item) => ({
                          ...item,
                          kwh: (item.watts * item.quantity * item.hours) / 1000,
                        }))
                        .sort((a, b) => b.kwh - a.kwh)
                        .slice(0, 6)
                        .map((item, index, list) => {
                          const max = Math.max(...list.map((x) => x.kwh), 0.01);
                          return (
                            <div className="bar-row" key={item.id}>
                              <div className="bar-label">
                                <span className="bar-appliance-icon">
                                  {item.icon}
                                </span>
                                <span>{item.name}</span>
                              </div>
                              <div className="bar-track">
                                <span
                                  className={`bar-fill bar-color-${index % 4}`}
                                  style={{
                                    width: `${(item.kwh / max) * 100}%`,
                                  }}
                                />
                              </div>
                              <strong>{number(item.kwh)} kWh</strong>
                            </div>
                          );
                        })}
                    </div>
                  )}
                  <div className="chart-footnote">
                    <span className="legend-dot" /> Daily energy · kWh
                  </div>
                </section>

                <section className="panel savings-panel">
                  <PanelHeading
                    title="Your savings potential"
                    subtitle="What if you used less energy?"
                  />
                  <div className="savings-circle-wrap">
                    <div
                      className="savings-circle"
                      style={{
                        background: `conic-gradient(#267653 ${reduction * 3.6}deg, #e9eee9 0deg)`,
                      }}
                    >
                      <div className="savings-circle-inner">
                        <strong>{reduction}%</strong>
                        <span>less energy</span>
                      </div>
                    </div>
                  </div>
                  <label className="range-label" htmlFor="overview-reduction">
                    Usage reduction target
                    <strong>{reduction}%</strong>
                  </label>
                  <input
                    id="overview-reduction"
                    className="range-input"
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={reduction}
                    onChange={(e) => setReduction(Number(e.target.value))}
                  />
                  <div className="range-limits">
                    <span>0%</span>
                    <span>60%</span>
                  </div>
                  <div className="saving-result">
                    <span>Potential monthly savings</span>
                    <strong>{money(stats.savedMoney)}</strong>
                    <small>
                      {number(stats.savedKwh)} kWh less per billing period
                    </small>
                  </div>
                </section>
              </div>

              <section className="panel appliance-panel">
                <PanelHeading
                  title="Appliance overview"
                  subtitle="Manage your appliances and their daily usage"
                  action={
                    <button
                      className="button button-green"
                      onClick={() => setShowForm(!showForm)}
                    >
                      + Add appliance
                    </button>
                  }
                />

                {showForm && (
                  <form className="add-form" onSubmit={addAppliance}>
                    <label>
                      Appliance name
                      <input
                        required
                        value={newAppliance.name}
                        placeholder="e.g. Study lamp"
                        onChange={(e) =>
                          setNewAppliance({
                            ...newAppliance,
                            name: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Power (W)
                      <input
                        type="number"
                        min="0"
                        required
                        value={newAppliance.watts}
                        onChange={(e) =>
                          setNewAppliance({
                            ...newAppliance,
                            watts: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Quantity
                      <input
                        type="number"
                        min="1"
                        required
                        value={newAppliance.quantity}
                        onChange={(e) =>
                          setNewAppliance({
                            ...newAppliance,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Hours/day
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        required
                        value={newAppliance.hours}
                        onChange={(e) =>
                          setNewAppliance({
                            ...newAppliance,
                            hours: e.target.value,
                          })
                        }
                      />
                    </label>
                    <button className="button button-dark" type="submit">
                      Save appliance
                    </button>
                    <button
                      className="button button-quiet"
                      type="button"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                )}

                <div className="table-scroll">
                  <table className="appliance-table">
                    <thead>
                      <tr>
                        <th>APPLIANCE</th>
                        <th>POWER (W)</th>
                        <th>QUANTITY</th>
                        <th>HOURS / DAY</th>
                        <th>DAILY USE</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {appliances.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="table-appliance">
                              <span className="table-icon">{item.icon}</span>
                              <strong>{item.name}</strong>
                            </div>
                          </td>
                          <td>
                            <input
                              className="table-input"
                              aria-label={`${item.name} watts`}
                              type="number"
                              min="0"
                              value={item.watts}
                              onChange={(e) =>
                                updateAppliance(
                                  item.id,
                                  "watts",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              className="table-input small-input"
                              aria-label={`${item.name} quantity`}
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) =>
                                updateAppliance(
                                  item.id,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              className="table-input small-input"
                              aria-label={`${item.name} hours per day`}
                              type="number"
                              min="0"
                              max="24"
                              step="0.5"
                              value={item.hours}
                              onChange={(e) =>
                                updateAppliance(
                                  item.id,
                                  "hours",
                                  Math.min(24, e.target.value),
                                )
                              }
                            />
                          </td>
                          <td>
                            <strong>
                              {number(
                                (item.watts * item.quantity * item.hours) /
                                  1000,
                              )}{" "}
                              kWh
                            </strong>
                          </td>
                          <td>
                            <button
                              className="remove-button"
                              aria-label={`Remove ${item.name}`}
                              title="Remove appliance"
                              onClick={() => removeAppliance(item.id)}
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {appliances.length === 0 && (
                    <EmptyState text="No appliances yet. Add one to get started." />
                  )}
                </div>
                <div className="table-summary">
                  <span>{appliances.length} appliances tracked</span>
                  <strong>Daily total: {number(stats.dailyKwh)} kWh</strong>
                </div>
              </section>

              <section className="tips-section">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">MAKE A DIFFERENCE</div>
                    <h2>Smart energy habits</h2>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setActivePage("savings")}
                  >
                    Explore savings <span>→</span>
                  </button>
                </div>
                <div className="tips-grid">
                  {tips.map((tip) => (
                    <article className="tip-card" key={tip.title}>
                      <div className="tip-top">
                        <span className="tip-icon">{tip.icon}</span>
                        <span className="tip-tag">{tip.tag}</span>
                      </div>
                      <h3>{tip.title}</h3>
                      <p>{tip.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {activePage === "appliances" && (
            <section className="panel page-panel">
              <PanelHeading
                title="Appliance calculator"
                subtitle="Change wattage, quantity or hours to update the estimates."
                action={
                  <button
                    className="button button-green"
                    onClick={() => setShowForm(!showForm)}
                  >
                    + Add appliance
                  </button>
                }
              />
              {showForm && (
                <form className="add-form" onSubmit={addAppliance}>
                  <label>
                    Appliance name
                    <input
                      required
                      value={newAppliance.name}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          name: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Power (W)
                    <input
                      type="number"
                      min="0"
                      value={newAppliance.watts}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          watts: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Quantity
                    <input
                      type="number"
                      min="1"
                      value={newAppliance.quantity}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          quantity: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Hours/day
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={newAppliance.hours}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          hours: e.target.value,
                        })
                      }
                    />
                  </label>
                  <button className="button button-dark" type="submit">
                    Save appliance
                  </button>
                </form>
              )}
              <div className="search-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search appliances..."
                  aria-label="Search appliances"
                />
                <span>{filteredAppliances.length} results</span>
              </div>
              <div className="appliance-cards">
                {filteredAppliances.map((item) => (
                  <article className="appliance-card" key={item.id}>
                    <div className="appliance-card-top">
                      <span className="table-icon large-icon">{item.icon}</span>
                      <button
                        className="remove-button"
                        onClick={() => removeAppliance(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        ×
                      </button>
                    </div>
                    <h3>{item.name}</h3>
                    <p>Daily energy consumption</p>
                    <strong className="appliance-energy">
                      {number((item.watts * item.quantity * item.hours) / 1000)}{" "}
                      <small>kWh/day</small>
                    </strong>
                    <div className="card-inputs">
                      <label>
                        Watts
                        <input
                          type="number"
                          min="0"
                          value={item.watts}
                          onChange={(e) =>
                            updateAppliance(item.id, "watts", e.target.value)
                          }
                        />
                      </label>
                      <label>
                        Quantity
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) =>
                            updateAppliance(item.id, "quantity", e.target.value)
                          }
                        />
                      </label>
                      <label>
                        Hours/day
                        <input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={item.hours}
                          onChange={(e) =>
                            updateAppliance(
                              item.id,
                              "hours",
                              Math.min(24, e.target.value),
                            )
                          }
                        />
                      </label>
                    </div>
                    <div className="appliance-monthly">
                      <span>Estimated cost / period</span>
                      <strong>
                        {money(
                          ((item.watts * item.quantity * item.hours) / 1000) *
                            days *
                            tariff,
                        )}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>
              {filteredAppliances.length === 0 && (
                <EmptyState text="No matching appliances. Try another search or add an appliance." />
              )}
            </section>
          )}

          {activePage === "savings" && (
            <>
              <div className="stats-grid savings-stats">
                <StatCard
                  icon="↘"
                  label="Monthly savings"
                  value={money(stats.savedMoney)}
                  note="Estimated bill reduction"
                  color="green"
                />
                <StatCard
                  icon="⚡"
                  label="Energy saved"
                  value={`${number(stats.savedKwh)} kWh`}
                  note="Per billing period"
                  color="blue"
                />
                <StatCard
                  icon="₹"
                  label="New estimated bill"
                  value={money(stats.monthlyCost - stats.savedMoney)}
                  note="After your reduction target"
                  color="orange"
                />
                <StatCard
                  icon="♧"
                  label="Energy reduction"
                  value={`${reduction}%`}
                  note="Your selected target"
                  color="purple"
                />
              </div>
              <section className="panel simulator-panel">
                <PanelHeading
                  title="Build your savings scenario"
                  subtitle="Move the slider to explore different electricity-saving goals."
                />
                <div className="simulator-value">
                  <div>
                    <span>Monthly usage reduction</span>
                    <strong>{reduction}%</strong>
                  </div>
                  <input
                    className="range-input big-range"
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={reduction}
                    onChange={(e) => setReduction(Number(e.target.value))}
                    aria-label="Monthly usage reduction percentage"
                  />
                  <div className="range-limits">
                    <span>0% · No change</span>
                    <span>60% · Ambitious target</span>
                  </div>
                </div>
                <div className="scenario-grid">
                  <div>
                    <span>Current estimated bill</span>
                    <strong>{money(stats.monthlyCost)}</strong>
                  </div>
                  <div>
                    <span>Estimated bill after changes</span>
                    <strong>
                      {money(stats.monthlyCost - stats.savedMoney)}
                    </strong>
                  </div>
                  <div className="scenario-highlight">
                    <span>You could save</span>
                    <strong>{money(stats.savedMoney)}</strong>
                    <small>every {days} days</small>
                  </div>
                </div>
                <p className="method-note">
                  Scenario assumption: total electricity use decreases uniformly
                  by your selected percentage. Actual savings depend on which
                  appliances you change and your real usage patterns.
                </p>
              </section>
              <section className="tips-section">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">START SMALL</div>
                    <h2>Actions you can take today</h2>
                  </div>
                </div>
                <div className="tips-grid">
                  {tips.map((tip) => (
                    <article className="tip-card" key={tip.title}>
                      <div className="tip-top">
                        <span className="tip-icon">{tip.icon}</span>
                        <span className="tip-tag">{tip.tag}</span>
                      </div>
                      <h3>{tip.title}</h3>
                      <p>{tip.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {activePage === "carbon" && (
            <>
              <div className="stats-grid">
                <StatCard
                  icon="♧"
                  label="Estimated monthly emissions"
                  value={`${number(stats.monthlyCarbon)} kg`}
                  note="CO₂e-equivalent estimate"
                  color="green"
                />
                <StatCard
                  icon="⚡"
                  label="Monthly electricity use"
                  value={`${number(stats.monthlyKwh)} kWh`}
                  note="Based on your appliance inputs"
                  color="blue"
                />
                <StatCard
                  icon="↘"
                  label="Potential emissions avoided"
                  value={`${number((stats.monthlyCarbon * reduction) / 100)} kg`}
                  note={`At ${reduction}% lower usage`}
                  color="purple"
                />
                <StatCard
                  icon="₹"
                  label="Potential bill savings"
                  value={money(stats.savedMoney)}
                  note="Same reduction scenario"
                  color="orange"
                />
              </div>
              <section className="panel carbon-panel">
                <div className="carbon-art">🌿</div>
                <div className="carbon-content">
                  <div className="eyebrow">UNDERSTAND YOUR IMPACT</div>
                  <h2>Less electricity can mean fewer emissions.</h2>
                  <p>
                    Reducing your electricity use can help lower the emissions
                    associated with power generation. Your estimate is
                    calculated from your projected kWh consumption and an
                    illustrative factor of 0.716 kg CO₂ per kWh.
                  </p>
                  <div className="carbon-formula">
                    Estimated emissions = electricity consumed (kWh) × 0.716 kg
                    CO₂/kWh
                  </div>
                  <p className="method-note">
                    This is an illustrative estimate, not a verified campus
                    carbon inventory. The actual emissions factor depends on the
                    electricity grid and reporting methodology. Replace the
                    assumed factor with a suitable documented local factor
                    before using results in formal reporting.
                  </p>
                </div>
              </section>
            </>
          )}
          {activePage === "waste" && (
            <>
              <div className="stats-grid">
                <StatCard
                  icon="🔎"
                  label="Appliances to review"
                  value={wasteAnalysis.length}
                  note="Based on usage screening rules"
                  color="orange"
                />

                <StatCard
                  icon="⚡"
                  label="Total daily consumption"
                  value={`${number(stats.dailyKwh)} kWh`}
                  note="Estimated across all appliances"
                  color="blue"
                />

                <StatCard
                  icon="₹"
                  label="Potential monthly savings"
                  value={money(
                    wasteAnalysis.reduce(
                      (total, item) => total + item.savedMoney,
                      0,
                    ),
                  )}
                  note="Illustrative usage-reduction scenario"
                  color="green"
                />

                <StatCard
                  icon="✓"
                  label="Detection method"
                  value="Rule-based"
                  note="No live meter or AI connection"
                  color="purple"
                />
              </div>

              <section className="panel page-panel">
                <PanelHeading
                  title="Appliances to review"
                  subtitle="These appliances meet the prototype's high-usage screening rules."
                  badge="RULE-BASED ANALYSIS"
                />

                {wasteAnalysis.length === 0 ? (
                  <EmptyState text="No appliances currently meet the screening rules. This does not guarantee that all energy use is efficient." />
                ) : (
                  <div className="waste-list">
                    {wasteAnalysis.map((item) => (
                      <article className="waste-card" key={item.id}>
                        <div className="waste-card-top">
                          <span className="table-icon large-icon">
                            {item.icon}
                          </span>

                          <span className="waste-badge">Review usage</span>
                        </div>

                        <h3>{item.name}</h3>

                        <div className="waste-metrics">
                          <div>
                            <span>Daily consumption</span>
                            <strong>{number(item.dailyKwh)} kWh</strong>
                          </div>

                          <div>
                            <span>Daily runtime</span>
                            <strong>{number(item.hours)} hours</strong>
                          </div>

                          <div>
                            <span>Estimated monthly cost</span>
                            <strong>
                              {money(item.dailyKwh * days * tariff)}
                            </strong>
                          </div>
                        </div>

                        <div className="waste-recommendation">
                          <strong>💡 Suggested action</strong>
                          <p>{item.recommendation}</p>
                        </div>

                        {item.suggestedHours > 0 ? (
                          <div className="waste-savings">
                            <div>
                              <span>Illustrative daily savings</span>
                              <strong>{number(item.savedKwh)} kWh</strong>
                            </div>

                            <div>
                              <span>Illustrative monthly savings</span>
                              <strong>{money(item.savedMoney)}</strong>
                            </div>

                            <small>
                              Assumes {number(item.suggestedHours)} fewer
                              hour(s) of daily use at the entered wattage.
                              Actual savings depend on real usage and appliance
                              power consumption.
                            </small>
                          </div>
                        ) : (
                          <p className="method-note">
                            Review your usage before deciding whether a change
                            is appropriate.
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}

                <p className="method-note">
                  Methodology: appliances are flagged when estimated daily
                  consumption is at least 2 kWh or entered usage is at least 8
                  hours per day. These thresholds are illustrative. This feature
                  does not measure actual waste or read live electricity meters.
                </p>
              </section>
            </>
          )}
          <footer className="page-footer">
            <span>© 2026 WattWise Campus</span>
            <span>Designed for a more energy-conscious campus 🌱</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">
        <span />
        {note}
      </div>
    </article>
  );
}

function PanelHeading({ title, subtitle, action, badge }) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="panel-heading-right">
        {badge && <span className="panel-badge">{badge}</span>}
        {action}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <span>🌱</span>
      <p>{text}</p>
    </div>
  );
}
