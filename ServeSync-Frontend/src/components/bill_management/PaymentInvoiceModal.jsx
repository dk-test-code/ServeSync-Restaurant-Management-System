// PaymentInvoiceModal.js

import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import { format } from "date-fns";
const PaymentInvoiceModal = ({
  orderId,
  show,
  handleClose,
  config,
  orders,
}) => {
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderType, setOrderType] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [date, setDate] = useState("");
  const [tableName, setTableName] = useState(" ");
  const [cgstPercent, setCgstPercent] = useState(0);
  const [sgstPercent, setSgstPercent] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerMobileNumber, setCustomerMobileNumber] = useState(0);
  const [totalPriceWithTaxes, setTotalPriceWithTaxes] = useState(0);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/order-items?orderId=${orderId}`,
          config
        );
        setOrderItems(response.data);

        // Calculate total, CGST and SGST percent and amount
        let totalAmount = 0;
        response.data.forEach((item) => {
          totalAmount += item.price * item.quantity;
        });
        setTotal(totalAmount);

        const order = orders.find((order) => order.orderId === orderId);

        if (order) {
          setCustomerName(order.customerName);
          setCustomerMobileNumber(order.mobileNumber);
          setCgstPercent(order.cgstPercent);
          setSgstPercent(order.sgstPercent);
          setOrderType(order.orderType);
          setTableName(order.diningTable?.name ? order.diningTable.name : "NA");
          setPaymentType(order.paymentType);
          setDate(
            order.createdAt
              ? format(new Date(order.createdAt), "dd/MM/yyyy HH:mm:ss")
              : ""
          );

          setCgstAmount(order.cgstAmount.toFixed(2));
          setSgstAmount(order.sgstAmount.toFixed(2));
          setTotalPriceWithTaxes(
            (
              totalAmount +
              (order.cgstPercent / 100) * totalAmount +
              (order.sgstPercent / 100) * totalAmount
            ).toFixed(2)
          );
        }
      } catch (error) {
        console.error("Error fetching order items:", error);
      }
    };
    fetchOrderItems();
  }, [config, orderId, orders]);
  const mergedItems = orderItems.reduce((acc, curr) => {
    const existingItemIndex = acc.findIndex((item) => item.name === curr.name);
    if (existingItemIndex !== -1) {
      acc[existingItemIndex].quantity += curr.quantity;
      acc[existingItemIndex].totalPrice += curr.price * curr.quantity;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);

  const handlePrint = () => {
    const printContents = document.getElementById("modal-content").innerHTML;
    const originalContents = document.body.innerHTML;
    const modal = document.getElementById("modal-content");
    const modalStyle = window.getComputedStyle(modal);
    const modalWidth = modalStyle.getPropertyValue("width");
    const modalHeight = modalStyle.getPropertyValue("height");
    document.body.innerHTML = printContents;
    document.body.style.width = modalWidth;
    document.body.style.height = modalHeight;
    document.body.style.margin = "auto";
    window.print();
    document.body.innerHTML = originalContents;
    document.body.style.width = "auto";
    document.body.style.height = "auto";
    handleClose(); // Close the modal after printing
    window.location.reload(); // Reload the page
  };

  return (
    <Modal show={show} onHide={handleClose} onEscapeKeyDown={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Payment Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body id="modal-content">
        <div
          style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}
        >
          ServeSync Multi Cuisine Restaurant
        </div>
        <hr></hr>
        <br />
        <div
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>Customer Name: {customerName}</div>
          <div> Mobile: {customerMobileNumber}</div>
        </div>
        <br />
        <div
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>Order ID: {orderId}</div>
          <div>
            Table: {orderType === "TAKEAWAY" ? "NA" : tableName || "NA"}
          </div>
        </div>
        <br />
        <div
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>Order Type: {orderType}</div>
          <div>Payment Type: {paymentType}</div>
        </div>
        <br />
        <div style={{ fontWeight: "bold" }}>Date: {date}</div>
        <br />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {mergedItems.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: "bold", margin: "0", fontSize: "18px" }}>
            Total: &nbsp;&nbsp;&nbsp;
            {total.toFixed(2)}
          </p>
          <p style={{ fontWeight: "bold", margin: "0" }}>
            CGST @ {cgstPercent}
            :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {cgstAmount}
          </p>
          <p style={{ fontWeight: "bold", margin: "0" }}>
            SGST @ {sgstPercent}
            :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {sgstAmount}
          </p>
          <hr />
          <p style={{ fontWeight: "bold", margin: "0", fontSize: "20px" }}>
            Grand Total:&nbsp; {totalPriceWithTaxes}
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          Thank you, visit again!
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePrint}>
          Print
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

PaymentInvoiceModal.propTypes = {
  orderId: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  orders: PropTypes.array.isRequired,
};

export default PaymentInvoiceModal;
