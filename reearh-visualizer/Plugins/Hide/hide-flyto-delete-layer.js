let pluginLayerIds = [];
const layers = reearth.layers.layers

let presetLayers = layers.filter(layer => !pluginLayerIds.includes(layer.id));
let pluginLayers = layers.filter(layer => pluginLayerIds.includes(layer.id));


const generateLayerItem = (layer, isPreset) => {
  return `
    <li>
      <span id="layer-name">${layer.title}</span>
      <div class="actions">
        <input 
          type="checkbox" 
          id="show-hide-layer" 
          data-layer-id="${layer.id}"
          ${layer.visible ? "checked" : ""} 
        />
        <button class="fly-to-layer" data-layer-id="${layer.id}">Flyto</button>
        ${!isPreset
      ? `<button class="delete-layer"  data-layer-id="${layer.id}">Delete</button>`
      : ""}
      </div>
    </li>
  `;
};

let pluginLayerItems = pluginLayers.map(layer => generateLayerItem(layer, false)).join('');
let presetLayerItems = presetLayers.map(layer => generateLayerItem(layer, true)).join('');



function updateGeoJSONLayerList() {

  let pluginLayers = reearth.layers.layers.filter(layer => pluginLayerIds.includes(layer.id));
  console.log(reearth.layers.layers);

  let pluginLayerItems = pluginLayers.map(layer => generateLayerItem(layer, false)).join('');

  reearth.ui.postMessage({
    type: "updated",
    message: pluginLayerItems
  });
}

reearth.ui.show(`
  <style>
  body,
h2,
h3 {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #121212; /* Dark background */
  color: #e0e0e0; /* Light text */
}

h2,
h3 {
  text-align: center;
  margin: 20px;
  color: #ffffff; /* White headings */
}

#wrapper {
  background: #1e1e1e; /* Dark container */
  color: #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* Darker shadow */
}

.flex-center {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.layers-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.layers-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  padding: 8px 12px;
  background: #2c2c2c; /* Dark list items */
  border-radius: 4px;
}

#layer-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  color: #ffffff; /* White text for layer names */
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

button {
  padding: 4px 8px; /* Slightly larger padding for better visibility */
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px; /* Maintain original font size */
}

button:hover {
  background: #45a049;
}

.fly-to-layer, 
#show-hide-layer {
  cursor: pointer;
  color: #e0e0e0; /* Light color for icons */
}

/* Add icon color for better visibility */
.fly-to-layer:hover, 
#show-hide-layer:hover {
  color: #4CAF50;
}
  </style>

  <div id="wrapper">
  <button id="importButton">Import Data</button>
    <p>Area: <span id="area"></span></p>
    <p>Length: <span id="length"></span></p>

    <h2>Layers</h2>

  <h3>Preset Layers</h3>
  <ul id="presetLayers class="layers-list">
    ${presetLayerItems}
  </ul>

  <h3>Plugin Layers</h3>
  <ul id="pluginLayers" class="layers-list">
    ${pluginLayerItems}
  </ul>
</div>
  <script src="https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js"></script>

  <script type="text/javascript"
    src="https://cdn.jsdelivr.net/npm/gdal3.js@2.8.1/dist/package/gdal3.js"
    integrity="sha384-yW4c2Jx7lsREjJg58+ZI5U6gAso2bRAPw3LdzPWm7z8+rMJ24R7AS+EFyXDPxgYM"
    crossorigin="anonymous"
></script>
<script>
window.addEventListener("message", (e) => {
      const msg = e.data;
      if (msg.type === "updated") {
          document.getElementById("pluginLayers").innerHTML = msg.message;
           document.querySelectorAll(".delete-layer").forEach(button => {
    button.addEventListener("click", event => {
      const layerId = event.target.getAttribute("data-layer-id");
      console.log(layerId);
      if (layerId) {
        // Send a message to the parent window when 'Delete' is clicked
        parent.postMessage({
          type: "delete",
          layerId: layerId
        }, "*");
        // Remove the layer from the UI
        event.target.closest("li").remove();
      }
    });
  });

  // Add event listener for 'Show/Hide' 
  document.querySelectorAll("#show-hide-layer").forEach(checkbox => {
    checkbox.addEventListener("change", event => {
      const layerId = event.target.getAttribute("data-layer-id");
      const isVisible = event.target.checked;

      if (layerId) {
        // Send a message to the parent window for show/hide action
        parent.postMessage({
          type: isVisible ? "show" : "hide",
          layerId: layerId
        }, "*");
      }
    });
  });

    // Add event listener for 'FlyTo' button
  document.querySelectorAll(".fly-to-layer").forEach(button => {
    button.addEventListener("click", event => {
      const layerId = event.target.getAttribute("data-layer-id");
      if (layerId) {
        // Send a message to the parent window for 'FlyTo' action
        parent.postMessage({
          type: "flyTo",
          layerId: layerId
        }, "*");
      }
    });
  });
      }
    });
    
// Add event listener for 'Delete' button
  document.querySelectorAll(".delete-layer").forEach(button => {
    button.addEventListener("click", event => {
      const layerId = event.target.getAttribute("data-layer-id");
      console.log(layerId);
      if (layerId) {
        // Send a message to the parent window when 'Delete' is clicked
        parent.postMessage({
          type: "delete",
          layerId: layerId
        }, "*");
        // Remove the layer from the UI
        event.target.closest("li").remove();
      }
    });
  });

  // Add event listener for 'Show/Hide' 
  document.querySelectorAll("#show-hide-layer").forEach(checkbox => {
    checkbox.addEventListener("change", event => {
      const layerId = event.target.getAttribute("data-layer-id");
      const isVisible = event.target.checked;

      if (layerId) {
        // Send a message to the parent window for show/hide action
        parent.postMessage({
          type: isVisible ? "show" : "hide",
          layerId: layerId
        }, "*");
      }
    });
  });

    // Add event listener for 'FlyTo' button
  document.querySelectorAll(".fly-to-layer").forEach(button => {
    button.addEventListener("click", event => {
      const layerId = event.target.getAttribute("data-layer-id");
      if (layerId) {
        // Send a message to the parent window for 'FlyTo' action
        parent.postMessage({
          type: "flyTo",
          layerId: layerId
        }, "*");
      }
    });
  });
    document.getElementById("importButton").addEventListener("click", () => {
      
      let input = document.createElement('input');
      input.type = 'file';
      input.onchange = _ => {
            let files =   Array.from(input.files);
            
            initGdalJs({ path: 'https://cdn.jsdelivr.net/npm/gdal3.js@2.8.1/dist/package', useWorker: false }).then((Gdal) => {

                const options = [ // https://gdal.org/programs/ogr2ogr.html#description
                  '-f', 'GeoJSON',
                  '-t_srs', 'EPSG:4326',
                  '-s_srs', 'EPSG:4326',
                ];

                Gdal.open(files).then((result) => {
                  const shpDataset = result.datasets[0];
                  Gdal.ogr2ogr(shpDataset, options).then((output) => {
                    
                    Gdal.getFileBytes(output).then((bytes) => {

                      const blob = new Blob([bytes]);
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = "output.geojson";
                      link.click();
                      fr = new FileReader();

                      fr.onload = function() {
                      let geom = JSON.parse(this.result);
                      var geomType = turf.getType(geom);
                      console.log(geomType);
                      if(geomType==="FeatureCollection"){
                        geom=geom.features?.[0];
                        var geomType = turf.getType(geom);
                      }
                      if(geomType==="LineString")
                      {
                        var length = turf.length(geom, { units: "meters" });
                        document.getElementById("length").textContent = length.toFixed(0) + " m";
                      }
                      if(geomType==="Polygon")
                      {
                        var area = turf.area(geom);
                        document.getElementById("area").textContent = area.toFixed(0) + " sq.m";
                      }
                        
                        parent.postMessage({
                          type: "addlayer",
                          layerGeojson:  geom,
                          fileName: shpDataset.path
                        }, "*");
                      };
                      fr.readAsText(blob);
                    }).catch(e => console.error(e)); 
                  });
                });
               
            });
        };
      input.click();

    });
   
</script>
`);

reearth.extension.on("message", msg => {
  if (msg.type === "addlayer") {
    console.log(msg.fileName);
    const layerGeojsonInline = {
      title: msg.fileName,
      visible: true,
      type: "simple", // Required
      data: {
        type: "geojson", // Write the data format
        value: msg.layerGeojson,
      },
      // Settings for the feature style. This statement is required even if no style is set.
      polygon: {
        fillColor: 'red'
      },
      polyline: {
        strokeColor: 'red'
      },
      marker: {
        imageColor: 'red'
      },
    };
    let layer_id = reearth.layers.add(layerGeojsonInline);
    console.log(layer_id);
    // filter layers
    pluginLayerIds = [layer_id];
    updateGeoJSONLayerList();
  }
});
reearth.extension.on("message", (msg) => {
  switch (msg.type) {
    case "delete":
      reearth.layers.delete(msg.layerId);
      break;
    case "flyTo":
      reearth.camera.flyTo(msg.layerId, { duration: 2 });
      break;
    case "hide":
      reearth.layers.hide(msg.layerId);
      break;
    case "show":
      reearth.layers.show(msg.layerId);
      break;
    default:
  }
});