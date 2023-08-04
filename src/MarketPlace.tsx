import * as React from "react";

import mapboxgl, { MapMouseEvent } from "mapbox-gl"
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { isMobile } from "react-device-detect";

import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { LngLatLike } from "mapbox-gl";
import './pages/home/home.css';

import "@turf/boolean-intersects"

import Point from "@mapbox/point-geometry";
import booleanIntersects from "@turf/boolean-intersects";
import { truncateAddress } from "./utils";

import { useNavigate } from 'react-router-dom';


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
  // Select which mapbox-gl-draw control buttons to add to the map.
  controls: {
    polygon: false,
    trash: false,
  },

});

let notLoaded = true;

let timeToFinish;

let landLayers: any[] = [];
let lands: any[] = [], selectedType = -1, current_owner = "", errorMessage;
var map = null as any;

function MarketPlace() {
  var navigate = useNavigate();

  let clickOnLayer = false;

  function enablePolygon() {
    draw.changeMode('draw_polygon');
    clickOnLayer = true;
  };

  let zoomCenter: LngLatLike = [51.32, 35.5219];
  let zoomValue = 13;
  if (isMobile) {
    zoomCenter = [51.4582484, 35.8070157];
    zoomValue = 15;
  }

  function deletePolygon() {
    console.log(landLayers);
    let templandlayer = landLayers;
    removeFeatures(templandlayer);
    landLayers = [];
    lands = [];
    draw.deleteAll();
    draw.changeMode('simple_select');
  };
 
  function removeFeatures(features: any[]) {
    //remove features
    let fl = features.length;
    for (let index = fl - 1; index >= 0; index--) {
      if (map != null) {
        let tempfeature = features[index];
        if (map.getLayer(tempfeature)) {
          let landIdx = landLayers.indexOf(tempfeature);
          landLayers.splice(landIdx, 1);
          lands.splice(landIdx, 1);
          // console.log("lengths: " + lands.length, landLayers.length);
          // console.log("deleted layer: " + featureName);
          map.removeLayer(tempfeature);
          // console.log(map.getSource(featureName));
          if (map.getSource(tempfeature)) {
            map.removeSource(tempfeature);
            // console.log("deleted source: " + featureName);
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
  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1Ijoic2VudGluZWwwMjYxIiwiYSI6ImNsM2d4NDJrYTBibWszYnBrZGsycnQ1ZWwifQ.6BzdRZv0MooTcRq85HmsWA";

    function loadMap() {

      return new Promise<void>(resolve => {
        map = new mapboxgl.Map({
          accessToken: "pk.eyJ1Ijoic2VudGluZWwwMjYxIiwiYSI6ImNsM2d4NDJrYTBibWszYnBrZGsycnQ1ZWwifQ.6BzdRZv0MooTcRq85HmsWA",
          container: 'map',
          style: 'mapbox://styles/sentinel0261/cl3gwaxej005v14rzb9qe9i62',
          center: zoomCenter,
          zoom: zoomValue,
          pitch: 0,
          bearing: 0,
          antialias: true,
          maxZoom: 22,
          minZoom: 5,
          // maxBounds: [[51.12178, 35.6078], [51.6321, 35.9367]]
        });
        map.on('load', _ => {
          map.addLayer(
            {
              id: "wmts-test-layer",
              type: "raster",
              source: {
                type: "raster",
                tiles: [
                 "http://185.164.72.248:8089/services/tehran_sample/tiles/{z}/{x}/{y}.png"
                ],
                tileSize: 256,
                attribution:
                  ''
              },
        
              paint: {}
            });
          resolve()
        });
        map.on('load', _ => {
          resolve()
        });
      })
    }
    loadMap().then(async _ => {
      if (notLoaded) {
        await decompress();
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

      const bottomLandsMenu = document.getElementById("bottomLandsMenu")
      if (bottomLandsMenu != null) {
        let bottomLandsMenu2 = bottomLandsMenu.getBoundingClientRect();
        let bottomLandsMenuWidth2 = bottomLandsMenu2["width"];

        bottomLandsMenu.style.left = bottomBarLeft + bottomBarWidth * 0.17 - bottomLandsMenuWidth2 + 'px';
        bottomLandsMenu.style.bottom = 50 + bottomBarHeight + 'px';
      }
    }

    let selectedHexagonCoords: any[] = [];

    map.addControl(draw, 'top-right');
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
          highlightFeatures(hexagon);

        }
        else {
          console.log(hname);
          console.log(lands);
          console.log(landLayers);

          removeFeatures([hname]);
        }
      }
    });

    // }

    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);


    async function decompress() {
      map.addLayer({
        id: 'hexagons',
        type: 'fill',
        source: {
          type: 'vector',
          url: 'https://teh.land/tiles/public.tiles.json'
        },
        'source-layer': 'public.tiles',
        "minzoom": 15,
        "maxzoom": 22,
        'layout': {},
        'paint': {
          'fill-color': [
            'match',
            ['get', 'status'],
            '1',
            '#24f910',
            '2',
            '#fff001',
            '3',
            '#373d41',
            '4',
            '#6f2fa1',
            '5',
            '#10883e',
            /* other */ '#18191a'
          ],
          'fill-opacity': 0.2,
          'fill-outline-color': '#151819'

        }
      });

    }

    function highlightFeatures(features: any) {
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

    async function updateArea(e: { type: string; }) {
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
        // console.log(uniqueFeatures);
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
        highlightFeatures(uniqueFeatures);
        clickOnLayer = false;

      } else {
        if (e.type !== 'draw.delete') {
          draw.deleteAll();
        }
      }
      draw.deleteAll();

    }
    function getUniqueFeatures(features: any, comparatorProperty: string) {
      let uniqueIds = new Set();
      let uniqueFeatures: any[] = [];
      for (const feature of features) {
        const id = feature.properties[comparatorProperty];
        if (!uniqueIds.has(id)) {
          // console.log(id);
          uniqueIds.add(id);
          uniqueFeatures.push(feature);
        }
      }
      return uniqueFeatures;
    }

  }, []);


  return (<div id="marketplaceMenu" className={"h-full absolute inset-0 w-full overflow-hidden"}>
    <div id="map" className={"h-full overflow-hidden absolute inset-0 w-full"}></div>

    <svg id="bottomBar" width="669" height="58" viewBox="0 0 669 58" fill="none" xmlns="http://www.w3.org/2000/svg" className={"absolute bottom-0 left-0 duration-300"}>
      <rect x="142" width="375" height="50" rx="25" fill="#65308E" fillOpacity="0.77" shapeRendering="crispEdges" />
      <path onClick={deletePolygon} d="M603 7.44338C604.547 6.55021 606.453 6.55021 608 7.44338L619.021 13.8066C620.568 14.6998 621.521 16.3504 621.521 18.1368V30.8632C621.521 32.6496 620.568 34.3002 619.021 35.1934L608 41.5566C606.453 42.4498 604.547 42.4498 603 41.5566L591.979 35.1934C590.432 34.3002 589.479 32.6496 589.479 30.8632V18.1368C589.479 16.3504 590.432 14.6998 591.979 13.8066L603 7.44338Z" fill="#65308E" />
      <path onClick={enablePolygon} d="M650 7.44338C651.547 6.55021 653.453 6.55021 655 7.44338L666.021 13.8066C667.568 14.6998 668.521 16.3504 668.521 18.1368V30.8632C668.521 32.6496 667.568 34.3002 666.021 35.1934L655 41.5566C653.453 42.4498 651.547 42.4498 650 41.5566L638.979 35.1934C637.432 34.3002 636.479 32.6496 636.479 30.8632V18.1368C636.479 16.3504 637.432 14.6998 638.979 13.8066L650 7.44338Z" fill="#65308E" />
      <path onClick={deletePolygon} d="M603.75 27.125L603.75 24.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path onClick={deletePolygon} d="M607.25 27.125L607.25 24.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path onClick={deletePolygon} d="M597.625 20.125H613.375V20.125C612.794 20.125 612.503 20.125 612.264 20.1849C611.548 20.3642 610.989 20.9232 610.81 21.639C610.75 21.8783 610.75 22.1689 610.75 22.75V27.5C610.75 29.3856 610.75 30.3284 610.164 30.9142C609.578 31.5 608.636 31.5 606.75 31.5H604.25C602.364 31.5 601.422 31.5 600.836 30.9142C600.25 30.3284 600.25 29.3856 600.25 27.5V22.75C600.25 22.1689 600.25 21.8783 600.19 21.639C600.011 20.9232 599.452 20.3642 598.736 20.1849C598.497 20.125 598.206 20.125 597.625 20.125V20.125Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path onClick={deletePolygon} d="M603.81 16.9493C603.909 16.8562 604.129 16.774 604.435 16.7154C604.74 16.6568 605.115 16.625 605.5 16.625C605.885 16.625 606.26 16.6568 606.565 16.7154C606.871 16.774 607.091 16.8562 607.19 16.9493" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path onClick={enablePolygon} d="M652.5 16.625L653.23 15.9411L652.5 15.1629L651.77 15.9411L652.5 16.625ZM651.5 21.875C651.5 22.4273 651.948 22.875 652.5 22.875C653.052 22.875 653.5 22.4273 653.5 21.875H651.5ZM655.855 18.7411L653.23 15.9411L651.77 17.3089L654.395 20.1089L655.855 18.7411ZM651.77 15.9411L649.145 18.7411L650.605 20.1089L653.23 17.3089L651.77 15.9411ZM651.5 16.625V21.875H653.5V16.625H651.5Z" fill="white" />
      <path onClick={enablePolygon} d="M660.375 24.5L661.059 25.2295L661.837 24.5L661.059 23.7705L660.375 24.5ZM655.125 23.5C654.573 23.5 654.125 23.9477 654.125 24.5C654.125 25.0523 654.573 25.5 655.125 25.5L655.125 23.5ZM658.259 27.8545L661.059 25.2295L659.691 23.7705L656.891 26.3955L658.259 27.8545ZM661.059 23.7705L658.259 21.1455L656.891 22.6045L659.691 25.2295L661.059 23.7705ZM660.375 23.5L655.125 23.5L655.125 25.5L660.375 25.5L660.375 23.5Z" fill="white" />
      <path onClick={enablePolygon} d="M652.5 32.375L653.23 33.0589L652.5 33.8371L651.77 33.0589L652.5 32.375ZM651.5 27.125C651.5 26.5727 651.948 26.125 652.5 26.125C653.052 26.125 653.5 26.5727 653.5 27.125H651.5ZM655.855 30.2589L653.23 33.0589L651.77 31.6911L654.395 28.8911L655.855 30.2589ZM651.77 33.0589L649.145 30.2589L650.605 28.8911L653.23 31.6911L651.77 33.0589ZM651.5 32.375V27.125H653.5V32.375H651.5Z" fill="white" />
      <path onClick={enablePolygon} d="M644.625 24.5L643.941 25.2295L643.163 24.5L643.941 23.7705L644.625 24.5ZM649.875 23.5C650.427 23.5 650.875 23.9477 650.875 24.5C650.875 25.0523 650.427 25.5 649.875 25.5L649.875 23.5ZM646.741 27.8545L643.941 25.2295L645.309 23.7705L648.109 26.3955L646.741 27.8545ZM643.941 23.7705L646.741 21.1455L648.109 22.6045L645.309 25.2295L643.941 23.7705ZM644.625 23.5L649.875 23.5L649.875 25.5L644.625 25.5L644.625 23.5Z" fill="white" />
      <defs>
        <filter id="filter0_d_0_1" x="138" y="0" width="383" height="58" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
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

  </div>);
}

export default MarketPlace