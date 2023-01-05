import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {getAuth, onAuthStateChanged, signInAnonymously} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {getDatabase, ref, set, onValue} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

export class Firebase {

// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	
	init(game) {
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
		let check = false;
		const auth = getAuth();
		const db = getDatabase();

		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.User

				set(ref(db, `Player/${game.name}`), {
					name : game.name,
					score : game.score
				})
				
				window.location.href = "leaderboard.html";
				
			}
			else {
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
		return check;
	}

	
	getData() {
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
		var data = [];
		const auth = getAuth();
		const db = getDatabase();
		const dbRef = ref(db, 'Player');
		onValue(dbRef, (snapshot) => {
			snapshot.forEach((childSnapshot) => {
			  const users = childSnapshot.val();
			  data.push(users);
			});
			data = data.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
			console.log(data);
			appendData(data);
			function appendData(data) {
				let mainContainer = document.getElementById("myData");
				mainContainer.innerHTML = "";
				for (let i = 0; i < 10; i++) {
					let div = document.createElement("div");
					div.innerHTML =  [i+1] + ' : ' +'Name: ' + data[i].name + ' | score: ' + data[i].score;
					mainContainer.appendChild(div);
				};
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
	
	comparedata(score) {
		
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
		
		const app = initializeApp(firebaseConfig);
		const analytics = getAnalytics(app);
		const auth = getAuth();
		let data = [];
		const db = getDatabase();
		const dbRef = ref(db, 'Player');
		let meethighscore = false;
		onValue(dbRef, (snapshot) => {
			snapshot.forEach((childSnapshot) => {
				const users = childSnapshot.val();
				data.push(users);
			});
			data = data.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
			
			for (let i = 0; i < data.length; i++) {
				if(data[i].score <= score || data.length < 10){
					meethighscore = true
				}
			}
			if(meethighscore){
				document.getElementById("form-popup").style.display = "block";
			}
			else{
				window.location.href = "leaderboard.html";
			}
		});
		
	}
}