import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import GoogleMap from './Components/Map';
import ButtonLayout from './Components/Buttons';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Modal from "react-native-modal"


const primaryCol = '#ED7D31' //'#FFBB64';
const secondaryCol = '#4F4A45'//'#2D3250';
const accent = 'white';

const cancel = './assets/cancel.png';

// sample path saved
const samplePathSaved = [ 
  {
    name: 'sample path 1',
    center: { "latitude": 48.85500355546955, "longitude": 2.2924003599834566 },
    route: [{ "latitude": 48.85500355546955, "longitude": 2.2924003599834566 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85501704797608, "longitude": 2.2921829933012074 }, { "latitude": 48.85503863595429, "longitude": 2.2920763604652126 }, { "latitude": 48.85506292237231, "longitude": 2.2919861327964273 }, { "latitude": 48.85509800269194, "longitude": 2.2919205125029465 }, { "latitude": 48.8551357815557, "longitude": 2.2918794999603307 }, { "latitude": 48.85517625883399, "longitude": 2.2918548923972457 }, { "latitude": 48.855192449736165, "longitude": 2.291846689813692 }],

  },

  {
    name: 'sample path 2',
    center: { "latitude": 48.85500355546955, "longitude": 2.2924003599834566 },
    route: [{ "latitude": 50, "longitude": 2.2924003599834566 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85501704797608, "longitude": 2.2921829933012074 }, { "latitude": 48.85503863595429, "longitude": 2.2920763604652126 }, { "latitude": 48.85506292237231, "longitude": 2.2919861327964273 }, { "latitude": 48.85509800269194, "longitude": 2.2919205125029465 }, { "latitude": 48.8551357815557, "longitude": 2.2918794999603307 }, { "latitude": 48.85517625883399, "longitude": 2.2918548923972457 }, { "latitude": 48.855192449736165, "longitude": 2.291846689813692 }],

  },

   {
    name: 'sample path 1',
    center: { "latitude": 48.85500355546955, "longitude": 2.2924003599834566 },
    route: [{ "latitude": 48.85500355546955, "longitude": 2.2924003599834566 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85501704797608, "longitude": 2.2921829933012074 }, { "latitude": 48.85503863595429, "longitude": 2.2920763604652126 }, { "latitude": 48.85506292237231, "longitude": 2.2919861327964273 }, { "latitude": 48.85509800269194, "longitude": 2.2919205125029465 }, { "latitude": 48.8551357815557, "longitude": 2.2918794999603307 }, { "latitude": 48.85517625883399, "longitude": 2.2918548923972457 }, { "latitude": 48.855192449736165, "longitude": 2.291846689813692 }],

  },

  {
    name: 'sample path 2',
    center: { "latitude": 48.85500355546955, "longitude": 2.2924003599834566 },
    route: [{ "latitude": 50, "longitude": 2.2924003599834566 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85501704797608, "longitude": 2.2921829933012074 }, { "latitude": 48.85503863595429, "longitude": 2.2920763604652126 }, { "latitude": 48.85506292237231, "longitude": 2.2919861327964273 }, { "latitude": 48.85509800269194, "longitude": 2.2919205125029465 }, { "latitude": 48.8551357815557, "longitude": 2.2918794999603307 }, { "latitude": 48.85517625883399, "longitude": 2.2918548923972457 }, { "latitude": 48.855192449736165, "longitude": 2.291846689813692 }],

  },

   {
    name: 'sample path 3',
     center: { "latitude": 48.85500355546955, "longitude": 2.2924003599834566 },
    route: [{ "latitude": 48.85500355546955, "longitude": 2.2924003599834566 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85501704797608, "longitude": 2.2921829933012074 }, { "latitude": 48.85503863595429, "longitude": 2.2920763604652126 }, { "latitude": 48.85506292237231, "longitude": 2.2919861327964273 }, { "latitude": 48.85509800269194, "longitude": 2.2919205125029465 }, { "latitude": 48.8551357815557, "longitude": 2.2918794999603307 }, { "latitude": 48.85517625883399, "longitude": 2.2918548923972457 }, { "latitude": 48.855192449736165, "longitude": 2.291846689813692 }],

  },

  {
    name: 'sample path 4',
    center: { "latitude": 48.85500355546955, "longitude": 2.2924003599834566 },
    route: [{ "latitude": 50, "longitude": 2.2924003599834566 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85500355546955, "longitude": 2.292301929731117 }, { "latitude": 48.85501704797608, "longitude": 2.2921829933012074 }, { "latitude": 48.85503863595429, "longitude": 2.2920763604652126 }, { "latitude": 48.85506292237231, "longitude": 2.2919861327964273 }, { "latitude": 48.85509800269194, "longitude": 2.2919205125029465 }, { "latitude": 48.8551357815557, "longitude": 2.2918794999603307 }, { "latitude": 48.85517625883399, "longitude": 2.2918548923972457 }, { "latitude": 48.855192449736165, "longitude": 2.291846689813692 }],

  }
];


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
  // const [addStartLoc, setAddStartLoc] = useState([]);
  const  [isStartLoc, setIsStartLoc] = useState(false);
  const [isDestination, setIsDestination] = useState(false);
  const [isLoad, setIsLoad] = useState(false);


  // submits the route
  const [isRoute, setRoute] = useState(false);

  // closes pop up box
  const [closePopUp, setClosePopUp] = useState(false);

  // loaded path to 
  const [newPath, setNewPath] = useState(null);

  // adds new laoded path as an object
  const newPathObject = (obj) => {
    setNewPath(obj);
    console.log('Test');
  }


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

          <ScrollView>

            {samplePathSaved.map((item, index) => (

              <TouchableOpacity onPress={ () => newPathObject(item)}>
                <View key={index} style={{ backgroundColor: primaryCol, padding: 8, borderRadius: 10, marginBottom: 8 }} >
                  <Text style={{ fontSize: 24, color: accent }}>{item.name} </Text>

                  <Text style={{ fontSize: 14, color: accent }}>Center Coordinate: ({item.center.latitude}, {item.center.longitude})</Text>
                  <Text style={{ fontSize: 14, color: accent }}>Start Coordinate: ({item.route[0].latitude}, {item.route[0].longitude})</Text>
                  <Text style={{ fontSize: 14, color: accent }}>End Coordinate: ({item.route[item.route.length - 1].latitude}, {item.route[item.route.length - 1].longitude})</Text>
                </View>
              </TouchableOpacity>
              
            ))}

          </ScrollView>
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
          isStartLoc={isStartLoc}
          isDestination={isDestination}
          isRoute={isRoute}
          setRoute={setRoute}
          newPath={newPath}
          setNewPath={setNewPath}
          
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


