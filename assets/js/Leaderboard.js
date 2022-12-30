
$(function() {
    let data = [];
    $.ajax({
        url: "/assets/data/leaderboard.json",
        data: {},
        success: leaderboarddata,
        cache: false,
        dataType: "json",
        type: "GET"
    });

    function leaderboarddata(response) {
        data = response.leaderboard;
        data = data.sort((a,b)=> parseFloat(b.score) - parseFloat(a.score));
        appendData(data);
    }

    function appendData(data) {
        var mainContainer = document.getElementById("myData");
        mainContainer.innerHTML = "";
        for(var i=0; i< 10; i++) {
            var div = document.createElement("div");
            div.innerHTML = 'Name: ' + data[i].name + ' score: ' + data[i].score;
            mainContainer.appendChild(div);
        }
    }
    // let submittedleaderboard = false;
    
    // $("#form").submit(function(e) {
    //     e.preventDefault();
    //     if(!submittedleaderboard) {
    //         const name = document.getElementById("username").value;
    //         const score = localStorage.getItem('Score');
    //         data.push({
    //             "name": name,
    //             "score": score
    //         })
    //         data = data.sort((a,b)=> parseFloat(b.score) - parseFloat(a.score));
    //         console.log(data);
    //         appendData(data);
            
    //         document.getElementById("usernamelabel").style.display = 'none';
    //         document.getElementById("username").style.display = 'none';
    //         document.getElementById("submit").value = "Go back to menu";
    //         submittedleaderboard = true;
    //     }
    //     else {
    //         window.location.href = "index.html";
    //     }
        
    // });
    
});
