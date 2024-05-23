/* eslint-disable no-unused-vars */
import "./Promotion.scss";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "react-spring";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "@mui/material/Button";

import { Images } from "../../constants";
import NavigationDots from "../NavigationDots";
import { AppWrap } from "../../wrapper";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";

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
  n: PropTypes.number.isRequired
}

const Promotion = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cityName, setCityName] = useState("");
  const dispatch = useDispatch();
  const searchBoxFilterStore = useSelector((state) => state.searchBoxFilter);

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
  }

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
              Discover <br /> Most Suitable <br /> Partner
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
            <input
              type="text"
              id="cityName"
              name="cityName"
              placeholder="Enter the city name"
              onChange={(e) => setCityName(e.target.value)}
            />
            <Button variant="contained" className="button" onClick={handleSearchClick}>
              <a href="#searchBar">
                Search
              </a>
            </Button>
          </div>
          <div className="views__wrapper">
            <div className="item">
              <div className="count">
                <Number n={9000} />
                &nbsp; <span>+</span>
              </div>
              <p className="desc">Premium Product</p>
            </div>
            <div className="item">
              <div className="count">
                <Number n={2000} />
                &nbsp; <span>+</span>
              </div>
              <p className="desc">Happy Customer</p>
            </div>
            <div className="item">
              <div className="count">
                <Number n={28} />
                &nbsp; <span>+</span>
              </div>
              <p className="desc">Awards Winning</p>
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
          className='app__navigation-dot'
        />
      </div>
    </div>
  );
};

// export default AppWrap(Promotion, "app__promotion", "");
export default Promotion;