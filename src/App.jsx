import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Activity } from 'lucide-react';
import './index.css';
import BackgroundGlobe from './components/BackgroundGlobe';

// Pages
import Home from './pages/Home';
import Methodology from './pages/Methodology';
import Dashboard from './pages/Dashboard';
import Evaluation from './pages/Evaluation';
import Data from './pages/Data';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Activity color="#00f0ff" size={32} />
        Route Resilience
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Overview</NavLink>
        <NavLink to="/methodology" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Methodology</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Command Center</NavLink>
        <NavLink to="/evaluation" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Metrics</NavLink>
        <NavLink to="/data" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Data</NavLink>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <BackgroundGlobe />
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/data" element={<Data />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
