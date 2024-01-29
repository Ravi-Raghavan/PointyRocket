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

  // Get the screen width
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  
  // console.log("Screen Width:", screenWidth);


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


