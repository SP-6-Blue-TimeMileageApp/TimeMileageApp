import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { TextInput, StyleSheet, Text, View, Button, KeyboardAvoidingView, Platform } from 'react-native';
import * as Location from 'expo-location';
import { firebaseLogin, firebaseCurrentUser, firebasePushTrip } from '../../firebaseConfig';

export default function App() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 33.93874201464112,
    longitude: -84.51974379133362,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapJson = []; // Unused. Can be used to change Map theme
  const apiKey = //Enter API Key Here

  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState([]);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [showDirectionsButton, setShowDirectionsButton] = useState(false);
  const [showGoButton, setShowGoButton] = useState(false);
  const [showStopButton, setShowStopButton] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);

  // Gets user's current location information
  const getUserLocation = async () => {
    try {

      console.log("This is the home page")
      firebaseCurrentUser()
      
      let { status } = await Location.requestForegroundPermissionsAsync(); // Requests permission for location information
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      // Gets user's location coordinates. Adjusts map.
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
  // Allows for text search for locations
  const TextSearch = async () => {
    try {
      console.log('Search Query:', searchQuery);
      // Calls Places API to find the location
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${apiKey}`
      );
      // Parses response as JSON and prints it in log
      const data = await response.json();
      console.log('API Response:', data);

      // Processes search result
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

        // Adjusts map over searched location
        setMapRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        // Show directions button
        setShowDirectionsButton(true);
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
  // Gets direction from user's current location to searched location. Can set this to repeat more often to adjust the route as the user drives, but requires calling the API everytime.
  const getDirections = async () => {
    try {
      // Calls Directions API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${searchedLocation.coordinate.latitude},${searchedLocation.coordinate.longitude}&key=${apiKey}` //put API key here

      );
      // Parses response as JSON
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const polyline = route.overview_polyline.points;
        const decodedPolyline = decodePolyline(polyline); // Decodes polyline points
        setDirections(decodedPolyline); // Sets variable based on decoded polyline points
        setShowGoButton(true); // Makes the "GO" button visible
      }
    } catch (error) {
      console.error('Error getting directions:', error);
    }
  };
  // Function to decode polyline points. Decodes Google's polyline response into an array of coordinates. 
  // Credit to Ayhid, https://gist.github.com/ayhid/eda4274a3c2c7abe22da3c8688e1c836
  function decodePolyline(encoded) {
    var points = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;
    
    while (index < len) {
        var b, shift = 0, result = 0;
        
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63; // finds ascii and subtracts it by 63
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        
        var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        
        shift = 0;
        result = 0;
        
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        
        var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lng += dlng;
        
        points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
    
    return points;
}
  // Gets distance information between current location and searched location
  const getDistanceInfo = async () => {
    try {
      // Calls Distance Matrix API to get time and distance, sets variable
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocation.latitude},${userLocation.longitude}&destinations=${searchedLocation.coordinate.latitude},${searchedLocation.coordinate.longitude}&key=${apiKey}` //put API key here

      );
      const data = await response.json(); // Parses response as JSON
      if (data.rows && data.rows.length > 0) {
        const distanceText = data.rows[0].elements[0].distance.text;
        const durationText = data.rows[0].elements[0].duration.text;
        setDistanceInfo({ distance: distanceText, duration: durationText });
      }
    } catch (error) {
      console.error('Error getting distance info:', error);
      setDistanceInfo(null);
    }
  };
  // Starts trip. Notes coordinates and starts timer.
  const startTrip = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setStartCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setStartTime(Date.now());
      setShowGoButton(false);
      setShowStopButton(true);
    } catch (error) {
      console.error('Error starting trip:', error);
    }
  };
  // Ends trip. Notes coordinates and ends timer. Calls function to calculate distance. Sends information to database.
  const stopTrip = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setEndCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setShowStopButton(false);
      const endTime = Date.now();
      const timeTakenSeconds = (endTime - startTime) / 1000;
      const minutes = Math.floor(timeTakenSeconds / 60);
      const seconds = Math.floor(timeTakenSeconds % 60);
      const distance = calculateDistance(startCoordinates, endCoordinates);
      console.log('Time taken:', `${minutes} minutes and ${seconds} seconds`);
      console.log('Distance traveled:', distance, 'miles');

      const startDate = (new Date(startTime)).toUTCString();
      const endDate = (new Date(endTime)).toUTCString();

      const startAddress = await getAddressFromCoordinates(startCoordinates.latitude, startCoordinates.longitude)
      const endAddress = await getAddressFromCoordinates(endCoordinates.latitude, endCoordinates.longitude)

      trip = firebasePushTrip(startDate, endDate, startAddress, endAddress, distance);
      // Send time and distance variables to database here <---------------------------------------------------------------------------------------------
    } catch (error) {
      console.error('Error stopping trip:', error);
    }
  };

  //Fetches address given input coordinates using google geocoding api
  const getAddressFromCoordinates = async(lat, long) => {
    try{
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        out = data.results[0].formatted_address;
      } else {
        out = "Failed to retrieve address";
      }
      return out;

    } catch (error) {
      console.log("Error fetching address: ", error)
    }
  }

  // Calculates the straight line distance traveled from starting location to ending location in miles. Would be better to find a way to calculate true distance traveled.
  const calculateDistance = (start, end) => {
    const earthRadiusMeters = 6371e3;
    const metersToMiles = 0.000621371;
    const lat1 = (Math.PI / 180) * start.latitude;
    const lat2 = (Math.PI / 180) * end.latitude;
    const deltaLat = (Math.PI / 180) * (end.latitude - start.latitude);
    const deltaLng = (Math.PI / 180) * (end.longitude - start.longitude);
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceMeters = earthRadiusMeters * c;
    const distanceMiles = distanceMeters * metersToMiles;
    return distanceMiles;
  };


  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation && searchedLocation) {
      getDistanceInfo();
    }
  }, [userLocation, searchedLocation]);

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
        showsUserLocation={true} // Uses Google Maps icon for user position rather than a marker. Shows direction of travel and much better at tracking location
      >
        {searchedLocation && (
          <Marker
            coordinate={searchedLocation.coordinate}
            title={searchedLocation.name}
            pinColor="red"
          />
        )}
        {directions.length > 0 && (
          <Polyline
            coordinates={directions}
            strokeWidth={6}
            strokeColor="#1a8fff"
          />
        )}
      </MapView>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Button title="Search" onPress={TextSearch} />
      {showDirectionsButton && (
      <Button title="Get Directions" onPress={getDirections} />
      )}
      {showGoButton && (
        <Button title="GO" onPress={startTrip} color="green" />
      )}
      {showStopButton && (
        <Button title="STOP" onPress={stopTrip} color="red" />
      )}
      {distanceInfo && (
        <Text style={styles.distanceInfo}>
          Distance: {distanceInfo.distance}, Duration: {distanceInfo.duration}
        </Text>
      )}
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
  distanceInfo: {
    marginTop: 10,
  },
});