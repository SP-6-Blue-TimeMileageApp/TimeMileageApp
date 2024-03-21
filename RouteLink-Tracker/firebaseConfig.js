// Import the functions you need from the SDKs you need
import { initializeApp, getReactNativePersistence} from "firebase/app";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword, updateEmail, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2qmiMDhviweByoeJu_gtUKROY0jnHgw0",
  authDomain: "timemileageapp.firebaseapp.com",
  databaseURL: "https://timemileageapp-default-rtdb.firebaseio.com",
  projectId: "timemileageapp",
  storageBucket: "timemileageapp.appspot.com",
  messagingSenderId: "897567496406",
  appId: "1:897567496406:web:c051accbf10616dcec9177",
  measurementId: "G-N6DYTQSFXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase();

export function firebaseGetDatabase() {
    const db = getDatabase();
    const userEmail = auth.currentUser.email.split('@')[0];
    const userEmailSanitized = userEmail.replace(/\./g, ',');
    const tripRef = ref(db, `trips/${userEmailSanitized}`);

    return new Promise((resolve, reject) => {
        onValue(tripRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                resolve(data);
                // console.log(data);
            } else {
                reject("No data found");
            }
        });
    })
};

export function firebaseGetPremiumStatus() {
    const db = getDatabase();
    const userEmail = auth.currentUser.email.split('@')[0];
    const userEmailSanitized = userEmail.replace(/\./g, ',');
    const tripRef = ref(db, `account/${userEmailSanitized}/premium`);

    return new Promise((resolve, reject) => {
        onValue(tripRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                resolve(data);
            } else {
                reject("No data found");
            }
        });
    })
};

export function firebaseLogin(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log("User " + user.email + " has logged in \n")
        return userCredential;
    }).catch((error) => {
        console.log("Error logging in: " + error + "\n")
        throw error;
    });
};

export function firebaseCurrentUser() {
    const user = auth.currentUser;
    if (user) {
        console.log("User is " + user.email + "\n")
    } else {
        console.log("No user is logged in \n")
    }
}

export function firebaseLogout() {
    auth.signOut().then(() => {
        console.log("User has logged out")
    }).catch((error) => {
        console.log("Error logging out: " + error + "\n")
    });
}

export function firebaseCreateAccount (email, password) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log("User " + user.email + " has been created \n")
        return userCredential;
    }).catch((error) => {
        console.log("Error creating user: " + error + "\n")
        throw error;
    });

}

export function firebaseVerificationEmail(){
    const auth = getAuth();
    sendEmailVerification(auth.currentUser).then(() => {
        console.log("Email sent \n")
    }).catch((error) => {
        console.log("Error sending email: " + error + "\n")
    });

}

export function firebaseForgotPassword(email){
    const auth = getAuth();
    sendPasswordResetEmail(auth, email).then(() => {
        console.log("Email sent \n")
    }).catch((error) => {
        console.log("Error sending email: " + error + "\n")
    });
}

export function firebaseSetDisplayName(username){
    const auth = getAuth();
    updateProfile(auth.currentUser, {
        displayName: username
    }).then(() => {
        console.log("Display name set \n")
    }).catch((error) => {
        console.log("Error setting display name: " + error + "\n")
    });
    
}

//this currently does not work due to a setting turned on in firebase db for email verification, in theory this should work if we turn off email enumeration
//under settings on authentication tab in firebase
export function firebaseSetEmail(email){
    const auth = getAuth();
    updateEmail(auth.currentUser, email).then(() => {
        console.log("Email set \n")
    }).catch((error) => {
        console.log("Error setting email: " + error + "\n")
    });
}

export function firebaseGetDisplayName(){
    const auth = getAuth();
    return auth.currentUser.displayName;    
}

export function firebaseGetEmailName(){
    const auth = getAuth();
    return auth.currentUser.email;    
}

export function firebaseSetPassword(password){
    const auth = getAuth();
    updatePassword(auth.currentUser, password).then(() => {
        console.log("Password set \n")
    }).catch((error) => {
        console.log("Error setting password: " + error + "\n")
    });
}


