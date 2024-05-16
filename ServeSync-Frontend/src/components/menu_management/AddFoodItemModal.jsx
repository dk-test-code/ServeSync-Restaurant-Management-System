import { useState, useEffect } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import PropTypes from "prop-types";

const AddFoodItemModal = ({
  show,
  handleClose,
  categories,
  handleAddFoodItem,
  handleEditFoodItem,
  foodItemToEdit,
}) => {
  const [itemName, setItemName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({
    itemName: "",
    category: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (foodItemToEdit) {
      setItemName(foodItemToEdit.name);
      setSelectedCategoryId(foodItemToEdit.categoryId);
      setStatus(foodItemToEdit.available);
      setPrice(foodItemToEdit.price);

      // Fetch preview image if available
      if (foodItemToEdit.image) {
        fetch(foodItemToEdit.image)
          .then((response) => response.blob())
          .then((blob) => {
            setImage(blob);
            setPreviewImage(URL.createObjectURL(blob));
          })
          .catch((error) => console.error("Error fetching image:", error));
      } else {
        setPreviewImage(null);
      }
    } else {
      setItemName("");
      setSelectedCategoryId("");
      setStatus(true);
      setPrice("");
      setPreviewImage(null);
    }
  }, [foodItemToEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Only jpeg, jpg, or png files are allowed.",
        }));
        return;
      }
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    const trimmedItemName = itemName.trim();
    const specialCharacters = /[!@#$%^&*(),?:{}_\-=+~|<>;]/;

    if (!trimmedItemName) {
      newErrors.itemName = "Please enter the item name.";
    } else if (/^\d/.test(trimmedItemName)) {
      newErrors.itemName = "Item name cannot start with a number.";
    } else if (specialCharacters.test(trimmedItemName)) {
      newErrors.itemName = "Item name cannot contain special characters.";
    }
    if (trimmedItemName.length < 3 || trimmedItemName.length > 20) {
      newErrors.itemName =
        "Food item name must be between 3 and 20 characters.";
    }
    if (!selectedCategoryId) {
      newErrors.category = "Please select a category.";
    }
    if (!price) {
      newErrors.price = "Please enter the price.";
    } else if (!Number(price)) {
      newErrors.price = "Please enter a valid price.";
    } else if (price > 9999) {
      newErrors.price = "Price cannot be more than 9999.";
    }
    if (!image) {
      newErrors.image = "Please select an image.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const foodItemData = {
        name: trimmedItemName,
        categoryId: selectedCategoryId,
        price: price,
        available: status,
        createdAt: new Date().toISOString(),
      };

      const foodItemDTO = new Blob([JSON.stringify(foodItemData)], {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("foodItemDTO", foodItemDTO);
      formData.append("image", image);

      if (foodItemToEdit) {
        handleEditFoodItem(formData);
      } else {
        handleAddFoodItem(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error adding/editing food item:", error);
      setErrors({
        ...errors,
        common: "Error adding/editing food item. Please try again later.",
      });
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setItemName("");
    setSelectedCategoryId("");
    setStatus(true);
    setImage(null);
    setPreviewImage(null);
    setPrice("");
    setErrors({
      itemName: "",
      category: "",
      price: "",
      image: "",
    });
  };

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {foodItemToEdit ? "Edit Food Item" : "Add Food Item"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="itemName">
            <Form.Label>Item Name:</Form.Label>
            <Form.Control
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            {errors.itemName && (
              <div className="text-danger">{errors.itemName}</div>
            )}
          </Form.Group>
          <Form.Group controlId="category">
            <Form.Label>Category:</Form.Label>
            <Form.Control
              as="select"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
            {errors.category && (
              <div className="text-danger">{errors.category}</div>
            )}
          </Form.Group>
          <Form.Group controlId="price">
            <Form.Label>Price:</Form.Label>
            <Form.Control
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && <div className="text-danger">{errors.price}</div>}
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Image:</Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
            />
            {errors.image && <div className="text-danger">{errors.image}</div>}
            {previewImage && (
              <div
                style={{ width: "200px", height: "200px", overflow: "hidden" }}
              >
                <Image
                  src={previewImage}
                  alt="Preview"
                  thumbnail
                  fluid
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            )}
          </Form.Group>
          <Form.Group controlId="status">
            <Form.Check
              type="checkbox"
              label="Available"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
          </Form.Group>
          {errors.common && <div className="text-danger">{errors.common}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {foodItemToEdit ? "Save Changes" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddFoodItemModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  handleAddFoodItem: PropTypes.func.isRequired,
  handleEditFoodItem: PropTypes.func.isRequired,
  foodItemToEdit: PropTypes.object, // Nullable
};

export default AddFoodItemModal;
