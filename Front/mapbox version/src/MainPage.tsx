import React, { useEffect } from "react";
// import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from '../src';
import { Switch } from "./components/sidebar/Switch";
import { SidebarHeader } from "./components/sidebar/SidebarHeader";
import { History } from "./icons/History";
import { ImportExport } from "./icons/ImportExport";
import { Layers } from "./icons/Layers";
import { Search } from "./icons/Search";
import { Settings } from "./icons/Settings";
import { Tasks } from "./icons/Tasks";
import { ShoppingCart } from "./icons/ShoppingCart";
import { Admin } from "./icons/Admin";
import { SidebarFooter } from "./components/sidebar/SidebarFooter";
import { Badge } from "./components/sidebar/Badge";
import { Typography } from "./components/sidebar/Typography";
import { PackageBadges } from "./components/sidebar/PackageBadges";
import { Menu, MenuItemStyles } from "./components/sidebar/Menu";
import { menuClasses } from "./utils/utilityClasses";
import { MenuItem } from "./components/sidebar/MenuItem";
import { SubMenu } from "./components/sidebar/SubMenu";
import { Sidebar } from "./components/sidebar/Sidebar";
import MapPage from "./MapPage";
import DataTable from "react-data-table-component";
import { Direction } from "react-data-table-component";
import axios, { AxiosResponse } from "axios";
import { useRef, useState } from "react";
import { Tree } from "react-arborist";
import Node from "./components/sidebar/Node";
import { TbFolderPlus } from "react-icons/tb";
import { AiOutlineFileAdd } from "react-icons/ai";
import { useDynamicTree } from "react-arborist";
import { LANGUAGES } from "./constants";
import { DUMMYDATA } from "./constants/dummyData";
import { useTranslation } from "react-i18next";
import { width } from "./theme";
// import initGdalJs from 'gdal3.js';

const DEFAULT_OPTION = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};
async function sendPostRequest(
  body: any,
  endPoint: string
): Promise<AxiosResponse> {
  let response = await axios.post(endPoint, body, DEFAULT_OPTION);
  return response;
}

async function sendGetRequest(endPoint: string): Promise<AxiosResponse> {
  let response = await axios.get(endPoint, DEFAULT_OPTION);
  return response;
}

type Theme = "light" | "dark";
type VisibilityOfDetail = "" | "hidden";

const detailTitle = {
  10: "rasterLayers",
  11: "vectorLayers",
  20: "attributeTable",
  21: "properties",
  22: "statistics",
};
const themes = {
  light: {
    sidebar: {
      backgroundColor: "#ffffff",
      color: "#607489",
    },
    menu: {
      menuContent: "#fbfcfd",
      icon: "#26A17B",
      hover: {
        backgroundColor: "#727372",
        color: "#ffffff",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: "#1f1f1f",
      color: "#cccccc",
    },
    menu: {
      menuContent: "#083b2b",
      icon: "#26A17B",
      hover: {
        backgroundColor: "#727372",
        color: "#050505",
      },
      disabled: {
        color: "#18634c",
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
  const [autoHide, setAutoHide] = React.useState(false);
  const [toggled, setToggled] = React.useState(true);
  const [broken, setBroken] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>("dark");
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
  const mapRef = useRef(null);
  const { data, setData, controllers } = useDynamicTree();
  const [notificationData, setNotificationData] = React.useState([]);
  const [tilesData, setTilesData] = React.useState([]);
  const [jobsData, setJobsData] = React.useState([]);
  const [datasetsData, setDatasetsData] = React.useState([]);
  const [userData, setUserData] = React.useState(null);
  const [userId, setUserId] = React.useState(-1);
  const { i18n, t } = useTranslation();
  const [sideBarRenderControl, setSideBarRenderControl] = React.useState(0);
  const [metadataColumns, setMetadataColumns] = React.useState([
    {
      name: t("id"),
      selector: (row) => row.id,
      sortable: true,
      sortField: "id",
      maxWidth: "20",
    },
    {
      name: t("name"),
      selector: (row) => row.name,
    },
    {
      name: t("creation_date_time"),
      selector: (row) => row.creation_date_time,
    },
    {
      name: t("decription"),
      selector: (row) => row.decription,
    },
    {
      name: t("company"),
      selector: (row) => row.company,
    },
    {
      name: t("owner_id"),
      selector: (row) => row.owner_id,
    },
    {
      name: t("area"),
      selector: (row) => row.area,
    },
  ]);

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

  async function login() {
    if (!loginSuccess) {
      let loginReponse: any = await sendPostRequest(
        {
          email: "mohd109@gmail.com",
          user_name: "mohd109",
          password: "Czin1231091256",
        },
        "https://main.sabt.shankayi.ir/api/login_user"
      );
      setUserId(loginReponse.id);
      setLoginSuccess(true);
      return loginReponse.id;
    }
    return userId;
  }

  async function getNotifications() {
    await login();
    try {
      let response: AxiosResponse<any, any> = await sendGetRequest(
        "https://main.sabt.shankayi.ir/api/notifications"
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      return DUMMYDATA.notifications;
    }
  }

  async function getUserData() {
    try {
      login().then(async (r) => {
        let response: AxiosResponse<any, any> = await sendGetRequest(
          "https://main.sabt.shankayi.ir/api/user/2"
        );
        if (response.status == 200) {
          return response.data;
        }
      });
    } catch (error) {
      return DUMMYDATA.userData;
    }
  }
  async function getDatasets() {
    try {
      await login();

      let response: AxiosResponse<any, any> = await sendGetRequest(
        "https://main.sabt.shankayi.ir/api/datasets"
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      return DUMMYDATA.dataSets;
    }
  }

  async function getJobs() {
    try {
      await login();
      let response: AxiosResponse<any, any> = await sendGetRequest(
        "https://main.sabt.shankayi.ir/api/jobs"
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      return DUMMYDATA.jobs;
    }
  }

  async function getTiles() {
    try {
      await login();
      let response: AxiosResponse<any, any> = await sendGetRequest(
        "https://main.sabt.shankayi.ir/api/tiles"
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      return DUMMYDATA.tiles;
    }
  }

  async function getLayers() {
    await login();
    try {
      let response: AxiosResponse<any, any> = await sendGetRequest(
        "https://main.sabt.shankayi.ir/api/layers"
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      return DUMMYDATA.layers;
    }
  }

  async function getLayerMetadata() {
    try {
      await login();
      let response: any = await sendGetRequest(
        "https://main.sabt.shankayi.ir/api/get_layer_metadata"
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      return DUMMYDATA.layerMetaData;
    }
  }

  useEffect(() => {
    getUserData().then((response) => {
      setUserData(response as any);
    });
  }, []);
  useEffect(() => {
    getNotifications().then((response) => {
      setNotificationData(response as any);
    });
  }, []);
  useEffect(() => {
    getDatasets().then((response) => {
      setDatasetsData(response as any);
    });
  }, []);

  useEffect(() => {
    getTiles().then((response) => {
      setTilesData(response as any);
    });
  }, []);

  useEffect(() => {
    getJobs().then((response) => {
      setJobsData(response as any);
    });
  }, []);
  useEffect(() => {
    getLayers().then((response) => {
      response.userRasterLayers.forEach((element) => {
        if (element.children !== "None") {
          let tempChildren = [];
          let temp = element.children.replace("{", "[").replace("}", "]");
          let array = JSON.parse(temp);

          array.forEach((element2) => {
            let childElement = response.userRasterLayers.find(
              (element1) => element1.id == element2
            );
            response.userRasterLayers = response.userRasterLayers.filter(
              function (element1) {
                return element1.id !== element2;
              }
            );
            childElement.id = childElement.id.toString();
            tempChildren.push(childElement);
          });
          element.children = tempChildren;
          element.id = element.id.toString();
          //console.log(tempChildren);
        } else {
          delete element.children;
        }
      });
      response.userVectorLayers.forEach((element) => {
        if (element.children !== "None") {
          let tempChildren = [];
          let temp = element.children.replace("{", "[").replace("}", "]");
          let array = JSON.parse(temp);
          array.forEach((element2) => {
            let childElement = response.userVectorLayers.find(
              (element1) => element1.id == element2
            );
            response.userVectorLayers = response.userVectorLayers.filter(
              function (element1) {
                return element1.id !== element2;
              }
            );
            childElement.id = childElement.id.toString();
            tempChildren.push(childElement);
          });
          element.children = tempChildren;
          element.id = element.id.toString();
          //console.log(tempChildren);
        } else {
          delete element.children;
        }
      });

      //console.log(response);

      setLayersData(response as any);
      setData((response as any).userRasterLayers);
      getLayerMetadata().then((response) => {
        let tempLayersMetadata = { layers: response, columns: metadataColumns };
        setLayersMetadata(tempLayersMetadata as any);
        setLoadFinished(true);
      });
    });
  }, []);

  // useEffect(() => {
  //   test();
  // }, [i18n.language]);

  const hideSidebar = (e) => {
    if (autoHide) {
      setTimeout(() => {
        setCollapsed(true);
      }, 100);
    }
  };
  const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang_code = e.target.value;
    handleRTLChange(e.target.value);
    i18n.changeLanguage(lang_code);
  };

  const showSidebar = (e) => {
    setTimeout(() => {
      setCollapsed(false);
    }, 100);
  };
  // handle on RTL change event
  const handleRTLChange = (lang) => {
    console.log(lang, "lang");
    if (lang == "en") {
      setRtl(false);
    } else {
      setRtl(true);
    }
  };
  // handle on RTL change event
  const handleAutoHideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoHide(e.target.checked);
  };
  // handle on theme change event
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "dark" : "light");
  };
  const nodeClick = (node) => {
    console.log(node, "test");
    console.log(mapRef, "mapRef");
    console.log(treeRef, "treeRef");
    // mapRef.current?.layerSelect("asd");
  };
  const test = () => {
    setMetadataColumns([
      {
        name: t("id"),
        selector: (row) => row.id,
        sortable: true,
        sortField: "id",
        maxWidth: "20",
      },
      {
        name: t("name"),
        selector: (row) => row.name,
      },
      {
        name: t("creation_date_time"),
        selector: (row) => row.creation_date_time,
      },
      {
        name: t("decription"),
        selector: (row) => row.decription,
      },
      {
        name: t("company"),
        selector: (row) => row.company,
      },
      {
        name: t("owner_id"),
        selector: (row) => row.owner_id,
      },
      {
        name: t("area"),
        selector: (row) => row.area,
      },
    ]);
    getLayerMetadata().then((response) => {
      let tempLayersMetadata = { layers: response, columns: metadataColumns };
      setLayersMetadata(tempLayersMetadata as any);
      setLoadFinished(true);
    });
    console.log(metadataColumns, "metadataColumns");
  };
  // handle on theme change event
  const handleVisibilityOfDetail = (statusDetailInput) => {
    console.log(statusDetailInput, "statusDetailInput");
    console.log(statusDetail, "statusDetail");
    if (statusDetailInput !== 0) {
      if (statusDetailInput === statusDetail) {
        setVisibilityOfDetail(visibilityOfDetail === "hidden" ? "" : "hidden");
        setStatusDetail(statusDetailInput);
        // setCollapsed(true);
      } else {
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
      fontSize: "13px",
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(
              themes[theme].menu.menuContent,
              hasImage && !collapsed ? 0.4 : 1
            )
          : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: hexToRgba(
          themes[theme].menu.hover.backgroundColor,
          hasImage ? 0.8 : 1
        ),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  // console.log(layersData)
  return (
    <div
      className={"flex h-full absolute inset-0 w-full overflow-hidden"}
      style={{ direction: rtl ? "rtl" : "ltr" }}
    >
      <Sidebar
        onMouseLeave={hideSidebar}
        onMouseEnter={showSidebar}
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        image=""
        rtl={rtl}
        breakPoint="md"
        backgroundColor={hexToRgba(
          themes[theme].sidebar.backgroundColor,
          hasImage ? 0.9 : 1
        )}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <SidebarHeader
            rtl={rtl}
            style={{
              opacity: collapsed ? 0 : 0.7,
              marginBottom: "24px",
              marginTop: "16px",
            }}
          />
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <div style={{ padding: "0 24px", marginBottom: "8px" }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}
              >
                {t("general")}
              </Typography>
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label={`${t("import")}/${t("export")}`}
                icon={<ImportExport />}
                suffix={
                  <Badge variant="danger" shape="circle">
                    {jobsData.length}
                  </Badge>
                }
              >
                {/* <MenuItem> Job Progress</MenuItem> */}
                <MenuItem> {t("import")}</MenuItem>
                <MenuItem> {t("export")}</MenuItem>
              </SubMenu>
              <SubMenu label={t("layers")} icon={<Layers />}>
                {/* <Tree initialData={data} /> */}
                <MenuItem
                  onClick={() => {
                    setData((layersData as any).userRasterLayers);
                    handleVisibilityOfDetail(10);
                  }}
                >
                  {" "}
                  {t("raster")}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setData((layersData as any).userVectorLayers);
                    handleVisibilityOfDetail(11);
                  }}
                >
                  {" "}
                  {t("vector")}
                </MenuItem>
              </SubMenu>
              <SubMenu label={t("search")} icon={<Search />}>
                <MenuItem> {t("spatial")}</MenuItem>
                <MenuItem> {t("tables")}</MenuItem>
              </SubMenu>
              {/* <SubMenu label="History" icon={<History />}>
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
              </SubMenu> */}
              <SubMenu label={t("info")} icon={<ShoppingCart />}>
                <MenuItem onClick={() => handleVisibilityOfDetail(20)}>
                  {" "}
                  {t("metadata")}
                </MenuItem>
                <MenuItem onClick={() => handleVisibilityOfDetail(21)}>
                  {" "}
                  {t("objectProperties")}
                </MenuItem>
                <MenuItem onClick={() => handleVisibilityOfDetail(22)}>
                  {" "}
                  {t("areaStatitics")}
                </MenuItem>
              </SubMenu>
            </Menu>

            <div
              style={{
                padding: "0 24px",
                marginBottom: "8px",
                marginTop: "32px",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}
              >
                {t("extra")}
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles}>
              {/* <MenuItem icon={<Tasks />} suffix={<Badge variant={notificationData.length>0?"success":"info"}>{notificationData.length>0?"New":"0"}</Badge>}>
                Tasks
              </MenuItem> */}
              <SubMenu label={t("settings")} icon={<Settings />}>
                <MenuItem>
                  <Switch
                    id="rtl"
                    checked={autoHide}
                    onChange={handleAutoHideChange}
                    label={t("autoHide")}
                  />
                </MenuItem>
                {/* <MenuItem>
                  <Switch
                    id="rtl"
                    checked={rtl}
                    onChange={handleRTLChange}
                    label="RTL"
                  />
                </MenuItem> */}
                <MenuItem>
                  <Switch
                    id="theme"
                    checked={theme === "dark"}
                    onChange={handleThemeChange}
                    label={t("darkTheme")}
                  />
                </MenuItem>
                <MenuItem>
                  <select defaultValue={i18n.language} onChange={onChangeLang}>
                    {LANGUAGES.map(({ code, label }) => (
                      <option key={code} value={code}>
                        {label}
                      </option>
                    ))}
                  </select>
                </MenuItem>
              </SubMenu>
              {/* <MenuItem disabled icon={<Admin />}>
                Admin Section
              </MenuItem> */}
            </Menu>
          </div>
          <SidebarFooter collapsed={collapsed} />
        </div>
      </Sidebar>
      <div className={visibilityOfDetail}>
        <Sidebar
          collapsed={collapsedDetail}
          toggled={toggledDetail}
          onBackdropClick={() => setToggledDetail(false)}
          onBreakPoint={setBrokenDetail}
          image=""
          rtl={rtl}
          breakPoint="md"
          backgroundColor={hexToRgba(
            themes[theme].sidebar.backgroundColor,
            hasImage ? 0.9 : 1
          )}
          rootStyles={{
            color: themes[theme].sidebar.color,
          }}
          style={{ width: "auto" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {/* <SidebarHeader rtl={rtl} style={{ marginBottom: '24px', marginTop: '16px' }} /> */}
            <div style={{ flex: 1, marginTop: "8px", marginBottom: "8px" }}>
              <div
                style={{
                  padding: "0 8px",
                  marginTop: "8px",
                  marginBottom: "8px",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  style={{ letterSpacing: "0.5px" }}
                >
                  {t(detailTitle[statusDetail])}
                </Typography>
              </div>
              <div
                className={
                  "w-full h-full p-2 " +
                  (statusDetail >= 10 && statusDetail < 20 ? "" : "hidden")
                }
              >
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
                    (node.data as any).name
                      .toLowerCase()
                      .includes(term.toLowerCase())
                  }
                  {...controllers}
                  onSelect={nodeClick}
                >
                  {Node}
                </Tree>
              </div>
              <DataTable
                direction={rtl ? Direction.RTL : Direction.LTR}
                dense={true}
                highlightOnHover={true}
                theme={theme === "dark" ? "dark" : "default"}
                className={
                  "w-full p-2 " +
                  (statusDetail >= 20 && statusDetail < 30 ? "" : "hidden")
                }
                columns={
                  loadFinished
                    ? (layersMetadata as any).columns
                    : metadataColumns
                }
                data={loadFinished ? (layersMetadata as any).layers : []}
              />
              {/* <button onClick={() => test()}>
                <TbFolderPlus />
              </button> */}
            </div>
            {/* <SidebarFooter collapsed={collapsed} /> */}
          </div>
        </Sidebar>
      </div>
      <div ref={mapRef}>
        <MapPage layersData={layersData} accountZoomCenter={[51.32, 35.5219]} />
      </div>
    </div>
  );
}

export default MainPage;
