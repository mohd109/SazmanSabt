import * as React from "react";

import mapboxgl, { MapMouseEvent } from "mapbox-gl"
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { isMobile } from "react-device-detect";

import axios, { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { LngLatLike } from "mapbox-gl";
import "@turf/boolean-intersects"
import Point from "@mapbox/point-geometry";
import booleanIntersects from "@turf/boolean-intersects";
import { useNavigate } from 'react-router-dom';
import './Map.css';


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

let landLayers: any[] = [];
let lands: any[] = [], selectedType = -1, current_owner = "", errorMessage;
var map = null as any;

function MarketPlace() {
  var navigate = useNavigate();
  const mapContainerRef = useRef(null);

  let clickOnLayer = false;

  function enablePolygon() {
    draw.changeMode('draw_polygon');
    clickOnLayer = true;
  };



  let zoomCenter: LngLatLike = [51.3347, 35.7219];
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

  }
  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1Ijoic2VudGluZWwwMjYxIiwiYSI6ImNsM2d4NDJrYTBibWszYnBrZGsycnQ1ZWwifQ.6BzdRZv0MooTcRq85HmsWA";

    function loadMap() {

      return new Promise<void>(resolve => {
        map = new mapboxgl.Map({
          accessToken: "pk.eyJ1Ijoic2VudGluZWwwMjYxIiwiYSI6ImNsM2d4NDJrYTBibWszYnBrZGsycnQ1ZWwifQ.6BzdRZv0MooTcRq85HmsWA",
          container: mapContainerRef.current,
          style: 'mapbox://styles/sentinel0261/cl3gwaxej005v14rzb9qe9i62',
          center: zoomCenter,
          zoom: zoomValue,
          pitch: 0,
          bearing: 0,
          antialias: true,
          maxZoom: 22,
          minZoom: 13,
          maxBounds: [[51.12178, 35.6078], [51.6321, 35.9367]]
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
 
  return (
    <div>
    <div className='map-container' ref={mapContainerRef} />
  </div>);
}

export default MarketPlace