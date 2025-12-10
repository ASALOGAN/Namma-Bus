import { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";

import useBusData from "./hooks/useBusData";

import "./App.css";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Bus simulation engine
  const {
    location,
    etaList,
    isSimRunning,
    hasCompleted,
    startSimulation,
    resetSimulation,
  } = useBusData();

  return (
    <div className="app-layout">
      {/* Floating Hamburger Button */}
      <Header onMenuClick={() => setMenuOpen(true)} menuOpen={menuOpen} />

      {/* Sidebar Drawer */}
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        startSimulation={startSimulation}
        resetSimulation={resetSimulation}
        location={location}
        etaList={etaList}
        isSimRunning={isSimRunning}
        hasCompleted={hasCompleted}
      />

      {/* Map Background */}
      <div className="map-fullscreen">
        <MapView location={location} />
      </div>
    </div>
  );
};

export default App;
