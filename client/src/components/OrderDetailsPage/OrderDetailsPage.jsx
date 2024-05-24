import React, { useState } from 'react';
import axios from 'axios';
import './OrderDetailsPage.scss';
import logo from '../../assets/logo.png';
import defualtImage from '../../assets/upload-photo-here.jpg';
import { useNavigate } from "react-router-dom";
import emailjs from 'emailjs-com';
import { FaWifi, FaUtensils, FaParking, FaArrowRight, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaHotel, FaUsers, FaClock, FaCarSide, FaBed, FaCommentAlt } from 'react-icons/fa';

const OrderDetailsPage = ({ order,userId, onClose, userType ,fetchBookings}) => {
  const [curSlide, setCurSlide] = useState(0);
  const [bookingStatus, setBookingStatus] = useState(order.bookingStatus);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [newStatus, setNewStatus] = useState(order.bookingStatus);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
 
  
  const handleViewDetails = () => {
    navigate(`/DescriptionPage?hallId=${order.hallData._id}`);
  };

  const handleStatusChange = (newStatus) => {
    setNewStatus(newStatus);
    setSelectedOption(newStatus); 
  };
  
  const updateBookingToconfirm = async (bookingId) => {
    try {
      // Update the bookingStatus in the bookingMaster table
      const updatedbookingresponse=await axios.put(`http://localhost:8000/eventify_server/bookingMaster/${bookingId}`, {
        bookingStatus: 'CONFIRMED',
      });
     const updatedbooking=updatedbookingresponse.data;
      // Get the confirmed booking data
      const confirmedBookingResponse = await axios.get(`http://localhost:8000/eventify_server/bookingMaster/${bookingId}`);
      const confirmedBooking = confirmedBookingResponse.data;
  
      // Manually add the required fields with default values
      confirmedBooking.finalVehicleCount = updatedbooking.vehiclesCount;
      confirmedBooking.finalHallParkingRequirement = updatedbooking.parkingRequirement;
      confirmedBooking.finalRoomCount = updatedbooking.roomsCount;
      confirmedBooking.finalGuestCount = updatedbooking.guestsCount;
  
      // Post the confirmed booking data to the hallBookingMaster table
      await axios.post('http://localhost:8000/eventify_server/hallBookingMaster/', confirmedBooking);
      fetchBookings();
  
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };
  

  const updateBookingToReject = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8000/eventify_server/bookingMaster/${bookingId}`, {
        bookingStatus: 'REJECTED',
      });
      fetchBookings();
   
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handleSaveStatus = () => {
    setBookingStatus(newStatus);
    setShowStatusDropdown(false);

    if (newStatus === 'CONFIRMED') {
      updateBookingToconfirm(order._id);
    } else if (newStatus === 'REJECTED') {
      updateBookingToReject(order._id);
    } else if (newStatus === 'ONHOLD') {
      // Call a function to update the booking status to PENDING in the database
      updateBookingToOnHold(order._id);
    }
  };

  const updateBookingToOnHold = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8000/eventify_server/bookingMaster/${bookingId}`, {
        bookingStatus: 'ONHOLD',
      });
      // Refetch bookings after updating to PENDING
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking to PENDING:', error);
    }
  };
  const getCompleteHallAddress = (hall) => {
    const addressParts = [
      hall.hallData.hallAddress,
      hall.hallData.hallCity,
      hall.hallData.hallState,
      hall.hallData.hallCountry,
      hall.hallData.hallPincode,
    ];
    return addressParts.filter(Boolean).join(', ');
  };
  const renderVendorDetails = () => {
    return (
      <div className="vendor-details">
        <div className="customer-profile">
          <div className="customer-profile-image">
            <img src={order.customerData.customerProfileImage||defualtImage} alt="Customer Profile" />
          </div>
          <div className="customer-contact-details">
            <h2>Customer Contact Details</h2>
            <p><FaUser /><strong>Name:</strong> {order.customerData.customerName || "Not defined"}</p>
            <p><FaPhone /> <strong>Contact Number:</strong> {order.customerData.customerContact || "Not defined"}</p>
            <p><FaPhone /><strong>Alternative Contact Number:</strong> {order.customerData.customerAlternateMobileNo || "Not defined"}</p>
            <p><FaEnvelope /><strong>Email:</strong> {order.customerData.customerAlternateEmail || "Not defined"}</p>
            <p><FaMapMarkerAlt /><strong>City:</strong> {order.customerData.customerCurrentLocation || "Not defined"}</p>
            <p><FaCalendarAlt /><strong>Date of Booking:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="booking-details">
          <h2>Booking Details</h2>
          <div className='bookingdata-left'>
          <p><FaUsers /><strong>Booking Type:</strong> {order.bookingType || "Not defined"}</p>
          <p><FaClock />
           <strong>Booking Duration:</strong>{order.bookingDuration || "Not defined"}
           </p>
          <p><FaCalendarAlt />
          
           <strong>Booked Date:</strong>{' '}
            {new Date(order.bookingStartDateTimestamp).toLocaleDateString()}
            </p>
            <p><FaClock />
           <strong>Booked Time:</strong>{' '}
           {new Date(order.bookingStartDateTimestamp).toLocaleTimeString()}
           </p>
           <p><FaParking /><strong>Parking Requirement:</strong> {order.parkingRequirement ? 'Yes' : 'No'}</p>
          <p><FaUsers /> <strong>Guests Count:</strong> {order.guestsCount || "Not defined"}</p>
          <p><FaBed /><strong>Rooms Count:</strong> {order.roomsCount || "Not defined"}</p>
          <p><FaCarSide /><strong>Vehicles Count:</strong> {order.vehiclesCount || "Not defined"}</p>
         
          </div>
          <div className='bookingdata-right'>
          <p><FaUtensils /><strong>Book Caterer:</strong> {order.bookCaterer ? 'Yes' : 'No'}</p>
          {order.bookCaterer && (
            <>
              <p><FaUtensils /> <strong>Veg Items List:</strong> {order.customerVegItemsList || 'Not provided'}</p>
              <p><FaUtensils /><strong>Veg Rate:</strong> {order.customerVegRate || 'Not provided'}</p>
              <p><FaUtensils /><strong>Non-Veg Items List:</strong> {order.customerNonVegItemsList || 'Not provided'}</p>
              <p><FaUtensils /><strong>Non-Veg Rate:</strong> {order.customerNonVegRate || 'Not provided'}</p>
            </>
          )}
            </div>
            <p className="customer-suggestion-full-width"><FaCommentAlt /><strong>Customer Suggestion:</strong> {order.customerSuggestion || 'No suggestion provided'}</p>
        </div>
      </div>
    );
  };

  const renderCustomerDetails = () => {
   
    return (
      <div>
        <div className="vendor-profile">
        <div className="vendor-profile-image">
      <img src={order.hallData.hallImages[0]} alt="Hall Photo" />
      </div>
      <div className="vendor-contact-details">
        <h2>Vendor Contact Details</h2>
        <p><FaUser /><strong>Name:</strong> {order.vendorData.vendorName || "Not defined"}</p>
        <p><FaPhone /><strong>Contact Number:</strong> {order.vendorData.vendorContact || "Not defined"}</p>
        <p><FaEnvelope /><strong>Email:</strong> {order.vendorData.vendorEmail || "Not defined"}</p>
        <p><FaMapMarkerAlt /><strong>Address:</strong> {order.vendorData.vendorAddress || "Not defined"}</p>
        <p><FaHotel /><strong>Hall Name:</strong> {order.hallName}</p>
        <p><FaMapMarkerAlt /><strong>Hall Location:</strong> {getCompleteHallAddress(order)}</p>
        <p><FaCalendarAlt /><strong>Date of Booking:</strong> {new Date(order.createdAt).toLocaleString()}</p>
       
        </div>
        </div>
      <div className="booking-details">
      <h2>Booking Details</h2>
          <div className='bookingdata-left'>
          <p><FaUsers /><strong>Booking Type:</strong> {order.bookingType || "Not defined"}</p>
          <p><FaClock />
           <strong>Booking Duration:</strong>{order.bookingDuration || "Not defined"}
           </p>
          <p><FaCalendarAlt />
           <strong>Booked Date:</strong>{' '}
            {new Date(order.bookingStartDateTimestamp).toLocaleDateString()}
            </p>
            <p><FaClock />
           <strong>Booked Time:</strong>{' '}
           {new Date(order.bookingStartDateTimestamp).toLocaleTimeString()}
           </p>
           <p><FaParking /><strong>Parking Requirement:</strong> {order.parkingRequirement ? 'Yes' : 'No'}</p>
          <p><FaUsers /> <strong>Guests Count:</strong> {order.guestsCount || "Not defined"}</p>
          <p><FaBed /><strong>Rooms Count:</strong> {order.roomsCount || "Not defined"}</p>
          <p><FaCarSide /><strong>Vehicles Count:</strong> {order.vehiclesCount || "Not defined"}</p>
         
          </div>
          <div className='bookingdata-right'>
          <p><FaUtensils /><strong>Book Caterer:</strong> {order.bookCaterer ? 'Yes' : 'No'}</p>
          {order.bookCaterer && (
            <>
              <p><FaUtensils /> <strong>Veg Items List:</strong> {order.customerVegItemsList || 'Not provided'}</p>
              <p><FaUtensils /><strong>Veg Rate:</strong> {order.customerVegRate || 'Not provided'}</p>
              <p><FaUtensils /><strong>Non-Veg Items List:</strong> {order.customerNonVegItemsList || 'Not provided'}</p>
              <p><FaUtensils /><strong>Non-Veg Rate:</strong> {order.customerNonVegRate || 'Not provided'}</p>
            </>
          )}
            </div>
            <p className="customer-suggestion-full-width"><FaCommentAlt /><strong>Customer Suggestion:</strong> {order.customerSuggestion || 'No suggestion provided'}</p>
        </div>
      
        <div className="view-details-button" onClick={handleViewDetails}>
                <button>
                  View Full Details
                </button>
        </div>
      </div>   
 
    );
  };

  const renderAdminDetails = () => {
    
    return (
      
      <div>
        <div className="vendor-contact-details">
          <h2>Vendor Contact Details</h2>
          <p><FaUser /><strong>Name:</strong> {order.vendorData.vendorName}</p>
          <p><FaPhone /><strong>Contact Number:</strong> {order.vendorContact}</p>
          <p><FaEnvelope /><strong>Email:</strong> {order.vendorEmail}</p>
          <p><FaMapMarkerAlt /> <strong>Address:</strong> {order.vendorAddress}</p>
          <img src={order.vendorProfileImage} alt="Vendor Profile" />
         
        </div>
        <div className="customer-contact-details">
          <h2>Customer Contact Details</h2>
          <p><FaUser /><strong>Name:</strong> {order.customerName}</p>
          <p><FaPhone /><strong>Contact Number:</strong> {order.customerContact}</p>
          <p><FaEnvelope /><strong>Email:</strong> {order.customerEmail}</p>
          <p><FaMapMarkerAlt /><strong>City:</strong> {order.customerCity}</p>
          <img src={order.customerProfileImage} alt="Customer Profile" />
         
        </div>
        <div className="hall-details">
          <h2>Hall Details</h2>
          <p><FaHotel /><strong>Hall Name:</strong> {order.hallName}</p>
          <p><FaMapMarkerAlt /><strong>Hall Location:</strong> {getCompleteHallAddress(order)}</p>
          
        </div>
      </div>
    );
  };


  return (
    <div className="custom-order-detail-page__container">
      <div className="custom-popup">
        <div className="custom-popup-inner">
          <header className="custom-popup-header">
            <img src={logo} alt="Logo" className="logo" />
            <h1><strong>Booking Details</strong></h1>
            <button className="custom-close-btn" onClick={onClose}>Close</button>
          </header>
          <div className="custom-popup-content">
            <div className='firstHalf'>
              {userType === 'VENDOR' && renderVendorDetails()}
              {userType === 'CUSTOMER' && renderCustomerDetails()}
              {userType === 'ADMIN' && renderAdminDetails()}
            </div>
            <div className="custom-order-info">
              {userType === 'VENDOR' && (
                <div className="status-dropdown">
                  {bookingStatus !== 'CONFIRMED' && (
                    <div className="edit-status" onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
                      <FaEdit className="edit-icon" />
                      <span className="edit-text">Edit Status</span>
                    </div>
                  )}
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
                  {showStatusDropdown && (
                    <div className="status-dropdown-menu">
                      <div className="status-option-container">
                        <div className={`status-option ${selectedOption === 'ONHOLD' ? 'selected' : ''}`} onClick={() => handleStatusChange('ONHOLD')}>
                          <FaExclamationCircle className="status-icon" />
                          <span>On Hold</span>
                        </div>
                        <div className={`status-option ${selectedOption === 'CONFIRMED' ? 'selected' : ''}`}onClick={() => handleStatusChange('CONFIRMED')}>
                          <FaCheckCircle className="status-icon" />
                          <span>Confirm</span>
                        </div>
                        <div className={`status-option ${selectedOption === 'REJECTED' ? 'selected' : ''}`} onClick={() => handleStatusChange('REJECTED')}>
                          <FaTimesCircle className="status-icon" />
                          <span>Reject</span>
                        </div>
                      </div>
                      <div className="status-action-buttons">
                        <button className="save-btn" onClick={handleSaveStatus}>
                          <FaSave className="save-icon" />
                          <span>Save</span>
                        </button>
                        <button className="cancel-btn" onClick={() => setShowStatusDropdown(false)}>
                          <FaTimes className="cancel-icon" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;