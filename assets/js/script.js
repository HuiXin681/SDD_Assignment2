function createboard(){
    //this is to show the contents inside the div
    const building = "div"
    for(let length = 0; length<20; length++ ){
        const row = document.createElement("div");
        document.getElementById("board").appendChild(row);
        row.className = "row";
        for(let height = 0; height<20; height++){
            const column = document.createElement("div");
            column.innerHTML= building;
            column.className="column";
            row.appendChild(column);
        }
    }
}
createboard()