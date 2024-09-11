import {Navigate, Routes, Route, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Overview} from './components/Overview'
import {Tasks} from './components/Tasks'
import {Maps} from './components/Maps'
import {Datasets} from './components/Datasets'
import {Connections} from './components/Connections'
import {ProfileHeader} from './ProfileHeader'
import { FC } from 'react'
import { User } from '../apps/user-management/users-list/core/_models'

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/crafted/pages/profile/overview',
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
  InputUserData: User;
}

const ProfilePage: FC<IProps> = ({InputUserData})=> {
  return(
  <Routes>
    <Route
      element={
        <>
          <ProfileHeader InputUserData={InputUserData} />
          <Outlet />
        </>
      }
    >
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Overview</PageTitle>
            <Overview/>
          </>
        }
      />
      <Route
        path='tasks'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Tasks</PageTitle>
            <Tasks  InputUserData={InputUserData}/>
          </>
        }
      />
      <Route
        path='maps'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Maps</PageTitle>
            <Maps InputUserData={InputUserData}/>
          </>
        }
      />
      <Route
        path='datasets'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Datasets</PageTitle>
            <Datasets InputUserData={InputUserData}/>
          </>
        }
      />
      <Route
        path='connections'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Connections</PageTitle>
            <Connections />
          </>
        }
      />
      <Route index element={<Navigate to='/crafted/pages/profile/overview' />} />
    </Route>
  </Routes>
)
}

export default ProfilePage
