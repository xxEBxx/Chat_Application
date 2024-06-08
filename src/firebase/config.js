import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import {setUser} from '../components/UserState'

const firebaseConfig = {
  apiKey: "AIzaSyAzanJSdxCJkH-Sxg7tJ_cNwD31tt487zs",
  authDomain: "connectify-595ba.firebaseapp.com",
  projectId: "connectify-595ba",
  storageBucket: "connectify-595ba.appspot.com",
  messagingSenderId: "227159052993",
  appId: "1:227159052993:web:675ac2698a3f703e913a40",
  measurementId: "G-BQ7GRLDV4L"
};


firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const projectFirestore = firebase.firestore()

const signInGoogle = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    console.log('User signed in successfully:', result.user);
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

export {auth,projectFirestore,signInGoogle}

