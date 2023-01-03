import {Game} from "./GameClass.js";
import { Firebase } from "./firebase.js"

$(function() {
    let game;
    let firebase = new Firebase();;

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
        firebase.init(response.buildings);
    }

    $("#form").submit(function(e){
        e.preventDefault();
        window.location.href= "leaderboard.html";
        console.log("submitting");
    });

});
