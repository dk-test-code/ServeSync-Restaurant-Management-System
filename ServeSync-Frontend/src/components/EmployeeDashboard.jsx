import { useState, useEffect, useMemo, useCallback } from "react";
import EmployeeNavbar from "./EmployeeNavBar";
import EmployeeSideBar from "./EmployeeSideBar";
import useAuth from "./useAuth";
import axios from "axios"; // Import Axios

const token = localStorage.getItem("token");
const EmployeeDashboard = () => {
  useAuth(["admin", "employee"]);

  console.log("dk....", token);
  const [availableTables, setAvailableTables] = useState([]);

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const fetchAvailableTables = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/dining-tables/available",
        config
      );
      setAvailableTables(response.data);
    } catch (error) {
      console.error("Error fetching available tables:", error);
    }
  }, [config]);

  useEffect(() => {}, [fetchAvailableTables]);
  fetchAvailableTables();

  return (
    <>
      <EmployeeNavbar />
      <div className="container-fluid" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <EmployeeSideBar />
          <main
            role="main"
            className="col-md-9 ml-sm-auto col-lg-10 px-4 d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <h1>Available Tables</h1>
              <div className="d-flex flex-wrap justify-content-center">
                {availableTables.map((table) => (
                  <div
                    key={table.id}
                    className="table-block bg-primary text-white p-3 m-2"
                  >
                    <h2>{table.name}</h2>
                    <p className="fw-bold" style={{ fontSize: "1.2rem" }}>
                      Capacity: {table.capacity}
                    </p>
                    <p className="fw-bold" style={{ fontSize: "1.2rem" }}>
                      Floor: {table.floorNumber}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
