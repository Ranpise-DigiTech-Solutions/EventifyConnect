export const SET_DATA = 'userInfo/SET_DATA';
export const SET_USER_AUTH_STATE_CHANGE_FLAG = 'userInfo/SET_USER_AUTH_STATE_CHANGE_FLAG';

const setData = (key, value) => ({
  type: SET_DATA,
  payload: { key, value },
});

const setUserAuthStateChangeFlag = () => ({
  type: SET_USER_AUTH_STATE_CHANGE_FLAG,
});

export { setData, setUserAuthStateChangeFlag };