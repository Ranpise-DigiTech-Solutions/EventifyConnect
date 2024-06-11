/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  FacebookAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import axios from "axios";
import Select from "react-select";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Alert from '@mui/material/Alert';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ErrorIcon from "@mui/icons-material/Error";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import BusinessIcon from "@mui/icons-material/Business";
import PlaceIcon from "@mui/icons-material/Place";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import PersonIcon from "@mui/icons-material/Person";
import { FcGoogle } from "react-icons/fc";
import { FaUserAlt, FaEdit } from "react-icons/fa";

import "./UserAuthDialog.scss";
import { Images } from "../../../constants/index.js";
import { firebaseAuth } from "../../../firebaseConfig.js";
import { 
  userInfoActions, 
  userAuthStateChangeFlag
} from "../../../states/UserInfo/index.js";
import { LoadingScreen } from "../../../sub-components/index.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// TODO: Modify variable naming convention 

export default function UserAuthDialog({
  open,
  handleClose,
  handleRegistrationDialogOpen
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [loadingScreen, setLoadingScreen] = useState(false); // toggle Loading Screen
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [loginFormErrorUpdateFlag, setLoginFormErrorUpdateFlag] =
    useState(false); // to trigger forceful re-render of useEffect whenever input field is validated
  const [regFormErrorUpdateFlag, setRegFormErrorUpdateFlag] = useState(false); // to trigger forceful re-render of useEffect whenever input field is validated
  const [inputType, setInputType] = useState("EMAIL"); // "EMAIL" or "PHONE"
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [updateVendorRegistrationForm, setUpdateVendorRegistrationForm] =
    useState(false); // The Vendor's Registration form will be displayed in two phases.. 1st page requests for user details...2nd page requests for business details.
  const [otpVerificationForm, setOtpVerificationForm] = useState(false); // to display form requesting OTP for verification
  const [passwordVerificationForm, setPasswordVerificationForm] =
    useState(false); // to display form requesting password for verification
  const [userType, setUserType] = useState("CUSTOMER"); // "CUSTOMER" or "VENDOR"
  const [authType, setAuthType] = useState("LOGIN"); // "LOGIN" or "REGISTER"
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [otpFieldFocused, setOtpFieldFocused] = useState(null);
  const [alertDialog, setAlertDialog] = useState(false); // used to show the error code and message to the user on register or login

  const [signInPasswordValue, setSignInPasswordValue] = useState("");
  const [signInPasswordError, setSignInPasswordError] = useState("");
  const [signInPasswordErrorUpdateFlag, setSignInPasswordErrorUpdateFlag] =
    useState(false); // to trigger forceful re-render of useEffect whenever input field is validated
  const [signInError, setSignInError] = useState(false);

  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data); // CITIES, EVENT_TYPES & VENDOR_TYPES data

  const [userRegAgreement, setUserRegAgreement] = useState({
    termsAndConditions: false,
    privacyPolicy: false,
  });

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "+91",
    password: "",
    location: null, // User's location
  });

  const [vendorInfo, setVendorInfo] = useState({
    fullName: "",
    email: "",
    brandName: "",
    cityName: "",
    vendorTypeInfo: {
      vendorType: null,
      vendorTypeId: null,
    },
    eventTypesInfo: [
      {
        eventType: null,
        eventId: null,
      },
    ],
    phone: "+91",
    password: "",
    location: null, // User's location
  });

  const initialErrorStatus = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    brandName: "",
    cityName: "",
    vendorTypeInfo: "",
    eventTypesInfo: "",
  };
  const [errorInfo, setErrorInfo] = useState(initialErrorStatus);

  const handleUserRegAgreement = (key, value) => {
    setUserRegAgreement((previousInfo) => ({
      ...previousInfo,
      [key]: value,
    }));
  };

  const handleCustomerInfo = (key, value) => {
    setCustomerInfo((previousInfo) => ({
      ...previousInfo,
      [key]: value,
    }));
  };

  const handleVendorInfo = (key, value) => {
    setVendorInfo((previousInfo) => ({
      ...previousInfo,
      [key]: value,
    }));
  };

  const handleErrorInfo = (key, value) => {
    setErrorInfo((previousInfo) => ({
      ...previousInfo,
      [key]: value,
    }));
  };

  const handleOtpChange = (index, value) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Automatically focus on the next input field
    if (value !== "" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case "Backspace":
        // Move to the previous input field if backspace is pressed and the current field is empty
        if (index > 0 && otp[index] === "") {
          inputRefs.current[index - 1]?.focus();
        }
        break;
      case "ArrowLeft":
        // Move to the previous input field if left arrow is pressed
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;
      case "ArrowRight":
        // Move to the next input field if right arrow is pressed
        if (index < otp.length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;
      // Handle other keys if needed
      default:
        break;
    }
  };

  const validatePassword = (signInPasswordValue) => {
    if (!signInPasswordValue) {
      setSignInPasswordError("Password is Required");
    } else if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(signInPasswordValue)
    ) {
      setSignInPasswordError(
        "Password must contain at least one digit, one lowercase character, one uppercase character, one special character, and have a minimum length of 8 characters"
      );
    } else {
      setSignInPasswordError("");
    }
    setSignInPasswordErrorUpdateFlag((prevFlag) => !prevFlag);
  };

  const handleSignInWithPassword = async () => {
    setLoadingScreen(true);
    if(inputValue && signInPasswordValue && !inputError && !signInPasswordError) {
      const postData = {
        // PHONE or EMAIL
        userEmail: inputValue,
        userPassword: signInPasswordValue, // CUSTOMER or VENDOR
        userType: userType,
      };
      try {
         
        // verify wether user exists and verify his password before signing-in
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/eventify_server/userAuthentication/loginWithPassword/`,
          postData
        );
        localStorage.setItem('userAccessToken', JSON.stringify(response.data));
        await signInWithEmailAndPassword(firebaseAuth, inputValue, signInPasswordValue);
        dispatch(userAuthStateChangeFlag());
        setLoadingScreen(false);
        handleClose(); // Close the Entire Login/Register Dialog after Sign-In
      } catch (error) {
        setSignInError(true);
        setLoadingScreen(false);
      }
    }
  };

  useEffect(() => {
    try {
      if (signInPasswordValue && !signInPasswordError) {
        handleSignInWithPassword();
      } else {
        // Handle Error condition if any
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [signInPasswordError, signInPasswordErrorUpdateFlag]);

  const handleEmailLinkSignIn = async (inputType, inputValue) => {
    try {
      await sendSignInLinkToEmail(firebaseAuth, "adikrishna197@gmail.com", {
        url: "http://localhost:5173/", // The URL where the user will be redirected after sign-in
        handleCodeInApp: true, // Allow the sign-in link to be handled in the app
      });
      alert("An email has been sent with a sign-in link.");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGoogleAuthentication = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    firebaseAuth.languageCode = "it";

    try {
      signInWithRedirect(firebaseAuth, provider);
      getRedirectResult(firebaseAuth)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFacebookAuthentication = async () => {
    const provider = new FacebookAuthProvider();
    firebaseAuth.languageCode = "it";
    // provider.setCustomParameters({
    //   'display': 'popup'
    // });

    try {
      signInWithRedirect(firebaseAuth, provider);
      getRedirectResult(firebaseAuth)
        .then((result) => {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          const credential = FacebookAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          const user = result.user;
          console.log(user.email);
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // AuthCredential type that was used.
          const credential = FacebookAuthProvider.credentialFromError(error);
          // ...
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  const phoneNumberAuthentication = async (inputValue) => {
    firebaseAuth.languageCode = "it";
    try {
      const onCaptchaVerification = () => {
        console.log("ENTERED");
        signInWithPhoneNumber(firebaseAuth, "+919740605350", reCaptchaVerifier)
          .then((confirmationResult) => {
            // Store confirmationResult for later use
            console.log(confirmationResult);
            // Prompt user to enter verification code
            // Handle the confirmation code from the user
            // const verificationCode = prompt('Enter the verification code sent to your phone:');
            // if (verificationCode) {
            //     // Confirm the verification code
            //     confirmationResult.confirm(verificationCode)
            //         .then((result) => {
            //             // User successfully signed in
            //             console.log("User signed in successfully:", result.user);
            //         })
            //         .catch((error) => {
            //             // Error confirming verification code
            //             console.error("Error confirming verification code:", error);
            //         });
            // } else {
            //     console.log("No verification code entered.");
            // }
          })
          .catch((error) => {
            // Error sending SMS
            console.error("Error sending SMS:", error);
          });
      };

      const reCaptchaVerifier = new RecaptchaVerifier(
        firebaseAuth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
      onCaptchaVerification();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSignUp = async () => {
    // here the postdata will be customerInfo and vendorInfo Object defined above
    setLoadingScreen(true);
    try {
      const userCredential = userType === "CUSTOMER" ? await createUserWithEmailAndPassword(firebaseAuth, customerInfo.email, customerInfo.password) : await createUserWithEmailAndPassword(firebaseAuth, vendorInfo.email, vendorInfo.password);
      const user = userCredential.user;
      
      const url =
        `${import.meta.env.VITE_SERVER_URL}/eventify_server/userAuthentication/registerUser`;
      let postData = {
        userType,
        data: customerInfo, // Default data for CUSTOMER user type
        user,
      };

      if (userType === "VENDOR") {
        postData.data = {
          ...vendorInfo,
          vendorTypeInfo: vendorInfo.vendorTypeInfo.vendorTypeId,
          eventTypesInfo: vendorInfo.eventTypesInfo.map((item) => item.eventId),
        };
      }

      const response = await axios.post(url, postData);
      localStorage.setItem("userAccessToken", response.data);
      dispatch(userAuthStateChangeFlag());
      setLoadingScreen(false);
      handleClose(); // Close the Entire Login/Register Dialog after Sign-In
      handleRegistrationDialogOpen();
    } catch (error) {
      setAlertDialog(true);
      setLoadingScreen(false)
      console.error("ERROR :- ", error.message);
    }
  };

  useEffect(()=> {
    try {
      console.log("USERAUTHDIALOG " + firebaseAuth.currentUser)
    } catch(error) {
      console.log(error);
    }
  },[])

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
      color: '#999999', // Change the placeholder color here
    }),
  };

  const validateLoginForm = () => {
    if (inputType === "EMAIL") {
      if (!inputValue) {
        setInputError("Email address is required");
      } else if (!/\S+@\S+\.\S+/.test(inputValue)) {
        setInputError("Please enter a valid email address");
      } else if (!inputValue.endsWith("@gmail.com")) {
        setInputError("Couldn't find your account");
      } else {
        setInputError("");
      }
    } else if (inputType === "PHONE") {
      const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
      if (!inputValue) {
        setInputError("Phone number is required");
      } else if (!phoneRegex.test(inputValue)) {
        setInputError("Please enter a valid phone number");
      } else {
        setInputError("");
      }
    }
    setLoginFormErrorUpdateFlag((prevFlag) => !prevFlag);
  };

  const registrationFormValidation = () => {
    if (userType === "VENDOR") {
      if (!updateVendorRegistrationForm) {
        if (!vendorInfo.fullName) {
          handleErrorInfo("fullName", "Name is Required");
        } else {
          handleErrorInfo("fullName", "");
        }
        if (!vendorInfo.email) {
          handleErrorInfo("email", "Email is Required");
        } else if (!/\S+@\S+\.\S+/.test(vendorInfo.email)) {
          handleErrorInfo("email", "Please enter a valid email address");
        } else if (!vendorInfo.email.endsWith("@gmail.com")) {
          handleErrorInfo("email", "Couldn't find your account");
        } else {
          handleErrorInfo("email", "");
        }
        if (!vendorInfo.phone) {
          handleErrorInfo("phone", "Phone number is Required");
        } else if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(vendorInfo.phone)) {
          handleErrorInfo("phone", "Please enter a valid phone number");
        } else {
          handleErrorInfo("phone", "");
        }
        if (!vendorInfo.password) {
          handleErrorInfo("password", "Password is Required");
        } else if (
          !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(
            vendorInfo.password
          )
        ) {
          handleErrorInfo(
            "password",
            "Password must contain at least one digit, one lowercase character, one uppercase character, one special character, and have a minimum length of 8 characters"
          );
        } else {
          handleErrorInfo("password", "");
        }
      } else {
        if (!vendorInfo.brandName) {
          handleErrorInfo("brandName", "Brand name is required");
        } else {
          handleErrorInfo("brandName", "");
        }
        if (!vendorInfo.cityName) {
          handleErrorInfo("cityName", "City name is required");
        } else {
          handleErrorInfo("cityName", "");
        }
        if (
          !vendorInfo.vendorTypeInfo.vendorTypeId ||
          !vendorInfo.vendorTypeInfo.vendorType
        ) {
          handleErrorInfo("vendorTypeInfo", "Vendor type details required");
        } else {
          handleErrorInfo("vendorTypeInfo", "");
        }
        if (
          !vendorInfo.eventTypesInfo[0].eventId ||
          !vendorInfo.eventTypesInfo[0].eventType
        ) {
          handleErrorInfo("eventTypesInfo", "Choose atleast one event type");
        } else {
          handleErrorInfo("eventTypesInfo", "");
        }
      }
    } else if (userType === "CUSTOMER") {
      if (!customerInfo.fullName) {
        handleErrorInfo("fullName", "Name is Required");
      } else {
        handleErrorInfo("fullName", "");
      }
      if (!customerInfo.email) {
        handleErrorInfo("email", "Email is Required");
      } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
        handleErrorInfo("email", "Please enter a valid email address");
      } else if (!customerInfo.email.endsWith("@gmail.com")) {
        handleErrorInfo("email", "Couldn't find your account");
      } else {
        handleErrorInfo("email", "");
      }
      if (!customerInfo.phone) {
        handleErrorInfo("phone", "Phone number is Required");
      } else if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(customerInfo.phone)) {
        handleErrorInfo("phone", "Please enter a valid phone number");
      } else {
        handleErrorInfo("phone", "");
      }
      if (!customerInfo.password) {
        handleErrorInfo("password", "Password is Required");
      } else if (
        !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(
          customerInfo.password
        )
      ) {
        handleErrorInfo(
          "password",
          "Password must contain at least one digit, one lowercase character, one uppercase character, one special character, and have a minimum length of 8 characters"
        );
      } else {
        handleErrorInfo("password", "");
      }
    }
    setRegFormErrorUpdateFlag((prevFlag) => !prevFlag);
  };

  // to be executed each time otp verification page is brought up
  // useEffect(()=> {
  //   try {

  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }, [otpVerificationForm])

  // To be executed everytime login validation is done
  useEffect(() => {
    try {
      if (inputValue && !inputError) {
        // ensuring that the form is filled before doing validation
        setOtpVerificationForm(true);
        setPasswordVerificationForm(true);
      } else {
        setOtpVerificationForm(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [inputError, loginFormErrorUpdateFlag]);

  // to be executed everytime register validation is done
  useEffect(() => {
    try {
      if (customerInfo.fullName || vendorInfo.fullName) {
        // ensuring that the form is filled before doing validation
        if (!updateVendorRegistrationForm && userType === "VENDOR") {
          if (
            !errorInfo.fullName &&
            !errorInfo.email &&
            !errorInfo.password &&
            !errorInfo.phone
          ) {
            setUpdateVendorRegistrationForm(true);
          } else {
            setUpdateVendorRegistrationForm(false);
          }
        } else {
          if (
            !errorInfo.fullName &&
            !errorInfo.email &&
            !errorInfo.password &&
            !errorInfo.phone &&
            !errorInfo.brandName &&
            !errorInfo.eventTypesInfo &&
            !errorInfo.vendorTypeInfo &&
            !errorInfo.cityName
          ) {
            // setOtpVerificationForm(true);
            handleSignUp();
          } else {
            setOtpVerificationForm(false);
          }
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [errorInfo, regFormErrorUpdateFlag]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(inputType + "  " + inputValue + "  " + authType);

    if (authType === "LOGIN") {
      validateLoginForm();
    } else if (authType === "REGISTER") {
      registrationFormValidation();
    }
  };

  return (
    <div className="signInDialog__Container">
      <div id="recaptcha-container"></div> {/* RE-CAPTCHA */}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        aria-labelledby="responsive-dialog-title"
        maxWidth="md"
      >
        {loadingScreen && <LoadingScreen />}
        <Dialog
          open={alertDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Duplicate id found"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              User already exists with the given details! Please login to
              continue.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAlertDialog(false)} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <div
          className="signInDialogMain__container"
          style={
            authType === "LOGIN" || otpVerificationForm
              ? { height: "85vh" }
              : { height: "100vh" }
          }
        >
          <div className="img__wrapper">
            <p>
              India&apos;s Favourite <br /> Wedding planning <br /> paltform
            </p>
            <img src={Images.loginPageBg} alt="" />
          </div>
          <div
            className="contents__wrapper"
            style={
              authType === "LOGIN" ? { padding: "2rem" } : { padding: "0 2rem" }
            }
          >
            <div className="logo__wrapper">
              <img src={Images.logo} alt="" />
            </div>
            <h2 className="heading">
              {authType === "LOGIN" ? (
                <span>Sign In to EventifyConnect</span>
              ) : (
                <span>Sign Up with EventifyConnect</span>
              )}
            </h2>
            <p className="description">
              {userType === "CUSTOMER" ? (
                authType === "LOGIN" ? (
                  <span>Welcome back! Please sign in to continue</span>
                ) : (
                  <span>Join Us Today! Create your account to get started</span>
                )
              ) : authType === "LOGIN" ? (
                <span>Welcome back! Sign in to access your dashboard</span>
              ) : (
                <span>
                  Join Us Today! Connect with clients & grow your business
                </span>
              )}
            </p>
            {!otpVerificationForm ? (
              <>
                {!updateVendorRegistrationForm && (
                  <>
                    <div
                      className="otherSignInOptions__wrapper"
                      style={
                        authType === "LOGIN"
                          ? { marginBottom: "2rem" }
                          : { marginBottom: "1rem" }
                      }
                    >
                      <div
                        className="googleSignIn box"
                        onClick={handleGoogleAuthentication}
                      >
                        <FcGoogle className="googleIcon icon" />
                        <p>Google</p>
                      </div>
                      <div
                        className="facebookSignIn box"
                        onClick={handleFacebookAuthentication}
                      >
                        <FacebookIcon className="fbIcon icon" />
                        <p>Facebook</p>
                      </div>
                      {/* <div className="microsoftSignIn box">
                          <img src={Images.microsoft} alt="" className="microsoftIcon icon"/>
                          <p>Microsoft</p>
                        </div> */}
                    </div>
                    <div
                      className="line__separators"
                      style={
                        authType === "LOGIN"
                          ? { marginBottom: "1.5rem" }
                          : { marginBottom: "1rem" }
                      }
                    >
                      <div className="line__sep"></div>
                      <p>or</p>
                      <div className="line__sep"></div>
                    </div>
                  </>
                )}
                <form
                  onSubmit={handleFormSubmit}
                  className="userInput__wrapper"
                >
                  {authType === "LOGIN" && (
                    <div className="inputField__wrapper">
                      <div className="title">
                        <p>
                          {inputType === "EMAIL" ? (
                            <span>Email address</span>
                          ) : (
                            <span>Phone number</span>
                          )}
                        </p>
                        <p>
                          {inputType === "EMAIL" ? (
                            <span
                              onClick={() => {
                                setInputValue("");
                                setInputType("PHONE");
                                setInputError("");
                              }}
                            >
                              Use phone
                            </span>
                          ) : (
                            <span
                              onClick={() => {
                                setInputValue("");
                                setInputType("EMAIL");
                                setInputError("");
                              }}
                            >
                              Use email
                            </span>
                          )}
                        </p>
                      </div>
                      {inputType === "EMAIL" ? (
                        <>
                          <input
                            type="email"
                            name="email"
                            value={inputValue}
                            placeholder="username@gmail.com"
                            onChange={(e) => setInputValue(e.target.value)}
                            className={`input ${
                              inputError && "input__errorInfo"
                            }`}
                          />
                          {/* <input 
                            type="password"
                            name="password"
                            value={signInPassword}
                            placeholder="password"
                            onChange={(e)=> setSignInPassword(e.target.value)}
                            className={`input ${
                              signInPasswordError && "input__errorInfo"
                            }`}
                          />
                          {signInPasswordError && (
                            <div className="inputError">
                              <ErrorIcon className="icon" />
                              <p>{signInPasswordError}</p>
                            </div>
                          )} */}
                        </>
                      ) : (
                        <div
                          className=" wrapper"
                          style={inputError ? { border: "2px solid red" } : {}}
                        >
                          <PhoneInput
                            country={"us"}
                            value={inputValue}
                            // eslint-disable-next-line no-unused-vars
                            onChange={(value, country) =>
                              setInputValue("+" + value)
                            }
                            inputProps={{
                              name: "phone",
                              required: true,
                              autoFocus: true,
                              placeholder: "Enter phone number",
                            }}
                          />
                        </div>
                      )}
                      {inputError && (
                        <div className="inputError">
                          <ErrorIcon className="icon" />
                          <p>{inputError}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {authType === "REGISTER" &&
                    (!updateVendorRegistrationForm ? (
                      <>
                        <div className="inputField__wrapper">
                          <div
                            className=" wrapper"
                            style={
                              errorInfo.fullName
                                ? { border: "2px solid red" }
                                : {}
                            }
                          >
                            <FaUserAlt className="icon" />
                            <div className="vertical-line"></div>
                            <input
                              type="text"
                              name="fullName"
                              spellCheck="false"
                              value={
                                userType === "CUSTOMER"
                                  ? customerInfo.fullName
                                  : vendorInfo.fullName
                              }
                              placeholder="Enter your name"
                              onChange={(e) =>
                                userType === "CUSTOMER"
                                  ? handleCustomerInfo(
                                      "fullName",
                                      e.target.value
                                    )
                                  : handleVendorInfo("fullName", e.target.value)
                              }
                              className="input"
                            />
                          </div>
                          {errorInfo.fullName && (
                            <div className="inputError specialErrorClass">
                              <ErrorIcon className="icon" />
                              <p>{errorInfo.fullName}</p>
                            </div>
                          )}
                        </div>
                        <div className="inputField__wrapper">
                          <div
                            className=" wrapper"
                            style={
                              errorInfo.email ? { border: "2px solid red" } : {}
                            }
                          >
                            <EmailIcon className="icon" />
                            <div className="vertical-line"></div>
                            <input
                              type="email"
                              name="email"
                              spellCheck="false"
                              value={
                                userType === "CUSTOMER"
                                  ? customerInfo.email
                                  : vendorInfo.email
                              }
                              placeholder="username@gmail.com"
                              onChange={(e) =>
                                userType === "CUSTOMER"
                                  ? handleCustomerInfo("email", e.target.value)
                                  : handleVendorInfo("email", e.target.value)
                              }
                              className={`input`}
                            />
                          </div>
                          {errorInfo.email && (
                            <div className="inputError specialErrorClass">
                              <ErrorIcon className="icon" />
                              <p>{errorInfo.email}</p>
                            </div>
                          )}
                        </div>
                        <div className="inputField__wrapper">
                          <div
                            className=" wrapper"
                            style={
                              errorInfo.phone ? { border: "2px solid red" } : {}
                            }
                          >
                            <PhoneInput
                              country={"us"}
                              value={
                                userType === "CUSTOMER"
                                  ? customerInfo.phone
                                  : vendorInfo.phone
                              }
                              // eslint-disable-next-line no-unused-vars
                              onChange={(value, country) =>
                                userType === "CUSTOMER"
                                  ? handleCustomerInfo("phone", "+" + value)
                                  : handleVendorInfo("phone", "+" + value)
                              }
                              inputProps={{
                                name: "phone",
                                required: true,
                                autoFocus: true,
                                placeholder: "Enter phone number",
                              }}
                            />
                          </div>
                          {errorInfo.phone && (
                            <div className="inputError specialErrorClass">
                              <ErrorIcon className="icon" />
                              <p>{errorInfo.phone}</p>
                            </div>
                          )}
                        </div>
                        <div className="inputField__wrapper">
                          <div
                            className=" wrapper"
                            style={
                              errorInfo.password
                                ? { border: "2px solid red" }
                                : {}
                            }
                          >
                            <LockIcon className="icon" />
                            <div className="vertical-line"></div>
                            <input
                              type={passwordVisibility ? "text" : "password"}
                              name="password"
                              spellCheck="false"
                              value={
                                userType === "CUSTOMER"
                                  ? customerInfo.password
                                  : vendorInfo.password
                              }
                              placeholder="Enter your password"
                              onChange={(e) =>
                                userType === "CUSTOMER"
                                  ? handleCustomerInfo(
                                      "password",
                                      e.target.value
                                    )
                                  : handleVendorInfo("password", e.target.value)
                              }
                              className={`input`}
                            />
                            <a
                              onClick={() =>
                                setPasswordVisibility(!passwordVisibility)
                              }
                            >
                              {passwordVisibility ? (
                                <VisibilityIcon className="icon visibilityIcon" />
                              ) : (
                                <VisibilityOffIcon className="icon visibilityIcon" />
                              )}
                            </a>
                          </div>
                          {errorInfo.password && (
                            <div className="inputError specialErrorClass">
                              <ErrorIcon className="icon" />
                              <p>{errorInfo.password}</p>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="backBtn"
                          onClick={() =>
                            setUpdateVendorRegistrationForm(
                              !updateVendorRegistrationForm
                            )
                          }
                        >
                          <ReplyAllIcon className="icon" />
                          <span> Back </span>
                        </div>
                        <div className="inputField__wrapper">
                          <div
                            className="wrapper"
                            style={
                              errorInfo.brandName
                                ? { border: "2px solid red" }
                                : {}
                            }
                          >
                            <DriveFileRenameOutlineIcon className="icon" />
                            <div className="vertical-line"></div>
                            <input
                              type="text"
                              name="brandName"
                              spellCheck="false"
                              value={vendorInfo.brandName}
                              placeholder="Enter brand name"
                              onChange={(e) =>
                                handleVendorInfo("brandName", e.target.value)
                              }
                              className="input"
                            />
                          </div>
                          {errorInfo.brandName && (
                            <div className="inputError specialErrorClass">
                              <ErrorIcon className="icon" />
                              <p>{errorInfo.brandName}</p>
                            </div>
                          )}
                        </div>
                        <div className="inputField__wrapper">
                          <div
                            className=" wrapper"
                            style={
                              errorInfo.cityName
                                ? { border: "2px solid red" }
                                : {}
                            }
                          >
                            <PlaceIcon className="icon" />
                            <div className="vertical-line"></div>
                            <Select
                              styles={customSelectStyles}
                              options={
                                Array.isArray(data.citiesOfCountry.data)
                                  ? data.citiesOfCountry.data.map((city) => ({
                                      value: city,
                                      label: city,
                                    }))
                                  : null
                              }
                              value={
                                vendorInfo.cityName
                                  ? {
                                      value: vendorInfo.cityName,
                                      label: vendorInfo.cityName,
                                    }
                                  : null
                              }
                              onChange={(selectedOption) =>
                                handleVendorInfo(
                                  "cityName",
                                  selectedOption.value
                                )
                              }
                              placeholder="Choose a location"
                              className="input select"
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
                          {errorInfo.cityName && (
                            <div className="inputError specialErrorClass">
                              <ErrorIcon className="icon" />
                              <p>{errorInfo.cityName}</p>
                            </div>
                          )}
                        </div>
                        <div className="inputField__wrapper">
                          <div
                            className=" wrapper"
                            style={
                              errorInfo.vendorTypeInfo
                                ? { border: "2px solid red" }
                                : {}
                            }
                          >
                            <BusinessIcon className="icon" />
                            <div className="vertical-line"></div>
                            <Select
                              styles={customSelectStyles}
                              options={
                                Array.isArray(data.vendorTypes.data)
                                  ? data.vendorTypes.data.map((val) => ({
                                      value: val._id,
                                      label: val.vendorType,
                                    }))
                                  : null
                              }
                              value={
                                vendorInfo.vendorTypeInfo &&
                                vendorInfo.vendorTypeInfo.vendorTypeId
                                  ? {
                                      value: vendorInfo.vendorTypeInfo.vendorTypeId,
                                      label:
                                        vendorInfo.vendorTypeInfo.vendorType,
                                    }
                                  : null
                              }
                              onChange={(selectedOption) => {
                                handleVendorInfo("vendorTypeInfo", {
                                  vendorType: selectedOption.label,
                                  vendorTypeId: selectedOption.value,
                                });
                              }}
                              placeholder="Choose business type"
                              className="input select"
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
                          {errorInfo.vendorTypeInfo && (
                            <div className="inputError specialErrorClass">
                              <ErrorIcon className="icon" />
                              <p>{errorInfo.vendorTypeInfo}</p>
                            </div>
                          )}
                        </div>
                        <div className="inputField__wrapper">
                          <div
                            className=" wrapper"
                            style={
                              errorInfo.eventTypesInfo
                                ? { border: "2px solid red" }
                                : {}
                            }
                          >
                            <LibraryAddCheckIcon className="icon" />
                            <div className="vertical-line"></div>
                            <Select
                              styles={customSelectStyles}
                              value={
                                vendorInfo.eventTypesInfo &&
                                vendorInfo.eventTypesInfo[0].eventId
                                  ? vendorInfo.eventTypesInfo.map((option) => ({
                                      value: option.eventId,
                                      label: option.eventType,
                                    }))
                                  : null
                              }
                              onChange={(selectedOptions) => {
                                const updatedEventInfo = selectedOptions.map(
                                  (option) => ({
                                    eventType: option.label,
                                    eventId: option.value,
                                  })
                                );
                                handleVendorInfo(
                                  "eventTypesInfo",
                                  updatedEventInfo
                                );
                              }}
                              options={
                                Array.isArray(data.eventTypes.data)
                                  ? data.eventTypes.data.map((item) => ({
                                      value: item._id,
                                      label: item.eventName,
                                    }))
                                  : null
                              }
                              placeholder="Select all event types"
                              className="input select"
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
                              isSearchable
                              isClearable={false}
                              isMulti
                            />
                          </div>
                          {errorInfo.eventTypesInfo && (
                            <div className="inputError specialErrorClass">
                              <ErrorIcon className="icon" />
                              <p>{errorInfo.eventTypesInfo}</p>
                            </div>
                          )}
                        </div>
                        <div className="userAgreement__wrapper">
                          <div className="sub__wrapper">
                            <input
                              type="checkbox"
                              checked={userRegAgreement.termsAndConditions}
                              onChange={() =>
                                handleUserRegAgreement(
                                  "termsAndConditions",
                                  !userRegAgreement.termsAndConditions
                                )
                              }
                            />
                            <p>
                              I accept all the <span>Terms and Conditions</span>{" "}
                              *
                            </p>
                          </div>
                          <div className="sub__wrapper">
                            <input
                              type="checkbox"
                              checked={userRegAgreement.privacyPolicy}
                              onChange={() =>
                                handleUserRegAgreement(
                                  "privacyPolicy",
                                  !userRegAgreement.privacyPolicy
                                )
                              }
                            />
                            <p>
                              I have read the <span>Privacy Policy</span> *
                            </p>
                          </div>
                        </div>
                      </>
                    ))}
                  <button
                    type="submit"
                    disabled={
                      authType === "REGISTER" &&
                      userType === "VENDOR" &&
                      updateVendorRegistrationForm &&
                      (!userRegAgreement.privacyPolicy ||
                        !userRegAgreement.termsAndConditions)
                    }
                    style={{
                      marginBottom: authType === "LOGIN" ? "2rem" : "1rem",
                      cursor:
                        authType === "REGISTER" &&
                        userType === "VENDOR" &&
                        updateVendorRegistrationForm &&
                        (!userRegAgreement.privacyPolicy ||
                          !userRegAgreement.termsAndConditions)
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    <p>Continue</p>
                    <ArrowRightIcon className="icon" />
                  </button>
                </form>
                <div
                  className="signUp__link"
                  style={
                    authType === "LOGIN"
                      ? { marginBottom: "3.5rem" }
                      : { marginBottom: "1rem" }
                  }
                >
                  {authType === "LOGIN" ? (
                    <>
                      <p>
                        New to <span>EventifyConnect?</span>
                      </p>
                      <a onClick={() => setAuthType("REGISTER")}>Sign Up</a>
                    </>
                  ) : (
                    <>
                      <p>
                        Have an <span>account?</span>
                      </p>
                      <a onClick={() => setAuthType("LOGIN")}>Sign In</a>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="otpVerificationForm__wrapper">
                  <div className="line__separator"></div>
                  <div className="wrapper">
                    {passwordVerificationForm ? (
                      <h2 className="form__title">
                        Enter your account password
                      </h2>
                    ) : (
                      <h2 className="form__title">Check your email</h2>
                    )}
                    <p className="form__desc">to continue to EventifyConnect</p>
                    <div className="editInfo">
                      <div className="userIcon">
                        <PersonIcon className="icon" />
                      </div>
                      {authType === "LOGIN" ? (
                        <p>{inputValue}</p>
                      ) : userType === "CUSTOMER" ? (
                        <p>{customerInfo.email}</p>
                      ) : (
                        <p>{vendorInfo.email}</p>
                      )}
                      <button
                        className="editBtn"
                        onClick={() => setOtpVerificationForm(false)}
                      >
                        <FaEdit className="icon" />
                      </button>
                    </div>
                    {passwordVerificationForm ? (
                      <div className="passwordField__wrapper">
                        {
                          signInError &&
                          <Alert variant="outlined" severity="error">
                            Invalid Username or Password.
                          </Alert>
                        }
                        <div className="title">
                          <span>Password</span>
                        </div>
                        <div className="inputField__wrapper">
                          <div
                            className=" wrapper"
                            style={
                              signInPasswordError
                                ? { border: "2px solid red" }
                                : {}
                            }
                          >
                            <input
                              type={passwordVisibility ? "text" : "password"}
                              name="password"
                              spellCheck="false"
                              value={signInPasswordValue}
                              placeholder="Enter your password"
                              onChange={(e) =>
                                setSignInPasswordValue(e.target.value)
                              }
                              className={`input`}
                            />
                            <a
                              onClick={() =>
                                setPasswordVisibility(!passwordVisibility)
                              }
                            >
                              {passwordVisibility ? (
                                <VisibilityIcon className="icon visibilityIcon" />
                              ) : (
                                <VisibilityOffIcon className="icon visibilityIcon" />
                              )}
                            </a>
                          </div>
                          {signInPasswordError && (
                            <div className="inputError">
                              <ErrorIcon className="icon" />
                              <p>{signInPasswordError}</p>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => validatePassword(signInPasswordValue)}
                        >
                          <p>Continue</p>
                          <ArrowRightIcon className="icon" />
                        </button>
                      </div>
                    ) : (
                      <div className="otpField__wrapper">
                        <div className="sub__title">Verification code</div>
                        <div className="sub__desc">
                          Enter the code sent to your email address
                        </div>
                        <div className="otp__wrapper">
                          {otp.map((value, index) => (
                            <React.Fragment key={`${index}-${Date.now()}`}>
                              <input
                                type="text"
                                pattern="[0-9]*" // Allow only digits
                                className={`otp-digit ${
                                  otpFieldFocused === index && "currentInputBox"
                                }`}
                                maxLength={1}
                                value={value}
                                onChange={(e) =>
                                  handleOtpChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={() => setOtpFieldFocused(index)}
                                onBlur={() => setOtpFieldFocused(null)}
                                ref={(input) =>
                                  (inputRefs.current[index] = input)
                                }
                              />
                              &nbsp;
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="comment">
                          Didn&apos;t receive a code? <span>Resend (12)</span>
                        </div>
                      </div>
                    )}
                    <div className="methodSwitch__wrapper">
                      Use another method
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="bottomLine__Sep"></div>
            <div className="switchUser__wrapper">
              <p>
                {userType === "CUSTOMER" ? (
                  <span>Are you a vendor?</span>
                ) : (
                  <span>Are you a customer?</span>
                )}
              </p>
              <button
                onClick={() => {
                  if (userType === "CUSTOMER") {
                    setUpdateVendorRegistrationForm(false);
                    setAuthType("LOGIN");
                    setUserType("VENDOR");
                  } else {
                    setUpdateVendorRegistrationForm(false);
                    setAuthType("LOGIN");
                    setUserType("CUSTOMER");
                  }
                }}
              >
                {userType === "CUSTOMER" ? (
                  <span>Business Sign-In</span>
                ) : (
                  <span>Customer Sign-In</span>
                )}
              </button>
            </div>
          </div>
        </div>
        <button className="cancelIcon" onClick={handleClose}>
          <CloseIcon />
        </button>
      </Dialog>
    </div>
  );
}

UserAuthDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleRegistrationDialogOpen: PropTypes.func.isRequired
};
