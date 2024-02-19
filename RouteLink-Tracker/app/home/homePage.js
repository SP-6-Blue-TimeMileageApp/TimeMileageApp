import React, {useState, useEffect} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
    const [mapRegion, setMapRegion] = useState({
        latitude: 33.93874201464112, 
        longitude: -84.51974379133362,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

    const mapJson = []

    const [errorMsg, setErrorMsg] = useState(null);

    const userLocation = async () => {
        try {
           
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied')
                return;
            }
            let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

            setMapRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            })
            console.log(location.coords.latitude, location.coords.longitude);
        }
        catch (error) {
            console.error('Error getting location:', error);
            setErrorMsg('Error getting location');
        }
    }

    useEffect(() => {
        userLocation();
    }, [])
  return (
    <View style={styles.container}>
        <MapView 
        provider={PROVIDER_GOOGLE}
        style={styles.map} 
        region = {mapRegion}
        customMapStyle={mapJson}
        // API Key
        >
            <Marker coordinate={mapRegion} title = 'Marker' />
        </MapView>
        <Button title = 'Get Location' onPress = {userLocation} />
        {errorMsg && <Text>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});