import { Routes, Route } from 'react-router-dom'

import Home from "./pages/Home.jsx";
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";

import './global.css';

export default function App() {

  return (
    <>
      <div className="container">
          <Header />

          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>

          <Footer />
      </div>
    </>
  )
}
