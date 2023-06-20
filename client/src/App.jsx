import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginForm from "./components/Authorization/LoginForm";
import RegisterForm from "./components/Authorization/RegisterForm";
import CustomNavigation from "./components/Navigation/CustomNavigation";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Team from "./pages/Team";
import CreateTeam from "./pages/CreateTeam";
import CreateTask from "./pages/CreateTask";
import JoinTeam from "./pages/JoinTeam";

const App = () => {
  const token = localStorage.getItem("jwt_token");
  return (
    <div className="app-wrapper">
      <Router>
        <CustomNavigation />
        <Routes>
          <Route exact path="/" element={<Home />} />
          {token && <Route path="/dashboard" element={<Dashboard />} />}

          {!token && <Route path="/login" element={<LoginForm />} />}
          {!token && <Route path="/register" element={<RegisterForm />} />}

          {token && <Route path="/team/:teamId" element={<Team />} />}
          {token && <Route path="/add_team" element={<CreateTeam />} />}
          {token && <Route path="/add_task/:teamId" element={<CreateTask />} />}
          {token && <Route path="/join_team" element={<JoinTeam />} />}

          <Route path="/*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
