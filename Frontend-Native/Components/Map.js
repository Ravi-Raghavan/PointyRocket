import React, { useEffect, useRef, useState } from 'react';
import MapView, {Marker, Circle, Polyline} from 'react-native-maps';
import { Text, StyleSheet, View } from 'react-native';


// initial region when map laods
const initialRegion = {
    latitude: 48.8584,
    longitude: 2.2945,
    latitudeDelta:  0.01,
    longitudeDelta: 0.01
};

const routerRange = 94 // meters

export default function GoogleMap({ searchLocation, setSearchLocation, userLocation,
    addPin, 
    removePin, setRemovePin, 
    drawPath, 
    deletePath }) {

    const mapRef = useRef(null);

    const [center, setCenter] = useState(initialRegion);
    const [marker, setMarker] = useState(null);
    const [polylinePath, setPolylinePath] = useState([]);

    const [mapType, setMapType] = useState('standard');



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
        if(addPin){
            const { coordinate } = event.nativeEvent;
            setMarker(coordinate);
            setPolylinePath([]);
        }
    };

    // * removes marker
    const removeMarker = () => { 
        if (removePin) {
            setMarker(null);
            setRemovePin(false);
            setPolylinePath([]);
        }
    };

    useEffect(() => {removeMarker();}, [removePin]);


    // * draws path
    const getPoint = (event) => {
        
        const { coordinate } = event.nativeEvent;
        if (marker && isPointInsideCircle(coordinate, marker, routerRange)) {
            
            setPolylinePath([...polylinePath, coordinate]);
            // console.log(polylinePath);

           
        }
    };

    // * deletes path 
    const deletePolyPath = () => {
        if(deletePath && marker && polylinePath){
            setPolylinePath([]);
        }
    };

    useEffect(() => {deletePolyPath();}, [deletePath]);


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
                // userInterfaceStyle='dark'
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
                                strokeColor="#FF0000"
                                strokeWidth={2}
                                style = {{opacity: drawPath? 1 : 0.3}}
                                
                            />
                        )}

                        <Circle
                            center={marker}
                            radius={routerRange}
                            // fillColor='#fcd3a7'
                            onPanDrag={getPoint}
                        /> 
                        <Marker
                            coordinate={marker}
                        />

                       

                        
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
        // marginLeft: 4,
        
    },

    map: {
        width: '100%',
        height: '92%',
    },
});
