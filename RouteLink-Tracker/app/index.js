import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Page() {
    const router = useRouter();

    return (
    <View style={styles.container}>
        <Image source={require('../assets/mainLogo.png')} style={styles.imageContainer} />

        <View style={styles.loginContainer}>            
            <TouchableOpacity onPress={() => router.navigate('loginPage')} style={styles.buttonContainer}>
                    <Text style={styles.text}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.navigate('createAccountPage')} style={styles.buttonContainer}>
                    <Text style={styles.text}>Create Account</Text>
            </TouchableOpacity>
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


