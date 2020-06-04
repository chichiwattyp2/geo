var id = +new Date(); // assuming you don't both connect at the exact same moment
var updateInterval = 0.5; // in seconds
var threshold = 1; // in seconds

var room; // could be defined as parameter e.g. &room=PaolaAndFabien

// don't hammer the server if you don't REALLY have to (e.g. if it's not the Olympics you probably not need ms adjustements...)

$(document).ready(function() {
  // connect with server
  var socket = io.connect();

  //print new data to #broadcast-msg
  socket.on("broadcast-msg", function(data) {
    var [user, timing] = data.split(": ");
    user = parseInt(user);
    timing = parseFloat(timing);
    // could add currentroom
    var myTiming = document.querySelector("video").currentTime;

    // could filter here by room
    // e.g. if (room && room == currentroom) ...
    if (user != id) {
      console.log(timing, myTiming, timing - myTiming, threshold);
      if (Math.abs(timing - myTiming) < threshold) {
        console.log("We are doing OK!");
        document.querySelector("video").play();
      } else {
        if (myTiming > timing) {
          console.log("Going too fast, should pause for a short while");
          document.querySelector("video").pause();
        } else {
          console.log(
            "Going too slow, should let the other pause while I catch up"
          );
          document.querySelector("video").play();
        }
      }
    }
  });

  //print new data to #users
  socket.on("updateUsers", function(data) {
    console.log("Users: ", data);
  });

  //create new socket connection
  socket.on("connect", function() {
    socket.emit("setUserName", id);

    setInterval(timingUpdate, updateInterval * 1000);

    // AFRAME might not be loaded yet, could move this to a component instead
    if (AFRAME) room = AFRAME.utils.getUrlParameter("room");

    function timingUpdate() {
      var txt = document.querySelector("video").currentTime;
      // txt += ": " + room
      socket.emit("emit-msg", txt, function(data) {
        console.log("Emit Broadcast Msg: ", data);
      });
    }
  });
});
