import "../../css/sidebar.css";

const ETATable = ({ etaList }) => {
  if (!etaList || etaList.length === 0) {
    return (
      <>
        <h3 className="upcoming-title">ETA TABLE</h3>
        <p style={{ color: "white", opacity: 0.7, marginTop: "8px" }}>
          Start simulation to show ETA data…
        </p>
      </>
    );
  }

  // DO NOT SORT — Keep original route order
  const orderedList = etaList;

  return (
    <>
      <h3 className="upcoming-title">ETA TABLE</h3>

      <div className="upcoming-list">
        {orderedList.map((eta, idx) => (
          <div key={idx} className="stop-row">
            <div className="stop-dot"></div>

            <span className="stop-name">{eta.stop}</span>

            <span className="stop-eta">
              {eta.final_eta != null ? `${eta.final_eta} min` : "—"}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ETATable;
