import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";

const AddTableModal = ({
  show,
  handleClose,
  handleAddTable,
  tableName,
  setTableName,
  isActive,
  setIsActive,
  capacity,
  setCapacity,
  floorNumber,
  setFloorNumber,
  isEditMode,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({
    tableName: "",
    floorNumber: "",
    capacity: "",
  });
  useEffect(() => {
    setErrorMessage("");
  }, [show]);

  const handleSave = () => {
    const newErrors = {};
    const specialCharacters = /[!@#$%^&*(),.?:{}_\-=+~|<>;]/;

    if (!tableName.trim()) {
      newErrors.tableName = "Please enter the table name.";
    } else if (/^\d/.test(tableName)) {
      newErrors.tableName = "Table name cannot start with a number.";
    } else if (specialCharacters.test(tableName)) {
      newErrors.tableName = "Table name cannot contain special characters.";
    } else if (tableName.length < 2 || tableName.length > 10) {
      newErrors.tableName = "Table name must be between 2 and 10 characters.";
    }

    if (!floorNumber.trim()) {
      newErrors.floorNumber = "Please enter the floor number.";
    } else if (floorNumber.length < 1 || floorNumber.length > 3) {
      newErrors.floorNumber = "Floor Number can contain maximum 3 characters";
    } else if (specialCharacters.test(floorNumber)) {
      newErrors.floorNumber = "Floor Number cannot contain special characters.";
    }

    if (
      isNaN(parseInt(capacity)) ||
      parseInt(capacity) < 1 ||
      parseInt(capacity) > 30
    ) {
      newErrors.capacity = "Please enter a valid capacity between 1 and 30.";
    }

    setErrors(newErrors);

    // Add additional validation logic if needed

    // If there are errors, return early
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Convert isActive to a boolean value
    const isActiveValue = isActive ? 1 : 0;

    handleAddTable(tableName, isActiveValue, capacity, floorNumber, isEditMode);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? "Edit Table" : "Add Table"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="tableName">
          <Form.Label>Table Name:</Form.Label>
          <Form.Control
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
          {errors.tableName && (
            <div className="text-danger">{errors.tableName}</div>
          )}
        </Form.Group>
        <Form.Group controlId="floorNumber">
          <Form.Label>Floor Number:</Form.Label>
          <Form.Control
            type="text"
            value={floorNumber}
            onChange={(e) => setFloorNumber(e.target.value)}
          />
          {errors.floorNumber && (
            <div className="text-danger">{errors.floorNumber}</div>
          )}
        </Form.Group>
        <Form.Group controlId="capacity">
          <Form.Label>Capacity:</Form.Label>
          <Form.Control
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
          />
          {errors.capacity && (
            <div className="text-danger">{errors.capacity}</div>
          )}
        </Form.Group>

        <Form.Group controlId="isActive">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            value={isActive ? "1" : "0"}
            onChange={(e) => setIsActive(e.target.value === "1")}
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </Form.Control>
        </Form.Group>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddTableModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAddTable: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  setTableName: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  setIsActive: PropTypes.func.isRequired,
  capacity: PropTypes.number.isRequired,
  setCapacity: PropTypes.func.isRequired,
  floorNumber: PropTypes.string.isRequired,
  setFloorNumber: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default AddTableModal;
