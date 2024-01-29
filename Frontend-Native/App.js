import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import GoogleMap from './Components/Map';
import ButtonLayout from './Components/Buttons';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';


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

          <Text style={styles.logo_text}>Drone Path Pro</Text>
          <Image
            source={require('./assets/logo.png')} // Replace with the actual path to your image
            style={styles.logo_img}
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
    // height: '100%',
    flex: 1,
    // flexDirection: 'column',
    // justifyContent: 'center',
  
  },

  searchBox: {
    backgroundColor: '#ff9b94',
    // height: '12%',
    flex: 1,
    backgroundColor: 'cyan',
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center'

  },

  logo_text: {
    fontSize: 24,
    color: 'white',
  },

  logo_img: {
    width: 30, 
    height: 30, 
  },

  mapBox: {
    backgroundColor: 'green',
    // height: '68%',
    flex: 7
  },



  btnBox: {
    backgroundColor: 'orange',
    // height: '10%',
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
  },


});


