import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../AdminSideBar";
import NavBar from "../AdminNavBar";
import AddTableModal from "./AddTableModal";
import ConfirmationModal from "../common/ConfirmationModal";
import { format } from "date-fns";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

import "./Tables.css";
const Tables = () => {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tableName, setTableName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [capacity, setCapacity] = useState(0);
  const [floorNumber, setFloorNumber] = useState("");
  const [tableIdToEdit, setTableIdToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableIdToDelete, setTableIdToDelete] = useState(null);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchTables = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/dining-tables", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      showToast("error", "Error fetching tables. Please try again.");
    }
  }, [token]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

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

  const handleAddTable = async (
    name,
    isActive,
    capacity,
    floorNumber,
    isEditMode
  ) => {
    const normalizedTableName = name.trim().toLowerCase();
    const normalizedFloorNumber = floorNumber.trim().toLowerCase();

    // Check if a table with the same name exists on the same floor
    const existingTableSameFloor = tables.find(
      (table) =>
        table.name.trim().toLowerCase() === normalizedTableName &&
        table.floorNumber.trim().toLowerCase() === normalizedFloorNumber &&
        table.id !== tableIdToEdit
    );

    if (existingTableSameFloor) {
      showToast(
        "error",
        "Table with the same name on the same floor already exists."
      );
      return;
    }
    try {
      if (isEditMode) {
        const tableToEdit = tables.find((table) => table.id === tableIdToEdit);
        if (
          tableToEdit &&
          tableToEdit.name.trim().toLowerCase() === normalizedTableName &&
          tableToEdit.active === isActive &&
          tableToEdit.capacity === capacity &&
          tableToEdit.floorNumber === floorNumber
        ) {
          showToast("info", "No changes detected.");
          handleClose();
          return;
        }

        await axios.put(
          `http://localhost:8080/dining-tables/${tableIdToEdit}`,
          {
            name: name,
            active: isActive ? 1 : 0,
            capacity: capacity,
            floorNumber: floorNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showToast("success", "Table successfully edited.");
        setTableIdToEdit(null);
      } else {
        await axios.post(
          "http://localhost:8080/dining-tables",
          {
            name: name,
            active: isActive ? 1 : 0,
            capacity: capacity,
            floorNumber: floorNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showToast("success", "Table successfully added.");
      }
      fetchTables();
      handleClose();
    } catch (error) {
      console.error("Error adding/editing table:", error);
      showToast("error", "Error adding/editing table. Please try again.");
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/dining-tables/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast("success", "Table successfully deleted.");
      fetchTables();
    } catch (error) {
      console.error("Error deleting table:", error);
      showToast("error", "Error deleting table. Please try again.");
    }
  };

  const handleEditTable = (id, name, isActive, capacity, floorNumber) => {
    setTableIdToEdit(id);
    setTableName(name);
    setIsActive(isActive);
    setCapacity(capacity);
    setFloorNumber(floorNumber);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setTableName("");
    setIsActive(true);
    setCapacity(0);
    setFloorNumber("");
    setTableIdToEdit(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setTableIdToDelete(null);
  };

  const handleConfirmDeleteTable = () => {
    handleDeleteTable(tableIdToDelete);
    handleCloseDeleteModal();
  };
  const filteredTables = useMemo(() => {
    return tables.filter((table) =>
      table.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tables, searchTerm]);
  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  const sortedTables = useMemo(() => {
    if (sortColumn && sortOrder) {
      return [...filteredTables].sort((a, b) => {
        const fieldA = a[sortColumn];
        const fieldB = b[sortColumn];
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
    return filteredTables;
  }, [filteredTables, sortColumn, sortOrder]);

  const sortedIcon = (columnName) => {
    if (sortColumn === columnName) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <>
      <NavBar />
      <ToastContainer />
      <div className="container-fluid" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <AdminSidebar />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="tables-container">
              <h1>Tables</h1>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="add-table-button"
                onClick={() => setShowModal(true)}
              >
                Add Table <IoIosAddCircle />
              </button>
              <table className="table table-striped accordion-item ">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("id")}>
                      ID {sortedIcon("id")}
                    </th>
                    <th onClick={() => handleSort("name")}>
                      Table Name {sortedIcon("name")}
                    </th>
                    <th onClick={() => handleSort("active")}>
                      Is Active? {sortedIcon("active")}
                    </th>
                    <th onClick={() => handleSort("currentStatus")}>
                      Current Status {sortedIcon("currentStatus")}
                    </th>
                    <th onClick={() => handleSort("capacity")}>
                      Capacity {sortedIcon("capacity")}
                    </th>
                    <th onClick={() => handleSort("floorNumber")}>
                      Floor {sortedIcon("floorNumber")}
                    </th>
                    <th onClick={() => handleSort("createdAt")}>
                      Date Created {sortedIcon("createdAt")}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTables.map((table) => (
                    <tr key={table.id}>
                      <td>{table.id}</td>
                      <td>{table.name}</td>
                      <td>{table.active ? "Active" : "Inactive"}</td>
                      <td>{table.currentStatus}</td>
                      <td>{table.capacity}</td>
                      <td>{table.floorNumber}</td>
                      <td>
                        {format(
                          new Date(table.createdAt),
                          "dd/MM/yyyy HH:mm:ss"
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary m-1"
                          onClick={() =>
                            handleEditTable(
                              table.id,
                              table.name,
                              table.active,
                              table.capacity,
                              table.floorNumber
                            )
                          }
                        >
                          <MdOutlineEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setTableIdToDelete(table.id);
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
      {showModal && (
        <AddTableModal
          show={showModal}
          handleClose={handleClose}
          handleAddTable={handleAddTable}
          tableName={tableName}
          setTableName={setTableName}
          isActive={isActive}
          setIsActive={setIsActive}
          capacity={capacity}
          setCapacity={setCapacity}
          floorNumber={floorNumber}
          setFloorNumber={setFloorNumber}
          isEditMode={tableIdToEdit !== null}
        />
      )}
      <ConfirmationModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleConfirm={handleConfirmDeleteTable}
        title="Delete Table"
        message={`Are you sure you want to delete the table "${
          tables.find((table) => table.id === tableIdToDelete)?.name
        }"?`}
      />
    </>
  );
};

export default Tables;
