import {ProfileDetails} from './cards/ProfileDetails'
import {SignInMethod} from './cards/SignInMethod'
// import {ConnectedAccounts} from './cards/ConnectedAccounts'
import {EmailPreferences} from './cards/EmailPreferences'
import {Notifications} from './cards/Notifications'
import {DeactivateAccount} from './cards/DeactivateAccount'
import { Content } from '../../../../../_metronic/layout/components/content'
import { FC } from 'react'
import { User } from '../../../apps/user-management/users-list/core/_models'

interface IProps {
  InputUserData: User;
}
export const Settings: FC<IProps> = ({InputUserData})=>{

  return (
    <Content>
      <ProfileDetails InputUserData={InputUserData}/>
      <SignInMethod InputUserData={InputUserData}/>
      {/* <ConnectedAccounts /> */}
      <EmailPreferences InputUserData={InputUserData}/>
      <Notifications InputUserData={InputUserData}/>
      {/* <DeactivateAccount /> */}
    </Content>
  )
}
