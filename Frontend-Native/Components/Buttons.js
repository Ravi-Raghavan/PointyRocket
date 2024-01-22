import { View, Button, StyleSheet } from "react-native";

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
        <View style={btnStyle.btnlayout}>

            <View style={btnStyle.topLayer}>

                <View style={btnStyle.textLayout}>
                    <Button
                        title='Add Pin'
                        onPress={handleAddPin}
                        touchSoundDisabled={true}
                    />
                </View>

                <View style={btnStyle.textLayout}>
                    <Button
                        title='Clear Pin'
                        onPress={handleClearPin}
                    />
                </View>

                <View style={btnStyle.textLayout}>
                    <Button
                        title='Draw Path'
                        onPress={handleDrawPath}
                    />
                </View>
            </View>

            <View style={btnStyle.topLayer}>

                <View style={btnStyle.textLayout}>
                    <Button
                        
                        title='Delete Path'
                        onPress={handleDeletePath}
                    />
               </View>


                <View style={btnStyle.textLayout}>
                    <Button
                        title='Submit'
                    // onPress={handleDeletePath}
                    />
                </View>

                <View style={btnStyle.textLayout}>
                    <Button
                        title='Save'
                    // onPress={handleDeletePath}
                    />
                </View>
            </View>
            

            
        </View>
    );
};

export default ButtonLayout;

const btnStyle  = StyleSheet.create({


    topLayer: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        paddingHorizontal: 8,
        marginBottom: 16,
    },

    textLayout: {
        width: '30%',
        backgroundColor: '#00aeef',
        marginHorizontal:8,
        // flex:1,
    },
});