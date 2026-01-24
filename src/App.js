import { useState, useEffect } from "react";
import "./App.css";
import MapView from "./components/MapView";
import ControlPanel from "./components/ControlPanel";
import ResultPanel from "./components/ResultPanel";
import { fetchHospitals, recommendHospital } from "./api";
import SearchBar from "./components/SearchBar";

function App() {
  const [location, setLocation] = useState(null);
  const [hour, setHour] = useState(new Date().getHours());
  const [result, setResult] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [resetView, setResetView] = useState(false);
  const [resetSearch, setResetSearch] = useState(false);


  // 🔹 NEW: route used when Navigate Now is clicked
  const [navigateRoute, setNavigateRoute] = useState(null);

  // Load hospitals once on app start
  useEffect(() => {
    fetchHospitals().then(setHospitals);
  }, []);

  useEffect(() => {
  // New emergency location invalidates old prediction
    setResult(null);
    setNavigateRoute(null);
    setResetView(true);
  }, [location]);


  const handleSubmit = async () => {
    if (!location) {
      alert("Please select emergency location on map");
      return;
    }

    const request = {
      lat: location.lat,
      lon: location.lng,
      hour: parseInt(hour),
      is_weekend: 0,
    };

    const res = await recommendHospital(request);
    setResult(res);
    setHour(12);
    setResetSearch(true);

    // reset any previous navigation intent
    setNavigateRoute(null);
  };

  // 🔹 Navigate Now handler
  const handleNavigate = () => {
    if (!location || !result) return;

    const hospital = hospitals.find(
      (h) => h.name === result.hospital_name
    );

    if (!hospital) return;

    setNavigateRoute([
      [location.lat, location.lng],
      [hospital.lat, hospital.lon],
    ]);
  };

  return (
    <div className="app-root">
      {/* MAP (constrained by layout CSS) */}
      <div className="map-wrapper">
        <MapView
          location={location}
          setLocation={setLocation}
          hospitals={hospitals}
          recommended={result}
          navigateRoute={navigateRoute}  
          resetView={resetView}
          onResetComplete={() => setResetView(false)} 
        />
      </div>

      {/* TOP HEADER */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="top-title">
            🚑 <span>Smart Emergency Response Assistant</span>
          </div>

          <div className="top-controls">
            <SearchBar 
            onSelectLocation={setLocation}
            reset={resetSearch}
            onResetComplete={() => setResetSearch(false)}
            />
            <ControlPanel
              hour={hour}
              setHour={setHour}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
        <ResultPanel
          result={result}
          onNavigate={handleNavigate}   
        />
      </div>
    </div>
  );
}

export default App;
