import { WebGLRenderer, 
         Scene, 
         PerspectiveCamera,
         BoxGeometry,
         //MeshBasicMaterial,
         //MeshNormalMaterial,
         MeshPhongMaterial,
         Mesh,
         Color,
         SpotLight,
         PointLight
        } from 'three';


///import { createRenderer, resizeRenderer } from '../util';


var scene = new Scene();
var spotLight = new PointLight(0xDDEEDD);
spotLight.position.set(1000, 1000, 1000);
scene.add(spotLight);
var spotLight2 = new SpotLight(0xDDEEDD);
spotLight2.position.set( 400, 100, 100);
//scene.add(spotLight2);

var camera = new PerspectiveCamera();

const renderer = new WebGLRenderer();
//const renderer = createRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setClearColor(new Color(0xD5EAD5));

var geometry = new BoxGeometry( 10, 10, 10);
var material = new MeshPhongMaterial( {
    color: 0xDDEEDD,
    specular: 0xbcbcbc,
});
//var material = new MeshNormalMaterial();
//var material = new MeshBasicMaterial( { color: 0xDDEEDD } );

var cube = new Mesh( geometry, material );
scene.add( cube );

camera.position.z = 50;

console.log(renderer);
console.log(scene);
console.log(camera);
console.log(geometry);
console.log(material);
console.log(cube);

console.log("Hello world!");

function render() {
    requestAnimationFrame( render );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );
}
render();
