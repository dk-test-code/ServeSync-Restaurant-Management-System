import { useState, useEffect, useMemo } from "react";
import EmployeeNavbar from "../EmployeeNavBar";
import EmployeeSideBar from "../EmployeeSideBar";
import useAuth from "../useAuth";
import axios from "axios"; // Import Axios
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const token = localStorage.getItem("token");

const TakeOrder = () => {
  useAuth(["employee", "admin"]);
  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const [orderType, setOrderType] = useState(""); // State to store the selected order type
  const [selectedTable, setSelectedTable] = useState(null); // State to store the selected table for dine-in orders
  const [tables, setTables] = useState([]); // State to store the list of available tables
  const [selectedOrderType, setSelectedOrderType] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Fetch available tables when component mounts
    const fetchTables = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/dining-tables",
          config
        );
        setTables(response.data); // Assuming the response contains the list of available tables
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables(); // Call fetchTables function
  }, [config]); // Empty dependency array to run effect only once

  // Function to handle selecting or deselecting a table
  const handleTableSelection = (table) => {
    // If the selected table is the same as the currently selected table, deselect it
    if (selectedTable && selectedTable.id === table.id) {
      setSelectedTable(null);
    } else {
      // Otherwise, select the new table
      setSelectedTable(table);
    }
  };

  // Function to render tables
  const renderTables = (tables) => {
    return tables.map((table) => (
      <button
        key={table.id}
        className={`btn btn-table ${
          table.currentStatus === "OUT OF SERVICE"
            ? "btn-danger"
            : table.currentStatus === "AVAILABLE"
            ? "btn-primary"
            : "btn-warning"
        }`}
        style={{
          backgroundColor:
            selectedTable && selectedTable.id === table.id ? "green" : "",
          color: selectedTable && selectedTable.id === table.id ? "white" : "",
        }}
        onClick={() => handleTableSelection(table)}
        disabled={table.currentStatus === "OUT OF SERVICE"}
      >
        {table.name}
        <br />
        Capacity: {table.capacity}
        <br />
        Floor: {table.floorNumber}
      </button>
    ));
  };

  const availableTables = tables.filter(
    (table) => table.currentStatus === "AVAILABLE"
  );
  const occupiedTables = tables.filter(
    (table) => table.currentStatus === "OCCUPIED"
  );
  const outOfServiceTables = tables.filter(
    (table) => table.currentStatus === "OUT OF SERVICE"
  );

  const handleTakeOrder = async () => {
    // Logic to handle taking the order based on the selected order type and table
    if (orderType === "TAKEAWAY") {
      // Take-Away logic
      console.log("Order Type: TAKEAWAY");
      navigate("/employee/take-order/menu", {
        state: { orderType: orderType },
      });
    } else if (orderType === "DINE_IN" && selectedTable) {
      // Dine-In logic
      console.log("Order Type: DINE_IN");
      console.log("Selected Table:", selectedTable.name);
      console.log(
        "Table current status before taking order:",
        selectedTable.currentStatus
      );
      // Redirect to the menu page with table name in the state
      //if it is available first then redirect to the menu with the state availble so as to know that it gonna create a new order id else it will continue with the existing one
      navigate("/employee/take-order/menu", {
        state: { selectedTableInfo: selectedTable, orderType: orderType },
      });
    } else {
      console.error("Invalid Order Type or Table not selected");
    }
    // Update the status of the selected table to "OCCUPIED" if it is for the first time
  };
  return (
    <>
      <EmployeeNavbar />
      <div className="container-fluid" style={{ height: "100vh" }}>
        <div className="row " style={{ height: "100%" }}>
          <EmployeeSideBar />
          <main
            role="main"
            className="col-md-9 ml-sm-auto col-lg-10 px-4 d-flex align-items-center justify-content-center position-relative"
          >
            <div>
              <h1 style={{ marginLeft: "20px" }}>Take Order</h1>
              <div>
                <button
                  className={`btn btn-primary btn-lg mr-3 ${
                    selectedOrderType === "TAKEAWAY" ? "selected" : ""
                  }`}
                  onClick={() => {
                    setOrderType("TAKEAWAY");
                    setSelectedOrderType("TAKEAWAY");
                  }}
                >
                  Take-Away
                </button>
                <button
                  className={`btn btn-primary btn-lg m-3 ${
                    selectedOrderType === "DINE_IN" ? "selected" : ""
                  }`}
                  onClick={() => {
                    setOrderType("DINE_IN");
                    setSelectedOrderType("DINE_IN");
                  }}
                >
                  Dine-In
                </button>
              </div>
              {orderType === "DINE_IN" && (
                <div className="mt-3 text-center" style={{ color: "white" }}>
                  <h2>Select Table:</h2>
                  <div>
                    <div className="d-flex flex-wrap m-3 ">
                      {/* Render available tables */}
                      {renderTables(availableTables)}
                    </div>
                    <div className="d-flex flex-wrap m-3">
                      {/* Render occupied tables */}
                      {renderTables(occupiedTables)}
                    </div>
                    <div className="d-flex flex-wrap m-3">
                      {/* Render out of service tables */}
                      {renderTables(outOfServiceTables)}
                    </div>
                  </div>
                </div>
              )}
              <div className="text-center mt-3">
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleTakeOrder}
                  disabled={orderType === "DINE_IN" && !selectedTable}
                  style={{ color: "black", backgroundColor: "white" }}
                >
                  Take Order
                </button>
              </div>
            </div>
            {selectedOrderType === "DINE_IN" && (
              <div className="status-boxes-container position-absolute top-0 end-0 mt-3 me-3">
                <div
                  className="status-box available p-2 m-2"
                  style={{ color: "white", background: "#0d6efd" }}
                >
                  Available
                </div>
                <div
                  className="status-box occupied p-2 m-2"
                  style={{ color: "black", background: "#ffc107" }}
                >
                  Occupied
                </div>
                <div
                  className="status-box out-of-service p-2 m-2"
                  style={{ color: "white", background: "red" }}
                >
                  Out of Service
                </div>
                <div
                  className="status-box selected p-2 m-2"
                  style={{ color: "white", background: "green" }}
                >
                  Selected
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default TakeOrder;
