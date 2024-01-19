import React, {useEffect, useRef, useState} from "react";
import './App.css';
import GoogleMapComponent from "./Components/googleMap";
import LocationSearchInput from "./Components/Places";


function App() {

  // ! map reference when created
  const [map, setMap] = useState(null);

  const [addMarker,  setAddMarker] = useState(false);
  const [removeMarker, setRemoveMarker] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [isMarkerAdded, setIsMarkerAdded] = useState(false);
  const [isPathDrawn, setIsPathDrawn] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [submit, isSubmit] = useState(false);

  const [searchLocation, setSearchLocaiton] = useState(null);

  // * add button 
  const addButton = () => {
    setAddMarker(!addMarker);

  };

  // * remove button
  const removeButton = () => {
    setRemoveMarker(true);
    setIsMarkerAdded(false);
  }

  // * draw path button
  const pathButton = () => {
    setAddMarker(false);
    setDrawPath(!drawPath);
  };


  // * flag to delete path button
  const deleteButton = () => {
    console.log('clicked delete path button');
    setIsDelete(true);
  };
 
  // * submit button
const submitButton = () => {
  isSubmit(true);
};

  return (
    <>
      <div className="search-bar-map">

        <div className="places_layout">
          <LocationSearchInput map={map} setSearchLocaiton={setSearchLocaiton} />
        </div>

        <div className="map-outter-layer">

          <div className="map-layout">

            <GoogleMapComponent
              setMap={setMap}
              setIsMarkerAdded={setIsMarkerAdded}
              addMarker={addMarker}
              removeMarker={removeMarker}
              setRemoveMarker={setRemoveMarker}
              drawPath={drawPath}
              isDelete={isDelete}
              setIsDelete={setIsDelete}
              setIsPathDrawn={setIsPathDrawn}
              searchLocation={searchLocation}
              submit = {submit}
            />

          </div>

          <div className="map-buttons">
            <div className="map-btn">
              <button onClick={addButton} disabled={drawPath} style={activeBtn(addMarker)}>
                Add Pin

              </button>
            </div>

            <div className="map-btn">
              <button onClick={removeButton} disabled={!isMarkerAdded || drawPath} >
                Clear Marker
              </button>
            </div>

            <div className="map-btn">
              <button onClick={pathButton} disabled={!isMarkerAdded}>
                Draw Path
              </button>
            </div>

            <div className="map-btn">
              <button onClick={deleteButton} disabled={!isMarkerAdded || !isPathDrawn}>
                Delete Path
              </button>
            </div>

            <div className="map-btn">
              <button onClick={submitButton}>
                Submit Path
              </button>
            </div>

            <div className="map-btn">
              <button  >
                Refresh Page
              </button>
            </div>

          </div>
        </div>

       
     </div>

      
    </>
  );
}

export default App;

// rounding number 
function round(point) {return Math.round(point * 1000)/1000}

// style active button
function activeBtn(bool) {
  return {
    backgroundColor: bool ? '#FF0000' : '#4CAF50' ,
    color: "#000000",
    border: "1px solid #ccc"
    // add other styles as needed
  };
}
