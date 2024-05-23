// action types
export const FETCH_COUNTRIES_REQUEST = 'FETCH_COUNTRIES_REQUEST';
export const FETCH_COUNTRIES_SUCCESS = 'FETCH_COUNTRIES_SUCCESS';
export const FETCH_COUNTRIES_FAILURE = 'FETCH_COUNTRIES_FAILURE';

export const FETCH_STATES_REQUEST = 'FETCH_STATES_REQUEST';
export const FETCH_STATES_SUCCESS = 'FETCH_STATES_SUCCESS';
export const FETCH_STATES_FAILURE = 'FETCH_STATES_FAILURE';

export const FETCH_CITIES_OF_COUNTRY_REQUEST = 'FETCH_CITIES_OF_COUNTRY_REQUEST';
export const FETCH_CITIES_OF_COUNTRY_SUCCESS = 'FETCH_CITIES_OF_COUNTRY_SUCCESS';
export const FETCH_CITIES_OF_COUNTRY_FAILURE = 'FETCH_CITIES_OF_COUNTRY_FAILURE';

export const FETCH_CITIES_OF_STATE_REQUEST = 'FETCH_CITIES_OF_STATE_REQUEST';
export const FETCH_CITIES_OF_STATE_SUCCESS = 'FETCH_CITIES_OF_STATE_SUCCESS';
export const FETCH_CITIES_OF_STATE_FAILURE = 'FETCH_CITIES_OF_STATE_FAILURE';

export const FETCH_EVENT_TYPES_REQUEST = 'FETCH_EVENT_TYPES_REQUEST';
export const FETCH_EVENT_TYPES_SUCCESS = 'FETCH_EVENT_TYPES_SUCCESS';
export const FETCH_EVENT_TYPES_FAILURE = 'FETCH_EVENT_TYPES_FAILURE';

export const FETCH_VENDOR_TYPES_REQUEST = 'FETCH_VENDOR_TYPES_REQUEST';
export const FETCH_VENDOR_TYPES_SUCCESS = 'FETCH_VENDOR_TYPES_SUCCESS';
export const FETCH_VENDOR_TYPES_FAILURE = 'FETCH_VENDOR_TYPES_FAILURE';

// action creators
// COUNTRIES
const fetchCountriesRequest = () => ({
  type: FETCH_COUNTRIES_REQUEST
});

const fetchCountriesSuccess = (data) => ({
  type: FETCH_COUNTRIES_SUCCESS,
  payload: data
});

const fetchCountriesFailure = (error) => ({
  type: FETCH_COUNTRIES_FAILURE,
  payload: error
});

// STATES
const fetchStatesRequest = () => ({
  type: FETCH_STATES_REQUEST
});

const fetchStatesSuccess = (data) => ({
  type: FETCH_STATES_SUCCESS,
  payload: data
});

const fetchStatesFailure = (error) => ({
  type: FETCH_STATES_FAILURE,
  payload: error
});

// CITIES OF COUNTRY
const fetchCitiesOfCountryRequest = () => ({
  type: FETCH_CITIES_OF_COUNTRY_REQUEST
});

const fetchCitiesOfCountrySuccess = (data) => ({
  type: FETCH_CITIES_OF_COUNTRY_SUCCESS,
  payload: data
});

const fetchCitiesOfCountryFailure = (error) => ({
  type: FETCH_CITIES_OF_COUNTRY_FAILURE,
  payload: error
});

// CITIES OF STATE
const fetchCitiesOfStateRequest = () => ({
  type: FETCH_CITIES_OF_STATE_REQUEST
});

const fetchCitiesOfStateSuccess = (data) => ({
  type: FETCH_CITIES_OF_STATE_SUCCESS,
  payload: data
});

const fetchCitiesOfStateFailure = (error) => ({
  type: FETCH_CITIES_OF_STATE_FAILURE,
  payload: error
});

// EVENT TYPES
const fetchEventTypesRequest = () => ({
  type: FETCH_EVENT_TYPES_REQUEST
});

const fetchEventTypesSuccess = (data) => ({
  type: FETCH_EVENT_TYPES_SUCCESS,
  payload: data
});

const fetchEventTypesFailure = (error) => ({
  type: FETCH_EVENT_TYPES_FAILURE,
  payload: error
});

// VENDOR TYPES
const fetchVendorTypesRequest = () => ({
  type: FETCH_VENDOR_TYPES_REQUEST
});

const fetchVendorTypesSuccess = (data) => ({
  type: FETCH_VENDOR_TYPES_SUCCESS,
  payload: data
});

const fetchVendorTypesFailure = (error) => ({
  type: FETCH_VENDOR_TYPES_FAILURE,
  payload: error
});

export { 
    fetchCountriesRequest,
    fetchCountriesSuccess,
    fetchCountriesFailure,
    fetchStatesRequest,
    fetchStatesSuccess,
    fetchStatesFailure,
    fetchCitiesOfCountryRequest,
    fetchCitiesOfCountrySuccess,
    fetchCitiesOfCountryFailure,
    fetchCitiesOfStateRequest,
    fetchCitiesOfStateSuccess,
    fetchCitiesOfStateFailure,
    fetchEventTypesRequest,
    fetchEventTypesSuccess,
    fetchEventTypesFailure,
    fetchVendorTypesRequest,
    fetchVendorTypesSuccess,
    fetchVendorTypesFailure,
};