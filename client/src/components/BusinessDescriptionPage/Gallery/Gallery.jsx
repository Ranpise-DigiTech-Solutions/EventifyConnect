import './Gallery.scss';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Photo from '@mui/icons-material/Photo';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/system';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Captions, Fullscreen, Thumbnails, Zoom } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { slides as PhotoSlides } from './data';
import { slides as AlbumSlides } from './album';
import { videos } from './video'; // Import videos array from video.ts

export default function Gallery() {
  const [value, setValue] = React.useState(0);
  const [index, setIndex] = React.useState(-1);
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 6;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickImage = (currentIndex) => {
    setIndex(currentIndex);
  };

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };

  const renderImages = (slides) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return slides.slice(startIndex, endIndex).map((slide, idx) => (
      <div
        onClick={() => handleClickImage(startIndex + idx)}
        key={startIndex + idx}
        className='image'
      >
        <img src={slide.src} alt={slide.description} />
      </div>
    ));
  };

  const renderVideos = () => {
    return videos.map((video, idx) => (
      <div
        onClick={() => handleClickImage(idx)} // Assuming you want to open video in lightbox
        key={idx}
        className='video'
      >
        {/* Render your video component here */}
        <video controls>
          <source src={video.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    ));
  };

  return (
    <div className="gallery__container">
      <div className='gallery'>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon label tabs example"
          TabIndicatorProps={{
            style: {
              display: 'none',
            },
          }}
          sx={{
            '.MuiTabs-flexContainer': {
              justifyContent: 'flex-end',
            },
          }}
        >
          <Tab
            icon={<Photo style={{ color: value === 0 ? 'white' : '' }} />}
            label="PHOTOS"
            selected={value === 0}
            style={{ color: value === 0 ? 'white' : '' }}
          />
          <Tab
            icon={<PhotoLibraryIcon style={{ color: value === 1 ? 'white' : '' }} />}
            label="ALBUMS"
            selected={value === 1}
            style={{ color: value === 1 ? 'white' : '' }}
          />
          <Tab
            icon={<YouTubeIcon style={{ color: value === 2 ? 'white' : '' }} />}
            label="VIDEOS"
            selected={value === 2}
            style={{ color: value === 2 ? 'white' : '' }}
          />
        </Tabs>
        <div className='Photos'>
          {value === 0 ? (
            <div className={`imageBox ${value === 0 ? '' : 'blur-background'}`}>
              <div className='images-container'>
                {renderImages(PhotoSlides)}
              </div>
              <Lightbox
                plugins={[Captions, Fullscreen, Zoom, Thumbnails]}
                captions={{
                  showToggle: true,
                  descriptionTextAlign: 'end',
                }}
                index={index}
                open={index >= 0}
                close={() => setIndex(-1)}
                slides={PhotoSlides} // Pass slides data to Lightbox
              />
            </div>
          ) : null}
          {value === 1 ? (
            <div className={`imageBox ${value === 1 ? '' : 'blur-background'}`}>
              <div className='images-container'>
                {renderImages(AlbumSlides)} {/* Render images from Album component */}
              </div>
              <Lightbox
                plugins={[Captions, Fullscreen, Zoom, Thumbnails]}
                captions={{
                  showToggle: true,
                  descriptionTextAlign: 'end',
                }}
                index={index}
                open={index >= 0}
                close={() => setIndex(-1)}
                slides={AlbumSlides} // Pass slides data from Album component to Lightbox
              />
            </div>
          ) : null}
          {value === 2 ? (
            <div className={`imageBox ${value === 2 ? '' : 'blur-background'}`}>
              <div className='videos-container'>
                {renderVideos()}
              </div>
            </div>
          ) : null}
          <Box display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(PhotoSlides.length / itemsPerPage)}
              page={page}
              onChange={handlePaginationChange}
            />
          </Box>
        </div>
      </div>
    </div>
  );
} 