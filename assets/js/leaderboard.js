import {Firebase} from "./firebase.js";

$(function () {
	let firebase = new Firebase();
	firebase.getData();
			
	
	// $.ajax({
	// 	url: "/assets/data/leaderboard.json",
	// 	data: {},
	// 	success: leaderboardData,
	// 	cache: false,
	// 	dataType: "json",
	// 	type: "GET"
	// });

	// function leaderboardData(response) {
	// 	data = response.leaderboard;
	// 	data = data.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
	// 	console.log(data);
	// }
	
	

	// let submittedleaderboard = false;

	// $("#form").submit(function(e) {
	//     e.preventDefault();
	//     if(!submittedleaderboard) {
	//         const name = document.getElementById("username").value;
	//         const score = localStorage.getItem('Score');
	//         data.push({
	//             "name": name,
	//             "score": score
	//         })
	//         data = data.sort((a,b)=> parseFloat(b.score) - parseFloat(a.score));
	//         console.log(data);
	//         appendData(data);

	//         document.getElementById("usernamelabel").style.display = 'none';
	//         document.getElementById("username").style.display = 'none';
	//         document.getElementById("submit").value = "Go back to menu";
	//         submittedleaderboard = true;
	//     }
	//     else {
	//         window.location.href = "index.html";
	//     }

	// });

});
