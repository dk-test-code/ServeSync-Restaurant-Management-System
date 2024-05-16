import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import QRCode from "react-qr-code"; // Import the QRCode component
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BillGenerationModal = ({
  show,
  handleClose,
  totalAmount,
  cgstAmount,
  sgstAmount,
  orderId,
  tableName,
  sumTotalPrices,
  tableId,
  config,
  orderType,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentType, setPaymentType] = useState("CASH");
  const [amountReceived, setAmountReceived] = useState(totalAmount);
  const navigate = useNavigate();
  console.log(sgstAmount);
  console.log(cgstAmount);
  console.log(orderId);
  console.log(sumTotalPrices);
  console.log(tableId);

  useEffect(() => {
    // Reset payment type and amount received when the modal is closed
    if (!show) {
      setCustomerName("");
      setMobileNumber("");
      setPaymentType("CASH");
      setAmountReceived(totalAmount);
    }
  }, [show, totalAmount]);
  const isValidForm = () => {
    if (!customerName || !mobileNumber) return false; // Check if customer name and mobile number are filled
    if (paymentType === "CASH" && amountReceived < totalAmount) return false; // Check if amount received is sufficient for cash payment
    return true;
  };

  const handleChangeCustomerName = (event) => {
    const newName = event.target.value.trim();
    // Validate length and special characters
    if (
      (/^[a-zA-Z\s]*$/.test(newName) && newName.length <= 20) ||
      newName === ""
    ) {
      setCustomerName(newName);
    }
  };

  const handleChangeMobileNumber = (event) => {
    let newNumber = event.target.value.trim(); // Trim spaces from left and right
    // Remove leading zeros
    newNumber = newNumber.replace(/^0+/, "");
    // Validate length and digits
    if (/^\d{0,10}$/.test(newNumber)) {
      setMobileNumber(newNumber);
    }
  };

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
    // Reset amount received when switching payment type
    setAmountReceived(totalAmount);
  };

  const handleSubmit = async () => {
    try {
      // Fetch existing order details
      const response = await axios.get(
        `http://localhost:8080/orders/${orderId}`,
        config
      );
      const existingOrder = response.data;
      // Prepare the updated order details
      const updatedOrder = {
        customerName,
        mobileNumber,
        sgstAmount,
        cgstAmount,
        totalPrice: sumTotalPrices,
        totalPriceWithTaxes: totalAmount,
        paymentType,
        status: "PAID",
        createdAt: new Date(),
        cgstPercent: existingOrder.cgstPercent,
        sgstPercent: existingOrder.sgstPercent,
        orderType: existingOrder.orderType,
        diningTable: existingOrder.diningTable,
      };

      // Update the order
      await axios.put(
        `http://localhost:8080/orders/${orderId}`,
        updatedOrder,
        config
      );

      const tableResponse = await axios.get(
        `http://localhost:8080/dining-tables/${tableId}`,
        config
      );
      const existingTable = tableResponse.data;
      // Prepare the updated table details with only the status changed
      const updatedTable = {
        name: existingTable.name,
        capacity: existingTable.capacity,
        active: existingTable.active,
        floorNumber: existingTable.floorNumber,
        createdAt: existingTable.createdAt,
        currentStatus: "AVAILABLE",
      };
      console.log(updatedTable);
      // Update the table status
      const tableUpdateResponse = await axios.put(
        `http://localhost:8080/dining-tables/${tableId}`,
        updatedTable,
        config
      );
      console.log(tableUpdateResponse);
      if (tableUpdateResponse.status === 200) {
        console.log("Table updated");
      } else {
        console.error(
          "Error updating table status:",
          tableUpdateResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error
      // Display error message to the user
    }
    const cartKey = `cartItems_${tableId}`;
    console.log("dk......", cartKey);
    localStorage.removeItem(cartKey);
    if (orderType === "TAKEAWAY") {
      toast.success(`Payment Recieved successfully for TakeAway Order`);
      navigate("/employee/take-order");
    } else {
      toast.success(`Payment Recieved successfully for table ${tableName}`);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 3000);
      navigate("/employee/dashboard");
    }

    handleClose();
  };

  const handleChangeAmountReceived = (event) => {
    setAmountReceived(parseFloat(event.target.value));
  };

  let changeToGiveBack = 0;

  if (paymentType === "CASH") {
    if (amountReceived >= totalAmount) {
      changeToGiveBack = amountReceived - totalAmount;
    } else {
      // If amount received is less than total amount, set change to 0
      changeToGiveBack = 0;
    }
  }

  const formatPrice = (price) => {
    return price.toFixed(2); // Formats the price to two decimal places
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {orderType !== "TAKEAWAY" ? (
            <Modal.Title>Bill Generation for Table: {tableName}</Modal.Title>
          ) : (
            <Modal.Title>Bill Generation for Takeaway</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="customerName">
              <Form.Label>Customer Name:</Form.Label>
              <Form.Control
                type="text"
                value={customerName}
                onChange={handleChangeCustomerName}
              />
            </Form.Group>
            <Form.Group controlId="mobileNumber">
              <Form.Label>Mobile Number:</Form.Label>
              <Form.Control
                type="tel"
                value={mobileNumber}
                onChange={handleChangeMobileNumber}
              />
            </Form.Group>
            <Form.Group controlId="paymentType">
              <Form.Label>Payment Type:</Form.Label>
              <Form.Control
                as="select"
                value={paymentType}
                onChange={handlePaymentTypeChange}
              >
                <option value="CASH">CASH</option>
                <option value="UPI">UPI</option>
              </Form.Control>
            </Form.Group>
            <div className="mt-3">
              <strong>Payable Amount: {formatPrice(totalAmount)}</strong>
            </div>
            {paymentType === "CASH" && (
              <Form.Group controlId="amountReceived">
                <Form.Label>Amount Received:</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={amountReceived}
                  onChange={handleChangeAmountReceived}
                />
              </Form.Group>
            )}
            {paymentType === "CASH" && amountReceived < totalAmount && (
              <div className="mt-3 text-danger">
                Amount received must be greater than or equal to payable amount.
              </div>
            )}
            {paymentType === "CASH" && (
              <div className="mt-3">
                <p>Change to Give Back: {changeToGiveBack.toFixed(2)}</p>
              </div>
            )}
          </Form>
          {paymentType === "UPI" && (
            <div className="mt-3">
              <QRCode
                value={`upi://pay?pa=${encodeURIComponent(
                  "dhiren.kanabar@paytm"
                )}&pn=Recipient&tn=Payment&am=${encodeURIComponent(
                  totalAmount
                )}`}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isValidForm()}
          >
            Take Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

BillGenerationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  totalAmount: PropTypes.number.isRequired,
  sumTotalPrices: PropTypes.number.isRequired,
  cgstAmount: PropTypes.number.isRequired,
  sgstAmount: PropTypes.number.isRequired,
  orderId: PropTypes.number.isRequired,
  tableName: PropTypes.string,
  tableId: PropTypes.number,
  config: PropTypes.object.isRequired,
  orderType: PropTypes.string,
};

export default BillGenerationModal;
