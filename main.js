"use strict";
import * as THREE from 'three';
console.log('-----------------------------------------------------')
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld = false) {

    if (pointIsWorld) {
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if (pointIsWorld) {
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}



function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}


function main() {


    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer(
        {
            canvas: document.querySelector("canvas"),
            antialias: true,
            preserveDrawingBuffer: true

        });

    // renderer.autoClear = false
    // renderer.autoClearColor = false
    // renderer.setClearAlpha(0.5)
    renderer.setClearColor(new THREE.Color(1, 1, 1))



    const pi = Math.PI
    // let w = Math.floor(1920 / 2.15)
    // let h = 1080 - 170
    let w = 1080 + 650
    let h = 1920 - 100
    // let scale = 0.5
    // renderer.setSize(w * scale, h * scale, true)
    // renderer.setClearColor(new THREE.Color(1, 1, 1))


    const fov = 75;
    const aspect = w / h; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 200
    camera.position.x = camera.position.z / 2
    camera.position.y = camera.position.z / 2






    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 100, 0)



    const scene = new THREE.Scene();

    {

        let color = 0xFFFFFF;
        let intensity = 3;
        let light = new THREE.DirectionalLight(color, intensity);
        // const light = new THREE.AmbientLight(color, intensity)
        light.position.set(- 1, 2, 4);
        scene.add(light);

        color = 0xFFFFFF;
        intensity = 0.2;
        //  light = new THREE.DirectionalLight( color, intensity );
        let a_light = new THREE.AmbientLight(color, intensity)

        // light.position.set( - 1, 2, 4 );
        scene.add(a_light);

    }

    const axesHelper = new THREE.AxesHelper(15);
    scene.add(axesHelper)

    const box_size_x = 1;
    const box_size_y = 25;
    const box_size_z = 1;

    const geometry = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z);
    // geometry.computeVertexNormals()
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // greenish blue

    let first_cube = new THREE.Mesh(geometry, material);

    first_cube.userData.branch_length = 1
    // first_cube.position.y += box_size_y/2
    // first_cube.translateY(20)
    first_cube.geometry.translate(0, box_size_y / 2, 0)



    // first_cube.translateY(5)
    // let second = first_cube.clone()
    // second.position.y += box_size_y + 1
    // first_cube.add(second)

    // let pivot = new THREE.Vector3(0, 0, 0)
    // let axis = new THREE.Vector3(0, 0, 1)

    // rotateAboutPoint(second, pivot, axis, 1, false)




    // scene.add(first_cube)
    // renderer.render(scene, camera)
    // return

    first_cube.userData.h = 1
    // const total_num_cubes = 1000 * 4
    const total_num_cubes = 2**9

    let top_cubes = [first_cube]
    let cube_new;
    let cube_counter = 1
    let last_num_cubes = 0;

    while (cube_counter <= total_num_cubes) {
        if (cube_counter === last_num_cubes) {
            console.log("all branches died")
            break
        }
        last_num_cubes = cube_counter


        let temp_top_cubes = top_cubes
        top_cubes = []


        for (let i = 0; i < temp_top_cubes.length; i++) {
            let top_cube = temp_top_cubes[i]

            //reall nice
            let rot = pi / cube_counter / 4 // 4 seems special

            // also i didnt do bedmas uh as i thought i did here. 
            // let rot = pi /  (1/cube_counter*1.99999) // this is rediculously sensistive
            // 
            //this is oddly homeogenous 
            // let rot = cube_counter

            // let rot = pi / cube_counter / 4 // 4 seems special

            cube_new = top_cube.clone(false)
            cube_new.position.y = box_size_y
            cube_new.userData.h = cube_counter
            top_cube.add(cube_new)

            // cube_new.rotation.z = rot
            // cube_new.rotation.y += rot * 
            // cube_new.rotation.y -= rot * 
            // cube_new.rotation.y += rot + 10
            cube_new.rotation.x += pi /12
            // cube_new.rotation.y = pi * 0.001



            top_cubes.push(cube_new)
            cube_counter = cube_counter + 1



            // continue
            let branch_cube = top_cube.clone(false)
            branch_cube.userData.h = cube_counter
            branch_cube.material = new THREE.MeshPhongMaterial(); // greenish blue
            branch_cube.material.color.set(
                Math.random(),
                Math.random(),
                Math.random())


            branch_cube.position.y = box_size_y

            branch_cube.rotation.z = rot * -4
            // branch_cube.rotation.y -= rot * 2
            branch_cube.rotation.y = pi / 4
            // branch_cube.rotation.y += rot

            // branch_cube.rotation.z = rot * 1

            top_cube.add(branch_cube)
            top_cubes.push(branch_cube)

            cube_counter = cube_counter + 1





        }


    }
    console.log("done")
    console.log(cube_counter)


    scene.add(first_cube)

    // let circle = 
    // return





    resizeCanvasToDisplaySize();

    function render(time) {

        time *= 0.001; // convert time to seconds
        renderer.render(scene, camera);

        controls.update(time);
        controls.update();

        first_cube.traverse(function (a) {


            // a.rotation.x = time * a.userData.h * 0.01
            // a.rotation.x = (time + (800/a.userData.h)) * 0.5

            // a.rotation.z = time * 0.1
            // a.rotation.z = Math.sin(time * (1 + a.userData.h/800) *0.1 ) * 2

            // a.rotation.z = Math.sin(a.userData.h* 0.1)
            // console.log(a.userData.h)


            // a.rotation.z = Math.sin(time) * 0.5  
            // a.rotation.y = Math.sin(time* 0.5) * 2  + 0.7
            // a.rotation.x = Math.sin(a.userData.h)



            // a.rotation.y = time 
            // a.rotateY(0.0001)
            // a.rotation.z = time * 0.1
            // a.rotation.z += 0.01


        })


        requestAnimationFrame(render);



    }

    requestAnimationFrame(render);











    function resizeCanvasToDisplaySize() {
        const canvas = renderer.domElement;
        // look up the size the canvas is being displayed
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        // adjust displayBuffer size to match
        if (canvas.width !== width || canvas.height !== height) {
            // you must pass false here or three.js sadly fights the browser
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            // update any render target sizes here
        }
    }

}

main();
