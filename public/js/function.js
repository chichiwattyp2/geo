// ---speaker - audience buttons---
// Speaker
function makeSpeaker() {
  $("#theScene").append(
    '<a-entity id="rig" position="0 2.5 -3.5" rotation="0 180 0" networked="template:#speaker-template;attachTemplateToLocal:false;"><a-entity camera id="player" wasd-controls networked="template:#speaker-template;attachTemplateToLocal:false;" look-controls></a-entity></a-entity>'
  );
  $("#rig").append(
    '<a-entity hand-controls="left" networked="template:#hand-template;"></a-entity><a-entity hand-controls="right" networked="template:#hand-template;"></a-entity>'
  );
  console.log("Speaker rig created");
  $("#initCamera").remove();
  console.log("Initial camera removed");
  $("#flatSite").remove();
  console.log("Welcome interface removed");
  $("#theScene").attr("vr-mode-ui", "enabled: true");
  console.log("VR button added");
  AFRAME.scenes[0].emit("connect");
  console.log("Connected");
}

// audience
function makeAudience() {
  $("#theScene").append(
    '<a-camera id="viewer" look-controls position="0 1.6 1"></a-camera>'
  );
  console.log("Audience rig created");
  $("#initCamera").remove();
  console.log("Initial camera removed");
  $("#flatSite").remove();
  console.log("Welcome interface removed");
  $("#theScene").attr("vr-mode-ui", "enabled: true");
  console.log("VR button added");
  $("#monitorScreen").attr("visible", "false");
  console.log("Speaker monitor hidden");
  AFRAME.scenes[0].emit("connect");
  console.log("Connected");
}

//functions accepted button
function accepted() {
  document.getElementById("pleaseAccept").style.visibility = "hidden";
}
