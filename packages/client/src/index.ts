import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  //Camera,
  //BoxGeometry,
  BoxBufferGeometry,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial,
  TextureLoader,
  GridHelper,
  //MeshBasicMaterial,
  //MeshNormalMaterial,
  //MeshPhongMaterial,
  Mesh,
  Color,
  //SpotLight,
  //PointLight,
  AmbientLight,
  DirectionalLight,
  Vector2,
  Raycaster,
  Object3D,
  //
  //Intersection,
  //Face3,
} from 'three';

const isShiftDown = false;

const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.set(500, 800, 1300);
camera.lookAt(0, 0, 0);

const scene = new Scene();
scene.background = new Color(0xf0f0f0);

// roll-over helpers
const rollOverGeo = new BoxBufferGeometry(50, 50, 50);
const rollOverMaterial = new MeshBasicMaterial({
  color: 0xff0000,
  opacity: 0.5,
  transparent: true,
});
const rollOverMesh = new Mesh(rollOverGeo, rollOverMaterial);
scene.add(rollOverMesh);

// cubes
const cubeGeo = new BoxBufferGeometry(50, 50, 50);
const cubeMaterial = new MeshLambertMaterial({
  color: 0xfeb74c,
  map: new TextureLoader().load('textures/square-outline-textured.png'),
});

// grid
const gridHelper = new GridHelper(1000, 20);
scene.add(gridHelper);

//
const raycaster = new Raycaster();
const mouse = new Vector2();

const geometry = new PlaneBufferGeometry(1000, 1000);
geometry.rotateX(-Math.PI / 2);

const plane = new Mesh(geometry, new MeshBasicMaterial({ visible: false }));
scene.add(plane);

const objects: Object3D[] = [];
objects.push(plane);

// lights
const ambientLight = new AmbientLight(0x606060);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff);
directionalLight.position.set(1, 0.75, 0.5).normalize();
scene.add(directionalLight);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);
//document.addEventListener( 'keydown', onDocumentKeyDown, false );
//document.addEventListener( 'keyup', onDocumentKeyUp, false );

window.addEventListener('resize', onWindowResize, false);
render();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event: MouseEvent) {
  event.preventDefault();

  mouse.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(mouse, camera);

  // (!)
  // : any
  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    //if (intersect ==  null || intersect == undefined) {
    //  if ( intersect.face ==  null) {
    rollOverMesh.position.copy(intersect.point).add(intersect.face!.normal);
    //  }
    //}
    rollOverMesh.position
      .divideScalar(50)
      .floor()
      .multiplyScalar(50)
      .addScalar(25);
  }

  render();
}

function onDocumentMouseDown(event: MouseEvent) {
  event.preventDefault();

  mouse.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(mouse, camera);

  // (!)
  // : any
  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    // delete cube

    if (isShiftDown) {
      if (intersect.object !== plane) {
        scene.remove(intersect.object);

        objects.splice(objects.indexOf(intersect.object), 1);
      }

      // create cube
    } else {
      const voxel = new Mesh(cubeGeo, cubeMaterial);
      voxel.position.copy(intersect.point).add(intersect.face!.normal);
      voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
      scene.add(voxel);

      objects.push(voxel);
    }

    render();
  }
}
/*
function onDocumentKeyDown( event ) {

  switch ( event.keyCode ) {

    case 16: isShiftDown = true; break;

  }

}*/
/*
function onDocumentKeyUp( event ) {

  switch ( event.keyCode ) {

    case 16: isShiftDown = false; break;

  }

}*/

function render() {
  renderer.render(scene, camera);
}
