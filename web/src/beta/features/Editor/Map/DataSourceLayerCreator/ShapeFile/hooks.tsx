import { useT } from "@reearth/services/i18n";
import { useState, useMemo, useCallback } from "react";

import { DataProps, DataSourceOptType, SourceType } from "..";
import { generateTitle } from "../util";
import initGdalJs from 'gdal3.js';

export default ({ sceneId, onClose, onSubmit }: DataProps) => {
  const t = useT();

  const [sourceType, setSourceType] = useState<SourceType>("local");

  const [value, setValue] = useState("");
  const [layerName, setLayerName] = useState("");
  const [prioritizePerformance, setPrioritizePerformance] = useState(false);
  const dataSourceTypeOptions: DataSourceOptType = useMemo(
    () => [
      { label: t("From Assets"), value: "local" },
    ],
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
    // convert shp to geojson value

    initGdalJs({ path: 'static' }).then((Gdal: any) => {

      const options = [ 
        '-f', 'GeoJSON',
        '-t_srs', 'EPSG:4326',
      ];

      Gdal.open([value]).then((result:any) => {
        const shpDataset = result.datasets[0];
        Gdal.ogr2ogr(shpDataset, options).then((output:any) => {
          
          Gdal.getFileBytes(output).then((bytes:any) => {

            const blob = new Blob([bytes]);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "output.geojson";
            link.click();
            let fr = new FileReader();

            fr.onload = function() {
              try {
                let parsedValue = JSON.parse(this.result as any);
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
          }).catch((e: any) => console.error(e)); 
        });
      });
    });
  }, [
    layerName,
    onClose,
    onSubmit,
    prioritizePerformance,
    sceneId,
    sourceType,
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

  return {
    value,
    dataSourceTypeOptions,
    sourceType,
    prioritizePerformance,
    setPrioritizePerformance,
    handleValueChange,
    handleDataSourceTypeChange,
    handleSubmit
  };
};
