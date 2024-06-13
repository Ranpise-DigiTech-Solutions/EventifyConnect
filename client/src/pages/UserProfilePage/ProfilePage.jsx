import "./ProfilePage.scss";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";

import { firebaseAuth } from "../../firebaseConfig.js";
import { Images } from "../../constants";
import {
  Dashboard,
  Favorites,
  HallForm,
  MyCart,
  Notification,
  OrderHistory,
  ProfileForm,
  SettingsComponent,
  WalkInCustomerBookingDialog,
} from "../../components";
import {
  userInfoActions,
  userAuthStateChangeFlag,
} from "../../states/UserInfo/index.js";
import { LoadingScreen } from "../../sub-components/index.js";
import { Link } from "react-router-dom";

const ProfilePage = (props) => {
  const drawerWidth = 240;
  const { window } = props;
  const isBelow900px = useMediaQuery("(max-width:900px)");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const dispatch = useDispatch();
  const userInfoStore = useSelector((state) => state.userInfo);
  const searchParams = new URLSearchParams(location.search);

  const [user, setUser] = useState(null);
  const [hallData, setHallData] = useState(null);
  const [serviceProviderData, setServiceProviderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [activeComponent, setActiveComponent] = useState(
    searchParams.get("activeComponent") || "User Profile"
  );
  // Component List : 1. User Profile  2. Dashboard  3. Business  4. Walk-In Booking  5. Booking History  6. Cart  7. Favorites  8. Notifications  9. Settings

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleUserLogout = async () => {
    try {
      await firebaseAuth.signOut(); // Sign out the current user
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
              `${
                import.meta.env.VITE_SERVER_URL
              }/eventify_server/userAuthentication/getUserData/${
                currentUser.uid
              }`
            );
            dispatch(userInfoActions("userDetails", response.data));
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
  }, [
    dispatch,
    userInfoStore.userAuthStateChangeFlag,
    userInfoStore.userDataUpdateFlag,
  ]); // dependency array => [userAuthStateChangeFlag]

  // get hall data
  useEffect(() => {
    if (userInfoStore.userDetails.vendorType !== "Banquet Hall") {
      return;
    }

    try {
      const getServiceProviderData = async (hallData) => {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/eventify_server/serviceProviderMaster/?serviceProviderId=${
            hallData.hallUserId
          }`
        );
        setServiceProviderData(response.data[0]);
      };

      const getHallData = async () => {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/eventify_server/hallMaster/getHallByUserId/?userId=${
            userInfoStore.userDetails.Document._id
          }`
        );
        setHallData(response.data[0]);
        getServiceProviderData(response.data[0]);
        setIsLoading(false);
      };

      if (userInfoStore.userDetails.Document !== undefined) {
        getHallData();
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [user, userInfoStore.userDetails]);

  const drawer = (
    <Box
      className="userProfileDrawer__container"
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <List
        className="list__wrapper"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "hidden",
          gap: "0.5rem",
        }}
      >
        <Link to="/">
          <ListItem key={"Logo"} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ height: "2rem", width: "2rem" }}>
                <img src={Images.logo} alt="" className="logo" />
              </ListItemIcon>
              <p className="logoText">EventifyConnect</p>
            </ListItemButton>
          </ListItem>
        </Link>
        <Divider
          className="divider"
          sx={{
            width: "100%",
            height: "1px",
            backgroundColor: "#b3b3b3",
            margin: "0.5rem 0",
          }}
        />
        <ListItem key={"Profile"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon sx={{ color: "#007bff" }} className="icon" />
            </ListItemIcon>
            <p
              className="listItemText"
              onClick={() => setActiveComponent("User Profile")}
            >
              View Profile
            </p>
          </ListItemButton>
        </ListItem>
        {userInfoStore.userDetails.userType !== "CUSTOMER" && (
          <ListItem key={"Dashboard"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon sx={{ color: "#007bff" }} className="icon" />
              </ListItemIcon>
              <p
                className="listItemText"
                onClick={() => setActiveComponent("Dashboard")}
              >
                User Dashboard
              </p>
            </ListItemButton>
          </ListItem>
        )}
        {userInfoStore.userDetails.userType === "VENDOR" && (
          <ListItem key={"Business"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <BusinessIcon sx={{ color: "#007bff" }} className="icon" />
              </ListItemIcon>
              <p
                className="listItemText"
                onClick={() => setActiveComponent("Business")}
              >
                Your Business
              </p>
            </ListItemButton>
          </ListItem>
        )}
        {/* {userInfoStore.userDetails.userType === "VENDOR" &&
          userInfoStore.userDetails.vendorType === "Banquet Hall" && (
            <ListItem key={"Walk-In Booking"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <AddBusinessOutlinedIcon sx={{ color: "#007bff" }} className="icon" />
                </ListItemIcon>
                <p
                  className="listItemText"
                  onClick={() => setActiveComponent("Walk-In Booking")}
                >
                  Walk-In Booking
                </p>
              </ListItemButton>
            </ListItem>
          )} */}
        <ListItem key={"Booking History"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <HistoryIcon sx={{ color: "#007bff" }} className="icon" />
            </ListItemIcon>
            <p
              className="listItemText"
              onClick={() => setActiveComponent("Booking History")}
            >
              Booking History
            </p>
          </ListItemButton>
        </ListItem>
        {userInfoStore.userDetails.userType === "CUSTOMER" && (
          <ListItem key={"Cart"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ShoppingCartIcon sx={{ color: "#007bff" }} className="icon" />
              </ListItemIcon>
              <p
                className="listItemText"
                onClick={() => setActiveComponent("Cart")}
              >
                Your Cart
              </p>
            </ListItemButton>
          </ListItem>
        )}
        <ListItem key={"Favorites"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <FavoriteOutlinedIcon
                sx={{ color: "#007bff" }}
                className="icon"
              />
            </ListItemIcon>
            <p
              className="listItemText"
              onClick={() => setActiveComponent("Favorites")}
            >
              Favorites
            </p>
          </ListItemButton>
        </ListItem>
        <ListItem key={"Notifications"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <NotificationsIcon sx={{ color: "#007bff" }} className="icon" />
            </ListItemIcon>
            <p
              className="listItemText"
              onClick={() => setActiveComponent("Notifications")}
            >
              Notifications
            </p>
          </ListItemButton>
        </ListItem>
        <ListItem key={"Settings"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon sx={{ color: "#007bff" }} className="icon" />
            </ListItemIcon>
            <p
              className="listItemText"
              onClick={() => setActiveComponent("Settings")}
            >
              Settings
            </p>
          </ListItemButton>
        </ListItem>
      </List>
      <List className="list__wrapper" sx={{ width: "100%" }}>
        <Divider
          className="divider"
          sx={{
            width: "100%",
            height: "1px",
            backgroundColor: "#b3b3b3",
            margin: "0",
          }}
        />
        <Link to="/">
          <ListItem key={"Logout"} onClick={handleUserLogout} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon sx={{ color: "#007bff" }} className="icon" />
              </ListItemIcon>
              <p className="listItemText">Logout</p>
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </Box>
  );

  const renderComponent = () => {
    switch (activeComponent) {
      case "User Profile":
        return <ProfileForm />;
      case "Dashboard":
        return <Dashboard />;
      case "Business":
        return <HallForm />;
      case "Walk-In Booking":
        return (
          <WalkInCustomerBookingDialog
            open={true}
            handleClose={() => {}}
            hallData={hallData}
            serviceProviderData={serviceProviderData}
          />
        );
      case "Booking History":
        return <OrderHistory />;
      case "Cart":
        return <MyCart />;
      case "Favorites":
        return <Favorites />;
      case "Notifications":
        return <Notification />;
      case "Settings":
        return <SettingsComponent />;
      default:
        return null;
    }
  };

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="profilePage__container">
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
              position="fixed"
              sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                // height:`3rem`,
                backgroundColor: "#1A1A1A",
              }}
            >
              <Toolbar>
                {isBelow900px && (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: "none" }, 
                    color: "#007bff" }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                <Typography variant="h6" noWrap component="div" sx={{fontWeight: 600, fontSize: "22px", color: "#ffffff"}}>
                  {activeComponent}
                </Typography>
              </Toolbar>
            </AppBar>
            <Box
              component="nav"
              sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
              aria-label="mailbox folders"
            >
              <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onTransitionEnd={handleDrawerTransitionEnd}
                onClose={handleDrawerClose}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: "block", md: "none" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                    backgroundColor: "#1A1A1A",
                    color: "#fff",
                  },
                }}
              >
                {drawer}
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: "none", md: "block" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                    backgroundColor: "#1A1A1A",
                    color: "#fff",
                  },
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { md: `calc(100% - ${drawerWidth}px)` },
                padding: 0,
                backgroundColor: "#404040", // #2e2e2e
              }}
            >
              {/* <Toolbar /> */}
              {renderComponent()}
            </Box>
          </Box>
        </div>
      )}
    </>
  );
};

ProfilePage.propTypes = {
  window: PropTypes.func,
};

export default ProfilePage;
