import { View, Button, StyleSheet, Image, Text, TouchableOpacity } from "react-native";


// image file path
const addPin = '../assets/marker.png';
const removePin = '../assets/removePin.png';
const drawPath = '../assets/draw.png';
const deletePath = '../assets/deltePath.png';
const submit = '../assets/submit.png';
const save = '../assets/save.png';

// colors for UI
const primaryCol = '#ED7D31' //'#FFBB64';
const secondaryCol = '#4F4A45'//'#2D3250';
const accent = 'white';

const ButtonLayout = ({ setAddPin, setRemovePin, setDrawPath, setDeletePath }) =>{

    // * add button
    const handleAddPin = () => {
        setAddPin(prev => !prev);
    };

    // * clear button
    const handleClearPin = () => {
        setRemovePin(prev => !prev);
    };

    // * draw path button
    const handleDrawPath = () => {
        setDrawPath(prev =>!prev);
    };

    // * delete path button
    const handleDeletePath = () => {
        setDeletePath(prev =>!prev);
    };

    

    return (
        <>
             <View style={btnStyle.btnLayer}>

                <View style={btnStyle.btnFrame} >

                    <TouchableOpacity onPress={handleAddPin}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(addPin)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Add Pin</Text>
                    </View>


                </View>

                <View style={btnStyle.btnFrame} >

                    <TouchableOpacity onPress={handleAddPin}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(removePin)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Clear Pin</Text>
                    </View>


                </View>

                <View style={btnStyle.btnFrame} >

                    <TouchableOpacity onPress={handleAddPin}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(drawPath)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Draw Path</Text>
                    </View>


                </View>
            </View>

            <View style={btnStyle.btnLayer}>

                <View style={btnStyle.btnFrame} >

                    <TouchableOpacity onPress={handleAddPin}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(deletePath)}
                                style={btnStyle.image}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Delete Path</Text>
                    </View>


                </View>

                <View style={btnStyle.btnFrame} >

                    <TouchableOpacity onPress={handleAddPin}>

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

                <View style={btnStyle.btnFrame} >

                    <TouchableOpacity onPress={handleAddPin}>

                        <View style={btnStyle.ImageContainer}>
                            <Image
                                source={require(save)}
                                style={btnStyle.image}
                            />
                        </View>
                   </TouchableOpacity>

                    <View style={btnStyle.textContainer}>
                        <Text style={btnStyle.text}>Save Path</Text>
                    </View>

                    
                </View>
            </View>
            

                
        </>
    );
};

export default ButtonLayout;

const btnStyle  = StyleSheet.create({

    btnLayer: {
        width: '100%',
        height: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnFrame: {
        justifyContent: 'center',
        marginHorizontal: 40,
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