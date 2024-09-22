import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { DatasetsQueryResponse, LayersQueryResponse, TasksQueryResponse, TilesQueryResponse, User, UsersQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const USER_URL = `${API_URL}/user`;
const DATASET_URL = `${API_URL}/datasets`;
const LAYER_URL = `${API_URL}/layers`;
const TILE_URL = `${API_URL}/tiles`;
const TASK_URL = `${API_URL}/jobs`;

const GET_USERS_URL = `${API_URL}/users/query`;

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


const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_USERS_URL}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data);
};

const getUserById = (id: ID): Promise<User | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const getLayersbyUserId = (): Promise<LayersQueryResponse | undefined> => {
  return axios
    .get(`${LAYER_URL}`)
    .then((response: AxiosResponse<Response<LayersQueryResponse>>) => response.data)
    .then((response: Response<LayersQueryResponse>) => response.data);
};


const getTasksbyUserId = (): Promise<TasksQueryResponse | undefined> => {
  return axios
    .get(`${TASK_URL}`)
    .then((response: AxiosResponse<Response<TasksQueryResponse>>) => response.data)
    .then((response: Response<TasksQueryResponse>) => response.data);
};

const getTilesbyUserId = (): Promise<TilesQueryResponse | undefined> => {
  return axios
    .get(`${TILE_URL}`)
    .then((response: AxiosResponse<Response<TilesQueryResponse>>) => response.data)
    .then((response: Response<TilesQueryResponse>) => response.data);
};

const getDatasetsbyUserId = (): Promise<DatasetsQueryResponse | undefined> => {
  return axios
    .get(`${DATASET_URL}`)
    .then((response: AxiosResponse<Response<DatasetsQueryResponse>>) => response.data)
    .then((response: Response<DatasetsQueryResponse>) => response.data);
};

const createUser = (user: User): Promise<User | undefined> => {
  return axios
    .put(USER_URL, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const updateUser = (user: User): Promise<User | undefined> => {
  return axios
    .post(`${USER_URL}/${user.id}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
  getDatasetsbyUserId,
  getLayersbyUserId,
  getTilesbyUserId,
  getTasksbyUserId

};
