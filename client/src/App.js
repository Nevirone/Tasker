import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Home from './pages/home';
import Signin from './pages/signin';
import Signup from './pages/signup';

function App() {
  const [isMenuOpen, setMenuIsOpen] = useState(false);

  const onToggle = () => {
    setMenuIsOpen(!isMenuOpen);
  };
  return (
    <Router>
      <Sidebar isMenuOpen={isMenuOpen} onToggle={onToggle} />
      <Navbar onToggle={onToggle} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
