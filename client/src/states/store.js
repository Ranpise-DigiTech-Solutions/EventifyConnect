import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './RootReducer';
// import thunk from 'redux-thunk';

const store = configureStore({
  reducer: rootReducer,
});

export default store;