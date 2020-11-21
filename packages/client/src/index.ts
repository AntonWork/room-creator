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
  Vector2,
  Camera,
} from 'three';

///import { createRenderer, resizeRenderer } from '../util';

const scene = new Scene();
const spotLight = new PointLight(0xddeedd);
spotLight.position.set(1000, 1000, 1000);
scene.add(spotLight);
const spotLight2 = new SpotLight(0xddeedd);
spotLight2.position.set(400, 100, 100);
//scene.add(spotLight2);

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(new Color(0xd5ead5));
//const renderer = createRenderer();

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

/*
console.log(renderer);
console.log(scene);
console.log(camera);
console.log(geometry);
console.log(material);
console.log(cube);
*/

function render_() {
  requestAnimationFrame(render_);
  //resizeRenderer(renderer, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
render_();

///
export function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);
  renderer.setClearColor(new Color('white'));
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  renderer.render(new Scene(), new Camera());

  return renderer;
}

const sizeMap = new WeakMap<WebGLRenderer, Vector2>();

export function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
  const canvas = renderer.domElement;
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;

  let size = sizeMap.get(renderer);
  if (size === undefined) {
    size = new Vector2();
    sizeMap.set(renderer, size);
  }
  const newSizeX = width * window.devicePixelRatio;
  const newSizeY = height * window.devicePixelRatio;

  const needResize = newSizeX !== size.x || newSizeY !== size.y;
  if (needResize) {
    size.x = newSizeX;
    size.y = newSizeY;
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export function resizePerspectiveCamera(
  renderer: WebGLRenderer,
  camera: PerspectiveCamera
) {
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

export function resizeRenderer(
  renderer: WebGLRenderer,
  camera: PerspectiveCamera
) {
  if (resizeRendererToDisplaySize(renderer)) {
    resizePerspectiveCamera(renderer, camera);
    return true;
  }
  return false;
}
