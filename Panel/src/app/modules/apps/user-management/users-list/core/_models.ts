import {ID, Response} from '../../../../../../_metronic/helpers'
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

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: 'avatars/300-6.jpg',
  position: 'Art Director',
  role: 'Administrator',
  name: '',
  email: '',
}
