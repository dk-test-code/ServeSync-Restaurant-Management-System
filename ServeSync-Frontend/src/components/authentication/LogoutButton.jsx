import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import ConfirmationModal from "../common/ConfirmationModal"; // Import the ConfirmationModal component

const LogoutButton = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the modal

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Redirect to the login page
    navigate("/login");
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleShowModal = () => {
    setShowModal(true); // Show the modal
  };

  return (
    <>
      <button className="logout-btn" onClick={handleShowModal}>
        Logout <BiLogOut size={24} />
      </button>
      {/* Render the ConfirmationModal with appropriate props */}
      <ConfirmationModal
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleLogout} // Call handleLogout when confirming
        title="Logout"
        message="Are you sure you want to logout?"
      />
    </>
  );
};

export default LogoutButton;
