export default function ResultPanel({ result, onNavigate }) {
  if (!result) {
    return (
      <div className="sidebar-empty">
        <div className="sidebar-empty-title">
          Select an emergency location to begin
        </div>

        <div className="sidebar-empty-subtext">
          You can search above or click directly on the map.
          <br />
          Hospital locations are shown as markers.
        </div>
      </div>
    );
  }


  if (result.eta_minutes === -1) {
    return (
      <div className="sidebar-warning">
        <div className="sidebar-section-title">
          Region Not Supported
        </div>
        <p>
          This model works only for Bengaluru.
        </p>
      </div>
    );
  }

  return (
    <div className="sidebar-content">

      {/* SECTION HEADER */}
      <div className="sidebar-section-title">
        🚑 Recommended Hospital
      </div>

      {/* HOSPITAL IDENTITY */}
      <div className="hospital-block">
        <div className="hospital-name">
          {result.hospital_name}
        </div>
        <div className="hospital-distance">
          <span className="distance-dot" /> {result.distance_km} km away
        </div>
      </div>

      {/* DELAY BLOCK */}
      <div className="delay-block">
        <div className="delay-label">
          Predicted Delay
        </div>
        <div className="delay-value">
          {result.predicted_delay} mins
        </div>
        <div className="delay-impact">
          ⚠ {
            result.traffic_level === 3
              ? "High Traffic Impact"
              : result.traffic_level === 2
              ? "Moderate Traffic Impact"
              : "Low Traffic Impact"
          }
        </div>
      </div>

      {/* TRAFFIC SEVERITY */}
      <div className="traffic-block">
        <div className="traffic-label">
          Relative Traffic Severity —{" "}
          <span className="traffic-percent">
            {Math.min(
              Math.round((result.predicted_delay / 60) * 100),
              100
            )}
            % congestion
          </span>
        </div>

        <div className="traffic-bar">
          <div
            className="traffic-fill"
            style={{
              width: `${Math.min(
                (result.predicted_delay / 60) * 100,
                100
              )}%`
            }}
          />
        </div>
      </div>

      {/* NAVIGATE CTA */}
      <button
        className="navigate-btn"
        onClick={onNavigate}
      >
        NAVIGATE NOW →
      </button>

      <div className="sidebar-disclaimer">
        ⚠ Traffic conditions, delays, and ETAs shown here are
        <b> simulated estimates</b> based on historical patterns and
        time-of-day assumptions. This system does not use real-time traffic data.
      </div>

    </div>
  );
}
