import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

const AdminBookingCard = ({ order, bookingStatus }) => {
  return (
    <div className={`order-card ${bookingStatus.toLowerCase()}`}>
      <div className="order-info">
        <div>
          <div className="book-id"><strong>Booking ID: </strong>{order.documentId}</div>
          <div className="hall-name"><strong>Hall Name:</strong> {order.hallName}</div>
          <div className="customer-name"><strong>Customer Name:</strong> {order.customerName}</div>
          <div className="date-time"><strong>Date of booking:</strong> {new Date(order.createdAt).toLocaleString()}</div>
          <div className={`status ${bookingStatus.toLowerCase()}`}>
            {bookingStatus === 'CONFIRMED' && <FaCheckCircle className="status-icon" />}
            {bookingStatus === 'PENDING' && (
              <FaExclamationCircle className="status-icon" />
            )}
            {bookingStatus === 'ONHOLD' && (
              <FaExclamationCircle className="status-icon" />
            )}
            {bookingStatus === 'REJECTED' && <FaTimesCircle className="status-icon" />}
            <span className="status-text">{bookingStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingCard;