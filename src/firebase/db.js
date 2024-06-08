const firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAzanJSdxCJkH-Sxg7tJ_cNwD31tt487zs",
  authDomain: "connectify-595ba.firebaseapp.com",
  projectId: "connectify-595ba",
  storageBucket: "connectify-595ba.appspot.com",
  messagingSenderId: "227159052993",
  appId: "1:227159052993:web:675ac2698a3f703e913a40",
  measurementId: "G-BQ7GRLDV4L"
};

firebase.initializeApp(firebaseConfig);

// Access Firestore
const db = firebase.firestore();

// Data to add
const usersData = [
 
      {
        id:"",
        lastSignInTime: "",
        creationTime: "",
        email: "",
        location:"",
        user_name:"",
        photo_url:"",
        chats_binome:["id1","id2"],
        chats_group:["id1","id2"],
      },
      
  
  
];

// Function to add data to Firestore
const addusersToFirestore = async (usersData) => {
  try {
    // Loop through each post and add it to Firestore
    for (const user of usersData) {
      // Use set with merge to add or update the document
      await db
        .collection("users")
        
        .add(user);
    }
    console.log("users added to Firestore successfully!");
  } catch (error) {
    console.error("Error adding users to Firestore: ", error);
  }
};

// Call the function to add posts data to Firestore
addusersToFirestore(usersData);


const messages_binom_Data = [
 
  {
    last_msg:"",
    last_time:"",
    msg_num:"",
    list_mess:{
      id:"",
      content:"",
      seen:false,
      timestamp:"",
    }
  },
  


];

const addmessage1ToFirestore = async (messages_binom_Data) => {
  try {
  // Loop through each post and add it to Firestore
  for (const mess of messages_binom_Data) {
    // Use set with merge to add or update the document
    await db
      .collection("messages_binome")
      
      .add(mess);
  }
  console.log("messages_binome added to Firestore successfully!");
  } catch (error) {
  console.error("Error adding users to Firestore: ", error);
  }
  };
  
  // Call the function to add posts data to Firestore
  //addmessage1ToFirestore(messages_binom_Data);

const messages_group_Data = [
 
  {
    last_msg:"",
    last_time:"",
    msg_num:"",
    list_mess:{
      id:"",
      content:"",
      seen:false,
      timestamp:"",
    }
  },
  


];

// Function to add data to Firestore
const addmessagesgroupToFirestore = async (messages_group_Data) => {
try {
// Loop through each post and add it to Firestore
for (const mess of messages_group_Data) {
  // Use set with merge to add or update the document
  await db
    .collection("messages_group")
    
    .add(mess);
}
console.log("messages_group added to Firestore successfully!");
} catch (error) {
console.error("Error adding users to Firestore: ", error);
}
};

// Call the function to add posts data to Firestore
//addmessagesgroupToFirestore(messages_group_Data);
