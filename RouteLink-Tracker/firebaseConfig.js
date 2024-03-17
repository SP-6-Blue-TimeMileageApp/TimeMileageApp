// Import the functions you need from the SDKs you need
import { initializeApp, getReactNativePersistence} from "firebase/app";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, sendPasswordResetEmail  } from "firebase/auth";
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


export function firebaseLogin(email, password) {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        console.log("User " + user.email + " has logged in \n")
    }).catch((error) => {
        console.log("Error logging in: " + error + "\n")
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
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        console.log("User " + user.email + " has been created \n")
    }).catch((error) => {
        console.log("Error creating user: " + error + "\n")
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
    const displayName = username;
    updateProfile(auth.currentUser, {
        displayName
    }).then(() => {
        console.log("Display name set \n")
    }).catch((error) => {
        console.log("Error setting display name: " + error + "\n")
    });
    
}

export function firebaseShowDisplayName(){
    const auth = getAuth();
    console.log(auth.currentUser.displayName)
}




