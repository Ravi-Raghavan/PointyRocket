import { useEffect, useState } from "react";
import { View, Button, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from "react-native";


// image file path
const add= '../assets/marker.png';
const removePin = '../assets/removePin.png';
const draw = '../assets/draw.png';
const deletePath = '../assets/delete.png';
const submit = '../assets/submit.png';
const save = '../assets/save.png';
const open = '../assets/open.png';
const origin = '../assets/track.png';
const stops = '../assets/sign.png';
const backspace = '../assets/backspace.png';

// colors for UI
const primaryCol = '#ED7D31' //'#FFBB64';
const secondaryCol = '#4F4A45'//'#2D3250';
const accent = 'white';
const toggle = '#005B41';
const alert = '#D2042D';

const ButtonLayout = ({ marker, addPin, setAddPin, setRemovePin, drawPath, setDrawPath, setDeletePath, drawn, isSubmit, isToSave,
    setIsStartLoc, setIsDestination, setRoute, setClosePopUp, startLocationBoolean, stopsAdded, setDeleteTravelSalesman }) =>{

    const [addtoggled, isAddToggled] = useState(false);
    const [drawtoggled, isDrawToggled] = useState(false);
    const [originToggle, setOriginToggle] = useState(false);
    const [stopToggle, setStopToggle] = useState(false);

    // * add button
    const handleAddPin = () => {
        setAddPin(prev => !prev);
        isAddToggled(prev => !prev);
    };

    // * clear button
    const handleClearPin = () => {
        setRemovePin(prev => !prev);
    };

    // * draw path button
    const handleDrawPath = () => {
        setDrawPath(prev =>!prev);
        isDrawToggled(prev => !prev);
    };

    // * delete path button
    const handleDeletePath = () => {
        if(draw) {
            setDeletePath(true);
        }
        
    };

    // * deletes origin and destination markers
    const handleDeleteOriginAndDesMarkers = () => {
        if (startLocationBoolean) {
            setDeleteTravelSalesman(true);
        };
    };

    // * submit button
    const handleSubmit = () => {
        if (drawn) {
            isSubmit(true);
        } 

        else if (stopsAdded) {
            setRoute(true);
        };
    };


    // * save path button
    const handleSave = () => {
        if (drawn) {
            isToSave(true);
        };
    };
    
    // * load path button
    const handleLoad = () => {
        setClosePopUp(true);
    };

    // * adds start location
    const handleStartLocation = () => {
        setIsStartLoc(prev => !prev);
        setOriginToggle(prev => !prev);
    };


    // * adds destinations stops setting boolean to true
    const handleDestinations = () => {
        setIsDestination(prev => !prev);
        setStopToggle(prev => !prev);
    };

    return (
        <>
        
            <View style={btnStyle.btnLayer} >

                <View style={[btnStyle.btnFrame, drawPath  ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={drawPath} onPress={handleAddPin}>

                        <View style={[btnStyle.ImageContainer,  addtoggled ? {backgroundColor: toggle} : null  ]}>
                            <Image
                                source={require(add)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Add</Text>
                    </View>


                </View>

                <View style={[btnStyle.btnFrame, drawPath || !marker ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={drawPath || !marker} onPress={handleClearPin}>

                        <View style={btnStyle.deleteImageContainer}>
                            <Image
                                source={require(removePin)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Clear</Text>
                    </View>


                </View>

                <View style={[btnStyle.btnFrame, addPin || !marker || startLocationBoolean || originToggle ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={addPin || !marker || startLocationBoolean || originToggle} onPress={handleDrawPath}>

                        <View style={[btnStyle.ImageContainer, drawtoggled ? { backgroundColor: toggle } : null]}>
                            <Image
                                source={require(draw)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Draw</Text>
                    </View>


                </View>

                <View style={[btnStyle.btnFrame, !drawn ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={!drawn} onPress={handleDeletePath}>

                        <View style={btnStyle.deleteImageContainer}>
                            <Image
                                source={require(deletePath)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Erase</Text>
                    </View>


                </View>

                <View style={[btnStyle.btnFrame, addPin || !marker || drawtoggled || drawn || stopToggle ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={addPin || !marker || drawtoggled || drawn || stopToggle} onPress={handleStartLocation}>

                        <View style={[btnStyle.ImageContainer, originToggle ? { backgroundColor: toggle } : null]}>
                            <Image
                                source={require(origin)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Origin</Text>
                    </View>


                </View>


                <View style={[btnStyle.btnFrame, !startLocationBoolean || originToggle  ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={!startLocationBoolean || originToggle} onPress={handleDestinations}>

                        <View style={[btnStyle.ImageContainer, stopToggle ? { backgroundColor: toggle } : null]}>
                            <Image
                                source={require(stops)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Stops</Text>
                    </View>


                </View>

                <View style={[btnStyle.btnFrame, !startLocationBoolean || stopToggle ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={!startLocationBoolean || stopToggle} onPress={handleDeleteOriginAndDesMarkers}>

                        <View style={btnStyle.deleteImageContainer}>
                            <Image
                                source={require(backspace)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Delete</Text>
                    </View>


                </View>

                <View style={[btnStyle.btnFrame, !drawn && !stopsAdded || drawtoggled || stopToggle ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={!drawn && !stopsAdded || drawtoggled || stopToggle} onPress={handleSubmit}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(submit)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Submit</Text>
                    </View>


                </View>

                <View style={[btnStyle.btnFrame, !drawn || drawtoggled? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={!drawn || drawtoggled} onPress={handleSave}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(save)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Save</Text>
                    </View>


                </View>

                <View style={[btnStyle.btnFrame, addtoggled || drawtoggled || originToggle || stopToggle ? btnStyle.inactive : null]} >

                    <TouchableOpacity onPress={handleLoad} disabled={addtoggled || drawtoggled || originToggle || stopToggle}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(open)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Load</Text>
                    </View>


                </View>

            </View>
            
        </>
    );
};

export default ButtonLayout;

const btnStyle  = StyleSheet.create({


    active: {
        opacity: 1,
        backgroundColor: toggle,
    },

    inactive: {
        opacity: 0.2,
        backgroundColor: secondaryCol,
    },


    btnLayer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',

    },

    btnFrame: {
        justifyContent: 'center',
        // marginRight: 10,
        alignItems: 'center',
        width: 75,
        
    },

    ImageContainer: {
        padding: 8, // Adjust padding as needed
        backgroundColor: primaryCol, // Background color for the space around the image
        borderRadius: 10, // Adjust border radius as needed
        borderColor: accent,
        borderWidth: 2,
        
    },

    deleteImageContainer: {
        padding: 8, // Adjust padding as needed
        borderRadius: 10, // Adjust border radius as needed
        borderColor: accent,
        borderWidth: 2,
        backgroundColor: alert
    },

    image: { height: 40, width: 40 },

    text: {fontSize:14},

    textContainer: {
        paddingVertical: 2  , // Adjust padding as needed
        paddingHorizontal: 6, // Adjust padding as needed
        backgroundColor: 'grey', // Background color for the space around the image
        borderRadius: 45, // Adjust border radius as needed
        marginTop: 8,
        fontSize: 4,
        opacity: 0.5,
    },
});