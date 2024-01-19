import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useOnLoad } from "./googleMapsHooks";


const LocationSearchInput = ({  setSearchLocaiton }) => {
    const [address, setAddress] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);


    const { isLoaded } = useOnLoad();

    const handleSelect = async (selected) => {
        const results = await geocodeByAddress(selected);
        const latLng = await getLatLng(results[0]);

        setAddress(selected);
        setSelectedLocation(latLng);

    };


    

    // ! when user search places and re-center map again

    const handlePrintButtonClick = () => {
        
        if (selectedLocation ) {
            setSearchLocaiton(selectedLocation)
         
        } else {
            console.log('No location selected');
        }


    };

    if (!isLoaded) { return (<></>) }

    return (
        <>
            <PlacesAutocomplete 
            
                className="search-input"
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className = 'input-suggestions-layout'>
                        <input {...getInputProps({ placeholder: 'Search Places' })} key="places-autocomplete-input" className='input' />

                        <div style={{width: '100%', height:'100%'}}>
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion, index) => (
                                <div  {...getSuggestionItemProps(suggestion)} key={index} style={{ backgroundColor: 'red', marginBottom:'2px'}}>
                                    {suggestion.description}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>

            <button 
                onClick={handlePrintButtonClick}
                className='search-button'
            >
                    Print Name and LatLng
                </button>
        </>
    );
};

export default LocationSearchInput;
