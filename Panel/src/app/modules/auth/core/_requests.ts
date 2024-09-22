import axios, { AxiosResponse } from "axios";
import { AuthModel, UserModel } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/login_user`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

// Server should return AuthModel
export function login(email: string, password: string, user_name: string) {
  
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    user_name,
    password,
  });
}
const DEFAULT_OPTION = {
  headers: {
    'Content-Type': 'application/json',
    'Cookie': "id=t99ioLNL5IadjrclKua4uAhYkci6wcTY2jdyF07cJuDn7tJzhENxjCogm%2F2tQ45KLxO5uomVTxXmOLdAfweo3TwAnwkTz0VfLnfXeBg1QVp5GXvkz5PcTxBZ1u4%3D;"
  },
  withCredentials: true
};

export async function sendPostRequest(body: any, endPoint: string): Promise<AxiosResponse> {
  let response = await axios.post(
    endPoint,
    body,
    DEFAULT_OPTION,
  );
  return response;
}

export async function sendGetRequest(endPoint: string): Promise<AxiosResponse> {
  let response = await axios.get(
    endPoint,
    DEFAULT_OPTION,
  );
  return response;
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  });
}
