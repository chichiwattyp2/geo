console.clear()

var links = document.querySelector('#links'),
		enter = document.querySelector('#enter-group');

console.log(enter);

hideEntity = function(){ 
	// console.log(this)
	enter.setAttribute("scale", "0 0 0")
}


// Register component //
// AFRAME.registerComponent('hide-enter-on-click', {
//   schema: {default: ''},
//   init() {
//     const enter = document.querySelector('.enter');
    
//     this.el.addEventListener('click', () => {
//       enter.setAttribute('src', this.data);
//     });
//   }
// });