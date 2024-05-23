import { Component } from 'react';
import './VenueSummary.scss'; // Import SCSS file
import CapacityIcon from '@mui/icons-material/People';
import ParkingSlotsIcon from '@mui/icons-material/LocalParking';
import RoomsAvailableIcon from '@mui/icons-material/Hotel';
import FoodTypeIcon from '@mui/icons-material/Fastfood';
import OperatingTimeIcon from '@mui/icons-material/Schedule';
import AlcoholIcon from '@mui/icons-material/WineBar';
import { FiberManualRecord } from '@mui/icons-material';

class VenueSummary extends Component {
  render() {
    return (
      <div className="venue-summary">
        <div className="venue-details-container">
          {/* Capacity */}
          <div className="venue-details">
            <CapacityIcon />
            <p><strong>Capacity</strong><br/> 1000</p>
          </div>
          {/* Parking Slots */}
          <div className="venue-details">
            <ParkingSlotsIcon />
            <p><strong>Parking Slots</strong><br/> 300</p>
          </div>
          {/* Rooms Available */}
          <div className="venue-details">
            <RoomsAvailableIcon />
            <p><strong>Rooms Available</strong> <br/>30</p>
          </div>
          {/* Food Type */}
          <div className="venue-details">
            <FoodTypeIcon />
            <p><strong>Food Type</strong><br/> 
              <FiberManualRecord style={{ color: 'green' }} />
              Veg<br />
              <FiberManualRecord style={{ color: 'red' }} />
              Non-Veg
            </p>
          </div>
          {/* Operating Time */}
          <div className="venue-details">
            <OperatingTimeIcon />
            <p><strong>Operating Time</strong> <br/>Yes</p>
          </div>
          {/* Alcohol */}
          <div className="venue-details">
            <AlcoholIcon />
            <p><strong>Alcohol</strong><br/> Yes</p>
          </div>
        </div>
      </div>
    );
  }
}

export default VenueSummary;
