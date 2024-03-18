import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect } from 'react';
import { firebaseGetDisplayName } from '../firebaseConfig';



const loadingPage = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {

            while(router.canGoBack()) {
                router.back();
            }
            router.replace('/home');

        }, 3000);

    }, []);


    return (
    <View style={styles.container}>
        <View style={styles.loginContainer}>            
            <FontAwesome5 name="smile" size={24} color="black" />
            <Text style={styles.text}>Welcome! {}</Text>
        </View>
        
    </View>
  );
  
}


export default loadingPage;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 24,
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

    buttonContainer: {
        backgroundColor: "#210000",
        color: "#ffff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        width: 200,
        alignItems: "center"
    }

})
