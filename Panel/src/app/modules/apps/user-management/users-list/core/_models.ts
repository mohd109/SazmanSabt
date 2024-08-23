import { ID, Response } from '../../../../../../lib/helpers'
export type User = {
  id?: ID,
  user_name?: string,
  phone_number?: string,
  email?: string,
  password?: string,
  image?: string,
  id_card?: string,
  gender?: string,
  birth?: string,
  post_code?: string,
  addr?: string,
  city?: string,
  bank_account?: string,
  active?: string,
  id_code?: string,
  notifications?: string,
  favorites?: string,
  position?: string,
  role?: string,
  last_login?: string,
  joined_day?: string,
  online?: boolean,
  two_steps?: boolean,
  name?: string,
  access_level?: number,
  avatar?: string,
  initial_label?: string,
  initial_state?: string

}

export type Layer = {
  id: ID,
  name: string,
  tile_id: number,
  type_id: number,
  owner_id: number,
  children: string,
}


export type Dataset = {
  id: ID,
  type_id: Number,
  creation_date_time: string,
  access_level: Number,
  owner_id: Number,
  tile_id: Number,
  url: string,
  name: string,
}

export type Tile = {
  id: ID,
  name: string,
  creation_date_time: string,
  modified_date_time: string,
  active: Number,
  access_level: Number,
  owner_id: Number,
  dataset_id: Number,
  url: string,
}

export type Task = {
  id: ID,
  name: string,
  creation_date_time: string,
  modified_date_time: string,
  progress: Number,
  owner_id: Number,
}

export type UsersQueryResponse = Response<Array<User>>
export type LayersQueryResponse = Response<Array<Layer>>
export type TilesQueryResponse = Response<Array<Tile>>
export type TasksQueryResponse = Response<Array<Task>>
export type DatasetsQueryResponse = Response<Array<Dataset>>



export const initialUser: User = {
  avatar: 'avatars/300-6.jpg',
  position: 'Art Director',
  role: 'Administrator',
  name: '',
  email: '',
}
