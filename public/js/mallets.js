
var debug = document.querySelector("#debug");

//Get the position of my mallet hitpoints
var leftHit1 = document.querySelector("#leftmallethit1");
var rightHit1 = document.querySelector("#rightmallethit1");
var leftHit2 = document.querySelector("#leftmallethit2");
var rightHit2 = document.querySelector("#rightmallethit2");

var mallet1 = document.querySelector("#mallet1");
var mallet2 = document.querySelector("#mallet2");
var mallet3 = document.querySelector("#mallet3");
var mallet4 = document.querySelector("#mallet4");

var rightHand = document.querySelector("#rightHand");
var leftHand = document.querySelector("#leftHand");

var malletHeight = .3;
var malletRadius = .005;

var currentHeight = .3;
var currentRadius = .005;

var stickColor = "#654321";
var tipColor = "#FFFF88";

var noteDuration = 100;
var noteDurationFix = 100;

var angleMallet = 10;
var currentAngle = 10;

var toucher = true;
var holder = false;
var sustained = false;

var susnotes = [];

var currentTone = -1;
var currentMode = -1;


//RIGHT HAND MALLET 1
var mallet1 = document.createElement("a-entity");
mallet1.setAttribute("id", "mallet1");
mallet1.setAttribute("class", "mallet");
mallet1.setAttribute("position", "-0.00506 -0.01731 0");
mallet1.setAttribute("rotation", "-90 0 0");
mallet1.setAttribute("animation__20grados", "property:rotation; from:-90 0; to:-90 0 "+angleMallet+";dur:100;startEvents:separar1;");
mallet1.setAttribute("animation__40grados", "property:rotation; from:-90 0; to:-90 0 "+(angleMallet*2)+";dur:100;startEvents:separar2;");
mallet1.setAttribute("animation__reset", "property:rotation; to:-90 0 0;dur:100;startEvents:reset;");

var stick1 = document.createElement("a-cylinder");
stick1.setAttribute("segments-radial", "8");
stick1.setAttribute("segments-height", "1");
stick1.setAttribute("radius", malletRadius);
stick1.setAttribute("height", malletHeight);
stick1.setAttribute("color", stickColor);
stick1.setAttribute("position", "0 "+(malletHeight/2)+" 0");

var tip1 = document.createElement("a-cylinder");
tip1.setAttribute("segments-radial", "8");
tip1.setAttribute("segments-height", "1");
tip1.setAttribute("radius", malletRadius*2);
tip1.setAttribute("height", malletHeight/10);
tip1.setAttribute("color", tipColor);
tip1.setAttribute("position", "0 "+malletHeight+" 0");

var rightHit1 = document.createElement("a-box");
rightHit1.setAttribute("visible", "false");
rightHit1.setAttribute("id", "rightmallethit1");
rightHit1.setAttribute("color", "purple");
rightHit1.setAttribute("position", "0 "+malletHeight+" 0");
rightHit1.setAttribute("width", malletRadius*3)
rightHit1.setAttribute("height", malletRadius*3);
rightHit1.setAttribute("depth", malletRadius*3);
rightHit1.setAttribute("last-position", 0);
rightHit1.setAttribute("aabb-collider", "objects:.note;interval:1;");

mallet1.appendChild(stick1);
mallet1.appendChild(tip1);
mallet1.appendChild(rightHit1);
rightHand.appendChild(mallet1);

//RIGHT HAND MALLET 2
var mallet2 = document.createElement("a-entity");
mallet2.setAttribute("id", "mallet2");
mallet2.setAttribute("class", "mallet");
mallet2.setAttribute("position", "-0.00506 -0.01731 0");
mallet2.setAttribute("rotation", "-90 0 0");
mallet2.setAttribute("animation__20grados", "property:rotation; from:-90 0; to:-90 0 "+(-angleMallet)+";dur:100;startEvents:separar1;");
mallet2.setAttribute("animation__40grados", "property:rotation; from:-90 0; to:-90 0 "+(-angleMallet*2)+";dur:100;startEvents:separar2;");
mallet2.setAttribute("animation__reset", "property:rotation; to:-90 0 0;dur:100;startEvents:reset;");

var stick2 = document.createElement("a-cylinder");
stick2.setAttribute("segments-radial", "8");
stick2.setAttribute("segments-height", "1");
stick2.setAttribute("radius", malletRadius);
stick2.setAttribute("height", malletHeight);
stick2.setAttribute("color", stickColor);
stick2.setAttribute("position", "0 "+(malletHeight/2)+" 0");

var tip2 = document.createElement("a-cylinder");
tip2.setAttribute("segments-radial", "8");
tip2.setAttribute("segments-height", "1");
tip2.setAttribute("radius", malletRadius*2);
tip2.setAttribute("height", malletHeight/10);
tip2.setAttribute("color", tipColor);
tip2.setAttribute("position", "0 "+malletHeight+" 0");

var rightHit2 = document.createElement("a-box");
rightHit2.setAttribute("visible", "false");
rightHit2.setAttribute("id", "rightmallethit2");
rightHit2.setAttribute("color", "purple");
rightHit2.setAttribute("position", "0 "+malletHeight+" 0");
rightHit2.setAttribute("width", malletRadius*3)
rightHit2.setAttribute("height", malletRadius*3);
rightHit2.setAttribute("depth", malletRadius*3);
rightHit2.setAttribute("last-position", 0);
rightHit2.setAttribute("aabb-collider", "objects:.note;interval:1;");

mallet2.appendChild(stick2);
mallet2.appendChild(tip2);
mallet2.appendChild(rightHit2);
rightHand.appendChild(mallet2);

//LEFT HAND MALLET 1
var mallet3 = document.createElement("a-entity");
mallet3.setAttribute("id", "mallet3");
mallet3.setAttribute("class", "mallet");
mallet3.setAttribute("position", "-0.00506 -0.01731 0");
mallet3.setAttribute("rotation", "-90 0 0");
mallet3.setAttribute("animation__20grados", "property:rotation; from:-90 0; to:-90 0 "+angleMallet+";dur:100;startEvents:separar1;");
mallet3.setAttribute("animation__40grados", "property:rotation; from:-90 0; to:-90 0 "+(angleMallet*2)+";dur:100;startEvents:separar2;");
mallet3.setAttribute("animation__reset", "property:rotation; to:-90 0 0;dur:100;startEvents:reset;");

var stick3 = document.createElement("a-cylinder");
stick3.setAttribute("segments-radial", "8");
stick3.setAttribute("segments-height", "1");
stick3.setAttribute("radius", malletRadius);
stick3.setAttribute("height", malletHeight);
stick3.setAttribute("color", stickColor);
stick3.setAttribute("position", "0 "+(malletHeight/2)+" 0");

var tip3 = document.createElement("a-cylinder");
tip3.setAttribute("segments-radial", "8");
tip3.setAttribute("segments-height", "1");
tip3.setAttribute("radius", malletRadius*2);
tip3.setAttribute("height", malletHeight/10);
tip3.setAttribute("color", tipColor);
tip3.setAttribute("position", "0 "+malletHeight+" 0");

var leftHit1 = document.createElement("a-box");
leftHit1.setAttribute("visible", "false");
leftHit1.setAttribute("id", "leftmallethit1");
leftHit1.setAttribute("color", "purple");
leftHit1.setAttribute("position", "0 "+malletHeight+" 0");
leftHit1.setAttribute("width", malletRadius*3)
leftHit1.setAttribute("height", malletRadius*3);
leftHit1.setAttribute("depth", malletRadius*3);
leftHit1.setAttribute("last-position", 0);
leftHit1.setAttribute("aabb-collider", "objects:.note;interval:1;");

mallet3.appendChild(stick3);
mallet3.appendChild(tip3);
mallet3.appendChild(leftHit1);
leftHand.appendChild(mallet3);

//LEFT HAND MALLET 2
var mallet4 = document.createElement("a-entity");
mallet4.setAttribute("id", "mallet4");
mallet4.setAttribute("class", "mallet");
mallet4.setAttribute("position", "-0.00506 -0.01731 0");
mallet4.setAttribute("rotation", "-90 0 0");
mallet4.setAttribute("animation__20grados", "property:rotation; from:-90 0; to:-90 0 "+(-angleMallet)+";dur:100;startEvents:separar1;");
mallet4.setAttribute("animation__40grados", "property:rotation; from:-90 0; to:-90 0 "+(-angleMallet*2)+";dur:100;startEvents:separar2;");
mallet4.setAttribute("animation__reset", "property:rotation; to:-90 0 0;dur:100;startEvents:reset;");

var stick4 = document.createElement("a-cylinder");
stick4.setAttribute("segments-radial", "8");
stick4.setAttribute("segments-height", "1");
stick4.setAttribute("radius", malletRadius);
stick4.setAttribute("height", malletHeight);
stick4.setAttribute("color", stickColor);
stick4.setAttribute("position", "0 "+(malletHeight/2)+" 0");

var tip4 = document.createElement("a-cylinder");
tip4.setAttribute("segments-radial", "8");
tip4.setAttribute("segments-height", "1");
tip4.setAttribute("radius", malletRadius*2);
tip4.setAttribute("height", malletHeight/10);
tip4.setAttribute("color", tipColor);
tip4.setAttribute("position", "0 "+malletHeight+" 0");

var leftHit2 = document.createElement("a-box");
leftHit2.setAttribute("visible", "false");
leftHit2.setAttribute("id", "leftmallethit2");
leftHit2.setAttribute("color", "purple");
leftHit2.setAttribute("position", "0 "+malletHeight+" 0");
leftHit2.setAttribute("width", malletRadius*3)
leftHit2.setAttribute("height", malletRadius*3);
leftHit2.setAttribute("depth", malletRadius*3);
leftHit2.setAttribute("last-position", 0);
leftHit2.setAttribute("aabb-collider", "objects:.note;interval:1;");

mallet4.appendChild(stick4);
mallet4.appendChild(tip4);
mallet4.appendChild(leftHit2);
leftHand.appendChild(mallet4);

function changeNoteDuration(num){
  noteDurationFix+=num;
}

function radiusChanger(step){
  currentRadius+=step;
  changeRadius(currentRadius);
}

function heightChanger(step){
  currentHeight+=step;
  changeHeight(currentHeight);
}

function angleChanger(step){
  currentAngle+=step;
  changeAngle(currentAngle);
}

function resetRadius(){
  changeRadius(malletRadius);
  currentRadius = malletRadius;
}

function resetHeight(){
  changeHeight(malletHeight);
  currentHeight = malletHeight;
}

function resetAngle(){
  changeAngle(angleMallet);
  currentAngle = angleMallet;
}

function changeRadius(newRadius){
  stick1.setAttribute("radius", newRadius);
  stick2.setAttribute("radius", newRadius);
  stick3.setAttribute("radius", newRadius);
  stick4.setAttribute("radius", newRadius);
  
  tip1.setAttribute("radius", newRadius*2);
  tip2.setAttribute("radius", newRadius*2);
  tip3.setAttribute("radius", newRadius*2);
  tip4.setAttribute("radius", newRadius*2);

  rightHit1.setAttribute("width", newRadius*3);
  rightHit1.setAttribute("height", newRadius*3);
  rightHit1.setAttribute("depth", newRadius*3);
  rightHit2.setAttribute("width", newRadius*3);
  rightHit2.setAttribute("height", newRadius*3);
  rightHit2.setAttribute("depth", newRadius*3);
  leftHit1.setAttribute("width", newRadius*3);
  leftHit1.setAttribute("height", newRadius*3);
  leftHit1.setAttribute("depth", newRadius*3);
  leftHit2.setAttribute("width", newRadius*3);
  leftHit2.setAttribute("height", newRadius*3);
  leftHit2.setAttribute("depth", newRadius*3);
}

function changeHeight(newHeight){
  stick1.setAttribute("height", newHeight);
  stick2.setAttribute("height", newHeight);
  stick3.setAttribute("height", newHeight);
  stick4.setAttribute("height", newHeight);

  stick1.setAttribute("position", "0 "+(newHeight/2)+" 0");
  stick2.setAttribute("position", "0 "+(newHeight/2)+" 0");
  stick3.setAttribute("position", "0 "+(newHeight/2)+" 0");
  stick4.setAttribute("position", "0 "+(newHeight/2)+" 0");
  
  tip1.setAttribute("position", "0 "+newHeight+" 0");
  tip2.setAttribute("position", "0 "+newHeight+" 0");
  tip3.setAttribute("position", "0 "+newHeight+" 0");
  tip4.setAttribute("position", "0 "+newHeight+" 0");

  rightHit1.setAttribute("position", "0 "+newHeight+" 0");
  rightHit2.setAttribute("position", "0 "+newHeight+" 0");
  leftHit1.setAttribute("position", "0 "+newHeight+" 0");
  leftHit2.setAttribute("position", "0 "+newHeight+" 0");

}

function changeAngle(newAngle){



mallet1.setAttribute("animation__20grados", "property:rotation; from:-90 0; to:-90 0 "+newAngle+";dur:100;startEvents:separar1;");
mallet1.setAttribute("animation__40grados", "property:rotation; from:-90 0; to:-90 0 "+(newAngle*2)+";dur:100;startEvents:separar2;;");

mallet2.setAttribute("animation__20grados", "property:rotation; from:-90 0; to:-90 0 "+(-newAngle)+";dur:100;startEvents:separar1;");
mallet2.setAttribute("animation__40grados", "property:rotation; from:-90 0; to:-90 0 "+(-newAngle*2)+";dur:100;startEvents:separar2;");

mallet3.setAttribute("animation__20grados", "property:rotation; from:-90 0; to:-90 0 "+newAngle+";dur:100;startEvents:separar1;");
mallet3.setAttribute("animation__40grados", "property:rotation; from:-90 0; to:-90 0 "+(newAngle*2)+";dur:100;startEvents:separar2;");

mallet4.setAttribute("animation__20grados", "property:rotation; from:-90 0; to:-90 0 "+(-newAngle)+";dur:100;startEvents:separar1;");
mallet4.setAttribute("animation__40grados", "property:rotation; from:-90 0; to:-90 0 "+(-newAngle*2)+";dur:100;startEvents:separar2;");


mallet1.emit("separar1");
mallet2.emit("separar1");
mallet3.emit("separar1");
mallet4.emit("separar1");

}

//Check if the mallet hit the notes
leftHit1.addEventListener("hitclosest", checaHit);
rightHit1.addEventListener("hitclosest", checaHit);
leftHit2.addEventListener("hitclosest", checaHit);
rightHit2.addEventListener("hitclosest", checaHit);

/*
leftHit1.addEventListener("hitend", terminaHit);
rightHit1.addEventListener("hitend", terminaHit);
leftHit2.addEventListener("hitend", terminaHit);
rightHit2.addEventListener("hitend", terminaHit);
*/

rightHand.addEventListener("abuttondown", abuttondown);
rightHand.addEventListener("abuttonup", rightbuttonup);
rightHand.addEventListener("bbuttondown", bbuttondown);
rightHand.addEventListener("bbuttonup", rightbuttonup);

leftHand.addEventListener("xbuttondown", xbuttondown);
leftHand.addEventListener("xbuttonup", leftbuttonup);
leftHand.addEventListener("ybuttondown", ybuttondown);
leftHand.addEventListener("ybuttonup", leftbuttonup);

rightHand.addEventListener("gripchanged", rightgripchanged);
leftHand.addEventListener("gripchanged", leftgripchanged);

rightHand.addEventListener("thumbstickmoved", rightthumbstickmoved);
leftHand.addEventListener("thumbstickmoved", leftthumbstickmoved);


rightHand.addEventListener("thumbstickdown", rightthumbstickdown);
leftHand.addEventListener("thumbstickdown", leftthumbstickdown);

leftHand.addEventListener("triggerdown", lefttriggerdown);
leftHand.addEventListener("triggerup", lefttriggerup);



//Mallet hitting events
function rightgripchanged(e){
	mallet1.setAttribute("rotation", "-90 0 "+(e.detail.value*(angleMallet*2)));
	mallet2.setAttribute("rotation", "-90 0 "+(e.detail.value*(-angleMallet*2)));	
	
}

function leftgripchanged(e){
	mallet3.setAttribute("rotation", "-90 0 "+(e.detail.value*(angleMallet*2)));
	mallet4.setAttribute("rotation", "-90 0 "+(e.detail.value*(-angleMallet*2)));	
}


function leftthumbstickmoved(e){
  //e.detail.x & e.detail.y = -1 0 1
  //AquÃ­ podemos poner el tono

  var atan = Math.abs((Math.atan2(e.detail.x, e.detail.y)*180/Math.PI+180)-360);
  

  if(Math.abs(e.detail.x)>.5||Math.abs(e.detail.y)>.5){
    //debug.setAttribute("value", (Math.atan2(e.detail.y,e.detail.x)*180/Math.PI+180));
    toneEntity.setAttribute("scale", ".5 .5 .5");
    for(var i=0;i<toneHelpers.length;i++){
      if(atan>((360/toneHelpers.length)*i-(360/toneHelpers.length)/2) &&
      atan<((360/toneHelpers.length)*i+(360/toneHelpers.length)/2)){
        //debug.setAttribute("value", i);
        if(i!=currentTone){
          currentTone = i;
          changeTone(i);
        }
      }
    }

  }else{
      toneEntity.setAttribute("scale", "0 0 0");
      document.querySelector("#leftText").setAttribute("value", toneHelpers[currentTone].name);
  }
}


function rightthumbstickmoved(e){
  //AquÃ­ podemos poner el acorde
   //e.detail.x & e.detail.y = -1 0 1

  var atan = Math.abs((Math.atan2(e.detail.x, e.detail.y)*180/Math.PI+180)-360);
  

  if(Math.abs(e.detail.x)>.5||Math.abs(e.detail.y)>.5){
    //debug.setAttribute("value", (Math.atan2(e.detail.y,e.detail.x)*180/Math.PI+180));
    modeEntity.setAttribute("scale", ".5 .5 .5");
    for(var i=0;i<modeHelpers.length;i++){
      if(atan>((360/modeHelpers.length)*i-(360/modeHelpers.length)/2) &&
      atan<((360/modeHelpers.length)*i+(360/modeHelpers.length)/2)){
        //debug.setAttribute("value", i);
         if(i!=currentMode){
          currentMode = i;
          changeMode(i);
        }
      }
    }

  }else{
      modeEntity.setAttribute("scale", "0 0 0");
      document.querySelector("#rightText").setAttribute("value", modeHelpers[currentMode].name);
  }
}

function leftthumbstickdown(e){
  currentTone = -1;
  changeTone(currentTone);
  document.querySelector("#leftText").setAttribute("value", "");
}

function rightthumbstickdown(e){
  currentMode = -1;
  changeMode(currentMode);
   document.querySelector("#rightText").setAttribute("value", "");
}

function lefttriggerdown(){
  debug.setAttribute("value", "Sustained");
	sustained = true;
  document.querySelector("#stand").setAttribute("material", "color:#555500");
}

function lefttriggerup(){
  debug.setAttribute("value", "");
	sustained = false;
  stopAllSustained();
  document.querySelector("#stand").setAttribute("material", "color:#555555");
}

function abuttondown(){
	mallet1.emit("separar1");
	mallet2.emit("separar1");
}

function bbuttondown(){
	mallet1.emit("separar2");
	mallet2.emit("separar2");
}

function xbuttondown(){
	mallet3.emit("separar1");
	mallet4.emit("separar1");
}

function ybuttondown(){
	mallet3.emit("separar2");
	mallet4.emit("separar2");
}

function rightbuttonup(){

	mallet1.emit("reset");
	mallet2.emit("reset");
	
}

function leftbuttonup(){

	mallet3.emit("reset");
	mallet4.emit("reset");
	
}



 function checaHit(e){


  var worldPosition = new THREE.Vector3();

    var pasery = this.getAttribute("pasery");
    var posery = this.object3D.getWorldPosition(worldPosition).y;
    var paserx = this.getAttribute("paserx");
    var poserx = this.object3D.getWorldPosition(worldPosition).x;

    var velocity = Math.abs(pasery-posery)+Math.abs(paserx-poserx);

    nota = this.components['aabb-collider'].closestIntersectedEl.getAttribute("note");

    notaElement = this.components['aabb-collider'].closestIntersectedEl;
    
    notaElement.setAttribute("playing", true);

    if(toucher){
      notaElement.setAttribute("position", notaElement.getAttribute("posNota").split(" ")[0]+
      " "+(notaElement.getAttribute("posNota").split(" ")[1]-.1*velocity)+" "
      +notaElement.getAttribute("posNota").split(" ")[2]);  

    }else{
      notaElement.setAttribute("position", notaElement.getAttribute("posNota").split(" ")[0]+
      " "+(notaElement.getAttribute("posNota").split(" ")[1]-.01)+" "
      +notaElement.getAttribute("posNota").split(" ")[2]);  
    }

    //Emit this for the animation to play
    

    //Sound playing
    switch(nota.substr(0,1)){
      //Piano
      case "p":
        channel = 0;
        //noteDuration = 100;
      break;
      //SteelDrums
      case "s":
        channel = 1;
        //noteDuration = 100;
      break;
      //Harp
      case "h":
        channel = 2;
        //noteDuration = 500;
      break;
      //Drums
      case "d":
        channel = 9;
        //noteDuration = 100;
      break;
      
    }

    //debug.setAttribute("value", velocity*1270);
/*
    if(!holder){
      notaElement.emit("press");
    }else{
      notaElement.setAttribute("material", "color:yellow");
      noteDuration = 999999;
    }
    */

    if(sustained){
      noteDuration = 999999;
      notaElement.setAttribute("material", "color:yellow");
      susnotes.push(notaElement);
    }else{
      notaElement.emit("press");
      noteDuration = noteDurationFix;
    }

    if(toucher){
        playNote(Number(nota.substr(1)), Math.round(velocity*2000), channel, noteDuration);
    }else{
        playNote(Number(nota.substr(1)), 127, channel, noteDuration);
    }
    
  
  

    //Controller vibration
	this.parentNode.parentNode.components.haptics.pulse(1, 10);
  }

  function terminaHit(e){

    nota = this.components['aabb-collider'].closestIntersectedEl.getAttribute("note");

    notaElement = this.components['aabb-collider'].closestIntersectedEl;
    
    debug.setAttribute("value", this.components['aabb-collider'].closestIntersectedEl.getAttribute("note"));

    channel = 0

    //debug.setAttribute("value", velocity*1270);
    if(holder){
      notaElement.emit("press");
      stopNote(Number(nota.substr(1)), 127, channel, 0);
      //stopAllNotes();
    }
    

    //Controller vibration
	this.parentNode.parentNode.components.haptics.pulse(1, 10);
  }