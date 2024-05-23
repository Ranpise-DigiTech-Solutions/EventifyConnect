export const SET_DATA = 'SearchBoxFilter/SET_DATA';

const setData = (key, value) => ({
  type: SET_DATA,
  payload: { key, value },
});

export default setData;