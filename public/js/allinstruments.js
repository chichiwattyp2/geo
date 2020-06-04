var pianoFamily = document.querySelector("#piano-family");
var pianoInstrument = document.querySelector("#piano-instrument");
var currentPianoInstrument = -1;
var numberTemp = "";

function pianoNumber(num){
  switch(num)
  {
    case "plus":
      if(currentPianoInstrument<127){
        currentPianoInstrument++;
        enterInstrument();
      }

    break;

    case "minus":
      if(currentPianoInstrument>0){
        currentPianoInstrument--;
        enterInstrument();
      }
    break;

    default:
      enterNumber(num);
    break;

  }
}

function enterNumber(n){
  if(numberTemp.length<3){
    numberTemp+=n;
    
        pianoFamily.innerHTML = "Entering input..."
        pianoInstrument.innerHTML = numberTemp;
    if(numberTemp.length==3){

      if(Number(numberTemp)<128){
        currentPianoInstrument = Number(numberTemp);
        enterInstrument();
        numberTemp = "";
      }else{
        pianoFamily.innerHTML = "Invalid Midi Value"
        pianoInstrument.innerHTML = "Please choose from 000 to 127";
        numberTemp = "";
      }
    }
  }
}

function enterInstrument(){
  pianoFamily.innerHTML = iJSON[currentPianoInstrument].Family;
  pianoInstrument.innerHTML = iJSON[currentPianoInstrument].Midi+" "+iJSON[currentPianoInstrument].Instrument;
  changePianoInstrument(currentPianoInstrument);
}