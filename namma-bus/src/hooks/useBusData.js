import { useState, useEffect, useRef } from "react";
import { simulateTick, resetBus, getAllEtas } from "../service/api";

export default function useBusData(refreshMs = 600) {
  const [location, setLocation] = useState(null);
  const [etaList, setEtaList] = useState([]);
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const intervalRef = useRef(null);

  /* ----------------------------------------------------
     START SIMULATION
  ---------------------------------------------------- */
  const startSimulation = () => {
    if (isSimRunning) return; // avoid double start

    setIsSimRunning(true);
    setHasCompleted(false); // reset completion flag

    intervalRef.current = setInterval(async () => {
      const result = await simulateTick();

      // update UI
      setLocation(result);

      // update ETA — FIXED: pass currentIndex
      const eta = await getAllEtas(
        { lat: result.lat, lng: result.lng },
        result.index // <-- REQUIRED for removing passed stops
      );
      setEtaList(eta);

      // STOP when bus reaches college
      if (result.completed) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsSimRunning(false);
        setHasCompleted(true);
        return;
      }
    }, refreshMs);
  };

  /* ----------------------------------------------------
     RESET SIMULATION
  ---------------------------------------------------- */
  const resetSimulation = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    resetBus(); // reset simulation engine

    setLocation(null);
    setEtaList([]);
    setIsSimRunning(false);
    setHasCompleted(false); // IMPORTANT FIX
  };

  /* ----------------------------------------------------
     CLEANUP ON UNMOUNT
  ---------------------------------------------------- */
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return {
    location,
    etaList,
    isSimRunning,
    hasCompleted,
    startSimulation,
    resetSimulation,
  };
}
