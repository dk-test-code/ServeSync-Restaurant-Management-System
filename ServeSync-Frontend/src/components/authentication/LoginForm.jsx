import "./LoginForm.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    // if (!username.trim()) {
    //   setError("Username required!");
    //   return;
    // }
    // if (!password.trim()) {
    //   setError("Password required!");
    //   return;
    // }

    try {
      setError(""); // Clear any previous errors
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });
      const { jwt, user } = response.data;
      localStorage.setItem("token", jwt);

      if (user.authorities.some((authority) => authority.roleId === 1)) {
        navigate("/admin/dashboard");
      } else if (user.authorities.some((authority) => authority.roleId === 2)) {
        navigate("/employee/dashboard");
      } else {
        console.error("Access denied. You are not authorized.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("Invalid username or password.");
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <div className="container h-100 login-container">
      <div className="d-flex justify-content-center h-100">
        <div className="user_card">
          <div className="d-flex justify-content-center">
            <div className="brand_logo_container">
              <img src="/ServeSyncLogo.png" className="brand_logo" alt="Logo" />
            </div>
          </div>
          <div className="d-flex justify-content-center form_container">
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <div className="input-group-append"></div>
                <input
                  type="text"
                  name=""
                  className="form-control input_user"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group mb-2">
                <div className="input-group-append"></div>
                <input
                  type="password"
                  name=""
                  className="form-control input_pass"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="input-group-append"
                  style={{ cursor: "pointer" }}
                ></div>
              </div>
              {error && (
                <div className="text-danger text-center mt-2">{error}</div>
              )}
              <div className="d-flex justify-content-center mt-3 login_container">
                <button type="submit" className="btn login_btn">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
