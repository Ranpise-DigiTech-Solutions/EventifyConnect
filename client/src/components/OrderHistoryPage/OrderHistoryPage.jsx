import React, { useState, useEffect } from 'react';
import OrderDetailsPage from '../OrderDetailsPage/OrderDetailsPage';
import './OrderHistoryPage.scss';
import axios from 'axios';

import { useSelector } from "react-redux";
import AdminBookingCard from './AdminBookingCard.jsx';
import VendorBookingCard from './VendorBookingCard.jsx';
import CustomerBookingCard from './CustomerBookingCard.jsx';

const OrderHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userInfoStore = useSelector((state) => state.userInfo);
  const userType = userInfoStore.userDetails.userType;
  const userId = userInfoStore.userDetails.Document._id;
  
  
    const fetchBookings = async () => {
      try {
        let AllBookingResponse = await axios.get('http://localhost:8000/eventify_server/bookingMaster/');
        let confirmedResponse = await axios.get('http://localhost:8000/eventify_server/hallBookingMaster/');
        const hallsResponse = await axios.get('http://localhost:8000/eventify_server/hallMaster/');
        const customersResponse = await axios.get('http://localhost:8000/eventify_server/customerMaster/');
        const vendorResponse=await axios.get('http://localhost:8000/eventify_server/serviceProviderMaster/');
        const hallsData = hallsResponse.data;
        const customersData = customersResponse.data;
        const vendorsData=vendorResponse.data;
        const bookingsWithHallAndCustomerInfo = AllBookingResponse.data.map((booking) => {
          const hallData = hallsData.find((hall) => hall._id === booking.hallId);
          const customerData = customersData.find((customer) => customer._id === booking.customerId);
          const serviceProvider=vendorsData.find((vendor) => vendor._id === booking.hallUserId);
          console.log(serviceProvider);
          return {
            ...booking,
            hallData: hallData ? hallData : '',
            customerData: customerData ? customerData : '',
            vendorData: serviceProvider? serviceProvider : '',
          };
        });
  
        const confirmedBookingsWithHallAndCustomerInfo = confirmedResponse.data.map((booking) => {
          const hallData = hallsData.find((hall) => hall._id === booking.hallId);
          const customerData = customersData.find((customer) => customer._id === booking.customerId);
          const serviceProvider=vendorsData.find((vendor) => vendor._id === booking.hallUserId);
          return {
            ...booking,
            hallData: hallData ? hallData : '',
            customerData: customerData ? customerData : '',
            vendorData: serviceProvider? serviceProvider : '',
          };
        });
  
        if (userType === 'ADMIN') {
          setBookings(bookingsWithHallAndCustomerInfo);
          setConfirmedBookings(confirmedBookingsWithHallAndCustomerInfo);
        } else if (userType === 'VENDOR') {
          const vendorPendingBookingsData = bookingsWithHallAndCustomerInfo.filter(
            (booking) => booking.hallUserId === userId && ((booking.bookingStatus == 'PENDING')||( booking.bookingStatus === "ONHOLD"))
          );
          const vendorCanceledBookingsData = bookingsWithHallAndCustomerInfo.filter(
            (booking) => booking.hallUserId === userId && booking.bookingStatus === 'REJECTED'
          );
          const vendorBookings = vendorPendingBookingsData.concat(vendorCanceledBookingsData);
          setBookings(vendorBookings);
  
          const vendorConfirmedBookings = confirmedBookingsWithHallAndCustomerInfo.filter(
            (booking) => booking.hallUserId === userId
          );
          setConfirmedBookings(vendorConfirmedBookings);
        } else if (userType === 'CUSTOMER') {
          const customerPendingBookingsData = bookingsWithHallAndCustomerInfo.filter(
            (booking) => booking.customerId === userId &&((booking.bookingStatus == 'PENDING')||( booking.bookingStatus === "ONHOLD"))
          );
          const customerCanceledBookingsData = bookingsWithHallAndCustomerInfo.filter(
            (booking) => booking.customerId === userId && booking.bookingStatus === 'REJECTED'
          );
          const customerBookings = customerPendingBookingsData.concat(customerCanceledBookingsData);
          setBookings(customerBookings);
  
          const customerConfirmedBookings = confirmedBookingsWithHallAndCustomerInfo.filter(
            (booking) => booking.customerId === userId
          );
          setConfirmedBookings(customerConfirmedBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
  
 
  useEffect(() => {
    fetchBookings();
  }, [userType, userId]);
  

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleClosePopup = () => {
    setSelectedOrder(null);
  };

  const renderBookingCard = (order, isConfirmed) => {
    const bookingStatus = isConfirmed ? 'CONFIRMED' : order.bookingStatus;

    if (userType === 'ADMIN') {
      return <AdminBookingCard order={order} bookingStatus={bookingStatus} />;
    } else if (userType === 'VENDOR') {
      return (
        <VendorBookingCard
          order={order}
          bookingStatus={bookingStatus}
          onViewDetails={handleViewDetails}
        />
      );
    } else if (userType === 'CUSTOMER') {
      return (
        <CustomerBookingCard
          order={order}
          bookingStatus={bookingStatus}
          onViewDetails={handleViewDetails}
        />
      );
    }
  };

  return (
    <div className="order-history-page">
      <div className="order-history-panel">
        <div className="order-history">
          <h2>Booking History</h2>
          {bookings.length === 0 && confirmedBookings.length === 0 ? (
            <p>No booking history available.</p>
          ) : (
            <div className="order-list">
              {[...bookings, ...confirmedBookings].map((order) => {
                const isConfirmed = confirmedBookings.some((confirmedBooking) => confirmedBooking._id === order._id);
                return renderBookingCard(order, isConfirmed);
              })}
            </div>
          )}
          {selectedOrder && (
            <OrderDetailsPage order={selectedOrder} onClose={handleClosePopup} userType={userType} userId={userId} fetchBookings={fetchBookings}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;