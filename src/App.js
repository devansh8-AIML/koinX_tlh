import React, { useState, useEffect, useCallback } from "react";
import { fetchHoldings, fetchCapitalGains } from "./api/mockData";
import "./App.css";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v, pfx = "$") =>
  pfx +
  Math.abs(v).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const GainVal = ({ value }) => (
  <span className={value >= 0 ? "pos" : "neg"}>
    {value >= 0 ? "+" : "-"}
    {fmt(value)}
  </span>
);

const Skeleton = ({ className }) => <div className={`skel ${className || ""}`} />;

// ─── Capital Gains Card ──────────────────────────────────────────────────────

function CapGainsCard({ data, isAfter, savings }) {
  const stNet = data.stcg.profits - data.stcg.losses;
  const ltNet = data.ltcg.profits - data.ltcg.losses;
  const realised = stNet + ltNet;

  return (
    <div className={`gains-card${isAfter ? " after-card" : ""}`}>
      <p className="card-lbl">{isAfter ? "After Harvesting" : "Pre Harvesting"}</p>

      <div className="gains-grid">
        <div className="g-row hdr-row">
          <span />
          <span>Short-term</span>
          <span>Long-term</span>
        </div>
        <div className="g-row">
          <span className="lbl">Profits</span>
          <span className="pos">{fmt(data.stcg.profits)}</span>
          <span className="pos">{fmt(data.ltcg.profits)}</span>
        </div>
        <div className="g-row">
          <span className="lbl">Losses</span>
          <span className="neg">− {fmt(data.stcg.losses)}</span>
          <span className="neg">− {fmt(data.ltcg.losses)}</span>
        </div>
        <div className="g-row net-row">
          <span className="lbl">Net Capital Gains</span>
          <GainVal value={stNet} />
          <GainVal value={ltNet} />
        </div>
      </div>

      <div className="realised-row">
        <span>{isAfter ? "Effective Capital Gains:" : "Realised Capital Gains:"}</span>
        <span className="realised-val">
          {isAfter && "− "}
          {fmt(Math.abs(realised))}
        </span>
      </div>

      {isAfter && savings > 0 && (
        <div className="savings-tag">
          <span className="star">✦</span>
          <span>You are going to save upto {fmt(savings)}</span>
        </div>
      )}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [holdings, setHoldings] = useState([]);
  const [baseGains, setBaseGains] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [loadHoldings, setLoadHoldings] = useState(true);
  const [loadGains, setLoadGains] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [discOpen, setDiscOpen] = useState(false);

  useEffect(() => {
    fetchHoldings()
      .then(setHoldings)
      .catch(() => setError("Failed to load holdings data"))
      .finally(() => setLoadHoldings(false));

    fetchCapitalGains()
      .then((d) => setBaseGains(d.capitalGains))
      .catch(() => setError("Failed to load capital gains data"))
      .finally(() => setLoadGains(false));
  }, []);

  // Compute After-Harvesting gains based on selected rows
  const afterGains = useCallback(() => {
    if (!baseGains) return null;
    const g = {
      stcg: { ...baseGains.stcg },
      ltcg: { ...baseGains.ltcg },
    };
    selected.forEach((coin) => {
      const h = holdings.find((x) => x.coin === coin);
      if (!h) return;
      if (h.stcg.gain > 0) g.stcg.profits += h.stcg.gain;
      else g.stcg.losses += Math.abs(h.stcg.gain);
      if (h.ltcg.gain > 0) g.ltcg.profits += h.ltcg.gain;
      else g.ltcg.losses += Math.abs(h.ltcg.gain);
    });
    return g;
  }, [baseGains, selected, holdings]);

  const after = afterGains();
  const preReal = baseGains
    ? baseGains.stcg.profits - baseGains.stcg.losses + baseGains.ltcg.profits - baseGains.ltcg.losses
    : 0;
  const afterReal = after
    ? after.stcg.profits - after.stcg.losses + after.ltcg.profits - after.ltcg.losses
    : 0;
  const savings = preReal > afterReal ? preReal - afterReal : 0;

  const toggleRow = (coin) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(coin) ? next.delete(coin) : next.add(coin);
      return next;
    });

  const allSel = holdings.length > 0 && holdings.every((h) => selected.has(h.coin));
  const toggleAll = () =>
    setSelected(allSel ? new Set() : new Set(holdings.map((h) => h.coin)));

  const displayed = showAll ? holdings : holdings.slice(0, 4);

  return (
    <div className="app">
      {/* Header */}
      <header className="hdr">
        <div className="logo">
          Koin<span className="logo-x">X</span>
          <sup className="logo-star">✦</sup>
        </div>
      </header>

      <main className="main">
        {/* Page Title */}
        <div className="title-row">
          <h1>Tax Harvesting</h1>
          <button
            className="how-btn"
            onClick={() =>
              alert(
                "Tax loss harvesting helps reduce your taxable capital gains by strategically selling assets at a loss to offset your gains."
              )
            }
          >
            How it works?
          </button>
        </div>

        {/* Disclaimer */}
        <div className="disc-wrap">
          <button className="disc-btn" onClick={() => setDiscOpen((o) => !o)}>
            <span className="disc-icon">⚠</span>
            <span>Important Notes &amp; Disclaimers</span>
            <span className={`disc-chevron${discOpen ? " open" : ""}`}>▾</span>
          </button>
          {discOpen && (
            <div className="disc-body">
              <ul>
                <li>Tax loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.</li>
                <li>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.</li>
                <li>Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.</li>
                <li>Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.</li>
                <li>Only realised losses are considered for harvesting. Unrealised losses in held assets are not counted.</li>
              </ul>
            </div>
          )}
        </div>

        {error && <div className="error-msg">{error}</div>}

        {/* Capital Gains Cards */}
        <div className="cards-row">
          {loadGains ? (
            <>
              <Skeleton className="card-skel" />
              <Skeleton className="card-skel" />
            </>
          ) : (
            baseGains &&
            after && (
              <>
                <CapGainsCard data={baseGains} isAfter={false} savings={0} />
                <CapGainsCard data={after} isAfter={true} savings={savings} />
              </>
            )
          )}
        </div>

        {/* Holdings Table */}
        <div className="holdings-wrap">
          <div className="section-hdr">Holdings</div>
          {loadHoldings ? (
            <div style={{ padding: "16px" }}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="row-skel" />
              ))}
            </div>
          ) : (
            <div className="tbl-scroll">
              <table className="holdings-tbl">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={allSel}
                        onChange={toggleAll}
                      />
                    </th>
                    <th>Asset</th>
                    <th>
                      Holdings
                      <span className="sub-h">Avg Buy Price</span>
                    </th>
                    <th>Current Market Value</th>
                    <th>Short-Term Gain</th>
                    <th>Long-Term Gain</th>
                    <th>Amount to Sell</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((h) => {
                    const isSel = selected.has(h.coin);
                    const ticker = h.coin.replace(/[0-9]/g, "");
                    return (
                      <tr
                        key={h.coin}
                        className={isSel ? "sel" : ""}
                        onClick={() => toggleRow(h.coin)}
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => toggleRow(h.coin)}
                          />
                        </td>
                        <td>
                          <div className="asset-cell">
                            <img
                              className="coin-img"
                              src={h.logo}
                              alt={h.coinName}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div className="coin-fb" style={{ display: "none" }}>
                              {ticker[0]}
                            </div>
                            <div>
                              <span className="coin-nm">{h.coinName}</span>
                              <span className="coin-tk">{ticker}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="hld-cell">
                            <span className="hld-amt">
                              {h.totalHoldings} {ticker}
                            </span>
                            <span className="avg-p">{fmt(h.averageBuyPrice)}</span>
                          </div>
                        </td>
                        <td>
                          <span className="cur-val">{fmt(h.totalCurrentValue)}</span>
                        </td>
                        <td>
                          <div className="gain-cell">
                            <GainVal value={h.stcg.gain} />
                            <span className="gain-bal">
                              {h.stcg.balance} {ticker}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="gain-cell">
                            <GainVal value={h.ltcg.gain} />
                            <span className="gain-bal">
                              {h.ltcg.balance} {ticker}
                            </span>
                          </div>
                        </td>
                        <td>
                          {isSel ? (
                            <span className="amt-sell">
                              {h.totalHoldings} {ticker}
                            </span>
                          ) : (
                            <span className="amt-empty">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {holdings.length > 4 && (
                <button className="view-all-btn" onClick={() => setShowAll((s) => !s)}>
                  {showAll ? "View Less ↑" : `View All (${holdings.length}) ↓`}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
