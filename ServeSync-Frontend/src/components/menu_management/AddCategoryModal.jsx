import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";

const AddCategoryModal = ({
  show,
  handleClose,
  handleAddCategory,
  categoryName: initialCategoryName,
  isAvailable: initialIsAvailable,
  isEditMode, // New prop to indicate edit mode
}) => {
  const [categoryName, setCategoryName] = useState(initialCategoryName);
  const [isAvailable, setIsAvailable] = useState(initialIsAvailable);
  const [error, setError] = useState("");

  useEffect(() => {
    setCategoryName(initialCategoryName);
    setIsAvailable(initialIsAvailable);
    setError(""); // Clear error when modal opens
  }, [show, initialCategoryName, initialIsAvailable]);

  const handleSubmit = () => {
    const trimmedName = categoryName.trim();
    const specialCharacters = /[!@#$%^&*(),.?:{}_\-=+~|<>;]/;
    if (!trimmedName) {
      setError("Please enter a category name.");
      return;
    }

    if (trimmedName.length < 3 || trimmedName.length > 20) {
      setError("Category name must be between 3 and 20 characters.");
      return;
    }

    if (/^\d/.test(trimmedName)) {
      setError("Category name cannot start with a number.");
      return;
    }
    if (specialCharacters.test(trimmedName)) {
      setError("Category name cannot cannot contain special characters.");
      return;
    }

    if (isEditMode) {
      handleEditCategory(trimmedName, isAvailable);
    } else {
      handleAddCategory(trimmedName, isAvailable);
    }
    handleClose();
  };

  const handleEditCategory = (name, isAvailable) => {
    handleAddCategory(name, isAvailable, true);
  };

  const handleCloseModal = () => {
    handleClose();
    setError(""); // Clear error when modal is closed
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? "Edit Category" : "Add Category"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="categoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            {error && <div className="text-danger">{error}</div>}
          </Form.Group>
          <Form.Group controlId="categoryStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={isAvailable ? "available" : "unavailable"}
              onChange={(e) => setIsAvailable(e.target.value === "available")}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isEditMode ? "Save" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddCategoryModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAddCategory: PropTypes.func.isRequired,
  categoryName: PropTypes.string.isRequired,
  isAvailable: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool,
};

export default AddCategoryModal;
