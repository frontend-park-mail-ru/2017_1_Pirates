'use strict';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

const ship = BABYLON.SceneLoader.ImportMesh('', '/models/', 'starship.obj', scene, (newMeshes) => {});

/*const metal = new BABYLON.PBRMaterial('metal', scene);
metal.reflectionTexture = new BABYLON.CubeTexture('/static/models/starship.png', scene, 512);
metal.cameraExposure = 0.5;
metal.cameraContrast = 1.6;
metal.microSurface = 0.96;
metal.reflectivityColor = new BABYLON.Color3(0.85, 0.85, 0.85);
metal.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);
ship.material = metal;

How to make a mesh from a list of vertices and faces?
http://www.html5gamedevs.com/topic/4530-create-a-mesh-from-a-list-of-vertices-and-faces/

*/

const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

const fpsLabel = document.getElementById('fps');


engine.runRenderLoop(() => {
	scene.render();
	fpsLabel.innerHTML = `FPS: <b>${engine.getFps().toFixed()}</b>`;
});
