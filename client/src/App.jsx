import { Route, Routes } from 'react-router-dom';
import Articles from './pages/articles/Articles.jsx';
import CreateArticle from './pages/article-create/CreateArticle.jsx';
import EditArticle from './pages/article-create/EditArticle.jsx';
import Contact from './pages/contact/Contact.jsx';
import Detail from './pages/detail/Detail.jsx';
import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import NotFound from './pages/not-found/NotFound.jsx';
import Register from './pages/register/Register.jsx';
import Footer from './components/footer/Footer.jsx';
import Header from './components/header/Header.jsx';
import GuestOnlyRoute from './routes/GuestOnlyRoute.jsx';
import RequireAuth from './routes/RequireAuth.jsx';
import './global.css';

export default function App() {
  return (
    <div className="site-container">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route element={<RequireAuth />}>
          <Route path="/articles/create" element={<CreateArticle />} />
          <Route path="/articles/:articleId/edit" element={<EditArticle />} />
        </Route>
        <Route path="/articles/:articleId" element={<Detail />} />
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}
