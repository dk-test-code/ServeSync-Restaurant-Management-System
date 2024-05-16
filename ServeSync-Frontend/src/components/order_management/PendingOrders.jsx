import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeNavbar from "../EmployeeNavBar";
import EmployeeSideBar from "../EmployeeSideBar";
import useAuth from "../useAuth";
import config from "../common/axiosConfig"; // Import the config object
import { format } from "date-fns";

const PendingOrders = () => {
  useAuth(["employee", "admin"]);

  const [pendingOrders, setPendingOrders] = useState([]);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/order-items/pending",
        config
      );
      setPendingOrders(response.data);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <>
      <EmployeeNavbar />
      <div className="container-fluid" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <EmployeeSideBar />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="text-center">
              <h1>Pending Orders</h1>
            </div>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Order Item ID</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Ordered At</th>
                    <th>Table</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order.orderItemId}>
                      <td>{order.orderItemId}</td>
                      <td>{order.name}</td>
                      <td>{order.quantity}</td>
                      <td>{format(new Date(order.createdAt), "HH:mm:ss")}</td>
                      <td>{order.tableName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default PendingOrders;
