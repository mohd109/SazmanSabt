import React, { useEffect } from 'react';
// import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from '../src';
import { Switch } from './components/sidebar/Switch';
import { SidebarHeader } from './components/sidebar/SidebarHeader';
import { History } from './icons/History';
import { ImportExport } from './icons/ImportExport';
import { Layers } from './icons/Layers';
import { Search } from './icons/Search';
import { Settings } from './icons/Settings';
import { Tasks } from './icons/Tasks';
import { ShoppingCart } from './icons/ShoppingCart';
import { Admin } from './icons/Admin';
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
import DataTable from 'react-data-table-component';
import { Direction } from 'react-data-table-component';
import axios, { AxiosResponse } from 'axios';
import { useRef, useState } from "react";
import { Tree } from "react-arborist";
import Node from "./components/sidebar/Node";
import { TbFolderPlus } from "react-icons/tb";
import { AiOutlineFileAdd } from "react-icons/ai";
import { useDynamicTree } from "react-arborist";

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



type Theme = 'light' | 'dark';
type VisibilityOfDetail = '' | 'hidden';

const detailTitle = { 10: "Raster Layers", 11: "Vector Layers", 20: "Attribute Table", 21: "Properties", 22: "Statistics" };
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
function MainPage() {
  const [collapsed, setCollapsed] = React.useState(true);
  const [autoHide, setAutoHide] = React.useState(true);
  const [toggled, setToggled] = React.useState(true);
  const [broken, setBroken] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>('dark');
  const [visibilityOfDetail, setVisibilityOfDetail] = React.useState("hidden");
  const [collapsedDetail, setCollapsedDetail] = React.useState(false);
  const [toggledDetail, setToggledDetail] = React.useState(true);
  const [brokenDetail, setBrokenDetail] = React.useState(false);
  const [statusDetail, setStatusDetail] = React.useState(0);
  const [layersData, setLayersData] = React.useState();
  const [layersMetadata, setLayersMetadata] = React.useState();
  const [loadFinished, setLoadFinished] = React.useState(false);
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [term, setTerm] = useState("");
  const treeRef = useRef(null);
  const { data, setData, controllers } = useDynamicTree();
  const [notificationData, setNotificationData] = React.useState([]);
  const [tilesData, setTilesData] = React.useState([]);
  const [jobsData, setJobsData] = React.useState([]);
  const [datasetsData, setDatasetsData] = React.useState([]);
  const [userData,setUserData] = React.useState(null);

  const createFileFolder = (
    <>
      <button
        onClick={() => treeRef.current.createInternal()}
        title="New Layer Group..."
      >
        <TbFolderPlus />
      </button>
      <button onClick={() => treeRef.current.createLeaf()} title="New Layer...">
        <AiOutlineFileAdd />
      </button>
    </>
  );
  async function getNotifications() {
    if(!loginSuccess){
      let loginReponse: any = await sendPostRequest({ email: "mohd109@gmail.com", user_name: "mohd109", password: "Czin1231091256"}, "http://main.sabt.shankayi.ir/api/login_user");
      setLoginSuccess(true);
    }
    let response: AxiosResponse<any,any> = await sendGetRequest("http://main.sabt.shankayi.ir/api/get_notifications");
    if(response.status==200)
    {
      return response.data;
    }
    return [];
  }

  async function getUserData() {
    if(!loginSuccess){
      let loginReponse: any = await sendPostRequest({ email: "mohd109@gmail.com", user_name: "mohd109", password: "Czin1231091256"}, "http://main.sabt.shankayi.ir/api/login_user");
      setLoginSuccess(true);
    }
    let response: AxiosResponse<any,any> = await sendGetRequest("http://main.sabt.shankayi.ir/api/get_user/mohd109");
    if(response.status==200)
    {
      return response.data;
    }
    return null;
  }
  async function getDatasets() {
    if(!loginSuccess){
      let loginReponse: any = await sendPostRequest({ email: "mohd109@gmail.com", user_name: "mohd109", password: "Czin1231091256"}, "http://main.sabt.shankayi.ir/api/login_user");
      setLoginSuccess(true);
    }
    let response: AxiosResponse<any,any> = await sendGetRequest("http://main.sabt.shankayi.ir/api/get_datasets");
    if(response.status==200)
    {
      return response.data;
    }
    return [];
  }

  async function getJobs() {
    if(!loginSuccess){
      let loginReponse: any = await sendPostRequest({ email: "mohd109@gmail.com", user_name: "mohd109", password: "Czin1231091256"}, "http://main.sabt.shankayi.ir/api/login_user");
      setLoginSuccess(true);
    }
    let response: AxiosResponse<any,any> = await sendGetRequest("http://main.sabt.shankayi.ir/api/get_jobs");
    if(response.status==200)
    {
      return response.data;
    }
    return [];
  }

  async function getTiles() {
    if(!loginSuccess){
      let loginReponse: any = await sendPostRequest({ email: "mohd109@gmail.com", user_name: "mohd109", password: "Czin1231091256"}, "http://main.sabt.shankayi.ir/api/login_user");
      setLoginSuccess(true);
    }
    let response: AxiosResponse<any,any> = await sendGetRequest("http://main.sabt.shankayi.ir/api/get_tiles");
    if(response.status==200)
    {
      return response.data;
    }
    return [];
  }

  async function getLayers() {
    if(!loginSuccess){
      let loginReponse: any = await sendPostRequest({ email: "mohd109@gmail.com", user_name: "mohd109", password: "Czin1231091256"}, "http://main.sabt.shankayi.ir/api/login_user");
      setLoginSuccess(true);
    }
    let response: AxiosResponse<any,any> = await sendGetRequest("http://main.sabt.shankayi.ir/api/get_layers");
    if(response.status==200)
    {
      return response.data;
    }
    return [];
  }
  
  async function getLayerMetadata() {
    if(!loginSuccess){
      let loginReponse: any = await sendPostRequest({ email: "mohd109@gmail.com", user_name: "mohd109", password: "Czin1231091256"}, "http://main.sabt.shankayi.ir/api/login_user");
      setLoginSuccess(true);
    }
    let response: any = await sendGetRequest("http://main.sabt.shankayi.ir/api/get_layer_metadata");
    return response.data;
  }

  const metadataColumns = [
    {
      name: 'id',
      selector: row => row.id,
    },
    {
      name: 'name',
      selector: row => row.name,
    },
    {
      name: 'creation_date_time',
      selector: row => row.creation_date_time,
    },
    {
      name: 'decription',
      selector: row => row.decription,
    },
    {
      name: 'company',
      selector: row => row.company,
    },
    {
      name: 'owner_id',
      selector: row => row.owner_id,
    },
  ];
  useEffect(() => {
    getUserData().then(response => {setUserData(response as any)})
  },[]);
  useEffect(() => {
    getNotifications().then(response => {setNotificationData(response as any)})
  },[]);
  useEffect(() => {
    getDatasets().then(response => {setDatasetsData(response as any)})
  },[]);

  useEffect(() => {
    getTiles().then(response => {setTilesData(response as any)})
  },[]);

  useEffect(() => {
    getJobs().then(response => {setJobsData(response as any)})
  },[]);
  useEffect(() => {
    getLayers().then(response => {

      response.userRasterLayers.forEach(element => {
        if (element.children !== 'None') {
          let tempChildren = [];
          let temp = element.children.replace("{","[").replace("}","]");
          let array = JSON.parse(temp);

          array.forEach(element2 => {
            let childElement = response.userRasterLayers.find((element1) => element1.id == element2)
            response.userRasterLayers=response.userRasterLayers.filter(function(element1) {
              return element1.id !== element2
            })
            childElement.id=childElement.id.toString()
            tempChildren.push(childElement);
          })
          element.children = tempChildren;
          element.id=element.id.toString()
          console.log(tempChildren);

        }
        else {
          delete element.children;
        }
      });
      response.userVectorLayers.forEach(element => {
        if (element.children !== 'None') {
          let tempChildren = [];
          let temp = element.children.replace("{","[").replace("}","]");
          let array = JSON.parse(temp);
          array.forEach(element2 => {
            let childElement = response.userVectorLayers.find((element1) => element1.id == element2)
            response.userVectorLayers=response.userVectorLayers.filter(function(element1) {
              return element1.id !== element2
            })
            childElement.id=childElement.id.toString()
            tempChildren.push(childElement);
          })
          element.children = tempChildren;
          element.id=element.id.toString()
          console.log(tempChildren);

        }
        else {
          delete element.children;
        }
      });

      console.log(response);

      setLayersData(response as any);
      setData((response as any).userRasterLayers);
      // {loadFinished? (layersData as any).vectorLayers : null}
      getLayerMetadata().then(response => {
        let tempLayersMetadata = { layers: response, columns: metadataColumns };
        setLayersMetadata(tempLayersMetadata as any);
        console.log(tempLayersMetadata);
        setLoadFinished(true);
      });
    });

  }, []);

  const hideSidebar = (e) => {
    if (autoHide) {
      setTimeout(() => {
        setCollapsed(true);
      }, 1000);
    }
  };
  const showSidebar = (e) => {
    setTimeout(() => {
      setCollapsed(false);
    }, 1000);
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
  // handle on theme change event
  const handleVisibilityOfDetail = (statusDetailInput) => {
    if (statusDetailInput !== 0) {
      if (statusDetailInput === statusDetail) {
        setVisibilityOfDetail(visibilityOfDetail === 'hidden' ? '' : 'hidden');
        setStatusDetail(statusDetailInput);
        // setCollapsed(true);
      }
      else {
        setStatusDetail(statusDetailInput);
      }
    }

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
        onMouseLeave={hideSidebar}
        onMouseEnter={showSidebar}
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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} >
          <SidebarHeader rtl={rtl} style={{ opacity: collapsed ? 0 : 0.7, marginBottom: '24px', marginTop: '16px' }} />
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
                icon={<ImportExport />}
                suffix={
                  <Badge variant="danger" shape="circle">
                    {jobsData.length}
                  </Badge>
                }
              >
                <MenuItem> Job Progress</MenuItem>
                <MenuItem> Import</MenuItem>
                <MenuItem> Export</MenuItem>
              </SubMenu>
              <SubMenu label="Layers" icon={<Layers />}>
                {/* <Tree initialData={data} /> */}
                <MenuItem onClick={() => {setData((layersData as any).userRasterLayers);handleVisibilityOfDetail(10); 
                    }}> Raster</MenuItem>
                <MenuItem onClick={() => {setData((layersData as any).userVectorLayers);handleVisibilityOfDetail(11); 
                    }}> Vector</MenuItem>
              </SubMenu>
              <SubMenu label="Search" icon={<Search />}>
                <MenuItem> Spatial</MenuItem>
                <MenuItem> Tables</MenuItem>
              </SubMenu>
              <SubMenu label="History" icon={<History />}>
                <MenuItem> Edits</MenuItem>
                <MenuItem> Uploads</MenuItem>
                <SubMenu label="Favorites">
                  <MenuItem> Locations</MenuItem>
                  <MenuItem> Queries</MenuItem>
                  <SubMenu label="Layers">
                    <MenuItem onClick={() => {setData((layersData as any).userRasterLayers);handleVisibilityOfDetail(10); 
                    }}> Raster</MenuItem>
                    <MenuItem onClick={() => {setData((layersData as any).userVectorLayers);handleVisibilityOfDetail(11); 
                    }}> Vector</MenuItem>
                  </SubMenu>
                </SubMenu>
              </SubMenu>
              <SubMenu label="Info" icon={<ShoppingCart />}>
                <MenuItem onClick={() => handleVisibilityOfDetail(20)}> Metadata/Attribute Tables</MenuItem>
                <MenuItem onClick={() => handleVisibilityOfDetail(21)}> Object Properties</MenuItem>
                <MenuItem onClick={() => handleVisibilityOfDetail(22)}> Area Statitics</MenuItem>
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
              <MenuItem icon={<Tasks />} suffix={<Badge variant={notificationData.length>0?"success":"info"}>{notificationData.length>0?"New":"0"}</Badge>}>
                Tasks
              </MenuItem>
              <SubMenu label="Settings" icon={<Settings />}>
                <MenuItem icon={<Settings />} >
                  <Switch id="rtl" checked={autoHide} onChange={handleAutoHideChange} label="Auto Hide" />
                </MenuItem>
                <MenuItem icon={<Settings />}>
                  <Switch id="rtl" checked={rtl} onChange={handleRTLChange} label="RTL" />
                </MenuItem>
                <MenuItem icon={<Settings />}>
                  <Switch id="theme" checked={theme === 'dark'} onChange={handleThemeChange} label="Dark theme"
                  />
                </MenuItem>
              </SubMenu>
              <MenuItem disabled icon={<Admin />}>
                Admin Section
              </MenuItem>

            </Menu>
          </div>
          <SidebarFooter collapsed={collapsed} user_name={userData==null? '' : userData.user_name} access_level={userData==null? 0 : userData.access_level} profile_url='/profile' />
        </div>
      </Sidebar>
      <div className={visibilityOfDetail}>

        <Sidebar
          collapsed={collapsedDetail}
          toggled={toggledDetail}
          onBackdropClick={() => setToggledDetail(false)}
          onBreakPoint={setBrokenDetail}
          image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
          rtl={rtl}
          breakPoint="md"
          backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, hasImage ? 0.9 : 1)}
          rootStyles={{
            color: themes[theme].sidebar.color,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} >
            {/* <SidebarHeader rtl={rtl} style={{ marginBottom: '24px', marginTop: '16px' }} /> */}
            <div style={{ flex: 1, marginTop: '8px', marginBottom: '8px' }}>
              <div style={{ padding: '0 8px', marginTop: '8px', marginBottom: '8px' }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  style={{ letterSpacing: '0.5px' }}
                >
                  {detailTitle[statusDetail]}
                </Typography>
              </div>
              <div className={'w-full h-full p-2 ' + (statusDetail >= 10 && statusDetail < 20 ? '' : 'hidden')}>
                <div className="folderFileActions">{createFileFolder}</div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
                <Tree
                  ref={treeRef}
                  data={data} 
                  width={260}
                  height={1000}
                  indent={24}
                  rowHeight={32}
                  // openByDefault={false}
                  searchTerm={term}
                  searchMatch={(node, term) =>
                    (node.data as any).name.toLowerCase().includes(term.toLowerCase())
                  }
                  {...controllers}
                >
                  {Node}
                </Tree>
              </div>
              <DataTable direction={rtl ? Direction.RTL : Direction.LTR} dense={true} highlightOnHover={true} theme={theme === 'dark' ? 'dark' : 'default'} className={'w-full p-2 ' + (statusDetail >= 20 && statusDetail < 30 ? '' : 'hidden')} columns={loadFinished ? (layersMetadata as any).columns : metadataColumns} data={loadFinished ? (layersMetadata as any).layers : []} />
            </div>
            {/* <SidebarFooter collapsed={collapsed} /> */}
          </div>
        </Sidebar>
      </div>

      <MarketPlace rasterLayers={loadFinished ? (layersData as any).rasterLayers : null} vectorLayers={loadFinished ? (layersData as any).vectorLayers : null} accountZoomCenter={[51.32, 35.5219]} />

    </div>
  );
};

export default MainPage