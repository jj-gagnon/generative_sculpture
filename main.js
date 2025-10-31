"use strict";
import * as THREE from 'three';
console.log('-----------------------------------------------------')
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';




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


    renderer.setClearColor(new THREE.Color(1, 1, 1))


    const pi = Math.PI

    let w = 1080 + 650
    let h = 1920 - 100
    let scale = 0.5
    renderer.setSize(w * scale, h * scale, true)




    const fov = 50;
    const aspect = w / h; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 50
    camera.position.y = 20
    // camera.position.x = 20



    // camera.position.x = camera.position.z / 2
    // camera.position.y = camera.position.z / 2


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, camera.position.y, 0)
    // console.log(controls.target)


    const scene = new THREE.Scene();

    {

        let color = 0xFFFFFF;
        let intensity = 3;
        let light = new THREE.DirectionalLight(color, intensity);
        light.position.set(- 1, 2, 4);
        scene.add(light);

        color = 0xFFFFFF;
        intensity = 0.2;
        let a_light = new THREE.AmbientLight(color, intensity)

        scene.add(a_light);

    }

    const axesHelper = new THREE.AxesHelper(15);
    scene.add(axesHelper)

    let box_size_x = 3
    let box_size_y = 6;
    let box_size_z = 3;

    const geometry = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z);
    // const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // greenish blue
    const material = new THREE.MeshStandardMaterial(); // greenish blue
    material.color.set(0.5, 0.5, 1)
    // material.transparent = true
    // material.opacity = 0.5

    let first_cube = new THREE.Mesh(geometry, material);

    first_cube.userData.branch_length = 1

    first_cube.geometry.translate(box_size_x / 2, box_size_y / 2, 0)



    first_cube.userData.h = 1

    const total_num_cubes = 2 ** 8
    // const total_num_cubes = 3

    let top_cubes = [first_cube]
    let cube_new;
    let cube_counter = 1
    let last_num_cubes = 0;

    let scale_factor = 1

    // let scale_x = 0.8
    // let scale_y = 0.8
    // let scale_z = 0.8

    let scale_x_y = 1.1

    let scale_x = scale_x_y
    let scale_y = scale_factor
    let scale_z = scale_x_y

    let non_branch_length =  10

    while (cube_counter < total_num_cubes) {



        let temp_top_cubes = top_cubes
        top_cubes = []

        non_branch_length -= 2

        for (let i = 0; i < temp_top_cubes.length; i++) {
            let top_cube = temp_top_cubes[i]

            

            for (let non_branch = 0; non_branch < non_branch_length; non_branch++){
            
                let geo = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z)
                let cube_new = new THREE.Mesh(geo, material)
                cube_new.position.y = box_size_y 
                cube_new.geometry.translate(box_size_x / 2, box_size_y / 2, 0)
                
                cube_new.rotation.z = Math.random() - 0.5

                

                top_cube.add(cube_new)
                top_cube = cube_new
            }

            for (let b = 0; b < 2; b++) {

                let x_rot = pi / 180 * 0
                let y_rot = pi / 180 * 30
                let z_rot = pi / 180 * 30
                // let scale = Math.sqrt(0.5 ** 2 + 0.5 ** 2) // for 45 degrees
                let scale = 1


                let geo = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z)



                // let mat = new THREE.MeshStandardMaterial(); // greenish blue
                // mat.color.set(0.5, 0.5, 1)                
                // mat.transparent = true
                // mat.opacity = 0.5
                // mat.color.set(
                // Math.random(),
                // Math.random(),
                // Math.random())

                let cube_new = new THREE.Mesh(geo, material)

                top_cube.add(cube_new)

                cube_new.position.y = box_size_y



                cube_new.geometry.translate(box_size_x / 2, box_size_y / 2, 0)



                if (b == 0) {
                    cube_new.rotation.y = y_rot
                    cube_new.rotation.x = x_rot
                } else {
                    cube_new.rotation.y = y_rot + pi
                    cube_new.position.x = box_size_x
                    cube_new.rotation.x = x_rot * -1


                }

                cube_new.rotation.z = z_rot

                // cube_new.scale.setScalar(scale)



                let coord = new THREE.AxesHelper(15);
                // cube_new.add(coord)


                //  if (cube_counter == 6) {
                // box_size_x /= 2
                // box_size_y /= 2
                // box_size_z /= 2
                // }
                cube_new.scale.setScalar(0.9)
                top_cubes.push(cube_new)
                cube_counter = cube_counter + 1
            }

        }


    }



    scene.add(first_cube)



    resizeCanvasToDisplaySize();



    // console.log('end')

    // controls.update(0.001);

    // let a = []
    // first_cube.traverse(function (child) {
    //     if (child.parent) {
    //         child.updateMatrixWorld();
    //         child.applyMatrix4(child.parent.matrixWorld);
    //         if (child.geometry != null){
    //             a.push(child.geometry)
    //         }

    //     }

    // });
    // console.log(a)

    // let merged = THREE.BufferGeometryUtils.mergeGeometries()

    // scene.add(merged)
    // renderer.render(scene, camera)
    // return


    function render(time) {

        time *= 0.001; // convert time to seconds


        controls.update(time);
        // controls.update();

        // first_cube.traverse(function (a) {
        // let s = THREE.MathUtils.mapLinear(Math.sin(time), -1, 1, 0, 1)
        // a.rotation.z = s
        // })

        // a.scale.setScalar(Math.sin(time) / 2 + 0.5)

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


        // })
        renderer.render(scene, camera);

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
