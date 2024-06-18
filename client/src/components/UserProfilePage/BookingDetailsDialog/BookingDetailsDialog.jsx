import "./BookingDetailsDialog.scss";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Tag, Card, Row, Col, Typography } from "antd";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import Select from "react-select";

import ShareIcon from "@mui/icons-material/Share";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessIcon from "@mui/icons-material/Business";
import PlaceIcon from "@mui/icons-material/Place";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import BedIcon from "@mui/icons-material/Bed";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ErrorIcon from "@mui/icons-material/Error";
import { FaLandmark, FaCar } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import { Images } from "../../../constants";
import axios from "axios";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    fontSize: "15px",
    minHeight: "32px",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    border: "none",
    outline: "none",
    boxShadow: state.isFocused ? "none" : provided.boxShadow,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    "& svg": {
      display: "none", // Hide the default arrow icon
    },
    padding: 10,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#999999", // Change the placeholder color here
  }),
};

const bookingDetailsTemplate = {
  documentId: null,
  bookingStartDate: null,
  bookingEndDate: null,
  bookingStartTime: null,
  bookingEndTime: null,
  bookingDuration: null,
  bookingStatus: null,
  catererRequirement: {
    label: null,
    value: null,
  },
  guestsCount: null,
  roomsCount: null,
  parkingRequirement: {
    label: null,
    value: null,
  },
  vehiclesCount: null,
  customerVegRate: null,
  customerNonVegRate: null,
  customerVegItemsList: null,
  customerNonVegItemsList: null,
  // fields from vendorType collection
  vendorType: null,
  //fields from eventType collection
  eventTypeInfo: {
    label: null,
    value: null,
  },
  //fields from hallMaster collection
  hallData: {
    hallName: null,
    hallLocation: null,
    hallLandmark: null,
    hallCapacity: null,
    hallRooms: null,
    hallVegRate: null,
    hallNonVegRate: null,
    hallParking: null,
    hallImage: null,
  },
};

const BookingDetailsDialog = ({ open, handleClose, currentBooking }) => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);
  const dataStore = useSelector((state) => state.data); // CITIES, EVENT_TYPES & VENDOR_TYPES data
  const [isFormTwoDisabled, setIsFormTwoDisabled] = useState(true);
  const [isFormThreeDisabled, setIsFormThreeDisabled] = useState(true);

  const { Title, Text } = Typography;

  const handleCurrentActiveTabChange = (event, newValue) => {
    setCurrentActiveTab(newValue);
  };

  console.log("CURRENT BOOKING", currentBooking);

  // object storing user's booking requirements
  const [bookingDetails, setBookingDetails] = useState({
    ...bookingDetailsTemplate,
  });

  const [bookingDetailsErrorInfo, setBookingDetailsErrorInfo] = useState({
    ...bookingDetailsTemplate,
    eventTypeInfo: "",
    guestsCount: "",
    roomsCount: "",
    vehiclesCount: "",
  });

  const handleBookingDetailsInfo = (key, value) => {
    setBookingDetails((previousInfo) => ({
      ...previousInfo,
      [key]: value,
    }));
  };

  const handleBookingDetailsErrorInfo = (key, value) => {
    setBookingDetailsErrorInfo((previousInfo) => ({
      ...previousInfo,
      [key]: value,
    }));
  };

  const extractDate = (timeStamp) => {
    if (!timeStamp) {
      return null;
    }
    const date = new Date(timeStamp); // Replace with your Date object
    const year = date.getFullYear(); // Get the year (YYYY)
    const month = date.getMonth() + 1; // Get the month (0-indexed, so add 1)
    const day = date.getDate(); // Get the day of the month (1-31)

    // Formatting month and day to ensure two digits (e.g., 03 for March)
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const extractTime = (timeStamp) => {
    if (!timeStamp) {
      return null;
    }
    const date = new Date(timeStamp);
    const hours = date.getHours(); // Get the hour (0-23)
    const minutes = date.getMinutes(); // Get the minute (0-59)

    return `${hours}:${minutes.toString().padStart(2, "0")}`; // Output: HH:MM
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const URL = `${import.meta.env.VITE_SERVER_URL}/eventify_server/${
          currentBooking.bookingStatus === "CONFIRMED"
            ? "hallBookingMaster"
            : "bookingMaster"
        }/getBookingDetailsById/?bookingId=${currentBooking._id}`;
        const response = await axios.get(URL);
        const { bookingStartDateTimestamp, bookingEndDateTimestamp, ...info } =
          response.data[0];

        setBookingDetails((previousInfo) => ({
          ...previousInfo,
          ...info,
          bookingStartDate: extractDate(bookingStartDateTimestamp),
          bookingStartTime: extractTime(bookingStartDateTimestamp),
          bookingEndDate: extractDate(bookingEndDateTimestamp),
          bookingEndTime: extractTime(bookingEndDateTimestamp),
        }));
      } catch (error) {
        console.error(error);
        return;
      }
    };

    if (currentBooking._id) {
      fetchBookingData();
    }
  }, [currentBooking]);

  const handlePrevBtnClick = () => {
    switch (currentActiveTab) {
      case 0:
        break;
      case 1:
        handleCurrentActiveTabChange(null, 0);
        break;
      case 2:
        handleCurrentActiveTabChange(null, 1);
        break;
      default:
        break;
    }
  };

  const handleNextBtnClick = () => {
    switch (currentActiveTab) {
      case 0:
        handleCurrentActiveTabChange(null, 1);
        break;
      case 1:
        handleCurrentActiveTabChange(null, 2);
        break;
      case 2:
        break;
      default:
        break;
    }
  };

  const handleEditBtnClick = () => {
    switch (currentActiveTab) {
      case 0:
        break;
      case 1:
        setIsFormTwoDisabled(false);
        break;
      case 2:
        setIsFormTwoDisabled(false);
        break;
      default:
        break;
    }
  };

  const handleSaveBtnClick = () => {
    switch (currentActiveTab) {
      case 0:
        break;
      case 1:
        setIsFormTwoDisabled(true);
        break;
      case 2:
        setIsFormTwoDisabled(true);
        break;
      default:
        break;
    }
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: "#2c2c2c",
          color: "#fff",
          minHeight: "90vh",
          borderRadius: "8px",
        },
      }}
      maxWidth="md"
      fullWidth
    >
      <div className="bookingDetailsDialog__mainContainer">
        <div className="wrapper header__wrapper">
          <div className="image">
            <img src={bookingDetails.hallData.hallImage} alt="" />
          </div>
          <Card className="booking-card" bordered={false}>
            <Title level={2} className="name">
              <p>
                {bookingDetails.hallData.hallName}{" "}
                <span>({bookingDetails.vendorType})</span>
              </p>
            </Title>
            <div className="description">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Text strong style={{ color: "#fff", marginRight: "0.5rem" }}>
                    Booking Id:{" "}
                  </Text>{" "}
                  {bookingDetails.documentId}
                </Col>
                <Col span={24}>
                  <Text strong style={{ color: "#fff", marginRight: "0.5rem" }}>
                    Event Type:{" "}
                  </Text>{" "}
                  {bookingDetails.eventTypeInfo.label}
                </Col>
                <Col span={24}>
                  <Text strong style={{ color: "#fff", marginRight: "0.5rem" }}>
                    Booking Status:{" "}
                  </Text>
                  {bookingDetails.bookingStatus === "CONFIRMED" ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      CONFIRMED
                    </Tag>
                  ) : bookingDetails.bookingStatus === "PENDING" ? (
                    <Tag icon={<SyncOutlined spin />} color="processing">
                      PENDING
                    </Tag>
                  ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                      CANCELLED
                    </Tag>
                  )}
                </Col>
              </Row>
            </div>
            <div className="shareIcon">
              <ShareIcon className="icon" />
            </div>
          </Card>
        </div>
        <div className="wrapper body__wrapper">
          <Box
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              backgroundColor: "#2c2c2c",
              color: "#fffff",
            }}
          >
            <Tabs
              value={currentActiveTab}
              onChange={handleCurrentActiveTabChange}
              centered
            >
              <Tab
                label="Hall Details"
                sx={{ color: "#fff", fontSize: "14px" }}
              />
              <Tab
                label="User Requirement"
                sx={{ color: "#fff", fontSize: "14px" }}
              />
              <Tab
                label="Date & Time"
                sx={{ color: "#fff", fontSize: "14px" }}
              />
            </Tabs>
          </Box>
          <div className="form__wrapper">
            {currentActiveTab === 0 && (
              <div className={`container hallDetails__container disabledInput__wrapper`}>
                <div className="inputField__wrapper">
                  <div className="title">hall name</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <BusinessIcon className="icon" />
                    <div className="divider"></div>
                    <input
                      type="text"
                      value={bookingDetails.hallData?.hallName}
                      className="input"
                      disabled
                      readOnly
                    />
                  </div>
                </div>
                <div className="inputFields__wrapper">
                  <div className="wrapper">
                    <div className="title">location</div>
                    <div className="input__wrapper disabledInput__wrapper">
                      <PlaceIcon className="icon" />
                      <div className="divider"></div>
                      <input
                        type="text"
                        value={bookingDetails.hallData?.hallLocation}
                        className="input"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="wrapper">
                    <div className="title">landmark</div>
                    <div className="input__wrapper disabledInput__wrapper">
                      <FaLandmark className="icon" />
                      <div className="divider"></div>
                      <input
                        type="text"
                        value={bookingDetails.hallData?.hallLandmark}
                        className="input"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="inputFields__wrapper">
                  <div className="wrapper">
                    <div className="title">seating capacity</div>
                    <div className="input__wrapper disabledInput__wrapper">
                      <EventSeatIcon className="icon" />
                      <div className="divider"></div>
                      <input
                        type="text"
                        value={bookingDetails.hallData?.hallCapacity}
                        className="input"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="wrapper">
                    <div className="title">No. of Rooms</div>
                    <div className="input__wrapper disabledInput__wrapper">
                      <BedIcon className="icon" />
                      <div className="divider"></div>
                      <input
                        type="text"
                        value={bookingDetails.hallData?.hallRooms}
                        className="input"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="inputFields__wrapper">
                  <div className="wrapper">
                    <div className="title">veg food rate</div>
                    <div className="input__wrapper disabledInput__wrapper">
                      <RestaurantIcon className="icon" />
                      <div className="divider"></div>
                      <input
                        type="text"
                        value={bookingDetails.hallData?.hallVegRate}
                        className="input"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="wrapper">
                    <div className="title">Non-Veg food rate</div>
                    <div className="input__wrapper disabledInput__wrapper">
                      <RestaurantIcon className="icon" />
                      <div className="divider"></div>
                      <input
                        type="text"
                        value={bookingDetails.hallData?.hallNonVegRate}
                        className="input"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="inputField__wrapper half-width">
                  <div className="title">Parking Availability</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <LocalParkingIcon className="icon" />
                    <div className="divider"></div>
                    <input
                      type="text"
                      value={bookingDetails.hallData?.hallParking}
                      className="input"
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
            {currentActiveTab === 1 && (
              <div className={`container preferences__container ${isFormTwoDisabled && "disabledInput__wrapper"}`}>
                <div className="inputFields__wrapper">
                  <div className="wrapper">
                    <div className="title">
                      Event Type <span>*</span>
                    </div>
                    <div
                      className="input__wrapper"
                      style={
                        bookingDetailsErrorInfo.eventTypeInfo
                          ? { border: "2px solid red" }
                          : {}
                      }
                    >
                      <CurrencyRupeeIcon className="icon" />
                      <div className="divider"></div>
                      <Select
                        styles={customStyles}
                        options={
                          Array.isArray(dataStore.eventTypes.data)
                            ? dataStore.eventTypes.data.map((item) => ({
                                value: item._id,
                                label: item.eventName,
                              }))
                            : null
                        }
                        value={bookingDetails.eventTypeInfo}
                        onChange={(selectedOption) => {
                          const updatedInfo = {
                            label: selectedOption.label,
                            value: selectedOption.value,
                          };
                          handleBookingDetailsInfo(
                            "eventTypeInfo",
                            updatedInfo
                          );
                        }}
                        placeholder="Choose Event Type"
                        components={{
                          DropdownIndicator: () => (
                            <KeyboardArrowDownIcon
                              style={{ color: "#007bff" }}
                            />
                          ),
                        }}
                        className="input selectInput"
                        menuShouldScrollIntoView={false}
                        closeMenuOnSelect
                        isSearchable
                        isDisabled={isFormTwoDisabled}
                      />
                    </div>
                    {bookingDetailsErrorInfo.eventTypeInfo && (
                      <div className="inputError">
                        <ErrorIcon className="icon" />
                        <p>{bookingDetailsErrorInfo.eventTypeInfo}</p>
                      </div>
                    )}
                  </div>
                  <div className="wrapper">
                    <div className="title">
                      Caterer Requirement <span>*</span>
                    </div>
                    <div className="input__wrapper">
                      <CurrencyRupeeIcon className="icon" />
                      <div className="divider"></div>
                      <Select
                        styles={customStyles}
                        options={[
                          {
                            value: true,
                            label: "Yes",
                          },
                          {
                            value: false,
                            label: "No",
                          },
                        ]}
                        value={bookingDetails.catererRequirement}
                        onChange={(selectedOption) => {
                          const updatedInfo = {
                            label: selectedOption.label,
                            value: selectedOption.value,
                          };
                          handleBookingDetailsInfo(
                            "catererRequirement",
                            updatedInfo
                          );
                        }}
                        placeholder="Do you need a caterer ?"
                        components={{
                          DropdownIndicator: () => (
                            <KeyboardArrowDownIcon
                              style={{ color: "#007bff" }}
                            />
                          ),
                        }}
                        className="input selectInput"
                        menuShouldScrollIntoView={false}
                        closeMenuOnSelect
                        isSearchable={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="inputFields__wrapper">
                  <div className="wrapper">
                    <div className="title">
                      No. of Guests Required <span>*</span>
                    </div>
                    <div
                      className="input__wrapper"
                      style={
                        bookingDetailsErrorInfo.guestsCount
                          ? { border: "2px solid red" }
                          : {}
                      }
                    >
                      <PeopleAltIcon className="icon" />
                      <div className="divider"></div>
                      <input
                        type="number"
                        name="guestsCount"
                        value={bookingDetails.guestsCount}
                        className="input"
                        placeholder="Enter guest count"
                        onChange={(event) =>
                          handleBookingDetailsInfo(
                            "guestsCount",
                            event.target.value
                          )
                        }
                      />
                    </div>
                    {bookingDetailsErrorInfo.guestsCount && (
                      <div className="inputError">
                        <ErrorIcon className="icon" />
                        <p>{bookingDetailsErrorInfo.guestsCount}</p>
                      </div>
                    )}
                  </div>
                  <div className="wrapper">
                    <div className="title">
                      No. of Rooms Required <span>*</span>
                    </div>
                    <div
                      className="input__wrapper"
                      style={
                        bookingDetailsErrorInfo.roomsCount
                          ? { border: "2px solid red" }
                          : {}
                      }
                    >
                      <BedIcon className="icon" />
                      <div className="divider"></div>
                      <input
                        type="number"
                        name="roomCount"
                        value={bookingDetails.roomsCount}
                        className="input"
                        placeholder="Enter room count"
                        onChange={(event) =>
                          handleBookingDetailsInfo(
                            "roomsCount",
                            event.target.value
                          )
                        }
                      />
                    </div>
                    {bookingDetailsErrorInfo.roomsCount && (
                      <div className="inputError">
                        <ErrorIcon className="icon" />
                        <p>{bookingDetailsErrorInfo.roomsCount}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="inputFields__wrapper">
                  <div className="wrapper">
                    <div className="title">
                      Parking Requirement <span>*</span>
                    </div>
                    <div className="input__wrapper">
                      <LocalParkingIcon className="icon" />
                      <div className="divider"></div>
                      <Select
                        styles={customStyles}
                        options={[
                          {
                            value: true,
                            label: "Yes",
                          },
                          {
                            value: false,
                            label: "No",
                          },
                        ]}
                        value={bookingDetails.parkingRequirement}
                        onChange={(selectedOption) => {
                          const updatedInfo = {
                            label: selectedOption.label,
                            value: selectedOption.value,
                          };
                          handleBookingDetailsInfo(
                            "parkingRequirement",
                            updatedInfo
                          );
                        }}
                        placeholder="Do your require parking ?"
                        components={{
                          DropdownIndicator: () => (
                            <KeyboardArrowDownIcon
                              style={{ color: "#007bff" }}
                            />
                          ),
                        }}
                        className="input selectInput"
                        menuShouldScrollIntoView={false}
                        closeMenuOnSelect
                        isSearchable={false}
                      />
                    </div>
                  </div>
                  <div className="wrapper">
                    <div className="title">
                      No. Of Vehicles <span>*</span>
                    </div>
                    <div
                      className="input__wrapper"
                      style={
                        bookingDetailsErrorInfo.vehiclesCount
                          ? { border: "2px solid red" }
                          : {}
                      }
                    >
                      <FaCar className="icon" />
                      <div className="divider"></div>
                      <input
                        type="number"
                        name="vehiclesCount"
                        value={bookingDetails.vehiclesCount}
                        className="input"
                        placeholder="Enter vehicle count"
                        onChange={(event) =>
                          handleBookingDetailsInfo(
                            "vehiclesCount",
                            event.target.value
                          )
                        }
                      />
                    </div>
                    {bookingDetailsErrorInfo.vehiclesCount && (
                      <div className="inputError">
                        <ErrorIcon className="icon" />
                        <p>{bookingDetailsErrorInfo.vehiclesCount}</p>
                      </div>
                    )}
                  </div>
                </div>
                {bookingDetails.catererRequirement.value && (
                  <>
                    <div className="inputFields__wrapper">
                      <div className="wrapper">
                        <div className="title">Expected Veg Rate/plate</div>
                        <div className="input__wrapper">
                          <CurrencyRupeeIcon className="icon" />
                          <div className="divider"></div>
                          <input
                            type="number"
                            name="expectedVegRate"
                            value={bookingDetails.customerVegRate}
                            className="input"
                            placeholder="enter your expected rate/plate"
                            onChange={(event) =>
                              handleBookingDetailsInfo(
                                "customerVegRate",
                                event.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="wrapper">
                        <div className="title">Expected Non-Veg Rate/plate</div>
                        <div className="input__wrapper">
                          <CurrencyRupeeIcon className="icon" />
                          <div className="divider"></div>
                          <input
                            type="number"
                            name="expectedNonVegRate"
                            value={bookingDetails.customerNonVegRate}
                            className="input"
                            placeholder="enter your expected rate/plate"
                            onChange={(event) =>
                              handleBookingDetailsInfo(
                                "customerNonVegRate",
                                event.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="inputFields__wrapper">
                      <div className="wrapper">
                        <div className="title">Veg Menu Required</div>
                        <div className="input__wrapper">
                          <RestaurantMenuIcon className="icon" />
                          <div className="textAreaDivider"></div>
                          <textarea
                            type="text"
                            name="vegMenu"
                            value={bookingDetails.customerVegItemsList}
                            placeholder="enter items desired in veg menu"
                            className="input textArea"
                            onChange={(event) =>
                              handleBookingDetailsInfo(
                                "customerVegItemsList",
                                event.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="wrapper">
                        <div className="title">Non-Veg Menu Required</div>
                        <div className="input__wrapper">
                          <RestaurantMenuIcon className="icon" />
                          <div className="textAreaDivider"></div>
                          <textarea
                            type="text"
                            name="nonVegMenu"
                            value={bookingDetails.customerNonVegItemsList}
                            placeholder="enter items desired in veg menu"
                            className="input textArea"
                            onChange={(event) =>
                              handleBookingDetailsInfo(
                                "customerNonVegItemsList",
                                event.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {currentActiveTab === 2 && (
              <div
                className="container dateTime__container"
                style={{ width: "50%" }}
              >
                <div className="inputField__wrapper">
                  <div className="title">Booking Start Date</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <CalendarMonthIcon className="icon" />
                    <div className="divider"></div>
                    <input
                      type="text"
                      name="bookingDate"
                      value={bookingDetails?.bookingStartDate}
                      className="input"
                      disabled
                      readOnly
                    />
                  </div>
                </div>
                <div className="inputField__wrapper">
                  <div className="title">Start Time</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <AccessAlarmIcon className="icon" />
                    <div className="divider"></div>
                    <input
                      type="text"
                      name="startTime"
                      value={bookingDetails?.bookingStartTime}
                      className="input"
                      disabled
                    />
                  </div>
                </div>
                <div className="inputField__wrapper">
                  <div className="title">Booking End Date</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <CalendarMonthIcon className="icon" />
                    <div className="divider"></div>
                    <input
                      type="text"
                      name="bookingDate"
                      value={bookingDetails?.bookingEndDate}
                      className="input"
                      disabled
                      readOnly
                    />
                  </div>
                </div>
                <div className="inputField__wrapper">
                  <div className="title">End Time</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <AccessAlarmIcon className="icon" />
                    <div className="divider"></div>
                    <input
                      type="text"
                      name="endTime"
                      value={bookingDetails?.bookingEndTime}
                      className="input"
                      disabled
                    />
                  </div>
                </div>
                <div className="inputField__wrapper">
                  <div className="title">Total Duration</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <GiSandsOfTime className="icon" />
                    <div className="divider"></div>
                    <input
                      name="bookingDuration"
                      type="text"
                      value={`${bookingDetails?.bookingDuration} hour`}
                      className="input"
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="lineSeparator"></div>
            <div className="footer__wrapper">
              <div className="btns__wrapper">
                <div className="caption">* Mandatory Fields</div>
                {currentActiveTab !== 0 && (
                isFormTwoDisabled &&
                isFormThreeDisabled ? (
                  <button className="btn editBtn" onClick={handleEditBtnClick}>
                    Edit
                  </button>
                ) : (
                  <button className="btn saveBtn" onClick={handleSaveBtnClick}>
                    Save
                  </button>
                ))}
                <button className="btn prevBtn" onClick={handlePrevBtnClick}>
                  prev
                </button>
                <button className="btn nextBtn" onClick={handleNextBtnClick}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

BookingDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currentBooking: PropTypes.object.isRequired,
};

export default BookingDetailsDialog;
