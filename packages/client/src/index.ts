import {
  Object3D,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  //Camera,
  BoxGeometry,
  BoxBufferGeometry,
  PlaneBufferGeometry,
  //MeshLambertMaterial,
  //TextureLoader,
  GridHelper,
  MeshBasicMaterial,
  //MeshNormalMaterial,
  MeshPhongMaterial,
  //MeshLambertMaterial,
  Mesh,
  Color,
  //SpotLight,
  //PointLight,
  AmbientLight,
  DirectionalLight,
  Raycaster,
  Vector2,
  Matrix4,
  //  Texture,
  //
  //Intersection,
  //Face3,
} from 'three';

import jss from 'jss';
import preset from 'jss-preset-default';
import reset from './styles/reset';

jss.setup(preset());
jss.createStyleSheet(reset).attach();

//////////////////////////////////////
// html интерфейс ////////////////////

// ползунки
// поворот камеры вокруг
const inputCameraRotationY = document.createElement('input');
inputCameraRotationY.type = 'range';
document.body.after(inputCameraRotationY);
inputCameraRotationY.min = '0';
inputCameraRotationY.max = '100';
inputCameraRotationY.value = '50';
const matrix = new Matrix4();
let d = inputCameraRotationY.value;
inputCameraRotationY.oninput = () => {
  //matrix.makeRotationY(Number(inputCameraRotationY.value) * 2 * Math.PI / 10000);
  let d2;
  if (d > inputCameraRotationY.value) {
    d2 = 40;
  } else {
    d2 = -40;
  }
  matrix.makeRotationY((d2 * 2 * Math.PI) / 10000);
  d = inputCameraRotationY.value;
  camera.position.applyMatrix4(matrix);

  //rotation += 0.05;
  //camera.position.x = 0;
  //camera.position.y = Math.sin(Number(inputCameraRotationY.value)) // * 500;
  //camera.position.z = Math.cos(Number(inputCameraRotationY.value)) // * 500;

  camera.lookAt(0, 0, 0);
  inputCameraRotationYLabel.textContent =
    'Rotation y:' + Number(inputCameraRotationY.value);
};
const inputCameraRotationYLabel = document.createElement('p');
inputCameraRotationYLabel.textContent = 'Rotation y:';
document.body.after(inputCameraRotationYLabel);

// x
const inputRangeX = document.createElement('input');
inputRangeX.type = 'range';
inputRangeX.name = 'x';
document.body.after(inputRangeX);
inputRangeX.min = '0';
inputRangeX.max = '5000';
inputRangeX.value = '664';
inputRangeX.oninput = () => {
  camera.position.x = Number(inputRangeX.value) / 1000; // 0.0090;
  camera.lookAt(0, 0, 0);
  inputRangeXLabel.textContent = 'x:' + camera.position.x;
  //console.log(inputRangeX.value);
};
const inputRangeXLabel = document.createElement('p');
inputRangeXLabel.textContent = 'x:';
document.body.after(inputRangeXLabel);

const newLine1 = document.createElement('br');
document.body.after(newLine1);

// y
const inputRangeY = document.createElement('input');
inputRangeY.type = 'range';
document.body.after(inputRangeY);
inputRangeY.min = '0';
inputRangeY.max = '5000';
inputRangeY.value = '2522';
inputRangeY.oninput = () => {
  camera.position.y = Number(inputRangeY.value) / 1000;
  camera.lookAt(0, 0, 0);
  inputRangeYLabel.textContent = 'y:' + camera.position.y;
  //console.log(inputRangeX.value);
};
const inputRangeYLabel = document.createElement('p');
inputRangeYLabel.textContent = 'y:';
document.body.after(inputRangeYLabel);

const newLine2 = document.createElement('br');
document.body.after(newLine2);

// z
const inputRangeZ = document.createElement('input');
inputRangeZ.type = 'range';
document.body.after(inputRangeZ);
inputRangeZ.min = '-5000';
inputRangeZ.max = '5000';
inputRangeZ.value = '-3142';
inputRangeZ.oninput = () => {
  camera.position.z = Number(inputRangeZ.value) / 1000;
  camera.lookAt(0, 0, 0);
  inputRangeZLabel.textContent = 'z:' + Number(camera.position.z) * 1000;
  //console.log(inputRangeX.value);
};
const inputRangeZLabel = document.createElement('p');
inputRangeZLabel.textContent = 'z:';
document.body.after(inputRangeZLabel);

// создание канваса
const canvasNew = document.createElement('canvas');
canvasNew.id = 'CursorLayer';
canvasNew.width = 1000;
canvasNew.height = 700;
canvasNew.style.color = 'green';
canvasNew.style.zIndex = '8';
canvasNew.style.position = 'absolute';
canvasNew.style.border = '1px solid';
document.body.append(canvasNew);
//document.body.appendChild(canvasNew);

const ctx = canvasNew.getContext('2d');
ctx!.font = '30px Arial';
ctx!.fillStyle = '#4E4E4E';
ctx!.fillText('Room Creator', 10, 50);

//////////////////////////////////////
// three js //////////////////////////

// базовые значения:
// цвета
const backgroundColor = 0xcdcdce;
const gridPanelColor = 0xdddfe0;
const cube1color = new Color(0x93c47d);
const cube2color = new Color(0x6fa8dc);
let cubeColor: Color;
//const cube_3_color          = 0x8E7CC3;
const cellSelectCubeColor = 0xbdbdbd; //0x979797
//const cubeCreated_color     = 0x6FA8DC;

// размеры
const roomWallAsize = 3; // длина первой стены команты
const roomWallBSize = 3; // длина второй стены команты
const roomCellCount = 10; // кол-во ячеек
const roomCellSize = roomWallAsize / roomCellCount; // размер одной ячейки
/*
if (room_wallSize_A < room_wallSize_B) { const room_cellSize = room_wallSize_A / roomCellCount;}
else { const room_cellSize = room_wallSize_B / roomCellCount; }
*/

//const isShiftDown = false;
const objects: Object3D[] = [];

const renderer = new WebGLRenderer(); //{ antialias: true }
//const canvas = renderer.domElement;
let widthCanvas = canvasNew.width;
let heightCanvas = canvasNew.height;
renderer.setSize(widthCanvas, heightCanvas); //window.innerWidth, window.innerHeight
renderer.setClearColor(new Color(backgroundColor)); //0xddeedd  //0xd5ead5
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
//scene.background = new Color(0xf0f0f0);

const spotLight = new DirectionalLight(0xddeedd);
spotLight.intensity = 1.2;
//spotLight.position.set(800, 800, 800);
scene.add(spotLight);

const spotLight2 = new AmbientLight(0xddeedd);
spotLight2.intensity = 0.1;
spotLight.position.set(5, 6, -7);
scene.add(spotLight2);
//const spotLight2 = new AmbientLight(0xddeedd);
//spotLight2.intensity = 0.1;
//spotLight.position.set(1, 5, -5);
//scene.add(spotLight2);

const camera = new PerspectiveCamera(
  45,
  widthCanvas / heightCanvas, //window.innerWidth / window.innerHeight,
  0.01,
  20
);
camera.position.set(
  Number(inputRangeX.value) / 1000,
  Number(inputRangeY.value) / 1000,
  Number(inputRangeZ.value) / 1000
);
//camera.position.x = 0.0090;//camera.position.y = 0.0190;//camera.position.z = 0.003;
camera.lookAt(0, 0, 0);

// кубы-инструменты
const geometry1 = new BoxGeometry(roomCellSize, roomCellSize, roomCellSize);
const material1 = new MeshPhongMaterial({
  //  MeshPhongMaterial MeshLambertMaterial
  color: cube1color,
  shininess: 0,
});
const cube1 = new Mesh(geometry1, material1);
cube1.position.x = -(roomWallAsize / 2 + 0.5);
cube1.position.y = 0.0;
cube1.position.z = roomWallAsize / 4;
cube1.name = 'cube1';
scene.add(cube1);

const geometry2 = new BoxGeometry(roomCellSize, roomCellSize, roomCellSize);
const material2 = new MeshPhongMaterial({
  color: cube2color,
  //specular: 0xbcbcbc,
  shininess: 0,
});
const cube2 = new Mesh(geometry2, material2);
cube2.position.x = -(roomWallAsize / 2 + 0.5);
cube2.position.y = 0.0;
cube2.position.z = roomWallAsize / 2;
cube2.name = 'cube2';
scene.add(cube2);
//const plane = new Mesh(geometry, new MeshBasicMaterial({ visible: false }));
//scene.add(plane);
objects.push(cube1);
objects.push(cube2);

// подписи к кубам
const textCube1 = canvasNew.getContext('2d');
textCube1!.font = '15px Arial';
textCube1!.fillStyle = '#4E4E4E';

// grid
const gridHelper = new GridHelper(roomWallAsize, roomCellCount);
gridHelper.position.y = 0.002;
scene.add(gridHelper);

const geometry = new PlaneBufferGeometry(roomWallAsize, roomWallBSize);
geometry.rotateX(-Math.PI / 2);
const plane = new Mesh(
  geometry,
  new MeshBasicMaterial({ color: gridPanelColor })
); //({ visible: false }));
plane.name = 'plane';
scene.add(plane);

objects.push(plane);

// куб-выделение клетки
const cubeCellSelectGeo = new BoxBufferGeometry(
  roomCellSize,
  roomCellSize,
  roomCellSize
);
const cubeCellSelectMaterial = new MeshBasicMaterial({
  color: cellSelectCubeColor,
  opacity: 0.5,
  transparent: true,
});
const cubeCellMesh = new Mesh(cubeCellSelectGeo, cubeCellSelectMaterial);
scene.add(cubeCellMesh);

// создаваемый куб
const cubeGeo = new BoxGeometry(roomCellSize, roomCellSize, roomCellSize);

const raycaster = new Raycaster();
const mouse = new Vector2();
let flMouseOnCube = 0;
let flSelectCube = 0;

canvasNew.addEventListener('mousemove', onDocumentMouseMove, false);
canvasNew.addEventListener('mousedown', onDocumentMouseDown, false);

function onDocumentMouseMove(event: MouseEvent) {
  event.preventDefault();

  mouse.set(
    (event.clientX / canvasNew.width) * 2 - 1, //window.innerWidth
    -(event.clientY / canvasNew.height) * 2 + 1
  );

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);

  flMouseOnCube = 0;

  //console.log("intersects = ", intersects);
  let intersect;
  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      intersect = intersects[i];
      //console.log("intersect = ", intersect);
      if (intersect.object.name == 'plane') {
        //console.log("plane!");
        //cubeCellMesh.position.copy(intersect.point).add(intersect.face!.normal);
        cubeCellMesh.position.x = intersect.point.x;
        cubeCellMesh.position.y = 0.0; // intersect.point.y;
        cubeCellMesh.position.z = intersect.point.z;
        //console.log("cubeCellMesh position = ", cubeCellMesh.position);
        cubeCellMesh.position
          .divideScalar(roomCellSize)
          .floor()
          .multiplyScalar(roomCellSize)
          .addScalar(roomCellSize / 2);
      }
      if (intersect.object.name == 'cube1') {
        //console.log("cube1!");
        //textCube1!.fillText("Cube_blue",700,50);
        intersect.object.position.y = 0.1;
        flMouseOnCube = 1;
      }
      if (intersect.object.name == 'cube2') {
        //console.log("cube2!");
        //textCube1!.fillText("Cube_green",700,50);
        intersect.object.position.y = 0.1;
        flMouseOnCube = 2;
      }
    }
  }

  //renderer.render(scene, camera);
  //render_();
}

function onDocumentMouseDown(event: MouseEvent) {
  event.preventDefault();

  mouse.set(
    (event.clientX / canvasNew.width) * 2 - 1, //window.innerWidth
    -(event.clientY / canvasNew.height) * 2 + 1
  );
  //console.log("mousedown!",mouse.x, mouse.y);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);

  let intersect;
  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      intersect = intersects[i];
      if (intersect.object.name == 'plane') {
        if (flSelectCube != 0) {
          const voxel = new Mesh(
            cubeGeo,
            new MeshPhongMaterial({
              color: cubeColor,
              shininess: 0,
            })
          );
          //voxel.position.copy(intersect.point).add(intersect.face!.normal);
          voxel.position.x = intersect.point.x;
          voxel.position.y = 0.0;
          voxel.position.z = intersect.point.z;
          voxel.position
            .divideScalar(roomCellSize)
            .floor()
            .multiplyScalar(roomCellSize)
            .addScalar(roomCellSize / 2);
          scene.add(voxel);
          console.log('voxel:', voxel);
        }
      }
      if (intersect.object.name == 'cube1') {
        flSelectCube = 1;
        cubeColor = new Color(cube1color);
        console.log('cube1:', cubeColor);
      }
      if (intersect.object.name == 'cube2') {
        flSelectCube = 2;
        cubeColor = new Color(cube2color);
        console.log('cube2:', cubeColor);
      }
    }

    // delete cube
    /*
    if (isShiftDown) {
      if (intersect.object !== plane) {
        scene.remove(intersect.object);

        objects.splice(objects.indexOf(intersect.object), 1);
      }

      // create cube
    } else {
      //const voxel = new Mesh(cubeGeo, cubeMaterial);
      //voxel.position.copy(intersect.point).add(intersect.face!.normal);
      //voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
      //scene.add(voxel);

      //objects.push(voxel);
    }
    */

    //render_();
  }
}

function render_() {
  // проверка на изменение размеров канваса
  requestAnimationFrame(render_);
  if (widthCanvas != canvasNew.width || heightCanvas != canvasNew.height) {
    widthCanvas = canvasNew.width;
    heightCanvas = canvasNew.height;

    camera.aspect = widthCanvas / heightCanvas;
    camera.updateProjectionMatrix();
    renderer.setSize(widthCanvas, heightCanvas);
  }

  // вращение кубов

  if (flMouseOnCube == 1) {
    cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.01;
  }
  if (flMouseOnCube == 2) {
    cube2.rotation.x += 0.01;
    cube2.rotation.y += 0.01;
  }

  if (cube1.position.y > 0.0 && flMouseOnCube != 1) {
    cube1.position.y = cube1.position.y - 0.01;
    cube1.rotation.x = 0.0;
    cube1.rotation.y = 0.0;
  }
  if (cube2.position.y > 0.0 && flMouseOnCube != 2) {
    cube2.position.y = cube2.position.y - 0.01;
    cube2.rotation.x = 0.0;
    cube2.rotation.y = 0.0;
  }

  //camera.position.x += 0.0001;
  //camera.position.y += 0.0001;
  //camera.position.z += 0.0001;
  //console.log ("camera.position = ",camera.position.x,camera.position.y,camera.position.z);
  //camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
render_();
