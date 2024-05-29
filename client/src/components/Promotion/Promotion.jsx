/* eslint-disable no-unused-vars */
import "./Promotion.scss";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "react-spring";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "@mui/material/Button";

import { Images } from "../../constants";
import NavigationDots from "../NavigationDots";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { VirtualizedSelect } from "../../sub-components";
import { searchBoxFilterActions } from "../../states/SearchBoxFilter";

function Number({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });
  return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>;
}

Number.propTypes = {
  n: PropTypes.number.isRequired,
};

const Promotion = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const searchBoxFilterStore = useSelector((state) => state.searchBoxFilter);
  const data = useSelector((state) => state.data);

  const customStyles = {
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
      padding: 10,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999999', // Change the placeholder color here
    }),
  };

  const imageList = [
    Images.wedding0,
    Images.wedding1,
    Images.wedding2,
    Images.wedding3,
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [imageList.length]);

  const handleSearchClick = (e) => {
    // dispatch(searchBoxFilterStore("cityName", cityName));
  };

  return (
    <div className="main__container promotion__container">
      <div className="app__container">
        <div className="white__gradient"></div>
        <div className="sub__wrapper_1">
          <div className="title__wrapper">
            <motion.div
              whileInView={{ scale: [0, 1] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              alt="profile_circle"
              className="overlay_circle"
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="heading_title"
            >
              Effortless <br /> Event Planning at <br /> Fingertips
            </motion.h2>
          </div>
          <div className="description__wrapper">
            <p>
              Discover your dream wedding with our enchanting website.
              <br /> Plan every detail and share the magic with loved ones.
            </p>
          </div>
          <div className="search__wrapper">
            <a href="#" className="location_icon">
              <LocationOnIcon />
            </a>
            <div className="input">
              <VirtualizedSelect
                customStyles={customStyles}
                options={
                  Array.isArray(data.citiesOfCountry.data)
                    ? data.citiesOfCountry.data.map((city) => ({
                        value: city,
                        label: city,
                      }))
                    : null
                }
                value={
                  searchBoxFilterStore.cityName
                    ? {
                        label: searchBoxFilterStore.cityName,
                        value: searchBoxFilterStore.cityName,
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  dispatch(
                    searchBoxFilterActions("cityName", selectedOption.value)
                  ); // Update Details in 'SearchBoxFilter' Redux Store
                }}
                placeholder="Select or type a city..."
                dropDownIndicator={false}
              />
            </div>
            <Button
              variant="contained"
              className="button"
              onClick={handleSearchClick}
            >
              <a href="#searchBar">Search</a>
            </Button>
          </div>
          <div className="views__wrapper">
            <div className="item">
              <div className="count">
                <Number n={1000} />
                &nbsp; <span>+</span>
              </div>
              <p className="desc">Hall Vendors</p>
            </div>
            <div className="item">
              <div className="count">
                <Number n={100} />
                &nbsp; <span>+</span>
              </div>
              <p className="desc">Happy Customer</p>
            </div>
            <div className="item">
              <div className="count">
                <Number n={10} />
                &nbsp; <span>+</span>
              </div>
              <p className="desc">Bookings</p>
            </div>
          </div>
        </div>
        <div className="sub__wrapper_2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              className="sub__wrapper_2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={imageList[currentImageIndex]} alt="" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="navigation__dots">
        <NavigationDots
          active={currentImageIndex}
          imageList={imageList}
          className="app__navigation-dot"
        />
      </div>
    </div>
  );
};

// export default AppWrap(Promotion, "app__promotion", "");
export default Promotion;
