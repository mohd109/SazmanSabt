import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'

const SidebarMenuMain = () => {
  const intl = useIntl()

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Workspace</span>
        </div>
      </div>
      <SidebarMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' icon='element-plus' >
          {/* <SidebarMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          /> */}
          <SidebarMenuItem to='/crafted/pages/wizards/vertical' title='Add Dataset' hasBullet={true} />
        </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/crafted/accounts'
        title='Account'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
          {/* <SidebarMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} /> */}
          <SidebarMenuItem to='/crafted/pages/profile/projects' title='Tasks' hasBullet={true} />
          <SidebarMenuItem
            to='/crafted/pages/profile/campaigns'
            title='Maps'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/documents'
            title='Documents'
            hasBullet={true}
          />
          {/* <SidebarMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          /> */}
        <SidebarMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </SidebarMenuItemWithSub>
      {/* <SidebarMenuItemWithSub to='/error' title='Errors' fontIcon='bi-sticky' icon='cross-circle'>
        <SidebarMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
     
      {/* <SidebarMenuItemWithSub
        to='/apps/chat'
        title='Support'
        fontIcon='bi-chat-left'
        icon='message-text-2'
      >
        <SidebarMenuItem to='/apps/chat/private-chat' title='Chat' hasBullet={true} />
        {<SidebarMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />}
      </SidebarMenuItemWithSub> */}
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Settings</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/crafted/widgets'
        title='Administration'
        icon='element-7'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/crafted/widgets/lists' title='Overview' hasBullet={true} />
        <SidebarMenuItem to='/apps/user-management/users' title='User management' hasBullet={true} />
        {/* <SidebarMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} /> */}
        {/* <SidebarMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} /> */}
        <SidebarMenuItem to='/crafted/widgets/mixed' title='Task Progress' hasBullet={true} />
        {/* <SidebarMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} /> */}
        {/* <SidebarMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} /> */}
      </SidebarMenuItemWithSub>
     
      {/* <SidebarMenuItem to='/builder' icon='switch' title='Layout' fontIcon='bi-layers' /> */}

      {/* <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + '/changelog'}
        >
          <span className='menu-icon'>
            <KTIcon iconName='code' className='fs-2' />
          </span>
          <span className='menu-title'>Changelog {import.meta.env.VITE_APP_VERSION}</span>
        </a>
      </div> */}
    </>
  )
}

export {SidebarMenuMain}
