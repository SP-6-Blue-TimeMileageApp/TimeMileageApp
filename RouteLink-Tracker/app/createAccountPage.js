import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';

const createAccount = () => {
    const router = useRouter();

    return(
        <View style={styles.container}>
            <Image source={require('../assets/mainLogo.png')} style={styles.imageContainer} />

            <View style={styles.loginContainer}>

                <Text style={styles.text}>Username</Text>
                <Text style={styles.text}>Password</Text>
                
                <Button onPress={() => router.navigate('loginPage')} title='Create Account'></Button>
            </View>
            
        </View>  
    )
};


export default createAccount;

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
    }


})
