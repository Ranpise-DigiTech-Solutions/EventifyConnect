import React, { useState, useEffect } from 'react';
import './UserProfilePage.scss'
import UserProfileLeftPanel from '../../components/UserProfileLeftPanel/UserProfileLeftPanel';
import OrderHistoryPage from '../../components/OrderHistoryPage/OrderHistoryPage';
import SettingsComponent from '../../components/UserSettings/UserSettings';
import MyCart from '../../components/MyCart/MyCart';
import Favorites from '../../components/Favorites/Favorites';
import Notification from '../../components/Notifications/Notifications';
import Dashboard from '../../components/Dashboard/Dashboard';
import ProfileForm from '../../components/UserProfile/ProfileForm';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
  const navigateTo = useNavigate();
  const userInfoStore = useSelector((state) => state.userInfo);
  // Get userType from Redux store
  const userId = userInfoStore.userDetails.UID;
  console.log(userId);

  // State to manage loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigateTo('/');
    } else {
      setIsLoading(false); // Once the user is loaded, set loading to false
    }
  }, [userId, navigateTo]);

  // State to manage which component is currently active/selected
  const [activeComponent, setActiveComponent] = useState('');

  // Function to render the right component based on the active state
  const renderComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return <ProfileForm />;
      case 'orderHistory':
        return <OrderHistoryPage />;
      case 'packages':
        return <Favorites />;
      case 'settings':
        return <SettingsComponent/>;
      case 'mycart':
        return <MyCart/>;
      case 'Notifications':
          return <Notification/>;
      case 'dashboard':
            return <Dashboard  />; // Pass userType to Dashboard
      default:
        return <ProfileForm />;
    }
  };

  // Show loading message until user is loaded
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render UserProfilePage once loading is finished
  return (
    <div className="userProfilePage__container">
      <UserProfileLeftPanel setActiveComponent={setActiveComponent} />
      <div className="rightPanel">
        {renderComponent()}
      </div>
    </div>
  );
};

export default UserProfilePage;
