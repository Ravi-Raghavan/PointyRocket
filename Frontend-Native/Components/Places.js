import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = ({ setSearchLocation }) => {

    // let xhr = new XMLHttpRequest();
    // xhr.open("GET", "https://google.com", false);
    return (
        <GooglePlacesAutocomplete
            placeholder='Search'
            // minLength={2}
            onFail={(err) => console.error(err)}
            onPress={(data, details = null) => {
            //     // 'details' is provided when fetchDetails = true
            
            if(details){
                console.log(details.geometry.location);
                setSearchLocation(details.geometry.location);
                // const { geometry } = details;
                // console.log(location);
            }
            }}
            query={{
                key: 'AIzaSyDtV9_n1eiNhjKuB5hr8iBeKEIg-Z_FTck',
                language: 'en',
            }}
            fetchDetails={true}
            // keyboardShouldPersistTaps="handled"
            // debounce={300}
        />
    );

    
};

export default GooglePlacesInput;
