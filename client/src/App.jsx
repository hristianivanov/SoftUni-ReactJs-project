import { Routes, Route } from 'react-router-dom'

import Home from "./pages/Home.jsx";
import Detail from "./pages/Detail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Header from "./components/header/Header.jsx";
import Contact from './pages/Contact.jsx';
import Footer from "./components/footer/Footer.jsx";

import './global.css';

export default function App() {

  return (

    <div className="site-container">
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blogs/:blogId' element={<Detail />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>

      <Footer />
    </div>

  )
}
