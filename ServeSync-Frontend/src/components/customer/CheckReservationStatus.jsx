import { useState } from "react";
import CustomerNavBar from "./CustomerNavBar";
import axios from "axios";
import { format } from "date-fns";
import { GiConfirmed } from "react-icons/gi";
import { IoWarning } from "react-icons/io5";
import { GrStatusGood } from "react-icons/gr";
import { MdCall } from "react-icons/md";
import { AiOutlineMail, AiOutlineCalendar } from "react-icons/ai";
import ConfirmationModal from "../common/ConfirmationModal";

const CheckReservationStatus = () => {
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [date, setDate] = useState(localStorage.getItem("date") || "");
  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [reservationDate, setReservationDate] = useState();
  const [reservationIdToCancel, setReservationIdToCancel] = useState();
  const [error, setError] = useState(null);
  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/customer/reservations/email/${email}/date/${date}`
      );
      if (!response.ok) {
        throw new Error(
          `No reservations found with the provided details. Make sure the email address provided is the same as the one you provided while making the reservation.`
        );
      }
      const data = await response.json();
      console.log("Data received from backend:", data);
      setReservations(data);
      setError(null); // Reset error state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError(error.message); // Set error message
      setReservations([]);
      setLoading(false);
    }
  };
  const handleCancelReservation = async (reservationIdToCancel) => {
    try {
      const updatedReservations = reservations.map((reservation) => {
        if (reservation.reservationId === reservationIdToCancel) {
          return {
            ...reservation,
            reservationDate: reservationDate,
            reservationStatus: "CANCELLED",
          };
        }
        return reservation;
      });

      await axios
        .put(
          `http://localhost:8080/customer/reservations/${reservationIdToCancel}`,
          updatedReservations.find(
            (reservation) => reservation.reservationId === reservationIdToCancel
          )
        )
        .then(() => {
          setReservations(updatedReservations);
        });
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error cancelling reservation", error);
    }
  };

  const handleClear = () => {
    // Clear email and date input fields and remove from local storage
    setEmail("");
    setDate("");
    setError(null);
    setReservations([]);
    localStorage.removeItem("email");
    localStorage.removeItem("date");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    localStorage.setItem("email", e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    localStorage.setItem("date", e.target.value);
  };
  const reverseFormatTime = (time) => {
    const [hours, minutes] = time.split(":"); // Split hours and minutes

    let formattedHours = parseInt(hours, 10); // Parse hours as integer
    let ampm = "AM"; // Set default to AM

    if (formattedHours >= 12) {
      // If hours are greater than or equal to 12, set PM and adjust hours
      ampm = "PM";
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
    }

    if (formattedHours === 0) {
      // If hours are 0, set to 12 for 12 AM
      formattedHours = 12;
    }

    // Format time and return
    return `${formattedHours}:${minutes} ${ampm}`;
  };
  return (
    <>
      <CustomerNavBar />
      <div className="background-overlay1">
        <div className="container mt-5">
          <div className="card p-3" style={{ width: "100%", margin: "0 auto" }}>
            <div className="row align-items-center justify-content-center">
              <div className="col-md-12 text-center">
                <h2 className="mb-5">
                  Check Reservation Status{" "}
                  <GrStatusGood size="30px" color="green" />
                </h2>
              </div>
              <div className="col-md-12 text-center">
                <form onSubmit={handleCheckStatus}>
                  <div className="row align-items-center justify-content-center">
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <AiOutlineMail size={"20px"} />
                          </div>
                        </div>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          id="inputEmail"
                          placeholder="Email ID"
                          value={email}
                          style={{ width: "700px" }}
                          onChange={handleEmailChange}
                        />
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <AiOutlineCalendar size={"20px"} />
                          </div>
                        </div>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          id="inputDate"
                          value={date}
                          style={{ width: "300px" }}
                          onChange={handleDateChange}
                        />
                      </div>
                    </div>
                    <div className="col-auto">
                      <button
                        type="button"
                        className="btn btn-secondary btn-m m-1"
                        onClick={handleClear}
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-m m-1"
                        disabled={loading || !email.trim() || !date.trim()}
                      >
                        {loading ? "Checking..." : "Check"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {loading && (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="alert alert-danger mt-4 text-center" role="alert">
                {error}
              </div>
            )}
            {reservations.length > 0 && (
              <div className="mt-5">
                <h3 className="text-center">Reservation Details:</h3>
                <hr></hr>
                <table className="table table-striped accordion-accordion-accordion-header">
                  <thead>
                    <tr>
                      <th className="table-heading">Name</th>
                      <th className="table-heading">Mobile Number</th>
                      <th className="table-heading">Email</th>
                      <th className="table-heading">Party Size</th>
                      <th className="table-heading">Reservation Date</th>
                      <th className="table-heading">Reservation Time</th>
                      <th className="table-heading">Reserved at</th>
                      <th className="table-heading">Special Requests</th>
                      <th className="table-heading">Reservation Status</th>
                      <th className="table-heading">Cancel Reservation</th>{" "}
                      {/* New column for cancel button */}
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation, index) => {
                      // Create a new Date object for display
                      const correctedDate = new Date(
                        reservation.reservationDate
                      );
                      correctedDate.setDate(correctedDate.getDate() + 1);

                      return (
                        <tr key={index}>
                          <td className="text-center">
                            {reservation.customerName}
                          </td>
                          <td className="text-center">
                            {reservation.customerMobile}
                          </td>
                          <td className="text-center">
                            {reservation.customerEmail}
                          </td>
                          <td className="text-center">
                            {reservation.partySize}
                          </td>
                          <td className="text-center">
                            {/* Display the next day */}
                            {format(correctedDate, "dd/MM/yyyy")}
                          </td>
                          <td className="text-center">
                            {reverseFormatTime(reservation.reservationTime)}
                          </td>
                          <td className="text-center">
                            {format(
                              reservation.timeSubmitted,
                              "dd/MM/yyyy hh:mm:ss"
                            )}
                          </td>
                          <td className="text-center">
                            {reservation.specialRequests}
                          </td>
                          <td className="text-center">
                            {reservation.reservationStatus === "PENDING" ? (
                              <strong>
                                <i>PENDING</i>{" "}
                                <IoWarning size={25} color="orange" />
                              </strong>
                            ) : reservation.reservationStatus ===
                              "CONFIRMED" ? (
                              <strong>
                                <i>CONFIRMED</i>{" "}
                                <GiConfirmed size={25} color="green" />
                              </strong>
                            ) : reservation.reservationStatus ===
                              "CANCELLED" ? (
                              <strong>
                                <i>CANCELLED</i>{" "}
                                <MdCall size={25} color="red" />
                              </strong>
                            ) : (
                              <strong>
                                <i>REJECTED</i>{" "}
                                <IoWarning size={25} color="red" />
                              </strong>
                            )}
                          </td>
                          <td className="text-center">
                            {reservation.reservationStatus !== "CANCELLED" &&
                              reservation.reservationStatus !== "REJECTED" && (
                                <button
                                  className="btn btn-danger"
                                  onClick={() => {
                                    setShowConfirmationModal(true);
                                    setReservationIdToCancel(
                                      reservation.reservationId
                                    );
                                    setReservationDate(correctedDate);
                                  }}
                                >
                                  Cancel
                                </button>
                              )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {reservations.length > 0 && (
                  <>
                    <div>
                      <p className="text-center">
                        <b>Note: </b>
                        Please contact the Restaurant if you have any queries
                        regarding the Reservation Status.
                      </p>
                    </div>
                    <div>
                      <p className="text-center">
                        <MdCall size="25px" color="red" />
                        7043106783 <AiOutlineMail size="25px" color="red" />
                        servesync@gmail.com
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            <ConfirmationModal
              show={showConfirmationModal}
              handleClose={() => setShowConfirmationModal(false)}
              handleConfirm={() =>
                handleCancelReservation(reservationIdToCancel)
              } // Pass as a callback
              title="Cancel Table Reservation"
              message={`Are you sure you want to cancel your Reservation?<br>Once the reservation is cancelled, you cannot undo the action and re-booking is subject to availiblity.</br>`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckReservationStatus;
