// function createboard(){
//     console.log("hello world")
//     //this is to show the contents inside the div
//     const building = "div"
//     for(let length = 0; length<20; length++ ){
//         var row = document.createElement("div");
//         document.getElementById("board").append(row);
//         row.className = "row";
//         for(let height = 0; height<20; height++){
//             const column = document.createElement("div");
//             column.innerHTML= building;
//             column.className="column";
//             row.appendChild(column);
//         }
//     }
// }
// createboard()


$().ready(function() {
    for(let length=0; length<20; length++){
        var row = document.createElement("div");
        row.className= "board-row";
        for(let height=0; height<20; height++){
            var column = document.createElement("div");
            column.className="board-column";
            row.append(column)
        }
        $("#board").append(row);
    }
});