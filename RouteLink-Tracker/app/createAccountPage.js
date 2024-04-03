import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebaseCreateAccount, firebaseVerificationEmail } from '../firebaseConfig';


const createAccount = () => {
    const router = useRouter();
    const [email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(true);
    const [errorMessages, setErrorMessage] = useState('')



    //we can add this back in if we want email verification in order for new users to create an account
    const handleNewAccount = () => {
        router.back();
        firebaseVerificationEmail();
    }


    const createUser = async () => {

        console.log("Your email is now " + email)
        console.log("Your password is now " + password)

        if(password.length < 6 || confirmPassword.length < 6) {
            setErrorMessage("Password must be at least 6 characters long")
            return;
        }

        if (password == confirmPassword) {
            await firebaseCreateAccount(email, password).then((userCredential) => {
                console.log("Creating account with " + email + " and " + password)
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
    
            }).catch((error) => {
                console.log("Error creating account in with " + email + " and " + password)
                console.log("Error: " + error)
                setErrorMessage("The email is already in use. Please use a different email.")
            })
        }else {
            setErrorMessage("Passwords do not match")
        }
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

    const setConfirmPass = (text) => {
        setConfirmPassword(text)
    }

    
    
    return(
        <View style={styles.container}>
            <Image source={require('../assets/mainLogo.png')} style={styles.imageContainer} />

            <View style={styles.loginContainer}>
                {errorMessages ? <Text style={{color: 'red', textAlign: 'center'}}>{errorMessages}</Text> : null}

                {!email && <Text style={styles.required}><Icon name='star' size={10} color={'red'}>Required</Icon></Text>}
                <TextInput style={[styles.inputText, !email && styles.error]} placeholder='Email' onChangeText={setEmail} value={email} autoCorrect={false}></TextInput>

                {!password && <Text style={styles.required}><Icon name='star' size={10} color={'red'}>Required</Icon></Text>}
                <TextInput style={[styles.inputText, !password && styles.error]} placeholder='Password' onChangeText={setPass} value={password} autoCorrect={false}></TextInput>

                {!password && <Text style={styles.required}><Icon name='star' size={10} color={'red'}>Required</Icon></Text>}
                <TextInput style={[styles.inputText, !password && styles.error]} placeholder='Confirm Password' onChangeText={setConfirmPass} value={confirmPassword} autoCorrect={false}></TextInput>
                
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
