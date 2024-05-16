import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import EmployeeNavbar from "../EmployeeNavBar";
import EmployeeSideBar from "../EmployeeSideBar";
import useAuth from "../useAuth";
import BillGenerationModal from "./BillGenerationModal";
import ConfirmationModal from "../common/ConfirmationModal"; // Import the ConfirmationModal component
import { FaTrash } from "react-icons/fa";
import { MdOutlineDoneOutline } from "react-icons/md";
import { ImCross } from "react-icons/im";
import "./GenerateBill.css";
import { format } from "date-fns";

const token = localStorage.getItem("token");

const GenerateBill = () => {
  useAuth(["employee", "admin"]);
  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const [bookedTables, setBookedTables] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allItemsDelivered, setAllItemsDelivered] = useState(false);
  const [noOrdersToShow, setNoOrdersToShow] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showBillModal, setShowBillModal] = useState(false); // Set initial state to false
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State to control the confirmation modal
  const [itemToDelete, setItemToDelete] = useState(null); // State to track the item to be deleted
  const [cgstPercent, setCGSTPercent] = useState(0); // State to store CGST percentage
  const [sgstPercent, setSGSTPercent] = useState(0); // State to store SGST percentage

  useEffect(() => {
    const fetchBookedTables = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/dining-tables",
          config
        );
        const bookedTables = response.data.filter(
          (table) => table.currentStatus === "OCCUPIED"
        );
        setBookedTables(bookedTables);
      } catch (error) {
        console.error("Error fetching booked tables:", error);
      }
    };

    fetchBookedTables();
  }, [config]);

  const handleGenerateBill = async (table) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/orders/findOrderId?tableId=${table.id}&paymentStatus=PENDING`,
        config
      );

      const orderId = response.data;
      if (!orderId) {
        setNoOrdersToShow(true);
        return;
      }

      // Fetch order details including SGST and CGST percentages
      const orderResponse = await axios.get(
        `http://localhost:8080/orders/${orderId}`, // Assuming orderId is the correct path parameter
        config
      );

      const orderData = orderResponse.data;
      const { sgstPercent, cgstPercent } = orderData; // Assuming the response contains SGST and CGST percentages

      // Do something with SGST and CGST percentages, maybe store them in state
      // For example:
      setCGSTPercent(cgstPercent);
      setSGSTPercent(sgstPercent);
      console.log("SGST Percent:", sgstPercent);
      console.log("CGST Percent:", cgstPercent);
      await fetchOrderItems(orderId);
      setSelectedTable(table);
    } catch (error) {
      console.error("Error generating bill:", error);
      setNoOrdersToShow(true);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/order-items?orderId=${orderId}`,
        config
      );
      setOrderItems(response.data);
      if (response.data.length === 0) {
        setNoOrdersToShow(true);
      } else {
        setNoOrdersToShow(false);
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  useEffect(() => {
    const isAllItemsDelivered = orderItems.every(
      (item) => item.deliveryStatus === "DELIVERED"
    );
    setAllItemsDelivered(isAllItemsDelivered);
  }, [orderItems]);

  const toggleDeliveryStatus = async (orderItemId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/order-items/${orderItemId}`,
        config
      );

      const orderItem = response.data;

      const updatedOrderItem = {
        ...orderItem,
        deliveryStatus:
          orderItem.deliveryStatus === "PENDING" ? "DELIVERED" : "PENDING",
      };

      await axios.put(
        `http://localhost:8080/order-items/${orderItemId}`,
        updatedOrderItem,
        config
      );

      await fetchOrderItems(orderItem.orderId);
    } catch (error) {
      console.error("Error toggling delivery status:", error);
    }
  };
  const [filteredTables, setFilteredTables] = useState([]); // Add filteredTables state

  useEffect(() => {
    // Filter booked tables based on search query
    const filtered = bookedTables.filter((table) =>
      table.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTables(filtered);
  }, [searchQuery, bookedTables]);

  const handleDeleteConfirmation = async () => {
    try {
      if (itemToDelete) {
        await axios.delete(
          `http://localhost:8080/order-items/${itemToDelete.orderItemId}`,
          config
        );
        await fetchOrderItems(itemToDelete.orderId);
        setShowConfirmationModal(false);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Calculate the sum of total prices
  const sumTotalPrices = orderItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  // Calculate CGST amount
  const cgstAmount = (sumTotalPrices * cgstPercent) / 100;

  // Calculate SGST amount
  const sgstAmount = (sumTotalPrices * sgstPercent) / 100;

  //Grand Total
  const grandTotal = sumTotalPrices + sgstAmount + cgstAmount;

  const formatPrice = (price) => {
    return price.toFixed(2); // Formats the price to two decimal places
  };
  return (
    <>
      <EmployeeNavbar />
      <div className="container-fluid" style={{ height: "100vh" }}>
        <div className="row " style={{ height: "100%" }}>
          <EmployeeSideBar />
          <main
            role="main"
            className="col-md-9 ml-sm-auto col-lg-10 px-4 d-flex "
          >
            <div>
              <h1>Occupied Tables:</h1>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  style={{ width: "500px" }}
                  placeholder="Search by table name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <div className="d-flex flex-wrap">
                  {filteredTables.map(
                    (
                      table // Iterate over filteredTables instead of bookedTables
                    ) => (
                      <button
                        key={table.id}
                        className={`btn btn-table btn-warning mr-3 mb-3 m-2 ${
                          selectedTable && selectedTable.id === table.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleGenerateBill(table)}
                      >
                        {table.name}
                        <br />
                        Capacity: {table.capacity}
                        <br />
                        Floor: {table.floorNumber}
                      </button>
                    )
                  )}
                </div>
              </div>
              {selectedTable && (
                <>
                  <table className={`table ${noOrdersToShow ? "hidden" : ""} `}>
                    <thead>
                      <tr>
                        <th>Order Item ID</th>
                        <th>Table </th>
                        <th>Name</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Time Ordered</th>
                        <th>Delivery Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item) => (
                        <tr key={item.orderItemId}>
                          <td>{item.orderItemId}</td>
                          <td>
                            {selectedTable.name}-{selectedTable.floorNumber}
                          </td>
                          <td>{item.name}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td>{item.quantity}</td>
                          <td>{formatPrice(item.totalPrice)}</td>
                          <td>
                            {format(new Date(item.createdAt), "HH:mm:ss")}
                          </td>
                          <td className="text-center">
                            {item.deliveryStatus === "PENDING" ? (
                              <p>
                                <ImCross size={"20px"} color="red" />
                              </p>
                            ) : (
                              <p>
                                <MdOutlineDoneOutline
                                  size={"25px"}
                                  color="green"
                                />
                              </p>
                            )}
                          </td>
                          <td>
                            {item.deliveryStatus === "PENDING" ? (
                              <button
                                className="btn btn-sm btn-success mr-1"
                                onClick={() =>
                                  toggleDeliveryStatus(item.orderItemId)
                                }
                              >
                                Mark Delivered
                              </button>
                            ) : (
                              <button
                                className="btn btn-sm btn-warning mr-1"
                                onClick={() =>
                                  toggleDeliveryStatus(item.orderItemId)
                                }
                              >
                                Mark Pending
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-danger m-1"
                              onClick={() => {
                                if (item.deliveryStatus !== "DELIVERED") {
                                  setItemToDelete(item);
                                  setShowConfirmationModal(true);
                                }
                              }}
                              disabled={item.deliveryStatus === "DELIVERED"}
                            >
                              <FaTrash /> {/* Render the trash icon */}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="5"></td>
                        <td>
                          <b>Total: {formatPrice(sumTotalPrices)}</b>
                        </td>
                        <td colSpan="4"></td>
                      </tr>
                      <tr>
                        <td colSpan="5"></td>
                        <td>
                          CGST ({cgstPercent}%) = {formatPrice(cgstAmount)}
                        </td>
                        <td colSpan="4"></td>
                      </tr>
                      <tr>
                        <td colSpan="5"></td>
                        <td>
                          SGST ({sgstPercent}%) = {formatPrice(sgstAmount)}
                        </td>
                        <td colSpan="4"></td>
                      </tr>
                      <tr>
                        <td colSpan="5"></td>
                        <td>
                          <b>Grand Total: {formatPrice(grandTotal)}</b>
                        </td>
                        <td colSpan="4"></td>
                      </tr>
                    </tfoot>
                  </table>
                  {noOrdersToShow && (
                    <div className="text-center">
                      <p>No orders to show.</p>
                    </div>
                  )}
                  <button
                    className="btn btn-primary"
                    style={{ marginLeft: "1100px", marginBottom: "30px" }}
                    disabled={!allItemsDelivered}
                    onClick={() => setShowBillModal(true)}
                  >
                    Generate Bill
                  </button>
                </>
              )}
              <BillGenerationModal
                // Pass necessary data as props
                show={showBillModal}
                handleClose={() => setShowBillModal(false)}
                sumTotalPrices={sumTotalPrices}
                totalAmount={grandTotal}
                cgstAmount={cgstAmount}
                sgstAmount={sgstAmount}
                orderId={orderItems.length > 0 ? orderItems[0].orderId : ""}
                tableName={selectedTable ? selectedTable.name : "NA"}
                tableId={selectedTable ? parseInt(selectedTable.id) : ""}
                config={config}
              />
              <ConfirmationModal
                show={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                handleConfirm={handleDeleteConfirmation}
                title="Delete Order Item"
                message={`Are you sure you want to remove the ordered item "${
                  orderItems.find(
                    (item) => item.orderItemId === itemToDelete?.orderItemId
                  )?.name
                }"?`}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default GenerateBill;
