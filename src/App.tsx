import "./App.css";
import MapBox from "./components/Mapbox";
import AR from "./components/AR";
function App() {
  return (
    <>
      <div style={{ width: "99vw", height: "99vh", border: "2px solid red" }}>
        {/* <MapBox /> */}
        <AR />
      </div>
    </>
  );
}

export default App;
