import { Button, Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { firebaseCurrentUser } from '../../firebaseConfig';


const handleExport = () => {
    firebaseCurrentUser()
}


const History = () => {
    return(
        <View style={styles.container}>
            <Text style={{textAlign: "center"}}>History</Text>
            <TouchableOpacity onPress={handleExport} style={styles.buttonContainer}><Text>Export</Text></TouchableOpacity>
        </View>   
    )
};


export default History;

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