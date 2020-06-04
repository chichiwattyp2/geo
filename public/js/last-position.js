AFRAME.registerComponent('last-position', {
  init: function(){

  },
  tick: function (t) {
    
     this.el.setAttribute("pasery", this.el.getAttribute("posery"));
     this.el.setAttribute("paserx", this.el.getAttribute("poserx"));

     
    var worldPosition = new THREE.Vector3();
    //console.log(this.el.object3D.getWorldPosition(worldPosition).y);

     this.el.setAttribute("posery", this.el.object3D.getWorldPosition(worldPosition).y);
     this.el.setAttribute("poserx", this.el.object3D.getWorldPosition(worldPosition).x);
  }
});
