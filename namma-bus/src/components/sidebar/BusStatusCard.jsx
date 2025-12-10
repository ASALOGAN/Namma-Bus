import "../../css/sidebar.css";

const BusStatusCard = ({ location }) => {
  if (!location) {
    return (
      <div className="status-card">
        <h3 className="status-header">
          <span>Bus Status</span>
          <span className="live-badge">Idle</span>
        </h3>
        <p style={{ color: "#6b7280" }}>Start simulation to track the bus…</p>
      </div>
    );
  }

  const { speed, nextStop, distanceToNextStop, completed } = location;

  return (
    <div className="status-card">
      {/* HEADER */}
      <div className="status-header">
        <h3>Bus Status</h3>
        <span className="live-badge">{completed ? "Completed" : "Simulated GPS Route"}</span>
      </div>

      <div className="status-body">
        {/* SPEED */}
        <div>
          <div className="speed-value">{speed ?? 0}</div>
          <div className="speed-unit">km/h</div>
        </div>

        {/* STOP INFO */}
        <div className="status-info">
          <span className="status-label">Next Stop</span>
          <span className="status-stop">
            {nextStop ? nextStop.name : "None"}
          </span>

          <span className="status-label" style={{ marginTop: "8px" }}>
            Distance to Next Stop
          </span>
          <span className="status-stop">
            {distanceToNextStop != null
              ? `${distanceToNextStop.toFixed(2)} km`
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusStatusCard;
