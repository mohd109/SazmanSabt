import * as React from "react";

import maplibregl, { MapMouseEvent } from "maplibre-gl"
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { isMobile } from "react-device-detect";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { LngLatLike } from "maplibre-gl";
import './pages/home/home.css';
import "@turf/boolean-intersects"
import booleanIntersects from "@turf/boolean-intersects";
import { useNavigate } from 'react-router-dom';
import MeasuresControl from 'maplibre-gl-measures';
import * as MaplibreExportControl from '@watergis/maplibre-gl-export'
import TemporalControl from 'maplibre-gl-temporal-control';
import TooltipControl from '@mapbox-controls/tooltip';
import '@mapbox-controls/tooltip/src/index.css';
import { fromUrl } from 'geotiff';
import { resolvePath, isBrowser } from '@loaders.gl/core';
import { loadGeoTiff } from '@loaders.gl/geotiff';
import DeckGL from '@deck.gl/react';
import { BitmapLayer } from '@deck.gl/layers';
import type { BitmapLayerPickingInfo } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import CompassControl from '@mapbox-controls/compass';
import '@mapbox-controls/compass/src/index.css';
import ImageControl from '@mapbox-controls/image';
import '@mapbox-controls/image/src/index.css';
import InspectControl from '@mapbox-controls/inspect';
import '@mapbox-controls/inspect/src/index.css';
var utmObj = require('utm-latlng');
var utm=new utmObj();

const TIFF_URL = "http://main.sabt.shankayi.ir/sample.tif";
const bitmapLayer = new BitmapLayer({
  id: 'BitmapLayer',
  bounds: [-122.519, 37.7045, -122.355, 37.829],
  image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png',
  pickable: true
});


const pako = require('pako');
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

let draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: false,
    trash: false,
  },

});

let notLoaded = true;

let landLayers: any[] = [];
let lands: any[] = [], selectedType = -1, current_owner = "", errorMessage;

interface IProps {
  layersData: any
  accountZoomCenter: any
}

const MarketPlace: React.FC<IProps> = ({ layersData, accountZoomCenter }) => {
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
          // //console.log("lengths: " + lands.length, landLayers.length);
          // //console.log("deleted layer: " + featureName);
          map.removeLayer(tempfeature);
          // //console.log(map.getSource(featureName));
          if (map.getSource(tempfeature)) {
            map.removeSource(tempfeature);
            // //console.log("deleted source: " + featureName);
          }
        }
      }
    }

    //hide sidebar
    if (lands.length == 0) {
    }
    else {
      if (!isMobile) {
      }
    }
  }
  async function login() {
    if (!loginSuccess) {
      let loginReponse: any = await sendPostRequest({ email: "mohd109@gmail.com", user_name: "mohd109", password: "Czin1231091256" }, "http://main.sabt.shankayi.ir/api/login_user");
      setLoginSuccess(true);
      return loginReponse.id;
    }
  }
  async function getTile(tileId) {

    let response: any = await sendGetRequest("http://main.sabt.shankayi.ir/api/get_tile/" + tileId);
    if (response.status == 200) {
      return response.data;
    }

  }
  function highlightFeatures(features: any, map: any) {
    let candidateHexagons: any[] = [];
    let candidateHexagonCoords: any[] = [];

    for (let index = 0; index < features.length; index++) {
      const hexagon = features[index];
      const hname = hexagon.properties["title"];
      const geom = hexagon.geometry;
      const coords = geom.coordinates.slice();

      selectedType = lands[0].status;
      current_owner = lands[0].current_owner;

      if (selectedType != hexagon.properties["status"] || current_owner != hexagon.properties["current_owner"]) {
        errorMessage = "Please clear current selection";
        break;
      }
      if (geom.type === 'Polygon' || geom.type === 'MultiPolygon') {
        let existence = lands.find((land) => land.title == hname)
        if (existence != undefined) {
          candidateHexagons.push(existence);
          candidateHexagonCoords.push(coords[0]);
        }
      }
    }

    for (let index = 0; index < candidateHexagons.length; index++) {
      let selectedHexagonCoords: any[] = [];

      selectedHexagonCoords.push(candidateHexagonCoords[index]);
      map.addSource(candidateHexagons[index].title, {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              candidateHexagonCoords[index]
            ]
          }
        }
      });

      map.addLayer({
        'id': candidateHexagons[index].title,
        'type': 'fill',
        'source': candidateHexagons[index].title,
        'layout': {},
        'paint': {
          'fill-color': '#FFFF00',
          'fill-opacity': 0.5
        }
      });
    }

    //show sidebar only in desktop
    if (!isMobile) {
    }

    //series of get requests for land
  }

  async function updateArea(e: { type: string; }, map: any) {
    clickOnLayer = true;
    const data = draw.getAll();
    let tempSelections: any[] = [];
    if (data.features.length > 0) {
      const canvas = map.getCanvasContainer();
      const rect = canvas.getBoundingClientRect();

      let queryLayers = [] as any[];
      queryLayers.push('hexagons');

      const selectedFeatures = map.queryRenderedFeatures(data.features[0].bbox, {
        layers: queryLayers
      });

      let uniqueFeatures = getUniqueFeatures(selectedFeatures, "title");
      // //console.log(uniqueFeatures);
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

      let uniqueFeatures2 = [] as any[];
      for (let index = 0; index < uniqueFeatures.length; index++) {
        const element = uniqueFeatures[index];
        const hname = element.properties["title"];
        const price1 = element.properties["price"];
        const district1 = element.properties["district"];
        const current_owner1 = element.properties["current_owner"];
        const group_id1 = element.properties["group_id"];
        const status1 = element.properties["status"];
        const token_id1 = element.properties["token_id"];

        if (landLayers.indexOf(hname) == -1) {
          lands.push({ title: hname, price: price1, district: district1, current_owner: current_owner1, group_id: group_id1, status: status1, token_id: token_id1 });
          landLayers.push(hname);
          uniqueFeatures2.push(element);
        }
      }

      uniqueFeatures = uniqueFeatures2;
      highlightFeatures(uniqueFeatures, map);
      clickOnLayer = false;

    } else {
      if (e.type !== 'draw.delete') {
        draw.deleteAll();
      }
    }
    // draw.deleteAll();

  }
  function getUniqueFeatures(features: any, comparatorProperty: string) {
    let uniqueIds = new Set();
    let uniqueFeatures: any[] = [];
    for (const feature of features) {
      const id = feature.properties[comparatorProperty];
      if (!uniqueIds.has(id)) {
        // //console.log(id);
        uniqueIds.add(id);
        uniqueFeatures.push(feature);
      }
    }
    return uniqueFeatures;
  }
  // useEffect(() => {

  //   // fromUrl(TIFF_URL).then(tiff => {
  //     loadGeoTiff(TIFF_URL).then(data2 => {
  //       const { data } = data2;
  //       const [base] = data;
  //       for (let c = 0; c < 3; c += 1) {
  //         const selection = { c, z: 0, t: 0 };
  //         base.getRaster({ selection }).then(pixelData => {
  //           console.log(pixelData.height)
  //           console.log(pixelData.width)
  //           console.log(pixelData.height)
  //           console.log(pixelData.data.length);
  //           // console.log(pixelData.width * pixelData.height * );

  //         }
  //         );
  //       }
  //     })
  //   // });


  // });

  useEffect(() => {
    let map = null;

    // if(map!=null){
    //   map.remove();

    // }
    //console.log(layersData);


    async function loadMap(map) {


      var BingMapsKey = 'AiSRVzVu0ZltCVJcCLXe969DFZ8zf_djZvJckGiApVS5llqvsyYuphTliMzaOznj';
      var BingMapsImagerySet = 'AerialWithLabelsOnDemand'; //Alternatively, use 'AerialWithLabelsOnDemand' if you also want labels on the map.
      var BingMapsImageryMetadataUrl = `https://dev.virtualearth.net/REST/V1/Imagery/Metadata/${BingMapsImagerySet}?output=json&include=ImageryProviders&key=${BingMapsKey}`;

      fetch(BingMapsImageryMetadataUrl).then(r => r.json()).then(r => {

        var tileInfo = r.resourceSets[0].resources[0];

        //Bing Maps supports subdoamins which can make tile loading faster. Create a tile URL for each subdomain. 
        var tileUrls = [];

        tileInfo.imageUrlSubdomains.forEach(sub => {
          tileUrls.push(tileInfo.imageUrl.replace('{subdomain}', sub));
        });

        //Use the image provider info to create attributions.
        var attributions = tileInfo.imageryProviders.map(p => {
          return p.attribution;
        }).join(', ');

        //Create a style using a raster layer for the Bing Maps tiles.
        var style = {
          "glyphs": "http://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
          'version': 8,
          'terrainSource': {
            'type': 'raster-dem',
            'url': 'http://main.sabt.shankayi.ir/style.json',
            'tileSize': 256
          },
          'sources': {
            'osm': {
              'type': 'raster',
              'tiles': ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
              'tileSize': 256,
              'attribution': '&copy; OpenStreetMap Contributors',
              'maxzoom': 19
            },
            // Use a different source for terrain and hillshade layers, to improve render quality
            'terrainSource': {
              'type': 'raster-dem',
              'url': 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
              'tileSize': 256
            },
            'hillshadeSource': {
              'type': 'raster-dem',
              'url': 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
              'tileSize': 256
            },
            'bing-maps-raster-tiles': {
              'type': 'raster',
              'tiles': tileUrls,
              'tileSize': tileInfo.imageWidth,
              'attribution': attributions,

              //Offset set min/max zooms by one as Bign Maps is designed are 256 size tiles, while MapLibre is designed for 512 tiles.
              'minzoom': 1,
              'maxzoom': 20
            }
          },
          'layers': [
            {
              'id': 'hills',
              'type': 'hillshade',
              'source': 'hillshadeSource',
              'layout': { visibility: 'visible' },
              'paint': { 'hillshade-shadow-color': '#473B24' }
            },
            {
              'id': 'bing-maps-tiles',
              'type': 'raster',
              'source': 'bing-maps-raster-tiles',
              'minzoom': 0,
              'maxzoom': 23   //Let the imagery be overscaled to support deeper zoom levels.
            }
          ],
          'terrain': {
            'source': 'terrainSource',
            'exaggeration': 1
          }
        };

        map = new maplibregl.Map({
          container: 'map',
          center: zoomCenter,
          zoom: zoomValue,
          pitch: 0,
          bearing: 0,
          antialias: true,
          maxZoom: 22,
          minZoom: 5,
          style: style as any,
          // maxBounds:[[48.988211,34.502381],[49.276238,35.004091]]
        });



        let options = {
          lang: {
            areaMeasurementButtonTitle: 'Measure area',
            lengthMeasurementButtonTitle: 'Measure length',
            clearMeasurementsButtonTitle: 'Clear measurements',
          },
          units: 'metric', //or metric, the default
          unitsGroupingSeparator: ' ', // optional. use a space instead of ',' for separating thousands (3 digits group). Do not send this to use the browser default
          style: {
            text: {
              radialOffset: 0.9,
              letterSpacing: 0.05,
              color: '#D20C0C',
              haloColor: '#fff',
              haloWidth: 2,
              font: 'Klokantech Noto Sans Bold',
            },
            common: {
              midPointRadius: 3,
              midPointColor: '#D20C0C',
              midPointHaloRadius: 5,
              midPointHaloColor: '#FFF',
            },
            areaMeasurement: {
              fillColor: '#D20C0C',
              fillOutlineColor: '#D20C0C',
              fillOpacity: 0.5,
              lineWidth: 2,
            },
            lengthMeasurement: {
              lineWidth: 2,
              lineColor: "#D20C0C",
            },
          }
        };
        // map.addControl(new MaplibreExportControl.MaplibreExportControl({
        //   PageSize: MaplibreExportControl.Size.A4 as any,
        //   PageOrientation: MaplibreExportControl.PageOrientation.Landscape,
        //   Format: MaplibreExportControl.Format.PNG,
        //   DPI: MaplibreExportControl.DPI[300],
        //   Crosshair: true,
        //   PrintableArea: true,
        //   Local: 'en'
        // }), 'top-right');
        // map.on('draw.create', updateArea);
        // map.on('draw.delete', updateArea);
        // map.on('draw.update', updateArea);
        // map.addControl(new TooltipControl({
        //   getContent: (event) => `${event.lngLat.lng.toFixed(6)}, ${event.lngLat.lat.toFixed(6)}`,
        // }));
        // map.addControl(draw, 'top-right');

        // map.addControl(new CompassControl(), 'top-right');
        // const imageControl = new ImageControl();
        // map.addControl(imageControl, 'top-right');
        map.addControl(new MeasuresControl(options));
        map.addControl(
          new maplibregl.NavigationControl({
            visualizePitch: true,
            showZoom: true,
            showCompass: true
          })
        );
        // map.addControl(new InspectControl(), 'top-right');

        map.addControl(
          new maplibregl.TerrainControl({
            source: 'terrainSource',
            exaggeration: 1
          })
        );
        map.on('mousemove', (e) => {
          const bottomBar = document.getElementById('bottomBar');
          if (bottomBar != null) {
            let bottomBarRect = bottomBar.getBoundingClientRect();
            bottomBar.style.bottom = 20 + 'px';
            let bottomBarHeight = bottomBarRect["height"];
            let bottomBarWidth = bottomBarRect["width"];
            let bottomBarLeft = (window.innerWidth - bottomBarRect["width"]) / 2;
            bottomBar.style.left = bottomBarLeft + 'px';

            const saleTime = document.getElementById("saleTime")
            if (saleTime != null) {
              let saleTimeRect = saleTime.getBoundingClientRect();
              let saleTimeHeight = saleTimeRect["height"];
              let saleTimeWidth = saleTimeRect["width"];

              saleTime.style.bottom = (bottomBarHeight - 14) / 2 + 25 + 'px';
              saleTime.style.left = bottomBarLeft + bottomBarWidth * 0.22 + 'px';

              let utmObj = utm.convertLatLngToUtm(e.lngLat.lat, e.lngLat.lng, 2) as any;

              saleTime.innerText ="Lat: " + e.lngLat.lat.toFixed(6) + " , Lng: "  + e.lngLat.lng.toFixed(6) + "  |  " + "Easting: " + utmObj.Easting.toFixed(2) + " , Northing: "  + utmObj.Northing.toFixed(2)  + " , Zone: "  + utmObj.ZoneNumber + utmObj.ZoneLetter ;
            }
          }

        });
        map.on('click', 'hexagons', async (e: MapMouseEvent & { features?: any[] | undefined; } & Object) => {
          const hexagon = e?.features;
          if (hexagon && hexagon.length > 0 && draw.getMode() === 'simple_select' && !clickOnLayer) {
            const hname = hexagon[0].properties["title"];
            const price1 = hexagon[0].properties["price"];
            const district1 = hexagon[0].properties["district"];
            const current_owner1 = hexagon[0].properties["current_owner"];
            const group_id1 = hexagon[0].properties["group_id"];
            const status1 = hexagon[0].properties["status"];
            const token_id1 = hexagon[0].properties["token_id"];

            if (landLayers.indexOf(hname) == -1) {
              landLayers.push(hname);
              lands.push({ title: hname, price: price1, district: district1, current_owner: current_owner1, group_id: group_id1, status: status1, token_id: token_id1 });
              highlightFeatures(hexagon, map);

            }
            else {
              //console.log(hname);
              //console.log(lands);
              //console.log(landLayers);

              removeFeatures([hname], map);
            }
          }
        });
        setMainMap(map);

      });
    }

    loadMap(map).then(_ => {
      if (notLoaded) {
        notLoaded = false;
      }
    });

    const bottomBar = document.getElementById('bottomBar');
    if (bottomBar != null) {
      let bottomBarRect = bottomBar.getBoundingClientRect();
      bottomBar.style.bottom = 20 + 'px';
      let bottomBarHeight = bottomBarRect["height"];
      let bottomBarWidth = bottomBarRect["width"];
      let bottomBarLeft = (window.innerWidth - bottomBarRect["width"]) / 2;
      bottomBar.style.left = bottomBarLeft + 'px';


    }


    // // anyLayer is maplibre layer-object
    // map.addLayer(anyLayer1_1)
    // map.addLayer(anyLayer1_2)
    // map.addLayer(anyLayer2_1)
    // map.addLayer(anyLayer2_2)
    // map.addLayer(anyLayer3_1)
    // map.addLayer(anyLayer3_2)
    // // some layers...

    // import TemporalControl from 'maplibre-gl-temporal-control';

    // const temporalFrames = [
    //     {
    //         title:'frame1', // shown on control panel
    //         layers:[anyLayer1_1, anyLayer1_2] // set layers you want to show at one frame...
    //     },
    //         title:'frame2',
    //         layers:[anyLayer2_1, anyLayer2_2]
    //     },
    //     {
    //         title:'frame3',
    //         layers:[anyLayer3_1, anyLayer3_2]
    //     },
    //     // add frames...
    // ]

    // const temporalControl = new TemporalControl(temporalFrames, {
    //     interval: 100, // duration a frame is shown, in miliseconds
    //     position: 'top-left',
    //     performance: true // set when rendering is too slow, but frames which are not current are shown mostly transparent
    // });
    // map.addControl(temporalControl);





    // }



    // async function decompress() {
    //   map.addLayer({
    //     id: 'hexagons',
    //     type: 'fill',
    //     source: {
    //       type: 'vector',
    //       url: 'https://teh.land/tiles/public.tiles.json'
    //     },
    //     'source-layer': 'public.tiles',
    //     "minzoom": 15,
    //     "maxzoom": 22,
    //     'layout': {},
    //     'paint': {
    //       'fill-color': [
    //         'match',
    //         ['get', 'status'],
    //         '1',
    //         '#24f910',
    //         '2',
    //         '#fff001',
    //         '3',
    //         '#373d41',
    //         '4',
    //         '#6f2fa1',
    //         '5',
    //         '#10883e',
    //         /* other */ '#18191a'
    //       ],
    //       'fill-opacity': 0.2,
    //       'fill-outline-color': '#151819'
    //     }
    //   });
    // }



  }, []);

  useEffect(() => {

    var rasterLayers = layersData ? layersData.userRasterLayers : null;
    var vectorLayers = layersData ? layersData.userRasterLayers : null;
    console.log("map")
    console.log(mainMap)
    console.log("layersData")
    console.log(layersData)
    if (mainMap != null) {

      if (layersData != undefined) {

        let map = mainMap as any;

        // map.eachLayer(function (layer) {
        //   map.removeLayer(layer);
        // }); 
        //console.log("onLoad")

        if (rasterLayers != null) {
          for (let i = 0; i < rasterLayers.length; i++) {
            // console.log("added layer: " + rasterLayers[i].id)
            login().then(_ => {
              getTile(rasterLayers[i].id).then(response => {
                console.log(response)
                map.addLayer(
                  {
                    id: rasterLayers[i].id,
                    type: "raster",
                    source: {
                      type: "raster",
                      tiles: [
                        (response as any).url
                      ],
                      tileSize: 256,
                      attribution: ''
                    },
                    paint: {}
                  });
              });
            });

            if (rasterLayers[i].children !== undefined) {
              for (let j = 0; j < rasterLayers[i].children.length; j++) {
                // console.log("added layer: " + rasterLayers[i].children[j].id)
                login().then(_ => {
                  getTile(rasterLayers[i].children[j].id).then(response => {
                    map.addLayer(
                      {
                        id: rasterLayers[i].children[j].id,
                        type: "raster",
                        source: {
                          type: "raster",
                          tiles: [
                            (response as any).url

                          ],
                          tileSize: 256,
                          attribution: ''
                        },
                        paint: {}
                      });
                  });
                });

              }
            }


          }
        }

        if (vectorLayers != null) {
          for (let i = 0; i < vectorLayers.length; i++) {
            login().then(_ => {
              getTile(vectorLayers[i].id).then(response => {
                map.addSource(vectorLayers[i].id, {
                  type: 'vector',
                  url: (response as any).url
                });

                map.addLayer({
                  id: vectorLayers[i].id,
                  type: 'vector',
                  source: vectorLayers[i].id,
                });
              });
            });
            // console.log("added layer: " + vectorLayers[i].id)

            if (vectorLayers[i].children !== undefined) {
              for (let j = 0; j < vectorLayers[i].children.length; j++) {
                // console.log("added layer: " + vectorLayers[i].children[j].id)
                login().then(_ => {
                  getTile(vectorLayers[i].children[j].id).then(response => {
                    map.addSource(vectorLayers[i].children[j].id, {
                      type: 'vector',
                      url: (response as any).url
                    });

                    map.addLayer({
                      id: vectorLayers[i].children[j].id,
                      type: 'vector',
                      source: vectorLayers[i].children[j].id,
                    });
                  });
                });

              }
            }

          }
        }

        let overlay = new MapboxOverlay({
          layers: [bitmapLayer],
        });

        map.addControl(overlay);
        map.flyTo({
          center: [-122.4, 37.74]
        });
        setMainMap(map)

      }

    }

  }, [layersData])

  return (
    <div id="marketplaceMenu" className={"h-full absolute inset-0 w-full overflow-hidden"}>
      <div id="map" className={"h-full overflow-hidden absolute inset-0 w-full"}></div>
      <svg id="bottomBar" width="800" height="58" viewBox="0 0 1000 58" fill="none" xmlns="http://www.w3.org/2000/svg" className={"absolute bottom-0 left-0 duration-300"}>
        <rect x="142" width="800" height="40" rx="10" fill="#26A17B" fillOpacity="0.77" shapeRendering="crispEdges" />
        <defs>
          <filter id="filter0_d_0_1" x="138" y="0" width="800" height="58" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
          </filter>
        </defs>
      </svg>
      <a id="saleTime" className={"text-sm absolute bottom-0 left-0 text-white duration-300"}>
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
    </div>);
}

export default MarketPlace