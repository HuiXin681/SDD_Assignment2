export class Game {
	cols = 20;
	rows = 20;
	score = 0;
	coins = 16;
	turns = 1;
	buildings = [];

	constructor(buildings = []) {
		buildings.forEach(b => {
			const building = new Building(b.type, b.desc, b.image, b.name);
			this.buildings.push(building);
		});
	}

	start() {
		this.createBoard();
		this.createOptions();
		document.getElementById("form-popup").style.display = "none";
	}

	createBoard() {
		for (let i = 0; i < this.cols; i++) {
			// const col = document.createElement("div");
			// col.classList.add("board-col");

			for (let j = 0; j < this.rows; j++) {
				const cell = document.createElement("div");
				cell.classList.add("board-cell");
				cell.id = i + "-" + j;

				cell.addEventListener('dragenter', (e) => {
					this.dragOver(e);
				});

				cell.addEventListener('dragover', (e) => {
					this.dragOver(e);
				});

				cell.addEventListener('dragleave', (e) => {
					e.target.classList.remove('drag-over');
				});

				cell.addEventListener('drop', (e) => {
					if (e.target.classList.value.includes("filled")) {
						e.target.classList.remove('drag-over');
						return;
					}

					const boxes = $(".board-cell.drag-over");
					const option = $(".being-dragged")[0];

					for (const box of boxes) {
						if (box.classList.contains("adjacent") || this.turns === 1) {
							const type = option.innerHTML.split("(")[1][0];
							let content = "<div class='building'>" + type + "</div>";

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
				// col.append(cell);
			}
			// $(".board").append(col);
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

			console.log(cell.id);

			let adjacent = [];

			// TODO: change to try catch
			if (col !== 0) {
				adjacent.push($("#" + (col - 1) + "-" + row));
			}
			if (col !== 19) {
				adjacent.push($("#" + (col + 1) + "-" + row));
			}
			if (row !== 0) {
				adjacent.push($("#" + col + "-" + (row - 1)));
			}
			if (row !== 19) {
				adjacent.push($("#" + col + "-" + (row + 1)));
			}

			let toAdd = 0;

			switch (cell.innerText) {
				case "R":
					for (const a of adjacent) {
						const type = a[0].innerText;
						if (type === "I") {
							toAdd = 1;
							break;
						} else if (type === "R" || type === "C") {
							toAdd += 1;
						} else if (type === "O") {
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
						} else if (type === "R") {
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
					console.log(roads);

					let con = 0;
					for (let i = col; i < this.cols; i++) {
						const cellType = $("#" + row + "-" + i)[0].innerText;
						if (cellType === "*") {
							con += 1;
						} else {
							toAdd += con === 0 ? 0 : con - 1;
							con = 0;
						}
					}
					console.log("toAdd: " + toAdd);
					break;
			}
			this.score += toAdd;
		}
	}

	// fillboard() {
	//     let count = 0;
	//     for (const cell of $(".board-cell")) {
	//         if (count < 398){
	//             cell.classList.add("filled");
	//             cell.classList.add("adjacent");
	//             cell.innerText = "R";
	//         }
	//         else{
	//             cell.classList.add("adjacent");
	//         }
	//         count++;
	//     }
	// }

	checkBoard() {
		let isFilled = true;
		for (const cell of $(".board-cell")) {
			if (!cell.classList.contains("filled")) {
				console.log("cell is not filled");
				console.log("Starting turn ", this.turns);
				isFilled = false;
				break;
			}
		}
		console.log(isFilled);
		if (isFilled || this.coins === 0) {
			localStorage.setItem('Score', this.score.toString());
			document.getElementById("form-popup").style.display = "block";
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
				e.target.classList.remove("being-dragged")
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