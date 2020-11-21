import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  //MeshBasicMaterial,
  //MeshNormalMaterial,
  MeshPhongMaterial,
  Mesh,
  Color,
  SpotLight,
  PointLight,
} from 'three';

///import { createRenderer, resizeRenderer } from '../util';

const scene = new Scene();
const spotLight = new PointLight(0xddeedd);
spotLight.position.set(1000, 1000, 1000);
scene.add(spotLight);
const spotLight2 = new SpotLight(0xddeedd);
spotLight2.position.set(400, 100, 100);
//scene.add(spotLight2);

const camera = new PerspectiveCamera();

const renderer = new WebGLRenderer();
//const renderer = createRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(new Color(0xd5ead5));

const geometry = new BoxGeometry(10, 10, 10);
const material = new MeshPhongMaterial({
  color: 0xddeedd,
  specular: 0xbcbcbc,
});
//var material = new MeshNormalMaterial();
//var material = new MeshBasicMaterial( { color: 0xDDEEDD } );

const cube = new Mesh(geometry, material);
scene.add(cube);

camera.position.z = 50;

console.log(renderer);
console.log(scene);
console.log(camera);
console.log(geometry);
console.log(material);
console.log(cube);

console.log('Hello world!');

function render() {
  requestAnimationFrame(render);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
render();
