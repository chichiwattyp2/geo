
JZZ.synth.Tiny.register('Piano');
var port = JZZ().openMidiOut().or(function(){alert('Cannot open MIDI port!');});
//Default sound for channel 0 is Celesta
port.program(0, 8)
//Default sound for channel 1 is Steeldrums
port.program(1, 44);
//Default sound for channel 2 is Orchestral Harp
port.program(2, 46);

//Play the note
function playNote(num, vol, channel, duration){
  
 
  port.send([0x90+channel,num,vol]).wait(duration).send([0x80+channel,num,0]);
  setTimeout(notefalse, duration*2, num);
}


function notefalse(num){
  document.querySelector("#p"+num).setAttribute("playing", false)
}

//Stop the note
function stopNote(num, vol, channel, duration){
  port.send([0x80+channel,num,0]);
}

//Stop all the notes
function stopAllSustained(){
  for (i=0;i<susnotes.length;i++){
      susnotes[i].emit("press");
      port.send([0x80+channel,susnotes[i].getAttribute("id").substr(1),0]);
  }
  susnotes = [];
}