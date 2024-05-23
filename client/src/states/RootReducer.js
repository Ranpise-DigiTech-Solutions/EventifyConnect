import { combineReducers } from 'redux';
import { searchBoxFilterReducer } from './SearchBoxFilter';
import { userInfoReducer } from './UserInfo';
import { dataReducer } from './Data';
import { bookingInfoReducer } from './BookingInfo';

const rootReducer = combineReducers({
  searchBoxFilter: searchBoxFilterReducer,
  userInfo: userInfoReducer,
  data: dataReducer,
  bookingInfo: bookingInfoReducer
});

export default rootReducer;