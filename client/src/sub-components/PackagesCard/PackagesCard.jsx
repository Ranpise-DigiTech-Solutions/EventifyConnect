import { useState, useEffect } from 'react';
import './PackagesCard.scss';

import Tooltip from '@mui/material/Tooltip';
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HotelIcon from '@mui/icons-material/Hotel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { FaCrown } from "react-icons/fa";
import PropTypes from "prop-types";
import Carousel from "react-multi-carousel";
import { motion } from "framer-motion";
import NavigationDots from "../../components/NavigationDots";
export default function PackagesCard({ card }) {
  const [animateCalanderIcon, setAnimateCalenderIcon] = useState({
    x: 0,
    opacity: 0,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false); // State to track if the package is a favorite

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % card.hallImages.length
      );
    }, 4000);

    return () => clearInterval(intervalId);
  }, [card.hallImages]);

  useEffect(() => {
    // Check if the package is already marked as favorite in local storage on component mount
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(storedFavorites.includes(card._id));
  }, [card._id]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite); // Toggle the favorite state
    updateLocalStorage(!isFavorite); // Update local storage
  };

  const updateLocalStorage = (addFavorite) => {
    // Update local storage with the current list of favorite items
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (addFavorite) {
      favorites.push(card._id);
    } else {
      favorites = favorites.filter((id) => id !== card._id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };


  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    
      <div className="packagesCardBox__wrapper">
         {/* Favorite heart icon */}
        <div className="favorite-icon-container" onClick={handleFavoriteClick}>
          <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"} placement="top">
            <FavoriteIcon className={isFavorite ? "favorite-icon active" : "favorite-icon"} />
          </Tooltip>
        </div>
        <div className="image__wrapper">
          <Carousel
            responsive={responsive}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            swipeable={true}
            draggable={false}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={4000}
            keyBoardControl={false}
            slidesToSlide={1}
            arrows={true}
            containerClass="carousel-container"
          >
            {card.hallImages.map((image, index) => (
              <img src={image} key={index} alt="Img" />
            ))}
          </Carousel>
          <div className="image__contents">
            <div className="header">
              <div className="wrapper">
                <FaCrown className="icon" />
                <p>Hand Picked</p>
              </div>
            </div>
            <div className="footer">
              <div className="calendar-icon">
                <button
                  onMouseEnter={() =>
                    setAnimateCalenderIcon({ x: 10, opacity: 1 })
                  }
                  onMouseLeave={() =>
                    setAnimateCalenderIcon({ x: 0, opacity: 0 })
                  }
                >
                  <CalendarMonthOutlinedIcon className="icon" />
                </button>
                <motion.span
                  animate={animateCalanderIcon}
                  transition={{ duration: 0.5, delayChildren: 0.5 }}
                  className="text"
                >
                  Check time slots
                </motion.span>
              </div>
              <NavigationDots
                active={currentImageIndex}
                imageList={card.hallImages}
                className="packageCard__navigation-dot"
              />
              <Tooltip title={card.hallDescription} placement="top" arrow>
                <InfoOutlinedIcon className="icon" />
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="contents__wrapper">
          <div className="wrapper wrapper_1">
            <h2>{card.hallName}</h2>
            <div className="ratings">
              <div className="rating">
                <p>4.9</p>
                <StarIcon className="starIcon" />
              </div>
              <div className="reviews">
                (2 <span>&nbsp;Reviews</span>)
              </div>
            </div>
          </div>
          <div className="quickinfo">
            <div className="info">
              <h6>VEG</h6>
              <div className="price">
                <CurrencyRupeeIcon className="icon" />
                <p>340</p>
              </div>
            </div>
            <div className="info">
              <h6>NON-VEG</h6>
              <div className="price">
                <CurrencyRupeeIcon className="icon" />
                <p>700</p>
              </div>
            </div>
            <div className="info other-info">
              <PeopleAltIcon className="icon" />
              <p>7000</p>
            </div>
            <div className="info other-info">
              <HotelIcon className="icon" />
              <p>50</p>
            </div>
          </div>
          <div className="tag__list">
            <div className="tag">
              <p>420-700 pax</p>
            </div>
            <div className="tag">
              <p>Indoor</p>
            </div>
            <div className="link">
              <p>+3 more</p>
            </div>
          </div>
          <div className="availability__statustag">
            <div
              className={`availability-tag ${
                card.availability === "LIMITED AVAILABILITY"
                  ? "LIMITED_AVAILABILITY"
                  : card.availability
              }`}
            >
              <span className="left-cut"></span>
              <div className="status">
                {card.availability}
                <Tooltip
                  title="This Hall is not available on this date. Kindly Change the Date or Choose a different hall"
                  placement="top"
                  arrow
                >
                  <AccessAlarmIcon className="icon" />
                </Tooltip>
              </div>
              <span className="right-cut"></span>
            </div>
          </div>
          <div className="wrapper wrapper_2">
            <div className="sub__wrapper">
              <LocationOnIcon className="icon" />
              <p>{card.hallCity}</p>
            </div>
            <div className="sub__wrapper">
              <AccountBalanceIcon className="icon" />
              <p>Banquet Hall</p>
            </div>
          </div>
        </div>
      </div>
    // </Link>
  );
}

PackagesCard.propTypes = {
  card: PropTypes.object.isRequired,
};
