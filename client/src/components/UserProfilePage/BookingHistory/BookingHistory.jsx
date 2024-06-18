/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./BookingHistory.scss";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DatePicker, Tag, Modal, Skeleton, Empty } from "antd";
import TablePagination from "@mui/material/TablePagination";
import axios from "axios";

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

const BookingHistory = () => {
  const userInfoStore = useSelector((state) => state.userInfo);
  const userType = userInfoStore.userDetails.userType || "";
  const vendorType = userInfoStore.userDetails.vendorType || "";

  const { RangePicker } = DatePicker;
  const [anchorEl, setAnchorEl] = useState(null);

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

  const [pageNo, setPageNo] = useState(0); // current page no.
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0); // set it according to data fetched from database

  const handleMoreVertIconClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking); // Set the selected booking
  };

  const handleMoreVertIconClose = () => {
    setAnchorEl(null);
  };
  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleBookingDetailsDialogClose = () => {
    setIsBookingDetailsDialogOpen(false);
    setSelectedBooking({}); // Reset the selected booking
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageNo(0);
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
            userType === "CUSTOMER" &&
            `${
              import.meta.env.VITE_SERVER_URL
            }/eventify_server/bookingMaster/getUserBookings/?customerId=${
              userInfoStore.userDetails.Document._id
            }&startDateOfMonth=${startDateOfMonth}&endDateOfMonth=${endDateOfMonth}&page=${pageNo}&limit=${rowsPerPage}&sortCriteria=${dataSortCriteria}&bookingCategory=${currentTab}`;
          // :
          // vendorType === "Banquet Hall" && `${
          //   import.meta.env.VITE_SERVER_URL
          // }/eventify_server/bookingMaster/getHallBookings/?serviceProviderId=${
          //   userInfoStore.userDetails.Document._id
          // }&startDateOfMonth=${startDateOfMonth}&endDateOfMonth=${endDateOfMonth}&page=${pageNo}&limit=${rowsPerPage}&sortCriteria=${dataSortCriteria}&bookingCategory=${currentTab}`
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
    // handleMoreVertIconClose();
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
      <BookingDetailsDialog
        open={isBookingDetailsDialogOpen}
        handleClose={handleBookingDetailsDialogClose}
        currentBooking={selectedBooking}
      />
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
          <div className="tag" onClick={() => setDataSortCriteria("hallName")}>
            <p>Name</p>
            <ArrowDropDownOutlinedIcon className="icon" />
          </div>
          <div
            className="tag"
            onClick={() => setDataSortCriteria("vendorType")}
          >
            <p>Vendor</p>
            <ArrowDropDownOutlinedIcon className="icon" />
          </div>
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
                  <div className="item">{booking.hallName}</div>
                  <div className="item">{booking.vendorType}</div>
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
                      id="basic-button"
                      aria-controls={anchorEl ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                      onClick={(event) => handleMoreVertIconClick(event, booking)}
                    >
                      <MoreVertIcon className="menuIcon" />
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMoreVertIconClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={handleViewDetailsClick}>
                        View Details
                      </MenuItem>
                      {/* {booking.bookingStatus === "PENDING" && ( */}
                      <MenuItem
                        style={{ color: "red" }}
                        onClick={handleMoreVertIconClose}
                      >
                        Cancel Booking
                      </MenuItem>
                      {/* )} */}
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

export default BookingHistory;
