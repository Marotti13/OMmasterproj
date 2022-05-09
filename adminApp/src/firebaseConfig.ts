import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyC0Az7OML03rK3K41QnwdBRImD2GvXNVqo",
    authDomain: "myapp-react-452d8.firebaseapp.com",
    projectId: "myapp-react-452d8",
    storageBucket: "myapp-react-452d8.appspot.com",
    messagingSenderId: "793700872338",
    appId: "1:793700872338:web:127b2d91f67da1c0c5b64b",
    measurementId: "G-RH6JTFPYBB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db=firebase.firestore();
const store = firebase.storage();

firebase.auth().signInWithEmailAndPassword('temp@temp.edu','temp123');
export{ db,store};