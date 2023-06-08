import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Logout from './pages/logout';
import Dashboard from './pages/dashboard';
import LoginForm from './components/Validation/LoginForm';
import RegisterForm from './components/Validation/RegisterForm';
import Navigation from './components/Navigation/Navigation';

function App() {
  const [isMenuOpen, setMenuIsOpen] = useState(false);

  const onToggle = () => {
    setMenuIsOpen(!isMenuOpen);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigation onToggle={onToggle} isMenuOpen={isMenuOpen}>
              <Home />
            </Navigation>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Navigation onToggle={onToggle} isMenuOpen={isMenuOpen}>
              <LoginForm />
            </Navigation>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Navigation onToggle={onToggle} isMenuOpen={isMenuOpen}>
              <RegisterForm />
            </Navigation>
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/dashboard"
          element={
            <Navigation onToggle={onToggle} isMenuOpen={isMenuOpen}>
              <Dashboard />
            </Navigation>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
