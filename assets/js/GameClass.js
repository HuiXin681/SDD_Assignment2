import {Firebase} from "./firebase.js";
export class Game {
	cols = 20;
	rows = 20;
	score = 0;
	coins = 16;
	turns = 1;
	buildings = [];
    name = "";

	constructor(buildings = []) {
		buildings.forEach(b => {
			const building = new Building(b.type, b.desc, b.image, b.name);
			this.buildings.push(building);
		});
	}

	start() {
		let data;
		if (localStorage.getItem("status")) {
			data = JSON.parse(localStorage.getItem("save"));
			localStorage.removeItem("status");
			console.log(data);
			if (data !== null) {
				this.turns = data.turns;
				this.coins = data.coins;
				this.score = data.score;
				data = data.buildings;
				$(".turn-val").html(String(this.turns));
				$(".coin-val").html(String(this.coins));
				$(".score-val").html(String(this.score));
			}
			else {
				data = undefined;
			}
		}
		this.createBoard(data);
		this.createOptions();
		document.getElementById("form-popup").style.display = "none";
		document.getElementById("save").addEventListener("click", ev => this.save());
	}

	save() {
		let buildings = {};
		for (const b of this.buildings) {
			buildings[b.type] = [];
		}

		for (const cell of $(".filled")) {
			const type = cell.innerText;
			buildings[type].push(cell.id);
		}

		const save = {
			"buildings": buildings,
			"turns": this.turns,
			"coins": this.coins,
			"score": this.score
		}

		localStorage.setItem("save", JSON.stringify(save));
	}

	createBoard(data = undefined) {
		const keys = data === undefined ? 0 : Object.keys(data);
		let adjacent = [];
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				const cell = document.createElement("div");
				cell.classList.add("board-cell");
				cell.id = i + "-" + j;
				if (keys !== 0) {
					for (const key of keys) {
						if (data[key].length !== 0) {
							if (data[key].indexOf(cell.id) !== -1) {
								const content = "<div class='building'>" + key + "</div>";
								cell.innerHTML = content;
								cell.classList.add("filled");
								adjacent.push(`#${i}-${j - 1}`);
								adjacent.push(`#${i}-${j + 1}`);
								adjacent.push(`#${i - 1}-${j}`);
								adjacent.push(`#${i + 1}-${j}`);
							}
						}
					}
				}

				cell.addEventListener('dragenter', (e) => {
					this.dragOver(e);
				});

				cell.addEventListener('dragover', (e) => {
					this.dragOver(e);
				});

				cell.addEventListener('dragleave', (e) => {
					e.target.classList.remove('drag-over');
				});

				cell.addEventListener("mouseover", (e) => {
					if ($(".selected").length !== 0) {
						this.dragOver(e);
					}
				});

				cell.addEventListener("mouseout", (e) => {
					e.target.classList.remove('drag-over');
				})

				cell.addEventListener('click', (e) => {
					if (e.target.classList.value.includes("filled")) {
						return;
					}

					const option = $(".selected")[0];

					if (option === undefined) {
						return;
					}

					const box = e.target;
					if (box.classList.contains("adjacent") || this.turns === 1) {
						const type = option.innerHTML.split("(")[1][0];
						const content = "<div class='building'>" + type + "</div>";

						box.classList.add("filled");
						box.classList.remove("drag-over");
						box.innerHTML = content;
						option.classList.remove("selected");

						$("#" + i + "-" + (j - 1)).addClass("adjacent");
						$("#" + i + "-" + (j + 1)).addClass("adjacent");
						$("#" + (i - 1) + "-" + j).addClass("adjacent");
						$("#" + (i + 1) + "-" + j).addClass("adjacent");

						this.updateTurn();
					}
				});

				cell.addEventListener('drop', (e) => {
					if (e.target.classList.value.includes("filled")) {
						return;
					}

					const boxes = $(".board-cell.drag-over");
					const option = $(".being-dragged")[0];

					for (const box of boxes) {
						if (box.classList.contains("adjacent") || this.turns === 1) {
							const type = option.innerHTML.split("(")[1][0];
							const content = "<div class='building'>" + type + "</div>";

							box.classList.add("filled");
							box.innerHTML = content;
							option.classList.remove("being-dragged");

							$("#" + i + "-" + (j - 1)).addClass("adjacent");
							$("#" + i + "-" + (j + 1)).addClass("adjacent");
							$("#" + (i - 1) + "-" + j).addClass("adjacent");
							$("#" + (i + 1) + "-" + j).addClass("adjacent");

							this.updateTurn();
						}
					}
					e.target.classList.remove('drag-over');
				});
				$(".board-grid").append(cell);
			}
		}
		for (const a of adjacent) {
			$(a).addClass("adjacent");
		}
	}

	updateTurn() {
		// this.fillboard();
		this.turns++;
		$(".turn-val").html(String(this.turns));
		this.updateScore();
		this.checkBoard();
		this.updateCoin();
		this.removeOptions();
		this.createOptions();
	}

	updateScore() {
		this.calculateScore();
		$(".score-val").html(String(this.score));
	}

	updateCoin() {
		this.coins--;
		$(".coin-val").html(String(this.coins));
	}

	calculateScore() {
		this.score = 0; // resets score every round so that it doesn't double count
		let roads = [];
		for (const cell of $(".board-cell.filled")) {
			const row = parseInt(cell.id.split("-")[0]);
			const col = parseInt(cell.id.split("-")[1]);


			let adjacent = [];

			// TODO: change to try catch
			if (row !== 0) {
				adjacent.push($("#" + (row - 1) + "-" + col));
			}
			if (row !== 19) {
				adjacent.push($("#" + (row + 1) + "-" + col));
			}
			if (col !== 0) {
				adjacent.push($("#" + row + "-" + (col - 1)));
			}
			if (col !== 19) {
				adjacent.push($("#" + row + "-" + (col + 1)));
			}

			let toAdd = 0;

			switch (cell.innerText) {
				case "R":
					for (const a of adjacent) {
						const type = a[0].innerText;
						if (type === "I") {
							toAdd = 1;
							break;
						}
						else if (type === "R" || type === "C") {
							toAdd += 1;
						}
						else if (type === "O") {
							toAdd += 2;
						}
					}
					break;
				case "I":
					toAdd += 1;
					for (const a of adjacent) {
						const type = a[0].innerText;
						if (type === "R") {
							this.coins += 1;
						}
					}
					break;
				case "C":
					for (const a of adjacent) {
						const type = a[0].innerText;
						if (type === "C") {
							toAdd += 1;
						}
						else if (type === "R") {
							this.coins += 1;
						}
					}
					break;
				case "O":
					for (const a of adjacent) {
						const type = a[0].innerText;
						if (type === "O") {
							toAdd += 1;
						}
					}
					break;
				case "*":
					if (roads.indexOf(row) !== -1) {
						break;
					}
					roads.push(row);
					let con = 0;
					for (let i = col; i < this.cols; i++) {
						const cellType = $("#" + row + "-" + i)[0].innerText;
						if (cellType === "*") {
							con += 1;
						}
						else {
							toAdd += con === 0 ? 0 : con - 1;
							con = 0;
						}
					}
					break;
			}
			this.score += toAdd;
		}
	}

	fillboard() {
	    let count = 0;
	    for (const cell of $(".board-cell")) {
	        if (count < 398){
	            cell.classList.add("filled");
	            cell.classList.add("adjacent");
	            cell.innerText = "R";
	        }
	        else{
	            cell.classList.add("adjacent");
	        }
	        count++;
	    }
	}

	checkBoard() {
		let isFilled = true;
		for (const cell of $(".board-cell")) {
			if (!cell.classList.contains("filled")) {
				isFilled = false;
				break;
			}
		}
		if (isFilled || this.coins === 0) {
			let firebase = new Firebase();
			firebase.comparedata(this.score);
			
			
		}

	}

	createOptions() {
		for (let i = 0; i < 2; i++) {
			const building = this.buildings[Math.floor(Math.random() * this.buildings.length)];
			const building_display = building.name + " (" + building.type + ")";

			const img = document.createElement("img");
			img.src = "assets/img/" + building.image;
			img.draggable = false;

			$(".building-container").append(
				$(document.createElement('div'))
					.addClass("option")
					.append(img, building_display)
					.attr("draggable", "true")
			);
		}

		for (const o of $(".option")) {
			o.addEventListener("dragstart", (e) => {
				e.target.classList.add("being-dragged");
			});
			o.addEventListener("dragend", (e) => {
				e.target.classList.remove("being-dragged");
			});
			o.addEventListener('click',(e) => {
				this.select(e.target);
			});
		}
	}

	removeOptions() {
		$(".building-container").empty();
	}

	dragOver(e) {
		if (!e.target.classList.value.includes("filled")) {
			e.preventDefault();
			e.target.classList.add('drag-over');
		}
	}

	select(target) {
		if (target.localName === "img") {
			this.select(target.parentElement);
		}
		else {
			const target_class = target.classList;
			if (target_class.value.includes("selected")) {
				target_class.remove('selected');
			}
			else {
				$(".selected").removeClass("selected");
				target_class.add('selected');
			}
		}
	}
}

class Building {
	type = "";
	desc = "";
	image = "";
	name = "";

	constructor(type, desc, image, name) {
		this.type = type;
		this.desc = desc;
		this.name = name;
		this.image = image;
	}
}