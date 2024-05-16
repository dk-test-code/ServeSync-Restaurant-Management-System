import { NavLink } from "react-router-dom";
import "./SideBar.css";

const EmployeeSideBar = () => {
  return (
    <nav
      className="col-md-2 d-none d-md-block sidebar-dark sidebar-custom-bg"
      style={{ height: "100vh", backgroundColor: "fff3cd" }}
    >
      <div className="position-sticky height:100vh">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              exact
              to="/employee/dashboard"
              className="nav-link"
              activeClassName="active"
            >
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/employee/take-order"
              className="nav-link"
              activeClassName="active"
            >
              Take Order
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/employee/generate-bill"
              className="nav-link"
              activeClassName="active"
            >
              Generate Bill
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/employee/pending-orders"
              className="nav-link"
              activeClassName="active"
            >
              Pending Orders
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default EmployeeSideBar;
