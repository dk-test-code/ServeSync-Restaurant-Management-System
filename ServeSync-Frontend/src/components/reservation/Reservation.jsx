import { useState, useEffect } from "react";
import axios from "axios";
import AdminSideBar from "../AdminSideBar";
import AdminNavBar from "../AdminNavBar";
import { format } from "date-fns";
import "./Reservation.css";

const Reservation = () => {
  const [reservation, setReservation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch reservation data from the API
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/customer/reservations"
        );
        setReservation(response.data);
        // Hide loading after 1 second
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        // If there's an error, still hide loading after 1 second
      }
    };

    fetchReservations();
  }, []);
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
      <AdminNavBar />
      <div className="container-fluid" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          <AdminSideBar />
          <main
            role="main"
            className="col-md-9 ml-sm-auto col-lg-10 px-4 d-flex justify-content-center align-items-center"
          >
            {loading ? (
              // Show loading spinner
              <div className="d-flex align-items-center">
                <span style={{ color: "white", fontSize: "24px" }}>
                  Loading...
                </span>
                <div className="spinner-border text-primary m-4" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              // Show table when loading is false
              <div>
                <h1>Reservations</h1>
                <table className="table table-striped-columns accordion-item">
                  <thead>
                    <tr>
                      <th className="table-heading">Name</th>
                      <th className="table-heading">Mobile Number</th>
                      <th className="table-heading">Email</th>
                      <th className="table-heading">Party Size</th>
                      <th className="table-heading">Reservation Date</th>
                      <th className="table-heading">Reservation Time</th>
                      <th className="table-heading">Special Requests</th>
                      <th className="table-heading">Posted Date</th>
                      <th className="table-heading">Assigned Table</th>
                      <th className="table-heading">Reservation Status</th>
                      <th className="table-heading">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservation.map((reservation) => {
                      const correctedDate = new Date(
                        reservation.reservationDate
                      );
                      correctedDate.setDate(correctedDate.getDate() + 1);
                      return (
                        <tr key={reservation.id}>
                          <td>{reservation.customerName}</td>
                          <td>{reservation.customerMobile}</td>
                          <td>{reservation.customerEmail}</td>
                          <td>{reservation.partySize}</td>
                          <td>{format(correctedDate, "dd/MM/yyyy")}</td>
                          <td>
                            {reverseFormatTime(reservation.reservationTime)}
                          </td>
                          <td>{reservation.specialRequests}</td>
                          <td>
                            {format(
                              reservation.timeSubmitted,
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </td>
                          <td>{reservation.assignedTable}</td>
                          <td>{reservation.reservationStatus}</td>
                          <td></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Reservation;
