import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';


const forgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(true);

    const setPassword = (text) => {
        setEmail(text)
        console.log("Your email is now " + text)

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(text)) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }

    }

    const changePassword = () => {
        Alert.alert(
            'Email Sent', 
            'Please check your email for a recovery code', 
            [
                {text: 'OK', onPress: () => router.navigate('loginPage')}
            ], 
            {cancelable: false}
        );
        setEmail('')
    }

    return(
        <View style={styles.container}>
            <Image source={require('../assets/mainLogo.png')} style={styles.imageContainer} />

            <View style={styles.loginContainer}>

                {!email && <Text style={styles.required}><Icon name='star' size={10} color={'red'}>Required</Icon></Text>}
                <TextInput style={[styles.inputText, !email && styles.error]} placeholder='Email' onChangeText={setPassword} value={email}></TextInput>

                <TouchableOpacity onPress={changePassword} style={styles.buttonContainer} disabled={isButtonDisabled}>
                    <Text style={styles.text}>Send Recovery Code</Text>
                </TouchableOpacity>
            </View>
        
        </View>
    )
};


export default forgotPassword;

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
