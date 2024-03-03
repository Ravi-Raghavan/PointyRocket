import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import GoogleMap from './Components/Map';
import ButtonLayout from './Components/Buttons';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Modal from "react-native-modal";


//  colors
const primaryCol = '#ED7D31' //'#FFBB64';
const secondaryCol = '#4F4A45'//'#2D3250';
const accent = 'white';


// image locations
const cancel = './assets/cancel.png';

// urls to fetch data from backen
const load_url = 'https://factual-moved-snapper.ngrok-free.app/submit_path';

export default function App() {

  // boolean to add pin on map
  const [addPin, setAddPin] = useState(false);

  // boolean to remove pin on map
  const [removePin, setRemovePin] = useState(false);

  // boolean to allow drawing
  const [drawPath, setDrawPath] = useState(false);

  // boolean to allow deleting path
  const [deletePath, setDeletePath] = useState(false);

  // boolean to state a path is drawn
  const [drawn, setDrawn] = useState(false);

  // object of marker coordinates
  const [marker, setMarker] = useState(null);

  // boolean that states start location is added
  const [startLocationBoolean, setStartLocationBoolean] = useState(false);

  // coordinate object to store user current location
  const [userLocation, setUserLocation] = useState(null); 

  // boolean to allow submit
  const [submit, isSubmit] = useState(false);

  // boolean to allow save
  const [toSave, isToSave] = useState(false);

  // boolean to allow set a start marker 
  const  [isStartLoc, setIsStartLoc] = useState(false);

  // boolean to set stop markers
  const [isDestination, setIsDestination] = useState(false);

  // boolean check for at least one destination marker
  const [stopsAdded, setStopsAdded] = useState(false); 

  // loading saved path variable
  const [savedPath, setSavedPath] = useState([]);

  // deals with boolean to check whether to delete the origin and destination markers
  const [deleteTravelSalesman, setDeleteTravelSalesman] = useState(false); 
  
  // submits the route
  const [isRoute, setRoute] = useState(false);

  // closes pop up box
  const [closePopUp, setClosePopUp] = useState(false);

  // loaded path to map
  const [newPath, setNewPath] = useState(null);

  // adds new laoded path on the map
  const newPathObject = (obj) => {
    setNewPath(obj);
    console.log('Test');
  }

  // fetch data from mongoDB to extract saved paths
  const handleLoadingPaths = () => {
    if(closePopUp) {
      try {
        const response = fetch(load_url);
        if (!response.ok) {
          throw new Error('COULD NOT FIND THE URL');
          
        } 
        else {
          const data = response.json();
          setSavedPath(data);
          console.warn('TESTING: structure of data loaded', data);
        };
        
      } catch (error) {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
      }

    };
  };

  useEffect( () => {
    handleLoadingPaths();
    
  }, [closePopUp]);



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

      <Modal isVisible={closePopUp} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: secondaryCol, width:'90%', height: '70%', padding:16, borderRadius: '20%' }}>


          {/* title and cross button */}
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', marginBottom: 8}}>
            <Text style={{ fontSize: 30, color: primaryCol }}>Select Path to Load</Text>
            <TouchableOpacity onPress={ () => {setClosePopUp(false)}}>
              <Image
                source={require(cancel)}
                style={{ height: 30, width: 30 }}
              ></Image>
            </TouchableOpacity>
          </View>

          {/* layout for a path */}

          {/*<ScrollView>

            {savedPath && savedPath.map((item, index) => (

              <TouchableOpacity onPress={ () => newPathObject(item)}>
                <View key={index} style={{ backgroundColor: primaryCol, padding: 8, borderRadius: 10, marginBottom: 8 }} >
                  <Text style={{ fontSize: 24, color: accent }}>{item.name} </Text>

                  <Text style={{ fontSize: 14, color: accent }}>Center Coordinate: ({item.center.latitude}, {item.center.longitude})</Text>
                  <Text style={{ fontSize: 14, color: accent }}>Start Coordinate: ({item.route[0].latitude}, {item.route[0].longitude})</Text>
                  <Text style={{ fontSize: 14, color: accent }}>End Coordinate: ({item.route[item.route.length - 1].latitude}, {item.route[item.route.length - 1].longitude})</Text>
                </View>
              </TouchableOpacity>
              
            ))}

          </ScrollView>*/}
        </View>
      </Modal>


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
          isStartLoc={isStartLoc}
          isDestination={isDestination}
          isRoute={isRoute}
          setRoute={setRoute}
          newPath={newPath}
          setNewPath={setNewPath}
          setStartLocationBoolean={setStartLocationBoolean}
          setStopsAdded={setStopsAdded}
          deleteTravelSalesman={deleteTravelSalesman}
          setDeleteTravelSalesman={setDeleteTravelSalesman}
          
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
          setIsStartLoc={setIsStartLoc}
          setIsDestination={setIsDestination}
          setRoute={setRoute}
          setClosePopUp={setClosePopUp}
          startLocationBoolean={startLocationBoolean}
          stopsAdded={stopsAdded}
          setDeleteTravelSalesman={setDeleteTravelSalesman}
          />
        </View> 
  
      
      
        
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },

  searchBox: {
    backgroundColor: primaryCol,
    // height: '12%',
    flex: 1,
    flexDirection: 'row',
    paddingTop: 16,
    paddingHorizontal: 8,
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
    opacity: 0.9 
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


