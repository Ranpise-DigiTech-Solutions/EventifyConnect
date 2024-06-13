import { 
  SET_DATA,
  SET_USER_AUTH_STATE_CHANGE_FLAG,
  SET_USER_DATA_UPDATE_FLAG
} from "./actions";

const initialState = {
    userLocation: "",
    userDetails: {}, // {}
    userAuthStateChangeFlag: false,
    userDataUpdateFlag: false
  };
  
export default function userInfoReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATA:
      return { ...state, [action.payload.key]: action.payload.value };
    case SET_USER_AUTH_STATE_CHANGE_FLAG: 
      return { ...state, userAuthStateChangeFlag: !state.userAuthStateChangeFlag }
    case SET_USER_DATA_UPDATE_FLAG:
      return { ...state, userDataUpdateFlag: !state.userDataUpdateFlag }
    default:
      return state;
  }
}