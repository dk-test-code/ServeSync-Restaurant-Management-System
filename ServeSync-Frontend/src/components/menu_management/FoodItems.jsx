import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddFoodItemModal from "./AddFoodItemModal";
import ConfirmationModal from "../common/ConfirmationModal";
import AdminSidebar from "../AdminSideBar";
import AdminNavBar from "../AdminNavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

const FoodItems = () => {
  // State variables
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [foodItemToEdit, setFoodItemToEdit] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State variable for search term
  const [filteredFoodItems, setFilteredFoodItems] = useState([]); // State variable for filtered food items

  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const availableCategories = response.data.filter(
        (category) => category.available
      );
      setCategories(availableCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("error", "Error fetching categories. Please try again.");
    }
  }, []);

  // Fetch food items function
  const fetchFoodItems = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/food-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFoodItems(response.data);
    } catch (error) {
      console.error("Error fetching food items:", error);
      showToast("error", "Error fetching food items. Please try again.");
    }
  }, []);

  // Filter food items based on search term
  useEffect(() => {
    const filtered = foodItems.filter((item) => {
      const matchesItemName = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategoryName = item.categoryName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesItemName || matchesCategoryName;
    });
    setFilteredFoodItems(filtered);
  }, [foodItems, searchTerm]);

  // Fetch food items and categories on component mount
  useEffect(() => {
    fetchFoodItems();
    fetchCategories();
  }, [fetchFoodItems, fetchCategories]);

  // Function to handle adding a food item
  const handleAddFoodItem = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/food-items", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showToast("success", "Food item added successfully.");
      fetchFoodItems();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding food item:", error);
      showToast("error", "Error adding food item. Please try again.");
    }
  };

  // Function to handle editing a food item
  const handleEditFoodItem = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/food-items/${foodItemToEdit.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showToast("success", "Food item updated successfully.");
      fetchFoodItems();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating food item:", error);
      showToast("error", "Error updating food item. Please try again.");
    }
  };

  // Function to handle deleting a food item
  const handleDeleteFoodItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/food-items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast("success", "Food item deleted successfully.");
      fetchFoodItems();
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting food item:", error);
      showToast("error", "Error deleting food item. Please try again.");
    }
  };

  // Function to display toast notifications
  const showToast = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <AdminNavBar />
      <ToastContainer />
      <div className="container-fluid" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <AdminSidebar />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="foodItems-container">
              <h1 style={{ color: "white" }}>Menu Items:</h1>
              <div className="search-bar" style={{ width: "500px" }}>
                <input
                  type="text"
                  placeholder="Search by item or category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary mb-2"
                style={{ marginLeft: "1105px" }}
                onClick={() => {
                  setFoodItemToEdit(null);
                  setShowModal(true);
                }}
              >
                Add Item
                {"  "}
                <IoIosAddCircle />
              </button>
              <table className="table table-striped accordion-item">
                {/* Table header */}
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody>
                  {filteredFoodItems.map((foodItem) => (
                    <tr key={foodItem.id}>
                      <td>{foodItem.id}</td>
                      <td>{foodItem.name}</td>
                      <td>
                        <img
                          src={`data:image/jpeg;base64,${foodItem.imageData}`}
                          alt={foodItem.name}
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                      </td>
                      <td>{foodItem.categoryName}</td>
                      <td>{foodItem.price.toFixed(2)}</td>
                      <td>
                        {foodItem.available ? "Available" : "Unavailable"}
                      </td>
                      <td>
                        {format(
                          new Date(foodItem.createdAt),
                          "dd/MM/yyyy HH:mm:ss"
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setFoodItemToEdit(foodItem);
                            setShowModal(true);
                          }}
                        >
                          <MdOutlineEdit />
                        </button>{" "}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            setItemToDelete(foodItem.id);
                            setShowDeleteConfirmation(true);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
      <AddFoodItemModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setFoodItemToEdit(null);
        }}
        handleAddFoodItem={handleAddFoodItem}
        handleEditFoodItem={handleEditFoodItem}
        categories={categories}
        foodItemToEdit={foodItemToEdit}
      />
      <ConfirmationModal
        show={showDeleteConfirmation}
        handleClose={() => setShowDeleteConfirmation(false)}
        handleConfirm={() => handleDeleteFoodItem(itemToDelete)}
        title="Delete Food Item"
        message={`Are you sure you want to delete the food item "${
          foodItems.find((item) => item.id === itemToDelete)?.name
        }"?`}
      />
    </>
  );
};

export default FoodItems;
