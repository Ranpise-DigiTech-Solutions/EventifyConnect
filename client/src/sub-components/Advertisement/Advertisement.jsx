import './Advertisement.scss';
import { Images } from '../../constants';
import PropTypes from 'prop-types';

const Advertisement = ({ theme }) => {
  return (
    <div 
        className={`advertisement__container ${theme === 'dark' ? "dark-bg" : "light-bg"}`}    
    >
      <img src={Images.advertisement01} alt=""/>
    </div>
  )
}

Advertisement.propTypes = {
    theme: PropTypes.string.isRequired,
}

export default Advertisement
