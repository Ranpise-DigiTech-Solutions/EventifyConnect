import "./NavBar.scss";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import UserProfileLeftPanel from '../../components/UserProfileLeftPanel/UserProfileLeftPanel';
import { Images } from "../../constants";
import {
  UserAuthDialog,
  RegistrationForm,
  WalkInCustomerBookingDialog,
} from "../../components";
import { firebaseAuth } from "../../firebaseConfig.js";
import {
  userInfoActions,
  userAuthStateChangeFlag,
} from "../../states/UserInfo/index.js";
import ProfileIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
// import { SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";

export default function NavBar({ setIsLoading }) {
  const [scrolled, setScrolled] = useState(false);
  const [isSignInDialogOpen, setSignInDialogOpen] = useState(false);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] =
    useState(false);
  const [
    isWalkInCustomerBookingDialogOpen,
    setIsWalkInCustomerBookingDialogOpen,
  ] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const userInfoStore = useSelector((state) => state.userInfo);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hallData, setHallData] = useState(null);
  const [serviceProviderData, setServiceProviderData] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleUserProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserProfileClose = () => {
    setAnchorEl(null);
  };

  const handleSignInButtonClick = () => {
    setSignInDialogOpen(true);
  };

  const handleSignInDialogClose = () => {
    setSignInDialogOpen(false);
  };
  const handleRegistrationDialogOpen = () => {
    setIsRegistrationDialogOpen(true);
  };

  const handleRegistrationDialogClose = () => {
    setIsRegistrationDialogOpen(false);
  };
// Function to toggle the mobile menu
const toggleMobileMenu = () => {
  setMobileMenuOpen(!mobileMenuOpen);
};
// Function to handle menu item clicks
const handleMenuItemClick = (componentKey) => {
  console.log(componentKey);
  // Add any additional functionality you need
};
// Function to handle setting the active component
const handleSetActiveComponent = (componentKey) => {
  console.log('Active component:', componentKey);
  // Add any additional functionality you need
};
  const handleWalkInCustomerBookingDialogClose = () => {
    setIsWalkInCustomerBookingDialogOpen(false);
  };

  const handleWalkInCustomerBookingDialogOpen = () => {
    setIsWalkInCustomerBookingDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut(); // Sign out the current user
      dispatch(userAuthStateChangeFlag());
      dispatch(userInfoActions("userDetails", {}));
      setUser(null);
      console.log("User logged out successfully");
    } catch (error) {
      // Handle Error condition
      console.error("Error logging out:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      console.log("ENTERED_SIGNIN", currentUser);
      if (currentUser) {
        console.log("currentUser", currentUser.uid);
        setUser(currentUser);
        // setIsLoading(true);

        const getUserData = async () => {
          try {
            const response = await axios.get(
              `http://localhost:8000/eventify_server/userAuthentication/getUserData/${currentUser.uid}`
            );
            dispatch(userInfoActions("userDetails", response.data));
            dispatch(userAuthStateChangeFlag());
          } catch (error) {
            console.error("Error fetching user data:", error.message);
          } finally {
            // setIsLoading(false);
          }
        };
        console.log("FUNCTION CALL");
        getUserData();
      } else {
        // No user is signed in
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [dispatch, userInfoStore.userAuthStateChangeFlag]); // dependency array => [userAuthStateChangeFlag]

  useEffect(() => {
    try {
      const getServiceProviderData = async (hallData) => {
        const response = await axios.get(
          `http://localhost:8000/eventify_server/serviceProviderMaster/?serviceProviderId=${hallData.hallUserId}`
        );
        setServiceProviderData(response.data[0]);
      };

      const getHallData = async () => {
        const response = await axios.get(
          `http://localhost:8000/eventify_server/hallMaster/getHallByUserId/?userId=${userInfoStore.userDetails.Document._id}`
        );
        setHallData(response.data[0]);
        getServiceProviderData(response.data[0]);
        setIsLoading(false);
      };

      if(userInfoStore.userDetails.Document !== undefined) {
        getHallData();
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [user, userInfoStore.userDetails]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY) {
        // Scrolling down, hide the navbar
        setScrolled(false);
      } else {
        // Scrolling up, show the navbar
        setScrolled(true);
      }

      // Update the previous scroll position
      setPrevScrollY(currentScrollY);
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY]);
  const isMobile = useMediaQuery('(max-width:768px)');
  return (
    <div className="navbar__container">
      <div className={`navbar__wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="logo__wrapper">
          <img src={Images.logo} alt="logo" className="logo" />
          <div className="logodescription">
            <p className="title">EventifyConnect</p>
            <p className="tagline">- Connecting people together</p>
          </div>
        </div>
        {isMobile ? (
          // Mobile view
          <div >
            <IconButton onClick={toggleMobileMenu} color="inherit">
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Drawer
             
              anchor="right"
              open={mobileMenuOpen}
              onClose={toggleMobileMenu}
            >
              <Box
                sx={{
                  width: 250,
                  height: '100vh',
                  bgcolor: 'rgb(17, 24, 39)', // Set the background color to red
                  color: 'rgb(156, 163, 175)', // Set the text color to white
                }}
                role="presentation"
                onClick={toggleMobileMenu}
                onKeyDown={toggleMobileMenu}
                
              >
                {user ? (
                  <UserProfileLeftPanel
                    user={user}
                    handleLogout={handleLogout}
                    handleMenuItemClick={handleMenuItemClick}
                    setActiveComponent={handleSetActiveComponent} // Pass the handleSetActiveComponent function as a prop
                  />
                ) : (
                  <List >
                    {/* Add your menu items here */}
                    <ListItem button onClick={() => handleMenuItemClick('venues')}>
                      <ListItemText primary="Venues" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuItemClick('ourValue')}>
                      <ListItemText primary="Our Value" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuItemClick('contactUs')}>
                      <ListItemText primary="Contact Us" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuItemClick('getStarted')}>
                      <ListItemText primary="Get Started" />
                    </ListItem>
                    <ListItem button onClick={handleSignInButtonClick}>
                    <ListItemIcon style={{ color: 'rgb(156, 163, 175)' }}>
                        <PersonAdd fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Sign In" />
                    </ListItem>
                  </List>
                )}
              </Box>
            </Drawer>
          </div>
        ) : (
          <div className="tags__wrapper">
          <a href="#" className="tag" onClick={() => handleMenuItemClick('venues')}>
            Venues
          </a>
          <a href="#" className="tag" onClick={() => handleMenuItemClick('ourValue')}>
            Our Value
          </a>
          <a href="#" className="tag" onClick={() => handleMenuItemClick('contactUs')}>
            Contact Us
          </a>
          <a href="#" className="tag" onClick={() => handleMenuItemClick('getStarted')}>
            Get Started
          </a>
          {user ? (
              <React.Fragment>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleUserProfileClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    className="userProfile"
                  >
                    <Avatar sx={{ width: 36, height: 36 }}>M</Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleUserProfileClose}
                  onClick={handleUserProfileClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                 <MenuItem>
             <Link to="/">
              <ListItemIcon>
                    <HomeIcon fontSize="small" />
              </ListItemIcon>
                    Home
                  </Link>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <Link to="/ProfileForm" className="profile-link">
                  <ListItemIcon>
                    <div className="avatar-wrapper">
                      <Avatar fontSize="small" />
                    </div>
                    </ListItemIcon>
                    Profile
                  </Link>
                </MenuItem>
                <Divider />
                
                {userInfoStore.userDetails.userType === "VENDOR" && (
                  <MenuItem onClick={handleWalkInCustomerBookingDialogOpen}>
                    <ListItemIcon>
                      <AddBusinessOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    Walk-In Customer
                  </MenuItem>
                )}
                <Divider />
                
                <MenuItem onClick={handleUserProfileClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleUserProfileClose();
                    handleLogout();
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
              </React.Fragment>
            ) : (
              <Button
                variant="contained"
                className="button"
                onClick={handleSignInButtonClick}
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
      {isSignInDialogOpen && (
        <div className="signInDialog">
          <UserAuthDialog
            open={isSignInDialogOpen}
            handleClose={handleSignInDialogClose}
            handleRegistrationDialogOpen={handleRegistrationDialogOpen}
          />
        </div>
      )}
      {isRegistrationDialogOpen && (
        <div className="userRegistrationDialog">
          <RegistrationForm
            open={isRegistrationDialogOpen}
            handleClose={handleRegistrationDialogClose}
            // userType={"VENDOR"}
            // vendorType={"Banquet Hall"}
          />
        </div>
      )}
      {isWalkInCustomerBookingDialogOpen && (
        <div className="walkInCustomerBookingDialog">
          <WalkInCustomerBookingDialog
            open={isWalkInCustomerBookingDialogOpen}
            handleClose={handleWalkInCustomerBookingDialogClose}
            hallData={hallData}
            serviceProviderData={serviceProviderData}
          />
        </div>
      )}
    </div>
  );
}

NavBar.propTypes = {
  setIsLoading: PropTypes.func,
  hallData: PropTypes.object,
  serviceProviderData: PropTypes.object,
};
