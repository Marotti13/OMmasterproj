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
  export async function firebaseTest(){
      firebase.firestore().collection("surveys").doc("pTUVVNVzEpxp6P77kQON").get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});}

const db=firebase.firestore();
export default db;