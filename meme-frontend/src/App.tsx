import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import "./App.css";
import Mapbox from "./components/MapBox";
import AR from "./components/AR";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Mapbox />} />
        <Route path="/ar" element={<AR />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
