import { useState } from 'react';
import './AboutUs.scss';
import { Images } from '../../constants';

import GppGoodIcon from '@mui/icons-material/GppGood';
import CancelIcon from '@mui/icons-material/Cancel';
import CampaignIcon from '@mui/icons-material/Campaign';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function AboutUs() {
  const [activeButton, setActiveButton] = useState(null);

  const handleToggleClass = (btnName) => {
    setActiveButton(btnName === activeButton ? null : btnName);
  };

  return (
    <div className='aboutus__container'>
      <div className='aboutus__wrapper'>
        <div className="sub__wrapper_1">
          <img src={Images.wedding4} alt="" />
        </div>
        <div className="sub__wrapper_2">
          <h3 className='sub_title'>our value</h3>
          <h2 className='title'>value we give you</h2>
          <p className='description'>Experience seamless event planning with us! As part of Ranpise DigiTech, our platform offers a wide array of event halls and services worldwide. Navigate effortlessly through venues and vendors, ensuring every detail meets your requirements. From selecting venues based on location, rating, and capacity to hassle-free bookings, we simplify the process. Engage with our modern chatbot for instant assistance and explore vendors with ease. Elevate your event planning journey with us today!</p>
          <div className="wrapper">
            <div className={`content ${activeButton === 'btn_1' ? 'open' : 'closed'}`}>
              <div className="header">
                <GppGoodIcon className='icon'/>
                <h4>Seamless User Experience</h4>
                <button onClick={() => handleToggleClass('btn_1')}>
                  <ArrowDropDownIcon className='icon pointy'/>
                </button>
              </div>
              <p>Immerse yourself in an interface crafted for ease and elegance, where every click feels like a step closer to your dream event.</p>
            </div>
            <div className={`content ${activeButton === 'btn_2' ? 'open' : 'closed'}`}>
              <div className="header">
                <CancelIcon className='icon'/>
                <h4>Hassle Free Bookings</h4>
                <button onClick={() => handleToggleClass('btn_2')}>
                  <ArrowDropDownIcon className='icon pointy'/>
                </button>
              </div>
              <p>Navigate effortlessly through our platform, where simplicity meets efficiency, making your booking experience a stress-free affair.</p>
            </div>
            <div className={`content ${activeButton === 'btn_3' ? 'open' : 'closed'}`}>
              <div className="header">
                <CampaignIcon className='icon'/>
                <h4>Clear communication on event details</h4>
                <button onClick={() => handleToggleClass('btn_3')}>
                  <ArrowDropDownIcon className='icon pointy'/>
                </button>
              </div>
              <p>Experience transparent communication at its finest, ensuring every detail of your event is conveyed with clarity and precision, leaving no room for confusion or uncertainty.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
