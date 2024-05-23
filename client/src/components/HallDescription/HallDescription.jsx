/* eslint-disable no-unused-vars */
// Import necessary modules and components
import "./HallDescription.scss"; // Import SCSS file

import ReactStars from "react-stars";
import Carousel from "react-multi-carousel";
import PropTypes from "prop-types";

import { FaMapMarkerAlt } from "react-icons/fa";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { FaPenNib } from "react-icons/fa6";

// Define Slider component
const Slider = ({ hallData }) => {

  // const [showPopup, setShowPopup] = useState(false);
  // const [bookingDetails, setBookingDetails] = useState({
  //   // Populate with initial booking details or fetch them as required
  // });

  // const handleBooking = () => {
  //   setShowPopup(true); // This should set showPopup state to true when "Book Now" button is clicked
  // };

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

  // Function to handle rating change
  const ratingChanged = (newRating) => {
    console.log(newRating);
    // You can do something with the newRating here if needed
  };

  // Render component JSX
  return (
    <>
      <div className="hallDescription__container">
        <div className="slider__wrapper">
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
            {hallData && hallData.hallImages && hallData.hallImages.map((image, index) => (
              <img src={image} key={index} alt="Img" />
            ))}
          </Carousel>
        </div>
        <div className="quickinfo">
          <h2>{hallData.hallName}</h2>
          <h3 className="location">
            <a href="https://www.google.com/maps/dir//TMA+Pai+Convention+Centre,+MG+Rd,+Kodailbail,+Mangaluru,+Karnataka+575003/@12.8803793,74.7986391,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3ba35a44b7805283:0xbb55b8b40db48da!2m2!1d74.8398387!2d12.8803825?entry=ttu">
              <FaMapMarkerAlt /> {hallData.hallTaluk}, {hallData.hallCity}, {hallData.hallState}
            </a>
          </h3>
          <div className="stars-container">
            <ReactStars
              count={5}
              value={4} // Initially set to 4 stars
              onChange={ratingChanged}
              size={40}
              color2={"#ffd700"}
              edit={false}
              className="stars-icon"
            />
          </div>
          <div className="menu__wrapper">
            <div className="photosMenu menuOption">
              <PhotoLibraryIcon className="icon" />
              <p>10 Photos</p>
            </div>
            <div className="verticalLine"></div>
            <div className="favouriteMenu menuOption">
              <FavoriteBorderOutlinedIcon className="icon" />
              <p>Shortlist</p>
            </div>
            <div className="verticalLine"></div>
            <div className="reviewMenu menuOption">
              <FaPenNib className="icon" />
              <p>Write a Review</p>
            </div>
            <div className="verticalLine"></div>
            <div className="shareMenu menuOption">
              <ShareOutlinedIcon className="icon" />
              <p>Share</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Slider.propTypes = {
  hallData: PropTypes.object.isRequired,
};

export default Slider; // Export Slider component
