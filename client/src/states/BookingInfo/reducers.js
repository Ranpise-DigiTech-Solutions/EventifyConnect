import { SET_DATA } from "./actions";

const initialState = {  
    bookingStartDate: "",  // yyyy-mm-dd
    bookingStartDay: "", // Monday, Tuesday  etc..
    bookingEndDate: "", // yyyy-mm-dd
    bookingEndDay: "", // Monday, Tuesday  etc..
    startTime: "",  // HH:MM
    endTime: "",  // HH:MM
    bookingDuration: "", // HH:MM
    errorInfo: "",  // to display error messages
    comments: "", // to display success messages
  };
  
export default function bookingInfoReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATA:
      return { ...state, [action.payload.key]: action.payload.value };
    default:
      return state;
  }
}