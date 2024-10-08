import * as React from "react";

import maplibregl, { LngLat, MapMouseEvent } from "maplibre-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { isMobile } from "react-device-detect";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { LngLatLike } from "maplibre-gl";
import "./pages/home/home.css";
import "@turf/boolean-intersects";
import booleanIntersects from "@turf/boolean-intersects";
import { useNavigate } from "react-router-dom";
import MeasuresControl from "maplibre-gl-measures";
import * as MaplibreExportControl from "@watergis/maplibre-gl-export";
import TemporalControl from "maplibre-gl-temporal-control";
import TooltipControl from "@mapbox-controls/tooltip";
import "@mapbox-controls/tooltip/src/index.css";
import { fromUrl } from "geotiff";
import { resolvePath, isBrowser } from "@loaders.gl/core";
import { loadGeoTiff } from "@loaders.gl/geotiff";
import DeckGL from "@deck.gl/react";
import { BitmapLayer } from "@deck.gl/layers";
import type { BitmapLayerPickingInfo } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import CompassControl from "@mapbox-controls/compass";
import "@mapbox-controls/compass/src/index.css";
import ImageControl from "@mapbox-controls/image";
import "@mapbox-controls/image/src/index.css";
import InspectControl from "@mapbox-controls/inspect";
import "@mapbox-controls/inspect/src/index.css";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import OpacityControl from "maplibre-gl-opacity";
import { DUMMYDATA } from "./constants/dummyData";
import "./popup.scss"

var utmObj = require("utm-latlng");
var utm = new utmObj();
var opacityAdded = false;

// const TIFF_URL = "https://main.sabt.shankayi.ir/sample.tif";
// const bitmapLayer = new BitmapLayer({
//   id: 'BitmapLayer',
//   bounds: [-122.519, 37.7045, -122.355, 37.829],
//   image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png',
//   pickable: true
// });

const pako = require("pako");
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


let notLoaded = true;

let landLayers: any[] = [];
let lands: any[] = [],
  selectedType = -1,
  current_owner = "",
  errorMessage;

interface IProps {
  layersMetaData: any,
  layersData: any;
  accountZoomCenter: any;
  nodeData: any;
  spatialCheck: any;
}

const MapPage: React.FC<IProps> = ({
  layersData,
  layersMetaData,
  spatialCheck,
  accountZoomCenter,
  nodeData,
}) => {
  const [mainMap, setMainMap] = useState<maplibregl.Map>(null);
  const [loginSuccess, setLoginSuccess] = React.useState(false);

  let clickOnLayer = false;

  let zoomCenter: LngLatLike = accountZoomCenter;
  let zoomValue = 13;
  if (isMobile) {
    zoomCenter = zoomCenter;
    zoomValue = 15;
  }

  function removeFeatures(features: any[], map: any) {
    //remove features
    let fl = features.length;
    for (let index = fl - 1; index >= 0; index--) {
      if (map != null) {
        let tempfeature = features[index];
        if (map.getLayer(tempfeature)) {
          let landIdx = landLayers.indexOf(tempfeature);
          landLayers.splice(landIdx, 1);
          lands.splice(landIdx, 1);
          map.removeLayer(tempfeature);
          if (map.getSource(tempfeature)) {
            map.removeSource(tempfeature);
          }
        }
      }
    }

    //hide sidebar
    if (lands.length == 0) {
    } else {
      if (!isMobile) {
      }
    }
  }
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
      setLoginSuccess(true);
      return loginReponse.id;
    }
  }
  async function getTile(tileId) {
    let response: any = await sendGetRequest(
      "https://main.sabt.shankayi.ir/api/get_tile/" + tileId
    );
    if (response.status == 200) {
      let response2: any = await sendGetRequest(
        response.data.url.replace("http://localhost:3000", "https://main.sabt.shankayi.ir/martin")
      );
      response2.data.tiles[0] = response2.data.tiles[0].replace(
        "http://localhost:3000",
        "https://main.sabt.shankayi.ir/martin"
      );
      response2.data.tiles[0] = response2.data.tiles[0].replace(
        "http://localhost:3000",
        "https://main.sabt.shankayi.ir/martin"
      );
      return response2.data;
    }
  }
  // async function layerSelect(layer) {
  //   console.log(layer, "layer");
  // }
  // function highlightFeatures(features: any, map: any) {
  //   let candidateHexagons: any[] = [];
  //   let candidateHexagonCoords: any[] = [];

  //   for (let index = 0; index < features.length; index++) {
  //     const hexagon = features[index];
  //     const hname = hexagon.properties["title"];
  //     const geom = hexagon.geometry;
  //     const coords = geom.coordinates.slice();

  //     selectedType = lands[0].status;
  //     current_owner = lands[0].current_owner;

  //     if (
  //       selectedType != hexagon.properties["status"] ||
  //       current_owner != hexagon.properties["current_owner"]
  //     ) {
  //       errorMessage = "Please clear current selection";
  //       break;
  //     }
  //     if (geom.type === "Polygon" || geom.type === "MultiPolygon") {
  //       let existence = lands.find((land) => land.title == hname);
  //       if (existence != undefined) {
  //         candidateHexagons.push(existence);
  //         candidateHexagonCoords.push(coords[0]);
  //       }
  //     }
  //   }

  //   for (let index = 0; index < candidateHexagons.length; index++) {
  //     let selectedHexagonCoords: any[] = [];

  //     selectedHexagonCoords.push(candidateHexagonCoords[index]);
  //     map.addSource(candidateHexagons[index].title, {
  //       type: "geojson",
  //       data: {
  //         type: "Feature",
  //         geometry: {
  //           type: "Polygon",
  //           coordinates: [candidateHexagonCoords[index]],
  //         },
  //       },
  //     });

  //     map.addLayer({
  //       id: candidateHexagons[index].title,
  //       type: "fill",
  //       source: candidateHexagons[index].title,
  //       layout: {},
  //       paint: {
  //         "fill-color": "#FFFF00",
  //         "fill-opacity": 0.5,
  //       },
  //     });
  //   }

  //   //show sidebar only in desktop
  //   if (!isMobile) {
  //   }

  //   //series of get requests for land
  // }


  useEffect(() => {
    let map = null;

    async function loadMap(map) {
      // let response: any = await sendGetRequest(
      //   "https://main.sabt.shankayi.ir/martin/IranBing"
      // );
      // response.data.tiles[0] = response.data.tiles[0].replace(
      //   "http://localhost:3000",
      //   "https://main.sabt.shankayi.ir/martin"
      // );
      // let tempObject = response.data;
      // tempObject["type"] = "raster";

      var style = {
        glyphs: "https://main.sabt.shankayi.ir/glyphs/{fontstack}/{range}.pbf",
        version: 8,
        sources: {
          orthofootprints: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              name: "orthofootprints.geojson",
              crs: {
                type: "name",
                properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
              },
              features: [
                {
                  type: "Feature",
                  properties: {
                    id: 6,
                  },
                  geometry: {
                    type: "Polygon",
                    coordinates: [
                      [
                        [50.795234683798306, 35.904271950232513],
                        [51.273052018775644, 35.905222515222526],
                        [51.273368873772313, 35.646668837940354],
                        [50.794917828801637, 35.647619402930367],
                        [50.795234683798306, 35.904271950232513],
                      ],
                    ],
                  },
                },
                {
                  type: "Feature",
                  properties: {
                    id: 4,
                  },
                  geometry: {
                    type: "Polygon",
                    coordinates: [
                      [
                        [51.28477565365241, 35.820622231111813],
                        [51.451758236897142, 35.820305376115144],
                        [51.453342511880493, 35.729684847067716],
                        [51.285092508649079, 35.72873428207771],
                        [51.28477565365241, 35.820622231111813],
                      ],
                    ],
                  },
                },
                {
                  type: "Feature",
                  properties: {
                    id: 5,
                  },
                  geometry: {
                    type: "Polygon",
                    coordinates: [
                      [
                        [51.389020947556617, 35.83012788101189],
                        [51.502138181367563, 35.830444736008566],
                        [51.502305049368594, 35.770872859640484],
                        [51.389884010663401, 35.766122063410108],
                        [51.389020947556617, 35.83012788101189],
                      ],
                    ],
                  },
                },
              ],
            },
          },
          // bingsat: tempObject,
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
            maxzoom: 22
          },
          terrainSource: {
            type: "raster-dem",
            url: "https://main.sabt.shankayi.ir/martin/TehranDEM",
            tileSize: 256,
            encoding: "mapbox",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm"
          },
          {
            id: "orthofootprints",
            type: "fill",
            source: "orthofootprints",
            paint: {
              "fill-color": "#888888",
              "fill-opacity": 0.4,
            },
            filter: ["==", "$type", "Polygon"],
          },
        ],
        terrain: {
          source: "terrainSource",
          exaggeration: 1,
        },
      };

      map = new maplibregl.Map({
        container: "map",
        center: zoomCenter,
        zoom: zoomValue,
        pitch: 0,
        bearing: 0,
        antialias: true,
        maxZoom: 22,
        minZoom: 5,
        style: style as any,
      });


      // map.addControl(new MaplibreExportControl.MaplibreExportControl({
      //   PageSize: MaplibreExportControl.Size.A4 as any,
      //   PageOrientation: MaplibreExportControl.PageOrientation.Landscape,
      //   Format: MaplibreExportControl.Format.PNG,
      //   DPI: MaplibreExportControl.DPI[300],
      //   Crosshair: true,
      //   PrintableArea: true,
      //   Local: 'en'
      // }), 'bottom-right');

      // map.addControl(draw, 'bottom-right');



      const geocoderApi = {
        forwardGeocode: async (config) => {
          const features = [];
          if (config.query.includes("coords")) {
            let coords_string = config.query.replace("coords:", "");
            let coords = coords_string.split(",");
            let coordinates = [
              Number(coords[0].trim()),
              Number(coords[1].trim()),
            ];
            let coord_info = "Geographic Coordinates";
            if (coords.length == 3) {
              let tempGeoCoords = utm.convertUtmToLatLng(
                coordinates[0],
                coordinates[1],
                Number(coords[2].trim()),
                "N"
              );
              coordinates = [tempGeoCoords.lng, tempGeoCoords.lat];
              coord_info = "UTM Coordinates";
            }
            const point = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coordinates,
              },
              place_name: config.query
                .replace(":", ",")
                .replace("coords", coord_info),
              properties: [],
              text: config.query,
              place_type: ["place"],
              coordinates,
            };
            features.push(point);
          } else {
            try {
              const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
              const response = await fetch(request);
              const geojson = await response.json();
              for (const feature of geojson.features) {
                const center = [
                  feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
                  feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
                ];
                const point = {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: center,
                  },
                  place_name: feature.properties.display_name,
                  properties: feature.properties,
                  text: feature.properties.display_name,
                  place_type: ["place"],
                  center,
                };
                features.push(point);
              }
            } catch (e) {
              console.error(`Failed to forwardGeocode with error: ${e}`);
            }
          }

          return {
            features,
          };
        },
      };

      // Pass in or define a geocoding API that matches the above
      const geocoder = new MaplibreGeocoder(geocoderApi, { maplibregl });



      var side = "left";
      map.addControl(geocoder, "top-" + side);

      // let draw = new MapboxDraw({
      //   displayControlsDefault: true,
      // });

      map.addControl(new CompassControl(), "bottom-" + side);
      // const imageControl = new ImageControl();
      // map.addControl(imageControl, "bottom-" + side);

      map.addControl(
        new maplibregl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true,
        }),
        "bottom-" + side
      );
      //  map.addControl(new InspectControl(), "bottom-" + side);
      // BaseLayer

      map.addControl(
        new maplibregl.TerrainControl({
          source: "terrainSource",
          exaggeration: 1,
        }),
        "bottom-" + side
      );


      map.on("data", () => {
        // let result = map
        //   .getStyle()
        //   .layers.filter(
        //     (row) =>
        //       row["id"].length <= 2 || row["id"].includes("orthofootprints")
        //   );

        // if (false) {
        //   // console.log("result.length: %d", result.length)
        //   // console.log("opacityAdded: ", opacityAdded.toString())
        //   if (result.length === 7 && !opacityAdded) {
        //     const mapBaseLayer = {
        //       "bingsat-tiles": "bingsat-tiles",
        //     };
        //     var mapOverLayer: Record<string, string> = {
        //       "1": "1",
        //       "2": "2",
        //       "3": "3",
        //       "4": "4",
        //       "5": "5",
        //       "6": "6",
        //       orthofootprints: "orthofootprints",
        //     };

        //     let Opacity = new OpacityControl({
        //       baseLayers: mapBaseLayer,
        //       overLayers: mapOverLayer,
        //       opacityControl: true,
        //     });

        //     map.addControl(Opacity, "bottom-" + side);
        //     opacityAdded = true;
        //   }
        // }
      });

      map.on("mousemove", (e) => {
        const bottomBar = document.getElementById("bottomBar");
        if (bottomBar != null) {
          let bottomBarRect = bottomBar.getBoundingClientRect();
          bottomBar.style.bottom = 20 + "px";
          let bottomBarHeight = bottomBarRect["height"];
          let bottomBarWidth = bottomBarRect["width"];
          let bottomBarLeft = (window.innerWidth - bottomBarRect["width"]) / 2;
          bottomBar.style.left = bottomBarLeft + "px";

          const saleTime = document.getElementById("saleTime");
          if (saleTime != null) {
            let saleTimeRect = saleTime.getBoundingClientRect();
            let saleTimeHeight = saleTimeRect["height"];
            let saleTimeWidth = saleTimeRect["width"];

            saleTime.style.bottom = (bottomBarHeight - 14) / 2 + 25 + "px";
            saleTime.style.left = bottomBarLeft + bottomBarWidth * 0.22 + "px";

            let utmObj = utm.convertLatLngToUtm(
              e.lngLat.lat,
              e.lngLat.lng,
              2
            ) as any;

            saleTime.innerText =
              "Lat: " +
              e.lngLat.lat.toFixed(6) +
              " , Lng: " +
              e.lngLat.lng.toFixed(6) +
              "  |  " +
              "Easting: " +
              utmObj.Easting.toFixed(2) +
              " , Northing: " +
              utmObj.Northing.toFixed(2) +
              " , Zone: " +
              utmObj.ZoneNumber +
              utmObj.ZoneLetter +
              " , Zoom: " +
              map.getZoom().toFixed(1);
          }
        }
      });

      setMainMap(map);

      // });
    }
    // Function to convert JSON data to HTML table

    loadMap(map).then((_) => {
      if (notLoaded) {
        notLoaded = false;
      }
    });

    const bottomBar = document.getElementById("bottomBar");
    if (bottomBar != null) {
      let bottomBarRect = bottomBar.getBoundingClientRect();
      bottomBar.style.bottom = 20 + "px";
      let bottomBarHeight = bottomBarRect["height"];
      let bottomBarWidth = bottomBarRect["width"];
      let bottomBarLeft = (window.innerWidth - bottomBarRect["width"]) / 2;
      bottomBar.style.left = bottomBarLeft + "px";
    }
  }, []);
  function convert(jsonData) {


    // Get the container element where the table will be inserted
    // let container = document.getElementById("container");

    // Create the table element
    let table = document.createElement("table");
    table.className = "rwd-table";
    // Get the keys (column names) of the first object in the JSON data
    let cols = Object.keys(jsonData[0]);

    // Create the header element
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    // Loop through the column names and create header cells
    cols.forEach((item) => {
      let th = document.createElement("th");
      th.innerText = item; // Set the column name as the text of the header cell
      tr.appendChild(th); // Append the header cell to the header row
    });
    thead.appendChild(tr); // Append the header row to the header
    table.append(tr) // Append the header to the table

    // Loop through the JSON data and create table rows
    jsonData.forEach((item) => {
      let tr = document.createElement("tr");

      // Get the values of the current object in the JSON data
      let vals = Object.values(item);

      // Loop through the values and create table cells
      vals.forEach((elem) => {
        let td = document.createElement("td");
        td.innerText = elem.toString(); // Set the value as the text of the table cell
        tr.appendChild(td); // Append the table cell to the table row
      });
      table.appendChild(tr); // Append the table row to the table
    });
    // container.appendChild(table) // Append the table to the container element
    return table;
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
    try {
      var rasterLayers = layersData
        ? layersData.userRasterLayers
        : DUMMYDATA.layers.userRasterLayers;
      var vectorLayers = layersData
        ? layersData.userVectorLayers
        : DUMMYDATA.layers.userVectorLayers;
      if (mainMap != null) {
        if (layersData != undefined) {
          var map = mainMap as any;
          if (rasterLayers != null) {

            for (let i = 0; i < rasterLayers.length; i++) {
              login().then((_) => {
                getTile(rasterLayers[i].id).then((response) => {
                  let tempObject = response as any;
                  tempObject["type"] = "raster";
                  map.addLayer({
                    id: rasterLayers[i].id.toString(),
                    type: "raster",
                    source: tempObject,
                    paint: {},
                    visibility: 'none',

                  });
                });
              });

              if (rasterLayers[i].children !== undefined) {
                for (let j = 0; j < rasterLayers[i].children.length; j++) {
                  login().then((_) => {
                    getTile(rasterLayers[i].children[j].id).then((response) => {
                      let tempObject = response as any;
                      tempObject["type"] = "raster";
                      map.addLayer({
                        id: rasterLayers[i].children[j].id.toString(),
                        type: "raster",
                        source: tempObject,
                        paint: {},
                        visibility: 'none',

                      });
                    });
                  });
                }
              }
            }
          }

          if (vectorLayers != null) {
            for (let i = 0; i < vectorLayers.length; i++) {
              login().then((_) => {
                getTile(vectorLayers[i].id).then((response) => {
                  let tempObject = response as any;
                  tempObject["type"] = "vector";
                  map.addSource(vectorLayers[i].id.toString(), tempObject);
                  map.addLayer({
                    id: vectorLayers[i].id.toString(),
                    type: "line",
                    source: vectorLayers[i].id.toString(),
                    "source-layer": tempObject.vector_layers[0].id,
                    visibility: 'none',
                    // 'paint': {
                    // 'fill-color': 'transparent',
                    // 'fill-opacity': 0.15
                    // }
                  });
                });
              });

              if (vectorLayers[i].children !== undefined) {
                for (let j = 0; j < vectorLayers[i].children.length; j++) {
                  login().then((_) => {
                    getTile(vectorLayers[i].children[j].id).then((response) => {
                      let tempObject = response as any;
                      tempObject["type"] = "vector";
                      map.addSource(
                        vectorLayers[i].children[j].id.toString(),
                        tempObject
                      );
                      map.addLayer({
                        id: vectorLayers[i].children[j].id.toString(),
                        type: "line",
                        source: vectorLayers[i].children[j].id.toString(),
                        "source-layer": tempObject.vector_layers[0].id,
                        visibility: 'none',
                        // 'paint': {
                        // 'fill-color': 'transparent',
                        // 'fill-opacity': 0.15
                        // }
                      });
                    });
                  });
                }
              }
            }
          }
          let options = {
            lang: {
              areaMeasurementButtonTitle: "اندازه گیری مساحت",
              lengthMeasurementButtonTitle: "اندازه گیری طول",
              clearMeasurementsButtonTitle: "پاک کردن",
            },
            units: "metric", //or metric, the default
            unitsGroupingSeparator: " ", // optional. use a space instead of ',' for separating thousands (3 digits group). Do not send this to use the browser default
            style: {
              text: {
                radialOffset: 0.9,
                letterSpacing: 0.05,
                color: "#D20C0C",
                haloColor: "#fff",
                haloWidth: 2,
                font: 'Klokantech Noto Sans Bold',
              },
              common: {
                midPointRadius: 3,
                midPointColor: "#D20C0C",
                midPointHaloRadius: 5,
                midPointHaloColor: "#FFF",
              },
              areaMeasurement: {
                fillColor: "#D20C0C",
                fillOutlineColor: "#D20C0C",
                fillOpacity: 0.5,
                lineWidth: 2,
              },
              lengthMeasurement: {
                lineWidth: 2,
                lineColor: "#D20C0C",
              },
            },
            onRender: featureRenderCallback,
            onCreate: featureCreateCallback
          };
          function featureRenderCallback(feature) {
            console.log("Feature rendered:", feature);
          }

          function featureCreateCallback(feature) {
            console.log("Feature created:", feature);
          }
          let measure = new MeasuresControl(options);
          // map.addControl(draw, "bottom-" + side);
          var side = "left";

          map.addControl(measure, "bottom-" + side);
          async function updateArea(e: { type: string }, map1: any) {
            map1 = mainMap;
            clickOnLayer = true;
            const data = measure._drawCtrl.getAll();
            let tempSelections: any[] = [];
            if (data.features.length > 0) {

              let queryLayers = [] as any[];
              queryLayers.push("orthofootprints");

              const selectedFeatures = map1.queryRenderedFeatures(
                data.features[0].bbox,
                {
                  layers: queryLayers,
                }
              );

              let uniqueFeatures = getUniqueFeatures(selectedFeatures, "id");
              let uniqueFeaturesLength = uniqueFeatures.length;
              for (let index1 = 0; index1 < data.features.length; index1++) {
                const element1 = data.features[index1];
                for (let index = uniqueFeaturesLength - 1; index >= 0; index--) {
                  const element = uniqueFeatures[index];
                  if (!booleanIntersects(element, element1)) {
                    uniqueFeatures.splice(index, 1);
                  }
                }
              }
              let completeFeatures = [];

              uniqueFeatures.forEach((feature) => {
                const result = layersMetaData.find(({ id }) => id === feature.properties.id);
                completeFeatures.push(result);
              });
              let description = convert(completeFeatures).outerHTML;
              console.log(uniqueFeatures);     
              let popupPost = new LngLat(data.features[0].geometry.coordinates[0][0][0],data.features[0].geometry.coordinates[0][0][1] );
              console.log(popupPost);     

              new maplibregl.Popup()
                .setLngLat(popupPost)
                .setHTML(description)
                .setMaxWidth("800px")
                .addTo(map1);
              setMainMap(map1);

              clickOnLayer = false;
            } else {
              if (e.type !== "draw.delete") {
                measure._drawCtrl.deleteAll();
              }
            }
          }
          function getUniqueFeatures(features: any, comparatorProperty: string) {
            let uniqueIds = new Set();
            let uniqueFeatures: any[] = [];
            for (const feature of features) {
              const id = feature.properties[comparatorProperty];
              if (!uniqueIds.has(id)) {
                uniqueIds.add(id);
                uniqueFeatures.push(feature);
              }
            }
            return uniqueFeatures;
          }

          map.on('draw.create', updateArea);
          map.on('draw.delete', updateArea);
          map.on('draw.update', updateArea);

          // let overlay = new MapboxOverlay({
          //   layers: [bitmapLayer],
          // });

          // map.addControl(overlay);
          // map.flyTo({
          //   center: [-122.4, 37.74]
          // });
          getLayerMetadata().then((response2) => {
            layersMetaData = response2;
          });
          map.on("click", "orthofootprints", (e) => {
            console.log(e.features.length);
            let completeFeatures = [];

            e.features.forEach((feature) => {
              const result = layersMetaData.find(({ id }) => id === feature.properties.id);
              completeFeatures.push(result);
            });
            let description = convert(completeFeatures).outerHTML;

            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(description)
              .setMaxWidth("800px")
              .addTo(map);
            setMainMap(map);

            // const hexagon = e?.features;
            // // && draw.getMode() === 'simple_select'
            // if (hexagon && hexagon.length > 0 && !clickOnLayer) {
            //   const title1 = hexagon[0].properties["title"];
            //   const perimeter1 = hexagon[0].properties["perimeter"];
            //   const area1 = hexagon[0].properties["area"];

            //   if (landLayers.indexOf(title1) == -1) {
            //     landLayers.push(title1);
            //     lands.push({ title: title1, perimeter: perimeter1, area: area1 });
            //     // highlightFeatures(hexagon, map);

            //   }
            //   else {
            //     removeFeatures([title1], map);
            //   }
            // }
          });

          setMainMap(map);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [layersData, mainMap]);

  useEffect(() => {
    if (nodeData !== undefined) {
      if (nodeData.length > 0) {
        var map = mainMap as any;

        console.log(nodeData, "nodeData");
        const visibility = map.getLayoutProperty(
          nodeData[0].data.id,
          'visibility'
        );

        if (visibility === 'visible') {
          map.setLayoutProperty(nodeData[0].data.id, 'visibility', 'none');
        } else {
          map.setLayoutProperty(
            nodeData[0].data.id,
            'visibility',
            'visible'
          );
        }
        setMainMap(map);
      }

    }

  }, [nodeData]);

  useEffect(() => {
    if (spatialCheck != 0) {
      console.log("spatial map function triggered");
    }
  }, [spatialCheck]);

  return (
    <div
      id="mappageMenu"
      className={"h-full absolute inset-0 w-full overflow-hidden"}
    >
      <div
        id="map"
        className={"h-full overflow-hidden absolute inset-0 w-full"}
      ></div>
      <svg
        id="bottomBar"
        width="1000"
        height="58"
        viewBox="0 0 1200 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={"absolute bottom-0 left-0 duration-300"}
      >
        <rect
          x="142"
          width="1000"
          height="40"
          rx="10"
          fill="#26A17B"
          fillOpacity="0.77"
          shapeRendering="crispEdges"
        />
        <defs>
          <filter
            id="filter0_d_0_1"
            x="138"
            y="0"
            width="1000"
            height="58"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_0_1"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_0_1"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
      <a
        id="saleTime"
        className={"text-sm absolute bottom-0 left-0 text-white duration-300"}
      >
        Current sale finishes in
      </a>
      {/* <DeckGL
        initialViewState={{
          longitude: -122.4 as any,
          latitude: 37.74 as any,
          zoom: 11 as any
        }}
        controller
        getTooltip={({ bitmap }: BitmapLayerPickingInfo) => bitmap && `${bitmap.pixel}`}
        layers={[layer]} /> */}
    </div>
  );
};
export default MapPage;
