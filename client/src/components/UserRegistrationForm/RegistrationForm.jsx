/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./RegistrationForm.scss";
import "react-phone-input-2/lib/style.css";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";

import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import Slide from "@mui/material/Slide";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import { FaEdit } from "react-icons/fa";

import PropTypes from "prop-types";

import { Images } from "../../constants";
import { LoadingScreen } from "../../sub-components";
import {
  fetchCitiesOfStateData,
  fetchStatesOfCountryData,
} from "../../states/Data";

export default function RegistrationForm({
  open,
  handleClose,
  // userType,
  // vendorType,
  // mongoDbUserId,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the uploaded files (e.g., display or process them)
    console.log(acceptedFiles);
  }, []);

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "none",
      padding: 0,
      margin: 0,
      cursor: "pointer",
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
      padding: 0,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#999999", // Change the placeholder color here
    }),
  };

  const progressBarStyle = {
    position: "relative",
    flex: 1,
    width: "6.5rem",
  };

  const beforeStyle = {
    content: '""',
    position: "absolute",
    top: "-10px",
    left: "0",
    height: "1px",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  };

  const customerDataTemplate = {
    customerFirstName: "", // required field
    customerLastName: "", // required field

    customerDocumentType: "",
    customerProfileImage: {},
    // ... other fields can be found in `commonDataTemplate`
  };

  const hallVendorDataTemplate = {
    hallName: "", // required field

    hallCapacity: 0, // required field
    hallRooms: 0, // required field
    hallParking: "UNAVAILABLE", // required field
    hallParkingCapacity: 0, // required field
    hallVegRate: 0, // required field
    hallNonVegRate: 0, // required field
    hallFreezDay: 0,
    // ... other fields can be found in `commonDataTemplate`
  };

  const otherVendorDataTemplate = {
    companyName: "", // required field
    // ... other fields can be found in `commonDataTemplate`
  };

  const IdDocumentTypes = [
    "Aadhaar Card (India)",
    "Passport",
    "Driver's License",
    "Voter ID Card",
    "PAN Card (Permanent Account Number)",
    "Social Security Number (SSN)",
    "National Identity Card",
    "Birth Certificate",
    "School/College ID Card",
    "Employee ID Card",
    "Health Insurance Card",
    "Residence Permit",
    "Citizenship Certificate",
    "Military ID Card",
    "Bank Account Statement",
    "Utility Bill (Electricity, Water, Gas)",
    "Property Tax Receipt",
    "Rent Agreement",
    "Vehicle Registration Certificate",
    "Tax Identification Number (TIN)",
  ];

  const commonDataTemplate = {
    address: "",
    landmark: "",
    country: "India",
    state: "",
    city: "",
    taluk: "",
    pincode: "",

    mainContactFirstName: "",
    mainContactLastName: "",
    mainDesignation: "",
    mainOfficeNo: "+91",
    mainMobileNo: "+91",
    mainEmail: "",

    registerNo: "",
    registerDate: "",
    registerDocument: "",

    alternateContactFirstName: "",
    alternateContactLastName: "",
    alternateDesignation: "",
    alternateOfficeNo: "+91",
    alternateMobileNo: "+91",
    alternateEmail: "",

    description: "",

    images: [],
  };

  const dispatch = useDispatch();
  const data = useSelector((state) => state.data); // COUNTRIES, STATES & CITIES
  const userInfo = useSelector((state) => state.userInfo); // details of registered user.

  const userType = userInfo.userDetails.userType;
  const vendorType = userInfo.userDetails.vendorType;

  const fileInputRef = useRef(null);
  const profilePicInputRef = useRef(null);
  const vendorPicturesInputRef = useRef(null);

  const [welcomeScreen, setWelcomeScreen] = useState(true); //set the welcome page when this component is loaded for the first time.
  const [formType, setFormType] = useState("FORM_ONE"); //  FORM_ONE, FORM_TWO, FORM_THREE, FORM_FOUR
  const [formContactType, setFormContactType] = useState("PRIMARY"); // PRIMARY or SECONDARY
  const [userConfirmationDialog, setUserConfirmationDialog] = useState(false); // toggle user confirmation dialog
  const [userConfirmation, setUserConfirmation] = useState(false); // ask user whether the entered details are correct to the best of his/her knowledge.
  const [loadingScreen, setLoadingScreen] = useState(false); // toggle Loading Screen
  const [isOptionsLoading, setIsOptionsLoading] = useState(false); // to display loading screen when user selects a country or state

  const [hallVendorData, setHallVendorData] = useState({
    ...hallVendorDataTemplate,
  });
  const [customerData, setCustomerData] = useState({
    ...customerDataTemplate,
  });
  const [otherVendorData, setOtherVendorData] = useState({
    ...otherVendorDataTemplate,
  });
  const [commonData, setCommonData] = useState({
    // this contains fields from
    ...commonDataTemplate,
  });

  const [hallVendorDataErrorInfo, setHallVendorDataErrorInfo] = useState({
    ...hallVendorDataTemplate,
    hallCapacity: "",
    hallRooms: "",
    hallParking: "",
    hallParkingCapacity: "",
    hallVegRate: "",
    hallNonVegRate: "",
    hallFreezDay: "",
    hallEventTypes: "",
  });
  const [customerDataErrorInfo, setCustomerDataErrorInfo] = useState({
    ...customerDataTemplate,
  });
  const [otherVendorDataErrorInfo, setOtherVendorDataErrorInfo] = useState({
    ...otherVendorDataTemplate,
  });
  const [commonDataErrorInfo, setCommonDataErrorInfo] = useState({
    ...commonDataTemplate,
    images: "",
    country: "",
    mainMobileNo: "",
    mainOfficeNo: "",
    alternateOfficeNo: "",
    alternateMobileNo: "",
  });
  const [formErrorUpdateFlag, setFormErrorUpdateFlag] = useState(false);

  useEffect(() => {
    try {
      if (userConfirmation && !userConfirmationDialog) {
        handleFormSubmit();
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [userConfirmation, userConfirmationDialog]);

  //fetch states data when a country is selected
  useEffect(() => {
    try {
      setIsOptionsLoading(true);
      dispatch(fetchStatesOfCountryData(commonData.country));
      setIsOptionsLoading(false);
    } catch (error) {
      setIsOptionsLoading(false);
      console.error(error.message);
    } finally {
      setIsOptionsLoading(false);
    }
  }, [commonData.country]);

  //fetch cities data when a state is selected
  useEffect(() => {
    try {
      setIsOptionsLoading(true);
      dispatch(fetchCitiesOfStateData(commonData.country, commonData.state));
    } catch (error) {
      setIsOptionsLoading(false);
      console.error(error.message);
    } finally {
      setIsOptionsLoading(false);
    }
  }, [commonData.state]);

  useEffect(() => {
    try {
      switch (formType) {
        case "FORM_ONE":
          if (commonData.address) {
            // ensuring that form is filled before proceeding
            setLoadingScreen(true);
            const requiredFields = [
              customerDataErrorInfo.customerFirstName,
              customerDataErrorInfo.customerLastName,
              hallVendorDataErrorInfo.hallName,
              otherVendorDataErrorInfo.companyName,
              commonDataErrorInfo.country,
              commonDataErrorInfo.state,
              commonDataErrorInfo.city,
              commonDataErrorInfo.taluk,
              commonDataErrorInfo.pincode,
            ];

            const isFormValid = requiredFields.every((field) => field === "");

            if (isFormValid) {
              setFormType("FORM_TWO");
            }
            setLoadingScreen(false);
          }
          break;
        case "FORM_THREE":
          {
            const requiredFields = [
              commonDataErrorInfo.mainContactFirstName,
              commonDataErrorInfo.mainContactLastName,
              commonDataErrorInfo.mainDesignation,
              commonDataErrorInfo.mainEmail,
              commonDataErrorInfo.mainMobileNo,
              commonDataErrorInfo.mainOfficeNo,
              commonDataErrorInfo.alternateEmail,
              commonDataErrorInfo.alternateMobileNo,
              commonDataErrorInfo.alternateOfficeNo,
            ];

            const isFormValid = requiredFields.every((field) => field === "");

            if (isFormValid) {
              if (userType === "CUSTOMER") {
                handleFormSubmit();
                return;
              }
              setFormType("FORM_FOUR");
            }
          }
          break;
        case "FORM_FOUR":
          {
            const requiredFields = [
              commonDataErrorInfo.images,
              commonDataErrorInfo.description,
              hallVendorDataErrorInfo.hallCapacity,
              hallVendorDataErrorInfo.hallRooms,
              hallVendorDataErrorInfo.hallParkingCapacity,
            ];

            const isFormValid = requiredFields.every((field) => field === "");

            if (isFormValid) {
              setUserConfirmationDialog(true);
              return;
            }
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [formErrorUpdateFlag]);

  const handleCustomerData = (key, value) => {
    setCustomerData((previousData) => ({
      ...previousData,
      [key]: value,
    }));
  };

  const handleHallVendorData = (key, value) => {
    setHallVendorData((previousData) => ({
      ...previousData,
      [key]: value,
    }));
  };

  const handleOtherVendorData = (key, value) => {
    setOtherVendorData((previousData) => ({
      ...previousData,
      [key]: value,
    }));
  };

  const handleCommonData = (key, value) => {
    setCommonData((previousData) => ({
      ...previousData,
      [key]: value,
    }));
  };

  const handleCustomerDataErrorInfo = async (field, errorMessage) => {
    setCustomerDataErrorInfo((prevErrorInfo) => ({
      ...prevErrorInfo,
      [field]: errorMessage,
    }));
  };

  const handleHallVendorDataErrorInfo = (field, errorMessage) => {
    setHallVendorDataErrorInfo((prevErrorInfo) => ({
      ...prevErrorInfo,
      [field]: errorMessage,
    }));
  };

  const handleOtherVendorDataErrorInfo = (field, errorMessage) => {
    setOtherVendorDataErrorInfo((prevErrorInfo) => ({
      ...prevErrorInfo,
      [field]: errorMessage,
    }));
  };

  const handleCommonDataErrorInfo = (field, errorMessage) => {
    setCommonDataErrorInfo((prevErrorInfo) => ({
      ...prevErrorInfo,
      [field]: errorMessage,
    }));
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    let finalImageList = [];
    let finalImageListCount = 0;
    let requiredImageCount = 0;

    if (commonData.images) {
      finalImageList = [...commonData.images];
      finalImageListCount = commonData.images.length;
    }

    if (vendorType === "Banquet Hall") {
      requiredImageCount = 10;
    } else {
      requiredImageCount = 5;
    }

    if (selectedFiles.length + finalImageListCount > requiredImageCount) {
      handleCommonDataErrorInfo("images", "You can set at most 10 images!");
      return;
    }

    finalImageList = [...finalImageList, ...selectedFiles];

    handleCommonData("images", finalImageList);
  };

  const getRegisterDocumentType = () => {
    const fileExtension = commonData.registerDocument?.name
      .split(".")
      .pop()
      .toLowerCase();
    console.log(fileExtension);
    switch (fileExtension) {
      case "pdf":
        return Images.pdf;
      case "pptx" || "ppt":
        return Images.pptx;
      case "docx":
        return Images.docx;
      case "png" || "jpg" || "jpeg":
        return Images.jpg;
      default:
        return Images.txt;
    }
  };

  const validateFormOne = () => {
    if (userType === "CUSTOMER") {
      if (!customerData.customerFirstName) {
        handleCustomerDataErrorInfo(
          "customerFirstName",
          "First name is required"
        );
      } else {
        handleCustomerDataErrorInfo("customerFirstName", "");
      }
      if (!customerData.customerLastName) {
        handleCustomerDataErrorInfo(
          "customerLastName",
          "Last name is required"
        );
      } else {
        handleCustomerDataErrorInfo("customerLastName", "");
      }
    } else {
      if (vendorType === "Banquet Hall") {
        if (!hallVendorData.hallName) {
          handleHallVendorDataErrorInfo("hallName", "Hall name is required");
        } else {
          handleHallVendorDataErrorInfo("hallName", "");
        }
      } else {
        if (!otherVendorData.companyName) {
          handleOtherVendorDataErrorInfo(
            "companyName",
            "Brand name is required"
          );
        } else {
          handleOtherVendorDataErrorInfo("companyName", "");
        }
      }
    }
    if (!commonData.address) {
      handleCommonDataErrorInfo("address", "Address is required");
    } else {
      handleCommonDataErrorInfo("address", "");
    }
    if (!commonData.landmark) {
      handleCommonDataErrorInfo("landmark", "Landmark is required");
    } else {
      handleCommonDataErrorInfo("landmark", "");
    }
    if (!commonData.state) {
      handleCommonDataErrorInfo("state", "State is required");
    } else {
      handleCommonDataErrorInfo("state", "");
    }
    if (!commonData.city) {
      handleCommonDataErrorInfo("city", "City is required");
    } else {
      handleCommonDataErrorInfo("city", "");
    }
    if (!commonData.taluk) {
      handleCommonDataErrorInfo("taluk", "Taluk is required");
    } else {
      handleCommonDataErrorInfo("taluk", "");
    }
    if (!commonData.pincode) {
      handleCommonDataErrorInfo("pincode", "Pincode is required");
    } else {
      handleCommonDataErrorInfo("pincode", "");
    }

    setFormErrorUpdateFlag((prevFlag) => !prevFlag);
  };

  const validateFormThree = () => {
    if (!commonData.mainDesignation) {
      handleCommonDataErrorInfo("mainDesignation", "Designation is required");
    } else {
      handleCommonDataErrorInfo("mainDesignation", "");
    }
    if (!commonData.mainOfficeNo) {
      handleCommonDataErrorInfo(
        "mainOfficeNo",
        "Main office number is required"
      );
    } else if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(commonData.mainOfficeNo)) {
      handleCommonDataErrorInfo(
        "mainOfficeNo",
        "Please enter a valid phone number"
      );
    } else {
      handleCommonDataErrorInfo("mainOfficeNo", "");
    }
    if (!commonData.mainMobileNo) {
      handleCommonDataErrorInfo(
        "mainMobileNo",
        "Main mobile number is required"
      );
    } else if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(commonData.mainMobileNo)) {
      handleCommonDataErrorInfo(
        "mainMobileNo",
        "Please enter a valid phone number"
      );
    } else {
      handleCommonDataErrorInfo("mainMobileNo", "");
    }
    if (!commonData.mainEmail) {
      handleCommonDataErrorInfo("mainEmail", "Email is required");
    } else if (!/\S+@\S+\.\S+/.test(commonData.mainEmail)) {
      handleCommonDataErrorInfo(
        "mainEmail",
        "Please enter a valid email address"
      );
    } else if (!commonData.mainEmail.endsWith("@gmail.com")) {
      handleCommonDataErrorInfo("mainEmail", "Couldn't find your account");
    } else {
      handleCommonDataErrorInfo("mainEmail", "");
    }

    if (userType === "VENDOR") {
      if (!commonData.mainContactFirstName) {
        handleCommonDataErrorInfo(
          "mainContactFirstName",
          "First name is required"
        );
      } else {
        handleCommonDataErrorInfo("mainContactFirstName", "");
      }
      if (!commonData.mainContactLastName) {
        handleCommonDataErrorInfo(
          "mainContactLastName",
          "Last name is required"
        );
      } else {
        handleCommonDataErrorInfo("mainContactLastName", "");
      }
    }

    if (commonData.alternateOfficeNo !== "+91") {
      if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(commonData.alternateOfficeNo)) {
        handleCommonDataErrorInfo(
          "alternateOfficeNo",
          "Please enter a valid phone number"
        );
      } else {
        handleCommonDataErrorInfo("alternateOfficeNo", "");
      }
    }

    if (commonData.alternateMobileNo !== "+91") {
      if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(commonData.alternateMobileNo)) {
        handleCommonDataErrorInfo(
          "alternateMobileNo",
          "Please enter a valid phone number"
        );
      } else {
        handleCommonDataErrorInfo("alternateMobileNo", "");
      }
    }

    if (commonData.alternateEmail) {
      if (!/\S+@\S+\.\S+/.test(commonData.alternateEmail)) {
        handleCommonDataErrorInfo(
          "alternateEmail",
          "Please enter a valid email address"
        );
      } else if (!commonData.alternateEmail.endsWith("@gmail.com")) {
        handleCommonDataErrorInfo(
          "alternateEmail",
          "Couldn't find your account"
        );
      } else {
        handleCommonDataErrorInfo("alternateEmail", "");
      }
    }

    setFormErrorUpdateFlag((prevFlag) => !prevFlag);
  };

  const validateFormFour = () => {
    if (commonData.images.length === 0) {
      handleCommonDataErrorInfo("images", "Please select atleast one image");
    } else {
      handleCommonDataErrorInfo("images", "");
    }

    if (!commonData.description) {
      handleCommonDataErrorInfo("description", "Description is required");
    } else {
      handleCommonDataErrorInfo("description", "");
    }

    if (vendorType === "Banquet Hall") {
      if (hallVendorData.hallCapacity === 0) {
        handleHallVendorDataErrorInfo(
          "hallCapacity",
          "Hall capacity cannot be zero"
        );
      } else {
        handleHallVendorDataErrorInfo("hallCapacity", "");
      }
      if (hallVendorData.hallRooms === 0) {
        handleHallVendorDataErrorInfo(
          "hallRooms",
          "No of rooms cannot be zero"
        );
      } else {
        handleHallVendorDataErrorInfo("hallRooms", "");
      }
      if (hallVendorData.hallVegRate === 0) {
        handleHallVendorDataErrorInfo("hallVegRate", "Price cannot be zero");
      } else {
        handleHallVendorDataErrorInfo("hallVegRate", "");
      }
      if (hallVendorData.hallNonVegRate === 0) {
        handleHallVendorDataErrorInfo("hallNonVegRate", "Price cannot be zero");
      } else {
        handleHallVendorDataErrorInfo("hallNonVegRate", "");
      }
      if (hallVendorData.hallParkingCapacity === 0) {
        handleHallVendorDataErrorInfo(
          "hallParkingCapacity",
          "Parking capacity cannot be zero"
        );
      } else {
        handleHallVendorDataErrorInfo("hallParkingCapacity", "");
      }
    }

    setFormErrorUpdateFlag((prevFlag) => !prevFlag);
  };

  const handlePrevBtnClick = () => {
    switch (formType) {
      case "FORM_ONE":
        break;
      case "FORM_TWO":
        setFormType("FORM_ONE");
        break;
      case "FORM_THREE":
        setFormType("FORM_TWO");
        break;
      case "FORM_FOUR":
        setFormType("FORM_THREE");
        break;
      default:
        break;
    }
  };

  const handleNextBtnClick = () => {
    switch (formType) {
      case "FORM_ONE":
        validateFormOne();
        break;
      case "FORM_TWO":
        setFormType("FORM_THREE");
        break;
      case "FORM_THREE":
        validateFormThree();
        break;
      case "FORM_FOUR":
        validateFormFour();
        break;
      default:
        break;
    }
  };

  const handleFormContactTypeChange = () => {
    if (formContactType === "PRIMARY") {
      setFormContactType("SECONDARY");
    } else {
      setFormContactType("PRIMARY");
    }
  };

  const handleFormSubmit = async () => {
    setLoadingScreen(true);
    let data = {};
    let URL = "";
    if (userType === "VENDOR") {
      if (vendorType === "Banquet Hall") {
        data = {
          ...hallVendorData,
          hallAddress: commonData.address,
          hallCountry: commonData.country,
          hallState: commonData.state,
          hallCity: commonData.city,
          hallTaluk: commonData.taluk,
          hallPincode: commonData.pincode,
          hallLandmark: commonData.landmark,

          hallRegisterNo: commonData.registerNo,
          hallRegisterDate: commonData.registerDate,
          hallRegisterDocument: commonData.registerDocument,

          hallMainContactName:
            commonData.mainContactFirstName +
            " " +
            commonData.mainContactLastName,
          hallMainDesignation: commonData.mainDesignation,
          hallMainOfficeNo: commonData.mainOfficeNo,
          hallMainMobileNo: commonData.mainMobileNo,
          hallMainEmail: commonData.mainEmail,

          hallAlternateContactName:
            commonData.alternateContactFirstName +
            " " +
            commonData.alternateContactLastName,
          hallAlternateDesignation: commonData.alternateDesignation,
          hallAlternateOfficeNo: commonData.alternateOfficeNo,
          hallAlternateMobileNo: commonData.alternateMobileNo,
          hallAlternateEmail: commonData.alternateEmail,

          hallDescription: commonData.description,

          hallEventTypes: userInfo.userDetails.Document.eventTypes,
          hallImages: commonData.images,

          programId: "USER",
          hallUserId: userInfo.userDetails.Document._id,
        };
        URL = `http://localhost:8000/eventify_server/hallMaster/registerHall/?userId=${userInfo.userDetails.UID}`;
      } else {
        data = {
          ...otherVendorData,
          companyAddress: commonData.address,
          companyCity: commonData.city,
          companyPincode: commonData.pincode,
          companyState: commonData.state,
          companyTaluk: commonData.taluk,
          companyCountry: commonData.country,
          companyLandmark: commonData.landmark,

          vendorRegisterNo: commonData.registerNo,
          vendorRegisterDate: commonData.registerDate,
          vendorRegisterDocument: commonData.registerDocument,

          vendorMainContactName:
            commonData.mainContactFirstName +
            " " +
            commonData.mainContactLastName,
          vendorMainDesignation: commonData.mainDesignation,
          vendorMainOfficeNo: commonData.mainOfficeNo,
          vendorMainMobileNo: commonData.mainMobileNo,
          vendorMainEmail: commonData.mainEmail,

          vendorAlternateContactName:
            commonData.alternateContactFirstName +
            " " +
            commonData.alternateContactLastName,
          vendorAlternateDesignation: commonData.alternateDesignation,
          vendorAlternateOfficeNo: commonData.alternateOfficeNo,
          vendorAlternateMobileNo: commonData.alternateMobileNo,
          vendorAlternateEmail: commonData.alternateEmail,

          vendorTypeId: userInfo.userDetails.Document.vendorTypeId,
          vendorDescription: commonData.description,
          vendorEventTypes: userInfo.userDetails.Document.eventTypes,
          vendorImages: commonData.images,

          programId: "USER",
          vendorUserId: userInfo.userDetails.Document._id,
        };
        URL = `http://localhost:8000/eventify_server/vendorMaster/registerVendor/?userId=${userInfo.userDetails.UID}&vendorType=${userInfo.userDetails.vendorType}`;
      }
    } else {
      const { customerFirstName, customerLastName, ...remainingInfo } =
        customerData;
      data = {
        ...remainingInfo,
        customerName: customerFirstName + " " + customerLastName,

        customerAddress: commonData.address,
        customerCity: commonData.city,
        customerPincode: commonData.pincode,
        customerState: commonData.state,
        customerTaluk: commonData.taluk,
        customerCountry: commonData.country,
        customerLandmark: commonData.landmark,

        customerDesignation: commonData.mainDesignation,
        customerMainOfficeNo: commonData.mainOfficeNo,
        customerMainMobileNo: commonData.mainMobileNo,
        customerMainEmail: commonData.mainEmail,

        customerAlternateMobileNo: commonData.alternateMobileNo,
        customerAlternateEmail: commonData.alternateEmail,

        customerDocumentId: commonData.registerNo,

        programId: "USER", // required-true
      };
      URL = `http://localhost:8000/eventify_server/customerMaster/updateCustomer/?documentId=${userInfo.userDetails.Document._id}&userId=${userInfo.userDetails.UID}`;
    }

    try {
      console.log(data);
      const response = userType === "CUSTOMER" ? await axios.patch(URL, data) : await axios.post(URL, data);
      console.log(response.data);
    } catch(error) {
      setLoadingScreen(false);
      console.error(error.message);
    }
    setLoadingScreen(false);
    handleClose();
  };

  return (
    <div className="registrationForm__container">
      <Dialog
        // fullScreen={fullScreen}
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleClose();
          }
        }}
        // aria-describedby="alert-dialog-slide-description"
        // aria-labelledby="responsive-dialog-title"
        maxWidth="lg"
      >
        {loadingScreen && <LoadingScreen />}
        {welcomeScreen ? (
          <div className="welcomeScreen__container">
            <div className="image__wrapper">
              {/* <img src={Images.welcomePageBg} alt="" /> */}
            </div>
            <div className="contents__wrapper">
              <img src={Images.welcomePageThankYou} alt="" />
              <h2 className="title">Thank you for signing up !!</h2>
              <div className="userProfile">
                <PersonIcon className="icon personIcon" />
                <p>{userType === "CUSTOMER" ? userInfo.userDetails?.Document.customerName : userInfo.userDetails?.Document.vendorName}</p>
                <VerifiedIcon className="icon verificationIcon" />
              </div>
              <div className="description">
                {userType === "CUSTOMER" ? (
                  <p>
                    Congratulations on joining us! Get ready for a seamless
                    journey towards your dream wedding. <br /> Let&apos;s create
                    unforgettable memories together. Your perfect wedding starts
                    here!
                  </p>
                ) : (
                  <p>
                    Welcome aboard! Elevate wedding experiences with your
                    expertise and join our vibrant community.
                    <br /> Join us in making every wedding extraordinary.
                    Let&apos;s create magic together!
                  </p>
                )}
              </div>
              <button className="continueBtn" onClick={()=> setWelcomeScreen(false)}>Continue</button>
              {userType === "CUSTOMER" && (
                <button className="skipBtn" onClick={handleClose}>Skip! I will confirm later</button>
              )}
            </div>
          </div>
        ) : (
          <div className="registrationFormMain__wrapper">
            <div className="img__wrapper">
              <div className="companyInfo">
                <img src={Images.logo} alt="EventifyConnect" />
                <p>EventifyConnect</p>
              </div>
              <div className="bgCover">
                <p>
                  Let&apos;s get <br /> <span>Started</span>
                </p>
              </div>
              <img
                src={Images.userRegistrationPageBg2}
                alt=""
                style={{
                  objectPosition:
                    formType === "FORM_FOUR" ? "center" : "left center",
                }}
              />
            </div>
            <div className="contents__wrapper">
              <div className="formTitle__wrapper">
                <h2 className="form__title">
                  {userType === "VENDOR" ? (
                    vendorType === "Banquet Hall" ? (
                      <span>Hall Information</span>
                    ) : (
                      <span>Vendor Information</span>
                    )
                  ) : (
                    <span>Customer Information</span>
                  )}
                </h2>
                <p className="form__sub-title">
                  {userType === "VENDOR" ? (
                    <span>Fill the from to become a part of the team</span>
                  ) : (
                    <span>Tell us more about yourself</span>
                  )}
                </p>
              </div>
              <div className="progressIndicator__wrapper">
                <div className="sub-wrapper currentForm">
                  <div className="formNumberIndicator">
                    {formType === "FORM_ONE" ? (
                      <span>1</span>
                    ) : (
                      <DoneIcon className="icon" />
                    )}
                  </div>
                  <p className="tag">Address</p>
                </div>
                <div className="progressBar" style={progressBarStyle}>
                  <div
                    style={
                      formType !== "FORM_ONE"
                        ? { ...beforeStyle, backgroundColor: "#007bff" }
                        : beforeStyle
                    }
                  ></div>
                </div>
                <div
                  className={`sub-wrapper ${
                    formType !== "FORM_ONE" && "currentForm"
                  }`}
                >
                  <div className="formNumberIndicator">
                    {formType === "FORM_ONE" || formType === "FORM_TWO" ? (
                      <span>2</span>
                    ) : (
                      <DoneIcon className="icon" />
                    )}
                  </div>
                  <p className="tag">Register</p>
                </div>
                <div className="progressBar" style={progressBarStyle}>
                  <div
                    style={
                      formType !== "FORM_ONE" && formType !== "FORM_TWO"
                        ? { ...beforeStyle, backgroundColor: "#007bff" }
                        : beforeStyle
                    }
                  ></div>
                </div>
                <div
                  className={`sub-wrapper ${
                    formType !== "FORM_ONE" &&
                    formType !== "FORM_TWO" &&
                    "currentForm"
                  }`}
                >
                  <div className="formNumberIndicator">
                    {formType !== "FORM_FOUR" ? (
                      <span>3</span>
                    ) : (
                      <DoneIcon className="icon" />
                    )}
                  </div>
                  <p className="tag">Contact</p>
                </div>
                {userType === "VENDOR" && (
                  <>
                    <div className="progressBar" style={progressBarStyle}>
                      <div
                        style={
                          formType === "FORM_FOUR"
                            ? { ...beforeStyle, backgroundColor: "#007bff" }
                            : beforeStyle
                        }
                      ></div>
                    </div>
                    <div
                      className={`sub-wrapper ${
                        formType === "FORM_FOUR" && "currentForm"
                      }`}
                    >
                      <div className="formNumberIndicator">
                        {/* {formType === "FORM_FOUR" ? <span>4</span> : <DoneIcon />} */}
                        <span>4</span>
                      </div>
                      <p className="tag">Detailed</p>
                    </div>
                  </>
                )}
              </div>
              <form className="form__container">
                {formType === "FORM_ONE" && (
                  <div className="userInput__wrapper">
                    {userType === "CUSTOMER" ? (
                      <div className="textField__wrapper">
                        <div className="sub-wrapper">
                          <div className="title">First Name *</div>
                          <input
                            type="text"
                            name="firstName"
                            value={customerData.customerFirstName}
                            placeholder="John"
                            onChange={(e) =>
                              handleCustomerData(
                                "customerFirstName",
                                e.target.value
                              )
                            }
                            style={
                              customerDataErrorInfo.customerFirstName
                                ? { border: "2px solid red" }
                                : {}
                            }
                            className="input"
                            spellCheck={false}
                          />
                          {customerDataErrorInfo.customerFirstName && (
                            <div className="inputError">
                              <ErrorIcon className="icon" />
                              <p>{customerDataErrorInfo.customerFirstName}</p>
                            </div>
                          )}
                        </div>
                        <div className="sub-wrapper">
                          <div className="title">Last Name *</div>
                          <input
                            type="text"
                            name="lastName"
                            value={customerData.customerLastName}
                            placeholder="Smith"
                            onChange={(e) =>
                              handleCustomerData(
                                "customerLastName",
                                e.target.value
                              )
                            }
                            style={
                              customerDataErrorInfo.customerLastName
                                ? { border: "2px solid red" }
                                : {}
                            }
                            className="input"
                            spellCheck={false}
                          />
                          {customerDataErrorInfo.customerLastName && (
                            <div className="inputError">
                              <ErrorIcon className="icon" />
                              <p>{customerDataErrorInfo.customerLastName}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="textField">
                        <label className="title">
                          {vendorType === "Banquet Hall" ? (
                            <span>Hall Name *</span>
                          ) : (
                            <span>Company Name *</span>
                          )}
                        </label>
                        {vendorType === "Banquet Hall" ? (
                          <>
                            <input
                              type="text"
                              name="hallName"
                              value={hallVendorData.hallName}
                              onChange={(e) =>
                                handleHallVendorData("hallName", e.target.value)
                              }
                              style={
                                hallVendorDataErrorInfo.hallName
                                  ? { border: "2px solid red" }
                                  : {}
                              }
                              placeholder={"Enter hall name"}
                              className="input"
                              spellCheck={false}
                            />
                            {hallVendorDataErrorInfo.hallName && (
                              <div className="inputError">
                                <ErrorIcon className="icon" />
                                <p>{hallVendorDataErrorInfo.hallName}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              name="companyName"
                              value={otherVendorData.companyName}
                              onChange={(e) =>
                                handleOtherVendorData(
                                  "companyName",
                                  e.target.value
                                )
                              }
                              style={
                                otherVendorDataErrorInfo.companyName
                                  ? { border: "2px solid red" }
                                  : {}
                              }
                              placeholder={"Enter company name"}
                              className="input"
                              spellCheck={false}
                            />
                            {otherVendorDataErrorInfo.companyName && (
                              <div className="inputError">
                                <ErrorIcon className="icon" />
                                <p>{otherVendorDataErrorInfo.companyName}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    <div className="textField">
                      <div className="title">Address *</div>
                      <>
                        <input
                          type="text"
                          name="address"
                          value={commonData.address}
                          onChange={(e) =>
                            handleCommonData("address", e.target.value)
                          }
                          style={
                            commonDataErrorInfo.address
                              ? { border: "2px solid red" }
                              : {}
                          }
                          placeholder="Enter the address"
                          className="input"
                          spellCheck={false}
                        />
                        {commonDataErrorInfo.address && (
                          <div className="inputError">
                            <ErrorIcon className="icon" />
                            <p>{commonDataErrorInfo.address}</p>
                          </div>
                        )}
                      </>
                    </div>
                    <div className="textField">
                      <div className="title">Landmark *</div>
                      <>
                        <input
                          type="text"
                          name="landmark"
                          value={commonData.landmark}
                          onChange={(e) =>
                            handleCommonData("landmark", e.target.value)
                          }
                          style={
                            commonDataErrorInfo.landmark
                              ? { border: "2px solid red" }
                              : {}
                          }
                          placeholder="Enter the landmark"
                          className="input"
                          spellCheck={false}
                        />
                        {commonDataErrorInfo.landmark && (
                          <div className="inputError">
                            <ErrorIcon className="icon" />
                            <p>{commonDataErrorInfo.landmark}</p>
                          </div>
                        )}
                      </>
                    </div>
                    <div className="textField__wrapper">
                      <div className="sub-wrapper">
                        <div className="title">Country *</div>
                        <>
                          <div
                            style={
                              commonDataErrorInfo.country
                                ? {
                                    border: "2px solid red",
                                    borderRadius: "5px",
                                  }
                                : {}
                            }
                          >
                            <Select
                              styles={customSelectStyles}
                              options={
                                Array.isArray(data.countries.data)
                                  ? data.countries.data?.map((country) => ({
                                      value: country,
                                      label: country,
                                    }))
                                  : null
                              }
                              value={
                                commonData.country
                                  ? {
                                      value: commonData.country,
                                      label: commonData.country,
                                    }
                                  : null
                              }
                              onChange={(selectedOption) =>
                                handleCommonData(
                                  "country",
                                  selectedOption.value
                                )
                              }
                              placeholder="Select your country"
                              className="selectInput"
                              components={{
                                DropdownIndicator: () => (
                                  <KeyboardArrowDownIcon
                                    style={{ color: "#007bff" }}
                                  />
                                ),
                              }}
                              menuShouldScrollIntoView={false}
                              hideSelectedOptions={false}
                              closeMenuOnSelect
                              isClearable={false}
                              isSearchable
                            />
                          </div>
                          {commonDataErrorInfo.country && (
                            <div className="inputError">
                              <ErrorIcon className="icon" />
                              <p>{commonDataErrorInfo.country}</p>
                            </div>
                          )}
                        </>
                      </div>
                      <div className="sub-wrapper">
                        <div className="title">State *</div>
                        <>
                          <div
                            style={
                              commonDataErrorInfo.state
                                ? {
                                    border: "2px solid red",
                                    borderRadius: "5px",
                                  }
                                : {}
                            }
                          >
                            <Select
                              styles={customSelectStyles}
                              options={
                                data.states.data &&
                                Array.isArray(data.states.data)
                                  ? data.states.data?.map((state) => ({
                                      value: state,
                                      label: state,
                                    }))
                                  : null
                              }
                              value={
                                commonData.state
                                  ? {
                                      value: commonData.state,
                                      label: commonData.state,
                                    }
                                  : null
                              }
                              onChange={(selectedOption) =>
                                handleCommonData("state", selectedOption.value)
                              }
                              placeholder="Select your state"
                              className="selectInput"
                              components={{
                                DropdownIndicator: () => (
                                  <KeyboardArrowDownIcon
                                    style={{ color: "#007bff" }}
                                  />
                                ),
                              }}
                              menuShouldScrollIntoView={false}
                              hideSelectedOptions={false}
                              closeMenuOnSelect
                              isClearable={false}
                              isSearchable
                            />
                          </div>
                          {commonDataErrorInfo.state && (
                            <div className="inputError">
                              <ErrorIcon className="icon" />
                              <p>{commonDataErrorInfo.state}</p>
                            </div>
                          )}
                        </>
                      </div>
                    </div>
                    <div className="textField__wrapper">
                      <div className="sub-wrapper">
                        <div className="title">City *</div>
                        <>
                          <div
                            style={
                              commonDataErrorInfo.city
                                ? {
                                    border: "2px solid red",
                                    borderRadius: "5px",
                                  }
                                : {}
                            }
                          >
                            <Select
                              styles={customSelectStyles}
                              options={
                                data.citiesOfState.data &&
                                Array.isArray(data.citiesOfState.data)
                                  ? data.citiesOfState.data?.map((city) => ({
                                      value: city,
                                      label: city,
                                    }))
                                  : null
                              }
                              value={
                                commonData.city
                                  ? {
                                      value: commonData.city,
                                      label: commonData.city,
                                    }
                                  : null
                              }
                              onChange={(selectedOption) =>
                                handleCommonData("city", selectedOption.value)
                              }
                              placeholder="Select your city"
                              className="selectInput"
                              components={{
                                DropdownIndicator: () => (
                                  <KeyboardArrowDownIcon
                                    style={{ color: "#007bff" }}
                                  />
                                ),
                              }}
                              menuShouldScrollIntoView={false}
                              hideSelectedOptions={false}
                              closeMenuOnSelect
                              isClearable={false}
                              isSearchable
                            />
                          </div>
                          {commonDataErrorInfo.city && (
                            <div className="inputError">
                              <ErrorIcon className="icon" />
                              <p>{commonDataErrorInfo.city}</p>
                            </div>
                          )}
                        </>
                      </div>
                      <div className="taluk sub-wrapper">
                        <div className="title">Taluk *</div>
                        <>
                          <input
                            type="text"
                            name="taluk"
                            value={commonData.taluk}
                            onChange={(e) =>
                              handleCommonData("taluk", e.target.value)
                            }
                            style={
                              commonDataErrorInfo.taluk
                                ? { border: "2px solid red" }
                                : {}
                            }
                            placeholder="Enter the landmark"
                            className="input"
                            spellCheck={false}
                          />
                          {commonDataErrorInfo.taluk && (
                            <div className="inputError">
                              <ErrorIcon className="icon" />
                              <p>{commonDataErrorInfo.taluk}</p>
                            </div>
                          )}
                        </>
                      </div>
                    </div>
                    <div className="textField pinCode__wrapper">
                      <div className="title">Pincode *</div>
                      <>
                        <input
                          type="text"
                          name="pincode"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          onKeyDown={(e) => {
                            // Allow: backspace, delete, tab, escape, enter, and .
                            if (
                              [46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !==
                                -1 ||
                              // Allow: Ctrl+A/Ctrl+C/Ctrl+V/Ctrl+X
                              (e.keyCode === 65 && e.ctrlKey === true) || // Ctrl+A
                              (e.keyCode === 67 && e.ctrlKey === true) || // Ctrl+C
                              (e.keyCode === 86 && e.ctrlKey === true) || // Ctrl+V
                              (e.keyCode === 88 && e.ctrlKey === true) // Ctrl+X
                            ) {
                              // let it happen, don't do anything
                              return;
                            }
                            // Ensure that it is a number and stop the keypress
                            if (
                              (e.shiftKey ||
                                e.keyCode < 48 ||
                                e.keyCode > 57) &&
                              (e.keyCode < 96 || e.keyCode > 105)
                            ) {
                              e.preventDefault();
                            }
                          }}
                          value={commonData.pincode}
                          onChange={(e) =>
                            handleCommonData("pincode", e.target.value)
                          }
                          style={
                            commonDataErrorInfo.pincode
                              ? { border: "2px solid red" }
                              : {}
                          }
                          placeholder="Enter your pincode"
                          className="input"
                          spellCheck={false}
                        />
                        {commonDataErrorInfo.pincode && (
                          <div className="inputError">
                            <ErrorIcon className="icon" />
                            <p>{commonDataErrorInfo.pincode}</p>
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                )}
                {formType === "FORM_TWO" && (
                  <div className="userInput__wrapper registrationDetails__wrapper">
                    {userType === "CUSTOMER" && (
                      <>
                        <div className="profilePic__wrapper">
                          <div className="profilePic">
                            <img
                              alt="Remy Sharp"
                              src={
                                customerData.customerProfileImage &&
                                URL.createObjectURL(
                                  customerData.customerProfileImage
                                )
                              }
                              className="avatar"
                            />
                            {customerData.customerProfileImage ? (
                              <div
                                className="icon__wrapper"
                                onClick={(e) =>
                                  handleCustomerData("customerProfileImage", "")
                                }
                              >
                                <CloseIcon className="icon" />
                              </div>
                            ) : (
                              <div
                                className="icon__wrapper"
                                onClick={(e) =>
                                  profilePicInputRef.current.click()
                                }
                              >
                                <AddIcon className="icon" />
                              </div>
                            )}
                          </div>
                          <input
                            ref={profilePicInputRef}
                            type="file"
                            onChange={(e) => {
                              handleCustomerData(
                                "customerProfileImage",
                                e.target.files[0]
                              );
                            }}
                            className="profilePicInput"
                            style={{ display: "none" }}
                            accept="image/*"
                          />
                          <button disabled className="profileBtn">
                            Profile Pic
                          </button>
                        </div>
                        <div className="textField">
                          <label className="title">Document Type</label>
                          <Select
                            styles={customSelectStyles}
                            placeholder="Select document type"
                            options={IdDocumentTypes.map((id) => ({
                              value: id,
                              label: id,
                            }))}
                            value={{
                              value: customerData.customerDocumentType,
                              label: customerData.customerDocumentType,
                            }}
                            onChange={(selectedOption) =>
                              handleCustomerData(
                                "customerDocumentType",
                                selectedOption.value
                              )
                            }
                            className="selectInput"
                            components={{
                              DropdownIndicator: () => (
                                <KeyboardArrowDownIcon
                                  style={{ color: "#007bff" }}
                                />
                              ),
                            }}
                            menuShouldScrollIntoView={false}
                            hideSelectedOptions={false}
                            closeMenuOnSelect
                            isClearable={false}
                            isSearchable
                          />
                        </div>
                      </>
                    )}
                    <div className="textField">
                      <label className="title">
                        {userType === "CUSTOMER" ? (
                          <span>Document Id</span>
                        ) : (
                          <span>Registration No</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="registerNo"
                        value={commonData.registerNo}
                        onChange={(e) =>
                          handleCommonData("registerNo", e.target.value)
                        }
                        placeholder={
                          userType === "CUSTOMER"
                            ? "Enter document id"
                            : "Enter registration number"
                        }
                        className="input"
                        spellCheck={false}
                      />
                    </div>
                    {userType === "VENDOR" && (
                      <>
                        <div className="textField">
                          <label className="title">Registration Date</label>
                          <input
                            type="date"
                            value={commonData.registerDate}
                            placeholder="dd-mm-yyyy"
                            className="input"
                            onChange={(e) =>
                              handleCommonData("registerDate", e.target.value)
                            }
                          />
                        </div>
                        {/* <div {...getRootProps()} className="img__dropZone">
                              <input {...getInputProps()} placeholder="Hello"/>
                              <p>Drag & drop an image here, or click to select one</p>
                            </div> */}
                        <div className="img__dropZone">
                          <label className="title">
                            Registration Document{" "}
                          </label>
                          {!commonData.registerDocument ? (
                            <div
                              className="imgUploadArea"
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                handleCommonData(
                                  "registerDocument",
                                  e.dataTransfer.files[0]
                                );
                              }}
                              onClick={(e) => fileInputRef.current.click()}
                            >
                              <UploadFileIcon className="icon" />
                              <p className="text">
                                Drag file to upload or <span>Browse</span>
                              </p>
                              <input
                                ref={fileInputRef}
                                type="file"
                                onChange={(e) =>
                                  handleCommonData(
                                    "registerDocument",
                                    e.target.files[0]
                                  )
                                }
                                className="fileInput"
                                style={{ display: "none" }}
                              />
                            </div>
                          ) : (
                            <div className="documentArea">
                              <button
                                onClick={(e) =>
                                  handleCommonData("registerDocument", "")
                                }
                              >
                                <CloseIcon className="closeIcon" />
                              </button>
                              <img
                                src={getRegisterDocumentType()}
                                alt=""
                                className="documentIcon"
                              />
                              <label className="fileName">
                                {commonData.registerDocument?.name}
                              </label>
                            </div>
                          )}
                          {/* <button className="uploadBtn">Choose File</button> */}
                        </div>
                      </>
                    )}
                  </div>
                )}
                {formType === "FORM_THREE" && (
                  <div className="userInput__wrapper contactDetails__wrapper">
                    <div className="formSubTitle__wrapper">
                      <h2 className="formSubTitle">
                        {formContactType === "PRIMARY" ? (
                          <span> Primary </span>
                        ) : (
                          <span>Secondary </span>
                        )}
                        Contact Info
                      </h2>
                      <div
                        className="formSwitchTitle"
                        onClick={handleFormContactTypeChange}
                      >
                        {formContactType === "PRIMARY" ? (
                          <AddIcon className="icon" />
                        ) : (
                          <FaEdit className="icon" />
                        )}
                        <p className="switchTitle">
                          {formContactType === "PRIMARY" ? (
                            <span>Secondary</span>
                          ) : (
                            <span>Primary </span>
                          )}
                          Contact
                        </p>
                      </div>
                    </div>
                    {userType === "VENDOR" &&
                      (formContactType === "PRIMARY" ? (
                        <div className="textField__wrapper">
                          <div className="sub-wrapper">
                            <label className="title">First Name * </label>
                            <>
                              <input
                                type="text"
                                name="mainContactFirstName"
                                value={commonData.mainContactFirstName}
                                onChange={(e) =>
                                  handleCommonData(
                                    "mainContactFirstName",
                                    e.target.value
                                  )
                                }
                                style={
                                  commonDataErrorInfo.mainContactFirstName
                                    ? { border: "2px solid red" }
                                    : {}
                                }
                                placeholder="Logan"
                                className="input"
                                spellCheck="false"
                              />
                              {commonDataErrorInfo.mainContactFirstName && (
                                <div className="inputError">
                                  <ErrorIcon className="icon" />
                                  <p>
                                    {commonDataErrorInfo.mainContactFirstName}
                                  </p>
                                </div>
                              )}
                            </>
                          </div>
                          <div className="sub-wrapper">
                            <label className="title">Last Name * </label>
                            <>
                              <input
                                type="text"
                                name="mainContactLastName"
                                value={commonData.mainContactLastName}
                                onChange={(e) =>
                                  handleCommonData(
                                    "mainContactLastName",
                                    e.target.value
                                  )
                                }
                                style={
                                  commonDataErrorInfo.mainContactLastName
                                    ? { border: "2px solid red" }
                                    : {}
                                }
                                placeholder="Sanderz"
                                className="input"
                                spellCheck="false"
                              />
                              {commonDataErrorInfo.mainContactLastName && (
                                <div className="inputError">
                                  <ErrorIcon className="icon" />
                                  <p>
                                    {commonDataErrorInfo.mainContactLastName}
                                  </p>
                                </div>
                              )}
                            </>
                          </div>
                        </div>
                      ) : (
                        <div className="textField__wrapper">
                          <div className="sub-wrapper">
                            <label className="title">First Name </label>
                            <>
                              <input
                                type="text"
                                name="alternateContactFirstName"
                                value={commonData.alternateContactFirstName}
                                onChange={(e) =>
                                  handleCommonData(
                                    "alternateContactFirstName",
                                    e.target.value
                                  )
                                }
                                style={
                                  commonDataErrorInfo.alternateContactFirstName
                                    ? { border: "2px solid red" }
                                    : {}
                                }
                                placeholder="Logan"
                                className="input"
                                spellCheck="false"
                              />
                              {commonDataErrorInfo.alternateContactFirstName && (
                                <div className="inputError">
                                  <ErrorIcon className="icon" />
                                  <p>
                                    {
                                      commonDataErrorInfo.alternateContactFirstName
                                    }
                                  </p>
                                </div>
                              )}
                            </>
                          </div>
                          <div className="sub-wrapper">
                            <label className="title">Last Name </label>
                            <>
                              <input
                                type="text"
                                name="alternateContactLastName"
                                value={commonData.alternateContactLastName}
                                onChange={(e) =>
                                  handleCommonData(
                                    "alternateContactLastName",
                                    e.target.value
                                  )
                                }
                                style={
                                  commonDataErrorInfo.alternateContactLastName
                                    ? { border: "2px solid red" }
                                    : {}
                                }
                                placeholder="Sanderz"
                                className="input"
                                spellCheck="false"
                              />
                              {commonDataErrorInfo.alternateContactLastName && (
                                <div className="inputError">
                                  <ErrorIcon className="icon" />
                                  <p>
                                    {
                                      commonDataErrorInfo.alternateContactLastName
                                    }
                                  </p>
                                </div>
                              )}
                            </>
                          </div>
                        </div>
                      ))}
                    {(userType === "VENDOR" ||
                      (userType === "CUSTOMER" &&
                        formContactType === "PRIMARY")) &&
                      (formContactType === "PRIMARY" ? (
                        <>
                          <div className="textField">
                            <label className="title">Designation * </label>
                            <>
                              <input
                                type="text"
                                name="mainDesignation"
                                value={commonData.mainDesignation}
                                onChange={(e) =>
                                  handleCommonData(
                                    "mainDesignation",
                                    e.target.value
                                  )
                                }
                                style={
                                  commonDataErrorInfo.mainDesignation
                                    ? { border: "2px solid red" }
                                    : {}
                                }
                                placeholder="Cheif Manager"
                                className="input"
                                spellCheck="false"
                              />
                              {commonDataErrorInfo.mainDesignation && (
                                <div className="inputError">
                                  <ErrorIcon className="icon" />
                                  <p>{commonDataErrorInfo.mainDesignation}</p>
                                </div>
                              )}
                            </>
                          </div>
                          <div className="textField">
                            <label className="title">Office Number * </label>
                            <>
                              <div
                                className="phoneInput"
                                style={
                                  commonDataErrorInfo.mainOfficeNo
                                    ? {
                                        border: "2px solid red",
                                        borderRadius: "5px",
                                      }
                                    : {}
                                }
                              >
                                <PhoneInput
                                  country={"us"}
                                  value={commonData.mainOfficeNo}
                                  onChange={(value, country) =>
                                    handleCommonData(
                                      "mainOfficeNo",
                                      "+" + value
                                    )
                                  }
                                  inputProps={{
                                    name: "phone",
                                    required: true,
                                    autoFocus: true,
                                    placeholder: "Enter phone number",
                                  }}
                                  inputClass="input"
                                />
                              </div>
                              {commonDataErrorInfo.mainOfficeNo && (
                                <div className="inputError">
                                  <ErrorIcon className="icon" />
                                  <p>{commonDataErrorInfo.mainOfficeNo}</p>
                                </div>
                              )}
                            </>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="textField">
                            <label className="title">Designation</label>
                            <>
                              <input
                                type="text"
                                name="alternateDesignation"
                                value={commonData.alternateDesignation}
                                onChange={(e) =>
                                  handleCommonData(
                                    "alternateDesignation",
                                    e.target.value
                                  )
                                }
                                style={
                                  commonDataErrorInfo.alternateDesignation
                                    ? { border: "2px solid red" }
                                    : {}
                                }
                                placeholder="Chief Manager"
                                className="input"
                                spellCheck="false"
                              />
                              {commonDataErrorInfo.alternateDesignation && (
                                <div className="inputError">
                                  <ErrorIcon className="icon" />
                                  <p>
                                    {commonDataErrorInfo.alternateDesignation}
                                  </p>
                                </div>
                              )}
                            </>
                          </div>
                          <div className="textField">
                            <label className="title">Office Number</label>
                            <>
                              <div
                                className="phoneInput"
                                style={
                                  commonDataErrorInfo.alternateOfficeNo
                                    ? {
                                        border: "2px solid red",
                                        borderRadius: "5px",
                                      }
                                    : {}
                                }
                              >
                                <PhoneInput
                                  country={"us"}
                                  value={commonData.alternateOfficeNo}
                                  onChange={(value, country) =>
                                    handleCommonData(
                                      "alternateOfficeNo",
                                      "+" + value
                                    )
                                  }
                                  inputProps={{
                                    name: "phone",
                                    required: true,
                                    autoFocus: true,
                                    placeholder: "Enter phone number",
                                  }}
                                  inputClass="input"
                                />
                              </div>
                              {commonDataErrorInfo.alternateOfficeNo && (
                                <div className="inputError">
                                  <ErrorIcon className="icon" />
                                  <p>{commonDataErrorInfo.alternateOfficeNo}</p>
                                </div>
                              )}
                            </>
                          </div>
                        </>
                      ))}
                    {formContactType === "PRIMARY" ? (
                      <>
                        <div className="textField">
                          <label className="title">Mobile Number * </label>
                          <>
                            <div
                              className="phoneInput"
                              style={
                                commonDataErrorInfo.mainMobileNo
                                  ? {
                                      border: "2px solid red",
                                      borderRadius: "5px",
                                    }
                                  : {}
                              }
                            >
                              <PhoneInput
                                country={"us"}
                                value={commonData.mainMobileNo}
                                // eslint-disable-next-line no-unused-vars
                                onChange={(value, country) =>
                                  handleCommonData("mainMobileNo", "+" + value)
                                }
                                inputProps={{
                                  name: "phone",
                                  required: true,
                                  autoFocus: true,
                                  placeholder: "Enter phone number",
                                }}
                                inputClass="input"
                              />
                            </div>
                            {commonDataErrorInfo.mainMobileNo && (
                              <div className="inputError">
                                <ErrorIcon className="icon" />
                                <p>{commonDataErrorInfo.mainMobileNo}</p>
                              </div>
                            )}
                          </>
                        </div>
                        <div className="textField">
                          <label className="title">Email Address *</label>
                          <>
                            <input
                              type="text"
                              name="mainEmail"
                              value={commonData.mainEmail}
                              onChange={(e) =>
                                handleCommonData("mainEmail", e.target.value)
                              }
                              style={
                                commonDataErrorInfo.mainEmail
                                  ? { border: "2px solid red" }
                                  : {}
                              }
                              placeholder="Enter email id"
                              className="input"
                              spellCheck="false"
                            />
                            {commonDataErrorInfo.mainEmail && (
                              <div className="inputError">
                                <ErrorIcon className="icon" />
                                <p>{commonDataErrorInfo.mainEmail}</p>
                              </div>
                            )}
                          </>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="textField">
                          <label className="title">Mobile Number</label>
                          <>
                            <div
                              className="phoneInput"
                              style={
                                commonDataErrorInfo.alternateMobileNo
                                  ? {
                                      border: "2px solid red",
                                      borderRadius: "5px",
                                    }
                                  : {}
                              }
                            >
                              <PhoneInput
                                country={"us"}
                                value={commonData.alternateMobileNo}
                                // eslint-disable-next-line no-unused-vars
                                onChange={(value, country) =>
                                  handleCommonData(
                                    "alternateMobileNo",
                                    "+" + value
                                  )
                                }
                                inputProps={{
                                  name: "phone",
                                  required: true,
                                  autoFocus: true,
                                  placeholder: "Enter phone number",
                                }}
                                inputClass="input"
                              />
                            </div>
                            {commonDataErrorInfo.alternateMobileNo && (
                              <div className="inputError">
                                <ErrorIcon className="icon" />
                                <p>{commonDataErrorInfo.alternateMobileNo}</p>
                              </div>
                            )}
                          </>
                        </div>
                        <div className="textField">
                          <label className="title">Email Address</label>
                          <>
                            <input
                              type="text"
                              name="alternateEmail"
                              value={commonData.alternateEmail}
                              onChange={(e) =>
                                handleCommonData(
                                  "alternateEmail",
                                  e.target.value
                                )
                              }
                              style={
                                commonDataErrorInfo.alternateEmail
                                  ? { border: "2px solid red" }
                                  : {}
                              }
                              placeholder="Enter email id"
                              className="input"
                              spellCheck="false"
                            />
                            {commonDataErrorInfo.alternateEmail && (
                              <div className="inputError">
                                <ErrorIcon className="icon" />
                                <p>{commonDataErrorInfo.alternateEmail}</p>
                              </div>
                            )}
                          </>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {formType === "FORM_FOUR" && (
                  <div className="userInput__wrapper detailedInfo__wrapper">
                    {userType === "VENDOR" && (
                      <>
                        <div className="images__wrapper">
                          <div
                            className="sub-wrapper"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              handleImageChange(e);
                            }}
                          >
                            <div className="mainImage">
                              {commonData.images?.[0] ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      const updatedImages = [
                                        ...commonData.images,
                                      ];
                                      updatedImages.splice(0, 1);
                                      handleCommonData("images", updatedImages);
                                    }}
                                    className="removeBtn"
                                  >
                                    <CloseIcon className="icon" />
                                  </button>
                                  <img
                                    src={URL.createObjectURL(
                                      commonData.images[0]
                                    )}
                                    alt=""
                                    className="image"
                                  />
                                </>
                              ) : (
                                <div
                                  className="image"
                                  onClick={(e) =>
                                    vendorPicturesInputRef.current.click()
                                  }
                                >
                                  <UploadFileIcon className="uploadFileIcon" />
                                  <p className="uploadFileText">
                                    Drag file to upload or <span>Browse</span>
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="standbyImages">
                              <div className="image">
                                {commonData.images?.[1] ? (
                                  <>
                                    <button className="removeBtn">
                                      <CloseIcon className="icon" />
                                    </button>
                                    <img
                                      src={URL.createObjectURL(
                                        commonData.images[1]
                                      )}
                                      alt=""
                                      className="img"
                                    />
                                  </>
                                ) : (
                                  <div
                                    className="img"
                                    onClick={(e) =>
                                      vendorPicturesInputRef.current.click()
                                    }
                                  >
                                    <UploadFileIcon className="uploadFileIcon" />
                                  </div>
                                )}
                              </div>
                              <div className="image">
                                {commonData.images?.[2] ? (
                                  <>
                                    <button className="removeBtn">
                                      <CloseIcon className="icon" />
                                    </button>
                                    <img
                                      src={URL.createObjectURL(
                                        commonData.images[2]
                                      )}
                                      alt=""
                                      className="img"
                                    />
                                  </>
                                ) : (
                                  <div
                                    className="img"
                                    onClick={(e) =>
                                      vendorPicturesInputRef.current.click()
                                    }
                                  >
                                    <UploadFileIcon className="uploadFileIcon" />
                                  </div>
                                )}
                              </div>
                              <div className="image">
                                {commonData.images?.[3] ? (
                                  <>
                                    <button className="removeBtn">
                                      <CloseIcon className="icon" />
                                    </button>
                                    <img
                                      src={URL.createObjectURL(
                                        commonData.images[3]
                                      )}
                                      alt=""
                                      className="img"
                                    />
                                  </>
                                ) : (
                                  <div
                                    className="img"
                                    onClick={(e) =>
                                      vendorPicturesInputRef.current.click()
                                    }
                                  >
                                    <UploadFileIcon className="uploadFileIcon" />
                                  </div>
                                )}
                              </div>
                              <div className="image">
                                {commonData.images?.[4] ? (
                                  <img
                                    src={URL.createObjectURL(
                                      commonData.images[4]
                                    )}
                                    alt=""
                                    className="img"
                                  />
                                ) : (
                                  <div
                                    className="img"
                                    onClick={(e) =>
                                      vendorPicturesInputRef.current.click()
                                    }
                                  >
                                    <UploadFileIcon className="uploadFileIcon" />
                                  </div>
                                )}
                                {userType === "VENDOR" &&
                                  vendorType === "Banquet Hall" &&
                                  commonData.images?.length > 5 && (
                                    <div className="moreImagesIndicator">
                                      <span>
                                        +{commonData.images.length - 4} more
                                      </span>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                          {commonDataErrorInfo.images && (
                            <div className="imagesInputError">
                              <ErrorIcon className="icon" />
                              <p>{commonDataErrorInfo.images}</p>
                            </div>
                          )}
                          <input
                            ref={vendorPicturesInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            style={{
                              opacity: 0,
                              visibility: "hidden",
                              position: "absolute",
                              zIndex: -1,
                            }}
                          />
                          <div className="uploadBtn__wrapper">
                            <button
                              type="button"
                              className="uploadBtn"
                              onClick={(e) => {
                                vendorPicturesInputRef.current.click();
                              }}
                            >
                              Choose Files
                            </button>
                            <p className="fileCountText">
                              {commonData.images
                                ? `(${commonData.images.length}/10) selected`
                                : "(0/10) selected"}
                            </p>
                          </div>
                        </div>
                        <div className="subContents__wrapper">
                          <div className="textField">
                            <label className="title">
                              {userType === "VENDOR" &&
                              vendorType === "Banquet Hall" ? (
                                <span>Hall Description *</span>
                              ) : (
                                <span>Business Description *</span>
                              )}
                            </label>
                            <>
                              <textarea
                                type="text"
                                name="description"
                                value={commonData.description}
                                onChange={(e) =>
                                  handleCommonData(
                                    "description",
                                    e.target.value
                                  )
                                }
                                style={
                                  commonDataErrorInfo.description
                                    ? {
                                        border: "2px solid red",
                                        height: "7rem",
                                      }
                                    : { height: "7rem" }
                                }
                                placeholder="Write something ..."
                                className="input"
                                spellCheck={false}
                              />
                              {commonDataErrorInfo.description && (
                                <div className="inputError">
                                  <ErrorIcon className="icon" />
                                  <p>{commonDataErrorInfo.description}</p>
                                </div>
                              )}
                            </>
                          </div>
                          {userType === "VENDOR" &&
                            vendorType === "Banquet Hall" && (
                              <>
                                <div className="textField__wrapper">
                                  <div className="sub-wrapper">
                                    <label className="title">
                                      Seating Capacity *
                                    </label>
                                    <>
                                      <input
                                        type="number"
                                        name="hallCapacity"
                                        value={hallVendorData.hallCapacity}
                                        onChange={(e) =>
                                          handleHallVendorData(
                                            "hallCapacity",
                                            e.target.value
                                          )
                                        }
                                        style={
                                          hallVendorDataErrorInfo.hallCapacity
                                            ? { border: "2px solid red" }
                                            : {}
                                        }
                                        placeholder="Enter seating capacity"
                                        className="input"
                                      />
                                      {hallVendorDataErrorInfo.hallCapacity && (
                                        <div className="inputError">
                                          <ErrorIcon className="icon" />
                                          <p>
                                            {
                                              hallVendorDataErrorInfo.hallCapacity
                                            }
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  </div>
                                  <div className="sub-wrapper">
                                    <label className="title">
                                      No. of Rooms *
                                    </label>
                                    <>
                                      <input
                                        type="number"
                                        name="hallRooms"
                                        value={hallVendorData.hallRooms}
                                        onChange={(e) =>
                                          handleHallVendorData(
                                            "hallRooms",
                                            e.target.value
                                          )
                                        }
                                        style={
                                          hallVendorDataErrorInfo.hallRooms
                                            ? { border: "2px solid red" }
                                            : {}
                                        }
                                        placeholder="Enter room count"
                                        className="input"
                                      />
                                      {hallVendorDataErrorInfo.hallRooms && (
                                        <div className="inputError">
                                          <ErrorIcon className="icon" />
                                          <p>
                                            {hallVendorDataErrorInfo.hallRooms}
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  </div>
                                </div>
                                <div className="textField__wrapper">
                                  <div className="sub-wrapper">
                                    <label className="title">VegFood *</label>
                                    <>
                                      <input
                                        type="number"
                                        name="hallVegRate"
                                        value={hallVendorData.hallVegRate}
                                        onChange={(e) =>
                                          handleHallVendorData(
                                            "hallVegRate",
                                            e.target.value
                                          )
                                        }
                                        style={
                                          hallVendorDataErrorInfo.hallVegRate
                                            ? { border: "2px solid red" }
                                            : {}
                                        }
                                        placeholder="Veg rate per plate"
                                        className="input"
                                      />
                                      {hallVendorDataErrorInfo.hallVegRate && (
                                        <div className="inputError">
                                          <ErrorIcon className="icon" />
                                          <p>
                                            {
                                              hallVendorDataErrorInfo.hallVegRate
                                            }
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  </div>
                                  <div className="sub-wrapper">
                                    <label className="title">
                                      Non-VegFood *
                                    </label>
                                    <>
                                      <input
                                        type="number"
                                        name="hallNonVegRate"
                                        value={hallVendorData.hallNonVegRate}
                                        onChange={(e) =>
                                          handleHallVendorData(
                                            "hallNonVegRate",
                                            e.target.value
                                          )
                                        }
                                        style={
                                          hallVendorDataErrorInfo.hallNonVegRate
                                            ? { border: "2px solid red" }
                                            : {}
                                        }
                                        placeholder="N-Veg rate per plate"
                                        className="input"
                                      />
                                      {hallVendorDataErrorInfo.hallNonVegRate && (
                                        <div className="inputError">
                                          <ErrorIcon className="icon" />
                                          <p>
                                            {
                                              hallVendorDataErrorInfo.hallNonVegRate
                                            }
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  </div>
                                </div>
                                <div className="textField__wrapper">
                                  <div className="sub-wrapper">
                                    <label className="title">Parking *</label>
                                    <div className="radioInput">
                                      <div className="radio">
                                        <input
                                          type="radio"
                                          name="parking"
                                          value="AVAILABLE"
                                          checked={
                                            hallVendorData.hallParking ===
                                            "AVAILABLE"
                                          }
                                          onChange={(e) =>
                                            handleHallVendorData(
                                              "hallParking",
                                              e.target.value
                                            )
                                          }
                                        />
                                        <span>Available</span>
                                      </div>
                                      <div className="radio">
                                        <input
                                          type="radio"
                                          name="parking"
                                          value="UNAVAILABLE"
                                          checked={
                                            hallVendorData.hallParking ===
                                            "UNAVAILABLE"
                                          }
                                          onChange={(e) =>
                                            handleHallVendorData(
                                              "hallParking",
                                              e.target.value
                                            )
                                          }
                                        />
                                        <span>UnAvailable</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="sub-wrapper">
                                    <label className="title">
                                      Parking Capacity *
                                    </label>
                                    <>
                                      <input
                                        type="number"
                                        name="hallParkingCapacity"
                                        value={
                                          hallVendorData.hallParkingCapacity
                                        }
                                        onChange={(e) =>
                                          handleHallVendorData(
                                            "hallParkingCapacity",
                                            e.target.value
                                          )
                                        }
                                        style={
                                          hallVendorDataErrorInfo.hallParkingCapacity
                                            ? { border: "2px solid red" }
                                            : {}
                                        }
                                        placeholder="No of days"
                                        className="input"
                                      />
                                      {hallVendorDataErrorInfo.hallParkingCapacity && (
                                        <div className="inputError">
                                          <ErrorIcon className="icon" />
                                          <p>
                                            {
                                              hallVendorDataErrorInfo.hallParkingCapacity
                                            }
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  </div>
                                </div>
                                <div className="textField hallParkingCapacity__wrapper">
                                  <div className="sub-wrapper">
                                    <label className="title">Freez Day *</label>
                                    <>
                                      <input
                                        type="number"
                                        name="hallFreezDay"
                                        value={hallVendorData.hallFreezDay}
                                        onChange={(e) =>
                                          handleHallVendorData(
                                            "hallFreezDay",
                                            e.target.value
                                          )
                                        }
                                        style={
                                          hallVendorDataErrorInfo.hallFreezDay
                                            ? { border: "2px solid red" }
                                            : {}
                                        }
                                        placeholder="No of days"
                                        className="input"
                                      />
                                      {hallVendorDataErrorInfo.hallFreezDay && (
                                        <div className="inputError">
                                          <ErrorIcon className="icon" />
                                          <p>
                                            {
                                              hallVendorDataErrorInfo.hallFreezDay
                                            }
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  </div>
                                </div>
                              </>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </form>
              <div className="navigation__btns">
                <button
                  className="btn"
                  type="button"
                  onClick={handlePrevBtnClick}
                >
                  Prev
                </button>
                <button
                  className="btn"
                  onClick={handleNextBtnClick}
                  type="button"
                >
                  {formType === "FORM_FOUR" ||
                  (userType === "CUSTOMER" && formType === "FORM_THREE") ? (
                    <span>Submit</span>
                  ) : (
                    <span>Next</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        <Dialog
          open={userConfirmationDialog}
          onClose={() => setUserConfirmationDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirmation Dialog!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure the provided information is correct to the best of
              your knowledge? Your input is crucial for accurate registration!!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserConfirmationDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setUserConfirmationDialog(false);
                setUserConfirmation(true);
              }}
              autoFocus
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>
    </div>
  );
}

RegistrationForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  // userType: PropTypes.string.isRequired,
  // vendorType: PropTypes.string.isRequired,
};