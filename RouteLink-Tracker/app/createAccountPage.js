import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebaseCreateAccount } from '../firebaseConfig';



const createAccount = () => {
    const router = useRouter();
    const [username, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(true);

    const createUser = async () => {

        console.log("Your email is now " + username)
        console.log("Your password is now " + password)

        await firebaseCreateAccount(username, password)

        Alert.alert(
            'Email Sent', 
            'Please check your email to confirm account creation.', 
            [
                {text: 'OK', onPress: () => router.back()}
            ], 
            {cancelable: false}
        );

        setEmail('');
        setPass('');
    }

    const setEmail = (text) => {
        setUserEmail(text)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(text)) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }

    const setPass = (text) => {
        setPassword(text)
    }
    
    
    
    return(
        <View style={styles.container}>
            <Image source={require('../assets/mainLogo.png')} style={styles.imageContainer} />

            <View style={styles.loginContainer}>

                {!username && <Text style={styles.required}><Icon name='star' size={10} color={'red'}>Required</Icon></Text>}
                <TextInput style={[styles.inputText, !username && styles.error]} placeholder='Email' onChangeText={setEmail} value={username} autoCorrect={false}></TextInput>

                {!password && <Text style={styles.required}><Icon name='star' size={10} color={'red'}>Required</Icon></Text>}
                <TextInput style={[styles.inputText, !password && styles.error]} placeholder='Password' onChangeText={setPass} value={password} autoCorrect={false}></TextInput>
                
                <TouchableOpacity onPress={createUser} style={styles.buttonContainer}>
                    <Text style={styles.text}>Create Account</Text>
                </TouchableOpacity>
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
        width: 200,
        alignItems: "center"
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
