/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import "./ProfileForm.scss";
import DefaultImage from "../../assets/upload-photo-here.jpg";
import UploadingAnimation from "../../assets/uploading.gif.mp4";
import { useMediaQuery } from "react-responsive";
import { NavBar } from "..";
import { useSelector } from "react-redux";

import axios from "axios";

import { firebaseApp } from "../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const ProfileForm = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [activeComponent, setActiveComponent] = useState(null);

  const handleSetActiveComponent = (component) => {
    setActiveComponent(component);
  };

  const [avatarURL, setAvatarURL] = useState(DefaultImage);
  const fileUploadRef = useRef();
  const [userName, setUserName] = useState("xxx");

  const [personalFormData, setPersonalFormData] = useState({
    firstName: "",
    lastName: "",
    gender: null,
    CurrentPassword: "",
    NewPassword: "",
  });
  const [contactFormData, setContactFormData] = useState({
    mobileNumber: "",
    email: "",
    altMobileNumber: "",
    altEmail: "",
  });
  const [addressFormData, setAddressFormData] = useState({
    address: "",
    landmark: "",
    city: "",
    taluk: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [addressFormDisabled, setAddressFormDisabled] = useState(true);
  const [personalFormDisabled, setPersonalFormDisabled] = useState(true);
  const [personalSaveButtonText, setPersonalSaveButtonText] = useState("Save");
  const [contactFormDisabled, setContactFormDisabled] = useState(true);
  const [contactSaveButtonText, setContactSaveButtonText] = useState("Save");
  const [showSaveImageButton, setShowSaveImageButton] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const userInfoStore = useSelector((state) => state.userInfo);
  const userId = userInfoStore.userDetails?.Document?._id;
  const userType = userInfoStore.userDetails.userType;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile based on user type
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/eventify_server/${
            userType === "CUSTOMER" ? "customerMaster" : "serviceProviderMaster"
          }/${userId}`
        );
        const userData = response.data;
        // user maybe vendor or customer so fileds follows the suffix either vendor or customer
        let prefix = userType.toLowerCase(); // Lowercase userType for consistency
        const fullName = userData[`${prefix}Name`];
        setUserName(fullName);
        const nameParts = fullName.split(" ");
        // Extract first name
        const firstName = nameParts.shift(); // Remove and get the first part

        // Remaining parts are last name
        const lastName = nameParts.join(" ");
        const profilePictureField = `${prefix}ProfileImage`;
        setProfilePictureURL(userData[profilePictureField] || DefaultImage);
        setPersonalFormData({
          firstName: firstName,
          lastName: lastName,
          gender: userData[`${prefix}Gender`],
          CurrentPassword: "",
          NewPassword: "",
        });
        setContactFormData({
          mobileNumber: userData[`${prefix}Contact`],
          email: userData[`${prefix}Email`],
          altMobileNumber: userData[`${prefix}AlternateMobileNo`],
          altEmail: userData[`${prefix}AlternateEmail`],
        });
        setAddressFormData({
          address: userData[`${prefix}Address`],
          landmark: userData[`${prefix}Landmark`],
          city: userData[`${prefix}City`],
          taluk: userData[`${prefix}Taluk`],
          state: userData[`${prefix}State`],
          country: userData[`${prefix}Country`],
          pincode: userData[`${prefix}Pincode`],
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userType]);

  // updating edited fields to database
  const handleFormSubmit = async (formType) => {
    try {
      let updatedData = {};
      const prefix = userType.toLowerCase(); // Lowercase userType for consistency

      // Include only the modified personal information properties
      if (!personalFormDisabled) {
        updatedData = {
          ...updatedData,
          [`${prefix}Name`]: `${personalFormData.firstName} ${personalFormData.lastName}`,
          [`${prefix}Gender`]: personalFormData.gender,
          // Add other personal information properties as needed
        };
      }

      // Include only the modified contact information properties
      if (!contactFormDisabled) {
        updatedData = {
          ...updatedData,
          [`${prefix}Contact`]: contactFormData.mobileNumber,
          [`${prefix}Email`]: contactFormData.email,
          [`${prefix}AlternateMobileNo`]: contactFormData.altMobileNumber,
          [`${prefix}AlternateEmail`]: contactFormData.altEmail,
        };
      }

      // Include only the modified address information properties
      if (!addressFormDisabled) {
        updatedData = {
          ...updatedData,
          [`${prefix}Address`]: addressFormData.address,
          [`${prefix}Landmark`]: addressFormData.landmark,
          [`${prefix}City`]: addressFormData.city,
          [`${prefix}Taluk`]: addressFormData.taluk,
          [`${prefix}State`]: addressFormData.state,
          [`${prefix}Country`]: addressFormData.country,
          [`${prefix}Pincode`]: addressFormData.pincode,
        };
      }

      // Send PATCH request to update user data
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/eventify_server/${
          userType === "CUSTOMER" ? "customerMaster" : "serviceProviderMaster"
        }/${userId}`,
        updatedData
      );

      // If the request is successful, update UI or show a success message
      console.log("User data updated successfully!");

      // Disable the corresponding form after successful submission
      switch (formType) {
        case "personal":
          setPersonalFormDisabled(true);
          setPersonalSaveButtonText("Edit");
          break;
        case "contact":
          setContactFormDisabled(true);
          setContactSaveButtonText("Edit");
          break;
        case "address":
          setAddressFormDisabled(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      // Handle error - show error message or revert changes in the UI
    }
  };

  const handleImageUpload = (event) => {
    event.preventDefault();
    fileUploadRef.current.click();
  };

  // Function to upload image to Firebase Storage with user type-based folder structure
  const uploadImageToFirebase = async (file, userType) => {
    try {
      // Determine the folder based on the user type
      const folder = userType === "CUSTOMER" ? "CUSTOMER" : "VENDOR";

      // Create a storage reference with the folder structure
      const storage = getStorage(firebaseApp);
      const storageRef = ref(storage, `${folder}/userProfile/${file.name}`);

      // Upload file to the storage reference
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);

      // Return the download URL
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image to Firebase Storage:", error);
      throw error;
    }
  };

  // Update the uploadImageDisplay function to use uploadImageToFirebase with user type
  const uploadImageDisplay = async () => {
    try {
      setAvatarURL(UploadingAnimation);
      const uploadedFile = fileUploadRef.current.files[0];

      // Upload the file to Firebase Storage based on user type
      const downloadURL = await uploadImageToFirebase(uploadedFile, userType);

      // Update avatarURL with the uploaded image URL
      setAvatarURL(downloadURL);
      setShowSaveImageButton(true);
    } catch (error) {
      console.error("Error uploading image to Firebase:", error);
      setAvatarURL(DefaultImage);
    }
  };

  const handleSaveImage = async () => {
    try {
      // Send PATCH request to update user data with the image URL
      const updatedData = {
        [`${userType.toLowerCase()}ProfileImage`]: avatarURL,
      };
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/eventify_server/${
          userType === "CUSTOMER" ? "customerMaster" : "serviceProviderMaster"
        }/${userId}`,
        updatedData
      );

      console.log("User profile picture updated successfully!");
      setShowSaveImageButton(false); // Hide "Save" button after saving
    } catch (error) {
      console.error("Error updating user profile picture:", error);
    }
  };

  const handlePersonalInputChange = (event) => {
    const { name, value } = event.target;
    setPersonalFormData({
      ...personalFormData,
      [name]: value,
    });
  };

  const handlePersonalEditClick = () => {
    if (personalFormDisabled) {
      setPersonalSaveButtonText("Save");
    } else {
      // Handle personal information form submission
      console.log(personalFormData);
      setPersonalSaveButtonText("Edit");
    }
    setPersonalFormDisabled(!personalFormDisabled);
  };

  const handlePersonalSave = (event) => {
    event.preventDefault();
    // Handle saving personal information here
    console.log("Saving personal information:", personalFormData);
    handleFormSubmit("personal");
  };

  const handleContactSave = (event) => {
    event.preventDefault();
    // Handle saving contact information here
    console.log("Saving contact information:", contactFormData);
    handleFormSubmit("contact");
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    // Handle address information form submission
    console.log("Saving address information:", addressFormData);
    handleFormSubmit("address");
  };

  const handleContactInputChange = (event) => {
    const { name, value } = event.target;
    setContactFormData({
      ...contactFormData,
      [name]: value,
    });
  };

  const handleContactEditClick = () => {
    if (contactFormDisabled) {
      setContactSaveButtonText("Save");
    } else {
      // Handle contact information form submission
      console.log(contactFormData);
      setContactSaveButtonText("Edit");
    }
    setContactFormDisabled(!contactFormDisabled);
  };

  const handleAddressInputChange = (event) => {
    const { name, value } = event.target;
    setAddressFormData({
      ...addressFormData,
      [name]: value,
    });
  };

  const handleAddressEditClick = () => {
    setAddressFormDisabled(!addressFormDisabled);
  };

  return (
    <>
      <div className="UserProfile__container">
        <div className="coverpage"></div>
        <div className="image-upload-container">
          <img src={profilePictureURL} alt="Avatar" className="avatar-image" />
          <div className="user-name sideheading">
            <strong>{userName}</strong>
          </div>
          <div className="button-container">
            <button
              type="button"
              onClick={handleImageUpload}
              className="upload-button"
            >
              Edit Image
            </button>
            {showSaveImageButton && (
              <button
                type="button"
                onClick={handleSaveImage}
                className="save-button"
              >
                Save
              </button>
            )}
          </div>
          <form encType="multipart/form-data">
            <input
              type="file"
              ref={fileUploadRef}
              onChange={uploadImageDisplay}
              hidden
            />
          </form>
        </div>
        <div className="personal-information">
          <button className="edittext" onClick={handlePersonalEditClick}>
            {personalFormDisabled ? "Edit Personal Info" : "Cancel"}
          </button>
          <strong>
            <h2 className="sideheading">Personal Information</h2>
          </strong>
          <p>Update your information about you and details here</p>
          <div className="customForm">
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={personalFormData.firstName}
                  onChange={handlePersonalInputChange}
                  disabled={personalFormDisabled}
                />
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={personalFormData.lastName}
                  onChange={handlePersonalInputChange}
                  disabled={personalFormDisabled}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="gender">Gender:</label>
                {personalFormDisabled ? (
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    value={
                      personalFormData.gender
                        ? personalFormData.gender
                        : "Not selected"
                    }
                    readOnly // Make it read-only when not editing
                    disabled={personalFormDisabled}
                  />
                ) : (
                  <select
                    id="gender"
                    name="gender"
                    value={
                      personalFormData.gender ? personalFormData.gender : ""
                    }
                    onChange={handlePersonalInputChange}
                    disabled={personalFormDisabled}
                  >
                    <option value="">Not selected</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                )}
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="CurrentPassword">Current Password:</label>
                <input
                  type="password"
                  id="CurrentPassword"
                  name="CurrentPassword"
                  value={personalFormData.CurrentPassword}
                  onChange={handlePersonalInputChange}
                  disabled={personalFormDisabled}
                />
              </div>
              <div className="input-group">
                <label htmlFor="NewPassword">New Password:</label>
                <input
                  type="password"
                  id="NewPassword"
                  name="NewPassword"
                  value={personalFormData.NewPassword}
                  onChange={handlePersonalInputChange}
                  disabled={personalFormDisabled}
                />
              </div>
            </div>
            {!personalFormDisabled && (
              <button
                type="submit"
                className="save-button"
                onClick={handlePersonalSave}
              >
                {personalSaveButtonText}
              </button>
            )}
          </div>
        </div>
        <hr />
        <div className="contact-information">
          <button className="edittext" onClick={handleContactEditClick}>
            {contactFormDisabled ? "Edit Contact Info" : "Cancel"}
          </button>
          <strong>
            <h2 className="sideheading">Contact Information</h2>
          </strong>
          <p>Update your contact details here</p>
          <div className="customForm">
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="mobileNumber">Mobile Number:</label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={contactFormData.mobileNumber}
                  onChange={handleContactInputChange}
                  disabled={contactFormDisabled}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactFormData.email}
                  onChange={handleContactInputChange}
                  disabled={contactFormDisabled}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="altMobileNumber">Alt Mobile Number:</label>
                <input
                  type="text"
                  id="altMobileNumber"
                  name="altMobileNumber"
                  value={contactFormData.altMobileNumber}
                  onChange={handleContactInputChange}
                  disabled={contactFormDisabled}
                />
              </div>
              <div className="input-group">
                <label htmlFor="altEmail">Alt Email:</label>
                <input
                  type="email"
                  id="altEmail"
                  name="altEmail"
                  value={contactFormData.altEmail}
                  onChange={handleContactInputChange}
                  disabled={contactFormDisabled}
                />
              </div>
            </div>
            {!contactFormDisabled && (
              <button
                type="submit"
                className="save-button"
                onClick={handleContactSave}
              >
                {contactSaveButtonText}
              </button>
            )}
          </div>
        </div>
        <hr />
        <div className="address-information">
          <p className="edittext" onClick={handleAddressEditClick}>
            {addressFormDisabled ? "Edit Address Info" : "Cancel"}
          </p>
          <strong>
            <h2 className="sideheading">Address Information</h2>
          </strong>
          <p>Update your address details here</p>
          <form onSubmit={handleAddressSubmit}>
            <div className="customForm">
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="address">Address:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={addressFormData.address}
                    onChange={handleAddressInputChange}
                    disabled={addressFormDisabled}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="landmark">Landmark:</label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={addressFormData.landmark}
                    onChange={handleAddressInputChange}
                    disabled={addressFormDisabled}
                  />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="city">City:</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressFormData.city}
                    onChange={handleAddressInputChange}
                    disabled={addressFormDisabled}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="taluk">Taluk:</label>
                  <input
                    type="text"
                    id="taluk"
                    name="taluk"
                    value={addressFormData.taluk}
                    onChange={handleAddressInputChange}
                    disabled={addressFormDisabled}
                  />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="state">State:</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressFormData.state}
                    onChange={handleAddressInputChange}
                    disabled={addressFormDisabled}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="country">Country:</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={addressFormData.country}
                    onChange={handleAddressInputChange}
                    disabled={addressFormDisabled}
                  />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="pincode">Pincode:</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={addressFormData.pincode}
                    onChange={handleAddressInputChange}
                    disabled={addressFormDisabled}
                  />
                </div>
              </div>
              {!addressFormDisabled && (
                <button
                  type="submit"
                  className="save-button"
                  onClick={handleAddressSubmit}
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </div>
        <hr />
      </div>
    </>
  );
};

export default ProfileForm;
