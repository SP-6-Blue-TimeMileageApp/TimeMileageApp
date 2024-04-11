import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { TextInput, StyleSheet, Text, View, Button, KeyboardAvoidingView, Platform , Image, TouchableOpacity} from 'react-native';
import * as Location from 'expo-location';
import { firebaseLogin, firebaseCurrentUser, firebaseGetPremiumStatus, firebasePushTrip } from '../../firebaseConfig';
import testImage from "../../assets/bannerAd.jpg";

export default function App() {

  const [mapRegion, setMapRegion] = useState({
    latitude: 33.93874201464112,
    longitude: -84.51974379133362,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapJson = []; // Unused. Can be used to change Map theme
  const APIKey = '' // Put API key here

  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState([]);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [showDirectionsButton, setShowDirectionsButton] = useState(false);
  const [showGoButton, setShowGoButton] = useState(false);
  const [showStopButton, setShowStopButton] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);
  const [premiumStatus, setPremiumStatus] = useState(firebaseGetPremiumStatus());

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
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&fields=name,geometry,photos,opening_hours,rating&key=${APIKey}`
      );
      // Parses response as JSON and prints it in log
      const data = await response.json();
      console.log('API Response:', data);

      // Processes search result
      if (data.results && data.results.length > 0) {
        const firstResult = data.results[0];
        const { geometry, name, photos, opening_hours, rating } = firstResult;
        const { location } = geometry;
  
        setSearchedLocation({
          name: name || 'Searched Location',
          coordinate: {
            latitude: location.lat,
            longitude: location.lng,
          },
        });
        setLocationDetails({
          name: name || 'Searched Location',
          photo: photos && photos.length > 0 ? photos[0].photo_reference : null,
          isOpen: opening_hours ? opening_hours.open_now : null,
          rating: rating || null,
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
        setShowGoButton(false);
        setShowStopButton(false);
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
  // Displays photo, name, rating, and open status after searching for a location
  const LocationDetails = ({ details, onClose }) => {
    if (!details) return null;
  
    const { photo, isOpen, rating, name } = details;
  
    return (
      <View style={styles.locationDetails}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <View style={styles.closeButtonBackground}>
            <Text style={styles.closeButtonText}>x</Text>
          </View>
        </TouchableOpacity>
        {photo && (
          <Image
            style={styles.locationPhoto}
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo}&key=${APIKey}`,
            }}
          />
        )}
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{name}</Text>
          {isOpen !== null && (
            <Text
              style={[
                styles.locationStatus,
                isOpen ? styles.openStatus : styles.closedStatus,
              ]}
            >
              {isOpen ? 'Open' : 'Closed'}
            </Text>
          )}
          {rating !== null && (
            <Text style={styles.locationRating}>Rating: {rating}</Text>
          )}
        </View>
      </View>
    );
  };
  // Gets direction from user's current location to searched location. Can set this to repeat more often to adjust the route as the user drives, but requires calling the API everytime.
  const getDirections = async () => {
    try {
      // Calls Directions API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${searchedLocation.coordinate.latitude},${searchedLocation.coordinate.longitude}&key=${APIKey}`
      );
      // Parses response as JSON
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const polyline = route.overview_polyline.points;
        const decodedPolyline = decodePolyline(polyline); // Decodes polyline points
        setDirections(decodedPolyline); // Sets variable based on decoded polyline points
        setShowGoButton(true); // Makes the "GO" button visible
        setShowDirectionsButton(false); // Hides the "Get Directions" button
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
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocation.latitude},${userLocation.longitude}&destinations=${searchedLocation.coordinate.latitude},${searchedLocation.coordinate.longitude}&key=${APIKey}`
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

      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      setShowStopButton(false);
      setDistanceInfo(null);
      setSearchQuery('');
      setDirections([]);
      setSearchedLocation(null);
      
    } catch (error) {
      console.error('Error stopping trip:', error);
    }
  };

  const clearScreen = () => {
    setDistanceInfo(null);
    setSearchQuery('');
    setDirections([]);
    setSearchedLocation(null);
    setShowGoButton(false);
    setShowStopButton(false);
  }

  //Fetches address given input coordinates using google geocoding api
  const getAddressFromCoordinates = async(lat, long) => {
    try{
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${APIKey}`
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
    firebaseGetPremiumStatus().then(status => setPremiumStatus(status)).catch(error => console.log(error));
  }, []);

  useEffect(() => {
    if (userLocation && searchedLocation) {
      getDistanceInfo();
    }
  }, [userLocation, searchedLocation]);

  // useEffect to calculate distance after endCoordinates update
  useEffect(() => {
    const calculateTrip = async () => {
      if (endCoordinates) {
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
      }
    };
  
    calculateTrip();
  }, [endCoordinates]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <LocationDetails
        details={locationDetails}
        onClose={() => setLocationDetails(null)}
      />

        {/* {!premiumStatus && (
                <View style={styles.bannerAd}>
                    <Image source={testImage} style={styles.adImage} />
                </View>
        )} */}
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
      <View style={{flexDirection: "row", justifyContent: "flex-end", marginTop: 5, marginLeft: 5, marginRight: 5}}>

        <View style={{flex: 1, height: 40, borderRadius:10}}>
          <TextInput
          style={[styles.input, {borderRadius:10}]}
          placeholder="Search..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          />

          {searchQuery ? (
            <TouchableOpacity 
                style={{ position: 'absolute', right: 10, height:40, justifyContent: "center" }} 
                onPress={clearScreen}
            >
                <Text>X</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity title="Search" onPress={TextSearch} style={{justifyContent: "center", padding: 10, marginLeft: 10, borderRadius: 10, height:40, backgroundColor: "#D3D3D3"}}>
          <Text>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: "row", justifyContent: "flex-start", margin:5}}>
        {showDirectionsButton && (
          <TouchableOpacity onPress={getDirections} style={{justifyContent: "center", padding: 10, marginRight: 10, borderRadius: 10, height:40, backgroundColor: "#D3D3D3"}}>
            <Text>Get Directions</Text>
          </TouchableOpacity>
        )}
        {showGoButton && (
          <TouchableOpacity onPress={startTrip} style={{justifyContent: "center", padding: 10, marginRight: 10, borderRadius: 10, height:40, backgroundColor: "#50C878"}}>
            <Text>GO</Text>
          </TouchableOpacity>
        )}
        {showStopButton && (
          <TouchableOpacity onPress={stopTrip} style={{justifyContent: "center", padding: 10, marginRight: 10, borderRadius: 10, height:40, backgroundColor: "#FF3131"}}>
            <Text>STOP</Text>
          </TouchableOpacity>
        )}
        {distanceInfo && (
          <Text style={styles.distanceInfo}>
            Distance: {distanceInfo.distance}, Duration: {distanceInfo.duration}
          </Text>
        )}
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </View>
      
      
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
    justifyContent: 'center',
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
  locationDetails: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  locationPhoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  locationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  openStatus: {
    backgroundColor: 'green',
    color: 'white',
  },
  closedStatus: {
    backgroundColor: 'red',
    color: 'white',
  },
  locationRating: {
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
