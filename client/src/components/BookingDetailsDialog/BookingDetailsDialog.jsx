/* eslint-disable react-hooks/exhaustive-deps */
import "./BookingDetailsDialog.scss";

import { useEffect, useState } from "react";
// import { useHistory } from 'react-router-dom';
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import Select from "react-select";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessIcon from "@mui/icons-material/Business";
import PlaceIcon from "@mui/icons-material/Place";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import BedIcon from "@mui/icons-material/Bed";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import EmailIcon from "@mui/icons-material/Email";
import MessageIcon from "@mui/icons-material/Message";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ErrorIcon from "@mui/icons-material/Error";
import { FaLandmark, FaCar } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";

import { LoadingScreen } from "../../sub-components";
import { Images } from "../../constants";
import emailjs from 'emailjs-com';
//@TODO: Vendors cannot book halls

export default function BookingDetailsDialog({
  open,
  handleClose,
  hallData,
  serviceProviderData,
}) {
  // const history = useHistory();
  const dataStore = useSelector((state) => state.data); // CITIES, EVENT_TYPES & VENDOR_TYPES data
  const bookingInfoStore = useSelector((state) => state.bookingInfo); // user Booking information
  const userInfoStore = useSelector((state) => state.userInfo); // user Authentication information

  const [isLoading, setIsLoading] = useState(false); // toggle loading screen
  const [formProgress, setFormProgress] = useState(0);
  const [formType, setFormType] = useState("FORM_ONE"); // FORM_ONE, FORM_TWO, FORM_THREE, FORM_FOUR
  const [submissionConfirmationDialog, setSubmissionConfirmationDialog] =
    useState(false);
  const [formErrorUpdateFlag, setFormErrorUpdateFlag] = useState(false); // error update flag for form
  const [bookingConfirmationScreen, setBookingConfirmationScreen] =
    useState(false); // toggle booking confirmation screen
   
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
    bookingId: "",
    eventTypeInfo: {
      eventType: "",
      eventTypeId: "",
    },
    guestsCount: null,
    roomsCount: null,
    parkingRequirement: {
      label: "Yes",
      value: true,
    },
    vehiclesCount: null,
    expectedVegRate: null,
    expectedNonVegRate: null,
    vegMenu: "",
    nonVegMenu: "",
    catererRequirement: {
      label: "Yes",
      value: true,
    },
    customerSuggestion: "",
  };

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
  
  const sendConfirmationEmail = (bookingId,type) => {
    // Configure the email service, template, and user ID
    const service_id = 'service_2fup20o';
    let template_id;
    if(type=='sendtocustomer'){
      template_id = 'template_l4np6ir';
    }else{
      template_id='template_4t80nyc';
    }
    const user_id = '0oIWr5bjMsZhioM54';
    const customerEmail=userInfoStore.userDetails.Document.customerEmail;
    const vendorEmail=serviceProviderData.vendorEmail;
    // Prepare the email parameters
    const emailParams = {
      service_id: service_id,
      template_id: template_id,
      user_id: user_id,
      template_params: {
        // Add the relevant details from the `bookingDetails` object and other data sources
        to_email: customerEmail, // Replace with the recipient's email
        vendor_email:vendorEmail, // Replace with the sender's email
        vendor_name:serviceProviderData.vendorName,
        to_name:userInfoStore.userDetails.Document.customerName,
        bookingId:bookingId,
        hallName:hallData.hallName,
      },
    };
  
    // Send the email
    emailjs.send(emailParams.service_id, emailParams.template_id, emailParams.template_params, emailParams.user_id)
      .then((response) => {
        console.log('Email sent successfully', response.status, response.text);
        // Handle successful email send
      })
      .catch((error) => {
        console.error('Failed to send email', error);
        // Handle email send failure
      });
  };

  const handleSubmissionConfirmationDialogOpen = () => {
    setSubmissionConfirmationDialog(true);
  };

  const handleSubmissionConfirmationDialogClose = () => {
    setSubmissionConfirmationDialog(false);
  };

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

  console.log(serviceProviderData);
  console.log(hallData);

  function parseDate(dateString, splitCriteria) {
    if (splitCriteria === "/") {
      // DD/MM/YYYY
      const parts = dateString.split("/");
      // Month is 0-based, so we subtract 1 from the month value
      return new Date(parts[2], parts[1] - 1, parts[0]);
    } else if (splitCriteria === "-") {
      // YYYY-MM-DD
      const parts = dateString.split("-");
      // Month is 0-based, so we subtract 1 from the month value
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
  }

  useEffect(() => {
    if (!bookingDetails.eventTypeInfo.eventTypeId) {
      return;
    }

    try {
      const requiredFields = [
        bookingDetailsErrorInfo.eventTypeInfo,
        bookingDetailsErrorInfo.guestsCount,
        bookingDetailsErrorInfo.roomsCount,
        bookingDetailsErrorInfo.vehiclesCount,
      ];

      const isFormValid = requiredFields.every((field) => field === "");

      if (isFormValid) {
        setFormType("FORM_THREE");
      }
    } catch (error) {
      console.error(error);
    }
  }, [formErrorUpdateFlag]);

  

  const validateFormTwo = () => {
    if (!bookingDetails.eventTypeInfo.eventType) {
      handleBookingDetailsErrorInfo("eventTypeInfo", "Event type is required");
    } else {
      handleBookingDetailsErrorInfo("eventTypeInfo", "");
    }
    if (!bookingDetails.guestsCount) {
      handleBookingDetailsErrorInfo("guestsCount", "Guests count is required");
    } else {
      handleBookingDetailsErrorInfo("guestsCount", "");
    }
    if (!bookingDetails.roomsCount) {
      handleBookingDetailsErrorInfo("roomsCount", "Rooms count is required");
    } else {
      handleBookingDetailsErrorInfo("roomsCount", "");
    }
    if (!bookingDetails.vehiclesCount) {
      handleBookingDetailsErrorInfo(
        "vehiclesCount",
        "Vehicles count is required"
      );
    } else {
      handleBookingDetailsErrorInfo("vehiclesCount", "");
    }

    setFormErrorUpdateFlag((prevFlag) => !prevFlag);
  };

  const handlePrevBtnClick = () => {
    switch (formType) {
      case "FORM_ONE":
        break;
      case "FORM_TWO":
        setFormProgress(0);
        setFormType("FORM_ONE");
        break;
      case "FORM_THREE":
        setFormProgress(25);
        setFormType("FORM_TWO");
        break;
      case "FORM_FOUR":
        setFormProgress(50);
        setFormType("FORM_THREE");
        break;
      default:
        break;
    }
  };

  const handleNextBtnClick = () => {
    switch (formType) {
      case "FORM_ONE":
        setFormProgress(25);
        setFormType("FORM_TWO");
        break;
      case "FORM_TWO":
        setFormProgress(50);
        validateFormTwo();
        break;
      case "FORM_THREE":
        setFormProgress(75);
        setFormType("FORM_FOUR");
        break;
      case "FORM_FOUR":
        handleSubmissionConfirmationDialogOpen();
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = async () => {
    // setIsLoading(true);
    try {
      const parsedStartDateObject = parseDate(
        bookingInfoStore.bookingStartDate,
        "-"
      );
      const parsedEndDateObject = parseDate(
        bookingInfoStore.bookingEndDate,
        "-"
      );
      parsedStartDateObject.setHours(
        parseInt(bookingInfoStore.startTime.split(":")[0]),
        0,
        0,
        0
      );
      parsedEndDateObject.setHours(
        parseInt(bookingInfoStore.endTime.split(":")[0]),
        0,
        0,
        0
      );

      console.log("FINAL BOOKING START DATE: " + parsedStartDateObject);
      console.log("FINAL BOOKING END DATE: " + parsedEndDateObject);

      const postData = {
        hallId: hallData._id,
        hallCity: hallData.hallCity,
        hallUserId: hallData.hallUserId,
        vendorTypeId: serviceProviderData.vendorTypeId,
        eventId: bookingDetails.eventTypeInfo.eventTypeId,
        customerId: userInfoStore.userDetails?.Document?._id,
        bookingType: "HALL",
        bookCaterer: bookingDetails.catererRequirement.value,
        bookingStartDateTimestamp: parsedStartDateObject,
        bookingEndDateTimestamp: parsedEndDateObject,
        bookingDuration: parseInt(
          bookingInfoStore.bookingDuration.split(":")[0]
        ),
        bookingStatusRemark: "",

        guestsCount: parseInt(bookingDetails.guestsCount),
        roomsCount: parseInt(bookingDetails.roomsCount),
        parkingRequirement: bookingDetails.parkingRequirement.value,
        vehiclesCount: parseInt(bookingDetails.vehiclesCount),
        customerVegRate: parseInt(bookingDetails.expectedVegRate),
        customerNonVegRate: parseInt(bookingDetails.expectedNonVegRate),
        customerVegItemsList: bookingDetails.vegMenu,
        customerNonVegItemsList: bookingDetails.nonVegMenu,
        customerInfo: "",
        customerSuggestion: bookingDetails.customerSuggestion,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/eventify_server/bookingMaster/`,
        postData
      );
      console.log(response);
      sendConfirmationEmail(response.data?.documentId,"sendtocustomer");
      //sendConfirmationEmail(response.data?.documentId,"sendtovendor");
      
      handleBookingDetailsInfo("bookingId", response.data?.documentId);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

    setIsLoading(false);
    setBookingConfirmationScreen(true);
    setFormType("FORM_ONE");
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={() => {
        setFormType("FORM_ONE");
        handleClose();
      }}
      maxWidth="md"
      fullWidth
    >
      {isLoading && (
        <div>
          <LoadingScreen />
        </div>
      )}
      <Dialog
        open={submissionConfirmationDialog}
        onClose={handleSubmissionConfirmationDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Booking ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Before proceeding, please verify that the details entered are
            correct to the best of your knowledge. Click &apos;OK&apos; to
            confirm and proceed with the booking, or &apos;Cancel&apos; to
            review your details once again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmissionConfirmationDialogClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmissionConfirmationDialogClose();
              handleFormSubmit();
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      {bookingConfirmationScreen ? (
        <div className="bookingConfirmationScreen__container">
          <div className="wrapper">
            <div className="contents__wrapper">
              <img src={Images.successLogo} alt="" />
              <h2 className="title">Your booking was successful !!</h2>
              <div className="description">
                Your booking is on hold, pending confirmation from the vendor.
                We&lsquo;ve notified the vendor about your request. Once they
                confirm your booking, we&apos;ll send you a confirmation.
              </div>
              <div className="bookingDetails__wrapper">
                <h2 className="title">Booking Details</h2>
                <div className="details__wrapper">
                  <div className="sub-wrapper">
                    <div className="key">Booking Id:</div>
                    <div className="value">{bookingDetails.bookingId}</div>
                  </div>
                  <div className="verticalLineSeparator"></div>
                  <div className="sub-wrapper">
                    <div className="key">Start Date:</div>
                    <div className="value">
                      {bookingInfoStore.bookingStartDate}
                    </div>
                  </div>
                  <div className="verticalLineSeparator"></div>
                  <div className="sub-wrapper">
                    <div className="key">End Date:</div>
                    <div className="value">
                      {bookingInfoStore.bookingEndDate}
                    </div>
                  </div>
                  <div className="verticalLineSeparator"></div>
                  <div className="sub-wrapper">
                    <div className="key">Total:</div>
                    <div className="value">$0</div>
                  </div>
                  <div className="verticalLineSeparator"></div>
                  <div className="sub-wrapper">
                    <div className="key">Status:</div>
                    <div className="value">PENDING</div>
                  </div>
                </div>
              </div>
              <button
                className="continueBtn"
                onClick={() => {
                  handleClose();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bookingDetailsMain__container">
          <div className="headings__wrapper">
            <h1 className="heading">booking form</h1>
            <h6 className="sub-heading">
              Fill in the below details to continue
            </h6>
          </div>
          <div className="navigationTabs__wrapper">
            <div
              className={`navigationTab ${
                formType !== "FORM_ONE" ? "form__completed" : "current__form"
              }`}
            >
              <div className="tabHeading">hall details</div>
              <div className="wrapper">
                <div className="sub-wrapper">
                  <PersonIcon className="icon" />
                  <p className="stepCount">step 1</p>
                </div>
                <div className="btn">
                  {formType !== "FORM_ONE" ? "Completed" : "Pending"}
                </div>
              </div>
            </div>
            <div
              className={`navigationTab ${
                formType !== "FORM_ONE" &&
                (formType === "FORM_TWO" ? "current__form" : "form__completed")
              }`}
            >
              <div className="tabHeading">preferences</div>
              <div className="wrapper">
                <div className="sub-wrapper">
                  <PersonIcon className="icon" />
                  <p className="stepCount">step 2</p>
                </div>
                <div className="btn">
                  {formType === "FORM_THREE" || formType === "FORM_FOUR"
                    ? "Completed"
                    : "Pending"}
                </div>
              </div>
            </div>
            <div
              className={`navigationTab ${
                formType === "FORM_THREE"
                  ? "current__form"
                  : formType === "FORM_FOUR" && "form__completed"
              }`}
            >
              <div className="tabHeading">user details</div>
              <div className="wrapper">
                <div className="sub-wrapper">
                  <PersonIcon className="icon" />
                  <p className="stepCount">step 3</p>
                </div>
                <div className="btn">
                  {formType === "FORM_FOUR" ? "Completed" : "Pending"}
                </div>
              </div>
            </div>
            <div
              className={`navigationTab ${
                formType === "FORM_FOUR" && "current__form"
              }`}
            >
              <div className="tabHeading">date & time</div>
              <div className="wrapper">
                <div className="sub-wrapper">
                  <PersonIcon className="icon" />
                  <p className="stepCount">step 4</p>
                </div>
                <div className="btn">pending</div>
              </div>
            </div>
          </div>
          <div className="form__wrapper">
            {formType === "FORM_ONE" && (
              <div className="container hallDetails__container">
                <div className="inputField__wrapper">
                  <div className="title">hall name</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <BusinessIcon className="icon" />
                    <div className="divider"></div>
                    <input
                      type="text"
                      value={hallData?.hallName}
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
                        value={`${hallData?.hallTaluk}, ${hallData?.hallCity}, ${hallData?.hallState}`}
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
                        value={hallData?.hallLandmark}
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
                        value={hallData?.hallCapacity}
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
                        value={hallData?.hallRooms}
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
                        value={hallData?.hallVegRate}
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
                        value={hallData?.hallNonVegRate}
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
                      value={
                        hallData?.hallParking ? "Available" : "Unavailable"
                      }
                      className="input"
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
            {formType === "FORM_TWO" && (
              <div className="container preferences__container">
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
                        value={
                          bookingDetails.eventTypeInfo.eventTypeId
                            ? {
                                label: bookingDetails.eventTypeInfo.eventType,
                                value: bookingDetails.eventTypeInfo.eventTypeId,
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const updatedEventInfo = {
                            eventType: selectedOption.label,
                            eventTypeId: selectedOption.value,
                          };
                          handleBookingDetailsInfo(
                            "eventTypeInfo",
                            updatedEventInfo
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
                        value={
                          bookingDetails.catererRequirement.value
                            ? {
                                label: bookingDetails.catererRequirement.label,
                                value: bookingDetails.catererRequirement.value,
                              }
                            : null
                        }
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
                        value={
                          bookingDetails.parkingRequirement.value
                            ? {
                                label: bookingDetails.parkingRequirement.label,
                                value: bookingDetails.parkingRequirement.value,
                              }
                            : null
                        }
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
                            value={bookingDetails.expectedVegRate}
                            className="input"
                            placeholder="enter your expected rate/plate"
                            onChange={(event) =>
                              handleBookingDetailsInfo(
                                "expectedVegRate",
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
                            value={bookingDetails.expectedNonVegRate}
                            className="input"
                            placeholder="enter your expected rate/plate"
                            onChange={(event) =>
                              handleBookingDetailsInfo(
                                "expectedNonVegRate",
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
                            value={bookingDetails.vegMenu}
                            placeholder="enter items desired in veg menu"
                            className="input textArea"
                            onChange={(event) =>
                              handleBookingDetailsInfo(
                                "vegMenu",
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
                            value={bookingDetails.nonVegMenu}
                            placeholder="enter items desired in veg menu"
                            className="input textArea"
                            onChange={(event) =>
                              handleBookingDetailsInfo(
                                "nonVegMenu",
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
            {formType == "FORM_THREE" && (
              <div className="container userDetails__container">
                <div className="inputFields__wrapper">
                  <div className="wrapper">
                    <div className="title">First Name</div>
                    <div className="input__wrapper disabledInput__wrapper">
                      <PersonIcon className="icon" />
                      <div className="divider"></div>
                      <input
                        type="text"
                        value={
                          userInfoStore.userDetails?.Document?.customerName.includes(
                            " "
                          )
                            ? userInfoStore.userDetails?.Document?.customerName.split(
                                " "
                              )[0]
                            : userInfoStore.userDetails?.Document?.customerName
                        }
                        className="input"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="wrapper">
                    <div className="title">Last Name</div>
                    <div className="input__wrapper disabledInput__wrapper">
                      <PersonIcon className="icon" />
                      <div className="divider"></div>
                      <input
                        type="text"
                        value={
                          userInfoStore.userDetails?.Document?.customerName.includes(
                            " "
                          )
                            ? userInfoStore.userDetails?.Document?.customerName.split(
                                " "
                              )[1]
                            : ""
                        }
                        className="input"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="inputField__wrapper">
                  <div className="title">Office Contact</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <BusinessIcon className="icon" />
                    <div className="divider"></div>
                    <input
                      type="text"
                      value={
                        userInfoStore.userDetails?.Document?.customerContact
                      }
                      className="input"
                      disabled
                      readOnly
                    />
                  </div>
                </div>
                <div className="inputField__wrapper">
                  <div className="title">Personal Contact</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <BusinessIcon className="icon" />
                    <div className="divider"></div>
                    <input
                      type="text"
                      value={
                        userInfoStore.userDetails?.Document?.customerContact
                      }
                      className="input"
                      disabled
                      readOnly
                    />
                  </div>
                </div>
                <div className="inputField__wrapper">
                  <div className="title">Email Id</div>
                  <div className="input__wrapper disabledInput__wrapper">
                    <EmailIcon className="icon" />
                    <div className="divider"></div>
                    <input
                      type="text"
                      value={userInfoStore.userDetails?.Document?.customerEmail}
                      className="input"
                      disabled
                      readOnly
                    />
                  </div>
                </div>
                <div className="inputField__wrapper">
                  <div className="title">Your Message</div>
                  <div className="input__wrapper">
                    <MessageIcon className="icon" />
                    <div className="textAreaDivider"></div>
                    <textarea
                      type="text"
                      name="customerSuggestion"
                      value={bookingDetails.customerSuggestion}
                      className="input textArea"
                      placeholder="your message to the hall owner..."
                      onChange={(event) =>
                        handleBookingDetailsInfo(
                          "customerSuggestion",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            {formType === "FORM_FOUR" && (
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
                      value={bookingInfoStore.bookingStartDate}
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
                      value={
                        bookingInfoStore.startTime
                          ? bookingInfoStore.startTime
                          : "HH:MM"
                      }
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
                      value={bookingInfoStore.bookingEndDate}
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
                      value={
                        bookingInfoStore.endTime
                          ? bookingInfoStore.endTime
                          : "HH:MM"
                      }
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
                      value={
                        bookingInfoStore.bookingDuration
                          ? `${
                              bookingInfoStore.bookingDuration.split(":")[0]
                            } hour`
                          : "HH:MM"
                      }
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
              <div className="progressBar__wrapper">
                <div className="title">
                  <p className="mainTitle">Form progress</p>
                  <p className="subTitle">{formProgress} % Completed</p>
                </div>
                <div
                  className="progressBar"
                  role="progressbar"
                  aria-valuenow={formProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{
                    width: `${formProgress}%`,
                    backgroundColor: "#007bff",
                    height: "4px",
                  }}
                ></div>
              </div>
              <div className="btns__wrapper">
                <div className="caption">* Mandatory Fields</div>
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
      )}
    </Dialog>
  );
}

BookingDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  hallData: PropTypes.object.isRequired,
  serviceProviderData: PropTypes.object.isRequired,
};
