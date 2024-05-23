import './Footer.scss'; // Import your custom styles for the footer
import React, { useRef ,useState} from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import playStoreIcon from '../../assets/Playstore_icon.png'; 
import appStoreIcon from '../../assets/App_store_icon.png'; 
import  AlertDialogSlide from '../../sub-components/Alertwindow/Popup';
import  CompanyFAQ from '../CompanyFAQ/CompanyFAQ';
import emailjs from 'emailjs-com';


export default function Footer() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const form = useRef();
    const [showFAQ, setShowFAQ] = useState(false);

    const constructionMessage = "This section is under construction. We will provide details soon.";
    const handleLinkClick = () => {
      setOpenDialog(true);
  };

  const handleCloseDialog = () => {
      setOpenDialog(false);
  };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        // EmailJS sendForm method
        emailjs.sendForm('service_nmoyi47', 'template_qa7a6rf', event.target, 'prncI_jPtqNaIhhhU')
        .then(
          () => {
            setIsSuccess(true);
                form.current.reset(); // Reset the form fields
                console.log('SUCCESS!');
                
                // Hide the success message after 3 seconds
                setTimeout(() => {
                    setIsSuccess(false);
                }, 3000);
          },
          (error) => {
            console.log('FAILED...', error.text);
          },
        );
    };

    const mapLink = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.5045085375023!2d73.1332210737419!3d19.260414546160078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be796881823811b%3A0xc9e1a4474c36940c!2sRanpise%20DigiTech%20Solutions%20Private%20Limited!5e0!3m2!1sen!2sin!4v1711347263461!5m2!1sen!2sin';

    return (
        <div className='footer__container'>
            <div className='company__logo'>
                <h2>EventifyConnect</h2>
            </div>
            <div className="wrapper_1">
                <div className="sub__wrapper_1">
                    <div className="links">
                        <div className="link__grp_1">
                            <p onClick={handleLinkClick}>Our Blog</p>
                            <p onClick={handleLinkClick}>Career</p>
                            <p><a href="#contact-form">Contact Us</a></p>
                            <p onClick={handleLinkClick}>Our Service</p>
                            <p onClick={() => setShowFAQ(true)}>FAQs</p>
                        </div>
                        <div className="link__grp_2">
                            <p>Privacy Policy</p>
                            <p>Registered Address</p>
                            <p>Cancellation Policy</p>
                            <p>Terms and Conditions</p>
                        </div>
                    </div>
                    <div className="icons">
                        <FacebookIcon className='icon' />
                        <InstagramIcon className='icon' />
                    </div>
                    <div className="app_icon_description"> For better experience, download the <br/>eventifyConnect app now</div>
                    <div className="app__download__icons">
                        <a href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE_NAME" >
                            <img src={playStoreIcon} alt="Download from Play Store" className="playstore"  />
                        </a>
                        <a href="https://apps.apple.com/YOUR_APP_STORE_LINK" >
                            <img  src={appStoreIcon} alt="Download from App Store" class="appstore"  />
                        </a>
                    </div>
                </div>
                <div className="sub__wrapper_middle">
                    <div id="map-container">
                        <iframe src={mapLink} 
                            width="370"
                            height="350"
                            style={{border:0}}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <div className="operating-hours">
                        <p> Open Hour 9.30 AM - 6.30 PM</p>
                    </div>
                </div>
                <div className="sub__wrapper_2" id="contact-form">
                    <div className="title">
                        Contact Us
                    </div>
                    <form  ref={form} onSubmit={handleSubmit}>
                        <div className="email">
                            <input type="text" placeholder='Name' name='user_name' required />
                            <input type="email" placeholder='Email address' name='user_email' required />
                            <input type="text" placeholder='Subject' name='subject' required />
                            <textarea name="message" cols="30" rows="5" placeholder="Message" required></textarea>
                        </div>
                        <button type="submit">Send</button>
                    </form>
                    {isSuccess && (
                        <div className="confirmation-message">
                            <p><strong>Thanks for connecting! We'll get back to you soon.</strong></p>
                        </div>
                    )}
                </div>
            </div>
            <div className="wrapper_2">
                <div className="line__separator"></div>
                <div className="copyright__info">
                    <p>Copyright &copy;2024 All rights reserved</p>
                    <p>Made by Ranpise DigiTech Solutions</p>
                </div>
            </div>
            <AlertDialogSlide open={openDialog} handleClose={handleCloseDialog} message={constructionMessage} />
            <CompanyFAQ isOpen={showFAQ} onClose={() => setShowFAQ(false)}  />
        </div>
    );
}
