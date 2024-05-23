import React from "react";
import "./BookingConfirmation.scss";
import logo from "../../assets/logo.png";
const BookingConfirmation = ({ isOpen, details, onClose }) => {
  const [animation, setAnimation] = React.useState(isOpen ? "slide-up" : "");

  React.useEffect(() => {
    if (isOpen) {
      setAnimation("slide-up");
    } else {
      setAnimation(""); // Remove animation class on close
    }
  }, [isOpen]); // Update animation state on isOpen change

  if (!isOpen) return null; // Early return if not open

  return (
    <div className={`bookingConfirmationPopup__container ${animation}`}>
      <div className="popup-inner">
        <header className="popup-header">
          <img src={logo} alt="Company Logo" className="company-logo" />
          <h1>
            <strong>Booking confirmation</strong>
          </h1>
          <hr></hr>
        </header>
        <div className="popup-content">
          <div className="booking-details-card">
            <h3>
              <b>Booking Details</b>
            </h3>
            <p>
              <strong>Hall Name:</strong> {details.hallName}
            </p>
            <p>
              <strong>City:</strong> {details.city}
            </p>
            <p>
              <strong>Address:</strong> {details.address}
            </p>
            <div className="details-container">
              <div className="detail-box">
                <p>
                  <strong>Veg Rate:</strong>
                </p>
                <p>{details.vegRate}</p>
              </div>
              <div className="detail-box">
                <p>
                  <strong>Non-Veg Rate:</strong>
                </p>
                <p>{details.nonVegRate}</p>
              </div>
              <div className="detail-box">
                <p>
                  <strong>Date:</strong>
                </p>
                <p>{details.date}</p>
              </div>
              <div className="detail-box">
                <p>
                  <strong>Time:</strong>
                </p>
                <p>{details.time}</p>
              </div>
            </div>
          </div>
          <div className="customer-details-card">
            <h3>
              <b>Customer Details</b>
            </h3>
            <p>
              <strong>Name:</strong> {details.customerName}
            </p>
            <p>
              <strong>Address:</strong> {details.customerAddress}
            </p>
            <p>
              <strong>Mobile Number:</strong> {details.mobileNumber}
            </p>
          </div>
        </div>
        <div className="button">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onClose}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
