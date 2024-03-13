import { Button, Text, View, Image, StyleSheet } from 'react-native';

const Settings = () => {
    return(
        <View style={styles.container}>
            <Text style={{textAlign: "center"}}>Account Details</Text>
        </View>   
    )
};


export default Settings;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 24,
        backgroundColor: '#515151',
        justifyContent: "space-between",
    },

    text: {
        color: "#ffff"
    },

    loginContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    imageContainer:{
        position: "relative",
    },

    buttonContainer: {
        backgroundColor: "#D3D3D3",
        color: "#ffff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        width: 200,
        alignItems: "center",
    }

})