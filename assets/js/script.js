$(function() {
    createBoard();
    createOptions(2);
});

function createBoard() {
    for(let length=0; length<20; length++) {
        var row = document.createElement("div");
        row.className= "board-row";
        for(let height=0; height<20; height++) {
            var column = document.createElement("div");
            column.className="board-column";
            row.append(column);
            column.addEventListener('dragenter', dragEnter);
            column.addEventListener('dragover', dragOver);
            column.addEventListener('dragleave', dragLeave);
            column.addEventListener('drop', drop);
        }
        $(".board").append(row);
    }
}

function createOptions(n) {
    let x = ["R", "I", "C", "O", "*"];
    for (let i = 0; i < n; i++) {
        let building = x[Math.floor(Math.random() * 4)];
        $(".building-container").append($(document.createElement('div'))
            .addClass("option")
            .append(building)
            .attr("draggable", "true")
        );
    }

    let options = $(".option");
    for (const option of options) {
        option.addEventListener("dragstart", dragStart)

    }
}

function removeOptions() {
    let container = $(".building-container")
    container.empty();
}

function dragStart() {
    console.log('dragging...');
    this.classList.add("beingDragged")
}

function dragEnter(e) {
    if(this.classList.value.includes("filled")){
        return
    }
    e.preventDefault()
    e.target.classList.add('drag-over')
}

function dragOver(e) {
    if(this.classList.value.includes("filled")){
        return
    }
    e.preventDefault()
    e.target.classList.add('drag-over')
}

function dragLeave(e) {
    e.target.classList.remove('drag-over')
}

function drop(e) {
    console.log("dropped")
    if (this.classList.value.includes("filled")) {
        e.target.classList.remove('drag-over')
        return
    }
    let boxes = $(".board-column")
    let option = $(".beingDragged")[0]
    for (const box of boxes) {
        if (box.classList.value.includes("drag-over")) {
            let content = "<div class='building'>" + option.innerHTML + "</div>"
            box.classList.add("filled")
            console.log(content)
            box.innerHTML = content
            option.classList.remove("beingDragged")
            removeOptions()
            createOptions(2)
        }
    }
    e.target.classList.remove('drag-over')
}