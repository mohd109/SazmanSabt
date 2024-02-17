import React from 'react';
// import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from '../src';
import { Switch } from './components/sidebar/Switch';
import { SidebarHeader } from './components/sidebar/SidebarHeader';
import { Diamond } from './icons/Diamond';
import { BarChart } from './icons/BarChart';
import { Global } from './icons/Global';
import { InkBottle } from './icons/InkBottle';
import { Book } from './icons/Book';
import { Calendar } from './icons/Calendar';
import { ShoppingCart } from './icons/ShoppingCart';
import { Service } from './icons/Service';
import { SidebarFooter } from './components/sidebar/SidebarFooter';
import { Badge } from './components/sidebar/Badge';
import { Typography } from './components/sidebar/Typography';
import { PackageBadges } from './components/sidebar/PackageBadges';
import { Menu, MenuItemStyles } from './components/sidebar/Menu';
import { menuClasses } from './utils/utilityClasses';
import { MenuItem } from './components/sidebar/MenuItem';
import { SubMenu } from './components/sidebar/SubMenu';
import { Sidebar } from './components/sidebar/Sidebar';
import MarketPlace from './MarketPlace';
import { light } from './theme/fontWeight';
import { Tree }  from 'react-arborist'

type Theme = 'light' | 'dark';
const data = [
  { id: "1", name: "Unread" },
  { id: "2", name: "Threads" },
  {
    id: "3",
    name: "Chat Rooms",
    children: [
      { id: "c1", name: "General" },
      { id: "c2", name: "Random" },
      { id: "c3", name: "Open Source Projects" },
    ],
  },
  {
    id: "4",
    name: "Direct Messages",
    children: [
      { id: "d1", name: "Alice" },
      { id: "d2", name: "Bob" },
      { id: "d3", name: "Charlie" },
    ],
  },
];

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#607489',
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#26A17B',
      hover: {
        backgroundColor: '#727372',
        color: '#ffffff',
      },
      disabled: {
        color: '#9fb6cf',
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: '#1f1f1f',
      color: '#cccccc',
    },
    menu: {
      menuContent: '#083b2b',
      icon: '#26A17B',
      hover: {
        backgroundColor: '#727372',
        color: '#050505',
      },
      disabled: {
        color: '#18634c',
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
function Node({ node, style, dragHandle }) {
  /* This node instance can do many things. See the API reference. */
  return (
    <div style={style} ref={dragHandle}>
      {node.isLeaf ? "🍁" : "🗀"}
      {node.data.name}
    </div>
  );
}

function MainPage() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [autoHide, setAutoHide] = React.useState(false);
  const [toggled, setToggled] = React.useState(true);
  const [broken, setBroken] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>('dark');
  const hideSidebar = (e) => {
    if(autoHide)
    {
      setTimeout(() => {
        setCollapsed(true);
      }, 1000);
    }
  };
  const showSidebar = (e) => {
    setTimeout(() => {
      setCollapsed(false);
    }, 100);
  };
  // handle on RTL change event
  const handleRTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRtl(e.target.checked);
  };
    // handle on RTL change event
    const handleAutoHideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAutoHide(e.target.checked)
    };
  // handle on theme change event
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  // handle on image change event
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasImage(e.target.checked);
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '13px',
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9',
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes[theme].menu.menuContent, hasImage && !collapsed ? 0.4 : 1)
          : 'transparent',
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, hasImage ? 0.8 : 1),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };


  return (
    <div className={"flex h-full absolute inset-0 w-full overflow-hidden"} style={{ direction: rtl ? 'rtl' : 'ltr' }}>
     
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
        rtl={rtl}
        breakPoint="md"
        backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, hasImage ? 0.9 : 1)}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} onMouseLeave={hideSidebar} onMouseEnter={showSidebar}>
          <SidebarHeader rtl={rtl} style={{ marginBottom: '24px', marginTop: '16px' }} />
          <div style={{ flex: 1, marginBottom: '32px' }}>
            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                General
              </Typography>
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Import/Export"
                icon={<BarChart />}
                suffix={
                  <Badge variant="danger" shape="circle">
                    6
                  </Badge>
                }
              >
                <MenuItem> Job Progress</MenuItem>
                <MenuItem> Import</MenuItem>
                <MenuItem> Export</MenuItem>
              </SubMenu>
              <SubMenu label="Layers" icon={<Global />}>
              {/* <Tree initialData={data} /> */}
                <MenuItem> Raster</MenuItem>
                <MenuItem> Vector</MenuItem>
              </SubMenu>
              <SubMenu label="Search" icon={<InkBottle />}>
                <MenuItem> Spatial</MenuItem>
                <MenuItem> Tables</MenuItem>
              </SubMenu>
              <SubMenu label="History" icon={<Diamond />}>
                <MenuItem> Edits</MenuItem>
                <MenuItem> Uploads</MenuItem>
                <SubMenu label="Favorites">
                  <MenuItem> Locations</MenuItem>
                  <MenuItem> Queries</MenuItem>
                  <SubMenu label="Layers">
                    <MenuItem> Raster</MenuItem>
                    <MenuItem> Vector</MenuItem>
                  </SubMenu>
                </SubMenu>
              </SubMenu>
              <SubMenu label="Info" icon={<ShoppingCart />}>
                <MenuItem> Metadata/Attribute Tables</MenuItem>
                <MenuItem> Object Properties</MenuItem>
                <MenuItem> Area Statitics</MenuItem>
              </SubMenu>
            </Menu>

            <div style={{ padding: '0 24px', marginBottom: '8px', marginTop: '32px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                Extra
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem icon={<Calendar />} suffix={<Badge variant="success">New</Badge>}>
                Tasks
              </MenuItem>
              <SubMenu label="Settings" icon={<Book />}>
                <MenuItem icon={<Book />} >
                <Switch id="rtl" checked={autoHide} onChange={handleAutoHideChange} label="Auto Hide" />
                </MenuItem>
                <MenuItem icon={<Book />}>
                  <Switch id="rtl" checked={rtl} onChange={handleRTLChange} label="RTL" />
                </MenuItem>
                <MenuItem icon={<Book />}>
                  <Switch id="theme" checked={theme === 'dark'} onChange={handleThemeChange} label="Dark theme"
                  />
                </MenuItem>
              </SubMenu>
              <MenuItem disabled icon={<Service />}>
                Admin Section
              </MenuItem>

            </Menu>
          </div>
          <SidebarFooter collapsed={collapsed} />
        </div>
      </Sidebar>
      <MarketPlace />

    </div>
  );
};

export default MainPage