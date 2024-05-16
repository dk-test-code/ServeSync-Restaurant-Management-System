import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = (allowedRoleIds) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Get user role IDs from token
    const { decodedPayload, error } = decodeToken(token);
    if (error) {
      console.error("Error decoding token:", error);
      navigate("/unauthorized");
      return;
    }

    console.log("Allowed Role IDs:", allowedRoleIds);
    const userRoleIds = getCurrentUserRoleIds(decodedPayload);
    console.log("User Role IDs:", userRoleIds);

    if (!userRoleIds.some((roleId) => allowedRoleIds.includes(roleId))) {
      navigate("/unauthorized");
    }
  }, [navigate, allowedRoleIds]);

  return;
};

const getCurrentUserRoleIds = (decodedPayload) => {
  if (decodedPayload && decodedPayload.roles) {
    // Assuming roles is a string representing the role, parse it to determine roleId
    const role = decodedPayload.roles.toUpperCase(); // Assuming role string is in uppercase
    if (role === "ADMIN") {
      return ["admin"];
    } else if (role === "EMPLOYEE") {
      return ["employee"];
    }
  }
  return [];
};

const decodeToken = (token) => {
  try {
    // Decode the token
    const decodedPayload = JSON.parse(atob(token.split(".")[1]));
    console.log("Decoded Token Payload:", decodedPayload); // Log decoded payload
    return { decodedPayload, error: null };
  } catch (error) {
    console.error("Error decoding token:", error);
    console.error("Token:", token);
    return { decodedPayload: null, error };
  }
};

export default useAuth;
