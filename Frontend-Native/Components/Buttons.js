import { View, Button, StyleSheet, Image, Text, TouchableOpacity } from "react-native";


// image file path
const addPin = '../assets/marker.png';
const removePin = '../assets/removePin.png';
const drawPath = '../assets/draw.png';
const deletePath = '../assets/deltePath.png';
const submit = '../assets/submit.png';
const save = '../assets/save.png';

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
                        <Text>Add Pin</Text>
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
                        <Text>Clear Pin</Text>
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
                        <Text>Draw Path</Text>
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
                        <Text>Delete Path</Text>
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
                        <Text>Submit</Text>
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
                        <Text>Save Path</Text>
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
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'blue'
    },

    btnFrame: {
        width: '33%',
        height: '99%',
        // borderRadius: 45,
        backgroundColor: '#ff9b94',
        justifyContent: 'center',
        alignItems: 'center',
    },

    ImageContainer: {
        padding: 10, // Adjust padding as needed
        backgroundColor: 'blue', // Background color for the space around the image
        borderRadius: 45, // Adjust border radius as needed
    },

    image: { height: 20, width: 20 },

    textContainer: {
        paddingVertical: 2  , // Adjust padding as needed
        paddingHorizontal: 5, // Adjust padding as needed
        backgroundColor: 'blue', // Background color for the space around the image
        borderRadius: 45, // Adjust border radius as needed
        marginTop: 4,
    },
});