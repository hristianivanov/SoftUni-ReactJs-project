import { Routes, Route } from 'react-router-dom'

import Home from "./pages/home/Home.jsx";
import Detail from "./pages/detail/Detail.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import Header from "./components/header/Header.jsx";
import Contact from './pages/contact/Contact.jsx';
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
