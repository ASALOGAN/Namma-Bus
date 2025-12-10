import "../css/sidebar.css";
import { FaTimes, FaPlay, FaSync } from "react-icons/fa";

import BusStatusCard from "./sidebar/BusStatusCard";
import AiAnalysisCard from "./sidebar/AiAnalysisCard";
import ETATable from "./sidebar/EtaTable";

const Sidebar = ({
  open,
  onClose,
  location,
  etaList,
  startSimulation,
  resetSimulation,
  isSimRunning,
  hasCompleted,
}) => {
  // Determine next stop from simulation engine
  const nextStop = location?.remainingStops?.length
    ? location.remainingStops[0]
    : null;

  return (
    <div className={`sidebar-overlay ${open ? "open" : ""}`}>
      <div className="sidebar">
        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose}>
          <FaTimes size={20} />
        </button>

        {/* TITLE + RESET BUTTON */}
        <div className="sidebar-title-row">
          <h1 className="sidebar-title">
            <span className="highlight">Namma</span> Bus
          </h1>

          {/* Reset Simulation (always available) */}
          <button
            className="refresh-btn"
            onClick={resetSimulation}
            title="Reset Simulation"
          >
            <FaSync size={14} />
          </button>
        </div>

        <p className="sidebar-subtitle">MyCEM College Bus Route, Mysore</p>

        {/* ================================
            SIMULATION CONTROL BUTTON
           ================================ */}
        {hasCompleted ? (
          // SIMULATION FINISHED → Show Reset Button
          <button className="start-btn" onClick={resetSimulation}>
            <FaSync /> Reset Simulation
          </button>
        ) : (
          // RUNNING OR READY
          <button
            className={`start-btn ${isSimRunning ? "disabled" : ""}`}
            onClick={!isSimRunning ? startSimulation : undefined}
            disabled={isSimRunning}
          >
            {isSimRunning ? (
              <>
                <FaPlay /> Running…
              </>
            ) : (
              <>
                <FaPlay /> Start Simulation
              </>
            )}
          </button>
        )}

        {/* BUS STATUS CARD */}
        <BusStatusCard location={location} nextStop={nextStop} />

        {/* AI ANALYSIS CARD */}
        <AiAnalysisCard />

        {/* ETA TABLE */}
        <ETATable etaList={etaList} />
      </div>
    </div>
  );
};

export default Sidebar;
