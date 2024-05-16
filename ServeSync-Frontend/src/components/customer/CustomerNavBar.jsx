import { Link, useLocation } from "react-router-dom";
import "./CustomerNavBar.css";
const CustomerNavBar = () => {
  const location = useLocation();

  return (
    <nav
      className="navbar navbar-expand-lg p-1"
      style={{ backgroundColor: "#fff3cd" }}
    >
      <div className="container-fluid p-0">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            width="40"
            height="40"
            className="d-inline-block align-top me-2 mt-1"
            src="/ServeSyncLogo.png"
            alt="Brand Logo"
          />
          <span className="fw-bold">ServeSync</span>
        </Link>
        {/* Navbar toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li
              className={`nav-item ${
                location.pathname === "/reserve-table" ? "active-c" : ""
              }`}
            >
              <Link className="nav-link" to="/reserve-table">
                Reserve Table
              </Link>
            </li>
            <li
              className={`nav-item ${
                location.pathname === "/check-reservation-status"
                  ? "active-c"
                  : ""
              }`}
            >
              <Link className="nav-link" to="/check-reservation-status">
                Check Reservation Status
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavBar;
