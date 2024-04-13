import React, { FC, useEffect } from 'react'
import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Overview} from './components/Overview'
import {Settings} from './components/settings/Settings'
import {AccountHeader} from './AccountHeader'
import { getUserById } from '../apps/user-management/users-list/core/_requests'
import { login } from '../auth/core/_requests'

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


interface IProps {
  InputUserData: any;
}

const AccountPage: FC<IProps> = (props,InputUserData)=> {

  
  
  return (
    <Routes>
      <Route
        element={
          <>
            <AccountHeader InputUserData={InputUserData} />
            <Outlet />
          </>
        }
      >
        <Route
          path='overview'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Overview</PageTitle>
              <Overview InputUserData={InputUserData}/>
            </>
          }
        />
        <Route
          path='settings'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Settings</PageTitle>
              <Settings InputUserData={InputUserData}/>
            </>
          }
        />
        <Route index element={<Navigate to='/crafted/account/overview' />} />
      </Route>
    </Routes>
  )
}

export default AccountPage
function sendPostRequest(arg0: { email: string; user_name: string; password: string }, arg1: string): any {
  throw new Error('Function not implemented.')
}

