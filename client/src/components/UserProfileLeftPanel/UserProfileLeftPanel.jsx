/*import {React,useState} from "react";
import logo from '../../assets/logo.png';
import { MdDashboard } from 'react-icons/md';
import { useSelector, useDispatch } from "react-redux";
import { firebaseAuth } from "../../firebaseConfig.js";
import { userInfoActions } from "../../states/UserInfo/index.js";
import { useNavigate } from "react-router-dom";

export default function UserDashboard({ setActiveComponent }) {
  const navigateTo = useNavigate();
 
  const userInfoStore = useSelector((state) => state.userInfo);
  const userType = userInfoStore.userDetails.userType;
  const dispatch = useDispatch();
  console.log(userType);
  const [userAuthStateChangeFlag, setUserAuthStateChangeFlag] = useState(false);
  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut(); // Sign out the current user
      setUserAuthStateChangeFlag(prevFlag => !prevFlag);
      dispatch(userInfoActions("userDetails", {}));
      console.log('User logged out successfully');
      navigateTo('/');
    } catch (error) { // Handle Error condition
      console.error('Error logging out:', error.message);
    }
  };
 
  const handleLogoClick = (event) => {
    event.preventDefault(); // Prevent default behavior of the anchor tag
    navigateTo("/"); // Navigate to the home page
  };

    const handleItemClick = (componentKey) => {
        setActiveComponent(componentKey);
      };
    return (
      <div className="fixed top-0 left-0 bottom-0 flex flex-col items-center w-80 overflow-hidden text-gray-400 bg-gray-900 rounded dashboardbox">
        <a className="flex items-center w-full px-3 mt-3" href="" onClick={() => handleLogoClick()}>
        <div>
      
      <img src={logo} alt="Logo" style={{ width: '50px', height: 'auto' }} />
    </div>
          <span className="ml-2 text-sm font-bold">EventifyConnect</span>
        </a>
        <div className="w-full px-2">
          <MenuSection >
          {(userType === "VENDOR" || userType === "ADMIN") && (
             <>
          <MenuItem icon={<MdDashboard />} text="Dashboard" onClick={() => handleItemClick('dashboard')}/>
          </>)}
          
             <MenuItem icon={<UserIcon />} text="View Profile" onClick={() => handleItemClick('profile')}/> 
             {userType === "CUSTOMER" && (
            <>
            <MenuItem icon={<HeartIcon />} text="Favorites" onClick={() => handleItemClick('packages')}  />
            
            <MenuItem icon={<CartIcon />} text="Your Cart" onClick={() => handleItemClick('mycart')} />
            </>)}
            <MenuItem icon={<HistoryIcon />} onClick={() => handleItemClick('orderHistory')}  text="Booking History" />
            <MenuItem icon={<BellIcon />} text="Notifications" onClick={() => handleItemClick('Notifications')} />
            <MenuItem icon={<SettingsIcon />} text="Settings" onClick={() => handleItemClick('settings')}  />
            
          </MenuSection>
        </div>
        <a
        className="flex items-center justify-center w-full h-16 mt-auto bg-gray-800 hover:bg-gray-700 hover:text-gray-300"
        href="#"
        onClick={handleLogout} 
      >
        <svg
          className="w-6 h-6 stroke-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="ml-2 text-sm font-medium">Logout</span>
      </a>
    </div>
  );
}

function MenuSection({ title, children }) {
  return (
    <div className="flex flex-col items-start w-full mt-3 border-t border-gray-700">
      <span className="text-sm font-semibold text-gray-500">{title}</span>
      <div className="w-full">{children}</div>
    </div>
  );
}

function MenuItem({ icon, text, onClick }) {
  return (
    <div className="menu-item" onClick={onClick}>
      <a
        className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300"
        href="#"
      >
        {icon}
        <span className="ml-2 text-sm font-medium">{text}</span>
      </a>
    </div>
  );
}
  
  const HeartIcon = () => (
    <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z" />
    </svg>
  );
  
  
const DashboardIcon=() =>(
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
</svg>
);
const CartIcon = () => (
  <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z" />
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.60423 5.60423L5.0739 5.0739V5.0739L5.60423 5.60423ZM4.33785 6.87061L3.58786 6.87438C3.58992 7.28564 3.92281 7.61853 4.33408 7.6206L4.33785 6.87061ZM6.87963 7.63339C7.29384 7.63547 7.63131 7.30138 7.63339 6.88717C7.63547 6.47296 7.30138 6.13549 6.88717 6.13341L6.87963 7.63339ZM5.07505 4.32129C5.07296 3.90708 4.7355 3.57298 4.32129 3.57506C3.90708 3.57715 3.57298 3.91462 3.57507 4.32882L5.07505 4.32129ZM3.75 12C3.75 11.5858 3.41421 11.25 3 11.25C2.58579 11.25 2.25 11.5858 2.25 12H3.75ZM16.8755 20.4452C17.2341 20.2378 17.3566 19.779 17.1492 19.4204C16.9418 19.0619 16.483 18.9393 16.1245 19.1468L16.8755 20.4452ZM19.1468 16.1245C18.9393 16.483 19.0619 16.9418 19.4204 17.1492C19.779 17.3566 20.2378 17.2341 20.4452 16.8755L19.1468 16.1245ZM5.14033 5.07126C4.84598 5.36269 4.84361 5.83756 5.13505 6.13191C5.42648 6.42626 5.90134 6.42862 6.19569 6.13719L5.14033 5.07126ZM18.8623 5.13786C15.0421 1.31766 8.86882 1.27898 5.0739 5.0739L6.13456 6.13456C9.33366 2.93545 14.5572 2.95404 17.8017 6.19852L18.8623 5.13786ZM5.0739 5.0739L3.80752 6.34028L4.86818 7.40094L6.13456 6.13456L5.0739 5.0739ZM4.33408 7.6206L6.87963 7.63339L6.88717 6.13341L4.34162 6.12062L4.33408 7.6206ZM5.08784 6.86684L5.07505 4.32129L3.57507 4.32882L3.58786 6.87438L5.08784 6.86684ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM16.1245 19.1468C14.9118 19.8483 13.5039 20.25 12 20.25V21.75C13.7747 21.75 15.4407 21.2752 16.8755 20.4452L16.1245 19.1468ZM20.25 12C20.25 13.5039 19.8483 14.9118 19.1468 16.1245L20.4452 16.8755C21.2752 15.4407 21.75 13.7747 21.75 12H20.25ZM6.19569 6.13719C7.68707 4.66059 9.73646 3.75 12 3.75V2.25C9.32542 2.25 6.90113 3.32791 5.14033 5.07126L6.19569 6.13719Z" />
  </svg>
);

const BellIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="style=doutone">
      <g id="notification-bell-line">
        <path
          id="vector (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.87378 18.6934C9.28799 18.6934 9.62378 19.0291 9.62378 19.4434C9.62378 19.6166 9.66765 19.7955 9.76263 19.9722C9.85831 20.15 10.0063 20.3258 10.21 20.4827C10.4138 20.6396 10.6653 20.7712 10.9534 20.8631C11.2413 20.955 11.5544 21.0035 11.8734 21.0035C12.1923 21.0035 12.5054 20.955 12.7933 20.8631C13.0814 20.7712 13.3329 20.6396 13.5367 20.4827C13.7404 20.3258 13.8884 20.15 13.9841 19.9722C14.0791 19.7955 14.1229 19.6166 14.1229 19.4434C14.1229 19.0291 14.4587 18.6934 14.8729 18.6934C15.2871 18.6934 15.6229 19.0291 15.6229 19.4434C15.6229 19.8769 15.5116 20.2987 15.3051 20.6827C15.0993 21.0653 14.8054 21.3989 14.452 21.6711C14.0987 21.9431 13.6889 22.1519 13.2492 22.2922C12.8093 22.4325 12.3422 22.5035 11.8734 22.5035C11.4045 22.5035 10.9374 22.4325 10.4975 22.2922C10.0578 22.1519 9.64798 21.9431 9.29471 21.6711C8.94129 21.3989 8.64739 21.0653 8.44158 20.6827C8.23509 20.2987 8.12378 19.8769 8.12378 19.4434C8.12378 19.0291 8.45957 18.6934 8.87378 18.6934Z"
          fill="#BFBFBF"
        />
        <path
          id="vector (Stroke)_2"
          fillRule="evenodd"
          clipRule="evenodd"
            d="M8.28966 2.36993C10.5476 1.24631 13.1934 1.20809 15.4828 2.26601L15.6874 2.36056C18.0864 3.46909 19.6223 5.87083 19.6223 8.51353L19.6223 9.82417C19.6223 10.8777 19.8519 11.9185 20.2951 12.8742L20.5598 13.445C21.7754 16.0663 20.1923 19.1303 17.3509 19.6555L17.2146 18.918L17.3509 19.6555L17.1907 19.6851C13.6756 20.3349 10.0711 20.3349 6.55594 19.6851C3.6763 19.1529 2.15285 15.967 3.54631 13.3914L3.77272 12.9729C4.3316 11.9399 4.62426 10.7839 4.62426 9.60942L4.62426 8.28813C4.62426 5.77975 6.04397 3.48746 8.28966 2.36993ZM14.8536 3.62766C12.9772 2.76057 10.8086 2.7919 8.95794 3.71284C7.22182 4.57679 6.12426 6.34893 6.12426 8.28813L6.12426 9.60942C6.12426 11.0332 5.76949 12.4345 5.09201 13.6867L4.86561 14.1052C3.95675 15.785 4.95039 17.863 6.82857 18.2101C10.1635 18.8265 13.5832 18.8265 16.9181 18.2101L17.0783 18.1805C18.9561 17.8334 20.0024 15.8084 19.199 14.076L18.9343 13.5053C18.3994 12.3518 18.1223 11.0956 18.1223 9.82416L18.1223 8.51353C18.1223 6.45566 16.9263 4.58543 15.0582 3.72221L14.8536 3.62766Z"
            fill="#BFBFBF"
          />
          <path
            id="vector (Stroke)_3"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.74719 14.4995C8.74719 14.0853 9.08298 13.7495 9.49719 13.7495L14.4972 13.7495C14.9114 13.7495 15.2472 14.0853 15.2472 14.4995C15.2472 14.9137 14.9114 15.2495 14.4972 15.2495L9.49719 15.2495C9.08298 15.2495 8.74719 14.9137 8.74719 14.4995Z"
            fill="#BFBFBF"
          />
        </g>
      </g>
    </svg>
  );
  
  
  
  const SettingsIcon = () => (
    <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.195 12.155c-.036-.255-.08-.512-.135-.765l1.938-1.507c.34-.263.418-.739.178-1.1l-1.954-3.386a.724.724 0 00-.726-.377l-2.426.196c-.295-.222-.61-.409-.947-.556l-.372-2.54A.724.724 0 0013.75 2h-3.5a.724.724 0 00-.725.648l-.372 2.54c-.337.147-.652.334-.947.556l-2.426-.196a.724.724 0 00-.726.377l-1.953 3.386a.724.724 0 00.178 1.1l1.938 1.507c-.055.253-.099.51-.135.765l-1.938 1.507c-.34.263-.418.739-.178 1.1l1.954 3.386c.154.267.415.437.726.377l2.426-.196c.294.222.609.409.947.556l.372 2.54c.05.343.343.601.695.601h3.5c.352 0 .645-.258.695-.601l.372-2.54c.337-.147.652-.334.947-.556l2.426.196c.311.026.572-.11.726-.377l1.954-3.386c.24-.36.162-.837-.178-1.1l-1.938-1.507zM12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16,16A7,7,0,1,0,9,9,7,7,0,0,0,16,16ZM16,4a5,5,0,1,1-5,5A5,5,0,0,1,16,4Z"/><path d="M17,18H15A11,11,0,0,0,4,29a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1A11,11,0,0,0,17,18ZM6.06,28A9,9,0,0,1,15,20h2a9,9,0,0,1,8.94,8Z" />
    </svg>
  );
  */
  import {React,useState} from "react";
import logo from '../../assets/logo.png';
import { MdDashboard } from 'react-icons/md';
import { useSelector, useDispatch } from "react-redux";
import { firebaseAuth } from "../../firebaseConfig.js";
import { userInfoActions } from "../../states/UserInfo/index.js";
import { useNavigate } from "react-router-dom";
import './UserProfileLeftPanel.scss'

export default function UserDashboard({ setActiveComponent }) {
  const navigateTo = useNavigate();
 
  const userInfoStore = useSelector((state) => state.userInfo);
  const userType = userInfoStore.userDetails.userType;
  const dispatch = useDispatch();
  console.log(userType);
  const [userAuthStateChangeFlag, setUserAuthStateChangeFlag] = useState(false);
  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut(); // Sign out the current user
      console.log('User signed out');
      setUserAuthStateChangeFlag(prevFlag => !prevFlag);
      dispatch(userInfoActions("userDetails", {}));
      console.log('User details cleared');
      alert('User logged out successfully'); // Display a success message
      navigateTo('/'); // Navigate to the home page
    } catch (error) {
      // Handle Error condition
      console.error('Error logging out:', error.message);
      alert('Error logging out. Please try again.'); // Display an error message
    }
  };
 
 
  const handleItemClick = (componentKey) => {
    setActiveComponent(componentKey);
    console.log(componentKey);
    switch (componentKey) {
      case 'home':
        navigateTo('/');
      break;
      case 'dashboard':
        navigateTo('/Dashboard');
        break;
      case 'profile':
        navigateTo('/ProfileForm');
        break;
      case 'packages':
        navigateTo('/Favourites');
        break;
      case 'mycart':
        navigateTo('/YourCart');
        break;
      case 'orderHistory':
        navigateTo('/OrderHistory');
        break;
      case 'Notifications':
        navigateTo('/Notifications');
        break;
      case 'settings':
        navigateTo('/settings');
        break;
        case 'hallForm':
          navigateTo('/ServiceDetails');
          break;
      default:
        break;
    }
  };
    return (
      <div className="fixed top-0 left-0 bottom-0 flex flex-col items-center w-80 overflow-hidden text-gray-400 bg-gray-900 rounded dashboardbox">
        <a className="flex items-center w-full px-3 mt-3" href="" onClick={() => handleItemClick('home')}>
        <div>
      
      <img src={logo} alt="Logo" style={{ width: '50px', height: 'auto' }} />
    </div>
          <span className="ml-2 text-sm font-bold">EventifyConnect</span>
        </a>
        <div className="w-full px-2">
          <MenuSection >
          {(userType === "VENDOR" || userType === "ADMIN") && (
             <>
          <MenuItem icon={<MdDashboard />} text="Dashboard" onClick={() => handleItemClick('dashboard')}/>
          </>)}
          
             <MenuItem icon={<UserIcon />} text="View Profile" onClick={() => handleItemClick('profile')}/> 
             {userType === "CUSTOMER" && (
            <>
            <MenuItem icon={<HeartIcon />} text="Favorites" onClick={() => handleItemClick('packages')}  />
            
            <MenuItem icon={<CartIcon />} text="Your Cart" onClick={() => handleItemClick('mycart')} />
            </>)}
            <MenuItem icon={<HistoryIcon />} onClick={() => handleItemClick('orderHistory')}  text="Booking History" />
            <MenuItem icon={<BellIcon />} text="Notifications" onClick={() => handleItemClick('Notifications')} />
            <MenuItem icon={<SettingsIcon />} text="Settings" onClick={() => handleItemClick('settings')}  />
            
          </MenuSection>
        </div>
        <a
        className="flex items-center justify-center w-full h-16 mt-auto bg-gray-800 hover:bg-gray-700 hover:text-gray-300"
        href="#"
        onClick={handleLogout} 
      >
        <svg
          className="w-6 h-6 stroke-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="ml-2 text-sm font-medium">Logout</span>
      </a>
    </div>
  );
}

function MenuSection({ title, children }) {
  return (
    <div className="flex flex-col items-start w-full mt-3 border-t border-gray-700">
      <span className="text-sm font-semibold text-gray-500">{title}</span>
      <div className="w-full">{children}</div>
    </div>
  );
}

function MenuItem({ icon, text, onClick }) {
  return (
    <div className="menu-item" onClick={onClick}>
      <a
        className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300"
        href="#"
      >
        {icon}
        <span className="ml-2 text-sm font-medium">{text}</span>
      </a>
    </div>
  );
}
  
  const HeartIcon = () => (
    <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z" />
    </svg>
  );
  
  
const DashboardIcon=() =>(
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
</svg>
);
const CartIcon = () => (
  <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z" />
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.60423 5.60423L5.0739 5.0739V5.0739L5.60423 5.60423ZM4.33785 6.87061L3.58786 6.87438C3.58992 7.28564 3.92281 7.61853 4.33408 7.6206L4.33785 6.87061ZM6.87963 7.63339C7.29384 7.63547 7.63131 7.30138 7.63339 6.88717C7.63547 6.47296 7.30138 6.13549 6.88717 6.13341L6.87963 7.63339ZM5.07505 4.32129C5.07296 3.90708 4.7355 3.57298 4.32129 3.57506C3.90708 3.57715 3.57298 3.91462 3.57507 4.32882L5.07505 4.32129ZM3.75 12C3.75 11.5858 3.41421 11.25 3 11.25C2.58579 11.25 2.25 11.5858 2.25 12H3.75ZM16.8755 20.4452C17.2341 20.2378 17.3566 19.779 17.1492 19.4204C16.9418 19.0619 16.483 18.9393 16.1245 19.1468L16.8755 20.4452ZM19.1468 16.1245C18.9393 16.483 19.0619 16.9418 19.4204 17.1492C19.779 17.3566 20.2378 17.2341 20.4452 16.8755L19.1468 16.1245ZM5.14033 5.07126C4.84598 5.36269 4.84361 5.83756 5.13505 6.13191C5.42648 6.42626 5.90134 6.42862 6.19569 6.13719L5.14033 5.07126ZM18.8623 5.13786C15.0421 1.31766 8.86882 1.27898 5.0739 5.0739L6.13456 6.13456C9.33366 2.93545 14.5572 2.95404 17.8017 6.19852L18.8623 5.13786ZM5.0739 5.0739L3.80752 6.34028L4.86818 7.40094L6.13456 6.13456L5.0739 5.0739ZM4.33408 7.6206L6.87963 7.63339L6.88717 6.13341L4.34162 6.12062L4.33408 7.6206ZM5.08784 6.86684L5.07505 4.32129L3.57507 4.32882L3.58786 6.87438L5.08784 6.86684ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM16.1245 19.1468C14.9118 19.8483 13.5039 20.25 12 20.25V21.75C13.7747 21.75 15.4407 21.2752 16.8755 20.4452L16.1245 19.1468ZM20.25 12C20.25 13.5039 19.8483 14.9118 19.1468 16.1245L20.4452 16.8755C21.2752 15.4407 21.75 13.7747 21.75 12H20.25ZM6.19569 6.13719C7.68707 4.66059 9.73646 3.75 12 3.75V2.25C9.32542 2.25 6.90113 3.32791 5.14033 5.07126L6.19569 6.13719Z" />
  </svg>
);

const BellIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="style=doutone">
      <g id="notification-bell-line">
        <path
          id="vector (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.87378 18.6934C9.28799 18.6934 9.62378 19.0291 9.62378 19.4434C9.62378 19.6166 9.66765 19.7955 9.76263 19.9722C9.85831 20.15 10.0063 20.3258 10.21 20.4827C10.4138 20.6396 10.6653 20.7712 10.9534 20.8631C11.2413 20.955 11.5544 21.0035 11.8734 21.0035C12.1923 21.0035 12.5054 20.955 12.7933 20.8631C13.0814 20.7712 13.3329 20.6396 13.5367 20.4827C13.7404 20.3258 13.8884 20.15 13.9841 19.9722C14.0791 19.7955 14.1229 19.6166 14.1229 19.4434C14.1229 19.0291 14.4587 18.6934 14.8729 18.6934C15.2871 18.6934 15.6229 19.0291 15.6229 19.4434C15.6229 19.8769 15.5116 20.2987 15.3051 20.6827C15.0993 21.0653 14.8054 21.3989 14.452 21.6711C14.0987 21.9431 13.6889 22.1519 13.2492 22.2922C12.8093 22.4325 12.3422 22.5035 11.8734 22.5035C11.4045 22.5035 10.9374 22.4325 10.4975 22.2922C10.0578 22.1519 9.64798 21.9431 9.29471 21.6711C8.94129 21.3989 8.64739 21.0653 8.44158 20.6827C8.23509 20.2987 8.12378 19.8769 8.12378 19.4434C8.12378 19.0291 8.45957 18.6934 8.87378 18.6934Z"
          fill="#BFBFBF"
        />
        <path
          id="vector (Stroke)_2"
          fillRule="evenodd"
          clipRule="evenodd"
            d="M8.28966 2.36993C10.5476 1.24631 13.1934 1.20809 15.4828 2.26601L15.6874 2.36056C18.0864 3.46909 19.6223 5.87083 19.6223 8.51353L19.6223 9.82417C19.6223 10.8777 19.8519 11.9185 20.2951 12.8742L20.5598 13.445C21.7754 16.0663 20.1923 19.1303 17.3509 19.6555L17.2146 18.918L17.3509 19.6555L17.1907 19.6851C13.6756 20.3349 10.0711 20.3349 6.55594 19.6851C3.6763 19.1529 2.15285 15.967 3.54631 13.3914L3.77272 12.9729C4.3316 11.9399 4.62426 10.7839 4.62426 9.60942L4.62426 8.28813C4.62426 5.77975 6.04397 3.48746 8.28966 2.36993ZM14.8536 3.62766C12.9772 2.76057 10.8086 2.7919 8.95794 3.71284C7.22182 4.57679 6.12426 6.34893 6.12426 8.28813L6.12426 9.60942C6.12426 11.0332 5.76949 12.4345 5.09201 13.6867L4.86561 14.1052C3.95675 15.785 4.95039 17.863 6.82857 18.2101C10.1635 18.8265 13.5832 18.8265 16.9181 18.2101L17.0783 18.1805C18.9561 17.8334 20.0024 15.8084 19.199 14.076L18.9343 13.5053C18.3994 12.3518 18.1223 11.0956 18.1223 9.82416L18.1223 8.51353C18.1223 6.45566 16.9263 4.58543 15.0582 3.72221L14.8536 3.62766Z"
            fill="#BFBFBF"
          />
          <path
            id="vector (Stroke)_3"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.74719 14.4995C8.74719 14.0853 9.08298 13.7495 9.49719 13.7495L14.4972 13.7495C14.9114 13.7495 15.2472 14.0853 15.2472 14.4995C15.2472 14.9137 14.9114 15.2495 14.4972 15.2495L9.49719 15.2495C9.08298 15.2495 8.74719 14.9137 8.74719 14.4995Z"
            fill="#BFBFBF"
          />
        </g>
      </g>
    </svg>
  );
  
  
  
  const SettingsIcon = () => (
    <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.195 12.155c-.036-.255-.08-.512-.135-.765l1.938-1.507c.34-.263.418-.739.178-1.1l-1.954-3.386a.724.724 0 00-.726-.377l-2.426.196c-.295-.222-.61-.409-.947-.556l-.372-2.54A.724.724 0 0013.75 2h-3.5a.724.724 0 00-.725.648l-.372 2.54c-.337.147-.652.334-.947.556l-2.426-.196a.724.724 0 00-.726.377l-1.953 3.386a.724.724 0 00.178 1.1l1.938 1.507c-.055.253-.099.51-.135.765l-1.938 1.507c-.34.263-.418.739-.178 1.1l1.954 3.386c.154.267.415.437.726.377l2.426-.196c.294.222.609.409.947.556l.372 2.54c.05.343.343.601.695.601h3.5c.352 0 .645-.258.695-.601l.372-2.54c.337-.147.652-.334.947-.556l2.426.196c.311.026.572-.11.726-.377l1.954-3.386c.24-.36.162-.837-.178-1.1l-1.938-1.507zM12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16,16A7,7,0,1,0,9,9,7,7,0,0,0,16,16ZM16,4a5,5,0,1,1-5,5A5,5,0,0,1,16,4Z"/><path d="M17,18H15A11,11,0,0,0,4,29a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1A11,11,0,0,0,17,18ZM6.06,28A9,9,0,0,1,15,20h2a9,9,0,0,1,8.94,8Z" />
    </svg>
  );