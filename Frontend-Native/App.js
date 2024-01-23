import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import GoogleMap from './Components/Map';
import ButtonLayout from './Components/Buttons';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import GooglePlacesInput from './Components/Places';


export default function App() {


  const [addPin, setAddPin] = useState(false);
  const [removePin, setRemovePin] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [deletePath, setDeletePath] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);

  const [userLocation, setUserLocation] = useState(null); // users current location


  async function requestPermission() {
    const {status} = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };
  }
  
  requestPermission()

  
  return (   
    <View style={styles.container}>
      <StatusBar style="light" translucent={true} />

      <View style={styles.searchBox}>

        <View style={styles.header}>
          <Text>Drone Path Pro</Text>
          <Image
            source={require('./assets/logo.png')} // Replace with the actual path to your image
            style={styles.image}
          />
        </View>
        
        
          <GooglePlacesInput

            setSearchLocation={setSearchLocation}
          /> 
        
      </View>

      <View style={styles.mapBox}>
        <GoogleMap
          searchLocation={searchLocation}
          setSearchLocation={setSearchLocation}
          userLocation={userLocation}
          addPin={addPin}
          removePin={removePin}
          setRemovePin={setRemovePin}
          drawPath={drawPath}
          deletePath={deletePath}
        />
      </View>

      <View style={styles.btnBox}>
        <ButtonLayout
          setAddPin={setAddPin}
          setRemovePin={setRemovePin}
          setDrawPath={setDrawPath}
          setDeletePath={setDeletePath}
        />
      </View> 
      
      
        
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    // flex: 1,
    height: '100%',
    // paddingHorizontal: 8,
    // backgroundColor: 'red'
  },

  searchBox: {
    backgroundColor: '#ff9b94',
    // flex: 4,
    height: '30%',
    // paddingHorizontal: 8,
    paddingTop: 40,
    paddingBottom: 8,

  },

  header: {
    backgroundColor: 'cyan',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical:8,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    
  },

  image: {
    width: 30, // Set the width of the image
    height: 30, // Set the height of the image
  },

  mapBox: {
    backgroundColor: 'green',
    // paddingHorizontal: 8,
    // flex: 6,
    height: '45%',
  },

  btnBox: {
    // backgroundColor: 'orange',
    // flex: 1,
    height: '25%',
    justifyContent: 'top',
    paddingTop: 16,
  },


});


