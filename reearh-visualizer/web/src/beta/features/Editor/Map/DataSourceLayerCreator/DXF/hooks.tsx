import { useT } from "@reearth/services/i18n";

import workerUrl from 'gdal3.js/dist/package/gdal3.js?url'
import dataUrl from 'gdal3.js/dist/package/gdal3WebAssembly.data?url'
import wasmUrl from 'gdal3.js/dist/package/gdal3WebAssembly.wasm?url'
import initGdalJs from 'gdal3.js';

const paths = {
  wasm: wasmUrl,
  data: dataUrl,
  js: workerUrl,
};


import { useState, useMemo, useCallback } from "react";

import { DataProps, DataSourceOptType, SourceType } from "..";
import { generateTitle } from "../util";

export default ({ sceneId, onClose, onSubmit }: DataProps) => {
  const t = useT();

  const [sourceType, setSourceType] = useState<SourceType>("local");
  const [sourceCRS, setSourceCRS] = useState<string>("EPSG:4326");

  const [value, setValue] = useState("");
  const [layerName, setLayerName] = useState("");
  const [prioritizePerformance, setPrioritizePerformance] = useState(false);
  const dataSourceTypeOptions: DataSourceOptType = useMemo(
    () => [{ label: t("From Assets"), value: "local" }],
    [t]
  );

  const isValidGeoJSON = (json: Record<string, unknown>): boolean => {
    return (
      json &&
      typeof json === "object" &&
      (json.type === "FeatureCollection" || json.type === "Feature")
    );
  };

  const handleSubmit = useCallback(() => {
    // convert dxf to geojson value

    initGdalJs({paths}).then((Gdal: any) => {
      const options = [
        "-f",
        "GeoJSON",
        "-t_srs",
        "EPSG:4326",
        "-s_srs",
        sourceCRS
      ];
        fetch(value).then(fileData=>{

          fileData.blob().then(fileDataBlob=>{

            const file = new File([fileDataBlob], "polygon.geojson");
            Gdal.open(file).then((result: any) => {
              const shpDataset = result.datasets[0];
              Gdal.ogr2ogr(shpDataset, options).then((output: any) => {
                Gdal.getFileBytes(output)
                  .then((bytes: any) => {
      
                    const blob = new Blob([bytes]);
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "output.geojson";
                    link.click();
                    const fr = new FileReader();
      
                    fr.onload = function () {
                      try {
                        const parsedValue = JSON.parse(this.result as any);
                        if (!isValidGeoJSON(parsedValue)) {
                          throw new Error(t("Invalid GeoJSON format"));
                        }
                        onSubmit({
                          layerType: "simple",
                          sceneId,
                          title: generateTitle(value, layerName),
                          visible: true,
                          config: {
                            data: {
                              type: "geojson",
                              value: parsedValue,
                              geojson: {
                                useAsResource: prioritizePerformance
                              }
                            }
                          }
                        });
                        onClose();
                      } catch (error) {
                        console.error("GeoJSON parsing error:", error);
                        throw new Error(t("Please enter valid GeoJSON"));
                      }
                    };
                    fr.readAsText(blob);
                  })
                  .catch((e: any) => console.error(e));
              });
            });
          }

          )
        });
      
    });
  }, [
    layerName,
    onClose,
    onSubmit,
    prioritizePerformance,
    sceneId,
    sourceCRS,
    t,
    value
  ]);

  const handleValueChange = useCallback((value?: string, name?: string) => {
    setValue(value || "");
    setLayerName(name || "");
  }, []);

  const handleDataSourceTypeChange = useCallback((newValue: string) => {
    setSourceType(newValue as SourceType);
    setValue("");
  }, []);

  const handleDataSourceCRSChange = useCallback((newValue: string) => {
    setSourceCRS(newValue as SourceType);
    setValue("");
  }, []);

  return {
    value,
    dataSourceTypeOptions,
    sourceType,
    sourceCRS,
    prioritizePerformance,
    setPrioritizePerformance,
    handleValueChange,
    handleDataSourceTypeChange,
    handleDataSourceCRSChange,
    handleSubmit
  };
};
