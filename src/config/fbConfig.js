import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBI33J2kkpNyXBJ6fNXWs1iNZc9hOvL-aY",
    authDomain: "chat-app-7d14c.firebaseapp.com",
    databaseURL: "https://chat-app-7d14c.firebaseio.com",
    projectId: "chat-app-7d14c",
    storageBucket: "chat-app-7d14c.appspot.com",
    messagingSenderId: "468890275125"
};

firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true })

export default firebase