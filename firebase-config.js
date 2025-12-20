// firebase-config.js
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_xVmBZuuyBDuY_LEzgkd6OBo54sUIli8",
  authDomain: "family-portal-8b18e.firebaseapp.com",
  databaseURL: "https://family-portal-8b18e-default-rtdb.firebaseio.com",
  projectId: "family-portal-8b18e",
  storageBucket: "family-portal-8b18e.appspot.com",
  messagingSenderId: "651597096294",
  appId: "1:651597096294:web:89ba3b3b6f5cc39ff454a7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Global references for convenience
window.database = firebase.database();
window.todoRef = window.database.ref("todos");
window.giftsRef = window.database.ref("gifts");

console.log("🔥 Firebase connected");
