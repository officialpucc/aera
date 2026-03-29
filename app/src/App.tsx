
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AeraProvider } from './context/AeraContext';
import OnboardingChat from './pages/OnboardingChat';
import Dashboard from './pages/Dashboard';
import PorteDataEntry from './pages/PorteDataEntry';
import { BrainCircuit, LayoutDashboard, Box } from 'lucide-react';

function Navigation() {
  return (
    <nav className="nav-bar">
      <div style={{ fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BrainCircuit color="var(--accent-color)" /> AERA
      </div>
      <div className="nav-links">
        <NavLink to="/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/porte" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Box size={18} /> Porte Link
        </NavLink>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AeraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OnboardingChat />} />
          <Route path="/*" element={
            <>
              <Navigation />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/porte" element={<PorteDataEntry />} />
              </Routes>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </AeraProvider>
  );
}

export default App;
