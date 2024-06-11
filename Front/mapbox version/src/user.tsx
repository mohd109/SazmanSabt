import axios from 'axios';

const DEFAULT_OPTION = { withCredentials: true };

export const login = async entry => {
  const res = await axios.post(
    `http://10.1.47.63:30001/api/login_user`,
    entry,
    DEFAULT_OPTION
  );
  return res;
};

export const logout = async () => {
  const res = await axios.delete(`http://10.1.47.63:30001/api/logout_user`, DEFAULT_OPTION);
  return res;
};