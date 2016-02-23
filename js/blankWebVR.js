// Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true,	// to get smoother output
  preserveDrawingBuffer: true	// to allow screenshot
});
renderer.setClearColor( 0xbbbfff );

var audio = new Audio('audio/theme.mp3');
audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
audio.play();

// Append the canvas element created by the renderer to document body element.
document.body.appendChild( renderer.domElement );

//Create a three.js scene
var scene = new THREE.Scene();

//Create a three.js camera
var camera = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 2, 10000 );
scene.add(camera);

//Apply VR headset positional data to camera.
var controls = new THREE.VRControls( camera );

//Apply VR stereo rendering to renderer
var effect = new THREE.VREffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );

var light	= new THREE.AmbientLight( Math.random() * 0xffffff );
scene.add( light );
var light	= new THREE.DirectionalLight( Math.random() * 0xffffff );
light.position.set( Math.random(), Math.random(), Math.random() ).normalize();
scene.add( light );
var light	= new THREE.PointLight( Math.random() * 0xffffff );
light.position.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 )
  .normalize().multiplyScalar(1.2);
scene.add( light );
var light	= new THREE.PointLight( Math.random() * 0xffffff );
light.position.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 )
  .normalize().multiplyScalar(1.2);
scene.add( light );



/************* VR Scene *********************/

var texture = new THREE.Texture();

var textureLoader = new THREE.ImageLoader();
textureLoader.load("texture/today-logo.png", function(image){
  texture.image = image;
  texture.needsUpdate = true;
});

var loader = new THREE.OBJLoader();
loader.load( "obj/office_chair.obj", function (object) {
  object.traverse( function ( child ) {
    if (child instanceof THREE.Mesh ) {
      child.material.map = texture;
    }
  });
  object.scale.set(10,10,10);
  object.rotation.x = 0;
  object.position.z = -20;
  scene.add(object);
  for(var i = 0; i < 5000; i++){
    var chair = object.clone();
    var size = i + 10;
    chair.position.x = i % 2 ? -20 * i : 20 * i;
    chair.scale.set(size,size,size);
    scene.add(chair);
  }
});

/*
Request animation frame loop function
*/
function animate() {

  var PIseconds	= Date.now() * Math.PI;
  var newCol = Math.round(PIseconds) % 2 ? 0xbbbff0 : 0xfffbb0;

  //Update VR headset position and apply to camera.
  controls.update();

  scene.traverse(function(object3d, i){
  if( object3d instanceof THREE.Mesh === false )	return
    object3d.rotation.y = PIseconds*0.001 * (i % 3 ? .4 : -.4);
    object3d.rotation.x = PIseconds*0.0002 * (i % 2 ? .4 : -.4);
  })
  renderer.setClearColor( newCol );


  // Render the scene through the VREffect.
  effect.render( scene, camera );
  requestAnimationFrame( animate );
}

animate();	// Kick off animation loop

/*
Listen for click event to enter full-screen mode.
We listen for single click because that works best for mobile for now
*/
document.body.addEventListener( 'click', function(){
  effect.setFullScreen( true );
})

/*
Listen for keyboard events
*/
function onkey(event) {
  event.preventDefault();

  if (event.keyCode == 90) { // z
    controls.resetSensor(); //zero rotation
  } else if (event.keyCode == 70 || event.keyCode == 13) { //f or enter
    effect.setFullScreen(true) //fullscreen
  }
};
window.addEventListener("keydown", onkey, true);

/*
Handle window resizes
*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );
