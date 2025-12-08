"use strict";
import * as THREE from 'three';
console.log('-----------------------------------------------------')
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm';

import SpriteText from "https://esm.sh/three-spritetext?external=three";



function main() {

    const gui = new GUI({ width: 700 });
    gui.add(document, 'title');

    let gui_obj = {


        y_multiply: 1.0,
        y_exponent: 1.0,
        y_add: 0,
        z_multiply: 1.0,
        z_exponent: 1.0,
        z_add: 0


    }

    const pi = Math.PI

    gui.add(gui_obj, 'y_multiply', 1, 10);
    gui.add(gui_obj, 'y_exponent', -10, 10);
    gui.add(gui_obj, 'y_add', -2 * pi, pi * 2);
    gui.add(gui_obj, 'z_multiply', 1, 10);
    gui.add(gui_obj, 'z_exponent', -10, 10);
    gui.add(gui_obj, 'z_add', -2 * pi, pi * 2);

    gui.close()



    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer(
        {
            canvas: document.querySelector("canvas"),
            antialias: true,
            // preserveDrawingBuffer: true

        });


    renderer.setClearColor(new THREE.Color(1, 1, 1))


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




    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, camera.position.y, 0)



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

    let box_size_x = 1
    let box_size_y = 6;
    let box_size_z = 1;

    const geometry = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z);
    const material = new THREE.MeshStandardMaterial(); // greenish blue
    material.color.set(0.5, 0.5, 1)
    material.transparent = true
    material.opacity = 0.5

    let first_cube = new THREE.Mesh(geometry, material);



    first_cube.geometry.translate(box_size_x / 2, box_size_y / 2, 0)


    const total_num_cubes = 2 ** 6

    let top_cubes = [first_cube]
    let cube_counter = 0


    let layer_counter = 0
    first_cube.userData.layer = layer_counter
    layer_counter++
    
    first_cube.userData.cube_counter_i = 0
    cube_counter++
    



    while (cube_counter < total_num_cubes) {


        let temp_top_cubes = top_cubes
        top_cubes = []


        for (let i = 0; i < temp_top_cubes.length; i++) {

            let top_cube = temp_top_cubes[i]


            let g = new THREE.Group()
            let s
            // s = THREE.MathUtils.mapLinear(i, 0, temp_top_cubes.length, Math.PI / 2.8, 0)
            s = THREE.MathUtils.mapLinear(i, 0, temp_top_cubes.length, Math.PI / 3, 0)

            for (let b = 0; b < 2; b++) {

                let geo = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z)

                let cube_new = new THREE.Mesh(geo, material)
                cube_new.userData.i = i
                cube_new.userData.layer_length = temp_top_cubes.length
                cube_new.userData.layer = layer_counter
                cube_new.userData.is_cube = true
                cube_new.userData.cube_counter_i = cube_counter

                cube_new.position.y = box_size_y + box_size_x / 2




                cube_new.geometry.translate(box_size_x / 2, box_size_y / 2, 0)




                if (b == 0) {
                    cube_new.position.x = box_size_x * -1
                    // cube_new.rotation.z = s
                } else {
                    cube_new.position.x = box_size_x
                    cube_new.rotation.y = pi
                    // cube_new.rotation.z = s * 0.5
                }


                // cube_new.rotation.z = s ** 1.5 + 0.03
                cube_new.rotation.z = s
                cube_new.userData.z_rot = cube_new.rotation.z


                let coord = new THREE.AxesHelper(15);
                // cube_new.add(coord)

                top_cubes.push(cube_new)

                g.add(cube_new)


                cube_counter ++
            }

            // let c = new THREE.AxesHelper(15)
            // c.position.y = box_size_y
            // g.add(c)

            g.position.x = box_size_x / 2
            g.rotation.y = (pi / 3 - s) + pi / 10

                
            g.userData.y_rot = g.rotation.y

            g.userData.i = i
            g.userData.layer_length = temp_top_cubes.length



            top_cube.add(g)
        }

        layer_counter++
    }

    scene.add(first_cube)


    // Trunk
    let trunk_length = 7
    for (let i = 0; i < trunk_length; i++) {
        let geo = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z)
        geo.translate(0, box_size_y * -1 * i, 0)
        let cube_new = new THREE.Mesh(geo, material)
        // first_cube.add(cube_new)
    }




    first_cube.traverse(function (a) {
        if (a instanceof THREE.Group) {
            // a.userData.left = a.children[0].userData.layer
            // a.userData.right = a.children[1].userData.layer
            // a.userData.center = a.parent.userData.layer

            a.userData.left = a.children[0].userData.cube_counter_i
            a.userData.right = a.children[1].userData.cube_counter_i
            a.userData.center = a.parent.userData.cube_counter_i
        }
    })


    let instructions = []

    first_cube.traverse(function (a) {
        if (a instanceof THREE.Group) {

            let offest = 1.5

            let t_left = new SpriteText(a.userData.left, 10);
            t_left.color = "black"
            t_left.textHeight = 1
            t_left.position.set(offest * -1,box_size_y + offest,0)
            t_left.renderOrder = -1    
            t_left.depthTest = false
            a.add(t_left)

             let t_right = new SpriteText(a.userData.right, 10);
            t_right.color = "black"
            t_right.textHeight = 1
            t_right.position.set(offest ,box_size_y + offest ,0)
            t_right.renderOrder = -1    
            t_right.depthTest = false
            a.add(t_right)

            let t_center = new SpriteText(a.userData.center, 10);
            t_center.color = "black"
            t_center.textHeight = 1
             t_center.renderOrder = -1    
            t_center.depthTest = false
            t_center.position.set(0,box_size_y - offest,0)
            a.add(t_center)

            let y_rot_degrees = THREE.MathUtils.radToDeg(a.userData.y_rot )
            
            y_rot_degrees = Math.round(y_rot_degrees * 10)/ 10
            let t_y_rot = new SpriteText(y_rot_degrees, 10);
            t_y_rot.color = "black"
            t_y_rot.textHeight = 1
             t_y_rot.renderOrder = -1    
            t_y_rot.depthTest = false
            t_y_rot.position.set(0,box_size_y - 0.5,0)
            a.add(t_y_rot)

            let z_rot_degrees = THREE.MathUtils.radToDeg(a.children[0].userData.z_rot )
            z_rot_degrees = Math.round(z_rot_degrees * 10)/ 10
            let t_z_rot = new SpriteText(z_rot_degrees, 10);
            t_z_rot.color = "black"
            t_z_rot.textHeight = 1
            t_z_rot.renderOrder = -1    
            t_z_rot.depthTest = false
            t_z_rot.position.set(0,box_size_y + 0.5,0)
            a.add(t_z_rot)

            instructions.push({
                left: a.userData.left, 
                right: a.userData.right, 
                center: a.userData.center,
                angle: a.children[0].userData.z_rot
            })
        }
    })



    console.log(instructions)




    // const loader = new FontLoader();
    // // const font = loader.loadAsync('fonts/helvetiker_regular.typeface.json');
    // const font = loader.load('fonts/helvetiker_regular.typeface.json');
    // const t_g = new TextGeometry('Hello three.js!', {
    //     font: font,
    //     size: 80,
    //     depth: 5,
    //     curveSegments: 12
    // });

    // let t_mesh = new THREE.Mesh(t_g, material)
    // t_mesh.position.x = 2

    // scene.add(t_mesh)




    resizeCanvasToDisplaySize();





    function render(time) {

        time *= 0.001; // convert time to seconds


        controls.update(time);

        first_cube.traverse(function (a) {
            if (a instanceof THREE.Group) {
                let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, Math.PI / 2.8, 0)
                // let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, 0, Math.PI / 2.8)
                // a.rotation.y = (s ** gui_obj.y_exponent) * gui_obj.y_multiply + gui_obj.y_add

            }
            if (a.userData.is_cube) {
                let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, Math.PI / 2.8, 0)
                // a.rotation.z = (s ** gui_obj.z_exponent) * gui_obj.z_multiply + gui_obj.z_add

            }
        })

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
