import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './components/Authorization/LoginForm';
import RegisterForm from './components/Authorization/RegisterForm';
import CustomNavigation from './components/Navigation/CustomNavigation';

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

const App = () => {
  const token = localStorage.getItem('jwt_token')
  return (
    <div className='app-wrapper'>
    <Router>
      <CustomNavigation />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {token && <Route path="/dashboard" element={<Dashboard />} />}
          {token && <Route path="/team/:teamId"/>}
          <Route path="/*" element={<Navigate replace to='/' />} />
        </Routes>
    </Router>
    </div>
  );
};

export default App;
