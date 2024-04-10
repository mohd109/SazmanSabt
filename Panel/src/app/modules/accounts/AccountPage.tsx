import React, { useEffect } from 'react'
import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Overview} from './components/Overview'
import {Settings} from './components/settings/Settings'
import {AccountHeader} from './AccountHeader'
import axios, { AxiosResponse } from 'axios'
import { getUserById } from '../apps/user-management/users-list/core/_requests'

const DEFAULT_OPTION = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
};

async function sendPostRequest(body: any, endPoint: string): Promise<AxiosResponse> {
  let response = await axios.post(
    endPoint,
    body,
    DEFAULT_OPTION,
  );
  return response;
}

async function sendGetRequest(endPoint: string): Promise<AxiosResponse> {
  let response = await axios.get(
    endPoint,
    DEFAULT_OPTION,
  );
  return response;
}
const accountBreadCrumbs: Array<PageLink> = [
  {
    title: 'Account',
    path: '/crafted/account/overview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const AccountPage: React.FC = () => {

  const [userData, setUserData] = React.useState(null);
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  
  async function getUserData() {
    if (!loginSuccess) {
      let loginReponse: any = await sendPostRequest({ email: "mohd109@gmail.com", user_name: "mohd109", password: "Czin1231091256" }, "http://panel.sabt.shankayi.ir/api/login_user");
      setLoginSuccess(true);
    }
    let response= await getUserById(2);
    // console.log(response)

    return (response as any);
  }
  useEffect(() => {
    getUserData().then(response => {
      setUserData(response);
    });
  }, []);
  return (
    <Routes>
      <Route
        element={
          <>
            <AccountHeader />
            <Outlet />
          </>
        }
      >
        <Route
          path='overview'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Overview</PageTitle>
              <Overview InputUserData={userData}/>
            </>
          }
        />
        <Route
          path='settings'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Settings</PageTitle>
              <Settings InputUserData={userData}/>
            </>
          }
        />
        <Route index element={<Navigate to='/crafted/account/overview' />} />
      </Route>
    </Routes>
  )
}

export default AccountPage
