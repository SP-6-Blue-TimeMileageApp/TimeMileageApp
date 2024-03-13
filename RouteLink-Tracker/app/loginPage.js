import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebaseLogin, firebaseCurrentUser } from '../firebaseConfig';


const login = () => {
    const router = useRouter();
    const [username, setUserEmail] = useState('');
    const [password, setPassword] = useState('');


    const setEmail = (text) => {
        setUserEmail(text)
    }

    const setPass = (text) => {
        setPassword(text)
    }

    const loginUser = () => {
        console.log("Your email is now " + username)
        console.log("Your password is now " + password)

        firebaseLogin(username, password)
        console.log("Logging in with " + username + " and " + password)
        router.push({pathname: 'loadingPage', params: {username: username}});

        console.log("This is the login page")
        firebaseCurrentUser()

    }



    return(
        <View style={styles.container}>
            <Image source={require('../assets/mainLogo.png')} style={styles.imageContainer} />

            <View style={styles.loginContainer}>
                <Text>Enter testing@gmail.com for username</Text>
                <Text>Enter testing for password</Text>

                {!username && <Text style={styles.required}><Icon name='star' size={10} color={'red'}>Required</Icon></Text>}
                <TextInput style={[styles.inputText, !username && styles.error]} placeholder='Username/Email' onChangeText={setEmail} value={username} autoCorrect={false}></TextInput>

                {!password && <Text style={styles.required}><Icon name='star' size={10} color={'red'}>Required</Icon></Text>}
                <TextInput style={[styles.inputText, !password && styles.error]} placeholder='Password' onChangeText={setPass} value={password} autoCorrect={false}></TextInput>

                <TouchableOpacity onPress={loginUser} style={styles.buttonContainer}>
                    <Text style={styles.text}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.navigate('forgotPasswordPage')} style={styles.buttonContainer}>
                    <Text style={styles.text}>Forgot Password</Text>
                </TouchableOpacity>

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
        backgroundColor: 'white'
    },

    buttonContainer: {
        backgroundColor: "#210000",
        color: "#ffff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        width: 200,
        alignItems: "center"
    },

    text: {
        color: "#ffff"
    },

    error: {
        borderColor: 'red',
    },
    
    required: {
        color: 'red',
        fontSize: 8,
        alignSelf: 'flex-start',
    }
})