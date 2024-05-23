import React from 'react';
import './CompanyFAQ.scss'; // Import your FAQPopup styles
import CloseIcon from '@mui/icons-material/Close';
import { FaTimes } from 'react-icons/fa';
// Assuming you have an FAQComponent that holds your FAQ content
import FAQ from '../FAQ/Faq';

const FAQquestions = [
  { question: 'What all Services EventifyConnect provides?',
  answer: `* EventifyConnect helps you to choose halls based on your event date in a faster and more effective manner.
  * It saves a lot of time which might involve browsing through multiple halls within a particular city of your choice.
  * The site not only filters the halls that are available on your chosen date but also helps you connect with various other vendors
   that are usually involved for various occasions such as: Photographer, Flower decorator, Mandap decorator, Makeup artist, Event planners`, 
},
  { question: 'When and where can we contact you?', answer: 'You can connect to EventifyConnect any time via the website . In case of post working hours communication, we will connect via mail.' },
  { question: 'Do you help conducting event?', answer: 'Yes we can help you to plan an event via our specialised event planning vendors.  ' },
  { question: 'How can EventifyConnect help you?', answer: `EventifyConnect help you in many way
  1. It saves time browing through n number of hall for your fixed date event. 
  2. You get to see the filtered event hall for a particular day and time
  3. You get all the verified listed hall and the allied vendors at your service
  4. The booking process is easy to navigate and use
  5. You get mutilple Vendors in one click along with the hall of your choice ` },
  { question: 'How to book hall along with any allied service provider?', answer: `Connect to EventifyConnect filetre hall based on the city and your event date. 
  You can choose from the halls having slot available for booking. Once hall is booked it need to be 
  confirmed by the hall owner. Besides hall you can select the other service providers who can make your event 
  memorable eg : Photographer, Flower decorator,Mandap decorator, Makeup artist,Event planners.  ` },
  { question: 'What are the benefits of booking using EventifyConnect?', answer: `EventifyConnect help you 
  1. Book hall faster with precision 
  2. User friendly easy to navigate through latest interface
  3. Get verified halls with various vendors for making your event memorable. ` },
  { question: 'Do you confirm on the final booking?', answer: `Final Confirmation on any booking is under sole discretion of the hall owner and the vendors. This site   
  EventifyConnect connects all the vendors and the hall together and only can confirm your booking via the owners ` },
];

const CompanyFAQ = ({ isOpen, onClose }) => {
  const [animation, setAnimation] = React.useState(isOpen ? 'slide-up' : '');

  React.useEffect(() => {
    setAnimation(isOpen ? 'slide-up' : '');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`faqPopup__container ${animation}`}>
      <div className="faqPopup-container">
        <header className="faqPopup-header">
          <FaTimes className="close-icon" onClick={onClose} />
          <h2>FAQs</h2>
        </header>
        <div className="faqPopup-content">
          
          <FAQ questions={FAQquestions} />
        </div>
      </div>
    </div>
  );
};

export default CompanyFAQ;
