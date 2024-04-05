import { Text, View, Image, StyleSheet, TouchableOpacity, RefreshControl, ScrollView, SafeAreaView } from 'react-native';
import { firebaseGetDatabase, firebaseGetPremiumStatus } from '../../firebaseConfig';
import React, { useEffect, useState, useCallback } from 'react';
import { Table, Row, Rows } from 'react-native-table-component'; 
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';
import testImage from "../../assets/bannerAd.jpg";



const History = () => {

    const handleExport= async () => {
        console.log('Exporting data to device');
        const currentTrips = trips;
    
        console.log(trips);
    
        // Convert the data to the format that `XLSX.utils.aoa_to_sheet` expects
        const data = Object.keys(trips).map(key => [
            currentTrips[key].startTime, 
            currentTrips[key].endTime, 
            parseFloat(currentTrips[key].distance).toFixed(5) + ' miles', 
            currentTrips[key].startLocation,
            currentTrips[key].endLocation
        ]);
    
        console.log(data);
    
        // Create a new workbook and worksheet
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([['Start Time', 'End Time', 'Distance', 'Start Location', 'End Location'], ...data]);
    
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

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      firebaseGetPremiumStatus().then(status => {
        setPremiumStatus(status)
        setRefreshing(false)
      }).catch(error => {
        console.log(error) 
        setRefreshing(false)});
    }, []);



    const [trips, setTrips] = useState({});
    const [premiumStatus, setPremiumStatus] = useState(null);

    useEffect(() => {
        const watchHistory = firebaseGetDatabase((fetchedTrips) => {
            setTrips(fetchedTrips);
        })

        firebaseGetPremiumStatus().then(status => setPremiumStatus(status)).catch(error => console.log(error));
        console.log(premiumStatus);

        return () => watchHistory

    }, []);

    const header = ['Date', 'Distance', 'End Location'];
    const data = Object.keys(trips).sort().slice(-6).reverse()
    .map(key => [
        trips[key].startTime, 
        parseFloat(trips[key].distance).toFixed(5) + ' miles', 
        trips[key].endLocation
    ]);
      
    return(


        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView>
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}>
            
            </RefreshControl>

            <View style={styles.container}>
            {!premiumStatus && (
                <View style={styles.bannerAd}>
                    <Image source={testImage} style={styles.adImage} />
                </View>
            )}

            <View style={{flex: 1, padding: 20}}>
                <Table borderStyle={{borderWidth: 2}}>
                    <Row data={header}/>
                    <Rows data={data} />
                </Table>
            </View>
            
            <View style={{flex: 1, justifyContent: "flex-end"}}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleExport} style={styles.button}><Text style={{textAlign: "center"}}>Export</Text></TouchableOpacity>
                </View>
            </View>
            
            </View> 
              
        </ScrollView>
        </SafeAreaView>
        


    )
};


export default History;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    bannerAd: {
        height: 50,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adImage: {
        width: '100%',
        height: '100%',
    },

})