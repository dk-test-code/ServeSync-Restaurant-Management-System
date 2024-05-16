import { useState } from "react";
import axios from "axios";
import CustomerNavBar from "./CustomerNavBar";
import DatePicker from "react-datepicker";
import { format, addMinutes } from "date-fns"; // Import necessary functions from date-fns
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { MdAccessTime } from "react-icons/md";
import { TbCalendarCheck } from "react-icons/tb";
import { toast, ToastContainer } from "react-toastify";
import { BsTable } from "react-icons/bs";
import "./ReserveTable.css";
import ConfirmationModal from "../common/ConfirmationModal";
const ReserveTable = () => {
  const [step, setStep] = useState(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: new Date(),
    timeSlot: "", // Initialize with an empty string
    selectedCategory: "", // Initialize with an empty string
    partySize: 0, // Initialize party size with 0
    guestName: "", // Initialize guest name
    mobileNumber: "", // Initialize mobile number
    email: "", // Initialize email
    showSpecialRequest: false, // Initialize special request visibility
    specialRequest: "", // Initialize special request text
  });
  const isStep1Valid = () => {
    return (
      reservationData.date &&
      reservationData.timeSlot &&
      reservationData.selectedCategory &&
      reservationData.partySize > 0 &&
      reservationData.partySize <= 20
    );
  };

  const isStep2Valid = () => {
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      reservationData.guestName.length > 0 &&
      reservationData.guestName.length <= 20 &&
      reservationData.mobileNumber.length === 10 &&
      validEmailRegex.test(reservationData.email) &&
      reservationData.specialRequest.length <= 100
    );
  };

  // Function to format time
  const formatTime = (timeSlot) => {
    const [hoursMinutes, ampm] = timeSlot.split(" "); // Split time slot
    const [hours, minutes] = hoursMinutes.split(":"); // Split hours and minutes
    let formattedHours = parseInt(hours, 10); // Parse hours as integer

    if (ampm === "PM" && formattedHours !== 12) {
      // If PM and not 12 PM, add 12 hours
      formattedHours += 12;
    } else if (ampm === "AM" && formattedHours === 12) {
      // If AM and 12 AM, set hours to 0
      formattedHours = 0;
    }

    // Format time with leading zeros and return
    return `${formattedHours.toString().padStart(2, "0")}:${minutes}:00`;
  };

  // Function to generate time slots
  const generateTimeSlots = (label, startTime, endTime) => {
    const timeSlots = [];
    const currentTime = new Date();
    let time = new Date();
    time.setHours(startTime, 0, 0, 0);

    while (time.getHours() < endTime) {
      if (reservationData.date.getDate() === currentTime.getDate()) {
        if (time > addMinutes(currentTime, 30)) {
          const formattedTime = format(time, "hh:mm aa");
          timeSlots.push({
            label,
            time: formattedTime,
          });
        }
      } else {
        const formattedTime = format(time, "hh:mm aa");
        timeSlots.push({
          label,
          time: formattedTime,
        });
      }
      time = addMinutes(time, 30);
    }
    return timeSlots;
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleChangeTimeSlot = (timeSlot) => {
    setReservationData((prevData) => ({
      ...prevData,
      timeSlot,
    }));
  };

  const handleSelectCategory = (category) => {
    setReservationData((prevData) => ({
      ...prevData,
      selectedCategory: category,
    }));
  };

  const handlePartySizeChange = (increment) => {
    setReservationData((prevData) => ({
      ...prevData,
      partySize: increment ? prevData.partySize + 1 : prevData.partySize - 1,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Time slot:", reservationData.timeSlot);
      const formattedDate = format(reservationData.date, "yyyy-MM-dd");
      const formattedTime = formatTime(reservationData.timeSlot); // Format time
      const response = await axios.post(
        "http://localhost:8080/customer/reservations",
        {
          reservationDate: formattedDate,
          reservationTime: formattedTime,
          partySize: reservationData.partySize,
          customerName: reservationData.guestName,
          customerMobile: reservationData.mobileNumber,
          customerEmail: reservationData.email,
          specialRequests: reservationData.specialRequest,
          timeSubmitted: new Date(),
        }
      );
      console.log("Reservation created:", response.data);
      toast.success("Reservation made successfully");
      setShowConfirmationModal(false);
      setStep(1);
      setReservationData({
        date: new Date(),
        timeSlot: "",
        selectedCategory: "",
        partySize: 0,
        guestName: "",
        mobileNumber: "",
        email: "",
        showSpecialRequest: false,
        specialRequest: "",
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };

  // Generate time slots for each category
  const breakfastSlots = generateTimeSlots("Breakfast", 8, 12);
  const lunchSlots = generateTimeSlots("Lunch", 12, 17);
  const dinnerSlots = generateTimeSlots("Dinner", 17, 22);

  // Check if there are available time slots for each category
  const isBreakfastAvailable = breakfastSlots.length > 0;
  const isLunchAvailable = lunchSlots.length > 0;
  const isDinnerAvailable = dinnerSlots.length > 0;
  return (
    <>
      <CustomerNavBar />
      <ToastContainer />
      <div className="background-overlay1">
        <div className="container mt-5">
          <div
            className="card p-3"
            style={{ width: "500px", margin: "0 auto" }}
          >
            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowConfirmationModal(true);
                }}
              >
                <div className="mb-3 align-content-center text-center m-2">
                  <h2 className="m-1">
                    Make a Reservation <BsTable size="30px" color="blue" />
                  </h2>
                  <label htmlFor="datePicker" className="form-label mt-3">
                    <b>Select Date:</b>
                  </label>
                  <div>
                    <DatePicker
                      id="datePicker"
                      selected={reservationData.date}
                      onChange={(date) =>
                        setReservationData((prevData) => ({
                          ...prevData,
                          date,
                        }))
                      }
                      minDate={new Date()}
                      maxDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // 7 days from today
                      dateFormat="dd/MM/yyyy"
                      className="form-control text-center"
                    />
                  </div>
                </div>
                <div className="mb-3 text-center">
                  <label className="form-label mt-2">
                    <b>Select Time:</b>
                  </label>
                  <p>Choose an available time slot and category.</p>
                  <div className="d-flex justify-content-center">
                    <select
                      className="form-select me-3"
                      value={reservationData.selectedCategory}
                      onChange={(e) => handleSelectCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {isBreakfastAvailable && (
                        <option value="Breakfast">Breakfast</option>
                      )}
                      {isLunchAvailable && <option value="Lunch">Lunch</option>}
                      {isDinnerAvailable && (
                        <option value="Dinner">Dinner</option>
                      )}
                    </select>
                    <select
                      className="form-select me-3"
                      value={reservationData.timeSlot}
                      onChange={(e) => handleChangeTimeSlot(e.target.value)}
                    >
                      <option value="">Select Time</option>
                      {reservationData.selectedCategory === "Breakfast" &&
                        breakfastSlots.map((slot, index) => (
                          <option key={index} value={slot.time}>
                            {slot.time}
                          </option>
                        ))}
                      {reservationData.selectedCategory === "Lunch" &&
                        lunchSlots.map((slot, index) => (
                          <option key={index} value={slot.time}>
                            {slot.time}
                          </option>
                        ))}
                      {reservationData.selectedCategory === "Dinner" &&
                        dinnerSlots.map((slot, index) => (
                          <option key={index} value={slot.time}>
                            {slot.time}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3 text-center">
                  <label className="form-label mt-3">
                    <b>Party Size:</b>
                  </label>
                  <p>
                    Enter the number of guests going to come <i>(Max: 20).</i>
                  </p>
                  <div className="input-group">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handlePartySizeChange(false)}
                      disabled={reservationData.partySize === 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control party-size-input text-center"
                      value={reservationData.partySize}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handlePartySizeChange(true)}
                      disabled={reservationData.partySize === 20}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-primary align-content-center m-4"
                    onClick={handleNextStep}
                    disabled={!isStep1Valid()}
                  >
                    Next
                  </button>
                </div>
              </form>
            )}
            {step === 2 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowConfirmationModal(true);
                }}
              >
                {/* Display selected date and time from the first step */}
                <div className="selected-details">
                  <p>
                    <TbCalendarCheck
                      size="30px"
                      color="blue"
                      style={{ marginLeft: "10px", width: "30px" }}
                    />{" "}
                    {reservationData.date.toLocaleDateString()}
                    <MdAccessTime
                      size="30px"
                      color="blue"
                      style={{ marginLeft: "60px", width: "30px" }}
                    />{" "}
                    {reservationData.timeSlot}
                    <BsFillPersonFill
                      size="30px"
                      color="blue"
                      style={{ marginLeft: "90px", width: "30px" }}
                    />{" "}
                    x {reservationData.partySize}
                  </p>
                </div>
                <div className="mb-3 text-center">
                  <label className="form-label mt-3">
                    <b>Personal Information</b>
                  </label>
                  <p>Please provide your contact details.</p>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Name"
                      value={reservationData.guestName}
                      onChange={(e) =>
                        setReservationData((prevData) => ({
                          ...prevData,
                          guestName: e.target.value.slice(0, 20), // Limit name to 20 characters
                        }))
                      }
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Mobile Number"
                      value={reservationData.mobileNumber}
                      onChange={(e) => {
                        const mobileNum = e.target.value.slice(0, 10); // Limit mobile number to 10 digits
                        if (/^\d{0,10}$/.test(mobileNum)) {
                          // Check if it's a valid mobile number
                          setReservationData((prevData) => ({
                            ...prevData,
                            mobileNumber: mobileNum,
                          }));
                        }
                      }}
                    />
                    <input
                      type="email"
                      className="form-control mb-2"
                      placeholder="Email"
                      value={reservationData.email}
                      onChange={(e) =>
                        setReservationData((prevData) => ({
                          ...prevData,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input mt-2">
                        Special Requests (Optional)
                      </span>
                      <button
                        className={`btn ${
                          reservationData.showSpecialRequest ? "d-none" : ""
                        }`}
                        type="button"
                        onClick={() =>
                          setReservationData((prevData) => ({
                            ...prevData,
                            showSpecialRequest: true,
                          }))
                        }
                      >
                        <AiOutlinePlusCircle />
                      </button>
                    </div>
                    {reservationData.showSpecialRequest && (
                      <textarea
                        className="form-control mt-2"
                        rows="3"
                        placeholder="Enter special requests (if any)"
                        value={reservationData.specialRequest.slice(0, 100)} // Limit special request to 100 characters
                        onChange={(e) =>
                          setReservationData((prevData) => ({
                            ...prevData,
                            specialRequest: e.target.value.slice(0, 100), // Limit special request to 100 characters
                          }))
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-primary align-content-center m-4"
                    onClick={handlePrevStep}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary align-content-center m-4"
                    disabled={!isStep2Valid()}
                    onClick={() => {
                      setShowConfirmationModal(true);
                    }}
                  >
                    Reserve Table
                  </button>
                </div>
              </form>
            )}
            <ConfirmationModal
              show={showConfirmationModal}
              handleClose={() => setShowConfirmationModal(false)}
              handleConfirm={handleSubmit}
              title="Reserve Table"
              message={`Reserving Table for <strong>${
                reservationData.partySize
              }</strong> guests on <strong>${format(
                reservationData.date,
                "dd/MM/yyyy"
              )}</strong> at <strong>${reservationData.timeSlot}</strong>
              <br/>
              <br/><strong>Email Id: ${reservationData.email}
              <br/>Mobile No: ${reservationData.mobileNumber}</strong>
              <br/><br/><strong>Note:</strong>Please verify your email id and mobile number as these will used for further updates regarding your reservation.`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReserveTable;
