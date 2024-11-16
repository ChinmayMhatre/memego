import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import "./App.css";
import Mapbox from "./components/MapBox";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Mapbox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
