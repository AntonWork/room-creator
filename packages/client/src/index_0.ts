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
  Raycaster,
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

const geometry = new BoxGeometry(10, 10, 1);
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

const raycaster = new Raycaster();
const mouse = new Vector2(1000, 1000);
//mouse.x = 0;
//mouse.y = 0;

// calculate mouse position in normalized device coordinates
// (-1 to +1) for both components
function onMouseMove(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //console.log("mouse:", mouse.x, mouse.y);
}

function render_() {
  requestAnimationFrame(render_);
  //cube.material.color = new Color("0xddeedd") ;
  raycaster.setFromCamera(mouse, camera); // update the picking ray with the camera and mouse position
  const intersects = raycaster.intersectObjects(scene.children); // calculate objects intersecting the picking ray

  for (let i = 0; i < intersects.length; i++) {
    //intersects[ i ].object.material.color.set( 0xff0000 );
    if (intersects.length > 0) {
      const intersection = intersects[0];
      if (intersection.object instanceof Mesh) {
        //console.log("intersects = ", intersects, "mouse:", mouse.x,mouse.y, intersects.length);
        intersection.object.material.color.set(0xff0000);
      }
    }
  }

  //resizeRenderer(renderer, camera);
  //cube.rotation.x += 0.01;
  //cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
render_();

window.addEventListener('mousemove', onMouseMove, false);

////////////////////////////////////////////////////////////
/// какие-то пока не понятные леонидовские функции
export function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);
  renderer.setClearColor(0xddeedd);
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
////////////////////////////////////////////////////////////
