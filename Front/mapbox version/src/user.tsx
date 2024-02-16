import axios from 'axios';

const DEFAULT_OPTION = { withCredentials: true };

export const login = async entry => {
  const res = await axios.post(
    `https://teh.land/api/login_user`,
    entry,
    DEFAULT_OPTION
  );
  return res;
};

export const logout = async () => {
  const res = await axios.delete(`https://teh.land/api/logout_user`, DEFAULT_OPTION);
  return res;
};