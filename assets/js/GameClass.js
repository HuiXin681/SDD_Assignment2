export class Game {
    score = 0;
    coins = 16;
    turns = 1;
    buildings = [];

    constructor(buildings = []) {
        buildings.forEach(b => {
            const building = new Building(b.type, b.desc);
            this.buildings.push(building);
        });
    }

    start() {
        this.createBoard();
        this.createOptions();
    }

    createBoard() {
        for (let i = 0; i < 20; i++) {
            const col = document.createElement("div");
            col.classList.add("board-col");

            for (let j = 0; j < 20; j++) {
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
                            let content = "<div class='building'>" + option.innerHTML + "</div>";

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
                col.append(cell);
            }
            $(".board").append(col);
        }
    }

    updateTurn() {
        console.log("Turn: " , this.turns);//toRemove
        this.turns++;
        $(".turn-val").html(String(this.turns));
        this.updateScore();
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
        this.score = 0;
        if (this.turns !== 2 ) {
            for (const cell of $(".board-cell.filled")) {
                console.log("Building checking : ", cell.innerText)
                const col = parseInt(cell.id.split("-")[0]);
                const row = parseInt(cell.id.split("-")[1]);


                let adjacent = [];
                adjacent.push($("#" + col + "-" + (row - 1)));
                adjacent.push($("#" + col + "-" + (row + 1)));
                adjacent.push($("#" + (col - 1) + "-" + row));
                adjacent.push($("#" + (col + 1) + "-" + row));

                let sameRow = [];
                sameRow.push($("#" + (col - 1) + "-" + row));
                sameRow.push($("#" + (col + 1) + "-" + row));

                let toAdd = 0;

                switch (cell.innerText) {
                    case "R":
                        for (const a of adjacent) {
                            const type = a[0].innerText;
                            console.log("Type: " ,type);//toRemove
                            if (type === "I") {
                                toAdd = 1;
                                break;
                            }
                            else if (type === "R" || type === "C") {
                                toAdd += 1;
                                break;
                            }
                            else if (type === "O") {
                                toAdd += 2;
                                break;
                            }
                        }
                        break;
                    case "I":
                        toAdd += 1;
                        for (const a of adjacent) {
                            const type = a[0].innerText;
                            console.log("Type: " ,type);//toRemove
                            if (type === "R") {
                                this.coins += 1;
                                break;
                            }
                        }
                        break;
                    case "C":
                        for (const a of adjacent) {
                            const type = a[0].innerText;
                            console.log(type);//toRemove
                            if (type === "C") {
                                toAdd += 1;
                                break;
                            }
                            else if (type === "R") {
                                this.coins += 1;
                                break;
                            }
                        }
                        break;
                    case "O":
                        for (const a of adjacent) {
                            const type = a[0].innerText;
                            console.log("Type: " ,type);//toRemove
                            if (type === "O") {
                                toAdd += 1;
                                break;
                            }
                        }
                        break;
                    //Need to confirm about point system - if points are counted per connection or per road
                    case "*":
                        for (const sR of sameRow) {
                            console.log(sR.ID);//toRemove
                            const type = sameRow.innerText;
                            if (type == "*") {
                                toAdd += 1;
                                break;
                            }
                        }
                        break;
                }
                this.score += toAdd;
                console.log("ToAdd" , toAdd);//toRemove
                console.log("Current Score" , this.score);//toRemove
            }
        }
    }

    createOptions() {
        for (let i = 0; i < 2; i++) {
            const building = this.buildings[Math.floor(Math.random() * this.buildings.length)].type;
            //const building = this.buildings[0].type;//toRemove
            $(".building-container").append(
                $(document.createElement('div'))
                    .addClass("option")
                    .append(building)
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
        if (e.target.classList.value.includes("filled")) {
            return;
        }
        e.preventDefault();
        e.target.classList.add('drag-over');
    }
}

class Building {
    type = "";
    desc = "";

    constructor(type, desc) {
        this.type = type;
        this.desc = desc;
    }
}