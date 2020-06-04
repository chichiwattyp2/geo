//PIANO LAYOUT (CUSTOMIZABLE)

//The note id
var nota;

//The note element itself
var notaElement;

//For loops
var i = 0;
var j = 0;

//Position that will be assigned to the note ID (to play the correct note)
var numtotal = 0;

//How many octaves will I have
var octavas = 7;

//Position in X of the note
var posNota = ""

//Sharp keys color
var negras = "#111111";

//Sharp keys offset
var negrasYOffset = .07;
var negrasZOffset = -0.15;

//White keys color
var blancas= "#DDDDDD";

//Played key color
var played = "#FFFF55";

//Note width
var anchoNotas = .05;

//Space between notes (1 is no space between notes)
var espacioInternotal = 1.1;

//Empty entity where notes will go
var piano = document.querySelector("#piano");
var pianoMenu = document.querySelector("#pianoMenus");
var songPanel = document.querySelector("#songPanel");

//White keys position (sharp keys will be added in between)
var posblancas = 0;

var channel;

var firstNote = 24;

generatePiano();

function generatePiano(){



  //For the number of octaves
  for(i=0;i<octavas;i++){

    //Repeat 12 times (number of notes)
    for(j=0;j<12;j++){

      //Check the logical number (MIDI)
      numTotal = j+(i*12);

      //Create the physical note
      var nota = document.createElement("a-box");
      nota.setAttribute("class", "note");
        nota.setAttribute("src", "assets/nota.jpg");
      
      //If the note is sharp (indexed at 1, 3, 6, 8 or 10)
      if(j==1||j==3||j==6||j==8||j==10){
        //Set the color, positions and animations
        nota.setAttribute("color", negras);
        nota.setAttribute("type", "sharp");
        nota.setAttribute("animation__color", "property:color; from:"+played+"; to:"+negras+"; dur:300; startEvents:press");
        posNota = (espacioInternotal*(posblancas*anchoNotas)-anchoNotas*espacioInternotal/2)
        
        nota.setAttribute("posNota", posNota+" "+negrasYOffset+" "+negrasZOffset);
        nota.setAttribute("position", posNota+" "+negrasYOffset+" "+negrasZOffset);
        nota.setAttribute("animation__position", "property:position; to:"+posNota+" "+negrasYOffset+" "+negrasZOffset+"; dur:300; startEvents:press");

      //If the note is white
      }else{
        //Set the color, positions and animations
        nota.setAttribute("color", blancas);
        nota.setAttribute("type", "natural");
        nota.setAttribute("posNota", posNota);
        nota.setAttribute("animation__color", "property:color; from:"+played+"; to:"+blancas+"; dur:300; startEvents:press");
        posNota = (espacioInternotal*posblancas*anchoNotas);
        nota.setAttribute("posNota", posNota+" 0 0");
        nota.setAttribute("position", posNota+" 0 0");
        nota.setAttribute("animation__position", "property:position; to:"+posNota+" "+nota.getAttribute("position").y+" "+nota.getAttribute("position").z+"; dur:300; loop:0; startEvents:press");
        posblancas++;
      }

      //Set the width, depth, height and note (the note value is very important since it will tell what note to play)
      nota.setAttribute("width",anchoNotas);
      nota.setAttribute("depth", ".2");
      nota.setAttribute("height", ".03");
      nota.setAttribute("playing", false);
      nota.setAttribute("note", "p"+(firstNote+numTotal));
      nota.setAttribute("id", "p"+(firstNote+numTotal));
      
      //Add each note to the parent entity
      piano.appendChild(nota);

      

    }

  }

  
  var stand = document.createElement("a-box");
  
  stand.setAttribute("material", "src:assets/nota.jpg; color:#555555;");
  stand.setAttribute("geometry", "depth:.66; height:.08; width:2.7");
  stand.setAttribute("position", "1.33 0.04 -0.22");
  stand.setAttribute("rotation", "21 0 0");
  stand.setAttribute("id", "stand");
      piano.appendChild(stand);
  
      posblancas = 0;
}



function modifyValue(variable, value, increase){

  if(increase!=undefined){
    if(increase){
      window[variable] += value;
    }else{
      window[variable] -= value;
    }
  }else{
    window[variable] = value;
  }
  modifyPiano();
}

function modifyPiano(){

  //For the number of octaves
  for(i=0;i<octavas;i++){
    //Repeat 12 times (number of notes)
    for(j=0;j<12;j++){
      //Check the logical number
      numTotal = j+(i*12);
      //Create the physical note
      var nota = document.querySelector("#p"+(firstNote+numTotal));

      //If the note is sharp (indexed at 1, 3, 6, 8 or 10)
      if(j==1||j==3||j==6||j==8||j==10){
        //Set the color, positions and animations
        nota.setAttribute("color", negras);
        nota.setAttribute("animation__color", "property:color; from:"+played+"; to:"+negras+"; dur:300; startEvents:press");
        posNota = (espacioInternotal*(posblancas*anchoNotas)-anchoNotas*espacioInternotal/2)
        nota.setAttribute("posNota", posNota+" "+negrasYOffset+" "+negrasZOffset);
        nota.setAttribute("position", posNota+" "+negrasYOffset+" "+negrasZOffset);
        nota.setAttribute("animation__position", "property:position; to:"+posNota+" "+negrasYOffset+" "+negrasZOffset+"; dur:300; startEvents:press");

      //If the note is white
      }else{
        //Set the color, positions and animations
        nota.setAttribute("color", blancas);
        nota.setAttribute("animation__color", "property:color; from:"+played+"; to:"+blancas+"; dur:300; startEvents:press");
        posNota = (espacioInternotal*posblancas*anchoNotas);
        nota.setAttribute("posNota", posNota+" 0 0");
        nota.setAttribute("position", posNota+" 0 0");
        nota.setAttribute("animation__position", "property:position; to:"+posNota+" "+nota.getAttribute("position").y+" "+nota.getAttribute("position").z+"; dur:300; loop:0; startEvents:press");
        posblancas++;
      }

      //Set the width, depth, height and note (the note is very important since it will tell what note to play)
      nota.setAttribute("width",anchoNotas);
      nota.setAttribute("depth", ".2");
      nota.setAttribute("height", ".03");
      //nota.setAttribute("note", "p"+(firstNote+numTotal));

      //Add each note to the parent entity
      //piano.appendChild(nota);

    }

  }
  
      posblancas = 0;
}

//Change the instruments with the buttons
function changePianoInstrument(inst){
	//Instrument change itself
	port.program(0, inst)
	//Demo sound
	port.send([0x90,60,100]).wait(100).send([0x80,60,0]);
}

function myToucher(bool){
  //debug.setAttribute("value", bool)
  toucher = bool;
}

function myHolder(bool){
  //debug.setAttribute("value", bool)
  holder = bool;
}


function movePiano(num){
  piano.setAttribute("position", {x:piano.getAttribute("position").x, 
  y: piano.getAttribute("position").y+num,
  z:piano.getAttribute("position").z});

  
  pianoMenus.setAttribute("position", {x:pianoMenus.getAttribute("position").x, 
  y: pianoMenus.getAttribute("position").y+num,
  z:pianoMenus.getAttribute("position").z});

  
  songPanel.setAttribute("position", {x:songPanel.getAttribute("position").x, 
  y: songPanel.getAttribute("position").y+num,
  z:songPanel.getAttribute("position").z});

var heroContainer = document.querySelector("#heroContainer");
  
  heroContainer.setAttribute("position", {x:heroContainer.getAttribute("position").x, 
  y: heroContainer.getAttribute("position").y+num,
  z:heroContainer.getAttribute("position").z});
}
