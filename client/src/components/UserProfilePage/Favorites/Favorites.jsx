import { useState, useEffect } from "react";
import "./Favorites.scss";
import axios from "axios";
import { motion } from "framer-motion";
import { PackagesCard } from "../../../sub-components";
import { format } from "date-fns";

const Favorites = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const formattedDate = format(today, "yyyy-MM-dd");
      try {
        const hallMasterResponse = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/eventify_server/hallBookingMaster/getHallsAvailabilityStatus/`,
          {
            params: {
              selectedCity: "Mangalore",
              selectedDate: formattedDate,
              eventId: "",
              filter: "Available",
            },
          }
        );
        setData(hallMasterResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const renderCards = () => {
    return data.map((card, index) => <PackagesCard card={card} key={index} />);
  };

  return (
    <>
      <div className="userFavorites__container">
        <motion.div className="favorites__wrapper">{renderCards()}</motion.div>
      </div>
    </>
  );
};

export default Favorites;
