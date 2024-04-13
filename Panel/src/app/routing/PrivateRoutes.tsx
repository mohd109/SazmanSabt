import {lazy, FC, Suspense, useEffect} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import React from 'react'
import { getUserById } from '../modules/apps/user-management/users-list/core/_requests'
import { login } from '../modules/auth/core/_requests'
import ProfilePage from '../modules/profile/ProfilePage'
import WizardsPage from '../modules/wizards/WizardsPage'
import AccountPage from '../modules/accounts/AccountPage'
import WidgetsPage from '../modules/widgets/WidgetsPage'
import ChatPage from '../modules/apps/chat/ChatPage'
import UsersPage from '../modules/apps/user-management/UsersPage'

const PrivateRoutes = () => {
  const [userData, setUserData] = React.useState();
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  
  async function getUserData() {
    if (!loginSuccess) {
      let loginResponse: any = await login("mohd109@gmail.com","Czin1231091256","mohd109");
      setLoginSuccess(true);
    }
    let response= await getUserById(2);
    console.log(response)

    return (response as any);
  }
  useEffect(() => {
    getUserData().then(response => {
      setUserData(response);
    });
  }, []);
  
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage  InputUserData={userData}/>
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage InputUserData={userData}/>
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
