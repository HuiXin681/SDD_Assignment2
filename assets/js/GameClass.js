export class Game {
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
        document.getElementById("myform").style.display = "none";
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
        this.fillboard();
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
        if (this.turns !== 2 ) {
            for (const cell of $(".board-cell.filled")) {
                const col = parseInt(cell.id.split("-")[0]);
                const row = parseInt(cell.id.split("-")[1]);

                let adjacent = [];
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

                let sameRow = [];
                if (col !== 0) {
                    sameRow.push($("#" + (col - 1) + "-" + row));
                }
                if (col !== 19) {
                    sameRow.push($("#" + (col + 1) + "-" + row));
                }

                let toAdd = 0;
                switch (cell.innerText) {
                    case "R":
                        let nextToI = false;
                        for (const a of adjacent) {
                            const type = a[0].innerText;
                            if (type === "I") {
                                nextToI = true;
                            }
                        }
                        if (nextToI === true){
                            toAdd = 1;
                            break;
                        }
                        else {
                            for (const a of adjacent) {
                                const type = a[0].innerText;
                                if (type === "R" || type === "C") {
                                    toAdd += 1;
                                }
                                else if (type === "O") {
                                    toAdd += 2;
                                }
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
                        for (const sR of sameRow) {
                            const type = sR[0].innerText;
                            if (type === "*") {
                                toAdd += 1;
                            }
                        }
                        break;
                }
                this.score += toAdd;
            }
        }
    }
    // fillboard(){
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
        let boardisfilled = true;
        for (const cell of $(".board-cell")) {
            if (!cell.classList.contains("filled")) {
                console.log("cell is not filled");
                console.log("Starting turn " , this.turns);
                boardisfilled = false;
                break;
            }
        }
        console.log(boardisfilled);
        if (boardisfilled || this.coins === 0){
            localStorage.setItem('Score', this.score);
            document.getElementById("myform").style.display = "block";
        }

    }

    createOptions() {
        for (let i = 0; i < 2; i++) {
            const building = this.buildings[Math.floor(Math.random() * this.buildings.length)].type;
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
    image = "";
    name = "";

    constructor(type, desc, image,name) {
        this.type = type;
        this.desc = desc;
        this.name = name;
        this.image = image;
    }
}



