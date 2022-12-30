import {Game} from "./GameClass.js";

$(function() {
    let game;

    $.ajax({
        url: "/assets/data/buildings.json",
        data: {},
        success: gameHandler,
        cache: false,
        dataType: "json",
        type: "GET"
    });

    function gameHandler(response) {
        game = new Game(response.buildings);
        game.start();
    }

    $("#form").submit(function(e){
        e.preventDefault();
        window.location.href= "leaderboard.html";
        console.log("submitting");
    });
    
});
