import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import GoogleMap from './Components/Map';
import ButtonLayout from './Components/Buttons';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';


const primaryCol = '#ED7D31' //'#FFBB64';
const secondaryCol = '#4F4A45'//'#2D3250';
const accent = 'white';


export default function App() {

  const [addPin, setAddPin] = useState(false);
  const [removePin, setRemovePin] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [deletePath, setDeletePath] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);
  const [marker, setMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // users current location
  const [submit, isSubmit] = useState(false);
  const [toSave, isToSave] = useState(false);
  const [colorSent, setColorSent] = useState(false);


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
          marker={marker}
          setMarker={setMarker}
          addPin={addPin}
          removePin={removePin}
          setRemovePin={setRemovePin}
          drawPath={drawPath}
          deletePath={deletePath}
          setDeletePath={setDeletePath}
          setDrawn={setDrawn}
          submit={submit}
          isSubmit={isSubmit}
          toSave={toSave}
          isToSave={isToSave}
          setColorSent={setColorSent}
        />
      </View>


        <View style={styles.btnBox}>
          <ButtonLayout
            marker={marker}
            addPin={addPin}
            setAddPin={setAddPin}
            setRemovePin={setRemovePin}
            drawPath={drawPath}
            setDrawPath={setDrawPath}
            setDeletePath={setDeletePath}
            drawn={drawn}
          isSubmit={isSubmit}
          isToSave={isToSave}
          colorSent={colorSent}
          setColorSent={setColorSent}
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
    backgroundColor: primaryCol,
    // height: '12%',
    flex: 1,
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
    backgroundColor: secondaryCol,
    // height: '68%',
    flex: 8 
  },



  btnBox: {
    backgroundColor: secondaryCol,
    // height: '10%',
    flex: 3,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
  },


});


