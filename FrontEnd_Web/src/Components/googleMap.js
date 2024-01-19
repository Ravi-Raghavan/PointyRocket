import { GoogleMap, MarkerF, CircleF, PolylineF, StandaloneSearchBox } from "@react-google-maps/api";
import { useOnLoad } from "./googleMapsHooks";
import {useState, useEffect, useRef} from "react";
import _debounce from 'lodash/debounce';

// import fetch from 'node-fetch';
import axios from 'axios';


const defaultLocation = { lat: 48.8584, lng: 2.2945 }; // location initially defined
const defaultZoom = 13; // 
// const maximumZoom = 14;
// const minimumZoom = 16;
const radius = 45 // in meters
// Math.sqrt(300000 / Math.PI);

const GoogleMapComponent = ({ setMap,
    setIsMarkerAdded, addMarker, 
    removeMarker, setRemoveMarker, 
    drawPath,
    isDelete, setIsDelete, 
    setIsPathDrawn,
    searchLocation,
    submit
    }) => {

    const mapRef = useRef(null); // reference to map for this files
    const { isLoaded, onLoad, map, pixelsToLatitude } = useOnLoad(); //  returing from hook

    const [center, setCenter] = useState(defaultLocation); 
    const [zoom, setZoom] = useState(defaultZoom);
    const [marker, setMarker] = useState(null); // pin added to map
    const [mapContainerSize, setMapContainerSize] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [polylinePath, setPolylinePath] = useState([]);
    const [distance, setDistance] = useState(0);



    // TODO: gets the width and height google maps box
    const getMapContainerSize = () => {
        if (mapRef.current?.mapRef) {
            const width = mapRef.current.mapRef.offsetWidth;
            const height = mapRef.current.mapRef.offsetHeight;
            setMapContainerSize({ width, height });

            setMap(map);
        }
    };

    // to run the function after the component is mounted
    useEffect(() => {
        getMapContainerSize();

        if (searchLocation ){
            setCenter(searchLocation);
            setMarker(null);
        }
    }, [mapRef.current, setMap, searchLocation]);

    // TODO: recenter map when zoomed in 
    const handleZoomChanged = () => {
        const map = mapRef.current;
        
        if (map && marker) {
            const newCenter = {lat: marker.lat(), lng: marker.lng()};
            setCenter(newCenter);
         
        }
    };

    useEffect(() => {
            if (submit && polylinePath.length > 0) {
                console.log('submitted');

                const ipAddress = 'http://172.31.145.56:8000/submit_path';
                const dataToSend = { path: polylinePath };

                console.log('data that is sent', dataToSend);

                fetch(ipAddress, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({path : polylinePath})
                })

                // try {
                //     const response = await axios.post(`http://${ipAddress}/submit_path`, dataToSend);

                //     if (response.status === 200) {
                //         console.log('Data successfully submitted');
                //         // Handle success
                //     } else {
                //         console.error('Failed to submit data');
                //         // Handle failure
                //     }
                // } catch (error) {
                //     console.error('Error submitting data:', error);
                //     // Handle error
                // }
            } else {
                console.log('not submitted');
            }
    
    }, [submit]);

    
    // TODO:  when mouse reaches the end of the map, move map accordingly
    const handleMouseMapMove = (e) => {

        const threshold = 20; // * 20px to detect movement
        const widthThreshold = pixelsToLatitude(5); // equivalent lat distance

        // x, y position of mouse
        const pixelX = e.pixel.x;
        const pixelY = e.pixel.y;

        const shift = (direction, lat, lng) => {
            switch (direction) {
                case 'right':
                    return { lat, lng: lng + widthThreshold };
                case 'left':
                    return { lat, lng: lng - widthThreshold };
                case 'down':
                    return { lat: lat - widthThreshold, lng };
                case 'up':
                    return { lat: lat + widthThreshold, lng };
                default:
                    return { lat, lng };
            }
        };

        if (pixelX + threshold > mapContainerSize.width) {
            // console.log('shifting right');
            setCenter((prevOptions) => shift('right', prevOptions.lat, prevOptions.lng));
        } else if (pixelX - threshold < 0) {
            // console.log('shifting left');
            setCenter((prevOptions) => shift('left', prevOptions.lat, prevOptions.lng));
        }

        if (pixelY + threshold > mapContainerSize.height) {
            // console.log('shifting down');
            setCenter((prevOptions) => shift('down', prevOptions.lat, prevOptions.lng));
        } else if (pixelY - threshold < 0) {
            // console.log('shifting up');
            setCenter((prevOptions) => shift('up', prevOptions.lat, prevOptions.lng));
        }

    };

    // TODO: handles the case when mouse is dragged to recenter map
    const handleMapDragEnd = () => {
        const newCenter = map.getCenter();
        setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
    };

    // TODO: record geographical coords value of cursor of the circle tag
    const handleMapDrawing = _debounce((e) => {
        console.log('drawing mouse', isDrawing)
        // enables when draw path is clicked and center exists
        if (drawPath && marker && isDrawing) {
            drawingPathButton(e.latLng);
        } 

        if( !drawPath ) {
            handleMouseUp();
        };
            
    }, 5);

    const handlePolylineDrawing = (point) => {

        
        const newPoint = { lat: point.lat(), lng: point.lng() }

        setPolylinePath((prevPath) => [...prevPath, newPoint]);

        if (polylinePath.length > 0) {
            const lastPoint = polylinePath[polylinePath.length - 1];
            const distance = haversineDistance(lastPoint, newPoint);
            setDistance( (prevDist) => prevDist + distance);  
        }

    //    console.log(polylinePath);
    };

    const handleMouseDown = () => {
        setIsDrawing(true);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };


    // * add a marker to the map
    const handleAddmarker = (e) => {
        if(e.latLng && addMarker) {
            // console.log('Marker added at location:', e.latLng.lat(), e.latLng.lng());
            setIsMarkerAdded(true);
            setMarker(e.latLng);
            setPolylinePath([]) // resets the recorded path

        }
    }
    
    // * remove a marker from the map
    useEffect(() => {
        if (removeMarker && marker) {
            setMarker(null);
            setRemoveMarker(false);
            setIsMarkerAdded(false);
        }
    }, [removeMarker]);
    
    // * draws path on the map
    const drawingPathButton = (point) => {

        setIsMarkerAdded(true);
        setIsPathDrawn(true);
        handlePolylineDrawing(point);
    
    };

    // * removes drawn path from map
    useEffect(() => { 

        if(isDelete && polylinePath.length > 0){
            // console.log("delete polyline");
            setIsDelete(false);
            setIsPathDrawn(false);
            setPolylinePath([]);
            setDistance(0);
        }
    }, [isDelete, polylinePath, distance, setIsPathDrawn]);


    if (!isLoaded) {
        return (
            <> Loading...</>
        );
    };
        
    
    return (
        <GoogleMap
            center = {center}
            zoom = {zoom}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
                streetViewControl: false,
                fullscreenControl: false,
                // scrollwheel: !drawPath,
                // zoomControl: !drawPath,
                gestureHandling: drawPath ? 'none' :'cooperative',   
                clickableIcons: drawPath ? false : true,
            }}
            onClick={handleAddmarker}
            onMouseMove={handleMouseMapMove}
            onDragEnd={handleMapDragEnd}
            onLoad={onLoad}
            ref = {mapRef}
            onZoomChanged={handleZoomChanged}
        >


            {marker && (
                <>
                    
                    <CircleF
                        center={marker}
                        radius={radius}
                        options={{
                            ...circleOptions,
                            clickable: drawPath, // Set clickable to false when drawPath is true
                        }}
                        onMouseMove={handleMapDrawing}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    />
                    <MarkerF 
                    position={marker}
                    options = {{ opacity: drawPath ? 0.2: 1}}
                     />


                    {polylinePath && (
                        <PolylineF
                            path={polylinePath}
                            options={{
                                strokeColor: 'green',
                                strokeOpacity: 0.5,
                                strokeWeight: 2,
                            }}
                        />
                    )}
                </>
            )}


        </GoogleMap>
        );



};


export default GoogleMapComponent;

//  style for the circle
const circleOptions = {
    fillOpacity: 0.1,
    strokeColor: 'blue',
    strokeOpacity: 1,
    strokeWeight: 1,
};

// style for the path
const pathOptions = {
    fillColor : 'cyan',
    strokeColor: 'cyan',
    fillOpacity: 1,
    strokeOpacity: 1,
    strokeWeight: 0.01,

};


// distance between points
function haversineDistance(coord1, coord2) {
    const toRadians = (angle) => (angle * Math.PI) / 180;

    const { lat: lat1, lng: lon1 } = coord1;
    const { lat: lat2, lng: lon2 } = coord2;

    const R = 6371; // Radius of the Earth in kilometers
    
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c * 1000; // Distance in meters

    return distance;
}