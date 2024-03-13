import { Button, Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { firebaseCurrentUser, firebaseGetDatabase } from '../../firebaseConfig';
import React, { useEffect, useState } from 'react';


const handleExport = () => {
    firebaseGetDatabase();
}


const History = () => {

    const [trips, setTrips] = useState({});

    useEffect(() => {
        firebaseGetDatabase().then(data => setTrips(data)).catch(error => console.log(error));
    }, []);

    return(
        <View style={styles.container}>
            <View style={styles.tripContainer}>
                <Text style={styles.headerText}>Trip ID</Text>
                <Text style={styles.headerText}>Distance</Text>
                <Text style={styles.headerText}>Trip</Text>
            </View>

            {Object.keys(trips).map((key) => (
                <View key={key} style={styles.tripContainer}>
                    <Text style={styles.tripText} numberOfLines={1} ellipsizeMode='tail'>{key}</Text>
                    <Text style={styles.tripText} numberOfLines={1} ellipsizeMode='tail'>{trips[key].distance}</Text>
                    <Text style={styles.tripText} numberOfLines={1} ellipsizeMode='tail'>{trips[key].trip}</Text>
                </View>
            ))}
            <TouchableOpacity onPress={handleExport} style={styles.buttonContainer}><Text>Export</Text></TouchableOpacity>
        </View>   


    )
};


export default History;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#515151',
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

    tripContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderColor: '#FFFFFF', 
        borderWidth: 2, 
        borderRadius: 10, 
        padding: 10,

    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderColor: '#FFFFFF', 
        borderWidth: 2, 
        borderRadius: 10, 
        padding: 10,
    },
    tripText: {
        flex: 1,
        color: '#FFFFFF',
    },

    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 10,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
    }

})