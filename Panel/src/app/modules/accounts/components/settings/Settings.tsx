import {ProfileDetails} from './cards/ProfileDetails'
import {SignInMethod} from './cards/SignInMethod'
// import {ConnectedAccounts} from './cards/ConnectedAccounts'
import {EmailPreferences} from './cards/EmailPreferences'
import {Notifications} from './cards/Notifications'
import {DeactivateAccount} from './cards/DeactivateAccount'
import { Content } from '../../../../../_metronic/layout/components/content'
import { FC } from 'react'

interface IProps {
  InputUserData: any;
}
export const Settings: FC<IProps> = (props,InputUserData)=>{

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
