import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './login'
import './App.css'
import Mapbox from './mapbox'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Mapbox />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
