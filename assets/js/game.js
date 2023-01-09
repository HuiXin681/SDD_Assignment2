import {Game} from "./GameClass.js";
import {Firebase} from "./firebase.js";

$(function () {
	let game;
	let firebase = new Firebase();

	$.ajax({
		url: "/assets/data/buildings.json",
		data: {},
		success: gameHandler,
		cache: false,
		dataType: "json",
		type: "GET"
	});

	function gameHandler(response) {
		const modalBody = $(".modal-body");
		response.buildings.forEach(b => {
			const img = document.createElement("img");
			const info = document.createElement("div");
			const title = document.createElement("div");
			const desc = document.createElement("div");
			img.src = `assets/img/${b.image}`;
			info.append(img);
			title.classList.add("modal-body_title");
			title.append(`${b.name} (${b.type})`);
			info.append(title);
			desc.classList.add("modal-body_desc");
			desc.append(b.description);
			info.append(desc);
			info.classList.add("modal-body_information");
			modalBody.append(info);
		});

		game = new Game(response.buildings);
		game.start();
	}

	$("#form").submit(function (e) {
		e.preventDefault();
		game.name = $("#username").val();
		console.log("submitting");
		firebase.init(game);
	});
});
