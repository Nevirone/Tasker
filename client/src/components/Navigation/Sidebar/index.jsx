import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import "./styles.css";
import ActiveLink from "../ActiveLink";
import { toast, Zoom, ToastContainer } from "react-toastify";

const Sidebar = ({ handleMenuToggle, isMenuOpen }) => {
  const token = localStorage.getItem("jwt_token");

  return (
    <>
      <ToastContainer limit={1} />
      <div
        className="sidebar"
        style={{
          opacity: isMenuOpen ? "100%" : "0%",
          top: isMenuOpen ? "0" : "-100%"
        }}
      >
        <div className="icon">
          <FaTimes className="close-icon" onClick={handleMenuToggle} />
        </div>
        <div className="sidebar-wrapper">
          <div className="sidebar-menu">
            {token && (
              <ActiveLink className="sidebar-link" to="/join_team">
                Join team
              </ActiveLink>
            )}
            {token && (
              <ActiveLink className="sidebar-link" to="/add_team">
                Create team
              </ActiveLink>
            )}

            <ActiveLink
              className="sidebar-link"
              to={token ? "/dashboard" : "/register"}
            >
              {token ? "Dashboard" : "Register"}
            </ActiveLink>
          </div>
          <div className="sidebar-btn">
            {!token && (
              <ActiveLink className="sidebar-btn-link" to="/login">
                Login
              </ActiveLink>
            )}
            {token && (
              <button
                className="nav-btn-link"
                onClick={() => {
                  toast.dismiss();
                  toast.clearWaitingQueue();

                  toast.success("Logged out. Redirecting to home page", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    hideProgressBar: true,
                    closeOnClick: true,
                    autoClose: 1000,
                    transition: Zoom,
                    onClose: () => {
                      localStorage.removeItem("jwt_token");
                      window.location.href = "/";
                    }
                  });
                }}
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  handleMenuToggle: PropTypes.func,
  isMenuOpen: PropTypes.bool
};

export default Sidebar;
