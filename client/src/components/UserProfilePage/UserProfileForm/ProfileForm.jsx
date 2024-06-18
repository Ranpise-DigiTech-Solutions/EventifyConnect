/* eslint-disable react-hooks/exhaustive-deps */
import "./ProfileForm.scss";
import "react-phone-input-2/lib/style.css";
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import { Avatar } from "antd";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ErrorIcon from "@mui/icons-material/Error";
import StreetviewIcon from '@mui/icons-material/Streetview';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import PersonIcon from "@mui/icons-material/Person";
import { FaEdit } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { firebaseStorage } from "../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LoadingScreen } from "../../../sub-components";
import {
  fetchCitiesOfStateData,
  fetchStatesOfCountryData,
} from "../../../states/Data";
import { userDataUpdateFlag } from "../../../states/UserInfo";

const customerDataTemplate = {
  _id: "",
  customerFirstName: "",
  customerLastName: "",
  customerCurrentLocation: "",
  customerContact: "+91",
  customerEmail: "",
  customerPassword: "",
  customerUid: "", // firebase id
  customerAddress: "",
  customerCity: "",
  customerPincode: "",
  customerState: "",
  customerTaluk: "",
  customerCountry: "India",
  customerLandmark: "",
  customerDesignation: "",
  customerMainOfficeNo: "+91",
  customerMainMobileNo: "+91",
  customerMainEmail: "",
  customerAlternateMobileNo: "+91",
  customerAlternateEmail: "",
  customerDocumentType: "",
  customerDocumentId: "",
  customerGender: "",
  customerProfileImage: "",
  customerProfileImageURL: "",
  programId: "",
};

const serviceProviderDataTemplate = {
  _id: "",
  vendorFirstName: "",
  vendorLastName: "",
  vendorTypeId: "",
  vendorCurrentLocation: "",
  vendorContact: "+91",
  vendorEmail: "",
  vendorPassword: "",
  vendorUid: "", // firebase id
  vendorCompanyName: "",
  vendorLocation: "",
  eventTypes: [],
  vendorGender: "",
  vendorAlternateMobileNo: "+91",
  vendorAlternateEmail: "",
  vendorAddress: "",
  vendorLandmark: "",
  vendorCity: "",
  vendorTaluk: "",
  vendorState: "",
  vendorCountry: "India",
  vendorPincode: "",
  vendorProfileImage: "",
  vendorProfileImageURL: "",
  programId: "",
};

const genderOptions = ["Male", "Female", "Other"];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    backgroundColor: state.isDisabled
      ? "var(--secondary-text-color-whiteBg)"
      : "var(--secondary-color)",
    color: state.isDisabled ? "#ffffff" : "#000000",
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

const ProfileForm = () => {
  const profilePicInputRef = useRef(); // btn used to trigger the hidden input that allows the selection of profile pic image
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data); // COUNTRIES, STATES & CITIES
  const userInfoStore = useSelector((state) => state.userInfo); // details of registered user.

  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState({ ...customerDataTemplate });
  const [serviceProviderData, setServiceProviderData] = useState({
    ...serviceProviderDataTemplate,
  });

  const userType = userInfoStore.userDetails.userType;
  const vendorType = userInfoStore.userDetails.vendorType || "";
  // Refs to keep track of the initial render for each useEffect
  const isInitialRender1 = useRef(true);

  const [personalInfoFormEnabled, setPersonalInfoFormEnabled] = useState(false);
  const [contactInfoFormEnabled, setContactInfoFormEnabled] = useState(false);
  const [addressInfoFormEnabled, setAddressInfoFormEnabled] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const handleCustomerData = (key, value) => {
    setCustomerData((previousData) => ({
      ...previousData,
      [key]: value,
    }));
  };

  const handleServiceProviderData = (key, value) => {
    setServiceProviderData((previousData) => ({
      ...previousData,
      [key]: value,
    }));
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsDataUpdated(false);
  };

  const snackBarAction = (
    <React.Fragment>
      <Button color="primary" size="small" onClick={handleSnackBarClose}>
        Undo
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackBarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  useEffect(() => {
    if (
      userInfoStore.userDetails.length === 0 ||
      !userInfoStore.userDetails.Document
    ) {
      setIsLoading(true);
      return;
    }
    setIsLoading(false);

    const { customerName, vendorName, ...info } =
      userInfoStore.userDetails.Document;

    if (userType === "CUSTOMER") {
      setCustomerData({
        ...info,
        customerFirstName: customerName.split(" ")[0],
        customerLastName: customerName.split(" ")[1],
      });
    } else if (userType === "VENDOR") {
      setServiceProviderData({
        ...info,
        vendorFirstName: vendorName.split(" ")[0],
        vendorLastName: vendorName.split(" ")[1],
      });
    }
  }, [userInfoStore.userDetails]);

  //fetch states data when a country is selected
  useEffect(() => {
    if (isInitialRender1.current) {
      // Skip the first execution
      isInitialRender1.current = false;
      return;
    }
    try {
      setIsLoading(true);
      dispatch(
        fetchStatesOfCountryData(
          userType === "CUSTOMER"
            ? customerData.customerCountry
            : serviceProviderData.vendorCountry
        )
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    userType,
    customerData.customerCountry,
    serviceProviderData.vendorCountry,
  ]);

  //fetch cities data when a state is selected
  useEffect(() => {
    if (!customerData.customerState && !serviceProviderData.vendorState) {
      return;
    }
    try {
      setIsLoading(true);
      if (userType === "CUSTOMER") {
        dispatch(
          fetchCitiesOfStateData(
            customerData.customerCountry,
            customerData.customerState
          )
        );
      } else {
        dispatch(
          fetchCitiesOfStateData(
            serviceProviderData.vendorCountry,
            serviceProviderData.vendorState
          )
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [userType, customerData.customerState, serviceProviderData.vendorState]);

  // call uploadFiles() method whenever user uploads a new profle pic
  useEffect(() => {
    if (
      (userType === "CUSTOMER" &&
        (typeof customerData.customerProfileImage === "string" ||
          customerData.customerProfileImage === "")) ||
      (userType === "VENDOR" &&
        (typeof serviceProviderData.vendorProfileImage === "string" ||
          serviceProviderData.vendorProfileImage === ""))
    ) {
      return;
    }
    uploadFiles();
  }, [
    customerData.customerProfileImage,
    serviceProviderData.vendorProfileImage,
  ]);

  // code to upload files to firebase
  const uploadFiles = async () => {
    setIsLoading(true);
    try {
      if (userType === "VENDOR") {
        const vendorProfileImageRef = ref(
          firebaseStorage,
          `VENDOR/${vendorType}/${userInfoStore.userDetails.UID}/ProfileImage/${serviceProviderData.vendorProfileImage.name}`
        );
        const snapshot = await uploadBytes(
          vendorProfileImageRef,
          serviceProviderData.vendorProfileImage
        );
        const vendorProfileImageUrl = await getDownloadURL(snapshot.ref);
        handleServiceProviderData(
          "vendorProfileImageURL",
          vendorProfileImageUrl
        );

        // update the file in mongodb
        await axios.patch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/eventify_server/serviceProviderMaster/${serviceProviderData._id}`,
          {
            vendorProfileImage: vendorProfileImageUrl,
          }
        );
      } else if (userType === "CUSTOMER") {
        const customerProfileImageRef = ref(
          firebaseStorage,
          `CUSTOMER/${userInfoStore.userDetails.UID}/ProfileImage/${customerData.customerProfileImage.name}`
        );
        const snapshot = await uploadBytes(
          customerProfileImageRef,
          customerData.customerProfileImage
        );
        const customerProfileImageUrl = await getDownloadURL(snapshot.ref);
        handleCustomerData("customerProfileImageURL", customerProfileImageUrl);

        //update the file in mongodb
        await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/eventify_server/customerMaster/${
            customerData._id
          }`,
          {
            customerProfileImage: customerProfileImageUrl,
          }
        );
      }
      setIsLoading(false);
      setIsDataUpdated(true);
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    }
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      if (userType === "CUSTOMER") {
        const response = await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/eventify_server/customerMaster/${
            customerData._id
          }`,
          {
            customerName:
              customerData.customerFirstName +
              " " +
              customerData.customerLastName,
            customerGender: customerData.customerGender,
          }
        );
        console.log("CUSTOMER PERSONAL INFO UPDATE ", response.data);
      } else if (userType === "VENDOR") {
        const response = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/eventify_server/serviceProviderMaster/${serviceProviderData._id}`,
          {
            vendorName:
              serviceProviderData.vendorFirstName +
              " " +
              serviceProviderData.vendorLastName,
            vendorGender: serviceProviderData.vendorGender,
          }
        );
        console.log("VENDOR PERSONAL INFO UPDATE ", response.data);
      }
      dispatch(userDataUpdateFlag());
      setIsDataUpdated(true);
    } catch (error) {
      console.error(error.message);
    } finally {
      setPersonalInfoFormEnabled(!personalInfoFormEnabled);
    }
  };

  const handleSaveContactInfo = async (e) => {
    e.preventDefault();
    try {
      if (userType === "CUSTOMER") {
        const response = await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/eventify_server/customerMaster/${
            customerData._id
          }`,
          {
            customerMainMobileNo: customerData.customerMainMobileNo,
            customerMainEmail: customerData.customerMainEmail,
            customerAlternateMobileNo: customerData.customerAlternateMobileNo,
            customerAlternateEmail: customerData.customerAlternateEmail,
          }
        );
        console.log("CUSTOMER PERSONAL INFO UPDATE ", response.data);
      } else if (userType === "VENDOR") {
        const response = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/eventify_server/serviceProviderMaster/${serviceProviderData._id}`,
          {
            vendorMainMobileNo: serviceProviderData.vendorContact,
            vendorMainEmail: serviceProviderData.vendorEmail,
            vendorAlternateMobileNo:
              serviceProviderData.vendorAlternateMobileNo,
            vendorAlternateEmail: serviceProviderData.vendorAlternateEmail,
          }
        );
        console.log("VENDOR PERSONAL INFO UPDATE ", response.data);
      }
      dispatch(userDataUpdateFlag());
      setIsDataUpdated(true);
    } catch (error) {
      console.error(error.message);
    } finally {
      setContactInfoFormEnabled(!personalInfoFormEnabled);
    }
  };

  const handleSaveAddressInfo = async (e) => {
    e.preventDefault();
    try {
      if (userType === "CUSTOMER") {
        const response = await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/eventify_server/customerMaster/${
            customerData._id
          }`,
          {
            customerAddress: customerData.customerAddress,
            customerLandmark: customerData.customerLandmark,
            customerCountry: customerData.customerCountry,
            customerState: customerData.customerState,
            customerCity: customerData.customerCity,
            customerTaluk: customerData.customerTaluk,
            customerPincode: customerData.customerPincode,
          }
        );
        console.log("CUSTOMER PERSONAL INFO UPDATE ", response.data);
      } else if (userType === "VENDOR") {
        const response = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/eventify_server/serviceProviderMaster/${serviceProviderData._id}`,
          {
            vendorAddress: serviceProviderData.vendorAddress,
            vendorLandmark: serviceProviderData.vendorLandmark,
            vendorCountry: serviceProviderData.vendorCountry,
            vendorState: serviceProviderData.vendorState,
            vendorCity: serviceProviderData.vendorCity,
            vendorTaluk: serviceProviderData.vendorTaluk,
            vendorPincode: serviceProviderData.vendorPincode,
          }
        );
        console.log("VENDOR PERSONAL INFO UPDATE ", response.data);
      }
      dispatch(userDataUpdateFlag());
      setIsDataUpdated(true);
    } catch (error) {
      console.error(error.message);
    } finally {
      setAddressInfoFormEnabled(!personalInfoFormEnabled);
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Snackbar
        open={isDataUpdated}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="User profile updated successfully!!"
        action={snackBarAction}
      />
      <div className="UserProfileForm__container">
        {userType === "CUSTOMER" ? (
          <div className="wrapper">
            <div className="coverPage">
              <EditOutlinedIcon className="icon" />
            </div>
            <div className="image-upload-container">
              <div className="profile-image">
                {!customerData.customerProfileImage ? (
                  <Avatar
                    size="large"
                    className="img"
                    src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                  />
                ) : (
                  <img
                    src={
                      typeof customerData.customerProfileImage === "string"
                        ? customerData.customerProfileImage
                        : URL.createObjectURL(
                            customerData.customerProfileImage
                          ) || ""
                    }
                    alt=""
                    className="img"
                  />
                )}
                <button className="addIcon">
                  <AddIcon
                    className="icon"
                    onClick={() => profilePicInputRef.current.click()}
                  />
                </button>
                <div
                  className="overlay"
                  onClick={() => profilePicInputRef.current.click()}
                >
                  <FaEdit className="editIcon" />
                  <span>Edit</span>
                </div>
              </div>
              <div className="user-name">
                <strong>
                  {customerData.customerFirstName +
                    " " +
                    customerData.customerLastName}
                </strong>
                <br />
                <small className="user-type">( customer )</small>
              </div>
              <input
                ref={profilePicInputRef}
                type="file"
                onChange={(e) => {
                  handleCustomerData("customerProfileImage", e.target.files[0]);
                }}
                className="profilePicInput"
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>
            <div className="personal-information">
              <button
                className="editText"
                onClick={() =>
                  setPersonalInfoFormEnabled(!personalInfoFormEnabled)
                }
              >
                {personalInfoFormEnabled ? "Cancel" : "Edit Personal Info"}
              </button>
              <button
                className="editTextIcon"
                onClick={() =>
                  setPersonalInfoFormEnabled(!personalInfoFormEnabled)
                }
              >
                <FaEdit className="icon" />
              </button>
              <strong>
                <h2 className="sideHeading">Personal Information</h2>
              </strong>
              <p>Update your personal details here</p>
              <div
                className={`customForm ${
                  personalInfoFormEnabled && "input-enabled"
                }`}
              >
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="firstName">First Name:</label>
                    <div className="wrapper">
                      <PersonIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        name="firstName"
                        value={customerData.customerFirstName || ""}
                        onChange={(e) =>
                          handleCustomerData(
                            "customerFirstName",
                            e.target.value
                          )
                        }
                        className="input"
                        disabled={!personalInfoFormEnabled}
                        placeholder="Logan"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <div className="wrapper">
                      <PersonIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        name="lastName"
                        value={customerData.customerLastName || ""}
                        onChange={(e) =>
                          handleCustomerData("customerLastName", e.target.value)
                        }
                        className="input"
                        disabled={!personalInfoFormEnabled}
                        placeholder="Sanders"
                      />
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="gender">Gender:</label>
                    <div className="wrapper selectInput-wrapper">
                      <PersonIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <Select
                        styles={customSelectStyles}
                        options={genderOptions.map((gender) => ({
                          value: gender,
                          label: gender,
                        }))}
                        value={
                          customerData.customerGender
                            ? {
                                value: customerData.customerGender,
                                label: customerData.customerGender,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleCustomerData(
                            "customerGender",
                            selectedOption.value
                          )
                        }
                        placeholder="select your gender"
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
                        isDisabled={!personalInfoFormEnabled}
                      />
                    </div>
                  </div>
                </div>
                {personalInfoFormEnabled && (
                  <button
                    type="submit"
                    className="save-button"
                    onClick={handleSavePersonalInfo}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
            <hr />
            <div className="contact-information">
              <button
                className="editText"
                onClick={() =>
                  setContactInfoFormEnabled(!contactInfoFormEnabled)
                }
              >
                {contactInfoFormEnabled ? "Cancel" : "Edit Contact Info"}
              </button>
              <button
                className="editTextIcon"
                onClick={() =>
                  setContactInfoFormEnabled(!contactInfoFormEnabled)
                }
              >
                <FaEdit className="icon" />
              </button>
              <strong>
                <h2 className="sideHeading">Contact Information</h2>
              </strong>
              <p>Update your contact details here</p>
              <div
                className={`customForm ${
                  contactInfoFormEnabled && "input-enabled"
                }`}
              >
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="mobileNumber">Mobile Number:</label>
                    <div className="wrapper phoneInput-wrapper">
                      <PhoneInput
                        country={"us"}
                        id="mobileNumber"
                        value={customerData.customerMainMobileNo}
                        // eslint-disable-next-line no-unused-vars
                        onChange={(value, country) =>
                          handleCustomerData(
                            "customerMainMobileNo",
                            "+" + value
                          )
                        }
                        disabled={!contactInfoFormEnabled}
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                          placeholder: "Enter phone number",
                        }}
                        inputClass="input"
                        containerClass="phoneInput"
                        placeholder="+91"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <div className="wrapper">
                      <EmailIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="email"
                        name="email"
                        value={customerData.customerMainEmail}
                        onChange={(e) =>
                          handleCustomerData(
                            "customerMainEmail",
                            e.target.value
                          )
                        }
                        className="input"
                        disabled={!contactInfoFormEnabled}
                        placeholder="info@gmail.com"
                      />
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="altMobileNumber">Alt Mobile Number:</label>
                    <div className="wrapper phoneInput-wrapper">
                      <PhoneInput
                        country={"us"}
                        name="altMobileNumber"
                        value={customerData.customerAlternateMobileNo}
                        // eslint-disable-next-line no-unused-vars
                        onChange={(value, country) =>
                          handleCustomerData(
                            "customerAlternateMobileNo",
                            "+" + value
                          )
                        }
                        disabled={!contactInfoFormEnabled}
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                          placeholder: "Enter phone number",
                        }}
                        inputClass="input"
                        containerClass="phoneInput"
                        placeholder="+91"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="altEmail">Alt Email:</label>
                    <div className="wrapper">
                      <EmailIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="email"
                        name="altEmail"
                        value={customerData.customerAlternateEmail}
                        onChange={(e) =>
                          handleCustomerData(
                            "customerAlternateEmail",
                            e.target.value
                          )
                        }
                        className="input"
                        disabled={!contactInfoFormEnabled}
                        placeholder="info@gmail.com"
                      />
                    </div>
                  </div>
                </div>
                {contactInfoFormEnabled && (
                  <button
                    type="submit"
                    className="save-button"
                    onClick={handleSaveContactInfo}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
            <hr />
            <div className="address-information">
              <button
                className="editText"
                onClick={() =>
                  setAddressInfoFormEnabled(!addressInfoFormEnabled)
                }
              >
                {addressInfoFormEnabled ? "Cancel" : "Edit Address Info"}
              </button>
              <button
                className="editTextIcon"
                onClick={() =>
                  setAddressInfoFormEnabled(!addressInfoFormEnabled)
                }
              >
                <FaEdit className="icon" />
              </button>
              <strong>
                <h2 className="sideHeading">Address Information</h2>
              </strong>
              <p>Update your address details here</p>
              <div
                className={`customForm ${
                  addressInfoFormEnabled && "input-enabled"
                }`}
              >
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="address">Address:</label>
                    <div className="wrapper">
                      <HomeIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        className="input"
                        name="address"
                        value={customerData.customerAddress}
                        onChange={(e) =>
                          handleCustomerData("customerAddress", e.target.value)
                        }
                        disabled={!addressInfoFormEnabled}
                        placeholder="enter address"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="landmark">Landmark:</label>
                    <div className="wrapper">
                      <PlaceIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        name="landmark"
                        className="input"
                        value={customerData.customerLandmark}
                        onChange={(e) =>
                          handleCustomerData("customerLandmark", e.target.value)
                        }
                        disabled={!addressInfoFormEnabled}
                        placeholder="enter landmark"
                      />
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="city">Country:</label>
                    <div className="wrapper selectInput-wrapper">
                      <PublicIcon className="icon" />
                      <div className="vertical-divider"></div>
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
                          customerData.customerCountry
                            ? {
                                value: customerData.customerCountry,
                                label: customerData.customerCountry,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleCustomerData(
                            "customerCountry",
                            selectedOption.value
                          )
                        }
                        placeholder="Select your country"
                        components={{
                          DropdownIndicator: () => (
                            <KeyboardArrowDownIcon
                              style={{ color: "#007bff" }}
                            />
                          ),
                        }}
                        className="selectInput"
                        menuShouldScrollIntoView={false}
                        hideSelectedOptions={false}
                        closeMenuOnSelect
                        isClearable={false}
                        isSearchable
                        isDisabled={!addressInfoFormEnabled}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="taluk">State:</label>
                    <div className="wrapper selectInput-wrapper">
                      <LocationCityIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <Select
                        styles={customSelectStyles}
                        options={
                          data.states.data && Array.isArray(data.states.data)
                            ? data.states.data?.map((state) => ({
                                value: state,
                                label: state,
                              }))
                            : null
                        }
                        value={
                          customerData.customerState
                            ? {
                                value: customerData.customerState,
                                label: customerData.customerState,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleCustomerData(
                            "customerState",
                            selectedOption.value
                          )
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
                        isDisabled={!addressInfoFormEnabled}
                      />
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="state">City:</label>
                    <div className="wrapper selectInput-wrapper">
                      <LocationCityIcon className="icon" />
                      <div className="vertical-divider"></div>
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
                          customerData.customerCity
                            ? {
                                value: customerData.customerCity,
                                label: customerData.customerCity,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleCustomerData(
                            "customerCity",
                            selectedOption.value
                          )
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
                        isDisabled={!addressInfoFormEnabled}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="country">Taluk:</label>
                    <div className="wrapper">
                      <StreetviewIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        name="taluk"
                        className="input"
                        value={customerData.customerTaluk}
                        onChange={(e) =>
                          handleCustomerData("customerTaluk", e.target.value)
                        }
                        disabled={!addressInfoFormEnabled}
                        placeholder="Enter the taluk"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="pincode">Pincode:</label>
                    <div className="wrapper">
                      <GpsFixedIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        name="pincode"
                        className="input"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter, and .
                          if (
                            [46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
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
                            (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                            (e.keyCode < 96 || e.keyCode > 105)
                          ) {
                            e.preventDefault();
                          }
                        }}
                        value={customerData.customerPincode}
                        onChange={(e) =>
                          handleCustomerData("customerPincode", e.target.value)
                        }
                        disabled={!addressInfoFormEnabled}
                        placeholder="Enter the pincode"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>
                {addressInfoFormEnabled && (
                  <button
                    type="submit"
                    className="save-button"
                    onClick={handleSaveAddressInfo}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="wrapper">
            <div className="coverPage">
              <EditOutlinedIcon className="icon" />
            </div>
            <div className="image-upload-container">
              <div className="profile-image">
                <img
                  src={
                    typeof serviceProviderData.vendorProfileImage === "string"
                      ? serviceProviderData.vendorProfileImage
                      : URL.createObjectURL(
                          serviceProviderData.vendorProfileImage
                        ) || ""
                  }
                  alt="Avatar"
                  className="img"
                />
                <button className="addIcon">
                  <AddIcon
                    className="icon"
                    onClick={() => profilePicInputRef.current.click()}
                  />
                </button>
                <div
                  className="overlay"
                  onClick={() => profilePicInputRef.current.click()}
                >
                  <FaEdit className="editIcon" />
                  <span>Edit</span>
                </div>
              </div>
              <div className="user-name">
                <strong>
                  {serviceProviderData.vendorFirstName +
                    " " +
                    serviceProviderData.vendorLastName}
                </strong>
                <br />
                <small className="user-type">( vendor )</small>
              </div>
              <input
                ref={profilePicInputRef}
                type="file"
                onChange={(e) => {
                  handleServiceProviderData(
                    "vendorProfileImage",
                    e.target.files[0]
                  );
                }}
                className="profilePicInput"
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>
            <div className="personal-information">
              <button
                className="editText"
                onClick={() =>
                  setPersonalInfoFormEnabled(!personalInfoFormEnabled)
                }
              >
                {personalInfoFormEnabled ? "Cancel" : "Edit Personal Info"}
              </button>
              <button
                className="editTextIcon"
                onClick={() =>
                  setPersonalInfoFormEnabled(!personalInfoFormEnabled)
                }
              >
                <FaEdit className="icon" />
              </button>
              <strong>
                <h2 className="sideHeading">Personal Information</h2>
              </strong>
              <p>Update your information about you and details here</p>
              <div
                className={`customForm ${
                  personalInfoFormEnabled && "input-enabled"
                }`}
              >
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="firstName">First Name:</label>
                    <div className="wrapper">
                      <PersonIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        name="firstName"
                        value={serviceProviderData.vendorFirstName || ""}
                        onChange={(e) =>
                          handleServiceProviderData(
                            "vendorFirstName",
                            e.target.value
                          )
                        }
                        className="input"
                        disabled={!personalInfoFormEnabled}
                        placeholder="Logan"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <div className="wrapper">
                      <PersonIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        name="lastName"
                        value={serviceProviderData.vendorLastName || ""}
                        onChange={(e) =>
                          handleServiceProviderData(
                            "vendorLastName",
                            e.target.value
                          )
                        }
                        className="input"
                        disabled={!personalInfoFormEnabled}
                        placeholder="Sanders"
                      />
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="gender">Gender:</label>
                    <div className="wrapper selectInput-wrapper">
                      <PersonIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <Select
                        styles={customSelectStyles}
                        options={genderOptions.map((gender) => ({
                          value: gender,
                          label: gender,
                        }))}
                        value={
                          serviceProviderData.vendorGender
                            ? {
                                value: serviceProviderData.vendorGender,
                                label: serviceProviderData.vendorGender,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleServiceProviderData(
                            "vendorGender",
                            selectedOption.value
                          )
                        }
                        placeholder="select your gender"
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
                        isDisabled={!personalInfoFormEnabled}
                      />
                    </div>
                  </div>
                </div>
                {personalInfoFormEnabled && (
                  <button
                    type="submit"
                    className="save-button"
                    onClick={handleSavePersonalInfo}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
            <hr />
            <div className="contact-information">
              <button
                className="editText"
                onClick={() =>
                  setContactInfoFormEnabled(!contactInfoFormEnabled)
                }
              >
                {contactInfoFormEnabled ? "Cancel" : "Edit Contact Info"}
              </button>
              <button
                className="editTextIcon"
                onClick={() =>
                  setContactInfoFormEnabled(!contactInfoFormEnabled)
                }
              >
                <FaEdit className="icon" />
              </button>
              <strong>
                <h2 className="sideHeading">Contact Information</h2>
              </strong>
              <p>Update your contact details here</p>
              <div
                className={`customForm ${
                  contactInfoFormEnabled && "input-enabled"
                }`}
              >
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="mobileNumber">Mobile Number:</label>
                    <div className="wrapper phoneInput-wrapper">
                      <PhoneInput
                        country={"us"}
                        id="mobileNumber"
                        value={serviceProviderData.vendorContact}
                        // eslint-disable-next-line no-unused-vars
                        onChange={(value, country) =>
                          handleServiceProviderData(
                            "vendorContact",
                            "+" + value
                          )
                        }
                        disabled={!contactInfoFormEnabled}
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                          placeholder: "Enter phone number",
                        }}
                        inputClass="input"
                        containerClass="phoneInput"
                        placeholder="+91"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <div className="wrapper">
                      <EmailIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="email"
                        name="email"
                        value={serviceProviderData.vendorEmail}
                        onChange={(e) =>
                          handleServiceProviderData(
                            "vendorEmail",
                            e.target.value
                          )
                        }
                        className="input"
                        disabled={!contactInfoFormEnabled}
                        placeholder="info@gmail.com"
                      />
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="altMobileNumber">Alt Mobile Number:</label>
                    <div className="wrapper phoneInput-wrapper">
                      <PhoneInput
                        country={"us"}
                        name="altMobileNumber"
                        value={serviceProviderData.vendorAlternateMobileNo}
                        // eslint-disable-next-line no-unused-vars
                        onChange={(value, country) =>
                          handleServiceProviderData(
                            "vendorAlternateMobileNo",
                            "+" + value
                          )
                        }
                        disabled={!contactInfoFormEnabled}
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                          placeholder: "Enter phone number",
                        }}
                        inputClass="input"
                        containerClass="phoneInput"
                        placeholder="+91"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="altEmail">Alt Email:</label>
                    <div className="wrapper">
                      <EmailIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="email"
                        name="altEmail"
                        value={serviceProviderData.vendorAlternateEmail}
                        onChange={(e) =>
                          handleServiceProviderData(
                            "vendorAlternateEmail",
                            e.target.value
                          )
                        }
                        className="input"
                        disabled={!contactInfoFormEnabled}
                        placeholder="info@gmail.com"
                      />
                    </div>
                  </div>
                </div>
                {contactInfoFormEnabled && (
                  <button
                    type="submit"
                    className="save-button"
                    onClick={handleSaveContactInfo}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
            <hr />
            <div className="address-information">
              <button
                className="editText"
                onClick={() =>
                  setAddressInfoFormEnabled(!addressInfoFormEnabled)
                }
              >
                {addressInfoFormEnabled ? "Cancel" : "Edit Address Info"}
              </button>
              <button
                className="editTextIcon"
                onClick={() =>
                  setAddressInfoFormEnabled(!addressInfoFormEnabled)
                }
              >
                <FaEdit className="icon" />
              </button>
              <strong>
                <h2 className="sideHeading">Address Information</h2>
              </strong>
              <p>Update your address details here</p>
              <div
                className={`customForm ${
                  addressInfoFormEnabled && "input-enabled"
                }`}
              >
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="address">Address:</label>
                    <div className="wrapper">
                      <HomeIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        className="input"
                        name="address"
                        value={serviceProviderData.vendorAddress}
                        onChange={(e) =>
                          handleServiceProviderData(
                            "vendorAddress",
                            e.target.value
                          )
                        }
                        disabled={!addressInfoFormEnabled}
                        placeholder="enter address"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="landmark">Landmark:</label>
                    <div className="wrapper">
                      <PlaceIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        name="landmark"
                        className="input"
                        value={serviceProviderData.vendorLandmark}
                        onChange={(e) =>
                          handleServiceProviderData(
                            "vendorLandmark",
                            e.target.value
                          )
                        }
                        disabled={!addressInfoFormEnabled}
                        placeholder="enter landmark"
                      />
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="city">Country:</label>
                    <div className="wrapper selectInput-wrapper">
                      <PublicIcon className="icon" />
                      <div className="vertical-divider"></div>
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
                          serviceProviderData.vendorCountry
                            ? {
                                value: serviceProviderData.vendorCountry,
                                label: serviceProviderData.vendorCountry,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleServiceProviderData(
                            "vendorCountry",
                            selectedOption.value
                          )
                        }
                        placeholder="Select your country"
                        components={{
                          DropdownIndicator: () => (
                            <KeyboardArrowDownIcon
                              style={{ color: "#007bff" }}
                            />
                          ),
                        }}
                        className="selectInput"
                        menuShouldScrollIntoView={false}
                        hideSelectedOptions={false}
                        closeMenuOnSelect
                        isClearable={false}
                        isSearchable
                        isDisabled={!addressInfoFormEnabled}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="taluk">State:</label>
                    <div className="wrapper selectInput-wrapper">
                      <LocationCityIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <Select
                        styles={customSelectStyles}
                        options={
                          data.states.data && Array.isArray(data.states.data)
                            ? data.states.data?.map((state) => ({
                                value: state,
                                label: state,
                              }))
                            : null
                        }
                        value={
                          serviceProviderData.vendorState
                            ? {
                                value: serviceProviderData.vendorState,
                                label: serviceProviderData.vendorState,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleServiceProviderData(
                            "vendorState",
                            selectedOption.value
                          )
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
                        isDisabled={!addressInfoFormEnabled}
                      />
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="state">City:</label>
                    <div className="wrapper selectInput-wrapper">
                      <LocationCityIcon className="icon" />
                      <div className="vertical-divider"></div>
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
                          serviceProviderData.vendorCity
                            ? {
                                value: serviceProviderData.vendorCity,
                                label: serviceProviderData.vendorCity,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleServiceProviderData(
                            "vendorCity",
                            selectedOption.value
                          )
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
                        isDisabled={!addressInfoFormEnabled}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="country">Taluk:</label>
                    <div className="wrapper">
                      <StreetviewIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        name="taluk"
                        className="input"
                        value={serviceProviderData.vendorTaluk}
                        onChange={(e) =>
                          handleServiceProviderData(
                            "vendorTaluk",
                            e.target.value
                          )
                        }
                        disabled={!addressInfoFormEnabled}
                        placeholder="Enter the taluk"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="pincode">Pincode:</label>
                    <div className="wrapper">
                      <GpsFixedIcon className="icon" />
                      <div className="vertical-divider"></div>
                      <input
                        type="text"
                        name="pincode"
                        className="input"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter, and .
                          if (
                            [46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
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
                            (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                            (e.keyCode < 96 || e.keyCode > 105)
                          ) {
                            e.preventDefault();
                          }
                        }}
                        value={serviceProviderData.vendorPincode}
                        onChange={(e) =>
                          handleServiceProviderData(
                            "vendorPincode",
                            e.target.value
                          )
                        }
                        disabled={!addressInfoFormEnabled}
                        placeholder="Enter the pincode"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>
                {addressInfoFormEnabled && (
                  <button
                    type="submit"
                    className="save-button"
                    onClick={handleSaveAddressInfo}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileForm;
