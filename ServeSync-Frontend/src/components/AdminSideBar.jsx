import { NavLink } from "react-router-dom";
import "./SideBar.css";

const AdminSideBar = () => {
  return (
    <nav className="col-md-2 d-none d-md-block sidebar-custom-bg sidebar height:100vh">
      <div className="position-fixed">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              exact
              to="/admin/dashboard"
              className="nav-link"
              activeClassName="active"
            >
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              to="/admin/food-items"
              className="nav-link"
              activeClassName="active"
            >
              Menu Items
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/categories"
              className="nav-link"
              activeClassName="active"
            >
              Categories
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/tables"
              className="nav-link"
              activeClassName="active"
            >
              Tables
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/payments"
              className="nav-link"
              activeClassName="active"
            >
              Payments and Orders
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/reservations"
              className="nav-link"
              activeClassName="active"
            >
              Reservations
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/employees"
              className="nav-link"
              activeClassName="active"
            >
              Employees
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminSideBar;
