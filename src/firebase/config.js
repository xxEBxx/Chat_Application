import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import {setUser} from '../components/UserState'

const firebaseConfig = {
  apiKey: "AIzaSyBGpnAIAVYljYWuySARpcNCaf1jE_jZQSs",
  authDomain: "firstproject-2e10a.firebaseapp.com",
  projectId: "firstproject-2e10a",
  storageBucket: "firstproject-2e10a.appspot.com",
  messagingSenderId: "804169837571",
  appId: "1:804169837571:web:e44e80ba587a9a8ba13236",
  measurementId: "G-YGWCN654ZQ"
};


firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const projectFirestore = firebase.firestore()

auth.onAuthStateChanged((user) => {
  if (user) {
    setUser(user);
    console.log(`User ID: ${user.uid}`);
  } else {
    setUser(null);
    console.log("User is signed out");
  }
});

export {auth,projectFirestore}

