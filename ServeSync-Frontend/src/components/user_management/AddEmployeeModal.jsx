import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";

const AddEmployeeModal = ({ show, handleClose, handleAddEmployee }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
    if (!formData.username) {
      newErrors.username = "Please enter the username.";
    } else if (!usernameRegex.test(formData.username)) {
      newErrors.username =
        "Username must be 5 to 15 characters long and contain only letters and numbers.";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{5,16}$/;
    if (!formData.password) {
      newErrors.password = "Please enter the password.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be 5 to 16 characters long.";
    }

    const nameRegex = /^[a-zA-Z\s]{2,15}$/;
    if (!formData.firstName) {
      newErrors.firstName = "Please enter the first name.";
    } else if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName =
        "First name must be 2 to 15 characters long and contain only letters.";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Please enter the last name.";
    } else if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName =
        "Last name must be 2 to 15 characters long and contain only letters.";
    }

    const mobileRegex = /^\d{1,10}$/;
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Please enter the mobile number.";
    } else if (!mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be up to 10 digits.";
    }

    const specialCharacterRegex = /^[a-zA-Z0-9\s]*$/;
    if (!specialCharacterRegex.test(formData.username)) {
      newErrors.username = "Username cannot contain special characters.";
    }
    if (!specialCharacterRegex.test(formData.firstName)) {
      newErrors.firstName = "First name cannot contain special characters.";
    }
    if (!specialCharacterRegex.test(formData.lastName)) {
      newErrors.lastName = "Last name cannot contain special characters.";
    }
    if (!specialCharacterRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber =
        "Mobile number cannot contain special characters.";
    }

    if (!formData.email) {
      newErrors.email = "Please enter the email.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      await handleAddEmployee(formData);
      handleClose();
    } catch (error) {
      console.error("Error adding employee:", error);
    }

    try {
      await handleAddEmployee(formData);
      handleClose();
    } catch (error) {
      console.error("Error adding employee:", error);
    }

    try {
      await handleAddEmployee(formData);
      handleClose();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              isInvalid={!!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              isInvalid={!!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="mobileNumber">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              isInvalid={!!errors.mobileNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.mobileNumber}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Modal.Footer className="mt-3">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddEmployeeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAddEmployee: PropTypes.func.isRequired,
};

export default AddEmployeeModal;
