/* eslint-disable react-hooks/exhaustive-deps */
import "./BookingHistory.scss";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DatePicker, Tag, Modal, Skeleton, Empty } from "antd";
import TablePagination from "@mui/material/TablePagination";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Images } from "../../../constants";
import { BookingDetailsDialog } from "../../UserProfilePage";
import PropTypes from "prop-types";

const BookingHistory = ({ hallId }) => {
  const userInfoStore = useSelector((state) => state.userInfo);
  const userType = userInfoStore.userDetails.userType || "";
  const vendorType = userInfoStore.userDetails.vendorType || "";

  const { RangePicker } = DatePicker;
  const [anchorElMap, setAnchorElMap] = useState({});

  const [startDate, setStartDate] = useState(new Date()); // represents current date
  const [startDateOfMonth, setStartDateOfMonth] = useState(null); // represents start date of current month
  const [endDateOfMonth, setEndDateOfMonth] = useState(null); // represents end date of current month
  const [userBookings, setUserBookings] = useState([]); // stores all the user bookings according to the given constraints
  const [isPageLoading, setIsPageLoading] = useState(false); // toggle page loading animation
  const [dataSortCriteria, setDataSortCriteria] = useState("bookingStartDate"); // sort the data based on chosen criteria
  const [currentTab, setCurrentTab] = useState("ALL"); // indicates the current tab that the user is viewing - Options = ALL, PENDING, UPCOMING, COMPLETED
  const [reloadData, setReloadData] = useState(false); // to trigger the reload
  const [isBookingDetailsDialogOpen, setIsBookingDetailsDialogOpen] =
    useState(false); // trigger the booking details dialog
  const [selectedBooking, setSelectedBooking] = useState({}); // current booking selection
  const [
    openBookingCancelConfirmationDialog,
    setOpenBookingCancelConfirmationDialog,
  ] = useState(false); // toggle booking cancellation screen
  const [
    openBookingConfirmConfirmationDialog,
    setOpenBookingConfirmConfirmationDialog,
  ] = useState(false); // toggle booking confirmation screen

  const [pageNo, setPageNo] = useState(0); // current page no.
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0); // set it according to data fetched from database

  const handleMoreVertIconClick = (event, booking) => {
    setAnchorElMap({
      ...anchorElMap,
      [booking._id]: event.currentTarget,
    });
    setSelectedBooking(booking); // Set the selected booking
  };

  const handleMoreVertIconClose = () => {
    setAnchorElMap({});
  };
  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleBookingDetailsDialogClose = () => {
    setIsBookingDetailsDialogOpen(false);
    setSelectedBooking({}); // Reset the selected booking
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  const handleBookingCancelConfirmationDialogClose = () => {
    setOpenBookingCancelConfirmationDialog(false);
    handleMoreVertIconClose();
  };

  const handleBookingCancelConfirmationDialogOpen = () => {
    setOpenBookingCancelConfirmationDialog(true);
  };

  const handleBookingConfirmConfirmationDialogOpen = () => {
    setOpenBookingConfirmConfirmationDialog(true);
  };

  const handleBookingConfirmConfirmationDialogClose = () => {
    setOpenBookingConfirmConfirmationDialog(false);
    handleMoreVertIconClose();
  };

  const startOfMonth = (date) => {
    const d = new Date(date);
    d.setDate(1); // Set to the first day of the month
    d.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    return d;
  };

  const endOfMonth = (date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1); // Move to the next month
    d.setDate(0); // Set to the last day of the previous month (current month)
    d.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
    return d;
  };

  // set time of any given date to 00:00:00:000
  const setStartOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // set time of any given date to 23:59:59:999
  const setEndOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  useEffect(() => {
    if (!startDate) {
      return;
    }
    setStartDateOfMonth(startOfMonth(startDate));
    setEndDateOfMonth(endOfMonth(startDate));
  }, [startDate]);

  useEffect(() => {
    if (!startDateOfMonth || !endDateOfMonth) {
      return;
    }

    const getUserBookings = async () => {
      setIsPageLoading(true);

      setTimeout(async () => {
        try {
          console.log(startDateOfMonth, endDateOfMonth);
          const URL =
            userType === "CUSTOMER"
              ? `${
                  import.meta.env.VITE_SERVER_URL
                }/eventify_server/bookingMaster/getUserBookings/?customerId=${
                  userInfoStore.userDetails.Document._id
                }&startDateOfMonth=${startDateOfMonth}&endDateOfMonth=${endDateOfMonth}&page=${pageNo}&limit=${rowsPerPage}&sortCriteria=${dataSortCriteria}&bookingCategory=${currentTab}`
              : vendorType === "Banquet Hall" &&
                `${
                  import.meta.env.VITE_SERVER_URL
                }/eventify_server/bookingMaster/getHallBookings/?hallId=${hallId}&startDateOfMonth=${startDateOfMonth}&endDateOfMonth=${endDateOfMonth}&page=${pageNo}&limit=${rowsPerPage}&sortCriteria=${dataSortCriteria}&bookingCategory=${currentTab}`;
          const response = await axios.get(URL);

          console.log(response.data);
          setUserBookings(response.data[0].bookings);
          setTotalPages(response.data[0].total[0]?.count || 1);

          setIsPageLoading(false);
        } catch (error) {
          console.log("Error fetching bookings:", error);
        }
      }, 2000);
    };

    getUserBookings();
  }, [
    startDateOfMonth,
    endDateOfMonth,
    dataSortCriteria,
    rowsPerPage,
    pageNo,
    reloadData,
    currentTab,
    userInfoStore.userDetails,
  ]);

  // trigger the booking details dialog only after the current selection data is loaded
  // useEffect(()=> {
  //   if(selectedBooking.length === 0) {
  //     return;
  //   }
  //   setIsBookingDetailsDialogOpen(true);
  // }, [selectedBooking])

  const handleDateChange = (dates, dateStrings) => {
    if (!dates || dates.length === 0) {
      setStartDate(new Date());
    } else {
      setStartDateOfMonth(setStartOfDay(dates[0].toDate()));
      setEndDateOfMonth(setEndOfDay(dates[1].toDate()));
    }
  };

  const getFormattedBookingStartDate = (date) => {
    const bookingStDate = new Date(date);
    const month = bookingStDate.getMonth() + 1;
    const day = bookingStDate.getDate();
    const year = bookingStDate.getFullYear();
    return `${day.toString().padStart(2, 0)} / ${month
      .toString()
      .padStart(2, 0)} / ${year}`;
  };

  const handleViewDetailsClick = () => {
    console.log("SELECTED_BOOKING", selectedBooking);
    // setSelectedBooking(selectedBooking);
    setIsBookingDetailsDialogOpen(true);
    handleMoreVertIconClose();
  };

  const handleCancelBooking = async (event) => {
    // Handle cancel booking logic
    event.preventDefault();

    if (!selectedBooking) {
      return;
    }

    setIsPageLoading(true);

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const message = formJson.message;

    const response = await axios.patch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/eventify_server/bookingMaster/updateBookingDetails/${
        selectedBooking._id
      }`,
      {
        bookingStatus: "CANCELLED",
        bookingStatusRemark: message,
      }
    );

    setIsPageLoading(false);
    handleBookingCancelConfirmationDialogClose();
    handleMoreVertIconClose(); // Close menu after action
    setReloadData(!reloadData);
  };

  const handleConfirmBooking = async (event) => {
    event.preventDefault();

    if (!selectedBooking) {
      return;
    }

    setIsPageLoading(true);

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const message = formJson.message;

    const bookingMasterRes = await axios.get(
      `${
        import.meta.env.VITE_SERVER_URL
      }/eventify_server/bookingMaster/fetchBookingById/${selectedBooking._id}`
    );

    const bookingDetails = bookingMasterRes.data;
    const {
      bookingType,
      createdAt,
      updatedAt,
      customerInfo,
      customerNonVegItemsList,
      customerVegItemsList,
      customerNonVegRate,
      customerVegRate,
      guestsCount,
      parkingRequirement,
      roomsCount,
      vehiclesCount,
      _v,
      ...info
    } = bookingDetails;

    // set the status as confirmed in bookingMaster
    await axios.patch(`${import.meta.env.VITE_SERVER_URL}/eventify_server/bookingMaster/updateBookingDetails/${selectedBooking._id}`, {
      bookingStatus: "CONFIRMED",
      bookingStatusRemark: message,
    }); 

    // push the confirmed booking to hallBookingMaster
    await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/eventify_server/hallBookingMaster/`,
      {
        ...info,
        finalVegRate: customerVegRate,
        finalNonVegRate: customerNonVegRate,
        finalVegItemsList: customerVegItemsList,
        finalNonVegItemsList: customerNonVegItemsList,
        finalGuestCount: guestsCount,
        finalHallParkingRequirement: parkingRequirement,
        bookingStatus: "CONFIRMED",
        finalRoomCount: roomsCount,
        finalVehicleCount: vehiclesCount,
        bookingStatusRemark: message,
      }
    );

    setIsPageLoading(false);
    handleBookingConfirmConfirmationDialogClose();
    handleMoreVertIconClose(); // Close menu after action
    setReloadData(!reloadData);
  };

  const BookingItemSkeleton = () => (
    <div className="bookingItem">
      <div className="items-list">
        <div className="item">
          <Skeleton.Input
            style={{ width: 100, backgroundColor: "#666" }}
            active
          />
        </div>
        <div className="item">
          <Skeleton.Input
            style={{ width: 100, backgroundColor: "#666" }}
            active
          />
        </div>
        <div className="item">
          <Skeleton.Input
            style={{ width: 100, backgroundColor: "#666" }}
            active
          />
        </div>
        <div className="item">
          <Skeleton.Input
            style={{ width: 100, backgroundColor: "#666" }}
            active
          />
        </div>
        <div className="item">
          <Skeleton.Input
            style={{ width: 100, backgroundColor: "#666" }}
            active
          />
        </div>
        <div className="item">
          <Skeleton.Input
            style={{ width: 100, backgroundColor: "#666" }}
            active
          />
        </div>
        <div className="item">
          <Skeleton.Button
            style={{ width: 100, backgroundColor: "#666" }}
            active
          />
        </div>
        <div className="item">
          <MoreVertIcon className="menuIcon" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bookingHistory__container">
      {isBookingDetailsDialogOpen && (
        <BookingDetailsDialog
          open={isBookingDetailsDialogOpen}
          handleClose={handleBookingDetailsDialogClose}
          currentBooking={selectedBooking}
          userType={userType}
          vendorType={vendorType}
        />
      )}
      <Dialog
        open={openBookingCancelConfirmationDialog}
        onClose={handleBookingCancelConfirmationDialogClose}
        PaperProps={{
          component: "form",
          onSubmit: handleCancelBooking,
        }}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure, you want to cancel your booking? Please note that this
            action is irreversible.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="message"
            name="message"
            label="Your Message"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBookingCancelConfirmationDialogClose}>
            Cancel
          </Button>
          <Button type="submit">Proceed</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openBookingConfirmConfirmationDialog}
        onClose={handleBookingConfirmConfirmationDialogClose}
        PaperProps={{
          component: "form",
          onSubmit: handleConfirmBooking,
        }}
      >
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure, you want to confirm this booking? Please note that
            this action is irreversible.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="message"
            name="message"
            label="Your Message"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBookingConfirmConfirmationDialogClose}>
            Cancel
          </Button>
          <Button type="submit">Proceed</Button>
        </DialogActions>
      </Dialog>
      <div className="wrapper">
        <div className="secondaryNavbar">
          <div className="items-list">
            <p
              className={`item ${currentTab === "ALL" && "currentTab"}`}
              onClick={() => setCurrentTab("ALL")}
            >
              All Orders
            </p>
            <p
              className={`item ${currentTab === "PENDING" && "currentTab"}`}
              onClick={() => setCurrentTab("PENDING")}
            >
              Pending
            </p>
            <p
              className={`item ${currentTab === "UPCOMING" && "currentTab"}`}
              onClick={() => setCurrentTab("UPCOMING")}
            >
              Upcoming
            </p>
            <p
              className={`item ${currentTab === "COMPLETED" && "currentTab"}`}
              onClick={() => setCurrentTab("COMPLETED")}
            >
              Completed
            </p>
          </div>
          <div className="calendar">
            <RangePicker className="datePicker" onChange={handleDateChange} />
            <button onClick={() => setReloadData(!reloadData)} className="icon">
              <SearchIcon />
            </button>
          </div>
        </div>
        <div className="tagList">
          <div className="tag" onClick={() => setDataSortCriteria("bookingId")}>
            <p>Id</p>
            <ArrowDropDownOutlinedIcon className="icon" />
          </div>
          {userType === "CUSTOMER" ? (
            <>
              <div
                className="tag"
                onClick={() => setDataSortCriteria("hallName")}
              >
                <p>Vendor Name</p>
                <ArrowDropDownOutlinedIcon className="icon" />
              </div>
              <div
                className="tag"
                onClick={() => setDataSortCriteria("vendorType")}
              >
                <p>Vendor</p>
                <ArrowDropDownOutlinedIcon className="icon" />
              </div>
            </>
          ) : (
            <>
              <div
                className="tag"
                onClick={() => setDataSortCriteria("customerName")}
              >
                <p>Cust Name</p>
                <ArrowDropDownOutlinedIcon className="icon" />
              </div>
              <div
                className="tag"
                onClick={() => setDataSortCriteria("customerType")}
              >
                <p>Cust Type</p>
                <ArrowDropDownOutlinedIcon className="icon" />
              </div>
            </>
          )}
          <div className="tag" onClick={() => setDataSortCriteria("eventType")}>
            <p>Event</p>
            <ArrowDropDownOutlinedIcon className="icon" />
          </div>
          <div
            className="tag"
            onClick={() => setDataSortCriteria("bookingStartDate")}
          >
            <p>Booking Date</p>
            <ArrowDropDownOutlinedIcon className="icon" />
          </div>
          <div
            className="tag"
            onClick={() => setDataSortCriteria("bookingDuration")}
          >
            <p>Duration</p>
            <ArrowDropDownOutlinedIcon className="icon" />
          </div>
          <div
            className="tag"
            onClick={() => setDataSortCriteria("bookingStatus")}
          >
            <p>Status</p>
            <ArrowDropDownOutlinedIcon className="icon" />
          </div>
          <div className="tag">Actions</div>
        </div>
        <div className="bookings-wrapper">
          {isPageLoading ? (
            Array.from({ length: rowsPerPage }).map((_, index) => (
              <BookingItemSkeleton key={index} />
            ))
          ) : userBookings.length !== 0 ? (
            userBookings.map((booking, index) => (
              <div className="bookingItem" key={index}>
                <div className="items-list">
                  <div className="item">{booking.documentId}</div>
                  {userType === "CUSTOMER" ? (
                    <>
                      <div className="item">{booking.hallName}</div>
                      <div className="item">{booking.vendorType}</div>
                    </>
                  ) : (
                    <>
                      <div className="item">{booking.customerName}</div>
                      <div className="item">{booking.customerType}</div>
                    </>
                  )}
                  <div className="item">{booking.eventName}</div>
                  <div className="item">
                    {getFormattedBookingStartDate(
                      booking.bookingStartDateTimestamp
                    )}
                  </div>
                  <div className="item">{booking.bookingDuration}</div>
                  <div className="item">
                    {booking.bookingStatus === "CONFIRMED" ? (
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        CONFIRMED
                      </Tag>
                    ) : booking.bookingStatus === "PENDING" ? (
                      <Tag icon={<SyncOutlined spin />} color="processing">
                        PENDING
                      </Tag>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        CANCELLED
                      </Tag>
                    )}
                  </div>
                  <div className="item">
                    <Button
                      id={`basic-button-${index}`} // Ensure unique ID
                      aria-controls={`basic-menu-${index}`} // Ensure unique ID
                      aria-haspopup="true"
                      aria-expanded={Boolean(anchorElMap[booking._id])}
                      onClick={(event) =>
                        handleMoreVertIconClick(event, booking)
                      }
                    >
                      <MoreVertIcon className="menuIcon" />
                    </Button>
                    <Menu
                      id={`basic-menu-${index}`} // Ensure unique ID
                      anchorEl={anchorElMap[booking._id]}
                      open={Boolean(anchorElMap[booking._id])}
                      onClose={handleMoreVertIconClose}
                      MenuListProps={{
                        "aria-labelledby": `basic-button-${index}`, // Ensure unique ID
                      }}
                    >
                      <MenuItem onClick={handleViewDetailsClick}>
                        View Details
                      </MenuItem>
                      <MenuItem
                        style={{ color: "green" }}
                        onClick={handleBookingConfirmConfirmationDialogOpen}
                        disabled={
                          userType === "CUSTOMER" ||
                          booking.bookingStatus !== "PENDING"
                        }
                      >
                        Confirm Booking
                      </MenuItem>
                      <MenuItem
                        style={{ color: "red" }}
                        onClick={handleBookingCancelConfirmationDialogOpen}
                        disabled={booking.bookingStatus !== "PENDING"}
                      >
                        Cancel Booking
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <img
              src={Images.noBookingsFound}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          )}
        </div>
      </div>
      <TablePagination
        component="div"
        count={totalPages}
        page={pageNo}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="pagination"
        classes={{ toolbar: "pagination-toolbar" }} // Override toolbar styles
      />
    </div>
  );
};

BookingHistory.propTypes = {
  hallId: PropTypes.any,
};

export default BookingHistory;
