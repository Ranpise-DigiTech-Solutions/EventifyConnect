import React, { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import {
  Captions,
  Download,
  Fullscreen,
  Thumbnails,
  Zoom,
} from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import './DetailedInfo.scss';
import { slides } from './data';
import ReactStars from 'react-stars';
import Button from "@mui/material/Button";
import BookingPage from '../BookingPage/BookingPage'; // Import your BookingPage component

interface ImagesProps {
  data: {
    src: string;
    title: string;
    description: string;
  }[];
  onClick: (index: number) => void;
}

const ratingChanged = (newRating) => {
  console.log(newRating);
};

const Images: React.FC<ImagesProps> = (props) => {
  const { data, onClick } = props;
  const [loadMoreClicked, setLoadMoreClicked] = useState(false);

  const handleClickImage = (index: number) => {
    onClick(index);
  };

  return (
    <div className='images-container'>
      {data.slice(0, loadMoreClicked ? data.length : 6).map((slide, index) => (
        <div
          onClick={() => handleClickImage(index)}
          key={index}
          className='image'
        >
          <img src={slide.src} alt={slide.description} />
          {index === 5 && !loadMoreClicked && (
            <div className="load-more-watermark" onClick={() => setLoadMoreClicked(true)}>LOAD MORE</div>
          )}
        </div>
      ))}
    </div>
  );
};

const DetailedInfo: React.FC = () => {
  const [index, setIndex] = useState(-1);
  const [showBookingPage, setShowBookingPage] = useState(false);
  const [blurContent, setBlurContent] = useState(false);

  const handleBookNowClick = () => {
    setShowBookingPage(true);
    setBlurContent(true); // Set blurContent to true when button is clicked
  };

  return (
    <section className={`detailedInfo__container ${blurContent ? 'blur-content' : ''}`}>
      <div className={`imageBox ${showBookingPage ? 'blur-background' : ''}`}>
        <div className='coverphoto'>
          <img 
            src={slides[0].src} 
            alt={slides[0].description} 
          />
          <h2>TMA Pai International</h2>
          <h3 className="location">
            <a href="https://www.google.com/maps/dir//TMA+Pai+Convention+Centre,+MG+Rd,+Kodailbail,+Mangaluru,+Karnataka+575003/@12.8803793,74.7986391,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3ba35a44b7805283:0xbb55b8b40db48da!2m2!1d74.8398387!2d12.8803825?entry=ttu">
              <FaMapMarkerAlt /> Kodialbail, Mangaluru
            </a>
          </h3>
          <ReactStars
            count={5}
            value={4} // Initially set to 4 stars
            onChange={ratingChanged}
            size={50}
            color2={'#ffd700'}
            edit={false}
          />
          <Button variant="contained" className="button" onClick={handleBookNowClick}>
            Book Now
          </Button>
        </div>
        <div className='images-container'>
          <Images data={slides} onClick={(currentIndex) => setIndex(currentIndex)} />
        </div>

        <Lightbox
          plugins={[Captions, Download, Fullscreen, Zoom, Thumbnails]}
          captions={{
            showToggle: true,
            descriptionTextAlign: 'end',
          }}
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={slides} // Pass slides data to Lightbox
        />
      </div>
      {showBookingPage && <BookingPage />} {/* Render BookingPage component if showBookingPage is true */}
      <hr style={{ margin: 'auto',width:'90%' }} />
    </section>
  );
};

export default DetailedInfo;
