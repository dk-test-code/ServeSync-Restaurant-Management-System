import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import AdminNavBar from "../AdminNavBar";
import AdminSideBar from "../AdminSideBar";
import AddEmployeeModal from "./AddEmployeeModal";
import ConfirmationModal from "../common/ConfirmationModal"; // Import ConfirmationModal
import { ToastContainer, toast } from "react-toastify";
import useAuth from "../useAuth";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import "./Employees.css";

const Employees = () => {
  useAuth("admin");
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null); // State to store employee ID to delete
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/list-employees",
        config
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, [config]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  const handleAddEmployee = async (employeeData) => {
    const { username, email, mobileNumber } = employeeData;
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMobileNumber = mobileNumber.trim();

    // Check if the username already exists
    const existingUsername = employees.find(
      (employee) =>
        employee.username.trim().toLowerCase() === normalizedUsername
    );

    // Check if the email already exists
    const existingEmail = employees.find(
      (employee) => employee.email.trim().toLowerCase() === normalizedEmail
    );

    // Check if the mobile number already exists
    const existingMobileNumber = employees.find(
      (employee) => employee.mobileNumber.trim() === normalizedMobileNumber
    );

    if (existingUsername) {
      toast.error(
        "Employee with the same username already exists.",
        toastOptions
      );
      return;
    } else if (existingEmail) {
      toast.error("Employee with the same email already exists.", toastOptions);
      return;
    } else if (existingMobileNumber) {
      toast.error(
        "Employee with the same mobile number already exists.",
        toastOptions
      );
      return;
    }

    try {
      // Add the new employee only if the username, email, and mobile number don't already exist
      await axios.post(
        "http://localhost:8080/admin/register",
        employeeData,
        config
      );
      fetchEmployees();
      setShowModal(false);
      toast.success("Employee added successfully", toastOptions);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteEmployee = (id) => {
    setShowDeleteModal(true);
    setEmployeeIdToDelete(id);
  };

  const handleConfirmDeleteEmployee = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/admin/delete-employee/${employeeIdToDelete}`,
        config
      );
      fetchEmployees();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminNavBar />
      <ToastContainer />
      <div className="container-fluid" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <AdminSideBar />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="employees-container">
              <h1>Employees</h1>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <button
                className="add-employee-button"
                onClick={() => setShowModal(true)}
                style={{ marginLeft: "1010px" }}
              >
                Add Employee <IoIosAddCircle />
              </button>

              <table className="table table-striped accordion-item">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Mobile Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.userId}>
                      <td>{employee.userId}</td>
                      <td>{employee.username}</td>
                      <td>{employee.email}</td>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>{employee.mobileNumber}</td>
                      <td>
                        {employee.username !== "admin" && ( // Check if the user is not admin
                          <button
                            onClick={() =>
                              handleDeleteEmployee(employee.userId)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <MdDelete
                              style={{ color: "red", fontSize: "1.5rem" }}
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
      {showModal && (
        <AddEmployeeModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          handleAddEmployee={handleAddEmployee}
        />
      )}
      <ConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDeleteEmployee}
        title="Delete Employee"
        message={`Are you sure you want to delete employee details with username "${
          employees.find((employee) => employee.userId === employeeIdToDelete)
            ?.username
        }"?`}
      />
    </>
  );
};

export default Employees;
