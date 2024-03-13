import { Button, Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { firebaseCurrentUser, firebaseGetDatabase } from '../../firebaseConfig';
import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';


const handleExport= async () => {
    console.log('Exporting data to device');
    const trips = await firebaseGetDatabase();

    console.log(trips);

    // Convert the data to the format that `XLSX.utils.aoa_to_sheet` expects
    const data = Object.keys(trips).map(key => [key, trips[key].distance, trips[key].trip]);

    console.log(data);

    // Create a new workbook and worksheet
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet([['Trip ID', 'Distance', 'Trip'], ...data]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Trips', true);

    // Write the workbook to a file
    const base64 = XLSX.write(wb, {type:'base64', bookType:"xlsx"});
    const filename = FileSystem.documentDirectory + 'trips.xlsx';
    await FileSystem.writeAsStringAsync(filename, base64, { encoding: FileSystem.EncodingType.Base64 })
    .then(() => {
        Sharing.shareAsync(filename)
    });

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
            <View style={{flex: 1, justifyContent: "flex-end"}}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleExport} style={styles.button}><Text style={{textAlign: "center"}}>Export</Text></TouchableOpacity>
                </View>
            </View>
            
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
        flexDirection: 'row',
        justifyContent: 'space-around', 
        marginBottom: 10, 
        padding: 10, 
    },

    button: {
        borderRadius: 10,
        backgroundColor: '#D3D3D3',
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        margin : 10,
    }

})