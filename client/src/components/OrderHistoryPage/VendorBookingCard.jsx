import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import AlertDialogSlide from '../../sub-components/Alertwindow/Popup'; // Import the AlertDialogSlide component

const VendorBookingCard = ({ order, bookingStatus, onViewDetails }) => {
 

  

  return (
    <div className={`order-card ${bookingStatus.toLowerCase()}`}>
      <div className="order-info">
        <div>
          <div className="book-id">
            <strong>Booking ID: </strong>
            {order.documentId}
          </div>
          <div className="customer-name">
            <strong>Customer Name:</strong> {order.customerData.customerName}
          </div>
          <div className="date">
           <strong>Booked Date:</strong>{' '}
            {new Date(order.bookingStartDateTimestamp).toLocaleDateString()}
          </div>
          <div className="time">
           <strong>Booked Time:</strong>{' '}
           {new Date(order.bookingStartDateTimestamp).toLocaleTimeString()}
          </div>
          <div className="date-time">
            <strong>Date of booking:</strong>{' '}
            {new Date(order.createdAt).toLocaleString()}
          </div>
          <div className={`status ${bookingStatus.toLowerCase()}`}>
            {bookingStatus === 'CONFIRMED' && (
              <FaCheckCircle className="status-icon" />
            )}
            {bookingStatus === 'PENDING' && (
              <FaExclamationCircle className="status-icon" />
            )}
            {bookingStatus === 'ONHOLD' && (
              <FaExclamationCircle className="status-icon" />
            )}
            {bookingStatus === 'REJECTED' && (
              <FaTimesCircle className="status-icon" />
            )}
            <span className="status-text">{bookingStatus}</span>
          </div>
          
          <button className="view-btn" onClick={() => onViewDetails(order)}>
            View Details
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default VendorBookingCard;
