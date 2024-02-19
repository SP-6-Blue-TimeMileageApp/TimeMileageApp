import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';

const login = () => {
    const router = useRouter();

    return(
        <View style={styles.container}>
            <Image source={require('../assets/mainLogo.png')} style={styles.imageContainer} />

            <View style={styles.loginContainer}>
                <Text style={{color: 'white'}}>Username</Text>
                <Text style={{color: 'white'}}>Password</Text>
                
                <Button onPress={() => router.navigate('/home')} title='Login'></Button>
                <Button onPress={() => router.navigate('forgotPasswordPage')} title='Forgot Password'></Button>
            </View>
        
    </View>
    )
};

export default login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 24,
        backgroundColor: '#515151',
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

    inputText: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: 200,
    }
})