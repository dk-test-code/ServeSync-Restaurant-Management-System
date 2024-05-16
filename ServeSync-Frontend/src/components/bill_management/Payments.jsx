import { useState, useEffect, useMemo, useCallback } from "react";
import AdminNavbar from "../AdminNavBar";
import AdminSideBar from "../AdminSideBar";
import useAuth from "../useAuth";
import axios from "axios";
import "./Payments.css";
import { format } from "date-fns";
import { FaFileInvoice } from "react-icons/fa";
import PaymentInvoiceModal from "./PaymentInvoiceModal";

const Payments = () => {
  useAuth(["admin"]);
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedColumn, setSortedColumn] = useState("createdAt");
  const [sortedOrder, setSortedOrder] = useState("desc"); // Set to "desc" by default

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/orders", config);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [config]);

  // Fetch orders data on component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleInvoiceButtonClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowInvoiceModal(true);
  };

  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
  };

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const fieldA = a[sortedColumn];
      const fieldB = b[sortedColumn];
      if (sortedOrder === "asc") {
        return typeof fieldA === "string"
          ? fieldA.localeCompare(fieldB)
          : fieldA - fieldB;
      } else {
        return typeof fieldB === "string"
          ? fieldB.localeCompare(fieldA)
          : fieldB - fieldA;
      }
    });
  }, [orders, sortedColumn, sortedOrder]);

  const filteredOrders = useMemo(() => {
    return sortedOrders.filter((order) => {
      const customerName = order.customerName;
      if (customerName === null || customerName === undefined) {
        return true; // Return true to include orders with null or undefined customer names
      }
      return customerName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [sortedOrders, searchTerm]);

  const handleSort = (columnName) => {
    if (sortedColumn === columnName) {
      setSortedOrder(sortedOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(columnName);
      setSortedOrder("asc");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container-fluid" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <AdminSideBar />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="payments-container">
              <h1>Payments</h1>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Bootstrap table to display orders */}
              <table className="table table-striped-columns accordion-item">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("orderId")}>
                      Order ID{" "}
                      {sortedColumn === "orderId" &&
                        (sortedOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("diningTable.name")}>
                      Table{" "}
                      {sortedColumn === "diningTable.name" &&
                        (sortedOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("orderType")}>
                      Order Type{" "}
                      {sortedColumn === "orderType" &&
                        (sortedOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("customerName")}>
                      Customer Name{" "}
                      {sortedColumn === "customerName" &&
                        (sortedOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th>Mobile Number</th>
                    <th onClick={() => handleSort("totalPriceWithTaxes")}>
                      Bill Amount{" "}
                      {sortedColumn === "totalPriceWithTaxes" &&
                        (sortedOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("status")}>
                      Payment Status{" "}
                      {sortedColumn === "status" &&
                        (sortedOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("paymentType")}>
                      Payment Type{" "}
                      {sortedColumn === "paymentType" &&
                        (sortedOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("createdAt")}>
                      Date{" "}
                      {sortedColumn === "createdAt" &&
                        (sortedOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th>Invoice</th> {/* New column for invoice */}
                    {/* Add more headers if needed */}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderId}</td>
                      <td>
                        {order.diningTable ? order.diningTable.name : "NA"}
                      </td>
                      <td>{order.orderType}</td>
                      <td>{order.customerName ? order.customerName : ""}</td>
                      <td>{order.mobileNumber ? order.mobileNumber : ""}</td>
                      <td>
                        <b>
                          {order.totalPriceWithTaxes
                            ? order.totalPriceWithTaxes.toFixed(2)
                            : ""}
                        </b>
                      </td>
                      <td>{order.status}</td>
                      <td>{order.paymentType ? order.paymentType : ""}</td>
                      <td>
                        {order.createdAt
                          ? format(
                              new Date(order.createdAt),
                              "dd/MM/yyyy HH:mm:ss"
                            )
                          : ""}
                      </td>
                      <td>
                        <button
                          disabled={order.status === "PENDING"}
                          style={{
                            border: "none",
                            color:
                              order.status === "PENDING" ? "#abc5ff" : "blue",
                          }}
                          onClick={() =>
                            handleInvoiceButtonClick(order.orderId)
                          }
                        >
                          <FaFileInvoice size={20} />
                        </button>
                      </td>
                      {/* Add more columns as needed */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
      <PaymentInvoiceModal
        orderId={selectedOrderId}
        show={showInvoiceModal}
        handleClose={handleCloseInvoiceModal}
        config={config}
        orders={orders}
      />
    </>
  );
};

export default Payments;
