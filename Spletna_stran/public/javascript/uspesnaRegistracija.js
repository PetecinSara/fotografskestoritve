setTimeout(function () {
    // after 2 seconds
    window.location = "../html/prijava.html";
 }, 4000)


 var timeleft = 4;
        var downloadTimer = setInterval(function(){
        timeleft--;
        document.getElementById("countdowntimer").textContent = timeleft;
        if(timeleft <= 0)
            clearInterval(downloadTimer);
        },1000);