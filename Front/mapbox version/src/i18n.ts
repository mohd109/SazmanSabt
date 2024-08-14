import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
        translation: {
          import: "Import",
          export: "Export",
          layers: "Layers",
          raster: "Raster",
          vector: "Vector",
          search: "Search",
          spatial: "Spatial",
          tables: "Tables",
          info: "Info",
          metadata: "Metadata/Attribute Tables",
          objectProperties: "Object Properties",
          areaStatitics: "Area Statitics",
          extra: "Extra",
          settings: "Settings",
        },
      },
      fr: {
        translation: {
            import: "دانلود",
            export: "آپلود",
            layers: "لایه ها",
            raster: "رستر",
            vector: "وکتور",
            search: "جستوجو",
            spatial: "اسپیشال",
            tables: "جدول ها",
            info: "اطلاعات",
            metadata: "متادیتا",
            objectProperties: "Object Properties",
            areaStatitics: "آمار",
            extra: "اضافات",
            settings: "تنظیمات",
        },
      },
  },
});

export default i18n;