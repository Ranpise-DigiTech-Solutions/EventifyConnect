import React, { useState } from 'react';
import axios from 'axios';
import './OrderDetailsPage.scss';
import logo from '../../assets/logo.png';
import defualtImage from '../../assets/upload-photo-here.jpg';
import { useNavigate } from "react-router-dom";
import emailjs from 'emailjs-com';
import { FaWifi, FaUtensils, FaParking, FaArrowRight, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaHotel, FaUsers, FaClock, FaCarSide, FaBed, FaCommentAlt } from 'react-icons/fa';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
const OrderDetailsPage = ({ order,userId, onClose, userType ,fetchBookings}) => {
  const [curSlide, setCurSlide] = useState(0);
  const [bookingStatus, setBookingStatus] = useState(order.bookingStatus);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [newStatus, setNewStatus] = useState(order.bookingStatus);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const service_id='service_nmoyi47',template_id='template_d5o97qu',user_id='prncI_jPtqNaIhhhU';
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [showRemarksDialog, setShowRemarksDialog] = useState(false);
  const [eventName, setEventName] = useState('');


  const fetchEventName = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/eventify_server/eventTypes/getEventName/${order.eventId}`);
      const  eventName = response.data.eventName;
      setEventName(eventName);
    } catch (error) {
      console.error('Error fetching event name:', error);
    }
  };
  
  fetchEventName();
  const handleViewDetails = () => {
    navigate(`/DescriptionPage?hallId=${order.hallData._id}`);
  };
  console.log(eventName);
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

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'REJECTED') {
      setNewStatus(newStatus);
      setSelectedOption(newStatus);
    } else {
      setNewStatus(newStatus);
      setSelectedOption(newStatus);
    }
  };
  const handleRejectWithRemarks = async (remarks) => {
    try {
      await updateBookingToReject(order._id, remarks);
      setShowRemarksDialog(false);
      setShowSuccessDialog(true);
      setSelectedOption(null);
      setRemarks('');
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
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
      sendEmail("CONFIRMED");
      fetchBookings();
  
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };
  

  const updateBookingToReject = async (bookingId, remarks) => {
    try {
   
      await axios.put(`http://localhost:8000/eventify_server/bookingMaster/${bookingId}`, {
        bookingStatus: 'REJECTED',
        remarks: remarks,
      });

      sendEmail("REJECTED",remarks);
   
      fetchBookings();
   
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handleSaveStatus = () => {
   
      setShowConfirmationDialog(true);
  
 
};
const confirmStatusChange = async () => {
  setShowConfirmationDialog(false);

  try {
    if (newStatus === 'CONFIRMED') {
      await updateBookingToconfirm(order._id);
      setShowSuccessDialog(true);
    
    } 
    else if (newStatus === 'REJECTED') {
      setShowRemarksDialog(true);
    }else if (newStatus === 'ONHOLD') {
      await updateBookingToOnHold(order._id);
      setShowSuccessDialog(true);
    }
    
  } catch (error) {
    console.error('Error updating booking status:', error);
  }
};

const sendEmail=(bookinStatus,remarks)=>{
  // Send email to the customer
  const customerEmail = order.customerData.customerEmail;
  const vendorEmail=order.vendorData.vendorEmail;
  const bookingDetails = {
    to_name: order.customerData.customerName, // Replace with the customer's name
    from_name: order.vendorData.vendorName, // Replace with the vendor's name
    customerName: order.customerData.customerName, // Customer's name for the email content
    hallName: order.hallData.hallName, // Hall name for the email content
    bookingId:order.documentId,
    bookingDateTime : new Date(order.createdAt).toLocaleString(),
    bookedDateTime: new Date(order.bookingStartDateTimestamp).toLocaleString(), 
    bookingType: order.bookingType, // Booking type for the email content
    bookingDuration: order.bookingDuration, // Booking duration for the email content
    guestsCount: order.guestsCount, // Guests count for the email content
    roomsCount: order.roomsCount, // Rooms count for the email content
    vehiclesCount: order.vehiclesCount, // Vehicles count for the email content
    parkingRequirement: order.parkingRequirement ? 'Yes' : 'No', // Parking requirement for the email content
    vendorName: order.vendorData.vendorName, // Vendor name for the email content
    bookingStatus:bookinStatus,
    eventType:eventName,
    Address:getCompleteHallAddress(order),
    remark:remarks,
};

const emailParams = {
  service_id: service_id,
  template_id: template_id,
  user_id: user_id,
  template_params: {
    to_email: customerEmail,
    from_email: vendorEmail, // Add the vendor's email address here
    ...bookingDetails,
  },
};
emailjs.send(emailParams.service_id, emailParams.template_id, emailParams.template_params, emailParams.user_id)
.then((response) => {
  console.log('Email sent successfully', response.status, response.text);
})
.catch((error) => {
  console.error('Failed to send email', error);
});
}
  const updateBookingToOnHold = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8000/eventify_server/bookingMaster/${bookingId}`, {
        bookingStatus: 'ONHOLD',
      });
     sendEmail("ONHOLD");
      // Refetch bookings after updating to PENDING
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking to PENDING:', error);
    }
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
          <p><FaCalendarAlt /><strong>Event Type:</strong> {eventName || "Not defined"}</p>
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
          <p><FaCalendarAlt /><strong>Event Type:</strong> {eventName || "Not defined"}</p>
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

  const trimEd = (status) => {
    if (status.endsWith('ED')) {
      return status.slice(0, -2);
    }
    return status;
  };
  return (
    <div className="custom-order-detail-page__container">
    <Dialog open={showRemarksDialog} onClose={() => setSelectedOption(null)}>
  <DialogTitle>Enter Remarks</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Remarks"
      multiline
      rows={4}
      fullWidth
      value={remarks}
      onChange={(e) => setRemarks(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => handleRejectWithRemarks(remarks)}>Confirm</Button>
  </DialogActions>
</Dialog>

      <Dialog
  open={showConfirmationDialog}
  onClose={() => setShowConfirmationDialog(false)}
  aria-labelledby="confirmation-dialog-title"
  aria-describedby="confirmation-dialog-description"
>
  <DialogTitle id="confirmation-dialog-title">
    {"Booking Status change"}
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="confirmation-dialog-description">
      {`Are you sure you want to ${trimEd(newStatus.toLowerCase())} this booking?`}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowConfirmationDialog(false)}>Cancel</Button>
    <Button onClick={confirmStatusChange} autoFocus>
      Proceed
    </Button>
  </DialogActions>
</Dialog>

{/* Success Dialog */}
<Dialog
  open={showSuccessDialog}
  onClose={() => setShowSuccessDialog(false)}
  aria-labelledby="success-dialog-title"
  aria-describedby="success-dialog-description"
>
  <DialogTitle id="success-dialog-title">
    {"Booking Status Updated"}
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="success-dialog-description">
      {`The booking status has been updated to ${newStatus}.`}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => {
      setShowSuccessDialog(false);
      setShowStatusDropdown(false);
      fetchBookings();
    }} autoFocus>
      OK
    </Button>
  </DialogActions>
</Dialog>
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