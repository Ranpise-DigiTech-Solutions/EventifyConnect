import {
    FETCH_COUNTRIES_REQUEST,
    FETCH_COUNTRIES_SUCCESS,
    FETCH_COUNTRIES_FAILURE,
    FETCH_STATES_REQUEST,
    FETCH_STATES_SUCCESS,
    FETCH_STATES_FAILURE,
    FETCH_CITIES_OF_COUNTRY_REQUEST,
    FETCH_CITIES_OF_COUNTRY_SUCCESS,
    FETCH_CITIES_OF_COUNTRY_FAILURE,
    FETCH_CITIES_OF_STATE_REQUEST,
    FETCH_CITIES_OF_STATE_SUCCESS,
    FETCH_CITIES_OF_STATE_FAILURE,
    FETCH_EVENT_TYPES_REQUEST,
    FETCH_EVENT_TYPES_SUCCESS,
    FETCH_EVENT_TYPES_FAILURE,
    FETCH_VENDOR_TYPES_REQUEST,
    FETCH_VENDOR_TYPES_SUCCESS,
    FETCH_VENDOR_TYPES_FAILURE
} from "./actions";

// initial state
const initialState = {
    countries: {
        data: [],
        loading: false,
        error: null
    },
    states: {
        data: [],
        loading: false,
        error: null
    },
    citiesOfCountry: {
        data: [],
        loading: false,
        error: null
    },
    citiesOfState: {
        data: [],
        loading: false,
        error: null
    },
    eventTypes: {
        data: [],
        loading: false,
        error: null
    },
    vendorTypes: {
        data: [],
        loading: false,
        error: null
    }
};

// reducer
const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_COUNTRIES_REQUEST:
            return {
                ...state,
                countries: {
                    ...state.countries,
                    loading: true,
                    error: null
                }
            };
        case FETCH_COUNTRIES_SUCCESS:
            return {
                ...state,
                countries: {
                    ...state.countries,
                    loading: false,
                    data: action.payload
                }
            };
        case FETCH_COUNTRIES_FAILURE:
            return {
                ...state,
                countries: {
                    ...state.countries,
                    loading: false,
                    error: action.error
                }
            };
        case FETCH_STATES_REQUEST:
            return {
                ...state,
                states: {
                    ...state.states,
                    loading: true,
                    error: null
                }
            };
        case FETCH_STATES_SUCCESS:
            return {
                ...state,
                states: {
                    ...state.states,
                    loading: false,
                    data: action.payload
                }
            };
        case FETCH_STATES_FAILURE:
            return {
                ...state,
                states: {
                    ...state.states,
                    loading: false,
                    error: action.error
                }
            };
        case FETCH_CITIES_OF_COUNTRY_REQUEST:
            return {
                ...state,
                citiesOfCountry: {
                    ...state.citiesOfCountry,
                    loading: true,
                    error: null
                }
            };
        case FETCH_CITIES_OF_COUNTRY_SUCCESS:
            return {
                ...state,
                citiesOfCountry: {
                    ...state.citiesOfCountry,
                    loading: false,
                    data: action.payload
                }
            };
        case FETCH_CITIES_OF_COUNTRY_FAILURE:
            return {
                ...state,
                citiesOfCountry: {
                    ...state.citiesOfCountry,
                    loading: false,
                    error: action.error
                }
            };
        case FETCH_CITIES_OF_STATE_REQUEST:
            return {
                ...state,
                citiesOfState: {
                    ...state.citiesOfState,
                    loading: true,
                    error: null
                }
            };
        case FETCH_CITIES_OF_STATE_SUCCESS:
            return {
                ...state,
                citiesOfState: {
                    ...state.citiesOfState,
                    loading: false,
                    data: action.payload
                }
            };
        case FETCH_CITIES_OF_STATE_FAILURE:
            return {
                ...state,
                citiesOfState: {
                    ...state.citiesOfState,
                    loading: false,
                    error: action.error
                }
            };
        case FETCH_EVENT_TYPES_REQUEST:
            return {
                ...state,
                eventTypes: {
                    ...state.eventTypes,
                    loading: true,
                    error: null
                }
            };
        case FETCH_EVENT_TYPES_SUCCESS:
            return {
                ...state,
                eventTypes: {
                    ...state.eventTypes,
                    loading: false,
                    data: action.payload
                }
            };
        case FETCH_EVENT_TYPES_FAILURE:
            return {
                ...state,
                eventTypes: {
                    ...state.eventTypes,
                    loading: false,
                    error: action.error
                }
            };
        case FETCH_VENDOR_TYPES_REQUEST:
            return {
                ...state,
                vendorTypes: {
                    ...state.vendorTypes,
                    loading: true,
                    error: null
                }
            };
        case FETCH_VENDOR_TYPES_SUCCESS:
            return {
                ...state,
                vendorTypes: {
                    ...state.vendorTypes,
                    loading: false,
                    data: action.payload
                }
            };
        case FETCH_VENDOR_TYPES_FAILURE:
            return {
                ...state,
                vendorTypes: {
                    ...state.vendorTypes,
                    loading: false,
                    error: action.error
                }
            };
        default:
            return state;
    }
};

export default dataReducer;