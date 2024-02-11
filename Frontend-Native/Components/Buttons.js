import { useEffect, useState } from "react";
import { View, Button, StyleSheet, Image, Text, TouchableOpacity } from "react-native";


// image file path
const add= '../assets/marker.png';
const removePin = '../assets/removePin.png';
const draw = '../assets/draw.png';
const deletePath = '../assets/delete.png';
const submit = '../assets/submit.png';
const save = '../assets/save.png';
const open = '../assets/open.png';

// colors for UI
const primaryCol = '#ED7D31' //'#FFBB64';
const secondaryCol = '#4F4A45'//'#2D3250';
const accent = 'white';
const toggle = '#005B41';
const sent = '#232D3F';

const ButtonLayout = ({ marker, addPin, setAddPin, setRemovePin, drawPath, setDrawPath, setDeletePath, drawn, isSubmit, isToSave,
    setIsStartLoc, setIsDestination, setRoute }) =>{

    const [addtoggled, isAddToggled] = useState(false);
    const [drawtoggled, isDrawToggled] = useState(false);

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

    // * submit button
    const handleSubmit = () => {
        if (drawn) {
            isSubmit(true);
        }
    };


    // * save path button
    const handleSave = () => {
        if (drawn) {
            isToSave(true);
        }
    };
    

    // * adds start location
    const handleStartLocation = () => {
        setIsStartLoc(prev => !prev);;
    };


    // * adds destinations stops setting boolean to true
    const handleDestinations = () => {
        setIsDestination(prev => !prev);
    };

    const handleRoute = () => {
        setRoute(true);
    };

    return (
        <>
             <View style={btnStyle.btnLayer}>

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

                        <View style={btnStyle.ImageContainer}>
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

                <View style={[btnStyle.btnFrame, addPin || !marker ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={addPin || !marker} onPress={handleDrawPath}>

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

                        <View style={btnStyle.ImageContainer}>
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
            </View>

            

            <View style={btnStyle.btnLayer}>

               
                

                <View style={[btnStyle.btnFrame, !drawn ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={!drawn} onPress={handleSubmit}>

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

                <View style={[btnStyle.btnFrame, !drawn ? btnStyle.inactive : null]} >

                    <TouchableOpacity disabled={!drawn} onPress={handleSave}>

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

                <View style={btnStyle.btnFrame} >

                    <TouchableOpacity >

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

                <View style={btnStyle.btnFrame} >

                    <TouchableOpacity onPress={handleStartLocation}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(open)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Start Location</Text>
                    </View>


                </View>


                <View style={btnStyle.btnFrame} >

                    <TouchableOpacity onPress={handleDestinations}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(open)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Destinations</Text>
                    </View>


                </View>

                <View style={[btnStyle.btnFrame]} >

                    <TouchableOpacity  onPress={handleRoute}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(save)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Route</Text>
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
        opacity: 0.5,
        backgroundColor: secondaryCol,
    },

    pressed: {
        backgroundColor: sent,
    },

    btnLayer: {
        width: '100%',
        height: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnFrame: {
        justifyContent: 'center',
        // marginHorizontal: 10,
        marginRight: 10,
        alignItems: 'center',
        
    },

    ImageContainer: {
        padding: 8, // Adjust padding as needed
        backgroundColor: primaryCol, // Background color for the space around the image
        borderRadius: 10, // Adjust border radius as needed
        borderColor: accent,
        borderWidth: 2,
        
    },

    image: { height: 30, width: 30 },

    text: {fontSize:10},

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