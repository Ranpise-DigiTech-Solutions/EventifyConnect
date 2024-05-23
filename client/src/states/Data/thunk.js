import {
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
} from './index.js';
import axios from 'axios';

// thunk action creator to fetch data asynchronously
const fetchCountries = async (dispatch) => {
    dispatch(fetchCountriesRequest());
    try {
        const URL = `http://localhost:8000/eventify_server/countriesNow/getCountries/`

        await axios
            .get(URL)
            .then((response) => {
                dispatch(fetchCountriesSuccess(response.data));
            })
            .catch((error) => {
                dispatch(fetchCountriesFailure("Error fetching countries:- ", error.message));
            });
    } catch (error) {
        dispatch(fetchCountriesFailure(error.message));
    }
};

const fetchStates = (countryName) => async (dispatch) => {
    dispatch(fetchStatesRequest());
    try {
        const URL = `http://localhost:8000/eventify_server/countriesNow/getStates/?countryName=${countryName}`;

        await axios
            .get(URL)
            .then((response) => {
                dispatch(fetchStatesSuccess(response.data));
            })
            .catch((error) => {
                dispatch(fetchStatesFailure("Error fetching states:- ", error.message));
            });
    } catch (error) {
        dispatch(fetchStatesFailure(error.message));
    }
};

const fetchCitiesOfCountry = (countryName) => async (dispatch) => {
    dispatch(fetchCitiesOfCountryRequest());
    try {
        const URL = `http://localhost:8000/eventify_server/countriesNow/getCitiesOfCountry/?countryName=${countryName}`;

        await axios
            .get(URL)
            .then((response) => {
                dispatch(fetchCitiesOfCountrySuccess(response.data));
            })
            .catch((error) => {
                dispatch(fetchCitiesOfCountryFailure("Error fetching cities:- ", error.message));
            });
    } catch (error) {
        dispatch(fetchCitiesOfCountryFailure(error.message));
    }
};

const fetchCitiesOfState = (countryName, stateName) => async (dispatch) => {
    dispatch(fetchCitiesOfStateRequest());
    try {
        const URL = `http://localhost:8000/eventify_server/countriesNow/getCitiesOfState/?countryName=${countryName}&stateName=${stateName}`;

        await axios
            .get(URL)
            .then((response) => {
                dispatch(fetchCitiesOfStateSuccess(response.data));
            })
            .catch((error) => {
                dispatch(fetchCitiesOfStateFailure("Error fetching cities:- ", error.message));
            });
    } catch (error) {
        dispatch(fetchCitiesOfStateFailure(error.message));
    }
};

const fetchEventTypes = async (dispatch) => {
    dispatch(fetchEventTypesRequest());
    try {
        const URL = "http://localhost:8000/eventify_server/eventTypes/";
        
        await axios
            .get(URL)
            .then((response) => {
                dispatch(fetchEventTypesSuccess(response.data));
            })
            .catch((error) => {
                dispatch(fetchEventTypesFailure("Error fetching Event types:- ", error.message));
            });
    } catch (error) {
        dispatch(fetchEventTypesFailure(error.message));
    }
};

const fetchVendorTypes = async (dispatch) => {
    dispatch(fetchVendorTypesRequest());
    try {
        const URL = "http://localhost:8000/eventify_server/vendorTypes/";

        await axios
            .get(URL)
            .then((response) => {
                dispatch(fetchVendorTypesSuccess(response.data));
            })
            .catch((error) => {
                dispatch(fetchVendorTypesFailure("Error fetching Vendor types:- ", error.message));
            });
    } catch (error) {
        dispatch(fetchVendorTypesFailure(error.message));
    }
};

export {
    fetchCountries,
    fetchStates,
    fetchCitiesOfCountry,
    fetchCitiesOfState,
    fetchEventTypes, 
    fetchVendorTypes,
};