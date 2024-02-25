import React, { useEffect, useRef, useState } from 'react';
import MapView, {Marker, Circle, Polyline} from 'react-native-maps';
import { Text, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';


// initial region when map laods
const initialRegion = {
    latitude: 48.8584,
    longitude: 2.2945,
    latitudeDelta:  0.01,
    longitudeDelta: 0.01
};

const ipAddress = 'https://factual-moved-snapper.ngrok-free.app/submit_path';
const ipAddressSave = 'https://factual-moved-snapper.ngrok-free.app/save_data';
const ipAddresRoute = 'https://factual-moved-snapper.ngrok-free.app/traveling_salesman';

const routerRange = 94 // meters

const router = '../assets/router.png'; // 64px

export default function GoogleMap({ searchLocation, setSearchLocation, userLocation,
    marker, setMarker,
    addPin, 
    removePin, setRemovePin, 
    drawPath, 
    deletePath, setDeletePath,
    setDrawn,
    submit, isSubmit,
    toSave, isToSave,
    isStartLoc, isDestination,
    isRoute, setRoute,
    newPath, setNewPath,
 }) {

    const mapRef = useRef(null);

    const [center, setCenter] = useState(initialRegion);
    
    const [polylinePath, setPolylinePath] = useState([]);

    const [mapType, setMapType] = useState('standard');

    const [startLocation, setStartLocation] = useState(null);

    const [ destinations, setDestinations] = useState([]);



    // ? when user searches a place
    const handleSearchLocation = () => {
        
        if (searchLocation) {
            console.log('inside chanign map');

            mapRef.current.animateToRegion({
                ...center,
                ...searchLocation,
            });

            setCenter({
                latitude: searchLocation.lat,
                longitude: searchLocation.lng,
                latitudeDelta:  0.01,
                longitudeDelta: 0.01
            }); 
            

            

            setSearchLocation(null);
        }
    }

    useEffect(() => { handleSearchLocation(); }, [searchLocation]);

    // TODO focus map to user locaiton
    const focusUser = () => {
        if (userLocation) {
            mapRef.current.animateToRegion({
                ...center,
                ...userLocation,
            });
        }
    }

    // TODO focus map where marker placed
    const focusMarker = () => {

        if (marker) {
            mapRef.current.animateToRegion({
                ...center,
                ...marker,
            });
        }
    }

    // TODO chnages map vew type
    const changeMapType = () => {
        switch (mapType) {
            case 'standard':
                setMapType('satellite');
                break;
            default:
                setMapType('standard');
        }
    };
    
    
    // * adds marker
    const addMarker = (event) => {

        // adds router location
        if(addPin){
            const { coordinate } = event.nativeEvent;
            setMarker(coordinate);
            setPolylinePath([]);
        }

        // adds start location for drone
        else if (marker && isStartLoc){
            const { coordinate } = event.nativeEvent;
            setStartLocation(coordinate);
        }

        // have to ensure start locaiton added
        else if (marker && startLocation && isDestination) {
            const { coordinate } = event.nativeEvent;
            setDestinations([...destinations, coordinate]);
            console.log('total', destinations.length);
        };

    };

    // * removes marker
    const removeMarker = () => { 
        if (removePin) {
            setMarker(null);
            setRemovePin(false);
            setPolylinePath([]);
            setDrawn(false);
        }
    };

    useEffect(() => {removeMarker();}, [removePin]);


    // * draws path
    const getPoint = (event) => {
        
        const { coordinate } = event.nativeEvent;
        if (marker && isPointInsideCircle(coordinate, marker, routerRange)) {
            // console.log("locaiton", coordinate);
            setPolylinePath([...polylinePath, coordinate]);

            // console.log(polylinePath);
            setDrawn(true);
           
        }
    };

    // * deletes path 
    const deletePolyPath = () => {
        if(deletePath && marker && polylinePath){
            setPolylinePath([]);
            setDeletePath(false);
            setDrawn(false);
        }
    };

    useEffect(() => { deletePolyPath(); }, [deletePath]);

    // * adds loaded path
    const addLoadedPath = () => {
        if(newPath){

            
            setMarker(newPath.center);
            setPolylinePath(newPath.route);
            focusMarker();
            setNewPath(null);
        }
    };

    useEffect(() => { addLoadedPath(); }, [newPath, ]);



    // * when submitting file
    const submitPath = () => {
        
        if(polylinePath && submit){
          
           try{ 
               const dataToSend = { path: polylinePath };

               

               fetch(ipAddress, {
                   method: 'POST',
                   headers: {
                       'Accept': 'application/json',
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({ path: polylinePath })
               })

               console.log('data that is sent', dataToSend.path.length);
               isSubmit(false);
            //    setPolylinePath([]);
            //    setDeletePath(false);
            //    setDrawn(false);
           } catch (error) {
               // Handle the error
               console.error('An error occurred:', error.message);
               // You can also perform additional actions here, such as logging, notifying the user, etc.
           }

        };
    };

    useEffect(() => { submitPath(); }, [submit])


    // * when saved button is clicked
    const savePath = () => {

        if (polylinePath && toSave) {
          
            try {
                const dataToSend = { path: polylinePath };



                fetch(ipAddressSave, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: polylinePath })
                })

                console.log('data that is saved', dataToSend.path.length);

                console.log('attempting to submit path');

                isToSave(false);
                setColorSent(true);
            } catch (error) {
                // Handle the error
                console.error('An error occurred:', error.message);
                // You can also perform additional actions here, such as logging, notifying the user, etc.
            }

        };
    };

    useEffect(() => { savePath(); }, [toSave])


    // * saves route to backend
    const saveRoute = () => {
        if ( startLocation && destinations.length > 0 && isRoute) {
            try {
                const dataToSend = { startPoint: startLocation, destinations: destinations };



                fetch(ipAddresRoute, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend)
                })

                console.log('data that is sent', dataToSend.destinations.length);
                console.log('data that is sent', dataToSend.startPoint);
                // isSubmit(false);
                //    setPolylinePath([]);
                //    setDeletePath(false);
                //    setDrawn(false);
            } catch (error) {
                // Handle the error
                console.error('An error occurred:', error.message);
                // You can also perform additional actions here, such as logging, notifying the user, etc.
            }

        };
    };

    useEffect(() => { saveRoute(); }, [isRoute])

    return (
        <View style={styles.container}>

            <View style={styles.features}>

                <Text style={styles.featureItem}> Status </Text>
                <Text style={styles.featureItem}> Distance </Text>
                <Text style={styles.featureItem}> Color </Text>
                
                <Text style={styles.featureItem} onPress={changeMapType}> {mapType.charAt(0).toUpperCase() + mapType.slice(1)} </Text>
                <Text style={styles.featureItem} onPress={focusMarker}> Map Focus </Text>
                <Text style={styles.featureItem} onPress={focusUser} > My Location </Text>
                

            </View>

            <MapView 
                ref={mapRef}
                style={styles.map}
                initialRegion={center}
                mapType= {mapType}
                provider={MapView.PROVIDER_GOOGLE}
                zoomEnabled
                showsCompass
                showsScale
                showsBuildings
                zoomControlEnabled
                userInterfaceStyle='dark'
                
                showsUserLocation = {true}
                loadingEnabled={true}
                showsMyLocationButton
                showsPointsOfInterest
                onPress={addMarker}
                onPanDrag={drawPath? getPoint: null}
                scrollEnabled={!drawPath}
             >

             {marker && (
                    <>

                        {polylinePath && (
                            <Polyline
                                coordinates={polylinePath}
                                strokeColor={'#ED7D31'}
                                strokeWidth={2}
                                style = {{opacity: drawPath? 1 : 0.3}}
                                
                            />
                        )}

                        <Circle
                            center={marker}
                            radius={routerRange}
                            fillColor='rgba(237, 125, 49, 0.05)'
                            onPanDrag={getPoint}
                            strokeColor='grey'
                            // strokeWidth="2"
                        /> 
                        <Marker
                            coordinate={marker}
                            image={require(router)}
                        />

                        {startLocation && (
                            <Marker
                                coordinate={startLocation}
                                image={require('../assets/start.png')}
                            />
                        )}

                        {destinations && destinations.map((destination, index) => (
                            <Marker
                                key={index} // Make sure to set a unique key for each marker
                                coordinate={destination}
                                
                            />
                        ))}
                       

                        
                    </>
             )}

            </MapView>
        </View>
    );
}

// Function to check if a coordinate is inside a circle
const isPointInsideCircle = (point, circle, radius) => {
    // Convert degrees to radians
    const toRadians = (angle) => (angle * Math.PI) / 180;

    // Haversine formula to calculate distance
    const haversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371000; // Earth radius in meters
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    const distance = haversine(point.latitude, point.longitude, circle.latitude, circle.longitude);
    
    return distance <= radius;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    features: {
        height: '8%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
    },

    featureItem: {
        color: 'white',
        
    },

    map: {
        width: '100%',
        height: '92%',
    },
});

