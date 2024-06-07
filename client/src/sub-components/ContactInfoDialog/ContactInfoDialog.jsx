import "./ContactInfoDialog.scss";
import PropTypes from "prop-types";

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from '@mui/icons-material/Phone';

const ContactInfoDialog = ({ 
    profilePic,
    name,
    designation,
    personalContact,
    officeContact,
    emailId
}) => {
  return (
    <div className="contactInfoDialog__container">
      <h1 className="title">Contact Details</h1>
      <div className="profilePic">
        <img alt="" src={profilePic} className="avatar" />
      </div>
      <div className="wrapper">
        <div className="inputField__wrapper">
          <div className="title">Contact Name</div>
          <div className="input__wrapper disabledInput__wrapper">
            <PersonIcon className="icon" />
            <div className="divider"></div>
            <input
              type="text"
              value={name}
              className="input"
              disabled
              readOnly
            />
          </div>
        </div>
        <div className="inputField__wrapper">
          <div className="title">Designation</div>
          <div className="input__wrapper disabledInput__wrapper">
            <BusinessIcon className="icon" />
            <div className="divider"></div>
            <input
              type="text"
              value={designation}
              className="input"
              disabled
              readOnly
            />
          </div>
        </div>
        <div className="inputField__wrapper">
          <div className="title">Office Contact</div>
          <div className="input__wrapper disabledInput__wrapper">
            <PhoneIcon className="icon" />
            <div className="divider"></div>
            <input
              type="text"
              value={officeContact}
              className="input"
              disabled
              readOnly
            />
          </div>
        </div>
        <div className="inputField__wrapper">
          <div className="title">Personal Contact</div>
          <div className="input__wrapper disabledInput__wrapper">
            <PhoneIcon className="icon" />
            <div className="divider"></div>
            <input
              type="text"
              value={personalContact}
              className="input"
              disabled
              readOnly
            />
          </div>
        </div>
        <div className="inputField__wrapper">
          <div className="title">Email Id</div>
          <div className="input__wrapper disabledInput__wrapper">
            <EmailIcon className="icon" />
            <div className="divider"></div>
            <input
              type="text"
              value={emailId}
              className="input"
              disabled
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ContactInfoDialog.propTypes = {
  profilePic: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  designation: PropTypes.string.isRequired,
  personalContact: PropTypes.string.isRequired,
  officeContact: PropTypes.string.isRequired,
  emailId: PropTypes.string.isRequired,
};

export default ContactInfoDialog;
