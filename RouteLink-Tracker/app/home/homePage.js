import React, { useState, useEffect } from 'react';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { TextInput, StyleSheet, Text, View, Button, KeyboardAvoidingView, Platform } from 'react-native';
import * as Location from 'expo-location';
import { firebaseLogin, firebaseCurrentUser } from '../../firebaseConfig';

export default function App() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 33.93874201464112,
    longitude: -84.51974379133362,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapJson = [];

  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const getUserLocation = async () => {
    try {

      console.log("This is the home page")
      firebaseCurrentUser()

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const newUserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setUserLocation(newUserLocation);
      setMapRegion(newUserLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Error getting location');
    }
  };

  const TextSearch = async () => {
    try {
      console.log('Search Query:', searchQuery);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=AIzaSyAR-7BkfmO7SNi_3L9qHAmRLklVOSgOKFQ` // Put API key here
      );
      const data = await response.json();
      console.log('API Response:', data);

      if (data.results && data.results.length > 0) {
        const firstResult = data.results[0];
        const { geometry, name } = firstResult;
        const { location } = geometry;

        setSearchedLocation({
          name: name || 'Searched Location',
          coordinate: {
            latitude: location.lat,
            longitude: location.lng,
          },
        });

        setMapRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        setErrorMsg(null);
      } else {
        setSearchedLocation(null);
        setErrorMsg('No results found');
      }
    } catch (error) {
      console.error('Error with text search', error);
      setSearchedLocation(null);
      setErrorMsg('Error with text search');
    }
  };

  useEffect(() => {
    let locationListener;
    const startLocationUpdates = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        // Starts continuous location updates
        locationListener = await Location.watchPositionAsync(
          { enableHighAccuracy: true, timeInterval: 1000 },
          (location) => {
            const newUserLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            };
            setUserLocation(newUserLocation);
          }
        );
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location');
      }
    };
    startLocationUpdates();

    return () => {
      if (locationListener) {
        locationListener.remove();
      }
    };
  }, []);

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 45 : 0}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        apiKey='AIzaSyAR-7BkfmO7SNi_3L9qHAmRLklVOSgOKFQ' // Put API key here
      >
        {searchedLocation && (
          <Marker
            coordinate={searchedLocation.coordinate}
            title={searchedLocation.name}
            pinColor="red"
          />
        )}
        {userLocation && (
          <>
            <Circle
              center={userLocation}
              radius={5}
              fillColor="rgba(0, 200, 255, 0.3)"
            />
            <Marker coordinate={userLocation} title="User" pinColor="cyan" />
          </>
        )}
      </MapView>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Button title="Search" onPress={TextSearch} />

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});