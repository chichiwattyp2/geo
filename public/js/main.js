/* global AFRAME, THREE */
if (typeof AFRAME === "undefined") {
  throw new Error(
    "Component attempted to register before AFRAME was available."
  );
}

var rainbowcolors = [
  "#6633FA",
  "#A237FD",
  "#D53CFE",
  "#FF40FF",
  "#FF4FAD",
  "#FF6B8C",
  "#FF9552",
  "#FDC00C",
  "#FADF1A"
];

// teleport indicator
AFRAME.registerComponent("teleport-indicator", {
  schema: {
    radiusInner: { type: "number", default: 0.4 },
    radiusOuter: { type: "number", default: 0.41 },
    color: { type: "string", default: "#fc00e9" },
    yInc: { type: "number", default: 0.04 },
    lookAtObj: { type: "string", default: "" }
  },
  init: function() {
    var data = this.data;
    var el = this.el;

    this.target3D = null;
    this.vector = new THREE.Vector3();

    var range = [1, 1, 0.8, 0.6, 0.4, 0.2];
    el.setAttribute("rotation", `0 0 0`);
    this.triggerOnce = true;

    for (var i = 0; i < range.length; i++) {
      var r = document.createElement("a-entity");
      r.setAttribute(
        "geometry",
        `primitive:ring; radiusInner:${data.radiusInner}; radiusOuter:${data.radiusOuter}`
      );
      r.setAttribute("position", `0 ${0.06 + data.yInc * i} 0`);
      r.setAttribute("rotation", `-90 0 0`);
      r.setAttribute(
        "material",
        `color:${data.color};opacity:${range[i]};shader:flat;`
      );
      r.setAttribute(
        "animation__in",
        `property: geometry.radiusOuter; delay:${i *
          100}; dur: 500; easing: easeOutElastic; from:${
          data.radiusOuter
        }; to:${data.radiusOuter + i * 0.05}; startEvents:waveout;`
      );
      r.setAttribute(
        "animation__in2",
        `property: geometry.radiusInner; delay:${i *
          100}; dur: 500; easing: easeOutElastic; from:${
          data.radiusInner
        }; to:${data.radiusInner + i * 0.045}; startEvents:waveout;`
      );
      r.setAttribute(
        "animation__in3",
        `property: position; delay:${i *
          100}; dur: 500; easing: easeOutElastic; to:0 0.06 0; from:0 ${0.06 +
          data.yInc * i} 0; startEvents:waveout;`
      );
      r.setAttribute(
        "animation__out",
        `property: geometry.radiusOuter; delay:${i *
          100}; dur: 500; easing: easeInElastic; to:${
          data.radiusOuter
        }; from:${data.radiusOuter + i * 0.05}; startEvents:wavein;`
      );
      r.setAttribute(
        "animation__out2",
        `property: geometry.radiusInner; delay:${i *
          100}; dur: 500; easing: easeInElastic; to:${
          data.radiusInner
        }; from:${data.radiusInner + i * 0.045}; startEvents:wavein;`
      );
      r.setAttribute(
        "animation__out3",
        `property: position; delay:${i *
          100}; dur: 500; easing: easeInElastic; from:0 0.06 0; to:0 ${0.06 +
          data.yInc * i} 0; startEvents:wavein;`
      );
      el.appendChild(r);
    }
    for (var j = 0; j < 5; j++) {
      var r = document.createElement("a-entity");
      r.setAttribute("geometry", `primitive:plane; width:0.5; height:0.5`);
      r.setAttribute("position", `0 ${0.1 + 0.01 * j} 0`);
      r.setAttribute("rotation", `-90 0 0`);
      r.setAttribute(
        "material",
        `src:#feet; transparent:true;opacity:${1 - j * 0.2};shader:flat;`
      );
      el.appendChild(r);
    }

    var cylinder = document.createElement("a-entity");
    cylinder.setAttribute(
      "geometry",
      `primitive:cylinder; radius:${data.radiusOuter}; height:0.4;`
    );
    cylinder.setAttribute("position", `0 0.2 0`);
    cylinder.setAttribute(
      "material",
      `color:#fff; wireframe:false; opacity:0;`
    );
    el.appendChild(cylinder);

    cylinder.addEventListener("mouseenter", function() {
      for (var k = 0; k < el.children.length; k++) {
        el.children[k].emit("waveout");
      }
    });
    cylinder.addEventListener("mouseleave", function() {
      for (var l = 0; l < el.children.length; l++) {
        el.children[l].emit("wavein");
      }
    });
  },
  update: function() {
    var self = this;
    var target = self.data.lookAtObj;
    var object3D = self.el.object3D;
    var targetEl;
    if (
      !target ||
      (typeof target === "object" && !Object.keys(target).length)
    ) {
      return self.remove();
    }
    if (typeof target === "object") {
      return object3D.lookAt(new THREE.Vector3(target.x, target.y, target.z));
    }
    targetEl = self.el.sceneEl.querySelector(target);
    if (!targetEl) {
      warn('"' + target + '" does not point to a valid entity to look-at');
      return;
    }
    if (!targetEl.hasLoaded) {
      return targetEl.addEventListener("loaded", function() {
        self.beginTracking(targetEl);
      });
    }
    return self.beginTracking(targetEl);
  },
  tick: (function() {
    var vec3 = new THREE.Vector3();
    return function(t) {
      var target;
      var target3D = this.target3D;
      var object3D = this.el.object3D;
      var vector = this.vector;

      if (target3D) {
        object3D.parent.worldToLocal(target3D.getWorldPosition(vec3));
        if (this.el.getObject3D("camera")) {
          vector.subVectors(object3D.position, vec3).add(object3D.position);
        } else {
          vector = vec3;
        }
        object3D.lookAt(new THREE.Vector3(vector.x, 0, vector.z));
      }
    };
  })(),
  beginTracking: function(targetEl) {
    this.target3D = targetEl.object3D;
  }
});

AFRAME.registerComponent("gui", {
  multiple: true,
  schema: {
    zpos: { type: "number", default: -2 },
    xoffset: { type: "number", default: 0 },
    yoffset: { type: "number", default: 0 },
    show: { type: "boolean", default: false }
  },
  init: function() {
    var data = this.data;
    var el = this.el;
    this.cameraEl = document.querySelector("a-entity[camera]");
    if (this.cameraEl) {
      this.initHeight =
        Math.round(this.cameraEl.object3D.getWorldPosition().y * 100) / 100;
      this.yaxis = new THREE.Vector3(0, 1, 0);
      this.zaxis = new THREE.Vector3(0, 0, 1);
      this.pivot = new THREE.Object3D();
      this.el.object3D.position.set(
        this.data.xoffset,
        this.initHeight + this.data.yoffset,
        this.data.zpos
      );
      this.el.sceneEl.object3D.add(this.pivot);
      this.pivot.add(this.el.object3D);
    } else {
      console.log("Please add a camera to your scene.");
    }
  },
  place: function() {
    var direction = this.zaxis.clone();
    direction.applyQuaternion(this.cameraEl.object3D.quaternion);
    var ycomponent = this.yaxis
      .clone()
      .multiplyScalar(direction.dot(this.yaxis));
    direction.sub(ycomponent);
    direction.normalize();
    this.pivot.quaternion.setFromUnitVectors(this.zaxis, direction);
    var xposition = this.cameraEl.object3D.getWorldPosition().x;
    var yposition =
      Math.round(this.cameraEl.object3D.getWorldPosition().y * 100) / 100;
    var zposition = this.cameraEl.object3D.getWorldPosition().z;
    if (this.initHeight === yposition && this.initHeight !== 0) {
      yposition = 0;
    } else {
      yposition = yposition - this.initHeight;
    }
    this.pivot.position.set(xposition, yposition, zposition);
  },
  update: function(oldData) {
    var data = this.data;
    var el = this.el;
    if (data.show) {
      this.place();

      this.el.removeAttribute("animation__invisible");
      this.el.removeAttribute("animation__out");

      this.el.setAttribute("visible", true);
      this.el.setAttribute("scale", "0.00001 0.00001 0.00001");
      this.el.setAttribute(
        "animation__enter",
        `property: scale; from: 0.00001 0.00001 0.00001; to:1 1 1; dur:1000; delay:350; easing: easeOutElastic;`
      );
    } else {
      this.el.removeAttribute("animation__enter");

      this.el.setAttribute(
        "animation__out",
        `property: scale; to: 0.00001 0.00001 0.00001; from:1 1 1; dur:1000; delay:350; easing: easeOutElastic;`
      );
      this.el.setAttribute(
        "animation__invisible",
        `property: visible; from: true; to:false; delay:350;`
      );
    }
  }
});

AFRAME.registerComponent("menutrigger", {
  schema: {
    angle: { type: "number", default: -30 }
  },
  init: function() {
    var yDisplay = document.createElement("a-entity");
    yDisplay.setAttribute(
      "geometry",
      "primitive: plane; width: 0.5; height: 0.2;"
    );
    yDisplay.setAttribute(
      "material",
      "shader: flat; opacity: 0.2; color: #000000"
    );
    yDisplay.setAttribute("rotation", "0 0 0");
    yDisplay.setAttribute("position", "0 0.125 -2");
    yDisplay.setAttribute("text", "value", "y-pos");
    yDisplay.setAttribute("text", "align", "center");
    yDisplay.setAttribute("text", "wrapCount", "10");
    this.el.appendChild(yDisplay);
    this.yDisplay = yDisplay;
  },
  tick: function() {
    var rotation = this.el.object3D.getWorldRotation();
    var angle = Math.round(THREE.Math.radToDeg(rotation.x) * 100) / 100;
    this.yDisplay.setAttribute("text", "value", angle);
    if (angle < this.data.angle) {
      this.yDisplay.setAttribute(
        "material",
        "shader: flat; opacity: 0.2; color: red"
      );
      document.querySelector("a-entity[gui]").setAttribute("gui", "show", true);
    } else {
      this.yDisplay.setAttribute(
        "material",
        "shader: flat; opacity: 0.2; color: #000000"
      );
      document
        .querySelector("a-entity[gui]")
        .setAttribute("gui", "show", false);
    }
  }
});

// GUI play/pause button component
AFRAME.registerComponent("play_btn", {
  multiple: true,
  schema: {
    on: { default: "click" },
    clickAction: { type: "string" },
    borderColor: { type: "string", default: "#fc00e9" },
    borderInner: { type: "number", default: 0.16 },
    borderOuter: { type: "number", default: 0.17 }
  },
  init: function() {
    var data = this.data;
    var el = this.el;
    var toggle = (this.toggle = false);

    var rEntity = document.createElement("a-entity");
    rEntity.setAttribute(
      "geometry",
      `primitive:ring; radiusInner:${data.borderInner}; radiusOuter:${data.borderOuter}`
    );
    rEntity.setAttribute(
      "material",
      `shader: flat; opacity:1; color:${data.borderColor};`
    );
    rEntity.setAttribute("position", "0 0 0");
    el.appendChild(rEntity);

    var bEntity = document.createElement("a-entity");
    bEntity.setAttribute(
      "geometry",
      `primitive: circle; radius:${data.borderInner - 0.01};`
    );
    bEntity.setAttribute("material", `shader: flat; color:#000;opacity:0.5;`);
    bEntity.setAttribute("position", "0 0 0");
    el.appendChild(bEntity);

    var playIcon = document.createElement("a-entity");
    playIcon.setAttribute(
      "geometry",
      `primitive:triangle;vertexA:0 0.07 0;vertexB:0 -0.07 0;vertexC:0.12 0 0`
    );
    playIcon.setAttribute(
      "material",
      `shader: flat; transparent: true; opacity: 1; color:#fff;`
    );
    playIcon.setAttribute("position", "-0.035 0 0.001");
    playIcon.setAttribute("visible", "true");
    bEntity.appendChild(playIcon);
    this.playIcon = playIcon;

    var pauseIcon = document.createElement("a-entity");
    pauseIcon.setAttribute("position", "0 0 0.001");
    pauseIcon.setAttribute("visible", "false");
    bEntity.appendChild(pauseIcon);
    this.pauseIcon = pauseIcon;

    var pauseIcon1 = document.createElement("a-entity");
    pauseIcon1.setAttribute(
      "geometry",
      `primitive:plane;width:0.04;height:0.12;`
    );
    pauseIcon1.setAttribute(
      "material",
      `shader: flat; transparent: true; opacity: 1; color:#fff;`
    );
    pauseIcon1.setAttribute("position", "-0.0325 0 0");
    pauseIcon.appendChild(pauseIcon1);
    var pauseIcon2 = document.createElement("a-entity");
    pauseIcon2.setAttribute(
      "geometry",
      `primitive:plane;width:0.04;height:0.12;`
    );
    pauseIcon2.setAttribute(
      "material",
      `shader: flat; transparent: true; opacity: 1; color:#fff;`
    );
    pauseIcon2.setAttribute("position", "0.0325 0 0");
    pauseIcon.appendChild(pauseIcon2);

    var hoverEntity = document.createElement("a-entity");
    hoverEntity.setAttribute(
      "geometry",
      `primitive: plane; height: ${data.borderOuter * 2 +
        0.02}; width: ${data.borderOuter * 2 + 0.02};`
    );
    hoverEntity.setAttribute(
      "material",
      `shader: flat; transparent: true; opacity: 0; color:#fff;`
    );
    hoverEntity.setAttribute("position", "0 0 0.01");
    el.appendChild(hoverEntity);

    el.addEventListener("mouseenter", function() {
      bEntity.removeAttribute("animation__leave");
      rEntity.removeAttribute("animation__leave2");
      bEntity.setAttribute(
        "animation__enter",
        `property: material.opacity; from: 0.5; to:0.75; dur:300;`
      );
      rEntity.setAttribute(
        "animation__enter2",
        `property: geometry.radiusOuter; from:${
          data.borderOuter
        }; to:${data.borderOuter + 0.01}; dur:300;`
      );
    });
    el.addEventListener("mouseleave", function() {
      bEntity.removeAttribute("animation__enter");
      rEntity.removeAttribute("animation__enter2");
      bEntity.setAttribute(
        "animation__leave",
        `property: material.opacity; from: 0.75; to:0.5; dur:300; easing: easeOutQuad;`
      );
      rEntity.setAttribute(
        "animation__leave2",
        `property: geometry.radiusOuter; from: ${data.borderOuter + 0.01}; to:${
          data.borderOuter
        }; dur:300; easing: easeOutQuad;`
      );
    });
    el.addEventListener(data.on, function() {
      if (!toggle) {
        toggle = true;
        playIcon.setAttribute("visible", "false");
        pauseIcon.setAttribute("visible", "true");
      } else {
        toggle = false;
        playIcon.setAttribute("visible", "true");
        pauseIcon.setAttribute("visible", "false");
      }
      var clickActionFunctionName = data.clickAction;
      console.log(
        "in button, clickActionFunctionName: " + clickActionFunctionName
      );
      var clickActionFunction = window[clickActionFunctionName];
      if (typeof clickActionFunction === "function") clickActionFunction();
    });
  },
  setActiveState: function(activeState) {
    console.log("in setActiveState function");
    this.toggle = activeState;
    if (!activeState) {
      playIcon.setAttribute("visible", "false");
      pauseIcon.setAttribute("visible", "true");
    } else {
      playIcon.setAttribute("visible", "true");
      pauseIcon.setAttribute("visible", "false");
    }
  }
});

// GUI  reloadbutton component
AFRAME.registerComponent("reload_btn", {
  multiple: true,
  schema: {
    on: { default: "click" },
    clickAction: { type: "string" },
    borderColor: { type: "string", default: "#fc00e9" },
    borderInner: { type: "number", default: 0.11 },
    borderOuter: { type: "number", default: 0.12 }
  },
  init: function() {
    var data = this.data;
    var el = this.el;

    var rEntity = document.createElement("a-entity");
    rEntity.setAttribute(
      "geometry",
      `primitive:ring; radiusInner:${data.borderInner}; radiusOuter:${data.borderOuter}`
    );
    rEntity.setAttribute(
      "material",
      `shader: flat; opacity:1; color:${data.borderColor};`
    );
    rEntity.setAttribute("position", "0 0 0");
    el.appendChild(rEntity);

    var bEntity = document.createElement("a-entity");
    bEntity.setAttribute(
      "geometry",
      `primitive: circle; radius:${data.borderInner - 0.01};`
    );
    bEntity.setAttribute("material", `shader: flat; color:#000;opacity:0.5;`);
    bEntity.setAttribute("position", "0 0 0");
    el.appendChild(bEntity);

    var reloadIcon = document.createElement("a-entity");
    reloadIcon.setAttribute(
      "geometry",
      `primitive: ring; radiusInner: 0.04; radiusOuter: 0.055; thetaLength: 285; thetaStart: 90`
    );
    reloadIcon.setAttribute("material", `shader: flat; color:#fff;`);
    reloadIcon.setAttribute("rotation", "0 0 -43");
    reloadIcon.setAttribute("position", "0 0 0.001");
    reloadIcon.setAttribute(
      "animation__rotate",
      `property: rotation.z; from: -43; to: -403; dur:300; startEvents:triggered;`
    );
    bEntity.appendChild(reloadIcon);
    this.reloadIcon = reloadIcon;

    var arrow = document.createElement("a-entity");
    arrow.setAttribute(
      "geometry",
      `primitive:triangle;vertexA:0 0.025 0;vertexB:0 -0.025 0;vertexC:0.025 0 0`
    );
    arrow.setAttribute("material", `shader: flat; color:#fff;`);
    arrow.setAttribute("position", "0 0.0475 0");
    reloadIcon.appendChild(arrow);

    var hoverEntity = document.createElement("a-entity");
    hoverEntity.setAttribute(
      "geometry",
      `primitive: plane; height: ${data.borderOuter * 2 +
        0.02}; width: ${data.borderOuter * 2 + 0.02};`
    );
    hoverEntity.setAttribute(
      "material",
      `shader: flat; transparent: true; opacity: 0; color:#fff;`
    );
    hoverEntity.setAttribute("position", "0 0 0.01");
    el.appendChild(hoverEntity);

    el.addEventListener("mouseenter", function() {
      bEntity.removeAttribute("animation__leave");
      rEntity.removeAttribute("animation__leave2");
      bEntity.setAttribute(
        "animation__enter",
        `property: material.opacity; from: 0.5; to:0.75; dur:300;`
      );
      rEntity.setAttribute(
        "animation__enter2",
        `property: geometry.radiusOuter; from:${
          data.borderOuter
        }; to:${data.borderOuter + 0.01}; dur:300;`
      );
    });
    el.addEventListener("mouseleave", function() {
      bEntity.removeAttribute("animation__enter");
      rEntity.removeAttribute("animation__enter2");
      bEntity.setAttribute(
        "animation__leave",
        `property: material.opacity; from: 0.75; to:0.5; dur:300; easing: easeOutQuad;`
      );
      rEntity.setAttribute(
        "animation__leave2",
        `property: geometry.radiusOuter; from: ${data.borderOuter + 0.01}; to:${
          data.borderOuter
        }; dur:300; easing: easeOutQuad;`
      );
    });
    el.addEventListener(data.on, function() {
      reloadIcon.emit("triggered");

      var clickActionFunctionName = data.clickAction;
      console.log(
        "in button, clickActionFunctionName: " + clickActionFunctionName
      );
      var clickActionFunction = window[clickActionFunctionName];
      if (typeof clickActionFunction === "function") clickActionFunction();
    });
  }
});

// GUI audiobar component
AFRAME.registerComponent("audio_bar", {
  schema: {
    vol: { type: "number", default: 0.5 },
    borderColor: { type: "string", default: "#fc00e9" }
  },
  init: function() {
    var data = this.data;
    var el = this.el;
    var b1 = document.createElement("a-entity");
    b1.setAttribute("geometry", `primitive:plane; width:0.35; height:0.01`);
    b1.setAttribute("material", `shader: flat; color:${data.borderColor};`);
    b1.setAttribute("position", "0 -0.1 0");
    el.appendChild(b1);
    var b2 = document.createElement("a-entity");
    b2.setAttribute("geometry", `primitive:plane; width:0.35; height:0.01`);
    b2.setAttribute("material", `shader: flat; color:${data.borderColor};`);
    b2.setAttribute("position", "0 0.1 0");
    el.appendChild(b2);
    var b3 = document.createElement("a-entity");
    b3.setAttribute("geometry", `primitive:plane; width:0.01; height:0.2`);
    b3.setAttribute("material", `shader: flat; color:${data.borderColor};`);
    b3.setAttribute("position", "-0.155 0 0");
    el.appendChild(b3);
    var b4 = document.createElement("a-entity");
    b4.setAttribute("geometry", `primitive:plane; width:0.01; height:0.2`);
    b4.setAttribute("material", `shader: flat; color:${data.borderColor};`);
    b4.setAttribute("position", "0.155 0 0");
    el.appendChild(b4);
    var bars = document.createElement("a-entity");
    bars.setAttribute("geometry", `primitive:plane; width:0.28; height:0.17`);
    bars.setAttribute("material", `shader: flat; color:#000; opacity:0.5;`);
    bars.setAttribute("position", "0 0 -0.001");
    el.appendChild(bars);
    this.bars = bars;

    for (var i = 0; i < 9; i++) {
      var r = document.createElement("a-entity");
      r.setAttribute(
        "geometry",
        `primitive:plane; width:0.02; height:${0.03 + 0.015 * i}`
      );
      r.setAttribute(
        "position",
        `${-0.12 + 0.03 * i} ${-0.075 + (0.03 + 0.015 * i) / 2} 0.001`
      );
      if (i < Math.round(9 * data.vol)) {
        r.setAttribute("material", `opacity:1;shader:flat;color:#fff;`);
      } else {
        r.setAttribute("material", `opacity:0.2;shader:flat;color:#fff;`);
      }
      r.setAttribute("id", "bar_" + (i + 1));
      bars.appendChild(r);
    }
  },
  update: function(oldData) {
    var data = this.data;
    var barCount = Math.round(9 * data.vol);
    for (var i = 0; i < this.bars.children.length; i++) {
      if (i < barCount) {
        this.bars.children[i].setAttribute(
          "material",
          `opacity:1;shader:flat;color:#fff;`
        );
      } else {
        this.bars.children[i].setAttribute(
          "material",
          `opacity:0.2;shader:flat;color:#fff;`
        );
      }
    }
  }
});
// GUI audio button component
AFRAME.registerComponent("audio_btn", {
  multiple: true,
  schema: {
    on: { default: "click" },
    clickAction: { type: "string" },
    borderColor: { type: "string", default: "#fc00e9" },
    borderInner: { type: "number", default: 0.095 },
    borderOuter: { type: "number", default: 0.105 },
    thetaLength: { type: "number", default: 180 },
    thetaStart: { type: "number", default: 90 },
    xOffset: { type: "number", default: -0.0375 },
    up: { type: "boolean", default: false }
  },
  init: function() {
    var data = this.data;
    var el = this.el;
    var toggle = (this.toggle = false);

    var rEntity = document.createElement("a-entity");
    rEntity.setAttribute(
      "geometry",
      `primitive:ring; radiusInner:${data.borderInner}; radiusOuter:${data.borderOuter}; thetaLength: ${data.thetaLength}; thetaStart: ${data.thetaStart}`
    );
    rEntity.setAttribute(
      "material",
      `shader: flat; opacity:1; color:${data.borderColor};`
    );
    rEntity.setAttribute("position", "0 0 0");
    el.appendChild(rEntity);

    var bEntity = document.createElement("a-entity");
    bEntity.setAttribute(
      "geometry",
      `primitive: circle; radius:${data.borderInner - 0.01}; thetaLength: ${
        data.thetaLength
      }; thetaStart: ${data.thetaStart}`
    );
    bEntity.setAttribute("material", `shader: flat; color:#000;opacity:0.5;`);
    bEntity.setAttribute("position", "0 0 0");
    el.appendChild(bEntity);

    var dashIcon = document.createElement("a-entity");
    dashIcon.setAttribute(
      "geometry",
      `primitive:plane; width:0.04; height:0.01`
    );
    dashIcon.setAttribute("material", `shader: flat; color:#fff;`);
    dashIcon.setAttribute("position", `${data.xOffset} 0 0.001`);
    bEntity.appendChild(dashIcon);
    this.dashIcon = dashIcon;

    if (data.up) {
      var plusIcon = document.createElement("a-entity");
      plusIcon.setAttribute(
        "geometry",
        `primitive:plane; width:0.01; height:0.04`
      );
      plusIcon.setAttribute("material", `shader: flat; color:#fff;`);
      plusIcon.setAttribute("position", `0 0 0`);
      dashIcon.appendChild(plusIcon);
    }

    var hoverEntity = document.createElement("a-entity");
    hoverEntity.setAttribute(
      "geometry",
      `primitive: plane; height: ${data.borderOuter * 2 +
        0.02}; width: ${data.borderOuter + 0.02};`
    );
    hoverEntity.setAttribute(
      "material",
      `shader: flat; transparent: true; opacity: 0; color:#fff;`
    );
    hoverEntity.setAttribute("position", `${data.xOffset} 0 0.01`);
    el.appendChild(hoverEntity);

    el.addEventListener("mouseenter", function() {
      bEntity.removeAttribute("animation__leave");
      rEntity.removeAttribute("animation__leave2");
      bEntity.setAttribute(
        "animation__enter",
        `property: material.opacity; from: 0.5; to:0.75; dur:300;`
      );
      rEntity.setAttribute(
        "animation__enter2",
        `property: geometry.radiusOuter; from:${
          data.borderOuter
        }; to:${data.borderOuter + 0.01}; dur:300;`
      );
    });
    el.addEventListener("mouseleave", function() {
      bEntity.removeAttribute("animation__enter");
      rEntity.removeAttribute("animation__enter2");
      bEntity.setAttribute(
        "animation__leave",
        `property: material.opacity; from: 0.75; to:0.5; dur:300; easing: easeOutQuad;`
      );
      rEntity.setAttribute(
        "animation__leave2",
        `property: geometry.radiusOuter; from: ${data.borderOuter + 0.01}; to:${
          data.borderOuter
        }; dur:300; easing: easeOutQuad;`
      );
    });
    el.addEventListener(data.on, function() {
      var clickActionFunctionName = data.clickAction;
      console.log(
        "in button, clickActionFunctionName: " + clickActionFunctionName
      );
      var clickActionFunction = window[clickActionFunctionName];
      if (typeof clickActionFunction === "function") clickActionFunction();
    });
  }
});
