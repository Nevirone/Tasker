import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import CustomNavigation from './components/Navigation/CustomNavigation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LoginForm from './pages/Authorization/LoginForm';
import RegisterForm from './pages/Authorization/RegisterForm';

import TeamDetails from './pages/TeamDetails';
import TeamForm from './pages/TeamForm';
import TeamJoinForm from './pages/TeamJoinForm';

import TaskForm from './pages/TaskForm';
import TaskEditForm from './pages/TaskEditForm';

const App = () => {
  const token = localStorage.getItem('jwt_token');
  return (
    <div className="app-wrapper">
      <Router>
        <CustomNavigation />
        <Routes>
          <Route exact path="/" element={<Home />} />
          {token && <Route path="/dashboard" element={<Dashboard />} />}

          {!token && <Route path="/login" element={<LoginForm />} />}
          {!token && <Route path="/register" element={<RegisterForm />} />}

          {token && <Route path="/team/:teamId" element={<TeamDetails />} />}
          {token && <Route path="/add_team" element={<TeamForm />} />}
          {token && <Route path="/join_team" element={<TeamJoinForm />} />}

          {token && <Route path="/add_task/:teamId" element={<TaskForm />} />}
          {token && (
            <Route
              path="/edit_task/:teamId/:taskId"
              element={<TaskEditForm />}
            />
          )}

          <Route path="/*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
