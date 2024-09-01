import { FC, useEffect } from 'react';
import {KTIcon} from '../../../../lib/helpers'
import { Content } from '../../../../lib/layout/components/content'
import {DatasetCard} from '../../../../lib/partials/content/cards/DatasetCard'
import { User } from '../../apps/user-management/users-list/core/_models';
import { useAuth } from '../../auth';
import React from 'react';
import { login } from '../../auth/core/_requests';
import { getDatasetsbyUserId } from '../../apps/user-management/users-list/core/_requests';



interface IProps {
  InputUserData: User;
}

export const Datasets: FC<IProps> = ({InputUserData})=> {
  const [userData, setUserData] = React.useState<User>();
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const {currentUser} = useAuth()
  const [datasetCards, setDatasetCards] = React.useState<JSX.Element[]>();

  async function getDatasetData() {
    if (!loginSuccess) {
      let loginResponse: any = await login(currentUser?.email as any,currentUser?.password as any,currentUser?.user_name as any);
      setLoginSuccess(true);
    }
    let response= await getDatasetsbyUserId();

    return (response as any);
  }
  useEffect(() => {
    getDatasetData().then(response => {
      setUserData(response);
      const cards = [];

      for (let i = 1; i <= 10; i++) {
        cards.push(<div className='col-12 col-sm-12 col-xl'>
        <DatasetCard icon='media/svg/files/pdf.svg' title='Project Reqs..' description='3 days ago' />
      </div>);
      }

      setDatasetCards(cards);
    });
  }, []);

  return (
    <Content>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>
          My Datasets
          <span className='fs-6 text-gray-500 fw-bold ms-1'>100+ resources</span>
        </h3>

        <div className='d-flex my-2'>
          <div className='d-flex align-items-center position-relative me-4'>
            <KTIcon iconName='magnifier' className='fs-3 position-absolute ms-3' />
            <input
              type='text'
              id='kt_filter_search'
              className='form-control form-control-white form-control-sm w-150px ps-9'
              placeholder='Search'
            />
          </div>

          <a href='#' className='btn btn-primary btn-sm'>
            File Manager
          </a>
        </div>
      </div>

      <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
        {datasetCards}
      </div>

      <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
        {datasetCards}
      </div>

      <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
        {datasetCards}
      </div>
    </Content>
  )
}
