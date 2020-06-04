var heroNotes = [];
var midiDuration = 0;

var speed = 1000;
var separation = 3000;

var noteIndex = 0;
var notesInterval;

var startTime = Date.now();
var elapsedTime;


var songs = [
  {"file":"01Prelude", "author":"J.S.Bach", "song":"Cello Suite #1 in G - Prelude", "genre":"Classical"},
  {"file":"JesuJoy", "author":"J.S.Bach", "song":"Jesu, Joy of Man's Desiring", "genre":"Classical"},
  {"file":"carol", "author":"Mykola Leontovych", "song":"Carol of the Bells", "genre":"Classical"},
  {"file":"wethreekings", "author":"John Henry Hopkins Jr.", "song":"We Three Kings", "genre":"Classical"},
  {"file":"sugarplum", "author":"Pyotr Ilyich Tchaikovsky", "song":"Dance of the Sugar Plum Fairy", "genre":"Classical"},
  {"file":"mz_545_2", "author":"Wolfgang Amadeus Mozart","song":"Sonata Facile II", "genre":"Classical"},
  {"file":"harrypoter", "author":"John Williams", "song":"Hedwig's Theme (from Harry Potter)", "genre":"Movie"},
  {"file":"Smbtheme", "author":"Koji Kondo", "song":"Super Mario Bros 1 Overworld", "genre":"Game"},
  {"file":"Smbwater", "author":"Koji Kondo","song":"Super Mario Bros 1 Underwater", "genre":"Game"},
  {"file":"Sm2th", "author":"Koji Kondo","song":"Super Mario Bros 2 Overworld", "genre":"Game"},
  {"file":"da_smb3-overworld", "author":"Koji Kondo","song":"Super Mario Bros 3 Overworld", "genre":"Game"},
  {"file":"da_smb3-overworld2", "author":"Koji Kondo","song":"Super Mario Bros 3 Athletic", "genre":"Game"}
];
var currentSongNumber = 0;
var currentSong = songs[0].file;

var lastNote = 0;

function changeSeparation(sep){
  separation +=sep;
  document.querySelector("#separation").innerHTML = (3000/separation).toFixed(2);
}

function changeSpeed(sp){
  speed +=sp;
  document.querySelector("#speed").innerHTML= (1000/speed).toFixed(2);
}


async function loadMidiJson(){
  // load a midi file in the browser
  const midi = await Midi.fromUrl("assets/songs/"+currentSong+".mid");
  //the file name decoded from the first track
  const name = midi.name
  midiDuration = midi.duration;
  //get the tracks
  midi.tracks.forEach(track => {
    //tracks have notes and controlChanges

    //notes are an array
    heroNotes = track.notes;

    heroNotes.sort(dynamicSort("time"));

    
    noteIndex = 0;

    //console.log(heroNotes);
    
    /*
    for(var i=0;i<heroNotes.length;i++){

      console.log(heroNotes[i].time);
      //console.log(heroNotes[i].midi);
      
      var hero = document.createElement("a-box");
      hero.setAttribute("height", anchoNotas);
      
      if(document.querySelector("#p"+heroNotes[i].midi).getAttribute("type")=="sharp"){
        hero.setAttribute("color", "#0000FF");
        
        
      hero.setAttribute("depth", anchoNotas*2);
      hero.setAttribute("width", anchoNotas/2.5);
        hero.setAttribute("position", ((document.querySelector("#p"+heroNotes[i].midi).getAttribute("position").x))+" "+((heroNotes[i].time/separation))+" 0");

      }else{
        hero.setAttribute("color", "#00FFFF");
        
      hero.setAttribute("depth", anchoNotas/4);
      hero.setAttribute("width", anchoNotas/2);
        hero.setAttribute("position", ((document.querySelector("#p"+heroNotes[i].midi).getAttribute("position").x))+" "+(heroNotes[i].time/separation)+" 0");

      }

      document.querySelector("#hero").appendChild(hero);

      if(i==heroNotes.length-1){
        hero.setAttribute("id", "finalNote");
      }
      
      //console.log(lastNote);
    }*/
    
  })
}

function playMidi(){
  
  notesInterval = setInterval(notesTimer,5);
  startTime = Date.now();
  //document.querySelector("#hero").setAttribute("animation__move", "property:position; to:0 "+(-document.querySelector("#finalNote").getAttribute("position").y*speed)+" 0; easing:linear; dur:"+midiDuration*1000)
}

function notesTimer(){

  elapsedTime = (Date.now() - startTime)/speed;
  //console.log(elapsedTime);
  

  if(elapsedTime>heroNotes[noteIndex].time){
    elapsedTime = heroNotes[noteIndex].time;
  }


  while(elapsedTime==heroNotes[noteIndex].time){

     var hero = document.createElement("a-box");
      hero.setAttribute("height", anchoNotas);
      
      if(document.querySelector("#p"+heroNotes[noteIndex].midi).getAttribute("type")=="sharp"){
        hero.setAttribute("color", "#0000FF");
        
      hero.setAttribute("depth", anchoNotas*2);
      hero.setAttribute("width", anchoNotas/2.5);
        hero.setAttribute("position", ((document.querySelector("#p"+heroNotes[noteIndex].midi).getAttribute("position").x))+" 1 0");
      }else{
        hero.setAttribute("color", "#00FFFF");
      hero.setAttribute("depth", anchoNotas/4);
      hero.setAttribute("width", anchoNotas/2);
        hero.setAttribute("position", ((document.querySelector("#p"+heroNotes[noteIndex].midi).getAttribute("position").x))+" 1 0");

      }
      
      hero.setAttribute("animation__spawn", "property:scale; dur:2000; from:0 0 0; to:1 1 1; easing:easeOutElastic;autoplay:true;");
      hero.setAttribute("animation__move", "property:position; dur:"+separation+"; to:"+((document.querySelector("#p"+heroNotes[noteIndex].midi).getAttribute("position").x))+" -.5 0; easing:linear;autoplay:true;");

      hero.addEventListener("animationcomplete__move", deleteHeroNote);
      
      hero.setAttribute("class", "notehero");
      //hero.setAttribute("note", "p"+heroNotes[noteIndex].midi);
      //hero.setAttribute("posNota", "0 0 0");
      //hero.addEventListener("hitclosest", checaHero);

      document.querySelector("#hero").appendChild(hero);

      //hero.setAttribute("aabb-collider", "objects:#p"+heroNotes[noteIndex].midi+";interval:1;");


      noteIndex++;
      if(noteIndex==heroNotes.length-1)
      {
        clearInterval(notesInterval);
      }
    
  }

}

var hitElement;

function checaHero(e){
  
    hitElement = this.components['aabb-collider'].closestIntersectedEl;

    
    if(hitElement.getAttribute("playing")=="true"){
      correctHeroNote(this);
    }else{
      
    }

}

function deleteHeroNote(e){
  e.target.setAttribute("visible", "false");
  //e.target.parentNode.removeChild(e.target);
}

function correctHeroNote(e){
  e.setAttribute("scale", "1.5 1.5 1.5")
  e.setAttribute("material", "color:green")
}


function clearSong(){

  var e = document.querySelector("#hero"); 
  var first = e.firstElementChild;
    while (first) { 
      document.querySelector("#hero").removeChild(first);
      first = e.firstElementChild; 
    } 

  
    //noteIndex = 0;
    clearInterval(notesInterval);
    noteIndex = 0;
   
  //document.querySelector("#hero").removeAttribute("animation__move");
  //document.querySelector("#hero").setAttribute("position", "0 0 0");
}

function selectSong(num){

  currentSongNumber+=num;

  if(currentSongNumber<0){
    currentSongNumber = songs.length-1;
  }else if(currentSongNumber>songs.length-1){
    currentSongNumber = 0;
  }

  currentSong = songs[currentSongNumber].file;

  document.querySelector("#genreName").innerHTML= (songs[currentSongNumber].genre);  
  document.querySelector("#songName").innerHTML= (songs[currentSongNumber].author+" - "+songs[currentSongNumber].song);


}


function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}