
import { FC, useEffect } from 'react';
import { Content } from '../../../../_metronic/layout/components/content'
import { TileCard} from '../../../../_metronic/partials/content/cards/TileCard'
import { User } from '../../apps/user-management/users-list/core/_models';
import { useAuth } from '../../auth';
import React from 'react';
import { login } from '../../auth/core/_requests';
import { getTilesbyUserId, getUserById } from '../../apps/user-management/users-list/core/_requests';



interface IProps {
  InputUserData: User;
}

export const Maps: FC<IProps> = ({InputUserData})=> {
  const [userData, setUserData] = React.useState<User>();
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [tileCards, setTileCards] = React.useState<JSX.Element[]>();
  const {currentUser} = useAuth()

  async function getTileData() {
    if (!loginSuccess) {
      let loginResponse: any = await login(currentUser?.email as any,currentUser?.password as any,currentUser?.user_name as any);
      setLoginSuccess(true);
    }
    let response= await getTilesbyUserId();

    return (response as any);
  }
  useEffect(() => {
    getTileData().then(response => {
      setUserData(response);
      const cards = [];

      for (let i = 1; i <= 10; i++) {
        cards.push(<div className='col-sm-6 col-xl-4'>
        <TileCard
          image='media/svg/brand-logos/twitch.svg'
          title='Twitch Posts'
          description='$500.00'
          status='down'
          statusValue={40.5}
          statusDesc='more impressions'
          progress={0.5}
          progressType='MRR'
        />
      </div>);
      }

      setTileCards(cards);
    });

  }, []);
  
  return (
    <Content>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>
          My Maps
          <span className='fs-6 text-gray-500 fw-bold ms-1'>30 Days</span>
        </h3>

        <div className='d-flex align-items-center my-2'>
          <div className='w-100px me-5'>
            <select
              name='status'
              data-control='select2'
              data-hide-search='true'
              className='form-select form-select-white form-select-sm'
              defaultValue='1'
            >
              <option value='1'>30 Days</option>
              <option value='2'>90 Days</option>
              <option value='3'>6 Months</option>
              <option value='4'>1 Year</option>
            </select>
          </div>
          <button className='btn btn-primary btn-sm' data-bs-toggle='tooltip' title='Coming soon'>
            Add Campaign
          </button>
        </div>
      </div>
 
      <div className='row g-6 g-xl-9'>
        {tileCards}
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
function getLayersbyUserId() {
  throw new Error('Function not implemented.');
}

