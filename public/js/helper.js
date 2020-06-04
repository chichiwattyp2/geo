var toneHelpers = [
  {"name":"C", "color": "#FF00FF"},
  {"name":"G", "color": "#999900"},
  {"name":"D", "color": "#800080"},
  {"name":"A", "color": "#FFA500"},
  {"name":"E", "color": "#009999"},
  {"name":"B", "color": "#FF0000"},
  {"name":"F#", "color": "#d1d63b"},
  {"name":"Db", "color": "#9c004a"},
  {"name":"Ab", "color": "#ffae42"},
  {"name":"Eb", "color": "#8b72be"},
  {"name":"Bb", "color": "#cd4327"},
  {"name":"F", "color": "#009900"}
];

var regularTone = [0,1,2,3,4,5,6,7,8,9,10,11];
var regularMode = [1,1,1,1,1,1,1,1,1,1,1,1];

var modeHelpers = [
  {"name":"Major", "color": "#888888"},
  {"name":"Minor", "color": "#888888"},
  {"name":"Major 7", "color": "#888888"},
  {"name":"Diminished", "color": "#888888"},
  {"name":"Ionian", "color": "#444444"},
  {"name":"Dorian", "color": "#444444"},
  {"name":"Phrygian", "color": "#444444"},
  {"name":"Lydian", "color": "#444444"},
  {"name":"Mixolydian", "color": "#444444"},
  {"name":"Aeolian", "color": "#444444"},
  {"name":"Locrian", "color": "#444444"},
  {"name":"Pentatonic", "color": "#222222"}
];

var toneEntity = document.createElement("a-entity");
var modeEntity = document.createElement("a-entity");

toneEntity.setAttribute("position", "0 0 0")
modeEntity.setAttribute("position", "0 0 0")

toneEntity.setAttribute("scale", ".5 .5 .5")
modeEntity.setAttribute("scale", ".5 .5 .5")

for(i=0;i<toneHelpers.length;i++){
  var entityRotator = document.createElement("a-entity");
  var buttonTone = document.createElement("a-box");
  
  var text = document.createElement("a-text");

  buttonTone.setAttribute("width", ".06");
  buttonTone.setAttribute("height", ".06");
  buttonTone.setAttribute("depth", ".005");
  buttonTone.setAttribute("position", "0 .2 0");
  buttonTone.setAttribute("color", toneHelpers[i].color);
  text.setAttribute("value", toneHelpers[i].name);
  text.setAttribute("scale", ".1 .1 .1");
  text.setAttribute("position", "0 0 .01");
  text.setAttribute("align", "center");
  text.setAttribute("rotation", "0 0 "+((360/toneHelpers.length)*i));

  entityRotator.setAttribute("rotation", "-90 0 "+((360/toneHelpers.length)*-i));
  entityRotator.setAttribute("position", "0 .05 0");
  entityRotator.setAttribute("id", "tone"+i);
  
  entityRotator.appendChild(buttonTone);
  buttonTone.appendChild(text);
  toneEntity.appendChild(entityRotator);
    
}

leftHand.appendChild(toneEntity);

for(i=0;i<modeHelpers.length;i++){
  var entityRotator = document.createElement("a-entity");
  var buttonMode = document.createElement("a-box");

  var text = document.createElement("a-text");

  buttonMode.setAttribute("width", ".06");
  buttonMode.setAttribute("height", ".06");
  buttonMode.setAttribute("depth", ".005");
  buttonMode.setAttribute("position", "0 .2 0");
  buttonMode.setAttribute("color", modeHelpers[i].color);
  text.setAttribute("value", modeHelpers[i].name);
  text.setAttribute("scale", ".1 .1 .1");
  text.setAttribute("position", "0 0 .01");
  text.setAttribute("align", "center");
  text.setAttribute("rotation", "0 0 "+((360/modeHelpers.length)*i));

  entityRotator.setAttribute("rotation", "-90 0 "+((360/modeHelpers.length)*-i));
  entityRotator.setAttribute("position", "0 .05 0");
  entityRotator.setAttribute("id", "mode"+i);
  
  entityRotator.appendChild(buttonMode);
  buttonMode.appendChild(text);
  modeEntity.appendChild(entityRotator);
    
}

rightHand.appendChild(modeEntity);


function changeTone(_tone){

/*

0 C   0
1 Db  7
2 D   2
3 Eb  9
4 E   4
5 F   11
6 F#  6
7 G   1
8 Ab  8
9 A   3
10 Bb 10
11 B  5

*/

  switch(_tone){

    case -1:
      regularTone = [0,1,2,3,4,5,6,7,8,9,10,11];
    break;

    case 0:
      regularTone = [0,1,2,3,4,5,6,7,8,9,10,11];
    break;

     case 1:
      regularTone = [7,8,9,10,11,0,1,2,3,4,5,6];
    break;

     case 2:
      regularTone = [2,3,4,5,6,7,8,9,10,11,0,1];
    break;

     case 3:
      regularTone = [9,10,11,0,1,2,3,4,5,6,7,8];
    break;

     case 4:
      regularTone = [4,5,6,7,8,9,10,11,0,1,2,3];
    break;

     case 5:
      regularTone = [11,0,1,2,3,4,5,6,7,8,9,10];
    break;

     case 6:
      regularTone = [6,7,8,9,10,11,0,1,2,3,4,5];
    break;

     case 7:
      regularTone = [1,2,3,4,5,6,7,8,9,10,11,0];
    break;

     case 8:
      regularTone = [8,9,10,11,0,1,2,3,4,5,6,7];
    break;
     case 9:
      regularTone = [3,4,5,6,7,8,9,10,11,0,1,2];
    break;
     case 10:
      regularTone = [10,11,0,1,2,3,4,5,6,7,8,9];
    break;

     case 11:
      regularTone = [5,6,7,8,9,10,11,0,1,2,3,4];
    break;
  }

  applyToneMode();

}

function changeMode(_mode){

  switch(_mode){

     case -1:
      regularMode = [1,1,1,1,1,1,1,1,1,1,1,1];
    break;

    case 0: //MAJ
      regularMode = [1,0,0,0,1,0,0,1,0,0,0,0];
    break;

    case 1: //MIN
      regularMode = [1,0,0,1,0,0,0,1,0,0,0,0];
    break;

     case 2: //MAJ 7
      regularMode = [1,0,0,0,1,0,0,1,0,0,1,0];
    break;

    case 3: //DIM
      regularMode = [1,0,0,1,0,0,1,0,0,1,0,0];
    break;

    case 4: //Ionian
      regularMode = [1,0,1,0,1,1,0,1,0,1,0,1];
    break;

    case 5: //Dorian
      regularMode = [1,0,1,1,0,1,0,1,0,1,1,0];
    break;

    case 6: //Phrygian
      regularMode = [1,1,0,1,0,1,0,1,1,0,1,0];
    break;
    
    case 7: //Lydian
      regularMode = [1,0,1,0,1,0,1,1,0,1,0,1];
    break;
    
    case 8: //Mixolydian
      regularMode = [1,0,1,0,1,1,0,1,0,1,1,0];
    break;
    
    case 9: //Aeolian
      regularMode = [1,0,1,1,0,1,0,1,1,0,1,0];
    break;

    case 10: //Locrian
      regularMode = [1,1,0,1,0,1,1,0,1,0,1,0];
    break;
    
    case 11: //Pentatonic
      regularMode = [1,0,1,0,1,0,0,1,0,1,0,0];
    break;
  }

  applyToneMode();

}

function applyToneMode(){


 for(i=0;i<toneHelpers.length;i++){
    document.querySelector("#tone"+i).setAttribute("scale", "1 1 1");
  }

  for(i=0;i<modeHelpers.length;i++){
    document.querySelector("#mode"+i).setAttribute("scale", "1 1 1");
  }

  if(currentTone!=-1){
    document.querySelector("#tone"+currentTone).setAttribute("scale", "1.3 1.3 1.3");
  }
  if(currentMode!=-1){
    document.querySelector("#mode"+currentMode).setAttribute("scale", "1.3 1.3 1.3");
  }

  
   for(i=0;i<octavas;i++){
    //Repeat 12 times (number of notes)
    for(j=0;j<12;j++){
      //Check the logical number
      numTotal = regularTone[j]+(i*12);
      //Create the physical note
      var nota = document.querySelector("#p"+(firstNote+numTotal));
      
        nota.setAttribute("src", "assets/nota.jpg");
        nota.setAttribute("class", "note");
        nota.setAttribute("scale", "1 1 1");

      //If the note is sharp (indexed at 1, 3, 6, 8 or 10)
      if(regularMode[j]==1){
        nota.setAttribute("src", "assets/nota.jpg");
        nota.setAttribute("class", "note");
        nota.setAttribute("scale", "1 1 1");
      }else{
        nota.setAttribute("src", "");
        nota.setAttribute("class", "noto");
        nota.setAttribute("scale", "1 .5 .7");
      }
    }
   }

}