import { useState, useEffect } from 'react';
import './Favorites.scss'
import axios from 'axios';
import { motion } from 'framer-motion';
import { PackagesCard } from '../../sub-components';
import UserProfileLeftPanel from '../UserProfileLeftPanel/UserProfileLeftPanel';

const Favorites = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleSetActiveComponent = (component) => {
      setActiveComponent(component);
  };
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hallMasterResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/eventify_server/hallBookingMaster/getHallsAvailabilityStatus/`);
        setData(hallMasterResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const renderCards = () => {
    return data.map((card, index) => (
        <PackagesCard card={card} key={index}/>
    ));
  };

  return (
    <><div className="left-panel-container">
    <UserProfileLeftPanel setActiveComponent={handleSetActiveComponent} />
  </div>
    <div className="userFavorites__container">
        <h1><b>Your favorites</b></h1>
      <motion.div className="favorites__wrapper">
        {renderCards()}
      </motion.div>
    </div>
    </>
  );
};

export default Favorites;
