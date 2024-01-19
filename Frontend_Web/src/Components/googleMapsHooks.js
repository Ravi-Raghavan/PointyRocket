import { useState, useRef } from "react";
import {useJsApiLoader } from "@react-google-maps/api"

export function useOnLoad() {

    const [libraries] = useState(['places']);

    const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  // ? reference to the map
  const [map, setMap] = useState(null);

  const [googleMapConPars, setgoogleMapConPars] = useState(null);

 
 
  // reference to map
  const onLoad = (mapRef) => {
    setMap(mapRef);
 
  };

  // convert pixels distance  to lat lng distance
  function pixelsToLatitude(pixels) {
    if (isLoaded && map) {
      const bounds = map.getBounds();
      const mapHeightPixels = Math.round((bounds.getNorthEast().lat() - bounds.getSouthWest().lat()) * Math.pow(2, map.getZoom()));
      const latitudeChangePerPixel = (bounds.getNorthEast().lat() - bounds.getSouthWest().lat()) / mapHeightPixels;
      return latitudeChangePerPixel * pixels;
    }
  }

  // * pixel to map coordinates ratio
  function pixelToMapRatio() {
    if (isLoaded && map) {
      var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
      var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
      var scale = Math.pow(2, map.getZoom());

      
      setgoogleMapConPars({
        topRight: topRight,
        bottomLeft: bottomLeft,
        scale: scale
      })
    }
  };

  //  * converts pixels x,y to map coordinates
  const convertPixelToLatLng = (pixelX, pixelY) => {

    pixelToMapRatio()

    console.log(googleMapConPars);
    if (map && googleMapConPars) {
      const x = (pixelX / googleMapConPars.scale) + googleMapConPars.bottomLeft.x;
      const y = (pixelY / googleMapConPars.scale) + googleMapConPars.bottomLeft.y;

      const LatLng = map.getProjection().fromPointToLatLng(new window.google.maps.Point(x, y));
      
      return { lat: LatLng.lat(), lng: LatLng.lng() };
    }
  };
    
  return { isLoaded, onLoad, map, pixelsToLatitude };
};




