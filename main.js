"use strict";
import * as THREE from 'three';
console.log('-----------------------------------------------------')
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm';

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

    gui.add(gui_obj, 'y_multiply', -5, 5).listen()
    gui.add(gui_obj, 'y_exponent', -10, 10).listen()
    gui.add(gui_obj, 'y_add', -2 * pi, pi * 2).listen()
    gui.add(gui_obj, 'z_multiply', -5, 5).listen()
    gui.add(gui_obj, 'z_exponent', -10, 10).listen()
    gui.add(gui_obj, 'z_add', -2 * pi, pi * 2).listen()





    const renderer = new THREE.WebGLRenderer(
        {
            canvas: document.querySelector("canvas"),
            antialias: true,
            preserveDrawingBuffer: true

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
    camera.position.z = 70
    camera.position.y = 40
    camera.position.x = 80

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

    let box_size_x = 1.3
    let box_size_y = 6;
    let box_size_z = 1.3;

    const geometry = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z);
    const material = new THREE.MeshStandardMaterial(); // greenish blue
    material.color.set(0.5, 0.5, 1)
    // material.transparent = true
    // material.opacity = 0.5

    let first_cube = new THREE.Mesh(geometry, material);

    first_cube.userData.branch_length = 1

    first_cube.geometry.translate(box_size_x / 2, box_size_y / 2, 0)



    first_cube.userData.h = 1

    const total_num_cubes = 2 ** 6

    let top_cubes = [first_cube]
    let cube_counter = 1

    let branch_counter = 0

    let prev_box_size_y = 6

    while (cube_counter < total_num_cubes) {

        let temp_top_cubes = top_cubes
        top_cubes = []

        for (let i = 0; i < temp_top_cubes.length; i++) {
            let top_cube = temp_top_cubes[i]

            let g = new THREE.Group()
            let s
            s = THREE.MathUtils.mapLinear(i, 0, temp_top_cubes.length, Math.PI / 2.8, 0)
            branch_counter++;
            console.log(cube_counter)

            
            if (cube_counter == 3) {
                box_size_y = 3
                console.log('here')
            }

            for (let b = 0; b < 2; b++) {


                let geo = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z)

                let cube_new = new THREE.Mesh(geo, material)
                cube_new.userData.i = i
                cube_new.userData.layer_length = temp_top_cubes.length
                cube_new.userData.is_cube = true


                // cube_new.position.y = box_size_y + box_size_x
                cube_new.position.y = prev_box_size_y + box_size_x




                cube_new.geometry.translate(box_size_x / 2, box_size_y / 2, 0)

                if (b == 0) {
                    cube_new.position.x = box_size_x * -1.2

                } else {
                    cube_new.position.x = box_size_x * 1.2

                    cube_new.rotation.y = pi
                }

                // cube_new.rotation.z = s ** 1.5 + 0.03



                let coord = new THREE.AxesHelper(15);
                // cube_new.add(coord)

                top_cubes.push(cube_new)
                g.add(cube_new)

                cube_counter = cube_counter + 1

            } // for (let b = 0; b < 2; b++) {

            
            g.position.x = box_size_x / 2

            // g.rotation.y = (pi / 3 - s) + pi / 10

            g.userData.i = i
            g.userData.layer_length = temp_top_cubes.length

            top_cube.add(g)

        } // (let i = 0; i < temp_top_cubes.length; i++) {

        prev_box_size_y = box_size_y

    }

    let trunk_length = 8
    let geo = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z)
    let trunk_cube = new THREE.Mesh(geo, material)
    for (let i = 0; i < trunk_length; i++) {
        let geo = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z)
        geo.translate(0, box_size_y * -1 * i, 0)
        let cube_new = new THREE.Mesh(geo, material)

        trunk_cube.add(cube_new)

    }

    trunk_cube.position.y = 20
    trunk_cube.rotation.z = pi / 2
    trunk_cube.position.x = (trunk_length * box_size_y) / 2 * -1
    // scene.add(trunk_cube)



    let ruler_z_length = 13
    let ruler_x_length = 11


    let ruler_x_geo = new THREE.BoxGeometry(box_size_x, box_size_y * ruler_z_length, box_size_z)
    let ruler_x = new THREE.Mesh(ruler_x_geo, material)
    scene.add(ruler_x)

    ruler_x.position.y = 30
    ruler_x.rotation.z = pi / 2
    ruler_x.rotation.y = pi / 2


    let ruler_y_geo = new THREE.BoxGeometry(box_size_x, box_size_y * ruler_x_length, box_size_z)
    let ruler_y = new THREE.Mesh(ruler_y_geo, material)

    ruler_y.position.y = 30
    ruler_y.rotation.z = pi / 2
    // ruler_x.rotation.y = pi/2
    scene.add(ruler_y)







    scene.add(first_cube)



    resizeCanvasToDisplaySize();

    function getCenterPoint(mesh) {
        var geometry = mesh.geometry;
        geometry.computeBoundingBox();
        var center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        mesh.localToWorld(center);
        return center;
    }


    let center_sphere_g = new THREE.SphereGeometry(2)
    let center_sphere = new THREE.Mesh(center_sphere_g, material)
    scene.add(center_sphere)



    gui_obj.z_multiply = 0.5
    gui_obj.y_add = 0.716283125018474


    // gui_obj = {


    //     y_multiply: 1.0,
    //     y_exponent: 1.0,
    //     y_add: 0,
    //     z_multiply: 1.0,
    //     z_exponent: 1.0,
    //     z_add: 0


    // }

    function render(time) {

        time *= 0.001; // convert time to seconds



        controls.update(time);
        var target = new THREE.Vector3();

        let centers = []
        first_cube.traverse(function (a) {

            if (a instanceof THREE.Group) {
                let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, Math.PI / 3, 0)
                // let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, 0, Math.PI / 3)

                // let s
                // if (a.userData.i < a.userData.layer_length/2){
                //     s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, 0, Math.PI / 3)
                // }else{
                //     s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, Math.PI / 3, 0)
                // }


                a.rotation.y = (s ** gui_obj.y_exponent) * gui_obj.y_multiply + gui_obj.y_add

            }
            if (a.userData.is_cube) {
                let s = THREE.MathUtils.mapLinear(
                    a.userData.i,
                    0,
                    a.userData.layer_length,
                    Math.PI / 2,
                    0
                )
                // let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, 0, Math.PI / 3)
                a.rotation.z = (s ** gui_obj.z_exponent) * gui_obj.z_multiply + gui_obj.z_add
                a.getWorldPosition(target)
                centers.push(getCenterPoint(a))
            }
        })

        var total = new THREE.Vector3(0, 0, 0);
        // console.log(total.x)
        for (let i = 0; i < centers.length; i++) {
            total.x += centers[i].x
            total.y += centers[i].y
            total.z += centers[i].z

        }
        total.x = total.x / centers.length
        total.y = total.y / centers.length
        total.z = total.z / centers.length
        // console.log(total)

        center_sphere.position.copy(total)


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
