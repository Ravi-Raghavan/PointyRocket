import React from 'react';
import { View, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PlacesAutocomplete from "expo-google-places-autocomplete";

const GooglePlacesInput = ({ setSearchLocation }) => {

  


    return (

        
            <GooglePlacesAutocomplete
                placeholder='Search'
                onFail={(err) => console.error(err)}
                onPress={
                    (data, details = null) => {

                        if (details) {
                            // console.log(details.geometry.location);
                            setSearchLocation(details.geometry.location);

                        }
                    }}

                query={{
                    key: 'AIzaSyDtV9_n1eiNhjKuB5hr8iBeKEIg-Z_FTck',
                    language: 'en',
                }}
            // fetchDetails={true}

            />
        

       
    );

    
};

export default GooglePlacesInput;
