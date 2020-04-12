import firebase from 'firebase'
import 'firebase/auth'
import 'dotenv/config'

const {
    REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_AUTH_DOMAIN,
    REACT_APP_FIREBASE_DATABASE_URL,
    REACT_APP_FIREBASE_PROJECT_ID,
    REACT_APP_FIREBASE_STORAGE_BUCKET,
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    REACT_APP_FIREBASE_APP_ID,
    REACT_APP_FIREBASE_APP_MEASUREMENTID,
    REACT_APP_FIREBASE_EMAIL,
    REACT_APP_FIREBASE_PASS
} = process.env

let firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
    projectId: REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID,
    measurementId: REACT_APP_FIREBASE_APP_MEASUREMENTID
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth
const provider = new firebase.auth.GoogleAuthProvider()

async function getToken() {
    await auth.signInWithEmailAndPassword(REACT_APP_FIREBASE_EMAIL, REACT_APP_FIREBASE_PASS)
    return auth.currentUser.getIdToken(true)
}

export {
    firebase as default, auth, provider, getToken
}