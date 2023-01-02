import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

export class Firebase {
    
// Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    init(buildings) {

    let playerId;

    const firebaseConfig = {
        apiKey: "AIzaSyDW6_oxXuJir6N3yXQ7VaphGIqqLeCKiRg",
        authDomain: "sdd-assignment2.firebaseapp.com",
        databaseURL: "https://sdd-assignment2-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "sdd-assignment2",
        storageBucket: "sdd-assignment2.appspot.com",
        messagingSenderId: "489709989382",
        appId: "1:489709989382:web:52fa10a4aa823f58cbdd87",
        measurementId: "G-1G0ZBSNEBG"
        };
        
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    const auth = getAuth();
    const db = getDatabase();
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          playerId = user.uid;
          set(ref(db, "Player", playerId), {
            pid: playerId,
            game: {coins: 16, score: 0, turns: 1},
            buildings: buildings
          })
          console.log(user)
        } else {
          // User is signed out
          // ...
        }
      });
    
    signInAnonymously(auth)
    .then(() => {
        // Signed in..
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
        console.log(errorCode, errorMessage)
    });
    }
}