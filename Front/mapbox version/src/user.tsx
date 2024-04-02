import axios from 'axios';

const DEFAULT_OPTION = { withCredentials: true };

export const login = async entry => {
  const res = await axios.post(
    `http://main.sabt.shankayi.ir/api/login_user`,
    entry,
    DEFAULT_OPTION
  );
  return res;
};

export const logout = async () => {
  const res = await axios.delete(`http://main.sabt.shankayi.ir/api/logout_user`, DEFAULT_OPTION);
  return res;
};