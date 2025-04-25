// import { useEffect, useState } from "react";

// export const useYandexLoader = () => {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     if (window.ymaps) {
//       window.ymaps.ready(() => setLoaded(true));
//       return;
//     }

//     const script = document.createElement("script");
//     script.src =
//       `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAP_KEY}&lang=ru_RU`;
//     script.type = "text/javascript";
//     script.onload = () => {
//       window.ymaps.ready(() => setLoaded(true));
//     };
//     document.head.appendChild(script);
//   }, []);

//   return loaded;
// };
