
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'
import {User} from '../../core/_models'

type Props = {
  user: User
}

const UserInfoCell: FC<Props> = ({user}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {user.avatar ? (
          <div className='symbol-label'>
            <img src={toAbsoluteUrl(`media/${user.avatar}.jpg`)} alt={user.name} className='w-100' />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3',
              `bg-light-${user.initial_state}`,
              `text-${user.initial_state}`
            )}
          >
            {user.initial_label}
          </div>
        )}
      </a>
    </div>
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {user.name}
      </a>
      <span>{user.email}</span>
    </div>
  </div>
)

export {UserInfoCell}
