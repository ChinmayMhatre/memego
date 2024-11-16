import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./Login";
import "./App.css";
import Mapbox from "./components/MapBox";
import AR from "./components/AR";
import Dashboard from "./Dashboard";
import ArWindow from "./ArWindow";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Mapbox />} />
        <Route path="/collect-coin" element={<AR />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
