import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../AdminSideBar";
import AdminNavBar from "../AdminNavBar";
import AddCategoryModal from "./AddCategoryModal";
import ConfirmationModal from "../common/ConfirmationModal";
import "./Categories.css";
import { format } from "date-fns";
import useAuth from "../useAuth";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

const Categories = () => {
  useAuth("admin");
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [categoryIdToEdit, setCategoryIdToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/categories?sortBy=${sortBy}&order=${sortOrder}`,
        config
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("error", "Error fetching categories. Please try again.");
    }
  }, [sortBy, sortOrder, config]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const showToast = (type, content) => {
    toast[type](content, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        marginTop: "60px",
      },
    });
  };

  const handleAddCategory = async (name, isAvailable, isEditMode) => {
    const normalizedName = name.trim().toLowerCase();
    const existingCategory = categories.find(
      (category) =>
        category.name.trim().toLowerCase() === normalizedName &&
        category.id !== categoryIdToEdit
    );

    if (existingCategory) {
      showToast("error", "Category with the same name already exists.");
      return;
    }

    try {
      if (isEditMode) {
        const categoryToEdit = categories.find(
          (category) => category.id === categoryIdToEdit
        );
        if (
          categoryToEdit &&
          categoryToEdit.name.trim().toLowerCase() === normalizedName &&
          categoryToEdit.available === isAvailable
        ) {
          showToast("info", "No changes detected.");
          handleClose();
          return;
        }

        await axios.put(
          `http://localhost:8080/categories/${categoryIdToEdit}`,
          {
            name: name,
            available: isAvailable,
          },
          config
        );
        showToast("success", "Category successfully edited.");
        setCategoryIdToEdit(null);
      } else {
        await axios.post(
          "http://localhost:8080/categories",
          {
            name: name,
            available: isAvailable,
          },
          config
        );
        showToast("success", "Category successfully added.");
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error("Error adding/editing category:", error);
      showToast("error", "Error adding/editing category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/categories/${id}`, config);
      showToast("success", "Category successfully deleted.");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast("error", "Error deleting category. Please try again.");
    }
  };

  const handleEditCategory = (id, name, isAvailable) => {
    setCategoryIdToEdit(id);
    setCategoryName(name);
    setIsAvailable(isAvailable);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCategoryName("");
    setIsAvailable(true);
    setCategoryIdToEdit(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryIdToDelete(null);
  };

  const handleConfirmDeleteCategory = () => {
    handleDeleteCategory(categoryIdToDelete);
    handleCloseDeleteModal();
  };

  const handleSort = (sortByField) => {
    if (sortBy === sortByField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(sortByField);
      setSortOrder("asc");
    }
  };

  const sortedCategories = useMemo(() => {
    if (sortBy && sortOrder) {
      return [...categories].sort((a, b) => {
        const fieldA = a[sortBy];
        const fieldB = b[sortBy];
        if (sortOrder === "asc") {
          return typeof fieldA === "string"
            ? fieldA.localeCompare(fieldB)
            : fieldA - fieldB;
        } else {
          return typeof fieldB === "string"
            ? fieldB.localeCompare(fieldA)
            : fieldB - fieldA;
        }
      });
    }
    return categories;
  }, [categories, sortBy, sortOrder]);

  const sortedIcon = (sortByField) => {
    if (sortBy === sortByField) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const filteredCategories = useMemo(() => {
    return sortedCategories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedCategories, searchTerm]);

  return (
    <>
      <AdminNavBar />
      <ToastContainer />
      <div className="container-fluid" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <AdminSidebar />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="categories-container">
              <h1>Categories</h1>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="add-category-button"
                onClick={() => setShowModal(true)}
                style={{ marginLeft: "1020px" }}
              >
                Add Category {"  "}
                <IoIosAddCircle />
              </button>
              <table className="table table-striped accordion-item ">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("id")}>
                      ID {sortedIcon("id")}
                    </th>
                    <th onClick={() => handleSort("name")}>
                      Category Name {sortedIcon("name")}
                    </th>
                    <th onClick={() => handleSort("available")}>
                      Status {sortedIcon("available")}
                    </th>
                    <th onClick={() => handleSort("createdAt")}>
                      Date Created {sortedIcon("createdAt")}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => {
                    const formattedDate = format(
                      new Date(category.createdAt),
                      "dd/MM/yyyy HH:mm:ss"
                    );
                    return (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>
                          {category.available ? "Available" : "Unavailable"}
                        </td>
                        <td>{formattedDate}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              handleEditCategory(
                                category.id,
                                category.name,
                                category.available
                              )
                            }
                          >
                            <MdOutlineEdit />
                          </button>{" "}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              setShowDeleteModal(true);
                              setCategoryIdToDelete(category.id);
                            }}
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
      {showModal && (
        <AddCategoryModal
          show={showModal}
          handleClose={handleClose}
          handleAddCategory={handleAddCategory}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          isAvailable={isAvailable}
          setIsAvailable={setIsAvailable}
          isEditMode={categoryIdToEdit !== null}
        />
      )}
      <ConfirmationModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleConfirm={handleConfirmDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${
          categories.find((category) => category.id === categoryIdToDelete)
            ?.name // Find the category name by ID
        }"?`}
      />
    </>
  );
};

export default Categories;
