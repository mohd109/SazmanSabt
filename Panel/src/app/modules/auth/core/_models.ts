import { ID } from "../../../../lib/helpers"

export interface AuthModel {
  api_token: string
  refreshToken?: string
}

export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean
  sendCopyToPersonalEmail?: boolean
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean
    youAreSentADirectMessage?: boolean
    someoneAddsYouAsAsAConnection?: boolean
    uponNewOrder?: boolean
    newMembershipApproval?: boolean
    memberRegistration?: boolean
  }
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean
    tipsOnGettingMoreOutOfKeen?: boolean
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean
    tipsOnStartBusinessProducts?: boolean
  }
}

export interface UserSocialNetworksModel {
  linkedIn: string
  facebook: string
  twitter: string
  instagram: string
}

export interface UserModel {
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
