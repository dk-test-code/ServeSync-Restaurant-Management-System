import { Link } from "react-router-dom";
import LogoutButton from "./authentication/LogoutButton";

const EmployeeNavbar = () => {
  return (
    <nav
      className="navbar navbar-light navbar-custom-bg justify-content-between"
      style={{ height: "100%" }}
    >
      <Link to="/" className="navbar-brand">
        <img
          src="/ServeSyncLogo.png"
          width="40"
          height="40"
          className="d-inline-block align-top"
          alt=""
        />
        <b>ServeSync</b>
      </Link>
      <div>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default EmployeeNavbar;
