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
const input_cameraRotation_y = document.createElement('input');
input_cameraRotation_y.type = 'range';
document.body.after(input_cameraRotation_y);
input_cameraRotation_y.min = '0';
input_cameraRotation_y.max = '100';
input_cameraRotation_y.value = '50';
const matrix = new Matrix4();
let d = input_cameraRotation_y.value;
input_cameraRotation_y.oninput = function () {
  //matrix.makeRotationY(Number(input_cameraRotation_y.value) * 2 * Math.PI / 10000);
  let d2;
  if (d > input_cameraRotation_y.value) {
    d2 = 40;
  } else {
    d2 = -40;
  }
  matrix.makeRotationY((d2 * 2 * Math.PI) / 10000);
  d = input_cameraRotation_y.value;
  camera.position.applyMatrix4(matrix);

  //rotation += 0.05;
  //camera.position.x = 0;
  //camera.position.y = Math.sin(Number(input_cameraRotation_y.value)) // * 500;
  //camera.position.z = Math.cos(Number(input_cameraRotation_y.value)) // * 500;

  camera.lookAt(0, 0, 0);
  input_cameraRotation_y_label.textContent =
    'Rotation y:' + Number(input_cameraRotation_y.value);
};
const input_cameraRotation_y_label = document.createElement('p');
input_cameraRotation_y_label.textContent = 'Rotation y:';
document.body.after(input_cameraRotation_y_label);

// x
const input_range_x = document.createElement('input');
input_range_x.type = 'range';
input_range_x.name = 'x';
document.body.after(input_range_x);
input_range_x.min = '0';
input_range_x.max = '5000';
input_range_x.value = '664';
input_range_x.oninput = function () {
  camera.position.x = Number(input_range_x.value) / 1000; // 0.0090;
  camera.lookAt(0, 0, 0);
  input_range_x_label.textContent = 'x:' + camera.position.x;
  //console.log(input_range_x.value);
};
const input_range_x_label = document.createElement('p');
input_range_x_label.textContent = 'x:';
document.body.after(input_range_x_label);

const newLine_1 = document.createElement('br');
document.body.after(newLine_1);

// y
const input_range_y = document.createElement('input');
input_range_y.type = 'range';
document.body.after(input_range_y);
input_range_y.min = '0';
input_range_y.max = '5000';
input_range_y.value = '2522';
input_range_y.oninput = function () {
  camera.position.y = Number(input_range_y.value) / 1000;
  camera.lookAt(0, 0, 0);
  input_range_y_label.textContent = 'y:' + camera.position.y;
  //console.log(input_range_x.value);
};
const input_range_y_label = document.createElement('p');
input_range_y_label.textContent = 'y:';
document.body.after(input_range_y_label);

const newLine_2 = document.createElement('br');
document.body.after(newLine_2);

// z
const input_range_z = document.createElement('input');
input_range_z.type = 'range';
document.body.after(input_range_z);
input_range_z.min = '-5000';
input_range_z.max = '5000';
input_range_z.value = '-3142';
input_range_z.oninput = function () {
  camera.position.z = Number(input_range_z.value) / 1000;
  camera.lookAt(0, 0, 0);
  input_range_z_label.textContent = 'z:' + Number(camera.position.z) * 1000;
  //console.log(input_range_x.value);
};
const input_range_z_label = document.createElement('p');
input_range_z_label.textContent = 'z:';
document.body.after(input_range_z_label);

// создание канваса
const canvas_new = document.createElement('canvas');
canvas_new.id = 'CursorLayer';
canvas_new.width = 1000;
canvas_new.height = 700;
canvas_new.style.color = 'green';
canvas_new.style.zIndex = '8';
canvas_new.style.position = 'absolute';
canvas_new.style.border = '1px solid';
document.body.append(canvas_new);
//document.body.appendChild(canvas_new);

const ctx = canvas_new.getContext('2d');
ctx!.font = '30px Arial';
ctx!.fillStyle = '#4E4E4E';
ctx!.fillText('Room Creator', 10, 50);

//////////////////////////////////////
// three js //////////////////////////

// базовые значения:
// цвета
const background_color = 0xcdcdce;
const gridPanel_color = 0xdddfe0;
const cube_1_color = 0x93c47d;
const cube_2_color = 0x6fa8dc;
//const cube_3_color          = 0x8E7CC3;
const cellSelect_Cube_color = 0xbdbdbd; //0x979797
//const cubeCreated_color     = 0x6FA8DC;

// размеры
const room_wall_A_size = 3; // длина первой стены команты
const room_wall_B_size = 3; // длина второй стены команты
const room_cell_count = 10; // кол-во ячеек
const room_cell_size = room_wall_A_size / room_cell_count; // размер одной ячейки
/*
if (room_wallSize_A < room_wallSize_B) { const room_cellSize = room_wallSize_A / room_cell_count;}
else { const room_cellSize = room_wallSize_B / room_cell_count; }
*/

//const isShiftDown = false;
const objects: Object3D[] = [];

const renderer = new WebGLRenderer(); //{ antialias: true }
//const canvas = renderer.domElement;
let widthCanvas = canvas_new.width;
let heightCanvas = canvas_new.height;
renderer.setSize(widthCanvas, heightCanvas); //window.innerWidth, window.innerHeight
renderer.setClearColor(new Color(background_color)); //0xddeedd  //0xd5ead5
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
  Number(input_range_x.value) / 1000,
  Number(input_range_y.value) / 1000,
  Number(input_range_z.value) / 1000
);
//camera.position.x = 0.0090;//camera.position.y = 0.0190;//camera.position.z = 0.003;
camera.lookAt(0, 0, 0);

// кубы-инструменты
const geometry_1 = new BoxGeometry(
  room_cell_size,
  room_cell_size,
  room_cell_size
);
const material_1 = new MeshPhongMaterial({
  //  MeshPhongMaterial MeshLambertMaterial
  color: cube_1_color,
  shininess: 0,
});
const cube_1 = new Mesh(geometry_1, material_1);
cube_1.position.x = -(room_wall_A_size / 2 + 0.5);
cube_1.position.y = 0.0;
cube_1.position.z = room_wall_A_size / 4;
cube_1.name = 'cube_1';
scene.add(cube_1);

const geometry_2 = new BoxGeometry(
  room_cell_size,
  room_cell_size,
  room_cell_size
);
const material_2 = new MeshPhongMaterial({
  color: cube_2_color,
  //specular: 0xbcbcbc,
  shininess: 0,
});
const cube_2 = new Mesh(geometry_2, material_2);
cube_2.position.x = -(room_wall_A_size / 2 + 0.5);
cube_2.position.y = 0.0;
cube_2.position.z = room_wall_A_size / 2;
cube_2.name = 'cube_2';
scene.add(cube_2);
//const plane = new Mesh(geometry, new MeshBasicMaterial({ visible: false }));
//scene.add(plane);
objects.push(cube_1);
objects.push(cube_2);

// подписи к кубам
const textCube_1 = canvas_new.getContext('2d');
textCube_1!.font = '15px Arial';
textCube_1!.fillStyle = '#4E4E4E';

// grid
const gridHelper = new GridHelper(room_wall_A_size, room_cell_count);
gridHelper.position.y = 0.002;
scene.add(gridHelper);

const geometry = new PlaneBufferGeometry(room_wall_A_size, room_wall_B_size);
geometry.rotateX(-Math.PI / 2);
const plane = new Mesh(
  geometry,
  new MeshBasicMaterial({ color: gridPanel_color })
); //({ visible: false }));
plane.name = 'plane';
scene.add(plane);

objects.push(plane);

// куб-выделение клетки
const cubeCellSelectGeo = new BoxBufferGeometry(
  room_cell_size,
  room_cell_size,
  room_cell_size
);
const cubeCellSelectMaterial = new MeshBasicMaterial({
  color: cellSelect_Cube_color,
  opacity: 0.5,
  transparent: true,
});
const cubeCellMesh = new Mesh(cubeCellSelectGeo, cubeCellSelectMaterial);
scene.add(cubeCellMesh);

// создаваемый куб
const cubeGeo = new BoxGeometry(room_cell_size, room_cell_size, room_cell_size);
const cubeMaterial = new MeshPhongMaterial({
  //color: cube_2_color,
  shininess: 0,
});

const raycaster = new Raycaster();
const mouse = new Vector2();
let fl_mouseOnCube = 0;
let fl_SelectCube = 0;

canvas_new.addEventListener('mousemove', onDocumentMouseMove, false);
canvas_new.addEventListener('mousedown', onDocumentMouseDown, false);

function onDocumentMouseMove(event: MouseEvent) {
  event.preventDefault();

  mouse.set(
    (event.clientX / canvas_new.width) * 2 - 1, //window.innerWidth
    -(event.clientY / canvas_new.height) * 2 + 1
  );

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);

  fl_mouseOnCube = 0;

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
          .divideScalar(room_cell_size)
          .floor()
          .multiplyScalar(room_cell_size)
          .addScalar(room_cell_size / 2);
      }
      if (intersect.object.name == 'cube_1') {
        //console.log("cube_1!");
        //textCube_1!.fillText("Cube_blue",700,50);
        intersect.object.position.y = 0.1;
        fl_mouseOnCube = 1;
      }
      if (intersect.object.name == 'cube_2') {
        //console.log("cube_2!");
        //textCube_1!.fillText("Cube_green",700,50);
        intersect.object.position.y = 0.1;
        fl_mouseOnCube = 2;
      }
    }
  }

  //renderer.render(scene, camera);
  //render_();
}

function onDocumentMouseDown(event: MouseEvent) {
  event.preventDefault();

  mouse.set(
    (event.clientX / canvas_new.width) * 2 - 1, //window.innerWidth
    -(event.clientY / canvas_new.height) * 2 + 1
  );
  //console.log("mousedown!",mouse.x, mouse.y);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);

  let intersect;
  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      intersect = intersects[i];
      if (intersect.object.name == 'plane') {
        if (fl_SelectCube != 0) {
          const voxel = new Mesh(cubeGeo, cubeMaterial);
          //voxel.position.copy(intersect.point).add(intersect.face!.normal);
          voxel.position.x = intersect.point.x;
          voxel.position.y = 0.0;
          voxel.position.z = intersect.point.z;
          voxel.position
            .divideScalar(room_cell_size)
            .floor()
            .multiplyScalar(room_cell_size)
            .addScalar(room_cell_size / 2);
          scene.add(voxel);
          console.log('voxel:', voxel);
        }
      }
      if (intersect.object.name == 'cube_1') {
        fl_SelectCube = 1;
        cubeMaterial.color = new Color(cube_1_color);
        console.log('cube_1:', cubeMaterial.color);
      }
      if (intersect.object.name == 'cube_2') {
        fl_SelectCube = 2;
        cubeMaterial.color = new Color(cube_2_color);
        console.log('cube_2:', cubeMaterial.color);
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
  if (widthCanvas != canvas_new.width || heightCanvas != canvas_new.height) {
    widthCanvas = canvas_new.width;
    heightCanvas = canvas_new.height;

    camera.aspect = widthCanvas / heightCanvas;
    camera.updateProjectionMatrix();
    renderer.setSize(widthCanvas, heightCanvas);
  }

  // вращение кубов

  if (fl_mouseOnCube == 1) {
    cube_1.rotation.x += 0.01;
    cube_1.rotation.y += 0.01;
  }
  if (fl_mouseOnCube == 2) {
    cube_2.rotation.x += 0.01;
    cube_2.rotation.y += 0.01;
  }

  if (cube_1.position.y > 0.0 && fl_mouseOnCube != 1) {
    cube_1.position.y = cube_1.position.y - 0.01;
    cube_1.rotation.x = 0.0;
    cube_1.rotation.y = 0.0;
  }
  if (cube_2.position.y > 0.0 && fl_mouseOnCube != 2) {
    cube_2.position.y = cube_2.position.y - 0.01;
    cube_2.rotation.x = 0.0;
    cube_2.rotation.y = 0.0;
  }

  //camera.position.x += 0.0001;
  //camera.position.y += 0.0001;
  //camera.position.z += 0.0001;
  //console.log ("camera.position = ",camera.position.x,camera.position.y,camera.position.z);
  //camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
render_();
