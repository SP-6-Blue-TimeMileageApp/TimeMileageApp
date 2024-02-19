import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Page() {
    const router = useRouter();

    return (
    <View style={styles.container}>
        <Image source={require('../assets/mainLogo.png')} style={styles.imageContainer} />

        <View style={styles.loginContainer}>            
            <Button onPress={() => router.navigate('loginPage')} title='Login'></Button>
            <Button onPress={() => router.navigate('createAccountPage')} title='Create Account'></Button>
        </View>
        
    </View>
  );
  
}



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

})


