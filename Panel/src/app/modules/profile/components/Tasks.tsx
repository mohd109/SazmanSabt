import {IconUserModel} from '../ProfileModels'

import { FC, useEffect } from 'react';
import { Content } from '../../../../lib/layout/components/content'
import { TaskCard} from '../../../../lib/partials/content/cards/TaskCard'
import { User } from '../../apps/user-management/users-list/core/_models';
import { useAuth } from '../../auth';
import React from 'react';
import { login } from '../../auth/core/_requests';
import { getTasksbyUserId } from '../../apps/user-management/users-list/core/_requests';


interface IProps {
  InputUserData: User;
}

export const Tasks: FC<IProps> = ({InputUserData})=> {
  const [userData, setUserData] = React.useState<User>();
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [taskCards, setTaskCards] = React.useState<JSX.Element[]>();
  const {currentUser} = useAuth()

  async function getTaskData() {
    if (!loginSuccess) {
      let loginResponse: any = await login(currentUser?.email as any,currentUser?.password as any,currentUser?.user_name as any);
      setLoginSuccess(true);
    }
    let response= await getTasksbyUserId();
    console.log("began to get the task data")

    return (response as any);
  }
  useEffect(() => {
    getTaskData().then(response => {
      console.log("got the task data")
      setUserData(response);
      const cards = [];

      for (let i = 1; i <= 10; i++) {
        cards.push( <div className='col-md-6 col-xl-4'>
        <TaskCard
          icon='media/svg/brand-logos/plurk.svg'
          badgeColor='primary'
          status='In Progress'
          statusColor='primary'
          title='Fitnes App'
          description='CRM App application to HR efficiency'
          date='November 10, 2021'
          budget='$284,900.00'
          progress={50}
          users={users1}
        />
      </div>);
      }

      setTaskCards(cards);
    });

  }, []);
  

  return (
    <Content>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>
          My Tasks
          <span className='fs-6 text-gray-500 fw-bold ms-1'>Active</span>
        </h3>

        <div className='d-flex flex-wrap my-2'>
          <div className='me-4'>
            <select
              name='status'
              data-control='select2'
              data-hide-search='true'
              className='form-select form-select-sm form-select-white w-125px'
              defaultValue='Active'
            >
              <option value='Active'>Active</option>
              <option value='Approved'>In Progress</option>
              <option value='Declined'>To Do</option>
              <option value='In Progress'>Completed</option>
            </select>
          </div>
          <a
            href='#'
            className='btn btn-primary btn-sm'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_create_project'
          >
            New Project
          </a>
        </div>
      </div>

      <div className='row g-6 g-xl-9'>
        {taskCards}
      </div>

      <div className='d-flex flex-stack flex-wrap pt-10'>
        <div className='fs-6 fw-bold text-gray-700'>Showing 1 to 10 of 50 entries</div>

        <ul className='pagination'>
          <li className='page-item previous'>
            <a href='#' className='page-link'>
              <i className='previous'></i>
            </a>
          </li>

          <li className='page-item active'>
            <a href='#' className='page-link'>
              1
            </a>
          </li>

          <li className='page-item'>
            <a href='#' className='page-link'>
              2
            </a>
          </li>

          <li className='page-item'>
            <a href='#' className='page-link'>
              3
            </a>
          </li>

          <li className='page-item'>
            <a href='#' className='page-link'>
              4
            </a>
          </li>

          <li className='page-item'>
            <a href='#' className='page-link'>
              5
            </a>
          </li>

          <li className='page-item'>
            <a href='#' className='page-link'>
              6
            </a>
          </li>

          <li className='page-item next'>
            <a href='#' className='page-link'>
              <i className='next'></i>
            </a>
          </li>
        </ul>
      </div>
    </Content>
  )
}

const users1: Array<IconUserModel> = [
  {name: 'Emma Smith', avatar: 'media/avatars/300-6.jpg'},
  {name: 'Rudy Stone', avatar: 'media/avatars/300-1.jpg'},
  {name: 'Susan Redwood', initials: 'S', color: 'primary'},
]

const users2 = [
  {name: 'Alan Warden', initials: 'A', color: 'warning'},
  {name: 'Brian Cox', avatar: 'media/avatars/300-5.jpg'},
]

const users3 = [
  {name: 'Mad Masy', avatar: 'media/avatars/300-6.jpg'},
  {name: 'Cris Willson', avatar: 'media/avatars/300-1.jpg'},
  {name: 'Mike Garcie', initials: 'M', color: 'info'},
]

const users4 = [
  {name: 'Nich Warden', initials: 'N', color: 'warning'},
  {name: 'Rob Otto', initials: 'R', color: 'success'},
]

const users5 = [
  {name: 'Francis Mitcham', avatar: 'media/avatars/300-20.jpg'},
  {name: 'Michelle Swanston', avatar: 'media/avatars/300-7.jpg'},
  {name: 'Susan Redwood', initials: 'S', color: 'primary'},
]

const users6 = [
  {name: 'Emma Smith', avatar: 'media/avatars/300-6.jpg'},
  {name: 'Rudy Stone', avatar: 'media/avatars/300-1.jpg'},
  {name: 'Susan Redwood', initials: 'S', color: 'primary'},
]

const users7 = [
  {name: 'Meloday Macy', avatar: 'media/avatars/300-2.jpg'},
  {name: 'Rabbin Watterman', initials: 'S', color: 'success'},
]

const users8 = [
  {name: 'Emma Smith', avatar: 'media/avatars/300-6.jpg'},
  {name: 'Rudy Stone', avatar: 'media/avatars/300-1.jpg'},
  {name: 'Susan Redwood', initials: 'S', color: 'primary'},
]

const users9 = [
  {name: 'Meloday Macy', avatar: 'media/avatars/300-2.jpg'},
  {name: 'Rabbin Watterman', initials: 'S', color: 'danger'},
]
